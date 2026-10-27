import { Badge } from "#/components/ui/badge";

export const formatLabel = (value?: string | null) =>
	value
		? value
				.replaceAll("_", " ")
				.replaceAll("-", " ")
				.replace(/\b\w/g, (c) => c.toUpperCase())
		: "—";

export const formatCurrency = (value?: number | null) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(value ?? 0);

export const formatDate = (value?: Date | string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export const formatDateTime = (value?: Date | string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
};

const BOOKING_STYLES: Record<string, string> = {
	pending: "border-amber-200 bg-amber-50 text-amber-700",
	confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	completed: "border-blue-200 bg-blue-50 text-blue-700",
	cancelled: "border-red-200 bg-red-50 text-red-700",
};

const PAYMENT_STYLES: Record<string, string> = {
	pending: "border-amber-200 bg-amber-50 text-amber-700",
	partial: "border-blue-200 bg-blue-50 text-blue-700",
	partially_paid: "border-blue-200 bg-blue-50 text-blue-700",
	paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
	refunded: "border-purple-200 bg-purple-50 text-purple-700",
	failed: "border-red-200 bg-red-50 text-red-700",
};

const FALLBACK = "border-slate-200 bg-slate-100 text-slate-600";

export function BookingStatusBadge({ status }: { status: string }) {
	return (
		<Badge variant="outline"
	className={BOOKING_STYLES[status] ?? FALLBACK}>
			{formatLabel(status)}
		</Badge>
	)
}

export function PaymentStatusBadge({ status }: { status: string }) {
	return (
		<Badge variant="outline"
	className={PAYMENT_STYLES[status] ?? FALLBACK}>
			{formatLabel(status)}
		</Badge>
	)
}

export const BOOKING_SOURCES = [
	"website",
	"admin",
	"phone",
	"whatsapp",
] as const;
