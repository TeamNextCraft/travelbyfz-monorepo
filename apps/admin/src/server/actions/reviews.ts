import { user } from "@repo/db/schema/auth.ts";
import { bookings, reviewStatuses, reviews, tours } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";

export type ReviewStatus = (typeof reviewStatuses)[number];
const listReviewsSchema = z.object({
	page: z.number().int().min(1).default(1),
	pageSize: z.number().int().min(1).max(100).default(20),
	q: z.string().trim().max(200).optional(),
	status: z.enum(reviewStatuses).optional(),
	rating: z.number().int().min(1).max(5).optional(),
	featured: z.enum(["all", "yes", "no"]).default("all"),
	verified: z.enum(["all", "yes", "no"]).default("all"),
});

function buildReviewWhere(data: z.infer<typeof listReviewsSchema>) {
	const term = data.q?.trim();
	return and(
		data.status ? eq(reviews.status, data.status) : undefined,
		data.rating ? eq(reviews.rating, data.rating) : undefined,
		data.featured === "all"
			? undefined
			: eq(reviews.isFeatured, data.featured === "yes"),
		data.verified === "all"
			? undefined
			: eq(reviews.isVerified, data.verified === "yes"),
		term
			? or(
					like(reviews.title, `%${term}%`),
					like(reviews.comment, `%${term}%`),
					like(tours.title, `%${term}%`),
					like(user.name, `%${term}%`),
					like(user.email, `%${term}%`),
					like(bookings.bookingRef, `%${term}%`),
				)
			: undefined,
	);
}

export const getDashboardReviews = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(listReviewsSchema)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const where = buildReviewWhere(data);

		const rows = await db
			.select({
				id: reviews.id,
				bookingId: reviews.bookingId,
				tourId: reviews.tourId,
				userId: reviews.userId,
				rating: reviews.rating,
				title: reviews.title,
				comment: reviews.comment,
				status: reviews.status,
				isVerified: reviews.isVerified,
				isFeatured: reviews.isFeatured,
				submittedAt: reviews.submittedAt,
				approvedAt: reviews.approvedAt,
				tourTitle: tours.title,
				reviewerName: user.name,
				reviewerEmail: user.email,
				reviewerImage: user.image,
				bookingRef: bookings.bookingRef,
			})
			.from(reviews)
			.innerJoin(tours, eq(tours.id, reviews.tourId))
			.leftJoin(user, eq(user.id, reviews.userId))
			.leftJoin(bookings, eq(bookings.id, reviews.bookingId))
			.where(where)
			.orderBy(desc(reviews.submittedAt), desc(reviews.id))
			.limit(data.pageSize)
			.offset((data.page - 1) * data.pageSize);

		const [totalResult] = await db
			.select({ total: count() })
			.from(reviews)
			.innerJoin(tours, eq(tours.id, reviews.tourId))
			.leftJoin(user, eq(user.id, reviews.userId))
			.leftJoin(bookings, eq(bookings.id, reviews.bookingId))
			.where(where);

		return {
			rows,
			total: totalResult?.total ?? 0,
			page: data.page,
			pageSize: data.pageSize,
		};
	});

export const getReviewStats = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const { db } = await import("#/lib/db-config");
		const [totals] = await db
			.select({
				total: count(),
				pending: sql<number>`coalesce(sum(case when ${reviews.status} = 'pending' then 1 else 0 end), 0)`,
				approved: sql<number>`coalesce(sum(case when ${reviews.status} = 'approved' then 1 else 0 end), 0)`,
				rejected: sql<number>`coalesce(sum(case when ${reviews.status} = 'rejected' then 1 else 0 end), 0)`,
				featured: sql<number>`coalesce(sum(case when ${reviews.isFeatured} = 1 then 1 else 0 end), 0)`,
			})
			.from(reviews);

		return {
			total: Number(totals?.total ?? 0),
			pending: Number(totals?.pending ?? 0),
			approved: Number(totals?.approved ?? 0),
			rejected: Number(totals?.rejected ?? 0),
			featured: Number(totals?.featured ?? 0),
		};
	});

export const updateReviewStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({ reviewId: z.string().min(1), status: z.enum(reviewStatuses) }),
	)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const [updated] = await db
			.update(reviews)
			.set({
				status: data.status,
				approvedAt: data.status === "approved" ? new Date() : null,
			})
			.where(eq(reviews.id, data.reviewId))
			.returning({ id: reviews.id });

		if (!updated) throw new Error("Review not found");
		return { success: true, id: updated.id };
	});

export const setReviewFeatured = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(z.object({ reviewId: z.string().min(1), isFeatured: z.boolean() }))
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const [updated] = await db
			.update(reviews)
			.set({ isFeatured: data.isFeatured })
			.where(eq(reviews.id, data.reviewId))
			.returning({ id: reviews.id });

		if (!updated) throw new Error("Review not found");
		return { success: true, id: updated.id };
	});
