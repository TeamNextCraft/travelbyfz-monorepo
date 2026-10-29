import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	CalendarClock,
	Check,
	ChevronLeft,
	ChevronRight,
	Copy,
	IndianRupee,
	Loader2,
	Pencil,
	Plus,
	Search,
	Ticket,
	TicketPercent,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	formatCurrency,
	formatDate,
	formatLabel,
} from "#/components/bookings/booking-ui";
import {
	CouponStatusBadge,
	couponStatuses,
	describeDiscount,
	formatInr,
	getCouponStatus,
} from "#/components/coupons/coupon-ui";
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
import {
	getCouponStats,
	getCoupons,
	setCouponActive,
} from "#/server/actions/coupons";

const searchSchema = z.object({
	page: z.number().int().min(1).catch(1),
	q: z.string().optional().catch(undefined),
	status: z.string().optional().catch(undefined),
	type: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/coupons/")({
	validateSearch: searchSchema,
	component: CouponsPage,
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

function CopyCode({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className="size-6"
			aria-label={`Copy ${code}`}
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(code);
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
	);
}

function CouponsPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();

	const fetchCoupons = useServerFn(getCoupons);
	const fetchStats = useServerFn(getCouponStats);
	const toggleActive = useServerFn(setCouponActive);

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
		queryKey: ["coupons", search],
		queryFn: () => fetchCoupons({ data: search }),
		placeholderData: keepPreviousData,
	});

	const stats = useQuery({
		queryKey: ["coupons-stats"],
		queryFn: () => fetchStats(),
	});

	const toggle = useMutation({
		mutationFn: (input: { id: string; isActive: boolean }) =>
			toggleActive({ data: input }),
		onSuccess: (_, vars) => {
			toast.success(vars.isActive ? "Coupon activated" : "Coupon deactivated");
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
			queryClient.invalidateQueries({ queryKey: ["coupons-stats"] });
		},
		onError: () => toast.error("Couldn't update the coupon"),
	});

	const hasFilters = Boolean(search.q || search.status || search.type);

	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const pageSize = data?.pageSize ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (search.page - 1) * pageSize + 1;
	const to = Math.min(total, search.page * pageSize);

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Coupons
					</h1>
					<p className="text-sm text-muted-foreground">
						Create and manage discount codes for your tours.
					</p>
				</div>
				<Button asChild>
					<Link to="/coupons/new">
						<Plus className="mr-2 size-4" />
						Create coupon
					</Link>
				</Button>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Active coupons"
					value={(stats.data?.active ?? 0).toLocaleString("en-IN")}
					description={`of ${stats.data?.total ?? 0} total`}
					icon={TicketPercent}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Expiring in 7 days"
					value={(stats.data?.expiringSoon ?? 0).toLocaleString("en-IN")}
					icon={CalendarClock}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Total redemptions"
					value={(stats.data?.redemptions ?? 0).toLocaleString("en-IN")}
					icon={Ticket}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Discount given"
					value={formatCurrency(stats.data?.discountGiven)}
					description="on non-cancelled bookings"
					icon={IndianRupee}
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
						placeholder="Search by code or title"
						className="pl-9"
					/>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<FilterSelect
						label="Status"
						value={search.status}
						options={couponStatuses}
						onChange={(status) => update({ status, page: 1 })}
					/>
					<FilterSelect
						label="Types"
						value={search.type}
						options={["percentage", "flat"]}
						onChange={(type) => update({ type, page: 1 })}
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
								Couldn't load coupons.
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
									? "No coupons match these filters"
									: "No coupons yet"}
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								{hasFilters
									? "Try removing a filter or searching for something else."
									: "Create your first discount code to run a promotion."}
							</p>
							{!hasFilters && (
								<Button className="mt-4" size="sm" asChild>
									<Link to="/coupons/new">
										<Plus className="mr-2 size-4" />
										Create coupon
									</Link>
								</Button>
							)}
						</div>
					) : (
						<div
							className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : ""}`}
						>
							<table className="w-full min-w-[960px] text-left text-sm">
								<thead className="border-b bg-muted/50 text-xs text-muted-foreground">
									<tr>
										<th className="px-4 py-3 font-medium">Coupon</th>
										<th className="px-4 py-3 font-medium">Discount</th>
										<th className="px-4 py-3 font-medium">Usage</th>
										<th className="px-4 py-3 font-medium">Validity</th>
										<th className="px-4 py-3 font-medium">Status</th>
										<th className="px-4 py-3" />
									</tr>
								</thead>
								<tbody className="divide-y">
									{rows.map((c) => {
										const status = getCouponStatus(c);
										const usedPercent =
											c.usageLimit && c.usageLimit > 0
												? Math.min(100, (c.usedCount / c.usageLimit) * 100)
												: 0;
										const daysLeft =
											status === "active" && c.expiresAt
												? Math.ceil(
														(new Date(c.expiresAt).getTime() - Date.now()) /
															86_400_000,
													)
												: null;
										const dimmed =
											status === "inactive" || status === "expired";

										return (
											<tr
												key={c.id}
												className={`hover:bg-muted/30 ${dimmed ? "opacity-60" : ""}`}
											>
												<td className="px-4 py-3 align-top">
													<div className="flex items-center gap-1">
														<Link
															to="/coupons/$couponId/edit"
															params={{ couponId: c.id }}
															className="font-mono text-xs font-semibold underline-offset-4 hover:underline"
														>
															{c.code}
														</Link>
														<CopyCode code={c.code} />
													</div>
													{c.title && (
														<p className="mt-0.5 text-xs text-muted-foreground">
															{c.title}
														</p>
													)}
												</td>
												<td className="px-4 py-3 align-top">
													<p className="font-medium">{describeDiscount(c)}</p>
													{c.minBookingAmount ? (
														<p className="text-xs text-muted-foreground">
															Min. booking {formatInr(c.minBookingAmount)}
														</p>
													) : null}
												</td>
												<td className="min-w-[130px] px-4 py-3 align-top">
													{c.usageLimit ? (
														<div className="space-y-1">
															<div className="h-1.5 overflow-hidden rounded-full bg-muted">
																<div
																	className={`h-full rounded-full ${usedPercent >= 90 ? "bg-amber-500" : "bg-primary"}`}
																	style={{ width: `${usedPercent}%` }}
																/>
															</div>
															<p className="text-xs text-muted-foreground">
																{c.usedCount} of {c.usageLimit} used
															</p>
														</div>
													) : (
														<p className="text-xs text-muted-foreground">
															{c.usedCount} used · Unlimited
														</p>
													)}
												</td>
												<td className="whitespace-nowrap px-4 py-3 align-top">
													<p>
														{c.startsAt
															? formatDate(c.startsAt)
															: "Immediately"}
														{" – "}
														{c.expiresAt
															? formatDate(c.expiresAt)
															: "No expiry"}
													</p>
													{daysLeft !== null && daysLeft <= 7 && (
														<p className="text-xs text-amber-700">
															Ends{" "}
															{daysLeft <= 0
																? "today"
																: `in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
														</p>
													)}
												</td>
												<td className="px-4 py-3 align-top">
													<CouponStatusBadge status={status} />
												</td>
												<td className="px-4 py-3 text-right align-top">
													<div className="flex items-center justify-end gap-1">
														<Button variant="ghost" size="sm" asChild>
															<Link
																to="/coupons/$couponId/edit"
																params={{ couponId: c.id }}
															>
																<Pencil className="mr-1.5 size-3.5" />
																Edit
															</Link>
														</Button>
														<Button
															variant="ghost"
															size="sm"
															disabled={toggle.isPending}
															onClick={() =>
																toggle.mutate({
																	id: c.id,
																	isActive: !c.isActive,
																})
															}
														>
															{toggle.isPending &&
																toggle.variables?.id === c.id && (
																	<Loader2 className="mr-1.5 size-3.5 animate-spin" />
																)}
															{c.isActive ? "Deactivate" : "Activate"}
														</Button>
													</div>
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
