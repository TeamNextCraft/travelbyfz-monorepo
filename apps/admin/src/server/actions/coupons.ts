import { bookings, coupons } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import {
	and,
	count,
	desc,
	eq,
	gt,
	gte,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	or,
	sum,
} from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";
import { couponInsertSchema } from "#/lib/schema/coupon";

const PAGE_SIZE = 20;

/**
 * SQL version of getCouponStatus() in coupon-ui.tsx, with the same precedence:
 * inactive > expired > exhausted > scheduled > active.
 */
function statusFilter(status: string, now: Date) {
	const notExpired = or(isNull(coupons.expiresAt), gt(coupons.expiresAt, now));
	const notExhausted = or(
		isNull(coupons.usageLimit),
		lt(coupons.usedCount, coupons.usageLimit),
	);
	const started = or(isNull(coupons.startsAt), lte(coupons.startsAt, now));
	const on = eq(coupons.isActive, true);

	switch (status) {
		case "inactive":
			return eq(coupons.isActive, false);
		case "expired":
			return and(on, lte(coupons.expiresAt, now));
		case "exhausted":
			return and(on, notExpired, gte(coupons.usedCount, coupons.usageLimit));
		case "scheduled":
			return and(on, notExpired, notExhausted, gt(coupons.startsAt, now));
		case "active":
			return and(on, notExpired, notExhausted, started);
		default:
			return undefined;
	}
}

/* ---------------------------- list ---------------------------- */

export const getCoupons = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			page: z.number().int().min(1).default(1),
			q: z.string().optional(),
			status: z.string().optional(),
			type: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const term = data.q?.trim();
		const where = and(
			data.status ? statusFilter(data.status, new Date()) : undefined,
			data.type ? eq(coupons.type, data.type as never) : undefined,
			term
				? or(
						like(coupons.code, `%${term.toUpperCase()}%`),
						like(coupons.title, `%${term}%`),
					)
				: undefined,
		);

		const rows = await db
			.select()
			.from(coupons)
			.where(where)
			.orderBy(desc(coupons.createdAt))
			.limit(PAGE_SIZE)
			.offset((data.page - 1) * PAGE_SIZE);

		const [{ total }] = await db
			.select({ total: count() })
			.from(coupons)
			.where(where);

		return { rows, total, page: data.page, pageSize: PAGE_SIZE };
	});

export const getCouponStats = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.handler(async () => {
		const now = new Date();
		const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const [[all], [active], [soon], [used], [given]] = await Promise.all([
			db.select({ n: count() }).from(coupons),
			db
				.select({ n: count() })
				.from(coupons)
				.where(statusFilter("active", now)),
			db
				.select({ n: count() })
				.from(coupons)
				.where(
					and(
						statusFilter("active", now),
						isNotNull(coupons.expiresAt),
						lte(coupons.expiresAt, weekAhead),
					),
				),
			db.select({ n: sum(coupons.usedCount) }).from(coupons),
			db
				.select({ n: sum(bookings.discountAmount) })
				.from(bookings)
				.where(
					and(isNotNull(bookings.couponId), ne(bookings.status, "cancelled")),
				),
		]);

		return {
			total: all?.n ?? 0,
			active: active?.n ?? 0,
			expiringSoon: soon?.n ?? 0,
			redemptions: Number(used?.n ?? 0),
			discountGiven: Number(given?.n ?? 0),
		};
	});

/* ---------------------------- single ---------------------------- */

export const getCoupon = createServerFn({ method: "GET" })
	.middleware([adminMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const [coupon] = await db
			.select()
			.from(coupons)
			.where(eq(coupons.id, data.id));
		return coupon ?? null;
	});

/* ---------------------------- mutations ---------------------------- */

const normalise = (v: z.infer<typeof couponInsertSchema>) => ({
	...v,
	// A cap only applies to percentage coupons
	maxDiscountAmount: v.type === "flat" ? null : v.maxDiscountAmount,
});

export const createCoupon = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(couponInsertSchema)
	.handler(async ({ data }) => {
		const [existing] = await db
			.select({ id: coupons.id })
			.from(coupons)
			.where(eq(coupons.code, data.code));
		if (existing) throw new Error("A coupon with this code already exists");

		const [created] = await db
			.insert(coupons)
			.values(normalise(data))
			.returning();
		return created;
	});

export const updateCoupon = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(z.object({ id: z.string() }).and(couponInsertSchema))
	.handler(async ({ data: { id, ...values } }) => {
		const [current] = await db.select().from(coupons).where(eq(coupons.id, id));
		if (!current) throw new Error("Coupon not found");

		if (values.code !== current.code) {
			if (current.usedCount > 0) {
				throw new Error(
					"The code can't be changed after the coupon has been used",
				);
			}
			const [clash] = await db
				.select({ id: coupons.id })
				.from(coupons)
				.where(eq(coupons.code, values.code));
			if (clash) throw new Error("A coupon with this code already exists");
		}

		if (values.usageLimit !== null && values.usageLimit < current.usedCount) {
			throw new Error(
				`The usage limit can't be below the ${current.usedCount} times it's already been used`,
			);
		}

		await db.update(coupons).set(normalise(values)).where(eq(coupons.id, id));
	});

export const setCouponActive = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(z.object({ id: z.string(), isActive: z.boolean() }))
	.handler(async ({ data }) => {
		await db
			.update(coupons)
			.set({ isActive: data.isActive })
			.where(eq(coupons.id, data.id));
	});
