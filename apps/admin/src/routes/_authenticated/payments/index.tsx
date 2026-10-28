import { paymentMethods, paymentStatuses } from "@repo/db/schema/domestic.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertCircle,
	CalendarCheck,
	ChevronLeft,
	ChevronRight,
	Clock,
	Search,
	Wallet,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
	formatCurrency,
	formatDate,
	formatDateTime,
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
import { getPaymentStats, getPayments } from "#/server/actions/payments";

const PROVIDERS = ["razorpay", "cashfree", "manual"] as const;

const searchSchema = z.object({
	page: z.number().int().min(1).catch(1),
	q: z.string().optional().catch(undefined),
	status: z.string().optional().catch(undefined),
	method: z.string().optional().catch(undefined),
	provider: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/payments/")({
	validateSearch: searchSchema,
	component: PaymentsPage,
});

function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	loading,
}: {
	title: string;
	value: string;
	description?: string;
	icon: typeof Wallet;
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
					<>
						<p className="text-2xl font-semibold tracking-tight">{value}</p>
						{description && (
							<p className="text-xs text-muted-foreground">{description}</p>
						)}
					</>
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
			<SelectTrigger className="w-full sm:w-[150px]" aria-label={label}>
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

function PaymentsPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const fetchPayments = useServerFn(getPayments);
	const fetchStats = useServerFn(getPaymentStats);

	const update = (patch: Partial<z.infer<typeof searchSchema>>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

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
		queryKey: ["payments", search],
		queryFn: () => fetchPayments({ data: search }),
		placeholderData: keepPreviousData,
	});

	const stats = useQuery({
		queryKey: ["payments-stats"],
		queryFn: () => fetchStats(),
	});

	const hasFilters = Boolean(
		search.q || search.status || search.method || search.provider,
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
					Payments
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Track every payment attempt across online gateways and manual
					collections.
				</p>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Total collected"
					value={formatCurrency(stats.data?.collected)}
					icon={Wallet}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Collected this month"
					value={formatCurrency(stats.data?.thisMonth)}
					icon={CalendarCheck}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Awaiting payment"
					value={formatCurrency(stats.data?.pendingAmount)}
					description={`${stats.data?.pendingCount ?? 0} pending payment${stats.data?.pendingCount === 1 ? "" : "s"}`}
					icon={Clock}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Failed (last 30 days)"
					value={(stats.data?.failedCount ?? 0).toLocaleString("en-IN")}
					icon={AlertCircle}
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
						placeholder="Search by booking ref, customer, or gateway ID"
						className="pl-9"
					/>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<FilterSelect
						label="Status"
						value={search.status}
						options={paymentStatuses}
						onChange={(status) => update({ status, page: 1 })}
					/>
					<FilterSelect
						label="Methods"
						value={search.method}
						options={paymentMethods}
						onChange={(method) => update({ method, page: 1 })}
					/>
					<FilterSelect
						label="Providers"
						value={search.provider}
						options={PROVIDERS}
						onChange={(provider) => update({ provider, page: 1 })}
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
								Couldn't load payments.
							</p>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								Try again
							</Button>
						</div>
					) : rows.length === 0 ? (
						<div className="flex flex-col items-center px-5 py-14 text-center">
							<Wallet className="size-8 text-muted-foreground" />
							<h3 className="mt-3 text-sm font-semibold">
								{hasFilters
									? "No payments match these filters"
									: "No payments yet"}
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								{hasFilters
									? "Try removing a filter or searching for something else."
									: "Payments will appear here when customers pay or you record one."}
							</p>
						</div>
					) : (
						<div
							className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : ""}`}
						>
							<table className="w-full min-w-[920px] text-left text-sm">
								<thead className="border-b bg-muted/50 text-xs text-muted-foreground">
									<tr>
										<th className="px-4 py-3 font-medium">Payment</th>
										<th className="px-4 py-3 font-medium">Booking</th>
										<th className="px-4 py-3 font-medium">Amount</th>
										<th className="px-4 py-3 font-medium">Method</th>
										<th className="px-4 py-3 font-medium">Status</th>
										<th className="px-4 py-3 font-medium">Paid on</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{rows.map((p) => {
										const expired =
											p.status === "pending" &&
											p.expiresAt &&
											new Date(p.expiresAt).getTime() < Date.now();
										return (
											<tr key={p.id} className="hover:bg-muted/30">
												<td className="px-4 py-3 align-top">
													<Link
														to="/payments/$paymentId"
														params={{ paymentId: p.id }}
														className="font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline"
													>
														{p.id.slice(0, 8)}
													</Link>
													<p className="mt-0.5 text-xs text-muted-foreground">
														{formatDate(p.createdAt)}
													</p>
												</td>
												<td className="px-4 py-3 align-top">
													<Link
														to="/bookings/$bookingId"
														params={{ bookingId: p.bookingId }}
														className="font-mono text-xs font-medium underline-offset-4 hover:underline"
													>
														{p.bookingRef}
													</Link>
													<p className="mt-0.5 text-xs text-muted-foreground">
														{p.contactName}
													</p>
												</td>
												<td className="whitespace-nowrap px-4 py-3 align-top font-medium">
													{formatCurrency(p.amount)}
												</td>
												<td className="px-4 py-3 align-top">
													<p>{p.method ? formatLabel(p.method) : "—"}</p>
													<p className="text-xs text-muted-foreground">
														{formatLabel(p.provider)}
													</p>
												</td>
												<td className="px-4 py-3 align-top">
													<div className="flex flex-col items-start gap-1">
														<PaymentStatusBadge status={p.status} />
														{expired && (
															<span className="text-xs text-red-600">
																Expired
															</span>
														)}
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
													{p.paidAt ? formatDateTime(p.paidAt) : "—"}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

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
