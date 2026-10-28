import {
	bookings,
	paymentMethods,
	paymentStatuses,
	payments,
	tours,
} from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, count, desc, eq, gte, like, or, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { auth } from "#/lib/auth";
import { adminMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";

const PAGE_SIZE = 20;

/** Safe columns: everything except the signature. */
const paymentColumns = {
	id: payments.id,
	bookingId: payments.bookingId,
	amount: payments.amount,
	currency: payments.currency,
	status: payments.status,
	method: payments.method,
	provider: payments.provider,
	providerOrderId: payments.providerOrderId,
	providerPaymentId: payments.providerPaymentId,
	hasSignature: sql<boolean>`${payments.providerSignature} is not null`,
	paymentDueAt: payments.paymentDueAt,
	paymentFailedAt: payments.paymentFailedAt,
	expiresAt: payments.expiresAt,
	paidAt: payments.paidAt,
	notes: payments.notes,
	createdAt: payments.createdAt,
	updatedAt: payments.updatedAt,
};

async function requireAdmin() {
	const s = await auth.api.getSession({ headers: getRequestHeaders() });
	if (!s?.user || (s.user as { role?: string }).role !== "admin") {
		throw new Error("Forbidden");
	}
	return s.user;
}

/* ----------------- keep the booking totals in sync ----------------- */

const paidSumFor = (bookingId: string) => sql`(
	select coalesce(sum(${payments.amount}), 0)
	from ${payments}
	where ${payments.bookingId} = ${bookingId} and ${payments.status} = 'paid'
)`;

/**
 * ⚠️ 'partial' must be a value in your `paymentStatuses` enum. If you call it
 * something else (e.g. 'partially_paid'), change it in the CASE below.
 */
const recalcBooking = (bookingId: string) =>
	db
		.update(bookings)
		.set({
			paidAmount: sql`${paidSumFor(bookingId)}`,
			dueAmount: sql`max(0, ${bookings.totalAmount} - ${paidSumFor(bookingId)})`,
			paymentStatus: sql`case
				when ${paidSumFor(bookingId)} = 0 then 'pending'
				when ${paidSumFor(bookingId)} >= ${bookings.totalAmount} then 'paid'
				else 'partial'
			end`,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(bookings.id, bookingId),
				sql`${bookings.paymentStatus} != 'refunded'`,
			),
		);

/* ---------------------------- list ---------------------------- */

export const getPayments = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			page: z.number().int().min(1).default(1),
			q: z.string().optional(),
			status: z.enum(paymentStatuses).optional(),
			method: z.enum(paymentMethods).optional(),
			provider: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		await requireAdmin();

		const term = data.q?.trim();
		const where = and(
			data.status ? eq(payments.status, data.status) : undefined,
			data.method ? eq(payments.method, data.method) : undefined,
			data.provider ? eq(payments.provider, data.provider) : undefined,
			term
				? or(
						like(bookings.bookingRef, `%${term}%`),
						like(bookings.contactName, `%${term}%`),
						like(bookings.contactEmail, `%${term}%`),
						like(payments.providerOrderId, `%${term}%`),
						like(payments.providerPaymentId, `%${term}%`),
					)
				: undefined,
		);

		const rows = await db
			.select({
				id: payments.id,
				bookingId: payments.bookingId,
				amount: payments.amount,
				status: payments.status,
				method: payments.method,
				provider: payments.provider,
				paidAt: payments.paidAt,
				expiresAt: payments.expiresAt,
				createdAt: payments.createdAt,
				bookingRef: bookings.bookingRef,
				contactName: bookings.contactName,
			})
			.from(payments)
			.innerJoin(bookings, eq(bookings.id, payments.bookingId))
			.where(where)
			.orderBy(desc(payments.createdAt))
			.limit(PAGE_SIZE)
			.offset((data.page - 1) * PAGE_SIZE);

		const [{ total }] = await db
			.select({ total: count() })
			.from(payments)
			.innerJoin(bookings, eq(bookings.id, payments.bookingId))
			.where(where);

		return { rows, total, page: data.page, pageSize: PAGE_SIZE };
	});

export const getPaymentStats = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		await requireAdmin();

		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const [collected] = await db
			.select({ total: sum(payments.amount) })
			.from(payments)
			.where(eq(payments.status, "paid"));

		const [month] = await db
			.select({ total: sum(payments.amount) })
			.from(payments)
			.where(
				and(eq(payments.status, "paid"), gte(payments.paidAt, monthStart)),
			);

		// "Awaiting" = pending and not yet expired
		const [pending] = await db
			.select({ n: count(), total: sum(payments.amount) })
			.from(payments)
			.where(
				and(
					eq(payments.status, "pending"),
					or(sql`${payments.expiresAt} is null`, gte(payments.expiresAt, now)),
				),
			);

		const [failed] = await db
			.select({ n: count() })
			.from(payments)
			.where(
				and(
					eq(payments.status, "failed"),
					gte(payments.createdAt, thirtyDaysAgo),
				),
			);

		return {
			collected: Number(collected?.total ?? 0),
			thisMonth: Number(month?.total ?? 0),
			pendingCount: pending?.n ?? 0,
			pendingAmount: Number(pending?.total ?? 0),
			failedCount: failed?.n ?? 0,
		};
	});

/* ---------------------------- details ---------------------------- */

export const getPaymentDetails = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await requireAdmin();

		const [payment] = await db
			.select(paymentColumns)
			.from(payments)
			.where(eq(payments.id, data.id));
		if (!payment) throw new Error("Payment not found");

		const [booking] = await db
			.select({
				id: bookings.id,
				bookingRef: bookings.bookingRef,
				status: bookings.status,
				contactName: bookings.contactName,
				contactEmail: bookings.contactEmail,
				contactPhone: bookings.contactPhone,
				totalAmount: bookings.totalAmount,
				paidAmount: bookings.paidAmount,
				dueAmount: bookings.dueAmount,
				tourId: bookings.tourId,
			})
			.from(bookings)
			.where(eq(bookings.id, payment.bookingId));

		const [tour] = await db
			.select({ title: tours.title })
			.from(tours)
			.where(eq(tours.id, booking.tourId));

		return { payment, booking, tourTitle: tour?.title ?? "—" };
	});

export const getBookingPayments = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(z.object({ bookingId: z.string() }))
	.handler(async ({ data }) => {
		await requireAdmin();
		return db
			.select({
				id: payments.id,
				amount: payments.amount,
				status: payments.status,
				method: payments.method,
				provider: payments.provider,
				paidAt: payments.paidAt,
				createdAt: payments.createdAt,
			})
			.from(payments)
			.where(eq(payments.bookingId, data.bookingId))
			.orderBy(desc(payments.createdAt));
	});

/* ---------------------------- mutations ---------------------------- */

export const recordManualPayment = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			bookingId: z.string(),
			amount: z.number().int().min(1),
			method: z.enum(paymentMethods),
			paidAt: z.coerce.date(),
			notes: z.string().max(1000).nullable(),
		}),
	)
	.handler(async ({ data }) => {
		await requireAdmin();

		const [booking] = await db
			.select()
			.from(bookings)
			.where(eq(bookings.id, data.bookingId));
		if (!booking) throw new Error("Booking not found");
		if (booking.status === "cancelled") {
			throw new Error("Can't record a payment on a cancelled booking");
		}
		if (data.amount > booking.dueAmount) {
			throw new Error("That's more than the amount still due");
		}

		const now = new Date();
		await db.batch([
			db.insert(payments).values({
				bookingId: data.bookingId,
				amount: data.amount,
				currency: "INR",
				status: "paid",
				method: data.method,
				provider: "manual",
				paidAt: data.paidAt,
				notes: data.notes,
				createdAt: now,
				updatedAt: now,
			}),
			recalcBooking(data.bookingId),
		]);
	});

export const updatePaymentStatus = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			id: z.string(),
			status: z.enum(["paid", "failed"]),
			method: z.enum(paymentMethods).optional(),
		}),
	)
	.handler(async ({ data }) => {
		await requireAdmin();

		const [payment] = await db
			.select()
			.from(payments)
			.where(eq(payments.id, data.id));
		if (!payment) throw new Error("Payment not found");
		if (payment.status !== "pending") {
			throw new Error("Only pending payments can be changed");
		}

		const [booking] = await db
			.select()
			.from(bookings)
			.where(eq(bookings.id, payment.bookingId));

		if (data.status === "paid") {
			if (!payment.method && !data.method)
				throw new Error("Choose a payment method");
			if (booking.paidAmount + payment.amount > booking.totalAmount) {
				throw new Error("Marking this paid would exceed the booking total");
			}
		}

		const now = new Date();
		await db.batch([
			db
				.update(payments)
				.set({
					status: data.status,
					updatedAt: now,
					...(data.status === "paid" && {
						paidAt: now,
						method: payment.method ?? data.method,
					}),
					...(data.status === "failed" && { paymentFailedAt: now }),
				})
				.where(eq(payments.id, data.id)),
			recalcBooking(payment.bookingId),
		]);
	});
