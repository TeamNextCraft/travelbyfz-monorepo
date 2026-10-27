import { departurePricing, departures } from "@repo/db/schema/domestic.js";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq, min } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { departureInsertSchema } from "#/lib/schema/departures";

export const getDeparture = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const [departure] = await db
			.select()
			.from(departures)
			.where(eq(departures.id, data.id));
		if (!departure) return null;

		const pricing = await db
			.select({
				roomType: departurePricing.roomType,
				price: departurePricing.price,
				compareAtPrice: departurePricing.compareAtPrice,
			})
			.from(departurePricing)
			.where(eq(departurePricing.departureId, data.id));

		return { ...departure, pricing };
	});

export const createDeparture = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(departureInsertSchema)
	.handler(async ({ data: { pricing, ...departure } }) => {
		const id = crypto.randomUUID();
		await db.batch([
			db.insert(departures).values({ id, ...departure }),
			db.insert(departurePricing).values(
				pricing.map((p) => ({
					departureId: id,
					roomType: p.roomType,
					price: p.price,
					compareAtPrice: p.compareAtPrice ?? null,
				})),
			),
		]);
		return { id };
	});

export const updateDeparture = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string() }).and(departureInsertSchema))
	.handler(async ({ data: { id, pricing, ...departure } }) => {
		await db.batch([
			db
				.update(departures)
				.set({ ...departure, updatedAt: new Date() })
				.where(eq(departures.id, id)),
			db.delete(departurePricing).where(eq(departurePricing.departureId, id)),
			db.insert(departurePricing).values(
				pricing.map((p) => ({
					departureId: id,
					roomType: p.roomType,
					price: p.price,
					compareAtPrice: p.compareAtPrice ?? null,
				})),
			),
		]);
	});

export const getTourDepartures = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(z.object({ tourId: z.string() }))
	.handler(async ({ data }) => {
		return db
			.select({
				id: departures.id,
				code: departures.code,
				startDate: departures.startDate,
				endDate: departures.endDate,
				totalSeats: departures.totalSeats,
				availableSeats: departures.availableSeats,
				status: departures.status,
				isGuaranteed: departures.isGuaranteed,
				isActive: departures.isActive,
				fromPrice: min(departurePricing.price), // cheapest room price, or null
			})
			.from(departures)
			.leftJoin(
				departurePricing,
				eq(departurePricing.departureId, departures.id),
			)
			.where(eq(departures.tourId, data.tourId))
			.groupBy(departures.id)
			.orderBy(asc(departures.startDate));
	});
