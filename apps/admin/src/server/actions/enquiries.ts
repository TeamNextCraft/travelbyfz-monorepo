import { user } from "@repo/db/schema/auth.ts";
import { enquiries, enquiryStatuses, tours } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import {
	and,
	asc,
	count,
	desc,
	eq,
	gte,
	isNotNull,
	like,
	lte,
	ne,
	or,
	type SQL,
	sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";

export type EnquiryStatus = (typeof enquiryStatuses)[number];

const customerUser = alias(user, "enquiry_customer");
const assignedUser = alias(user, "enquiry_assigned_user");

const listEnquiriesSchema = z.object({
	page: z.number().int().min(1).default(1),
	pageSize: z.number().int().min(1).max(100).default(20),
	q: z.string().trim().max(200).optional(),
	status: z.enum(enquiryStatuses).optional(),
	source: z.string().trim().max(100).optional(),
	assignment: z.enum(["all", "assigned", "unassigned"]).default("all"),
	groupSize: z.enum(["all", "1-2", "3-5", "6+"]).default("all"),
	sortBy: z
		.enum(["newest", "oldest", "budget-high", "budget-low"])
		.default("newest"),
});

function buildEnquiryWhere(data: z.infer<typeof listEnquiriesSchema>) {
	const term = data.q?.trim();
	let groupSizeCondition: SQL<unknown> | undefined;

	switch (data.groupSize) {
		case "1-2":
			groupSizeCondition = and(
				isNotNull(enquiries.groupSize),
				gte(enquiries.groupSize, 1),
				lte(enquiries.groupSize, 2),
			);
			break;
		case "3-5":
			groupSizeCondition = and(
				isNotNull(enquiries.groupSize),
				gte(enquiries.groupSize, 3),
				lte(enquiries.groupSize, 5),
			);
			break;
		case "6+":
			groupSizeCondition = gte(enquiries.groupSize, 6);
			break;
		default:
			groupSizeCondition = undefined;
	}

	return and(
		data.status ? eq(enquiries.status, data.status) : undefined,
		data.source ? eq(enquiries.source, data.source) : undefined,
		data.assignment === "assigned"
			? isNotNull(enquiries.assignedTo)
			: data.assignment === "unassigned"
				? sql`${enquiries.assignedTo} is null`
				: undefined,
		groupSizeCondition,
		term
			? or(
					like(enquiries.name, `%${term}%`),
					like(enquiries.email, `%${term}%`),
					like(enquiries.phone, `%${term}%`),
					like(enquiries.city, `%${term}%`),
					like(enquiries.subject, `%${term}%`),
					like(enquiries.message, `%${term}%`),
					like(enquiries.travelMonth, `%${term}%`),
					like(enquiries.source, `%${term}%`),
					like(tours.title, `%${term}%`),
					like(customerUser.name, `%${term}%`),
					like(customerUser.email, `%${term}%`),
					like(assignedUser.name, `%${term}%`),
				)
			: undefined,
	);
}

export const getDashboardEnquiries = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(listEnquiriesSchema)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const where = buildEnquiryWhere(data);

		let orderBy: SQL<unknown>[];
		switch (data.sortBy) {
			case "oldest":
				orderBy = [asc(enquiries.createdAt), asc(enquiries.id)];
				break;
			case "budget-high":
				orderBy = [
					desc(
						sql`coalesce(${enquiries.budgetMax}, ${enquiries.budgetMin}, 0)`,
					),
					desc(enquiries.createdAt),
				];
				break;
			case "budget-low":
				orderBy = [
					asc(sql`coalesce(${enquiries.budgetMin}, ${enquiries.budgetMax}, 0)`),
					desc(enquiries.createdAt),
				];
				break;
			default:
				orderBy = [desc(enquiries.createdAt), desc(enquiries.id)];
		}

		const rows = await db
			.select({
				id: enquiries.id,
				userId: enquiries.userId,
				tourId: enquiries.tourId,
				departureId: enquiries.departureId,
				name: enquiries.name,
				email: enquiries.email,
				phone: enquiries.phone,
				city: enquiries.city,
				subject: enquiries.subject,
				message: enquiries.message,
				travelMonth: enquiries.travelMonth,
				groupSize: enquiries.groupSize,
				budgetMin: enquiries.budgetMin,
				budgetMax: enquiries.budgetMax,
				status: enquiries.status,
				assignedTo: enquiries.assignedTo,
				source: enquiries.source,
				notes: enquiries.notes,
				createdAt: enquiries.createdAt,
				updatedAt: enquiries.updatedAt,
				tourTitle: tours.title,
				tourSlug: tours.slug,
				accountName: customerUser.name,
				accountEmail: customerUser.email,
				assignedName: assignedUser.name,
				assignedEmail: assignedUser.email,
			})
			.from(enquiries)
			.leftJoin(tours, eq(tours.id, enquiries.tourId))
			.leftJoin(customerUser, eq(customerUser.id, enquiries.userId))
			.leftJoin(assignedUser, eq(assignedUser.id, enquiries.assignedTo))
			.where(where)
			.orderBy(...orderBy)
			.limit(data.pageSize)
			.offset((data.page - 1) * data.pageSize);

		const [totalResult] = await db
			.select({ total: count() })
			.from(enquiries)
			.leftJoin(tours, eq(tours.id, enquiries.tourId))
			.leftJoin(customerUser, eq(customerUser.id, enquiries.userId))
			.leftJoin(assignedUser, eq(assignedUser.id, enquiries.assignedTo))
			.where(where);

		return {
			rows,
			total: totalResult?.total ?? 0,
			page: data.page,
			pageSize: data.pageSize,
		};
	});

export const getEnquiryStats = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const { db } = await import("#/lib/db-config");
		const [totals] = await db
			.select({
				total: count(),
				new: sql<number>`coalesce(sum(case when ${enquiries.status} = 'new' then 1 else 0 end), 0)`,
				contacted: sql<number>`coalesce(sum(case when ${enquiries.status} = 'contacted' then 1 else 0 end), 0)`,
				qualified: sql<number>`coalesce(sum(case when ${enquiries.status} = 'qualified' then 1 else 0 end), 0)`,
				converted: sql<number>`coalesce(sum(case when ${enquiries.status} = 'converted' then 1 else 0 end), 0)`,
				unassigned: sql<number>`coalesce(sum(case when ${enquiries.assignedTo} is null then 1 else 0 end), 0)`,
			})
			.from(enquiries);

		const sourceRows = await db
			.selectDistinct({ source: enquiries.source })
			.from(enquiries)
			.orderBy(asc(enquiries.source));

		return {
			total: Number(totals?.total ?? 0),
			new: Number(totals?.new ?? 0),
			contacted: Number(totals?.contacted ?? 0),
			qualified: Number(totals?.qualified ?? 0),
			converted: Number(totals?.converted ?? 0),
			unassigned: Number(totals?.unassigned ?? 0),
			sources: sourceRows.map((row) => row.source).filter(Boolean),
		};
	});

export const getEnquiryAssignees = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const { db } = await import("#/lib/db-config");
		return db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			})
			.from(user)
			.where(and(eq(user.isActive, true), ne(user.role, "customer")))
			.orderBy(asc(user.name));
	});

export const updateEnquiryStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({ enquiryId: z.string().min(1), status: z.enum(enquiryStatuses) }),
	)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const [updated] = await db
			.update(enquiries)
			.set({ status: data.status, updatedAt: new Date() })
			.where(eq(enquiries.id, data.enquiryId))
			.returning({ id: enquiries.id });

		if (!updated) throw new Error("Enquiry not found");
		return { success: true, id: updated.id };
	});

export const updateEnquiryAssignment = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			enquiryId: z.string().min(1),
			assignedTo: z.string().min(1).nullable(),
		}),
	)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");

		if (data.assignedTo) {
			const [assignee] = await db
				.select({ id: user.id })
				.from(user)
				.where(
					and(
						eq(user.id, data.assignedTo),
						eq(user.isActive, true),
						ne(user.role, "customer"),
					),
				)
				.limit(1);
			if (!assignee) throw new Error("Selected assignee is unavailable");
		}

		const [updated] = await db
			.update(enquiries)
			.set({ assignedTo: data.assignedTo, updatedAt: new Date() })
			.where(eq(enquiries.id, data.enquiryId))
			.returning({ id: enquiries.id });

		if (!updated) throw new Error("Enquiry not found");
		return { success: true, id: updated.id };
	});

export const updateEnquiryNotes = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			enquiryId: z.string().min(1),
			notes: z.string().max(5000).nullable(),
		}),
	)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");
		const [updated] = await db
			.update(enquiries)
			.set({ notes: data.notes?.trim() || null, updatedAt: new Date() })
			.where(eq(enquiries.id, data.enquiryId))
			.returning({ id: enquiries.id });

		if (!updated) throw new Error("Enquiry not found");
		return { success: true, id: updated.id };
	});
