import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock3,
	FilterX,
	MessageSquareText,
	MoreHorizontal,
	RefreshCw,
	Search,
	ShieldCheck,
	Star,
	StarOff,
	ThumbsDown,
	ThumbsUp,
	X,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
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
	getDashboardReviews,
	getReviewStats,
	type ReviewStatus,
	setReviewFeatured,
	updateReviewStatus,
} from "#/server/actions/reviews";

export const Route = createFileRoute("/_authenticated/reviews/")({
	component: ReviewsIndexPage,
});

const PAGE_SIZE = 20;

type StatusFilter = "all" | ReviewStatus;
type YesNoFilter = "all" | "yes" | "no";
type RatingFilter = "all" | "1" | "2" | "3" | "4" | "5";

function formatDate(value: Date | string | null | undefined) {
	if (!value) return "—";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function StatusBadge({ status }: { status: ReviewStatus }) {
	if (status === "approved") {
		return (
			<Badge className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
				<CheckCircle2 className="size-3" /> Approved
			</Badge>
		);
	}
	if (status === "rejected") {
		return (
			<Badge variant="destructive" className="gap-1">
				<X className="size-3" /> Rejected
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className="gap-1 border-amber-500/30 text-amber-700 dark:text-amber-300"
		>
			<Clock3 className="size-3" /> Pending
		</Badge>
	);
}

function RatingStars({ rating }: { rating: number }) {
	return (
		<div
			className="flex items-center gap-0.5"
			aria-label={`${rating} out of 5 stars`}
		>
			{Array.from({ length: 5 }, (_, index) => (
				<Star
					key={index}
					className={`size-3.5 ${index < rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`}
				/>
			))}
			<span className="ml-1 text-xs font-medium tabular-nums">{rating}/5</span>
		</div>
	);
}

export function ReviewsIndexPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
	const [featuredFilter, setFeaturedFilter] = useState<YesNoFilter>("all");
	const [verifiedFilter, setVerifiedFilter] = useState<YesNoFilter>("all");
	const [page, setPage] = useState(1);
	const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);

	const fetchReviews = useServerFn(getDashboardReviews);
	const fetchStats = useServerFn(getReviewStats);
	const changeStatus = useServerFn(updateReviewStatus);
	const changeFeatured = useServerFn(setReviewFeatured);

	const queryData = useMemo(
		() => ({
			page,
			pageSize: PAGE_SIZE,
			q: search.trim() || undefined,
			status: statusFilter === "all" ? undefined : statusFilter,
			rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
			featured: featuredFilter,
			verified: verifiedFilter,
		}),
		[page, search, statusFilter, ratingFilter, featuredFilter, verifiedFilter],
	);

	const { data, isPending, isError, error, isFetching, refetch } = useQuery({
		queryKey: ["dashboard-reviews", queryData],
		queryFn: () => fetchReviews({ data: queryData }),
		placeholderData: (previousData) => previousData,
	});

	const statsQuery = useQuery({
		queryKey: ["dashboard-review-stats"],
		queryFn: () => fetchStats(),
	});

	const reviews = data?.rows ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const hasActiveFilters = Boolean(
		search.trim() ||
			statusFilter !== "all" ||
			ratingFilter !== "all" ||
			featuredFilter !== "all" ||
			verifiedFilter !== "all",
	);

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setRatingFilter("all");
		setFeaturedFilter("all");
		setVerifiedFilter("all");
		setPage(1);
	};

	const invalidateReviews = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["dashboard-reviews"] }),
			queryClient.invalidateQueries({ queryKey: ["dashboard-review-stats"] }),
		]);
	};

	const handleStatusChange = async (reviewId: string, status: ReviewStatus) => {
		setUpdatingReviewId(reviewId);
		try {
			await changeStatus({ data: { reviewId, status } });
			toast.success(`Review ${status}.`);
			await invalidateReviews();
		} catch (cause) {
			console.error("Unable to update review status", cause);
			toast.error(
				cause instanceof Error
					? cause.message
					: "Unable to update review status.",
			);
		} finally {
			setUpdatingReviewId(null);
		}
	};

	const handleFeaturedChange = async (
		reviewId: string,
		isFeatured: boolean,
	) => {
		setUpdatingReviewId(reviewId);
		try {
			await changeFeatured({ data: { reviewId, isFeatured } });
			toast.success(
				isFeatured ? "Review featured." : "Review removed from featured.",
			);
			await invalidateReviews();
		} catch (cause) {
			console.error("Unable to update featured review", cause);
			toast.error(
				cause instanceof Error
					? cause.message
					: "Unable to update featured status.",
			);
		} finally {
			setUpdatingReviewId(null);
		}
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Reviews
						</h1>
						<Badge variant="secondary" className="font-normal">
							Customer feedback
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						Review customer feedback, moderate submissions, and highlight
						helpful reviews.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => {
						void refetch();
						void statsQuery.refetch();
					}}
					disabled={isFetching || statsQuery.isFetching}
				>
					<RefreshCw
						className={`mr-2 size-4 ${isFetching || statsQuery.isFetching ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</section>

			{isError && data && (
				<div
					role="alert"
					className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
						<div>
							<p className="font-medium">Unable to refresh reviews</p>
							<p className="text-sm text-muted-foreground">
								Previously loaded reviews are still displayed.
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => void refetch()}
						disabled={isFetching}
					>
						Retry
					</Button>
				</div>
			)}

			<section
				aria-label="Review statistics"
				className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
			>
				<StatCard
					title="Total reviews"
					value={statsQuery.data?.total}
					description="All submitted reviews"
					icon={<MessageSquareText className="size-5 text-primary" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Pending review"
					value={statsQuery.data?.pending}
					description="Awaiting moderation"
					icon={<Clock3 className="size-5 text-amber-600" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Approved"
					value={statsQuery.data?.approved}
					description="Visible to customers"
					icon={<CheckCircle2 className="size-5 text-emerald-600" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Featured"
					value={statsQuery.data?.featured}
					description="Highlighted reviews"
					icon={<Star className="size-5 text-amber-600" />}
					loading={statsQuery.isPending}
				/>
			</section>

			<Card>
				<CardHeader className="gap-4">
					<div>
						<CardTitle>All reviews</CardTitle>
						<CardDescription className="mt-1">
							Search and filter reviews, then approve, reject, or feature them.
						</CardDescription>
					</div>

					<div className="relative">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
							placeholder="Search review, tour, or customer..."
							aria-label="Search reviews"
							className="pl-9"
						/>
					</div>
					<div className="inline-flex gap-3">
						<Select
							value={statusFilter}
							onValueChange={(value) => {
								setStatusFilter(value as StatusFilter);
								setPage(1);
							}}
						>
							<SelectTrigger aria-label="Filter by review status">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={ratingFilter}
							onValueChange={(value) => {
								setRatingFilter(value as RatingFilter);
								setPage(1);
							}}
						>
							<SelectTrigger aria-label="Filter by rating">
								<SelectValue placeholder="All ratings" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All ratings</SelectItem>
								{[5, 4, 3, 2, 1].map((rating) => (
									<SelectItem key={rating} value={String(rating)}>
										{rating} star{rating === 1 ? "" : "s"}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={featuredFilter}
							onValueChange={(value) => {
								setFeaturedFilter(value as YesNoFilter);
								setPage(1);
							}}
						>
							<SelectTrigger aria-label="Filter featured reviews">
								<SelectValue placeholder="Featured" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Featured: all</SelectItem>
								<SelectItem value="yes">Featured only</SelectItem>
								<SelectItem value="no">Not featured</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={verifiedFilter}
							onValueChange={(value) => {
								setVerifiedFilter(value as YesNoFilter);
								setPage(1);
							}}
						>
							<SelectTrigger aria-label="Filter verified reviews">
								<SelectValue placeholder="Verification" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Verified: all</SelectItem>
								<SelectItem value="yes">Verified only</SelectItem>
								<SelectItem value="no">Unverified only</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							onClick={clearFilters}
							disabled={!hasActiveFilters}
						>
							<FilterX className="mr-2 size-4" /> Clear
						</Button>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<p className="text-sm text-muted-foreground" aria-live="polite">
							{isPending && !data
								? "Loading reviews…"
								: `${total} review${total === 1 ? "" : "s"} found`}
						</p>
						{hasActiveFilters && (
							<p className="text-xs text-muted-foreground">
								Filters are applied to the result set.
							</p>
						)}
					</div>
				</CardHeader>

				<CardContent>
					{isError && !data ? (
						<div
							role="alert"
							className="flex flex-col items-center justify-center gap-4 border border-dashed px-4 py-12 text-center"
						>
							<AlertCircle className="size-8 text-destructive" />
							<div className="space-y-1">
								<h3 className="font-semibold">Unable to load reviews</h3>
								<p className="max-w-lg text-sm text-muted-foreground">
									{error instanceof Error
										? error.message
										: "Something went wrong while fetching reviews."}
								</p>
							</div>
							<Button
								variant="outline"
								onClick={() => void refetch()}
								disabled={isFetching}
							>
								<RefreshCw className="mr-2 size-4" /> Try again
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto border">
							<Table className="min-w-[1040px]">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[320px]">Review</TableHead>
										<TableHead>Tour & customer</TableHead>
										<TableHead>Rating</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Flags</TableHead>
										<TableHead>Submitted</TableHead>
										<TableHead className="w-[60px]">
											<span className="sr-only">Actions</span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isPending && !data ? (
										Array.from({ length: 5 }, (_, index) => (
											<TableRow key={`review-skeleton-${index}`}>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-48" />
														<Skeleton className="h-3 w-64" />
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-32" />
														<Skeleton className="h-3 w-40" />
													</div>
												</TableCell>
												<TableCell>
													<Skeleton className="h-4 w-20" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-6 w-20 rounded-full" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-5 w-24" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-4 w-28" />
												</TableCell>
												<TableCell>
													<Skeleton className="size-8" />
												</TableCell>
											</TableRow>
										))
									) : reviews.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className="h-64">
												<div className="flex flex-col items-center justify-center gap-3 text-center">
													<div className="flex size-12 items-center justify-center rounded-full bg-muted">
														<MessageSquareText className="size-5 text-muted-foreground" />
													</div>
													<div className="space-y-1">
														<h3 className="font-medium">
															{hasActiveFilters
																? "No reviews match these filters"
																: "No reviews yet"}
														</h3>
														<p className="text-sm text-muted-foreground">
															{hasActiveFilters
																? "Try adjusting your search or clearing the filters."
																: "Customer reviews will appear here when submitted."}
														</p>
													</div>
													{hasActiveFilters && (
														<Button
															variant="outline"
															size="sm"
															onClick={clearFilters}
														>
															Clear filters
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									) : (
										reviews.map((review) => (
											<TableRow key={review.id} className="align-top">
												<TableCell className="max-w-[320px] py-4">
													<div className="space-y-1.5">
														<p className="font-medium">
															{review.title?.trim() || "Untitled review"}
														</p>
														<p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
															{review.comment?.trim() || "No written comment"}
														</p>
														{review.bookingRef && (
															<p className="text-xs text-muted-foreground">
																Booking: {review.bookingRef}
															</p>
														)}
													</div>
												</TableCell>
												<TableCell className="py-4">
													<div className="space-y-1.5">
														<p
															className="max-w-[210px] truncate font-medium"
															title={review.tourTitle}
														>
															{review.tourTitle}
														</p>
														<p
															className="max-w-[210px] truncate text-sm text-muted-foreground"
															title={review.reviewerEmail ?? undefined}
														>
															{review.reviewerName || "Deleted user"}
														</p>
														{review.reviewerEmail && (
															<p className="max-w-[210px] truncate text-xs text-muted-foreground">
																{review.reviewerEmail}
															</p>
														)}
													</div>
												</TableCell>
												<TableCell className="py-4">
													<RatingStars rating={review.rating} />
												</TableCell>
												<TableCell className="py-4">
													<StatusBadge status={review.status} />
												</TableCell>
												<TableCell className="py-4">
													<div className="flex flex-col items-start gap-1.5">
														{review.isVerified ? (
															<Badge variant="secondary" className="gap-1">
																<ShieldCheck className="size-3" /> Verified
															</Badge>
														) : (
															<span className="text-xs text-muted-foreground">
																Unverified
															</span>
														)}
														{review.isFeatured && (
															<Badge
																variant="outline"
																className="gap-1 border-amber-500/30 text-amber-700 dark:text-amber-300"
															>
																<Star className="size-3 fill-current" />{" "}
																Featured
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell className="whitespace-nowrap py-4 text-sm text-muted-foreground">
													{formatDate(review.submittedAt)}
												</TableCell>
												<TableCell className="py-3">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-8"
																aria-label={`Actions for review by ${review.reviewerName || "customer"}`}
																disabled={updatingReviewId === review.id}
															>
																<MoreHorizontal className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-48">
															<DropdownMenuLabel>
																Review actions
															</DropdownMenuLabel>
															<DropdownMenuSeparator />
															{review.status !== "approved" && (
																<DropdownMenuItem
																	onClick={() =>
																		void handleStatusChange(
																			review.id,
																			"approved",
																		)
																	}
																>
																	<ThumbsUp className="mr-2 size-4 text-emerald-600" />{" "}
																	Approve review
																</DropdownMenuItem>
															)}
															{review.status !== "rejected" && (
																<DropdownMenuItem
																	onClick={() =>
																		void handleStatusChange(
																			review.id,
																			"rejected",
																		)
																	}
																>
																	<ThumbsDown className="mr-2 size-4 text-destructive" />{" "}
																	Reject review
																</DropdownMenuItem>
															)}
															{review.status !== "pending" && (
																<DropdownMenuItem
																	onClick={() =>
																		void handleStatusChange(
																			review.id,
																			"pending",
																		)
																	}
																>
																	<Clock3 className="mr-2 size-4" /> Move to
																	pending
																</DropdownMenuItem>
															)}
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() =>
																	void handleFeaturedChange(
																		review.id,
																		!review.isFeatured,
																	)
																}
															>
																{review.isFeatured ? (
																	<>
																		<StarOff className="mr-2 size-4" /> Remove
																		featured
																	</>
																) : (
																	<>
																		<Star className="mr-2 size-4" /> Feature
																		review
																	</>
																)}
															</DropdownMenuItem>
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

					<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-muted-foreground">
							Page {page} of {totalPages}
						</p>
						<div className="flex items-center justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((current) => Math.max(1, current - 1))}
								disabled={page <= 1 || isFetching}
							>
								<ChevronLeft className="mr-1 size-4" /> Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setPage((current) => Math.min(totalPages, current + 1))
								}
								disabled={page >= totalPages || isFetching}
							>
								Next <ChevronRight className="ml-1 size-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

function StatCard({
	title,
	value,
	description,
	icon,
	loading,
}: {
	title: string;
	value: number | undefined;
	description: string;
	icon: ReactNode;
	loading: boolean;
}) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between gap-4 p-5">
				<div className="min-w-0 space-y-1">
					<p className="text-sm text-muted-foreground">{title}</p>
					{loading ? (
						<Skeleton className="h-8 w-16" />
					) : (
						<p className="text-2xl font-semibold tracking-tight tabular-nums">
							{value ?? 0}
						</p>
					)}
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
				<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
					{icon}
				</div>
			</CardContent>
		</Card>
	);
}
