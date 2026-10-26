import { destinations } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { destinationInsertSchema } from "#/lib/schema/destinations";

export const createDestination = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
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
	.middleware([authMiddleware])
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
	.middleware([authMiddleware])
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
			console.error("Error updating destination: ", id, error);
			throw error;
		}
	});
