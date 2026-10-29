import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, type LinkProps } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	CalendarDays,
	CheckCircle2,
	Clock3,
	Compass,
	MapPin,
	Minus,
	Plus,
	RefreshCw,
	Undo2,
	UserCheck,
	Users,
	Wallet,
} from "lucide-react";
import {
	BookingStatusBadge,
	formatCurrency,
	formatDate,
} from "#/components/bookings/booking-ui";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { authClient } from "#/lib/auth-client";
import { getDashboard } from "#/server/actions/dashboard";

export const Route = createFileRoute("/_authenticated/")({
	component: DashboardPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function daysUntil(date: Date | string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const target = new Date(date);
	target.setHours(0, 0, 0, 0);
	return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function relativeDay(date: Date | string) {
	const n = daysUntil(date);
	if (n <= 0) return "Today";
	if (n === 1) return "Tomorrow";
	return `In ${n} days`;
}

/** `null` means there's nothing to compare against (e.g. last month was zero). */
function Change({ value }: { value: number | null }) {
	if (value === null) {
		return (
			<span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
				<Minus className="size-3.5" />
				No comparison
			</span>
		);
	}
	const up = value >= 0;
	const Icon = up ? ArrowUpRight : ArrowDownRight;
	return (
		<span
			className={`inline-flex items-center gap-1 font-medium ${up ? "text-emerald-600" : "text-red-600"}`}
		>
			<Icon className="size-3.5" />
			{up ? "+" : ""}
			{value}%
		</span>
	);
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function StatCard({
	title,
	value,
	icon: Icon,
	iconColor,
	iconBg,
	change,
	showChange = true,
	description,
}: {
	title: string;
	value: string;
	icon: typeof Wallet;
	iconColor: string;
	iconBg: string;
	change?: number | null;
	showChange?: boolean;
	description: string;
}) {
	return (
		<Card className="gap-4 py-5">
			<CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
				<CardDescription className="font-medium text-foreground">
					{title}
				</CardDescription>
				<div
					className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
				>
					<Icon className={`size-5 ${iconColor}`} />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="text-2xl font-semibold tracking-tight">{value}</div>
				<div className="flex flex-wrap items-center gap-2 text-xs">
					{showChange && <Change value={change ?? null} />}
					<span className="text-muted-foreground">{description}</span>
				</div>
			</CardContent>
		</Card>
	);
}

function AttentionLink({
	icon: Icon,
	count,
	label,
	hint,
	children,
}: {
	icon: typeof Clock3;
	count: string;
	label: string;
	hint: string;
	children?: never;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
				<Icon className="size-5 text-amber-600" />
			</div>
			<div className="min-w-0">
				<p className="text-sm font-medium">
					<span className="mr-1.5 text-base font-semibold">{count}</span>
					{label}
				</p>
				<p className="text-xs text-muted-foreground">{hint}</p>
			</div>
			<ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
		</div>
	);
}

function QuickAction({
	icon: Icon,
	title,
	description,
	link,
}: {
	icon: typeof Compass;
	title: string;
	description: string;
	link: React.ReactNode;
}) {
	return (
		<Card className="gap-4 py-5 transition-colors hover:border-primary/40">
			<CardContent className="flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
					<Icon className="size-5 text-primary" />
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-medium">{title}</h3>
					<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
						{description}
					</p>
					<div className="mt-2 text-xs">{link}</div>
				</div>
			</CardContent>
		</Card>
	);
}

const openLinkClass =
	"inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline";

function DashboardSkeleton() {
	return (
		<main className="min-w-0 space-y-8 p-4 md:p-6 lg:p-8" aria-busy="true">
			<div className="space-y-2">
				<div className="h-8 w-48 animate-pulse rounded bg-muted" />
				<div className="h-4 w-80 animate-pulse rounded bg-muted" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
				<div className="h-96 animate-pulse rounded-xl bg-muted" />
				<div className="h-96 animate-pulse rounded-xl bg-muted" />
			</div>
		</main>
	);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function DashboardPage() {
	const { data: session } = authClient.useSession();
	const fetchDashboard = useServerFn(getDashboard);

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fetchDashboard(),
		staleTime: 30_000,
		refetchInterval: 60_000, // keep the numbers fresh while the tab is open
	});

	if (isPending) return <DashboardSkeleton />;

	if (isError || !data) {
		return (
			<main className="p-4 md:p-6 lg:p-8">
				<Card className="mx-auto max-w-lg">
					<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
						<AlertTriangle className="size-6 text-red-600" />
						<h1 className="text-lg font-semibold">
							Couldn't load the dashboard
						</h1>
						<Button variant="outline" onClick={() => refetch()}>
							<RefreshCw className="mr-2 size-4" />
							Try again
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	const {
		stats,
		attention,
		revenueByMonth,
		recentBookings,
		upcomingDepartures,
	} = data;

	const firstName =
		session?.user.firstName || session?.user.name?.split(" ")[0] || null;

	const maxRevenue = Math.max(1, ...revenueByMonth.map((m) => m.revenue));
	const hasRevenue = revenueByMonth.some((m) => m.revenue > 0);

	const attentionCount =
		attention.pendingBookings +
		attention.pendingUsers +
		attention.pendingRefunds;

	return (
		<main className="min-w-0 space-y-8 p-4 md:p-6 lg:p-8">
			{/* Page heading */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						{firstName ? `Welcome back, ${firstName}` : "Dashboard"}
					</h1>
					<p className="text-sm text-muted-foreground">
						Here's an overview of your travel business.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" asChild>
						<Link to="/bookings" search={{ page: 1 }}>
							<CalendarDays className="mr-2 size-4" />
							View bookings
						</Link>
					</Button>
					<Button asChild>
						<Link to="/tours/new">
							<Plus className="mr-2 size-4" />
							Create tour
						</Link>
					</Button>
				</div>
			</section>

			{/* Statistics */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Bookings this month"
					value={stats.bookingsThisMonth.toLocaleString("en-IN")}
					icon={CalendarDays}
					iconColor="text-blue-600"
					iconBg="bg-blue-50"
					change={stats.bookingsChange}
					description="vs last month"
				/>
				<StatCard
					title="Revenue this month"
					value={formatCurrency(stats.revenueThisMonth)}
					icon={Wallet}
					iconColor="text-emerald-600"
					iconBg="bg-emerald-50"
					change={stats.revenueChange}
					description="payments received"
				/>
				<StatCard
					title="Active tours"
					value={stats.activeTours.toLocaleString("en-IN")}
					icon={Compass}
					iconColor="text-violet-600"
					iconBg="bg-violet-50"
					showChange={false}
					description={`${stats.draftTours} in draft or inactive`}
				/>
				<StatCard
					title="Outstanding balance"
					value={formatCurrency(stats.outstandingAmount)}
					icon={Users}
					iconColor="text-orange-600"
					iconBg="bg-orange-50"
					showChange={false}
					description={`across ${stats.outstandingBookings} booking${stats.outstandingBookings === 1 ? "" : "s"}`}
				/>
			</section>

			{/* Needs attention */}
			<section>
				<Card className="gap-4 py-5">
					<CardHeader className="pb-0">
						<CardTitle className="text-base">Needs your attention</CardTitle>
						<CardDescription>
							Things waiting on you before customers can move forward.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{attentionCount === 0 ? (
							<div className="flex items-center gap-3 text-sm text-muted-foreground">
								<CheckCircle2 className="size-5 text-emerald-600" />
								You're all caught up. Nothing is waiting for review.
							</div>
						) : (
							<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
								{attention.pendingBookings > 0 && (
									<Link
										to="/bookings"
										search={{ page: 1, status: "pending" }}
										className="rounded-lg border p-4 transition-colors hover:border-primary/40"
									>
										<AttentionLink
											icon={Clock3}
											count={String(attention.pendingBookings)}
											label={`booking${attention.pendingBookings === 1 ? "" : "s"} to confirm`}
											hint="Pending confirmation"
										/>
									</Link>
								)}
								{attention.pendingUsers > 0 && (
									<Link
										to="/users"
										search={{ page: 1, status: "pending" }}
										className="rounded-lg border p-4 transition-colors hover:border-primary/40"
									>
										<AttentionLink
											icon={UserCheck}
											count={String(attention.pendingUsers)}
											label={`account${attention.pendingUsers === 1 ? "" : "s"} to approve`}
											hint="Waiting for approval"
										/>
									</Link>
								)}
								{attention.pendingRefunds > 0 && (
									<Link
										// The refunds page isn't built yet; cast until the route exists.
										to={"/refunds" as LinkProps["to"]}
										search={{ status: "pending" } as never}
										className="rounded-lg border p-4 transition-colors hover:border-primary/40"
									>
										<AttentionLink
											icon={Undo2}
											count={String(attention.pendingRefunds)}
											label={`refund${attention.pendingRefunds === 1 ? "" : "s"} to process`}
											hint={`${formatCurrency(attention.pendingRefundAmount)} owed to customers`}
										/>
									</Link>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</section>

			{/* Main dashboard content */}
			<section className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">
				<div className="min-w-0 space-y-6">
					{/* Revenue trend */}
					<Card>
						<CardHeader>
							<CardTitle>Revenue</CardTitle>
							<CardDescription>
								Payments received over the last 6 months.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{hasRevenue ? (
								<div className="flex h-44 items-end gap-3">
									{revenueByMonth.map((m, index) => {
										const height = Math.max(
											m.revenue > 0 ? 6 : 2,
											(m.revenue / maxRevenue) * 100,
										);
										const isCurrent = index === revenueByMonth.length - 1;
										return (
											<div
												key={m.month}
												className="flex h-full flex-1 flex-col justify-end gap-2"
												title={`${m.label}: ${formatCurrency(m.revenue)}`}
											>
												<span className="text-center text-[11px] text-muted-foreground">
													{m.revenue > 0
														? `₹${new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(m.revenue)}`
														: ""}
												</span>
												<div
													className={`w-full rounded-t-md ${isCurrent ? "bg-primary" : "bg-primary/30"}`}
													style={{ height: `${height}%` }}
												/>
												<span className="text-center text-xs text-muted-foreground">
													{m.label}
												</span>
											</div>
										);
									})}
								</div>
							) : (
								<p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
									No payments received yet. Revenue will appear here once
									customers pay.
								</p>
							)}
						</CardContent>
					</Card>

					{/* Recent bookings */}
					<Card className="min-w-0 gap-0 overflow-hidden py-0">
						<CardHeader className="flex flex-row items-center justify-between gap-3 py-5">
							<div className="space-y-1">
								<CardTitle>Recent bookings</CardTitle>
								<CardDescription>
									The latest reservations made by your customers.
								</CardDescription>
							</div>
							<Button variant="ghost" size="sm" asChild>
								<Link to="/bookings" search={{ page: 1 }}>
									View all
									<ArrowRight className="ml-1 size-4" />
								</Link>
							</Button>
						</CardHeader>
						<Separator />
						<CardContent className="p-0">
							{recentBookings.length === 0 ? (
								<p className="px-5 py-10 text-center text-sm text-muted-foreground">
									No bookings yet.
								</p>
							) : (
								<div className="w-full overflow-x-auto">
									<table className="w-full text-left text-sm">
										<thead className="bg-muted/40 text-xs text-muted-foreground">
											<tr>
												<th className="px-5 py-3 font-medium">Customer</th>
												<th className="px-5 py-3 font-medium">Tour</th>
												<th className="px-5 py-3 font-medium">Amount</th>
												<th className="px-5 py-3 font-medium">Status</th>
											</tr>
										</thead>
										<tbody className="divide-y">
											{recentBookings.map((b) => (
												<tr
													key={b.id}
													className="transition-colors hover:bg-muted/30"
												>
													<td className="whitespace-nowrap px-5 py-4">
														<Link
															to="/bookings/$bookingId"
															params={{ bookingId: b.id }}
															className="font-medium underline-offset-4 hover:underline"
														>
															{b.contactName}
														</Link>
														<div className="mt-1 font-mono text-xs text-muted-foreground">
															{b.bookingRef}
														</div>
													</td>
													<td className="min-w-40 px-5 py-4">
														<div className="font-medium">{b.tourTitle}</div>
														<div className="mt-1 text-xs text-muted-foreground">
															{formatDate(b.departureStart)} · {b.travellers}{" "}
															guest{b.travellers === 1 ? "" : "s"}
														</div>
													</td>
													<td className="whitespace-nowrap px-5 py-4 font-medium">
														{formatCurrency(b.totalAmount)}
													</td>
													<td className="px-5 py-4">
														<BookingStatusBadge status={b.status} />
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Upcoming departures */}
				<Card className="gap-0 self-start py-0">
					<CardHeader className="py-5">
						<CardTitle>Upcoming departures</CardTitle>
						<CardDescription>
							Your next scheduled tours and how full they are.
						</CardDescription>
					</CardHeader>
					<Separator />
					<CardContent className="space-y-5 py-5">
						{upcomingDepartures.length === 0 ? (
							<p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
								No upcoming departures. Open a tour to schedule one.
							</p>
						) : (
							upcomingDepartures.map((d) => {
								const booked = Math.max(0, d.totalSeats - d.availableSeats);
								const percentage =
									d.totalSeats > 0
										? Math.min(100, Math.round((booked / d.totalSeats) * 100))
										: 0;
								const nearlyFull = percentage >= 90;

								return (
									<Link
										key={d.id}
										to="/tours/$tourId"
										params={{ tourId: d.tourId }}
										className="block space-y-3 rounded-lg p-1 transition-colors hover:bg-muted/40"
									>
										<div className="flex items-start gap-3">
											<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
												<MapPin className="size-5 text-primary" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">
													{d.tourTitle}
												</p>
												{d.destination && (
													<p className="mt-1 text-xs text-muted-foreground">
														{d.destination}
													</p>
												)}
												<div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
													<CalendarDays className="size-3.5" />
													{formatDate(d.startDate)} · {relativeDay(d.startDate)}
												</div>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">
													Seats booked
												</span>
												<span className="font-medium">
													{booked}/{d.totalSeats}
													{d.availableSeats === 0 && " · Sold out"}
												</span>
											</div>
											<div
												className="h-2 overflow-hidden rounded-full bg-muted"
												role="progressbar"
												aria-label={`${d.tourTitle} seats booked`}
												aria-valuemin={0}
												aria-valuemax={d.totalSeats}
												aria-valuenow={booked}
											>
												<div
													className={`h-full rounded-full ${nearlyFull ? "bg-amber-500" : "bg-primary"}`}
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									</Link>
								);
							})
						)}
					</CardContent>
				</Card>
			</section>

			{/* Quick actions */}
			<section className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Quick actions
					</h2>
					<p className="text-sm text-muted-foreground">
						Common tasks to help manage your travel business.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<QuickAction
						icon={Compass}
						title="Create a tour"
						description="Add a new travel package."
						link={
							<Link to="/tours/new" className={openLinkClass}>
								Open <ArrowRight className="size-3.5" />
							</Link>
						}
					/>
					<QuickAction
						icon={MapPin}
						title="Add a destination"
						description="Manage your travel destinations."
						link={
							<Link
								to={"/destinations/new" as LinkProps["to"]}
								className={openLinkClass}
							>
								Open <ArrowRight className="size-3.5" />
							</Link>
						}
					/>
					<QuickAction
						icon={CheckCircle2}
						title="Manage bookings"
						description="Review and update reservations."
						link={
							<Link
								to="/bookings"
								search={{ page: 1 }}
								className={openLinkClass}
							>
								Open <ArrowRight className="size-3.5" />
							</Link>
						}
					/>
					<QuickAction
						icon={UserCheck}
						title="Review accounts"
						description="Approve new agents and customers."
						link={
							<Link
								to="/users"
								search={{ page: 1, status: "pending" }}
								className={openLinkClass}
							>
								Open <ArrowRight className="size-3.5" />
							</Link>
						}
					/>
				</div>
			</section>
		</main>
	);
}
