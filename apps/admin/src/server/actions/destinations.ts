import { destinations } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { destinationInsertSchema } from "#/lib/schema/destinations";

export const getDashboardDestinations = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		try {
			const data = await db
				.select({
					id: destinations.id,
					name: destinations.name,
					coverImage: destinations.coverImage,
					slug: destinations.slug,
					state: destinations.state,
					country: destinations.country,
					region: destinations.region,
					tourCount: destinations.tourCount,
					isActive: destinations.isActive,
					isFeatured: destinations.isFeatured,
				})
				.from(destinations);

			return data ?? null;
		} catch (error) {
			console.error("Error fetching tours: ", error);
			throw error;
		}
	});

export const createDestination = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(destinationInsertSchema)
	.handler(async ({ data }) => {
		try {
			const [created] = await db
				.insert(destinations)
				.values({
					...data,
				})
				.returning({ id: destinations.id });

			return { id: created.id };
		} catch (err) {
			console.log("Error! creating destination: ", err);
			throw err;
		}
	});

export const getDestinationDetails = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			destinationId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		try {
			const result = await db
				.select()
				.from(destinations)
				.where(eq(destinations.id, data.destinationId))
				.get();

			return result ?? null;
		} catch (error) {
			console.error("Error fetching tours: ", error);
			throw error;
		}
	});

export const updateDestination = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(destinationInsertSchema.extend({ id: z.string() }))
	.handler(async ({ data: { id, ...values } }) => {
		try {
			const [updated] = await db
				.update(destinations)
				.set({ ...values, updatedAt: new Date() })
				.where(eq(destinations.id, id))
				.returning();
			return updated;
		} catch (error) {
			console.error("error updating destination: ", id, error);
			throw error;
		}
	});

export const removeDestination = createServerFn({ method: "POST" })
	.validator(
		z.object({
			destinationId: z.string(),
		}),
	)
	.handler(async ({ data: { destinationId } }) => {
		try {
			const result = await db
				.delete(destinations)
				.where(eq(destinations.id, destinationId))
				.returning({ id: destinations.id });

			return { ids: result.map((d) => d.id) };
		} catch (error) {
			console.error("error deleting destination: ", destinationId, error);
			throw error;
		}
	});
