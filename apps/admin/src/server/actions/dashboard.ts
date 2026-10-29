import { user } from "@repo/db/schema/auth.ts";
import {
	bookings,
	departures,
	destinations,
	payments,
	refunds,
	tours,
} from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import {
	and,
	asc,
	count,
	desc,
	eq,
	gte,
	inArray,
	lt,
	ne,
	sql,
	sum,
} from "drizzle-orm";
import { adminMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";

/** % change from `previous` to `current`, or null when there's nothing to compare. */
const percentChange = (current: number, previous: number) =>
	previous === 0
		? null
		: Math.round(((current - previous) / previous) * 1000) / 10;

export const getDashboard = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		const countBookings = async (from: Date, to?: Date) => {
			const [row] = await db
				.select({ n: count() })
				.from(bookings)
				.where(
					and(
						gte(bookings.bookedAt, from),
						to ? lt(bookings.bookedAt, to) : undefined,
						ne(bookings.status, "cancelled"),
					),
				);
			return row?.n ?? 0;
		};

		const sumPaid = async (from: Date, to?: Date) => {
			const [row] = await db
				.select({ total: sum(payments.amount) })
				.from(payments)
				.where(
					and(
						eq(payments.status, "paid"),
						gte(payments.paidAt, from),
						to ? lt(payments.paidAt, to) : undefined,
					),
				);
			return Number(row?.total ?? 0);
		};

		const [
			bookingsThisMonth,
			bookingsLastMonth,
			revenueThisMonth,
			revenueLastMonth,
			[toursRow],
			[outstandingRow],
			[pendingBookingsRow],
			[pendingUsersRow],
			[pendingRefundsRow],
			revenueRows,
			recentBookings,
			upcomingDepartures,
		] = await Promise.all([
			countBookings(monthStart),
			countBookings(lastMonthStart, monthStart),
			sumPaid(monthStart),
			sumPaid(lastMonthStart, monthStart),

			// Tours: live vs everything else
			db
				.select({
					active: sql<number>`sum(case when ${tours.isActive} = 1 and ${tours.isPublished} = 1 then 1 else 0 end)`,
					total: count(),
				})
				.from(tours),

			// Money still owed on live bookings
			db
				.select({ amount: sum(bookings.dueAmount), n: count() })
				.from(bookings)
				.where(
					and(
						inArray(bookings.status, ["pending", "confirmed"]),
						gte(bookings.dueAmount, 1),
					),
				),

			db
				.select({ n: count() })
				.from(bookings)
				.where(eq(bookings.status, "pending")),
			db.select({ n: count() }).from(user).where(eq(user.status, "pending")),
			db
				.select({ n: count(), amount: sum(refunds.amount) })
				.from(refunds)
				.where(eq(refunds.status, "pending")),

			// Revenue per month, last 6 months. Timestamps are stored as unix seconds.
			db
				.select({
					month: sql<string>`strftime('%Y-%m', ${payments.paidAt}, 'unixepoch')`,
					total: sum(payments.amount),
				})
				.from(payments)
				.where(
					and(eq(payments.status, "paid"), gte(payments.paidAt, sixMonthsAgo)),
				)
				.groupBy(sql`strftime('%Y-%m', ${payments.paidAt}, 'unixepoch')`),

			db
				.select({
					id: bookings.id,
					bookingRef: bookings.bookingRef,
					contactName: bookings.contactName,
					status: bookings.status,
					totalAmount: bookings.totalAmount,
					travellers: sql<number>`${bookings.adultCount} + ${bookings.childCount}`,
					tourTitle: tours.title,
					departureStart: departures.startDate,
				})
				.from(bookings)
				.innerJoin(tours, eq(tours.id, bookings.tourId))
				.innerJoin(departures, eq(departures.id, bookings.departureId))
				.orderBy(desc(bookings.bookedAt))
				.limit(6),

			db
				.select({
					id: departures.id,
					tourId: departures.tourId,
					tourTitle: tours.title,
					startDate: departures.startDate,
					totalSeats: departures.totalSeats,
					availableSeats: departures.availableSeats,
					destinationName: destinations.name,
					destinationState: destinations.state,
				})
				.from(departures)
				.innerJoin(tours, eq(tours.id, departures.tourId))
				.leftJoin(destinations, eq(destinations.id, tours.destinationId))
				.where(
					and(
						gte(departures.startDate, today),
						eq(departures.isActive, true),
						ne(departures.status, "cancelled"),
					),
				)
				.orderBy(asc(departures.startDate))
				.limit(4),
		]);

		// Build a gap-free 6-month series (months with no payments show as 0)
		const byMonth = new Map(
			revenueRows.map((r) => [r.month, Number(r.total ?? 0)]),
		);
		const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
			const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			return {
				month: key,
				label: d.toLocaleDateString("en-IN", { month: "short" }),
				revenue: byMonth.get(key) ?? 0,
			};
		});

		const activeTours = Number(toursRow?.active ?? 0);

		return {
			stats: {
				bookingsThisMonth,
				bookingsChange: percentChange(bookingsThisMonth, bookingsLastMonth),
				revenueThisMonth,
				revenueChange: percentChange(revenueThisMonth, revenueLastMonth),
				activeTours,
				draftTours: (toursRow?.total ?? 0) - activeTours,
				outstandingAmount: Number(outstandingRow?.amount ?? 0),
				outstandingBookings: outstandingRow?.n ?? 0,
			},
			attention: {
				pendingBookings: pendingBookingsRow?.n ?? 0,
				pendingUsers: pendingUsersRow?.n ?? 0,
				pendingRefunds: pendingRefundsRow?.n ?? 0,
				pendingRefundAmount: Number(pendingRefundsRow?.amount ?? 0),
			},
			revenueByMonth,
			recentBookings,
			upcomingDepartures: upcomingDepartures.map((d) => ({
				id: d.id,
				tourId: d.tourId,
				tourTitle: d.tourTitle,
				startDate: d.startDate,
				totalSeats: d.totalSeats,
				availableSeats: d.availableSeats,
				destination: d.destinationName
					? `${d.destinationName}${d.destinationState ? `, ${d.destinationState}` : ""}`
					: null,
			})),
		};
	});
