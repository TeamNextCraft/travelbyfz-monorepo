import { bookingStatuses, paymentStatuses } from "@repo/db/schema/domestic.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	Receipt,
	Search,
	Ticket,
	Wallet,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
	BOOKING_SOURCES,
	BookingStatusBadge,
	formatCurrency,
	formatDate,
	formatLabel,
	PaymentStatusBadge,
} from "#/components/bookings/booking-ui";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { getBookingStats, getBookings } from "#/server/actions/bookings";

/** Filters live in the URL, so they survive refresh and can be shared as links. */
const searchSchema = z.object({
	page: z.number().int().min(1).catch(1),
	q: z.string().optional().catch(undefined),
	status: z.string().optional().catch(undefined),
	paymentStatus: z.string().optional().catch(undefined),
	source: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/bookings/")({
	validateSearch: searchSchema,
	component: BookingsPage,
});

function MetricCard({
	title,
	value,
	icon: Icon,
	loading,
}: {
	title: string;
	value: string;
	icon: typeof Ticket;
	loading: boolean;
}) {
	return (
		<Card className="gap-3 py-5">
			<CardContent className="space-y-2">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<div className="flex size-9 items-center justify-center rounded-lg bg-muted">
						<Icon className="size-4 text-muted-foreground" />
					</div>
				</div>
				{loading ? (
					<div className="h-8 w-24 animate-pulse rounded bg-muted" />
				) : (
					<p className="text-2xl font-semibold tracking-tight">{value}</p>
				)}
			</CardContent>
		</Card>
	);
}

function FilterSelect({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value?: string;
	options: readonly string[];
	onChange: (value: string | undefined) => void;
}) {
	return (
		<Select
			value={value ?? "all"}
			onValueChange={(v) => onChange(v === "all" ? undefined : v)}
		>
			<SelectTrigger className="w-full sm:w-[160px]" aria-label={label}>
				<SelectValue placeholder={label} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All {label.toLowerCase()}</SelectItem>
				{options.map((o) => (
					<SelectItem key={o} value={o}>
						{formatLabel(o)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function BookingsPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const fetchBookings = useServerFn(getBookings);
	const fetchStats = useServerFn(getBookingStats);

	const update = (patch: Partial<z.infer<typeof searchSchema>>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	// Debounced search box -> URL
	const [searchText, setSearchText] = useState(search.q ?? "");
	useEffect(() => {
		const timer = setTimeout(() => {
			const next = searchText.trim() || undefined;
			if (next !== search.q) update({ q: next, page: 1 });
		}, 300);
		return () => clearTimeout(timer);
		// biome-ignore lint/correctness/useExhaustiveDependencies: only react to typing
	}, [searchText]);

	const { data, isPending, isError, isFetching, refetch } = useQuery({
		queryKey: ["bookings", search],
		queryFn: () => fetchBookings({ data: search }),
		placeholderData: keepPreviousData,
	});

	const stats = useQuery({
		queryKey: ["bookings-stats"],
		queryFn: () => fetchStats(),
	});

	const hasFilters = Boolean(
		search.q || search.status || search.paymentStatus || search.source,
	);

	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const pageSize = data?.pageSize ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (search.page - 1) * pageSize + 1;
	const to = Math.min(total, search.page * pageSize);

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Bookings
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Review, confirm and manage customer bookings.
				</p>
			</section>

			{/* Stats */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Total bookings"
					value={(stats.data?.total ?? 0).toLocaleString("en-IN")}
					icon={Ticket}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Pending confirmation"
					value={(stats.data?.pending ?? 0).toLocaleString("en-IN")}
					icon={Clock}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Payments collected"
					value={formatCurrency(stats.data?.collected)}
					icon={Wallet}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Outstanding balance"
					value={formatCurrency(stats.data?.outstanding)}
					icon={Receipt}
					loading={stats.isPending}
				/>
			</section>

			{/* Filters */}
			<section className="flex flex-col gap-3 lg:flex-row lg:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search by reference, name, email or phone"
						className="pl-9"
					/>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<FilterSelect
						label="Status"
						value={search.status}
						options={bookingStatuses}
						onChange={(status) => update({ status, page: 1 })}
					/>
					<FilterSelect
						label="Payment"
						value={search.paymentStatus}
						options={paymentStatuses}
						onChange={(paymentStatus) => update({ paymentStatus, page: 1 })}
					/>
					<FilterSelect
						label="Source"
						value={search.source}
						options={BOOKING_SOURCES}
						onChange={(source) => update({ source, page: 1 })}
					/>
					{hasFilters && (
						<Button
							variant="ghost"
							onClick={() => {
								setSearchText("");
								navigate({ search: { page: 1 }, replace: true });
							}}
						>
							<X className="mr-2 size-4" />
							Clear
						</Button>
					)}
				</div>
			</section>

			{/* Table */}
			<Card className="py-0">
				<CardContent className="p-0">
					{isPending ? (
						<div className="space-y-2 p-4" aria-busy="true">
							{[0, 1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-14 animate-pulse rounded-md bg-muted"
								/>
							))}
						</div>
					) : isError ? (
						<div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
							<p className="text-sm text-muted-foreground">
								Couldn't load bookings.
							</p>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								Try again
							</Button>
						</div>
					) : rows.length === 0 ? (
						<div className="flex flex-col items-center px-5 py-14 text-center">
							<Ticket className="size-8 text-muted-foreground" />
							<h3 className="mt-3 text-sm font-semibold">
								{hasFilters
									? "No bookings match these filters"
									: "No bookings yet"}
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								{hasFilters
									? "Try removing a filter or searching for something else."
									: "Bookings will show up here as customers book tours."}
							</p>
						</div>
					) : (
						<div
							className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : ""}`}
						>
							<table className="w-full min-w-[960px] text-left text-sm">
								<thead className="border-b bg-muted/50 text-xs text-muted-foreground">
									<tr>
										<th className="px-4 py-3 font-medium">Booking</th>
										<th className="px-4 py-3 font-medium">Customer</th>
										<th className="px-4 py-3 font-medium">Tour & departure</th>
										<th className="px-4 py-3 font-medium">Travellers</th>
										<th className="px-4 py-3 font-medium">Amount</th>
										<th className="px-4 py-3 font-medium">Status</th>
										<th className="px-4 py-3 font-medium">Payment</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{rows.map((b) => (
										<tr key={b.id} className="hover:bg-muted/30">
											<td className="px-4 py-3 align-top">
												<Link
													to="/bookings/$bookingId"
													params={{ bookingId: b.id }}
													className="font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline"
												>
													{b.bookingRef}
												</Link>
												<p className="mt-0.5 text-xs text-muted-foreground">
													{formatDate(b.bookedAt)} · {formatLabel(b.source)}
												</p>
											</td>
											<td className="px-4 py-3 align-top">
												<p className="font-medium">{b.contactName}</p>
												<p className="text-xs text-muted-foreground">
													{b.contactPhone}
												</p>
											</td>
											<td className="max-w-[240px] px-4 py-3 align-top">
												<p className="truncate font-medium">{b.tourTitle}</p>
												<p className="text-xs text-muted-foreground">
													{b.departureCode} · {formatDate(b.departureStart)}
												</p>
											</td>
											<td className="whitespace-nowrap px-4 py-3 align-top">
												{b.adultCount} adult{b.adultCount === 1 ? "" : "s"}
												{b.childCount > 0 &&
													`, ${b.childCount} child${b.childCount === 1 ? "" : "ren"}`}
											</td>
											<td className="whitespace-nowrap px-4 py-3 align-top">
												<p className="font-medium">
													{formatCurrency(b.totalAmount)}
												</p>
												{b.dueAmount > 0 && b.status !== "cancelled" && (
													<p className="text-xs text-amber-700">
														{formatCurrency(b.dueAmount)} due
													</p>
												)}
											</td>
											<td className="px-4 py-3 align-top">
												<BookingStatusBadge status={b.status} />
											</td>
											<td className="px-4 py-3 align-top">
												<PaymentStatusBadge status={b.paymentStatus} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{total > 0 && (
				<section className="flex items-center justify-between gap-3">
					<p className="text-sm text-muted-foreground">
						Showing {from}–{to} of {total.toLocaleString("en-IN")}
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={search.page <= 1}
							onClick={() => update({ page: search.page - 1 })}
						>
							<ChevronLeft className="mr-1 size-4" />
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {search.page} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={search.page >= totalPages}
							onClick={() => update({ page: search.page + 1 })}
						>
							Next
							<ChevronRight className="ml-1 size-4" />
						</Button>
					</div>
				</section>
			)}
		</main>
	);
}
