import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertCircle,
	Eye,
	Filter,
	Globe,
	Loader2,
	Map,
	MapPin,
	MoreHorizontal,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Star,
	Trash2,
	TrendingUp,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
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
import {
	getDashboardDestinations,
	removeDestination,
} from "#/server/actions/destinations";
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

export const Route = createFileRoute("/_authenticated/destinations/")({
	component: DestinationsIndexPage,
});

export function DestinationsIndexPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all");
	const [featuredFilter, setFeaturedFilter] = useState<
		"all" | "featured" | "not-featured"
	>("all");
	const [countryFilter, setCountryFilter] = useState("all");
	const [regionFilter, setRegionFilter] = useState("all");
	const [tourFilter, setTourFilter] = useState<
		"all" | "with-tours" | "without-tours"
	>("all");
	const [sortBy, setSortBy] = useState<
		"name-asc" | "name-desc" | "tours-desc" | "tours-asc"
	>("name-asc");
	const [deleting, setDeleting] = useState<boolean>(false);
	const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] =
		useState<boolean>(false);

	const fetchDestinations = useServerFn(getDashboardDestinations);
	const deleteDestination = useServerFn(removeDestination);

	const {
		data: destinations,
		isPending,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ["dashboard-destinations"],
		queryFn: () => fetchDestinations(),
	});

	const destinationList = destinations ?? [];

	const countries = useMemo(
		() =>
			Array.from(
				new Set(
					destinationList
						.map((destination) => destination.country?.trim())
						.filter((country): country is string => Boolean(country)),
				),
			).sort((a, b) => a.localeCompare(b)),
		[destinationList],
	);

	const regions = useMemo(
		() =>
			Array.from(
				new Set(
					destinationList
						.map((destination) => destination.region?.trim())
						.filter((region): region is string => Boolean(region)),
				),
			).sort((a, b) => a.localeCompare(b)),
		[destinationList],
	);

	const filteredDestinations = useMemo(() => {
		const query = search.trim().toLowerCase();

		const filtered = destinationList.filter((destination) => {
			const searchableText = [
				destination.name,
				destination.slug,
				destination.state,
				destination.country,
				destination.region,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			const matchesSearch = !query || searchableText.includes(query);
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && destination.isActive) ||
				(statusFilter === "inactive" && !destination.isActive);
			const matchesFeatured =
				featuredFilter === "all" ||
				(featuredFilter === "featured" && destination.isFeatured) ||
				(featuredFilter === "not-featured" && !destination.isFeatured);
			const matchesCountry =
				countryFilter === "all" ||
				destination.country?.trim() === countryFilter;
			const matchesRegion =
				regionFilter === "all" || destination.region?.trim() === regionFilter;
			const tourCount = destination.tourCount ?? 0;
			const matchesTours =
				tourFilter === "all" ||
				(tourFilter === "with-tours" && tourCount > 0) ||
				(tourFilter === "without-tours" && tourCount === 0);

			return (
				matchesSearch &&
				matchesStatus &&
				matchesFeatured &&
				matchesCountry &&
				matchesRegion &&
				matchesTours
			);
		});

		return filtered.sort((a, b) => {
			switch (sortBy) {
				case "name-desc":
					return b.name.localeCompare(a.name);
				case "tours-desc":
					return (b.tourCount ?? 0) - (a.tourCount ?? 0);
				case "tours-asc":
					return (a.tourCount ?? 0) - (b.tourCount ?? 0);
				default:
					return a.name.localeCompare(b.name);
			}
		});
	}, [
		destinationList,
		search,
		statusFilter,
		featuredFilter,
		countryFilter,
		regionFilter,
		tourFilter,
		sortBy,
	]);

	const hasActiveFilters =
		search.trim() !== "" ||
		statusFilter !== "all" ||
		featuredFilter !== "all" ||
		countryFilter !== "all" ||
		regionFilter !== "all" ||
		tourFilter !== "all" ||
		sortBy !== "name-asc";

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setFeaturedFilter("all");
		setCountryFilter("all");
		setRegionFilter("all");
		setTourFilter("all");
		setSortBy("name-asc");
	};

	const totalDestinations = destinationList.length;

	const activeDestinations = destinationList.filter(
		(destination) => destination.isActive,
	).length;

	const featuredDestinations = destinationList.filter(
		(destination) => destination.isFeatured,
	).length;

	const totalTours = destinationList.reduce(
		(total, destination) => total + (destination.tourCount ?? 0),
		0,
	);

	const showInitialLoading = isPending && !destinations;
	const showInitialError = isError && !destinations;

	const handleDeleteDestination = async (id: string) => {
		try {
			setDeleting(true);
			setDeleteAlertDialogOpen(true);
			const result = await deleteDestination({ data: { destinationId: id } });
			if (!result) {
				toast.error(`Error removing destination: ${id}`);
			}
			toast.success(`successfully removed destination: ${id}`);
			refetch();
		} catch (err) {
			console.error(`Error removing destination: ${id}`);
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
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Destinations
						</h1>

						<Badge variant="secondary" className="font-normal">
							Travel catalog
						</Badge>
					</div>

					<p className="text-sm text-muted-foreground">
						Manage destinations, organize locations, and track associated tours.
					</p>
				</div>

				<Button asChild className="w-full sm:w-auto">
					<Link to="/destinations/new">
						<Plus className="mr-2 size-4" />
						Add destination
					</Link>
				</Button>
			</section>

			{/* Non-blocking error when previously loaded data is still available */}
			{isError && destinations && (
				<div
					role="alert"
					className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

						<div>
							<p className="font-medium">Unable to refresh destinations</p>
							<p className="text-sm text-muted-foreground">
								The previously loaded data is still displayed.
							</p>
						</div>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw
							className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
						/>
						Retry
					</Button>
				</div>
			)}

			{/* Summary cards */}
			<section
				aria-label="Destination statistics"
				className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
			>
				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								Total destinations
							</p>

							{showInitialLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tracking-tight">
									{totalDestinations}
								</p>
							)}

							<p className="text-xs text-muted-foreground">
								Locations in your catalog
							</p>
						</div>

						<div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
							<Globe className="size-5 text-primary" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								Active destinations
							</p>

							{showInitialLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tracking-tight">
									{activeDestinations}
								</p>
							)}

							<p className="text-xs text-muted-foreground">Currently active</p>
						</div>

						<div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
							<TrendingUp className="size-5 text-emerald-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">
								Featured destinations
							</p>

							{showInitialLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tracking-tight">
									{featuredDestinations}
								</p>
							)}

							<p className="text-xs text-muted-foreground">
								Highlighted locations
							</p>
						</div>

						<div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
							<Star className="size-5 text-amber-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Associated tours</p>

							{showInitialLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tracking-tight">
									{totalTours}
								</p>
							)}

							<p className="text-xs text-muted-foreground">
								Tours across destinations
							</p>
						</div>

						<div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10">
							<Map className="size-5 text-blue-600" />
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Destinations table */}
			<Card>
				<CardHeader className="gap-4">
					<div>
						<CardTitle>All destinations</CardTitle>
						<CardDescription className="mt-1">
							View and manage all locations available in your catalog.
						</CardDescription>
					</div>

					<div className="space-y-3">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="relative w-full sm:max-w-sm">
								<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

								<Input
									type="search"
									placeholder="Search by name, location, or slug..."
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									className="pl-9"
									aria-label="Search destinations"
								/>
							</div>

							<div className="flex items-center justify-between gap-3">
								<p className="text-sm text-muted-foreground" aria-live="polite">
									{showInitialLoading
										? "Loading destinations..."
										: isError && !destinations
											? "Unable to load destinations"
											: `${filteredDestinations.length} of ${totalDestinations} destinations`}
								</p>

								<Button
									variant="outline"
									size="icon"
									onClick={() => refetch()}
									disabled={isFetching}
									aria-label="Refresh destinations"
									title="Refresh destinations"
								>
									<RefreshCw
										className={`size-4 ${isFetching ? "animate-spin" : ""}`}
									/>
								</Button>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<div className="flex items-center gap-2 pr-1 text-sm text-muted-foreground">
								<Filter className="size-4" />
								<span>Filters</span>
							</div>

							<Select
								value={statusFilter}
								onValueChange={(value) =>
									setStatusFilter(value as typeof statusFilter)
								}
							>
								<SelectTrigger
									className="w-[145px]"
									aria-label="Filter by status"
								>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={featuredFilter}
								onValueChange={(value) =>
									setFeaturedFilter(value as typeof featuredFilter)
								}
							>
								<SelectTrigger
									className="w-[155px]"
									aria-label="Filter featured destinations"
								>
									<SelectValue placeholder="Featured" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All destinations</SelectItem>
									<SelectItem value="featured">Featured only</SelectItem>
									<SelectItem value="not-featured">Not featured</SelectItem>
								</SelectContent>
							</Select>

							<Select value={countryFilter} onValueChange={setCountryFilter}>
								<SelectTrigger
									className="w-[155px]"
									aria-label="Filter by country"
								>
									<SelectValue placeholder="Country" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All countries</SelectItem>
									{countries.map((country) => (
										<SelectItem key={country} value={country}>
											{country}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={regionFilter} onValueChange={setRegionFilter}>
								<SelectTrigger
									className="w-[150px]"
									aria-label="Filter by region"
								>
									<SelectValue placeholder="Region" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All regions</SelectItem>
									{regions.map((region) => (
										<SelectItem key={region} value={region}>
											{region}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={tourFilter}
								onValueChange={(value) =>
									setTourFilter(value as typeof tourFilter)
								}
							>
								<SelectTrigger
									className="w-[150px]"
									aria-label="Filter by tour availability"
								>
									<SelectValue placeholder="Tours" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Any tour count</SelectItem>
									<SelectItem value="with-tours">Has tours</SelectItem>
									<SelectItem value="without-tours">No tours</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={sortBy}
								onValueChange={(value) => setSortBy(value as typeof sortBy)}
							>
								<SelectTrigger
									className="w-[175px]"
									aria-label="Sort destinations"
								>
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name-asc">Name: A to Z</SelectItem>
									<SelectItem value="name-desc">Name: Z to A</SelectItem>
									<SelectItem value="tours-desc">Most tours</SelectItem>
									<SelectItem value="tours-asc">Fewest tours</SelectItem>
								</SelectContent>
							</Select>

							{hasActiveFilters && (
								<Button variant="ghost" size="sm" onClick={clearFilters}>
									<X className="mr-1.5 size-4" />
									Clear filters
								</Button>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{showInitialError ? (
						/* Initial error state */
						<div
							role="alert"
							className="flex flex-col items-center justify-center gap-4  border border-dashed px-4 py-12 text-center"
						>
							<div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
								<AlertCircle className="size-6 text-destructive" />
							</div>

							<div className="space-y-1">
								<h3 className="font-semibold">Unable to load destinations</h3>

								<p className="max-w-md text-sm text-muted-foreground">
									{error instanceof Error
										? error.message
										: "Something went wrong while fetching destinations. Please try again."}
								</p>
							</div>

							<Button
								variant="outline"
								onClick={() => refetch()}
								disabled={isFetching}
							>
								<RefreshCw
									className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
								/>
								Try again
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto border">
							<Table className="min-w-[760px]">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[280px]">Destination</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Tours</TableHead>
										<TableHead className="w-[70px]">
											<span className="sr-only">Actions</span>
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{showInitialLoading ? (
										/* Loading skeleton rows */
										Array.from({ length: 5 }).map((_, index) => (
											<TableRow key={`destination-skeleton-${index}`}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Skeleton className="size-10 shrink-0 rounded-lg" />

														<div className="space-y-2">
															<Skeleton className="h-4 w-32" />
															<Skeleton className="h-3 w-24" />
														</div>
													</div>
												</TableCell>

												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-28" />
														<Skeleton className="h-3 w-36" />
													</div>
												</TableCell>

												<TableCell>
													<Skeleton className="h-6 w-16 rounded-full" />
												</TableCell>

												<TableCell className="text-right">
													<Skeleton className="ml-auto h-4 w-8" />
												</TableCell>

												<TableCell>
													<Skeleton className="size-8 rounded-md" />
												</TableCell>
											</TableRow>
										))
									) : filteredDestinations.length === 0 ? (
										/* Empty state */
										<TableRow>
											<TableCell colSpan={5} className="h-64">
												<div className="flex flex-col items-center justify-center gap-3 text-center">
													<div className="flex size-12 items-center justify-center rounded-full bg-muted">
														{hasActiveFilters ? (
															<Search className="size-5 text-muted-foreground" />
														) : (
															<MapPin className="size-5 text-muted-foreground" />
														)}
													</div>

													<div className="space-y-1">
														<h3 className="font-medium">
															{hasActiveFilters
																? "No matching destinations"
																: "No destinations yet"}
														</h3>

														<p className="text-sm text-muted-foreground">
															{hasActiveFilters
																? "Try changing your search or filters."
																: "Add your first destination to start building your travel catalog."}
														</p>
													</div>

													{hasActiveFilters ? (
														<Button
															variant="outline"
															size="sm"
															onClick={clearFilters}
														>
															Clear filters
														</Button>
													) : (
														<Button asChild size="sm">
															<Link to="/destinations/new">
																<Plus className="mr-2 size-4" />
																Add destination
															</Link>
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									) : (
										/* Destination rows */
										filteredDestinations.map((destination) => (
											<TableRow key={destination.id} className="group">
												<TableCell>
													<div className="flex items-center gap-3">
														{destination.coverImage ? (
															<img
																src={destination.coverImage}
																alt={destination.name}
																className="size-11 rounded-lg"
															/>
														) : (
															<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
																<MapPin className="size-5 text-primary" />
															</div>
														)}

														<div className="min-w-0 space-y-1">
															<Link
																to="/destinations/$destinationId"
																params={{ destinationId: destination.id }}
																className="hover:underline"
															>
																<p className="truncate font-medium">
																	{destination.name}
																</p>
															</Link>

															<p className="truncate text-xs text-muted-foreground">
																/{destination.slug}
															</p>
														</div>
													</div>
												</TableCell>

												<TableCell>
													<div className="space-y-1.5 text-sm">
														<div className="flex items-center gap-1.5">
															<Map className="size-3.5 shrink-0 text-muted-foreground" />
															<span>
																{destination.state || "State not specified"}
															</span>
														</div>

														<div className="flex items-center gap-1.5 text-muted-foreground">
															<Globe className="size-3.5 shrink-0" />
															<span>
																{destination.country || "Country not specified"}
																{destination.region
																	? ` · ${destination.region}`
																	: ""}
															</span>
														</div>
													</div>
												</TableCell>

												<TableCell>
													<div className="flex flex-wrap items-center gap-2">
														<Badge
															variant={
																destination.isActive ? "default" : "secondary"
															}
														>
															{destination.isActive ? "Active" : "Inactive"}
														</Badge>

														{destination.isFeatured && (
															<Badge
																variant="outline"
																className="border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
															>
																<Star className="mr-1 size-3" />
																Featured
															</Badge>
														)}
													</div>
												</TableCell>

												<TableCell className="text-right">
													<Badge
														variant="secondary"
														className="min-w-10 justify-center tabular-nums"
													>
														{destination.tourCount ?? 0}
													</Badge>
												</TableCell>

												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-8"
																aria-label={`Actions for ${destination.name}`}
															>
																<MoreHorizontal className="size-4" />
															</Button>
														</DropdownMenuTrigger>

														<DropdownMenuContent align="end" className="w-44">
															<DropdownMenuLabel>
																Destination actions
															</DropdownMenuLabel>

															<DropdownMenuSeparator />
															<DropdownMenuItem asChild>
																<Link
																	to="/destinations/$destinationId"
																	params={{
																		destinationId: destination.id,
																	}}
																>
																	<Eye className="mr-2 size-4" />
																	View destination
																</Link>
															</DropdownMenuItem>

															<DropdownMenuSeparator />

															<DropdownMenuItem asChild>
																<Link
																	to="/destinations/$destinationId/edit"
																	params={{
																		destinationId: destination.id,
																	}}
																>
																	<Pencil className="mr-2 size-4" />
																	Edit destination
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
																		Delete destination
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
																				{destination.name}
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
																			onClick={() =>
																				handleDeleteDestination(destination.id)
																			}
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
										))
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}
