import { Badge } from "#/components/ui/badge";

export type CouponStatus =
	| "active"
	| "scheduled"
	| "expired"
	| "exhausted"
	| "inactive";

export const couponStatuses: readonly CouponStatus[] = [
	"active",
	"scheduled",
	"expired",
	"exhausted",
	"inactive",
];

type CouponLike = {
	isActive: boolean;
	startsAt: Date | string | null;
	expiresAt: Date | string | null;
	usageLimit: number | null;
	usedCount: number;
};

/**
 * Precedence: inactive > expired > exhausted > scheduled > active.
 * The server's status filter (getCoupons) uses the same order.
 */
export function getCouponStatus(c: CouponLike, now = new Date()): CouponStatus {
	if (!c.isActive) return "inactive";
	if (c.expiresAt && new Date(c.expiresAt) <= now) return "expired";
	if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return "exhausted";
	if (c.startsAt && new Date(c.startsAt) > now) return "scheduled";
	return "active";
}

const STYLES: Record<CouponStatus, string> = {
	active: "border-emerald-200 bg-emerald-50 text-emerald-700",
	scheduled: "border-blue-200 bg-blue-50 text-blue-700",
	expired: "border-slate-200 bg-slate-100 text-slate-600",
	exhausted: "border-amber-200 bg-amber-50 text-amber-700",
	inactive: "border-slate-200 bg-slate-100 text-slate-600",
};

export function CouponStatusBadge({ status }: { status: CouponStatus }) {
	return (
		<Badge variant="outline" className={STYLES[status]}>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	);
}

const inr = (n: number) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(n);

export function describeDiscount(c: {
	type: string;
	value: number;
	maxDiscountAmount: number | null;
}) {
	if (c.type === "percentage") {
		return c.maxDiscountAmount
			? `${c.value}% off, up to ${inr(c.maxDiscountAmount)}`
			: `${c.value}% off`;
	}
	return `${inr(c.value)} off`;
}

/** What a customer would save on a booking of `amount` rupees. */
export function previewDiscount(
	c: {
		type: string;
		value: number;
		minBookingAmount: number | null;
		maxDiscountAmount: number | null;
	},
	amount: number,
) {
	if (c.minBookingAmount !== null && amount < c.minBookingAmount) {
		return { eligible: false as const, discount: 0 };
	}
	let discount =
		c.type === "percentage" ? Math.floor((amount * c.value) / 100) : c.value;
	if (c.type === "percentage" && c.maxDiscountAmount !== null) {
		discount = Math.min(discount, c.maxDiscountAmount);
	}
	return { eligible: true as const, discount: Math.min(discount, amount) };
}

export { inr as formatInr };
