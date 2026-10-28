import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	CheckCircle2,
	Eye,
	EyeOff,
	Loader2,
	Mail,
	MessageCircle,
	Phone,
	RefreshCw,
	User2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	BookingStatusBadge,
	formatCurrency,
	formatDate,
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
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import {
	getBookingDetails,
	updateBookingNotes,
	updateBookingStatus,
} from "#/server/actions/bookings";

export const Route = createFileRoute("/_authenticated/bookings/$bookingId/")({
	component: BookingDetailsPage,
});

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function DetailItem({
	label,
	value,
}: {
	label: string;
	value?: string | number | null;
}) {
	return (
		<div className="min-w-0 space-y-1">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="break-words text-sm font-medium">
				{value === null || value === undefined || value === "" ? "—" : value}
			</p>
		</div>
	);
}

function AmountRow({
	label,
	value,
	negative,
	bold,
}: {
	label: string;
	value: number;
	negative?: boolean;
	bold?: boolean;
}) {
	return (
		<div
			className={`flex items-center justify-between gap-3 text-sm ${bold ? "font-semibold" : ""}`}
		>
			<span className={bold ? "" : "text-muted-foreground"}>{label}</span>
			<span>
				{negative && value > 0 ? "− " : ""}
				{formatCurrency(value)}
			</span>
		</div>
	);
}

function TimelineItem({
	label,
	date,
}: {
	label: string;
	date?: Date | string | null;
}) {
	const done = Boolean(date);
	return (
		<li className="flex items-start gap-3">
			<span
				className={`mt-1.5 size-2 shrink-0 rounded-full ${done ? "bg-primary" : "bg-muted-foreground/30"}`}
			/>
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

function TravellerCard({
	traveller,
}: {
	traveller: {
		id: string;
		firstName: string;
		lastName: string;
		fullName: string | null;
		age: number | null;
		dateOfBirth: Date | string | null;
		gender: string | null;
		isPrimary: boolean;
		phone: string | null;
		email: string | null;
		idType: string | null;
		idNumber: string | null;
		roomType: string | null;
		dietaryPreferences: string[] | null;
		medicalNotes: string | null;
	};
}) {
	const [showId, setShowId] = useState(false);
	const id = traveller.idNumber;
	const maskedId = id ? `•••• ${id.slice(-4)}` : null;

	return (
		<div className="space-y-4 rounded-lg border p-4">
			<div className="flex flex-wrap items-center gap-2">
				<h3 className="text-sm font-semibold">
					{traveller.fullName || `${traveller.firstName} ${traveller.lastName}`}
				</h3>
				{traveller.isPrimary && <Badge variant="secondary">Primary</Badge>}
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailItem
					label="Age"
					value={traveller.age != null ? `${traveller.age} years` : null}
				/>
				<DetailItem label="Gender" value={formatLabel(traveller.gender)} />
				<DetailItem label="Room type" value={formatLabel(traveller.roomType)} />
				<DetailItem label="Phone" value={traveller.phone} />
				<DetailItem label="Email" value={traveller.email} />
				<div className="min-w-0 space-y-1">
					<p className="text-xs text-muted-foreground">
						{traveller.idType ? formatLabel(traveller.idType) : "ID"} number
					</p>
					{id ? (
						<div className="flex items-center gap-1.5">
							<p className="font-mono text-sm font-medium">
								{showId ? id : maskedId}
							</p>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setShowId((v) => !v)}
								aria-label={showId ? "Hide ID number" : "Show ID number"}
							>
								{showId ? (
									<EyeOff className="size-3.5" />
								) : (
									<Eye className="size-3.5" />
								)}
							</Button>
						</div>
					) : (
						<p className="text-sm font-medium">—</p>
					)}
				</div>
			</div>

			{(traveller.dietaryPreferences?.length ?? 0) > 0 && (
				<div className="space-y-1.5">
					<p className="text-xs text-muted-foreground">Dietary preferences</p>
					<div className="flex flex-wrap gap-1.5">
						{traveller.dietaryPreferences?.map((d) => (
							<Badge key={d} variant="secondary">
								{d}
							</Badge>
						))}
					</div>
				</div>
			)}

			{traveller.medicalNotes && (
				<div className="rounded-md bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
					<span className="font-semibold">Medical notes: </span>
					{traveller.medicalNotes}
				</div>
			)}
		</div>
	);
}

function NotesCard({
	bookingId,
	initial,
}: {
	bookingId: string;
	initial: string | null;
}) {
	const queryClient = useQueryClient();
	const saveNotes = useServerFn(updateBookingNotes);
	const [value, setValue] = useState(initial ?? "");

	const mutation = useMutation({
		mutationFn: () =>
			saveNotes({ data: { id: bookingId, internalNotes: value } }),
		onSuccess: () => {
			toast.success("Notes saved");
			queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
		},
		onError: () => toast.error("Couldn't save notes"),
	});

	const dirty = value !== (initial ?? "");

	return (
		<Card>
			<CardHeader>
				<CardTitle>Internal notes</CardTitle>
				<CardDescription>Only visible to your team.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<Textarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="e.g. Customer asked to call after 6pm. Payment promised by Friday."
					rows={4}
				/>
				<Button
					size="sm"
					disabled={!dirty || mutation.isPending}
					onClick={() => mutation.mutate()}
				>
					{mutation.isPending && (
						<Loader2 className="mr-2 size-4 animate-spin" />
					)}
					Save notes
				</Button>
			</CardContent>
		</Card>
	);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function BookingDetailsPage() {
	const { bookingId } = Route.useParams();
	const queryClient = useQueryClient();

	const fetchBooking = useServerFn(getBookingDetails);
	const changeStatus = useServerFn(updateBookingStatus);

	const [showCancel, setShowCancel] = useState(false);
	const [reason, setReason] = useState("");

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["booking", bookingId],
		queryFn: () => fetchBooking({ data: { id: bookingId } }),
	});

	const statusMutation = useMutation({
		mutationFn: (input: {
			status: "confirmed" | "completed" | "cancelled";
			cancellationReason?: string;
		}) => changeStatus({ data: { id: bookingId, ...input } }),
		onSuccess: () => {
			toast.success("Booking updated");
			setShowCancel(false);
			setReason("");
			queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			queryClient.invalidateQueries({ queryKey: ["bookings-stats"] });
			queryClient.invalidateQueries({ queryKey: ["tour-departures"] });
		},
		onError: () => toast.error("Couldn't update the booking"),
	});

	if (isPending) {
		return (
			<main className="space-y-6 p-4 md:p-6 lg:p-8" aria-busy="true">
				<div className="h-9 w-72 animate-pulse rounded bg-muted" />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="h-96 animate-pulse rounded-lg bg-muted" />
					<div className="h-72 animate-pulse rounded-lg bg-muted" />
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
							Couldn't load this booking
						</h1>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => refetch()}>
								<RefreshCw className="mr-2 size-4" />
								Try again
							</Button>
							<Button variant="ghost" asChild>
								<Link to="/bookings" search={{ page: 1 }}>
									Back to bookings
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	const { booking: b, tour, departure, travellers } = data;

	const canConfirm = b.status === "pending";
	const canComplete = b.status === "confirmed";
	const canCancel = b.status !== "cancelled" && b.status !== "completed";

	const paidPercent =
		b.totalAmount > 0 ? Math.min(100, (b.paidAmount / b.totalAmount) * 100) : 0;

	// `tourAddonsSelected` is typed as a single add-on row in the schema but is
	// almost certainly a list, so normalise defensively.
	const addons = (
		Array.isArray(b.tourAddonsSelected)
			? b.tourAddonsSelected
			: b.tourAddonsSelected
				? [b.tourAddonsSelected]
				: []
	) as Record<string, unknown>[];

	const phoneDigits = b.contactPhone.replace(/\D/g, "");

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
						<Link to="/bookings" search={{ page: 1 }}>
							<ArrowLeft className="mr-2 size-4" />
							Back to bookings
						</Link>
					</Button>

					<div className="space-y-2">
						<h1 className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
							{b.bookingRef}
						</h1>
						<div className="flex flex-wrap items-center gap-2">
							<BookingStatusBadge status={b.status} />
							<PaymentStatusBadge status={b.paymentStatus} />
							<Badge variant="outline">{formatLabel(b.source)}</Badge>
							<span className="text-xs text-muted-foreground">
								Booked {formatDateTime(b.bookedAt)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{b.userId && (
						<Link to="/users/$userId" params={{ userId: b.userId }}>
							<Button variant={"outline"}>
								<User2 />
								View User
							</Button>
						</Link>
					)}
					{canConfirm && (
						<Button
							disabled={statusMutation.isPending}
							onClick={() => statusMutation.mutate({ status: "confirmed" })}
						>
							<CheckCircle2 className="mr-2 size-4" />
							Confirm booking
						</Button>
					)}
					{canComplete && (
						<Button
							disabled={statusMutation.isPending}
							onClick={() => statusMutation.mutate({ status: "completed" })}
						>
							<CheckCircle2 className="mr-2 size-4" />
							Mark completed
						</Button>
					)}
					{canCancel && (
						<Button
							variant="outline"
							className="text-destructive hover:text-destructive"
							onClick={() => setShowCancel((v) => !v)}
						>
							<XCircle className="mr-2 size-4" />
							Cancel booking
						</Button>
					)}
				</div>
			</section>

			{/* Cancel panel */}
			{showCancel && (
				<Card className="border-red-200">
					<CardHeader>
						<CardTitle className="text-base">Cancel this booking?</CardTitle>
						<CardDescription>
							The seats ({b.adultCount + b.childCount}) will be released back to
							the departure. Refunds are not processed automatically.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<Textarea
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="Reason for cancellation (shown in the booking record)"
							rows={3}
						/>
						<div className="flex gap-2">
							<Button
								variant="destructive"
								disabled={statusMutation.isPending || !reason.trim()}
								onClick={() =>
									statusMutation.mutate({
										status: "cancelled",
										cancellationReason: reason.trim(),
									})
								}
							>
								{statusMutation.isPending && (
									<Loader2 className="mr-2 size-4 animate-spin" />
								)}
								Confirm cancellation
							</Button>
							<Button variant="ghost" onClick={() => setShowCancel(false)}>
								Keep booking
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				{/* Main column */}
				<div className="min-w-0 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Trip</CardTitle>
							<CardDescription>What the customer booked.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								<div className="min-w-0 space-y-1 sm:col-span-2 lg:col-span-3">
									<p className="text-xs text-muted-foreground">Tour</p>
									<Link
										to="/tours/$tourId"
										params={{ tourId: tour.id }}
										className="text-sm font-medium text-primary underline-offset-4 hover:underline"
									>
										{tour.title}
									</Link>
								</div>
								<DetailItem label="Departure" value={departure.code} />
								<DetailItem
									label="Travel dates"
									value={`${formatDate(departure.startDate)} – ${formatDate(departure.endDate)}`}
								/>
								<DetailItem label="Room type" value={formatLabel(b.roomType)} />
								<DetailItem label="Adults" value={b.adultCount} />
								<DetailItem label="Children" value={b.childCount} />
								<DetailItem label="Source" value={formatLabel(b.source)} />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>
								Travellers
								{travellers.length > 0 && ` (${travellers.length})`}
							</CardTitle>
							<CardDescription>
								Details of everyone travelling on this booking.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{travellers.length > 0 ? (
								travellers.map((t) => (
									<TravellerCard key={t.id} traveller={t} />
								))
							) : (
								<p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
									No traveller details were added to this booking.
								</p>
							)}
						</CardContent>
					</Card>

					{(b.specialRequests || b.cancellationReason) && (
						<Card>
							<CardHeader>
								<CardTitle>Requests and reasons</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{b.specialRequests && (
									<div className="space-y-1.5">
										<h3 className="text-sm font-semibold">Special requests</h3>
										<p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
											{b.specialRequests}
										</p>
									</div>
								)}
								{b.specialRequests && b.cancellationReason && <Separator />}
								{b.cancellationReason && (
									<div className="space-y-1.5">
										<h3 className="text-sm font-semibold text-red-700">
											Cancellation reason
										</h3>
										<p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
											{b.cancellationReason}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{addons.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Add-ons</CardTitle>
								<CardDescription>Extras selected at checkout.</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="divide-y">
									{addons.map((addon, index) => {
										const name = String(
											addon.name ?? addon.title ?? `Add-on ${index + 1}`,
										);
										const price = Number(addon.price ?? addon.amount ?? NaN);
										const qty = Number(addon.quantity ?? addon.qty ?? NaN);
										return (
											<li
												// biome-ignore lint/suspicious/noArrayIndexKey: snapshot rows have no stable id
												key={index}
												className="flex items-center justify-between gap-3 py-2.5 text-sm"
											>
												<span>
													{name}
													{!Number.isNaN(qty) && qty > 1 && (
														<span className="text-muted-foreground">
															{" "}
															× {qty}
														</span>
													)}
												</span>
												{!Number.isNaN(price) && (
													<span className="font-medium">
														{formatCurrency(price)}
													</span>
												)}
											</li>
										);
									})}
								</ul>
							</CardContent>
						</Card>
					)}

					<NotesCard
						key={String(b.updatedAt)}
						bookingId={b.id}
						initial={b.internalNotes}
					/>
				</div>

				{/* Sidebar */}
				<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
					<Card>
						<CardHeader>
							<CardTitle>Payment</CardTitle>
							<CardDescription>All amounts in INR.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<AmountRow label="Subtotal" value={b.subtotalAmount} />
							{b.addonAmount > 0 && (
								<AmountRow label="Add-ons" value={b.addonAmount} />
							)}
							{b.discountAmount > 0 && (
								<AmountRow label="Discount" value={b.discountAmount} negative />
							)}
							{b.taxAmount > 0 && <AmountRow label="Tax" value={b.taxAmount} />}
							<Separator />
							<AmountRow label="Total" value={b.totalAmount} bold />

							<div className="space-y-1.5 pt-1">
								<div className="h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-emerald-500"
										style={{ width: `${paidPercent}%` }}
									/>
								</div>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>Paid {formatCurrency(b.paidAmount)}</span>
									<span
										className={
											b.dueAmount > 0 ? "font-medium text-amber-700" : ""
										}
									>
										Due {formatCurrency(b.dueAmount)}
									</span>
								</div>
							</div>

							{b.couponId && (
								<p className="break-all pt-1 text-xs text-muted-foreground">
									Coupon applied: {b.couponId}
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Customer</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<DetailItem label="Name" value={b.contactName} />
							<DetailItem label="City" value={b.contactCity} />

							<div className="space-y-2">
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
									asChild
								>
									<a href={`mailto:${b.contactEmail}`}>
										<Mail className="mr-2 size-4" />
										<span className="truncate">{b.contactEmail}</span>
									</a>
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
									asChild
								>
									<a href={`tel:${b.contactPhone}`}>
										<Phone className="mr-2 size-4" />
										{b.contactPhone}
									</a>
								</Button>
								{phoneDigits && (
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start"
										asChild
									>
										<a
											href={`https://wa.me/${phoneDigits}`}
											target="_blank"
											rel="noreferrer"
										>
											<MessageCircle className="mr-2 size-4" />
											WhatsApp
										</a>
									</Button>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								<TimelineItem label="Booked" date={b.bookedAt} />
								<TimelineItem label="Confirmed" date={b.confirmedAt} />
								<TimelineItem label="Completed" date={b.completedAt} />
								{b.cancelledAt && (
									<TimelineItem label="Cancelled" date={b.cancelledAt} />
								)}
							</ul>
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
