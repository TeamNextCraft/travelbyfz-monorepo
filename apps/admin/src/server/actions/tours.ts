import { tours } from "@repo/db/schema/domestic.ts";
import type { TourItinerary } from "@repo/types/domestic/tour";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { tourInsertSchema } from "#/lib/schema";

export const createTour = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
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
