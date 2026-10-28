import { paymentMethods } from "@repo/db/schema/domestic.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	formatCurrency,
	formatDate,
	formatLabel,
	PaymentStatusBadge,
} from "#/components/bookings/booking-ui";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { Textarea } from "#/components/ui/textarea";
import {
	getBookingPayments,
	recordManualPayment,
} from "#/server/actions/payments";

const todayInputValue = () => {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Local noon, so the date can't slip a day when converted to UTC. */
const dateAtNoon = (raw: string) => {
	const [y, m, d] = raw.split("-").map(Number);
	return new Date(y, m - 1, d, 12);
};

export function BookingPaymentsCard({
	bookingId,
	dueAmount,
	canRecord,
}: {
	bookingId: string;
	dueAmount: number;
	/** false for cancelled bookings */
	canRecord: boolean;
}) {
	const queryClient = useQueryClient();
	const fetchPayments = useServerFn(getBookingPayments);
	const record = useServerFn(recordManualPayment);

	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState("");
	const [method, setMethod] = useState<string | undefined>();
	const [paidOn, setPaidOn] = useState(todayInputValue());
	const [notes, setNotes] = useState("");

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["booking-payments", bookingId],
		queryFn: () => fetchPayments({ data: { bookingId } }),
	});

	const numericAmount = Number(amount);
	const amountError =
		amount === ""
			? null
			: !Number.isInteger(numericAmount) || numericAmount <= 0
				? "Enter a whole number of rupees greater than 0"
				: numericAmount > dueAmount
					? `That's more than the ${formatCurrency(dueAmount)} still due`
					: null;
	const canSubmit =
		amount !== "" && !amountError && Boolean(method) && Boolean(paidOn);

	const mutation = useMutation({
		mutationFn: () =>
			record({
				data: {
					bookingId,
					amount: numericAmount,
					method: method as never,
					paidAt: dateAtNoon(paidOn),
					notes: notes.trim() || null,
				},
			}),
		onSuccess: () => {
			toast.success("Payment recorded");
			setOpen(false);
			setAmount("");
			setMethod(undefined);
			setNotes("");
			setPaidOn(todayInputValue());
			for (const key of [
				"booking-payments",
				"booking",
				"bookings",
				"bookings-stats",
				"payments",
				"payments-stats",
			]) {
				queryClient.invalidateQueries({ queryKey: [key] });
			}
		},
		onError: (error) =>
			toast.error(
				error instanceof Error ? error.message : "Couldn't record payment",
			),
	});

	const payments = data ?? [];

	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between gap-3">
				<div className="space-y-1.5">
					<CardTitle>Payments</CardTitle>
					<CardDescription>
						Every payment attempt for this booking.
					</CardDescription>
				</div>
				{canRecord && dueAmount > 0 && !open && (
					<Button size="sm" onClick={() => setOpen(true)}>
						<Plus className="mr-2 size-4" />
						Record payment
					</Button>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				{open && (
					<div className="space-y-4 rounded-lg border bg-muted/30 p-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label htmlFor="pay-amount" className="text-sm font-medium">
									Amount (₹)
								</label>
								<Input
									id="pay-amount"
									type="number"
									inputMode="numeric"
									min={1}
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder={`Up to ${dueAmount}`}
									aria-invalid={Boolean(amountError)}
								/>
								{amountError ? (
									<p className="text-xs text-destructive">{amountError}</p>
								) : (
									<button
										type="button"
										className="text-xs text-primary underline-offset-4 hover:underline"
										onClick={() => setAmount(String(dueAmount))}
									>
										Fill full balance ({formatCurrency(dueAmount)})
									</button>
								)}
							</div>

							<div className="space-y-1.5">
								<label htmlFor="pay-method" className="text-sm font-medium">
									Method
								</label>
								<Select value={method} onValueChange={setMethod}>
									<SelectTrigger id="pay-method">
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

							<div className="space-y-1.5">
								<label htmlFor="pay-date" className="text-sm font-medium">
									Received on
								</label>
								<Input
									id="pay-date"
									type="date"
									value={paidOn}
									max={todayInputValue()}
									onChange={(e) => setPaidOn(e.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="pay-notes" className="text-sm font-medium">
								Notes
							</label>
							<Textarea
								id="pay-notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="e.g. UPI ref 4082…, received by Rahul at the office"
								rows={2}
							/>
						</div>

						<div className="flex gap-2">
							<Button
								size="sm"
								disabled={!canSubmit || mutation.isPending}
								onClick={() => mutation.mutate()}
							>
								{mutation.isPending && (
									<Loader2 className="mr-2 size-4 animate-spin" />
								)}
								Save payment
							</Button>
							<Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{isPending ? (
					<div className="space-y-2" aria-busy="true">
						{[0, 1].map((i) => (
							<div key={i} className="h-14 animate-pulse rounded-md bg-muted" />
						))}
					</div>
				) : isError ? (
					<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-5 py-8 text-center">
						<p className="text-sm text-muted-foreground">
							Couldn't load payments.
						</p>
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							Try again
						</Button>
					</div>
				) : payments.length === 0 ? (
					<div className="flex flex-col items-center rounded-lg border border-dashed px-5 py-8 text-center">
						<Receipt className="size-7 text-muted-foreground" />
						<p className="mt-2 text-sm text-muted-foreground">
							No payments have been made or attempted yet.
						</p>
					</div>
				) : (
					<ul className="divide-y rounded-lg border">
						{payments.map((p) => (
							<li key={p.id}>
								<Link
									to="/payments/$paymentId"
									params={{ paymentId: p.id }}
									className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40"
								>
									<div className="min-w-0">
										<p className="text-sm font-medium">
											{formatCurrency(p.amount)}
										</p>
										<p className="text-xs text-muted-foreground">
											{p.method ? formatLabel(p.method) : "Method not set"} ·{" "}
											{formatLabel(p.provider ?? "manual")} ·{" "}
											{formatDate(p.paidAt ?? p.createdAt)}
										</p>
									</div>
									<PaymentStatusBadge status={p.status} />
								</Link>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
