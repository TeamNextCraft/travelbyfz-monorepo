import {
	bookings,
	bookingTravellers,
	departures,
	tours,
} from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, like, ne, or, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";

const PAGE_SIZE = 20;

/* ---------------------------- list ---------------------------- */

const listInput = z.object({
	page: z.number().int().min(1).default(1),
	q: z.string().optional(),
	status: z.string().optional(),
	paymentStatus: z.string().optional(),
	source: z.string().optional(),
});

export const getBookings = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(listInput)
	.handler(async ({ data }) => {
		const term = data.q?.trim();
		const where = and(
			data.status ? eq(bookings.status, data.status as never) : undefined,
			data.paymentStatus
				? eq(bookings.paymentStatus, data.paymentStatus as never)
				: undefined,
			data.source ? eq(bookings.source, data.source) : undefined,
			term
				? or(
						like(bookings.bookingRef, `%${term}%`),
						like(bookings.contactName, `%${term}%`),
						like(bookings.contactEmail, `%${term}%`),
						like(bookings.contactPhone, `%${term}%`),
					)
				: undefined,
		);

		const rows = await db
			.select({
				id: bookings.id,
				bookingRef: bookings.bookingRef,
				bookedAt: bookings.bookedAt,
				source: bookings.source,
				status: bookings.status,
				paymentStatus: bookings.paymentStatus,
				contactName: bookings.contactName,
				contactPhone: bookings.contactPhone,
				adultCount: bookings.adultCount,
				childCount: bookings.childCount,
				totalAmount: bookings.totalAmount,
				dueAmount: bookings.dueAmount,
				tourTitle: tours.title,
				departureCode: departures.code,
				departureStart: departures.startDate,
			})
			.from(bookings)
			.innerJoin(tours, eq(tours.id, bookings.tourId))
			.innerJoin(departures, eq(departures.id, bookings.departureId))
			.where(where)
			.orderBy(desc(bookings.bookedAt))
			.limit(PAGE_SIZE)
			.offset((data.page - 1) * PAGE_SIZE);

		const [{ total }] = await db
			.select({ total: count() })
			.from(bookings)
			.where(where);

		return { rows, total, page: data.page, pageSize: PAGE_SIZE };
	});

/* ---------------------------- stats ---------------------------- */

export const getBookingStats = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
		const byStatus = await db
			.select({ status: bookings.status, n: count() })
			.from(bookings)
			.groupBy(bookings.status);

		const [money] = await db
			.select({
				collected: sum(bookings.paidAmount),
				outstanding: sum(bookings.dueAmount),
			})
			.from(bookings)
			.where(ne(bookings.status, "cancelled"));

		return {
			total: byStatus.reduce((acc, r) => acc + r.n, 0),
			pending: byStatus.find((r) => r.status === "pending")?.n ?? 0,
			collected: Number(money?.collected ?? 0),
			outstanding: Number(money?.outstanding ?? 0),
		};
	});

/* ---------------------------- details ---------------------------- */

export const getBookingDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const [booking] = await db
			.select()
			.from(bookings)
			.where(eq(bookings.id, data.id));
		if (!booking) throw new Error("Booking not found");

		const [tour] = await db
			.select({ id: tours.id, title: tours.title, slug: tours.slug })
			.from(tours)
			.where(eq(tours.id, booking.tourId));

		const [departure] = await db
			.select({
				id: departures.id,
				code: departures.code,
				startDate: departures.startDate,
				endDate: departures.endDate,
			})
			.from(departures)
			.where(eq(departures.id, booking.departureId));

		const travellers = await db
			.select()
			.from(bookingTravellers)
			.where(eq(bookingTravellers.bookingId, booking.id))
			.orderBy(desc(bookingTravellers.isPrimary));

		return { booking, tour, departure, travellers };
	});

/* ---------------------------- mutations ---------------------------- */

export const updateBookingNotes = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string(), internalNotes: z.string().max(5000) }))
	.handler(async ({ data }) => {
		await db
			.update(bookings)
			.set({
				internalNotes: data.internalNotes.trim() || null,
				updatedAt: new Date(),
			})
			.where(eq(bookings.id, data.id));
	});

export const updateBookingStatus = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			id: z.string(),
			status: z.enum(["confirmed", "completed", "cancelled"]),
			cancellationReason: z.string().max(1000).optional(),
		}),
	)
	.handler(async ({ data }) => {
		const [booking] = await db
			.select()
			.from(bookings)
			.where(eq(bookings.id, data.id));
		if (!booking) throw new Error("Booking not found");

		// Only allow sensible transitions
		const allowed: Record<string, string[]> = {
			pending: ["confirmed", "cancelled"],
			confirmed: ["completed", "cancelled"],
		};
		if (!allowed[booking.status]?.includes(data.status)) {
			throw new Error(
				`Can't change a ${booking.status} booking to ${data.status}`,
			);
		}

		const now = new Date();
		const update = db
			.update(bookings)
			.set({
				status: data.status,
				updatedAt: now,
				...(data.status === "confirmed" && { confirmedAt: now }),
				...(data.status === "completed" && { completedAt: now }),
				...(data.status === "cancelled" && {
					cancelledAt: now,
					cancellationReason: data.cancellationReason ?? null,
				}),
			})
			.where(eq(bookings.id, data.id));

		if (data.status === "cancelled") {
			// Release the seats back to the departure, in the same batch.
			const seats = booking.adultCount + booking.childCount;
			await db.batch([
				update,
				db
					.update(departures)
					.set({
						availableSeats: sql`min(${departures.totalSeats}, ${departures.availableSeats} + ${seats})`,
						updatedAt: now,
					})
					.where(eq(departures.id, booking.departureId)),
			]);
		} else {
			await update;
		}
	});
