import { couponScopes, couponTypes } from "@repo/db/schema/domestic.ts";
import { z } from "zod";

const nullableText = (max?: number) => {
	const schema = max ? z.string().max(max) : z.string();
	return z.union([schema, z.literal("").transform(() => null), z.null()]);
};

const nullablePositiveInt = z
	.number({ error: "Enter a whole number" })
	.int("Use whole numbers")
	.min(1, "Must be at least 1")
	.nullable();

export const couponInsertSchema = z
	.object({
		code: z
			.string()
			.regex(
				/^[A-Z0-9_-]{3,24}$/,
				"3–24 characters: capital letters, numbers, - or _",
			),
		title: nullableText(100),
		description: nullableText(500),

		type: z.enum(couponTypes),
		scope: z.enum(couponScopes),

		// Percentage (1–100) or a flat amount in INR, depending on `type`
		value: z
			.number({ error: "Enter a value" })
			.int("Use whole numbers")
			.min(1, "Value must be at least 1"),
		minBookingAmount: nullablePositiveInt,
		maxDiscountAmount: nullablePositiveInt, // percentage coupons only

		usageLimit: nullablePositiveInt,

		startsAt: z.date({ error: "Enter a valid date" }).nullable(),
		expiresAt: z.date({ error: "Enter a valid date" }).nullable(),

		isActive: z.boolean(),
	})
	.superRefine((d, ctx) => {
		const add = (message: string, path: string) =>
			ctx.addIssue({ code: "custom", message, path: [path] });

		if (d.type === "percentage" && d.value > 100) {
			add("A percentage can't be more than 100", "value");
		}
		if (
			d.type === "flat" &&
			d.minBookingAmount !== null &&
			d.value > d.minBookingAmount
		) {
			add(
				"A flat discount can't be more than the minimum booking amount",
				"value",
			);
		}
		if (d.startsAt && d.expiresAt && d.expiresAt <= d.startsAt) {
			add("Expiry must be after the start date", "expiresAt");
		}
	});

export type CouponInputSchema = z.infer<typeof couponInsertSchema>;

export const emptyCoupon: CouponInputSchema = {
	code: "",
	title: null,
	description: null,
	type: "percentage",
	scope: "all" as CouponInputSchema["scope"], // matches the column default
	value: 10,
	minBookingAmount: null,
	maxDiscountAmount: null,
	usageLimit: null,
	startsAt: null,
	expiresAt: null,
	isActive: true,
};
