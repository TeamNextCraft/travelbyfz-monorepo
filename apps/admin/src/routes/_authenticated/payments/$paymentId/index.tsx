import { paymentMethods } from "@repo/db/schema/domestic.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	Check,
	CheckCircle2,
	Copy,
	Loader2,
	RefreshCw,
	XCircle,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
	BookingStatusBadge,
	formatCurrency,
	formatDateTime,
	formatLabel,
	PaymentStatusBadge,
} from "#/components/bookings/booking-ui";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { Separator } from "#/components/ui/separator";
import {
	getPaymentDetails,
	updatePaymentStatus,
} from "#/server/actions/payments";

export const Route = createFileRoute("/_authenticated/payments/$paymentId/")({
	component: PaymentDetailsPage,
});

function DetailItem({ label, value }: { label: string; value?: ReactNode }) {
	return (
		<div className="min-w-0 space-y-1">
			<p className="text-xs text-muted-foreground">{label}</p>
			<div className="break-words text-sm font-medium">
				{value === null || value === undefined || value === "" ? "—" : value}
			</div>
		</div>
	);
}

function CopyableCode({ value }: { value?: string | null }) {
	const [copied, setCopied] = useState(false);
	if (!value) return <span>—</span>;

	return (
		<span className="inline-flex items-center gap-1.5">
			<code className="break-all font-mono text-xs">{value}</code>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-6 shrink-0"
				aria-label="Copy"
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(value);
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					} catch {
						toast.error("Couldn't copy to clipboard");
					}
				}}
			>
				{copied ? (
					<Check className="size-3.5 text-emerald-500" />
				) : (
					<Copy className="size-3.5" />
				)}
			</Button>
		</span>
	);
}

function TimelineItem({
	label,
	date,
	tone = "default",
}: {
	label: string;
	date?: Date | string | null;
	tone?: "default" | "danger";
}) {
	const done = Boolean(date);
	const dot = !done
		? "bg-muted-foreground/30"
		: tone === "danger"
			? "bg-red-500"
			: "bg-primary";
	return (
		<li className="flex items-start gap-3">
			<span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot}`} />
			<div>
				<p
					className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}
				>
					{label}
				</p>
				{done && (
					<p className="text-xs text-muted-foreground">
						{formatDateTime(date)}
					</p>
				)}
			</div>
		</li>
	);
}

type PendingAction = "paid" | "failed" | null;

function PaymentDetailsPage() {
	const { paymentId } = Route.useParams();
	const queryClient = useQueryClient();

	const fetchPayment = useServerFn(getPaymentDetails);
	const changeStatus = useServerFn(updatePaymentStatus);

	const [pending, setPending] = useState<PendingAction>(null);
	const [method, setMethod] = useState<string | undefined>();

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["payment", paymentId],
		queryFn: () => fetchPayment({ data: { id: paymentId } }),
	});

	const mutation = useMutation({
		mutationFn: (input: { status: "paid" | "failed"; method?: string }) =>
			changeStatus({ data: { id: paymentId, ...input } as never }),
		onSuccess: () => {
			toast.success("Payment updated");
			setPending(null);
			queryClient.invalidateQueries({ queryKey: ["payment", paymentId] });
			queryClient.invalidateQueries({ queryKey: ["payments"] });
			queryClient.invalidateQueries({ queryKey: ["payments-stats"] });
			queryClient.invalidateQueries({ queryKey: ["booking"] });
			queryClient.invalidateQueries({ queryKey: ["booking-payments"] });
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
		},
		onError: (error) =>
			toast.error(
				error instanceof Error ? error.message : "Couldn't update payment",
			),
	});

	if (isPending) {
		return (
			<main className="space-y-6 p-4 md:p-6 lg:p-8" aria-busy="true">
				<div className="h-12 w-64 animate-pulse rounded bg-muted" />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="h-80 animate-pulse rounded-lg bg-muted" />
					<div className="h-60 animate-pulse rounded-lg bg-muted" />
				</div>
			</main>
		);
	}

	if (isError || !data) {
		return (
			<main className="p-4 md:p-6 lg:p-8">
				<Card className="mx-auto max-w-lg">
					<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
						<AlertTriangle className="size-6 text-red-600" />
						<h1 className="text-lg font-semibold">
							Couldn't load this payment
						</h1>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => refetch()}>
								<RefreshCw className="mr-2 size-4" />
								Try again
							</Button>
							<Button variant="ghost" asChild>
								<Link to="/payments" search={{ page: 1 }}>
									Back to payments
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	const { payment: p, booking: b, tourTitle } = data;
	const isPendingPayment = p.status === "pending";
	const isGateway = p.provider !== "manual" && p.provider !== null;
	const expired =
		isPendingPayment &&
		p.expiresAt &&
		new Date(p.expiresAt).getTime() < Date.now();
	const needsMethod = pending === "paid" && !p.method;
	const effectiveMethod = p.method ?? method;

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Header */}
			<section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
				<div className="space-y-3">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						asChild
					>
						<Link to="/payments" search={{ page: 1 }}>
							<ArrowLeft className="mr-2 size-4" />
							Back to payments
						</Link>
					</Button>

					<div className="space-y-2">
						<h1 className="text-3xl font-semibold tracking-tight">
							{formatCurrency(p.amount)}
						</h1>
						<div className="flex flex-wrap items-center gap-2">
							<PaymentStatusBadge status={p.status} />
							{expired && (
								<Badge
									variant="outline"
									className="border-red-200 bg-red-50 text-red-700"
								>
									Expired
								</Badge>
							)}
							<Badge variant="outline">
								{formatLabel(p.provider ?? "manual")}
							</Badge>
							{p.method && (
								<Badge variant="secondary">{formatLabel(p.method)}</Badge>
							)}
						</div>
						<p className="font-mono text-xs text-muted-foreground">{p.id}</p>
					</div>
				</div>

				{isPendingPayment && (
					<div className="flex flex-wrap gap-2">
						<Button onClick={() => setPending("paid")}>
							<CheckCircle2 className="mr-2 size-4" />
							Mark as paid
						</Button>
						<Button
							variant="outline"
							className="text-destructive hover:text-destructive"
							onClick={() => setPending("failed")}
						>
							<XCircle className="mr-2 size-4" />
							Mark as failed
						</Button>
					</div>
				)}
			</section>

			{/* Confirmation */}
			{pending && (
				<Card
					className={
						pending === "failed" ? "border-red-200" : "border-emerald-200"
					}
				>
					<CardHeader>
						<CardTitle className="text-base">
							{pending === "paid"
								? "Mark this payment as paid?"
								: "Mark this payment as failed?"}
						</CardTitle>
						<CardDescription>
							{pending === "paid"
								? `This adds ${formatCurrency(p.amount)} to the booking's paid amount.${
										isGateway
											? " Only do this after checking the money in your gateway dashboard, or the payment may be counted twice if the gateway later confirms it."
											: ""
									}`
								: "The booking's balance stays due and the customer can try again."}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{needsMethod && (
							<div className="max-w-xs space-y-1.5">
								<p className="text-sm font-medium">How was it paid?</p>
								<Select value={method} onValueChange={setMethod}>
									<SelectTrigger aria-label="Payment method">
										<SelectValue placeholder="Select method" />
									</SelectTrigger>
									<SelectContent>
										{paymentMethods.map((m) => (
											<SelectItem key={m} value={m}>
												{formatLabel(m)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
						<div className="flex gap-2">
							<Button
								variant={pending === "failed" ? "destructive" : "default"}
								disabled={
									mutation.isPending || (needsMethod && !effectiveMethod)
								}
								onClick={() =>
									mutation.mutate({
										status: pending,
										...(pending === "paid" && effectiveMethod
											? { method: effectiveMethod }
											: {}),
									})
								}
							>
								{mutation.isPending && (
									<Loader2 className="mr-2 size-4 animate-spin" />
								)}
								Confirm
							</Button>
							<Button variant="ghost" onClick={() => setPending(null)}>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div className="min-w-0 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Booking</CardTitle>
							<CardDescription>What this payment is for.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								<DetailItem
									label="Booking"
									value={
										<Link
											to="/bookings/$bookingId"
											params={{ bookingId: b.id }}
											className="font-mono text-primary underline-offset-4 hover:underline"
										>
											{b.bookingRef}
										</Link>
									}
								/>
								<DetailItem label="Tour" value={tourTitle} />
								<DetailItem
									label="Booking status"
									value={<BookingStatusBadge status={b.status} />}
								/>
								<DetailItem label="Customer" value={b.contactName} />
								<DetailItem label="Email" value={b.contactEmail} />
								<DetailItem label="Phone" value={b.contactPhone} />
							</div>
							<Separator />
							<div className="grid gap-5 sm:grid-cols-3">
								<DetailItem
									label="Booking total"
									value={formatCurrency(b.totalAmount)}
								/>
								<DetailItem
									label="Paid so far"
									value={formatCurrency(b.paidAmount)}
								/>
								<DetailItem
									label="Balance due"
									value={
										<span className={b.dueAmount > 0 ? "text-amber-700" : ""}>
											{formatCurrency(b.dueAmount)}
										</span>
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Gateway details</CardTitle>
							<CardDescription>
								Identifiers to match this payment in your provider dashboard.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-5 sm:grid-cols-2">
								<DetailItem
									label="Provider"
									value={formatLabel(p.provider ?? "manual")}
								/>
								<DetailItem
									label="Method"
									value={p.method ? formatLabel(p.method) : null}
								/>
								<DetailItem
									label="Provider order ID"
									value={<CopyableCode value={p.providerOrderId} />}
								/>
								<DetailItem
									label="Provider payment ID"
									value={<CopyableCode value={p.providerPaymentId} />}
								/>
								<DetailItem label="Currency" value={p.currency} />
								<DetailItem
									label="Signature"
									value={p.hasSignature ? "Recorded" : "None"}
								/>
							</div>
						</CardContent>
					</Card>

					{p.notes && (
						<Card>
							<CardHeader>
								<CardTitle>Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
									{p.notes}
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
					<Card>
						<CardHeader>
							<CardTitle>Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								<TimelineItem label="Created" date={p.createdAt} />
								{p.paymentDueAt && (
									<TimelineItem label="Payment due" date={p.paymentDueAt} />
								)}
								{p.paidAt ? (
									<TimelineItem label="Paid" date={p.paidAt} />
								) : null}
								{p.paymentFailedAt && (
									<TimelineItem
										label="Failed"
										date={p.paymentFailedAt}
										tone="danger"
									/>
								)}
								{isPendingPayment && p.expiresAt && (
									<TimelineItem
										label={expired ? "Expired" : "Expires"}
										date={p.expiresAt}
										tone={expired ? "danger" : "default"}
									/>
								)}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Record</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<DetailItem
								label="Payment ID"
								value={<CopyableCode value={p.id} />}
							/>
							<DetailItem label="Updated" value={formatDateTime(p.updatedAt)} />
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
