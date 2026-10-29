import {
	bookings,
	payments,
	refunds,
	tours,
} from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";

const PAGE_SIZE = 20;
export const refundStatuses = ["pending", "processed", "failed"] as const;
export type RefundStatus = (typeof refundStatuses)[number];

const listRefundsSchema = z.object({
	page: z.number().int().min(1).default(1),
	q: z.string().trim().max(200).optional(),
	status: z.enum(refundStatuses).optional(),
});

export const getRefunds = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(listRefundsSchema)
	.handler(async ({ data }) => {
		// Load the Cloudflare-backed database only inside the server handler.
		const { db } = await import("#/lib/db-config");
		const term = data.q?.trim();
		const where = and(
			data.status ? eq(refunds.status, data.status) : undefined,
			term
				? or(
						like(refunds.id, `%${term}%`),
						like(refunds.reason, `%${term}%`),
						like(refunds.providerRefundId, `%${term}%`),
						like(bookings.bookingRef, `%${term}%`),
						like(bookings.contactName, `%${term}%`),
						like(bookings.contactEmail, `%${term}%`),
						like(tours.title, `%${term}%`),
					)
				: undefined,
		);

		const rows = await db
			.select({
				id: refunds.id,
				bookingId: refunds.bookingId,
				paymentId: refunds.paymentId,
				amount: refunds.amount,
				reason: refunds.reason,
				status: refunds.status,
				processedAt: refunds.processedAt,
				providerRefundId: refunds.providerRefundId,
				createdAt: refunds.createdAt,
				bookingRef: bookings.bookingRef,
				contactName: bookings.contactName,
				contactEmail: bookings.contactEmail,
				tourTitle: tours.title,
				paymentStatus: payments.status,
				paymentMethod: payments.method,
				provider: payments.provider,
				currency: payments.currency,
			})
			.from(refunds)
			.innerJoin(bookings, eq(bookings.id, refunds.bookingId))
			.innerJoin(tours, eq(tours.id, bookings.tourId))
			.leftJoin(payments, eq(payments.id, refunds.paymentId))
			.where(where)
			.orderBy(desc(refunds.createdAt))
			.limit(PAGE_SIZE)
			.offset((data.page - 1) * PAGE_SIZE);

		const [totalRow] = await db
			.select({ total: count() })
			.from(refunds)
			.innerJoin(bookings, eq(bookings.id, refunds.bookingId))
			.innerJoin(tours, eq(tours.id, bookings.tourId))
			.leftJoin(payments, eq(payments.id, refunds.paymentId))
			.where(where);

		return {
			rows,
			total: totalRow?.total ?? 0,
			page: data.page,
			pageSize: PAGE_SIZE,
		};
	});

export const getRefundStats = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const { db } = await import("#/lib/db-config");

		const [stats] = await db
			.select({
				total: count(),
				pendingCount: sql<number>`coalesce(sum(case when ${refunds.status} = 'pending' then 1 else 0 end), 0)`,
				pendingAmount: sql<number>`coalesce(sum(case when ${refunds.status} = 'pending' then ${refunds.amount} else 0 end), 0)`,
				processedCount: sql<number>`coalesce(sum(case when ${refunds.status} = 'processed' then 1 else 0 end), 0)`,
				processedAmount: sql<number>`coalesce(sum(case when ${refunds.status} = 'processed' then ${refunds.amount} else 0 end), 0)`,
				failedCount: sql<number>`coalesce(sum(case when ${refunds.status} = 'failed' then 1 else 0 end), 0)`,
			})
			.from(refunds);

		return {
			total: Number(stats?.total ?? 0),
			pendingCount: Number(stats?.pendingCount ?? 0),
			pendingAmount: Number(stats?.pendingAmount ?? 0),
			processedCount: Number(stats?.processedCount ?? 0),
			processedAmount: Number(stats?.processedAmount ?? 0),
			failedCount: Number(stats?.failedCount ?? 0),
		};
	});

export const updateRefundStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			id: z.string().min(1),
			status: z.enum(["processed", "failed"]),
		}),
	)
	.handler(async ({ data }) => {
		const { db } = await import("#/lib/db-config");

		const [existing] = await db
			.select({ id: refunds.id, status: refunds.status })
			.from(refunds)
			.where(eq(refunds.id, data.id))
			.limit(1);

		if (!existing) throw new Error("Refund not found");
		if (existing.status !== "pending") {
			throw new Error("Only pending refunds can be updated");
		}

		// Guard the update against concurrent changes. This records an administrative
		// status only; it does not call a payment provider or move money.
		const [updated] = await db
			.update(refunds)
			.set({
				status: data.status,
				processedAt: data.status === "processed" ? new Date() : null,
			})
			.where(and(eq(refunds.id, data.id), eq(refunds.status, "pending")))
			.returning({ id: refunds.id });

		if (!updated)
			throw new Error("Refund status changed before this update completed");
		return { success: true, id: updated.id, status: data.status };
	});
