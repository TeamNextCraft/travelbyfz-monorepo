import { destinations, tours } from "@repo/db/schema/domestic.ts";
import type { TourItinerary } from "@repo/types/domestic/tour";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { tourInsertSchema } from "#/lib/schema";

export const createTour = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(tourInsertSchema)
	.handler(async ({ data }) => {
		try {
			const [created] = await db
				.insert(tours)
				.values({
					...data,
					itinerary: data.itinerary as TourItinerary[] | null,
					bookingCount: 0,
				})
				.returning({ id: tours.id });

			return { id: created.id };
		} catch (err) {
			console.log("Error! creating tour", err);
			throw err;
		}
	});

export const getDashboardTours = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		try {
			const data = await db
				.select({
					id: tours.id,
					coverImage: tours.featuredImage,
					title: tours.title,
					code: tours.code,
					destination: destinations.name,
					category: tours.category,
					type: tours.type,
					durationNights: tours.durationNights,
					durationDays: tours.durationDays,
					avgRating: tours.avgRating,
					reviewCount: tours.reviewCount,
					bookingCount: tours.bookingCount,
					isFeatured: tours.isFeatured,
					isPublished: tours.isPublished,
					isActive: tours.isActive,
				})
				.from(tours)
				.leftJoin(destinations, eq(destinations.id, tours.destinationId));

			return data ?? null;
		} catch (error) {
			console.error("Error fetching tours: ", error);
			throw error;
		}
	});

export const getTourDetails = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			tourId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		try {
			const result = await db
				.select()
				.from(tours)
				.where(eq(tours.id, data.tourId))
				.get();

			return result ?? null;
		} catch (error) {
			console.error("Error fetching tours: ", error);
			throw error;
		}
	});

export const updateTour = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(tourInsertSchema.extend({ id: z.string() }))
	.handler(async ({ data: { id, ...values } }) => {
		try {
			const [updated] = await db
				.update(tours)
				.set({ ...values, updatedAt: new Date() })
				.where(eq(tours.id, id))
				.returning();
			return updated;
		} catch (error) {
			console.error("Error updating tour: ", id, error);
			throw error;
		}
	});

export const removeTour = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			tourId: z.string(),
		}),
	)
	.handler(async ({ data: { tourId } }) => {
		try {
			const result = await db
				.delete(tours)
				.where(eq(tours.id, tourId))
				.returning({ id: tours.id });

			return { ids: result.map((t) => t.id) };
		} catch (err) {
			console.error("Error deleting tour: ", tourId, err);
			throw err;
		}
	});
