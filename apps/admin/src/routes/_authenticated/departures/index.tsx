import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowDownUp,
	CalendarDays,
	CheckCircle2,
	Clock3,
	Eye,
	LoaderCircle,
	MapPin,
	PlaneTakeoff,
	RefreshCw,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";
import {
	getDashboardDepartures,
	removeDepature,
} from "#/server/actions/departures";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/departures/")({
	component: DeparturesPage,
});

type DepartureStatus =
	| "scheduled"
	| "full"
	| "closed"
	| "cancelled"
	| "completed";

type StatusFilter = "all" | DepartureStatus;

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

function formatStatus(status: DepartureStatus) {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClass(status: DepartureStatus) {
	switch (status) {
		case "scheduled":
			return "border-blue-200 bg-blue-50 text-blue-700";
		case "full":
			return "border-amber-200 bg-amber-50 text-amber-700";
		case "closed":
			return "border-slate-200 bg-slate-100 text-slate-600";
		case "cancelled":
			return "border-red-200 bg-red-50 text-red-700";
		case "completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700";
	}
}

function StatusBadge({ status }: { status: DepartureStatus }) {
	return (
		<Badge variant="outline" className={getStatusClass(status)}>
			{formatStatus(status)}
		</Badge>
	);
}

function DeparturesPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [sortByDate, setSortByDate] = useState<"earliest" | "latest">(
		"earliest",
	);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] =
		useState<boolean>(false);

	const fetchDepartures = useServerFn(getDashboardDepartures);
	const deleteDepature = useServerFn(removeDepature);

	const {
		data: departures = [],
		isPending,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["dashboard-departures"],
		queryFn: fetchDepartures,
	});

	const today = new Date();

	const stats = useMemo(() => {
		const upcoming = departures.filter(
			(departure) =>
				departure.startDate >= today &&
				departure.isActive &&
				!["cancelled", "completed", "closed"].includes(departure.status),
		);

		return {
			total: departures.length,
			scheduled: departures.filter(
				(departure) => departure.status === "scheduled" && departure.isActive,
			).length,
			fullyBooked: departures.filter((departure) => departure.status === "full")
				.length,
			availableSeats: upcoming.reduce(
				(total, departure) => total + departure.availableSeats,
				0,
			),
		};
	}, [departures, today]);

	const filteredDepartures = useMemo(() => {
		const query = search.trim().toLowerCase();

		const filtered = departures.filter((departure) => {
			const matchesSearch =
				!query ||
				departure.tourTitle?.toLowerCase().includes(query) ||
				departure.code.toLowerCase().includes(query) ||
				departure.destination?.toLowerCase().includes(query);

			const matchesStatus =
				statusFilter === "all" || departure.status === statusFilter;

			return matchesSearch && matchesStatus;
		});

		return filtered.sort((a, b) => {
			const comparison = a.startDate.getTime() - b.startDate.getTime();

			return sortByDate === "earliest" ? comparison : -comparison;
		});
	}, [departures, search, statusFilter, sortByDate]);

	function resetFilters() {
		setSearch("");
		setStatusFilter("all");
	}

	const handleDeleteDeparture = async (id: string) => {
		try {
			setDeleting(true);
			setDeleteAlertDialogOpen(true);
			const result = await deleteDepature({ data: { departureId: id } });
			if (!result) {
				toast.error(`Error removing departure: ${id}`);
			}
			toast.success(`successfully removed departure: ${id}`);
			refetch();
		} catch (err) {
			console.error(`Error removing departure: ${id}`, err);
		} finally {
			setDeleting(false);
			setDeleteAlertDialogOpen(false);
		}
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page heading */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Departures
					</h1>

					<p className="text-sm text-muted-foreground">
						Schedule tour batches, manage seat availability, and track upcoming
						departures.
					</p>
				</div>
			</section>

			{/* Summary cards */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Total departures"
					value={stats.total}
					description="Across all batches"
					icon={CalendarDays}
					iconClass="bg-blue-50 text-blue-600"
					isLoading={isPending}
				/>

				<StatCard
					title="Scheduled"
					value={stats.scheduled}
					description="Active scheduled batches"
					icon={PlaneTakeoff}
					iconClass="bg-emerald-50 text-emerald-600"
					isLoading={isPending}
				/>

				<StatCard
					title="Fully booked"
					value={stats.fullyBooked}
					description="No seats remaining"
					icon={Users}
					iconClass="bg-amber-50 text-amber-600"
					isLoading={isPending}
				/>

				<StatCard
					title="Available seats"
					value={stats.availableSeats}
					description="Across upcoming departures"
					icon={CheckCircle2}
					iconClass="bg-violet-50 text-violet-600"
					isLoading={isPending}
				/>
			</section>

			{/* Departure table */}
			<Card className="gap-0 overflow-hidden py-0">
				<CardHeader className="flex flex-row items-center justify-between gap-3 p-5">
					<div>
						<CardTitle>All departures</CardTitle>

						<p className="mt-1 text-sm text-muted-foreground">
							Manage departure dates and passenger capacity.
						</p>
					</div>

					<Badge variant="secondary">
						{filteredDepartures.length}{" "}
						{filteredDepartures.length === 1 ? "batch" : "batches"}
					</Badge>
				</CardHeader>

				{/* Search and filters */}
				<div className="flex flex-col gap-3 border-y bg-muted/20 p-4 sm:flex-row sm:items-center">
					<div className="relative min-w-0 flex-1 sm:max-w-md">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by tour, destination, or code..."
							className="bg-background pl-9"
							aria-label="Search departures"
						/>
					</div>

					<div className="flex gap-3">
						<Select
							defaultValue="all"
							value={statusFilter}
							onValueChange={(value) => setStatusFilter(value as StatusFilter)}
						>
							<SelectTrigger
								className="w-[180px]"
								aria-label="Filter departures by status"
							>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel>Status filter</SelectLabel>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="scheduled">Scheduled</SelectItem>
									<SelectItem value="full">Full</SelectItem>
									<SelectItem value="closed">Closed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="icon"
							aria-label={`Sort by ${sortByDate === "earliest" ? "latest" : "earliest"} departure date`}
							title={`Sort by ${sortByDate === "earliest" ? "latest" : "earliest"} date`}
							onClick={() =>
								setSortByDate((current) =>
									current === "earliest" ? "latest" : "earliest",
								)
							}
						>
							<ArrowDownUp className="size-4" />
						</Button>

						<Button variant="outline" size={"icon"} onClick={() => refetch()}>
							<RefreshCw className={cn(isFetching ? "animate-spin" : "")} />
						</Button>
					</div>
				</div>

				{/* Table */}
				<Table className="min-w-[1050px]">
					<TableHeader className="bg-muted/30">
						<TableRow className="hover:bg-transparent">
							<TableHead className="px-5">Tour / Batch</TableHead>
							<TableHead className="px-5">Travel dates</TableHead>
							<TableHead className="px-5">Seat availability</TableHead>
							<TableHead className="px-5">Status</TableHead>
							<TableHead className="px-5">Guaranteed</TableHead>
							<TableHead className="px-5 text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					{isPending ? (
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell className="px-5 py-4">
										<div className="flex items-start gap-3">
											<Skeleton className="size-10 rounded-lg shrink-0" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-3 w-24" />
												<Skeleton className="h-3 w-16" />
											</div>
										</div>
									</TableCell>
									<TableCell className="px-5 py-4">
										<div className="space-y-2">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-20" />
										</div>
									</TableCell>
									<TableCell className="px-5 py-4">
										<div className="space-y-2 w-44">
											<div className="flex justify-between">
												<Skeleton className="h-3 w-16" />
												<Skeleton className="h-3 w-16" />
											</div>
											<Skeleton className="h-1.5 w-full rounded-full" />
											<Skeleton className="h-3 w-24" />
										</div>
									</TableCell>
									<TableCell className="px-5 py-4">
										<Skeleton className="h-5 w-20 rounded-full" />
									</TableCell>
									<TableCell className="px-5 py-4">
										<Skeleton className="h-5 w-12 rounded-full" />
									</TableCell>
									<TableCell className="px-5 py-4 text-right">
										<Skeleton className="h-8 w-24 ml-auto rounded-md" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : (
						<TableBody>
							{filteredDepartures.map((departure) => {
								const bookedSeats =
									departure.totalSeats - departure.availableSeats;

								const occupiedPercentage =
									departure.totalSeats > 0
										? Math.min(
												100,
												Math.round((bookedSeats / departure.totalSeats) * 100),
											)
										: 0;

								return (
									<TableRow key={departure.id}>
										{/* Tour and batch */}
										<TableCell className="px-5 py-4">
											<div className="flex items-start gap-3">
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
													<PlaneTakeoff className="size-5 text-muted-foreground" />
												</div>

												<div className="min-w-0">
													<p className="font-medium">{departure.tourTitle}</p>

													<p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
														<MapPin className="size-3 shrink-0" />
														{departure.destination}
													</p>

													<p className="mt-1 font-mono text-xs text-muted-foreground">
														{departure.code}
													</p>
												</div>
											</div>
										</TableCell>

										{/* Dates */}
										<TableCell className="px-5 py-4">
											<div className="flex items-start gap-2">
												<CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

												<div>
													<p className="font-medium">
														{formatDate(departure.startDate)}
													</p>
													<p className="mt-1 text-xs text-muted-foreground">
														to {formatDate(departure.endDate)}
													</p>
												</div>
											</div>
										</TableCell>

										{/* Seats */}
										<TableCell className="px-5 py-4">
											<div className="w-44 space-y-2">
												<div className="flex items-center justify-between gap-3 text-xs">
													<span className="font-medium">
														{departure.availableSeats} available
													</span>

													<span className="text-muted-foreground">
														{departure.totalSeats} total
													</span>
												</div>

												<Progress
													value={occupiedPercentage}
													aria-label={`${departure.tourTitle} seats occupied`}
													className={`h-1.5 ${
														occupiedPercentage >= 90
															? "[&>div]:bg-amber-500"
															: ""
													}`}
												/>

												<p className="text-xs text-muted-foreground">
													{bookedSeats} booked · {occupiedPercentage}% occupied
												</p>
											</div>
										</TableCell>

										{/* Status */}
										<TableCell className="px-5 py-4">
											<div className="flex flex-wrap items-center gap-2">
												<StatusBadge status={departure.status} />
												{!departure.isActive && (
													<Badge variant="secondary">Inactive</Badge>
												)}
											</div>
										</TableCell>

										{/* Guaranteed */}
										<TableCell className="px-5 py-4">
											{departure.isGuaranteed ? (
												<Badge
													variant="outline"
													className="border-emerald-200 bg-emerald-50 text-emerald-700"
												>
													<CheckCircle2 className="mr-1 size-3" />
													Yes
												</Badge>
											) : (
												<span className="text-sm text-muted-foreground">
													No
												</span>
											)}
										</TableCell>

										{/* Actions */}
										<TableCell className="px-5 py-4 text-right">
											<div className="flex gap-2 items-center justify-center">
												<Button variant="outline" size="sm" asChild>
													<Link
														to="/tours/$tourId"
														params={{ tourId: departure.tourId }}
													>
														<Eye className="mr-2 size-4" />
														View tour
													</Link>
												</Button>
												<AlertDialog open={deleteAlertDialogOpen}>
													<AlertDialogTrigger
														onClick={() => setDeleteAlertDialogOpen(true)}
													>
														<Button size={"icon"}>
															<Trash2 />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
																<Trash2 />
															</AlertDialogMedia>
															<AlertDialogTitle>
																Are you absolutely sure?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will
																permanently delete{" "}
																<span className="text-destructive font-bold">
																	{departure.code}
																</span>{" "}
																from data-base.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel
																variant={"outline"}
																onClick={() => setDeleteAlertDialogOpen(false)}
															>
																Cancel
															</AlertDialogCancel>
															<AlertDialogAction
																variant={"destructive"}
																onClick={() =>
																	handleDeleteDeparture(departure.id)
																}
															>
																{deleting ? (
																	<LoaderCircle className="animate-spin" />
																) : (
																	"Continue"
																)}
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								);
							})}

							{/* Empty state */}
							{filteredDepartures.length === 0 && (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={6} className="px-6 py-16">
										<div className="flex flex-col items-center justify-center text-center">
											<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
												<Search className="size-5 text-muted-foreground" />
											</div>

											<h3 className="font-semibold">No departures found</h3>

											<p className="mt-1 max-w-sm text-sm text-muted-foreground">
												No departures match your search or selected status. Try
												changing the filters.
											</p>

											<Button
												variant="outline"
												className="mt-4"
												onClick={resetFilters}
											>
												Clear filters
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
				</Table>

				{/* Table footer */}
				<div className="flex flex-col gap-2 border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<span>
						Showing {filteredDepartures.length} of {departures.length}{" "}
						departures
					</span>

					<span className="flex items-center gap-1">
						<Clock3 className="size-3.5" />
						Sorted by {sortByDate === "earliest" ? "earliest" : "latest"} date
					</span>
				</div>
			</Card>
		</main>
	);
}

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	iconClass,
	isLoading,
}: {
	title: string;
	value: number;
	description: string;
	icon: typeof CalendarDays;
	iconClass: string;
	isLoading: boolean;
}) {
	return (
		<Card className="gap-4 py-5">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-0">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>

				<div
					className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
				>
					<Icon className="size-5" />
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				{isLoading ? (
					<Skeleton className="h-10 w-20" />
				) : (
					<p className="text-2xl font-semibold tracking-tight">
						{value.toLocaleString("en-IN")}
					</p>
				)}

				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
