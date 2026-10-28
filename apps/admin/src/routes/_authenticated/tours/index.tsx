import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowDownUp,
	CheckCircle2,
	CirclePlus,
	Compass,
	Eye,
	Loader2,
	MapPin,
	MoreHorizontal,
	Pencil,
	RefreshCw,
	Search,
	Star,
	Trash2,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
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
import { getDashboardTours, removeTour } from "#/server/actions/tours";
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

export const Route = createFileRoute("/_authenticated/tours/")({
	component: ToursPage,
});

type Tour = {
	id: string;
	title: string;
	code: string;
	destination: string | null;
	category: string;
	type: string;
	durationDays: number;
	durationNights: number;
	avgRating: number;
	reviewCount: number;
	bookingCount: number;
	isFeatured: boolean;
	isPublished: boolean;
	isActive: boolean;
};

type StatusFilter = "all" | "published" | "draft" | "inactive";

function getTourStatus(tour: Tour) {
	if (!tour.isActive) return "Inactive";
	if (!tour.isPublished) return "Draft";
	return "Published";
}

function getStatusClass(status: string) {
	switch (status) {
		case "Published":
			return "border-emerald-200 bg-emerald-50 text-emerald-700";
		case "Draft":
			return "border-amber-200 bg-amber-50 text-amber-700";
		case "Inactive":
			return "border-slate-200 bg-slate-100 text-slate-600";
		default:
			return "";
	}
}

function ToursPage() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");
	const [status, setStatus] = useState<StatusFilter>("all");
	const [sortBy, setSortBy] = useState<"title" | "bookings">("title");
	const [deleting, setDeleting] = useState<boolean>(false);
	const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] =
		useState<boolean>(false);

	const fetchTours = useServerFn(getDashboardTours);
	const deleteTour = useServerFn(removeTour);

	const {
		data: tours = [],
		isPending,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["dashboard-tours"],
		queryFn: fetchTours,
	});

	const categories = useMemo(
		() => [...new Set(tours.map((tour) => tour.category))].sort(),
		[tours],
	);

	const stats = useMemo(
		() => ({
			total: tours.length,
			published: tours.filter((tour) => tour.isActive && tour.isPublished)
				.length,
			drafts: tours.filter((tour) => tour.isActive && !tour.isPublished).length,
			inactive: tours.filter((tour) => !tour.isActive).length,
		}),
		[tours],
	);

	const filteredTours = useMemo(() => {
		const query = search.trim().toLowerCase();

		const result = tours.filter((tour) => {
			const matchesSearch =
				!query ||
				tour.title.toLowerCase().includes(query) ||
				tour.code.toLowerCase().includes(query) ||
				tour.destination?.toLowerCase().includes(query) ||
				tour.category.toLowerCase().includes(query);

			const matchesCategory = category === "all" || tour.category === category;

			const matchesStatus =
				status === "all" ||
				(status === "published" && tour.isPublished && tour.isActive) ||
				(status === "draft" && !tour.isPublished && tour.isActive) ||
				(status === "inactive" && !tour.isActive);

			return matchesSearch && matchesCategory && matchesStatus;
		});

		return result.sort((a, b) => {
			if (sortBy === "bookings") {
				return b.bookingCount - a.bookingCount;
			}

			return a.title.localeCompare(b.title);
		});
	}, [tours, search, category, status, sortBy]);

	function resetFilters() {
		setSearch("");
		setCategory("all");
		setStatus("all");
	}

	const handleDeleteTour = async (id: string) => {
		try {
			setDeleting(true);
			setDeleteAlertDialogOpen(true);
			const result = await deleteTour({ data: { tourId: id } });
			if (!result) {
				toast.error(`Error removing tour: ${id}`);
			}
			toast.success(`successfully removed tour: ${id}`);
			refetch();
		} catch (err) {
			console.error(`Error removing tour: ${id}`, err);
		} finally {
			setDeleting(false);
			setDeleteAlertDialogOpen(false);
		}
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Tours
					</h1>

					<p className="text-sm text-muted-foreground">
						Create, manage, and organize your travel packages.
					</p>
				</div>

				<Button asChild>
					<Link to="/tours/new">
						<CirclePlus className="mr-2 size-4" />
						Create tour
					</Link>
				</Button>
			</section>

			{/* Statistics */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<TourStatCard
					title="Total tours"
					value={stats.total}
					description="Across all categories"
					icon={Compass}
					iconClass="bg-blue-50 text-blue-600"
					isLoading={isPending}
				/>

				<TourStatCard
					title="Published"
					value={stats.published}
					description="Active and visible"
					icon={CheckCircle2}
					iconClass="bg-emerald-50 text-emerald-600"
					isLoading={isPending}
				/>

				<TourStatCard
					title="Drafts"
					value={stats.drafts}
					description="Not yet published"
					icon={Pencil}
					iconClass="bg-amber-50 text-amber-600"
					isLoading={isPending}
				/>

				<TourStatCard
					title="Inactive"
					value={stats.inactive}
					description="Currently disabled"
					icon={XCircle}
					iconClass="bg-slate-100 text-slate-600"
					isLoading={isPending}
				/>
			</section>

			{/* Tours table */}
			<Card className="gap-0 overflow-hidden py-0">
				{/* Table heading */}
				<div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
					<div>
						<h2 className="font-semibold">All tours</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Browse and manage your tour packages.
						</p>
					</div>

					<Badge variant="secondary" className="w-fit">
						{filteredTours.length}{" "}
						{filteredTours.length === 1 ? "tour" : "tours"}
					</Badge>
				</div>

				{/* Filters */}
				<div className="flex flex-col gap-3 border-y bg-muted/20 p-4 lg:flex-row lg:items-center">
					<div className="relative min-w-0 flex-1 lg:max-w-sm">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search tours, code, destination..."
							className="bg-background pl-9"
							aria-label="Search tours"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3 sm:flex">
						<Select
							value={category}
							onValueChange={(cat) => setCategory(cat)}
							aria-label="Filter by category"
							defaultValue="all"
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Categories</SelectLabel>
									<SelectItem key="all" value="all">
										All categories
									</SelectItem>
									{categories.map((item) => (
										<SelectItem key={item} value={item}>
											{item}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Select
							value={status}
							onValueChange={(value) => setStatus(value as StatusFilter)}
							aria-label="Filter by status"
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Status</SelectLabel>
									{["all", "published", "drafts", "inactive"].map((item) => (
										<SelectItem key={item} value={item}>
											{item[0].toUpperCase() + item.slice(1)}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="icon"
							aria-label="Toggle tour sort order"
							title="Toggle sort order"
							onClick={() =>
								setSortBy((current) =>
									current === "title" ? "bookings" : "title",
								)
							}
						>
							<ArrowDownUp className="size-4" />
						</Button>
					</div>
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={isFetching}
						aria-label="Refresh destinations"
						title="Refresh destinations"
					>
						<RefreshCw
							className={`size-4 ${isFetching ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
				</div>

				{/* Table */}
				<Table className="min-w-[850px]">
					<TableHeader className="bg-muted/30">
						<TableRow className="hover:bg-transparent">
							<TableHead className="h-11 px-5 text-xs">Tour</TableHead>
							<TableHead className="h-11 px-5 text-xs">Category</TableHead>
							<TableHead className="h-11 px-5 text-xs">Duration</TableHead>
							<TableHead className="h-11 px-5 text-xs">Performance</TableHead>
							<TableHead className="h-11 px-5 text-xs">Status</TableHead>
							<TableHead className="h-11 px-5 text-right text-xs">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					{isPending ? (
						<TableBody>
							{Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									{/* Tour information */}
									<TableCell className="px-5 py-4">
										<div className="flex items-center gap-3">
											{/* Image placeholder */}
											<Skeleton className="size-11 shrink-0 rounded-lg" />

											<div className="min-w-0 space-y-1.5">
												{/* Title placeholder */}
												<Skeleton className="h-4 w-40" />
												{/* Destination placeholder */}
												<Skeleton className="h-3 w-28" />
												{/* Code placeholder */}
												<Skeleton className="h-3 w-16" />
											</div>
										</div>
									</TableCell>

									{/* Category */}
									<TableCell className="px-5 py-4">
										<div className="space-y-2">
											<Skeleton className="h-5 w-20 rounded-full" />
											<Skeleton className="h-3 w-24" />
										</div>
									</TableCell>

									{/* Duration */}
									<TableCell className="px-5 py-4">
										<div className="space-y-2">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-3 w-16" />
										</div>
									</TableCell>

									{/* Performance */}
									<TableCell className="px-5 py-4">
										<div className="space-y-2">
											<Skeleton className="h-4 w-12" />
											<Skeleton className="h-3 w-20" />
										</div>
									</TableCell>

									{/* Status */}
									<TableCell className="px-5 py-4">
										<Skeleton className="h-5 w-24 rounded-full" />
									</TableCell>

									{/* Actions */}
									<TableCell className="px-5 py-4 text-right">
										<Skeleton className="ml-auto size-8 rounded-md" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : (
						<TableBody>
							{filteredTours.map((tour) => {
								const tourStatus = getTourStatus(tour);

								return (
									<TableRow key={tour.id}>
										{/* Tour information */}
										<TableCell className="px-5 py-4">
											<div className="flex items-center gap-3">
												{tour.coverImage ? (
													<img
														src={tour.coverImage}
														alt={tour.title}
														className="size-11 rounded-lg"
													/>
												) : (
													<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
														<Compass className="size-5 text-muted-foreground" />
													</div>
												)}

												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<Link
															to="/tours/$tourId"
															params={{ tourId: tour.id }}
															className="hover:underline"
														>
															<span className="font-medium">{tour.title}</span>
														</Link>

														{tour.isFeatured && (
															<Star
																className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
																aria-label="Featured tour"
															/>
														)}
													</div>

													<div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
														<MapPin className="size-3 shrink-0" />
														<span>{tour.destination}</span>
													</div>

													<p className="mt-1 text-xs text-muted-foreground">
														{tour.code}
													</p>
												</div>
											</div>
										</TableCell>
										{/* Category */}
										<TableCell className="px-5 py-4">
											<Badge variant="secondary">{tour.category}</Badge>
											<p className="mt-1 text-xs text-muted-foreground">
												{tour.type}
											</p>
										</TableCell>
										{/* Duration */}
										<TableCell className="px-5 py-4">
											<div className="font-medium">
												{tour.durationDays} days
											</div>
											<p className="mt-1 text-xs text-muted-foreground">
												{tour.durationNights} nights
											</p>
										</TableCell>
										{/* Performance */}
										<TableCell className="px-5 py-4">
											<div className="flex items-center gap-1 font-medium">
												<Star className="size-3.5 fill-amber-400 text-amber-400" />
												{tour.reviewCount > 0 ? tour.avgRating.toFixed(1) : "—"}
											</div>
											<p className="mt-1 text-xs text-muted-foreground">
												{tour.bookingCount} bookings
											</p>
										</TableCell>
										{/* Status */}
										<TableCell className="px-5 py-4">
											<Badge
												variant="outline"
												className={getStatusClass(tourStatus)}
											>
												{tourStatus}
											</Badge>
										</TableCell>
										{/* Actions */}
										<TableCell className="px-5 py-4 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														aria-label={`Actions for ${tour.title}`}
													>
														<MoreHorizontal className="size-4" />
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link
															to="/tours/$tourId"
															params={{ tourId: tour.id }}
														>
															<Eye className="mr-2 size-4" />
															View details
														</Link>
													</DropdownMenuItem>

													<DropdownMenuItem asChild>
														<Link
															to="/tours/$tourId/edit"
															params={{ tourId: tour.id }}
														>
															<Pencil className="mr-2 size-4" />
															Edit tour
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<AlertDialog open={deleteAlertDialogOpen}>
														<AlertDialogTrigger
															onClick={() => setDeleteAlertDialogOpen(true)}
														>
															<DropdownMenuItem
																disabled
																className="text-destructive focus:text-destructive"
																variant="destructive"
															>
																<Trash2 className="mr-2 size-4" />
																Delete tour
															</DropdownMenuItem>
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
																		{tour.title}
																	</span>{" "}
																	from data-base.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel
																	variant={"outline"}
																	onClick={() =>
																		setDeleteAlertDialogOpen(false)
																	}
																>
																	Cancel
																</AlertDialogCancel>
																<AlertDialogAction
																	variant={"destructive"}
																	onClick={() => handleDeleteTour(tour.id)}
																>
																	{deleting ? (
																		<Loader2 className="animate-spin" />
																	) : (
																		"Continue"
																	)}
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					)}
				</Table>

				{/* Empty state */}
				{filteredTours.length === 0 && (
					<div className="flex flex-col items-center justify-center px-6 py-16 text-center">
						<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
							<Search className="size-5 text-muted-foreground" />
						</div>

						<h3 className="font-semibold">No tours found</h3>

						<p className="mt-1 max-w-sm text-sm text-muted-foreground">
							Try adjusting your search or filters to find what you're looking
							for.
						</p>

						<Button variant="outline" className="mt-4" onClick={resetFilters}>
							Clear filters
						</Button>
					</div>
				)}

				{/* Table footer */}
				<div className="flex flex-col gap-2 border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<span>
						Showing {filteredTours.length} of {tours.length} tours
					</span>

					<span>
						Sort by: {sortBy === "title" ? "Tour name" : "Most bookings"}
					</span>
				</div>
			</Card>
		</main>
	);
}

function TourStatCard({
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
	icon: typeof Compass;
	iconClass: string;
	isLoading: boolean;
}) {
	return (
		<Card className="gap-4 py-5">
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between gap-3">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>

					<div
						className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
					>
						<Icon className="size-5" />
					</div>
				</div>
				{isLoading ? (
					<Skeleton className="h-10 w-20" />
				) : (
					<div className="text-2xl font-semibold tracking-tight">
						{value.toLocaleString("en-IN")}
					</div>
				)}

				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
