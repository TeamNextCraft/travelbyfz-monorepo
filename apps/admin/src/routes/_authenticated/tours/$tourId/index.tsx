import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	CalendarDays,
	Check,
	Clock3,
	Compass,
	Copy,
	ExternalLink,
	FileText,
	ImageIcon,
	MapPin,
	Pencil,
	RefreshCw,
	Star,
	Users,
	X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
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
import { Separator } from "#/components/ui/separator";
import { getTourDetails } from "#/server/actions/tours";

export const Route = createFileRoute("/_authenticated/tours/$tourId/")({
	component: TourDetailsPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatLabel(value?: string | null) {
	if (!value) return "—";
	return value
		.replaceAll("_", " ")
		.replaceAll("-", " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value?: string | Date | null) {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

type TourStatus = "Published" | "Draft" | "Inactive";

function getTourStatus(tour: {
	isActive: boolean;
	isPublished: boolean;
}): TourStatus {
	if (!tour.isActive) return "Inactive";
	if (!tour.isPublished) return "Draft";
	return "Published";
}

const STATUS_STYLES: Record<TourStatus, string> = {
	Published: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Draft: "border-amber-200 bg-amber-50 text-amber-700",
	Inactive: "border-slate-200 bg-slate-100 text-slate-600",
};

function useCopyToClipboard(resetMs = 2000) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), resetMs);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	return { copied, copy };
}

/* ------------------------------------------------------------------ */
/* Small presentational components                                     */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: TourStatus }) {
	return (
		<Badge variant="outline" className={STATUS_STYLES[status]}>
			{status}
		</Badge>
	);
}

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

function EmptyState({
	icon: Icon = FileText,
	title,
	message,
	action,
}: {
	icon?: typeof FileText;
	title?: string;
	message: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center">
			<Icon className="size-7 text-muted-foreground" />
			{title && <h3 className="mt-3 text-sm font-semibold">{title}</h3>}
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

function ListSection({
	title,
	description,
	items,
	variant = "positive",
}: {
	title: string;
	description: string;
	items?: string[] | null;
	variant?: "positive" | "negative";
}) {
	const list = items ?? [];
	const Icon = variant === "negative" ? X : Check;
	const tone =
		variant === "negative"
			? "bg-red-50 text-red-600"
			: "bg-emerald-50 text-emerald-600";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{list.length > 0 ? (
					<ul className="space-y-3">
						{list.map((item, index) => (
							<li key={`${item}-${index}`} className="flex items-start gap-3">
								<div
									className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${tone}`}
								>
									<Icon className="size-3.5" />
								</div>
								<span className="text-sm leading-relaxed">{item}</span>
							</li>
						))}
					</ul>
				) : (
					<EmptyState message={`No ${title.toLowerCase()} added yet.`} />
				)}
			</CardContent>
		</Card>
	);
}

function MetricCard({
	title,
	value,
	description,
	icon: Icon,
}: {
	title: string;
	value: string;
	description: string;
	icon: typeof Users;
}) {
	return (
		<Card className="gap-4 py-5">
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between gap-3">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
						<Icon className="size-4 text-muted-foreground" />
					</div>
				</div>
				<p className="text-2xl font-semibold tracking-tight">{value}</p>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

function PolicyBlock({
	title,
	content,
}: {
	title: string;
	content?: string | null;
}) {
	return (
		<div className="space-y-2">
			<h3 className="text-sm font-semibold">{title}</h3>
			<p
				className={`whitespace-pre-line text-sm leading-relaxed ${
					content ? "text-muted-foreground" : "italic text-muted-foreground/70"
				}`}
			>
				{content || "No information provided."}
			</p>
		</div>
	);
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
	const [failed, setFailed] = useState(false);

	if (failed) {
		return (
			<a
				href={src}
				target="_blank"
				rel="noreferrer"
				className="flex aspect-video items-center justify-center rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground"
			>
				<span className="break-all">Image failed to load · {src}</span>
			</a>
		);
	}

	return (
		<a
			href={src}
			target="_blank"
			rel="noreferrer"
			className="group relative block aspect-video overflow-hidden rounded-lg border bg-muted"
		>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				onError={() => setFailed(true)}
				className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</a>
	);
}

/**
 * Itinerary entries come from ItineraryInputList. I don't know the exact
 * shape, so this reads the common fields defensively. Adjust the field
 * names (day / title / description / activities) to match your real type.
 */
function ItineraryTimeline({ entries }: { entries: unknown[] }) {
	const asText = (value: unknown) =>
		typeof value === "string" && value.trim() ? value : null;

	return (
		<ol className="relative space-y-6 border-l pl-6">
			{entries.map((raw, index) => {
				const entry = (raw ?? {}) as Record<string, unknown>;
				const day = entry.day ?? entry.dayNumber ?? index + 1;
				const title = asText(entry.title) ?? asText(entry.name);
				const description = asText(entry.description);
				const activities = Array.isArray(entry.activities)
					? entry.activities.filter((a): a is string => typeof a === "string")
					: [];

				return (
					<li key={`${String(day)}-${index}`} className="relative">
						<span className="absolute -left-[37px] flex size-6 items-center justify-center rounded-full border bg-background text-[11px] font-semibold">
							{String(day)}
						</span>
						<div className="space-y-1.5">
							<h3 className="text-sm font-semibold">
								{title ?? `Day ${String(day)}`}
							</h3>
							{description && (
								<p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
									{description}
								</p>
							)}
							{activities.length > 0 && (
								<ul className="space-y-1 pt-1">
									{activities.map((activity) => (
										<li
											key={activity}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											<span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
											{activity}
										</li>
									))}
								</ul>
							)}
						</div>
					</li>
				);
			})}
		</ol>
	);
}

/* ------------------------------------------------------------------ */
/* Loading / error states                                              */
/* ------------------------------------------------------------------ */

function Skeleton({ className = "" }: { className?: string }) {
	return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

function TourDetailsSkeleton() {
	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8" aria-busy="true">
			<div className="space-y-3">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-9 w-80 max-w-full" />
				<Skeleton className="h-4 w-96 max-w-full" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-32" />
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div className="space-y-6">
					<Skeleton className="h-56" />
					<Skeleton className="h-64" />
				</div>
				<div className="space-y-6">
					<Skeleton className="h-52" />
					<Skeleton className="h-40" />
				</div>
			</div>
		</main>
	);
}

function TourDetailsError({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) {
	return (
		<main className="p-4 md:p-6 lg:p-8">
			<Card className="mx-auto max-w-lg">
				<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
					<div className="flex size-11 items-center justify-center rounded-full bg-red-50">
						<AlertTriangle className="size-5 text-red-600" />
					</div>
					<h1 className="text-lg font-semibold">Couldn't load this tour</h1>
					<p className="text-sm text-muted-foreground">{message}</p>
					<div className="mt-2 flex gap-2">
						{onRetry && (
							<Button variant="outline" onClick={onRetry}>
								<RefreshCw className="mr-2 size-4" />
								Try again
							</Button>
						)}
						<Button variant="ghost" asChild>
							<Link to="/tours">Back to tours</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function TourDetailsPage() {
	const { tourId } = Route.useParams();
	const fetchTour = useServerFn(getTourDetails);
	const { copied, copy } = useCopyToClipboard();

	const {
		data: tour,
		isPending,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["tour-details", tourId],
		queryFn: () => fetchTour({ data: { tourId } }),
	});

	if (isPending) return <TourDetailsSkeleton />;

	if (isError) {
		return (
			<TourDetailsError
				message={
					error instanceof Error ? error.message : "Something went wrong."
				}
				onRetry={() => refetch()}
			/>
		);
	}

	if (!tour) {
		return (
			<TourDetailsError message="This tour doesn't exist or was deleted." />
		);
	}

	const status = getTourStatus(tour);
	const formattedCategory = formatLabel(tour.category);
	const formattedType = formatLabel(tour.type);

	// Every nullable / array field is normalised once, so the JSX below
	// never has to worry about null or `0 && ...` rendering a stray "0".
	const meals = tour.mealsIncluded ?? [];
	const notes = tour.importantNotes ?? [];
	const gallery = tour.gallery ?? [];
	const itinerary = (tour.itinerary ?? []) as unknown[];

	const { createdAt, updatedAt } = tour as {
		createdAt?: string | Date | null;
		updatedAt?: string | Date | null;
	};

	const editLink = (
		<Link to="/tours/$tourId/edit" params={{ tourId }}>
			<Pencil className="mr-2 size-4" />
			Edit tour
		</Link>
	);

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
			<section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
				<div className="min-w-0 space-y-3">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						asChild
					>
						<Link to="/tours">
							<ArrowLeft className="mr-2 size-4" />
							Back to tours
						</Link>
					</Button>

					<div className="space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
								{tour.title}
							</h1>
							{tour.tag && <Badge variant="secondary">{tour.tag}</Badge>}
							{tour.isFeatured && (
								<Badge
									variant="outline"
									className="gap-1 border-amber-200 bg-amber-50 text-amber-700"
								>
									<Star className="size-3 fill-amber-400 text-amber-400" />
									Featured
								</Badge>
							)}
						</div>

						{tour.tagline && (
							<p className="max-w-2xl text-sm text-muted-foreground">
								{tour.tagline}
							</p>
						)}

						<div className="flex flex-wrap items-center gap-2">
							<StatusBadge status={status} />
							<Badge variant="secondary">{formattedCategory}</Badge>
							<Badge variant="outline">{formattedType}</Badge>
							<span className="text-xs text-muted-foreground">·</span>
							<span className="text-xs text-muted-foreground">
								Code: <span className="font-mono">{tour.code}</span>
							</span>
						</div>

						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<span>ID</span>
							<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
								{tour.id}
							</code>
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => copy(tour.id)}
								aria-label="Copy tour ID"
							>
								{copied ? (
									<Check className="size-3.5 text-emerald-500" />
								) : (
									<Copy className="size-3.5" />
								)}
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button asChild>{editLink}</Button>

					{status === "Published" && (
						<Button variant="outline" asChild>
							<a href={`/tours/${tour.slug}`} target="_blank" rel="noreferrer">
								<ExternalLink className="mr-2 size-4" />
								View public page
							</a>
						</Button>
					)}
				</div>
			</section>

			{/* Overview statistics */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Bookings"
					value={(tour.bookingCount ?? 0).toLocaleString("en-IN")}
					description="Total bookings"
					icon={Users}
				/>
				<MetricCard
					title="Average rating"
					value={tour.reviewCount > 0 ? Number(tour.avgRating).toFixed(1) : "—"}
					description={
						tour.reviewCount > 0
							? `${tour.reviewCount.toLocaleString("en-IN")} ${
									tour.reviewCount === 1 ? "review" : "reviews"
								}`
							: "No reviews yet"
					}
					icon={Star}
				/>
				<MetricCard
					title="Duration"
					value={`${tour.durationDays} ${tour.durationDays === 1 ? "day" : "days"}`}
					description={`${tour.durationNights} ${tour.durationNights === 1 ? "night" : "nights"}`}
					icon={CalendarDays}
				/>
				<MetricCard
					title="Difficulty"
					value={tour.difficulty}
					description="Travel difficulty"
					icon={Compass}
				/>
			</section>

			<section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				{/* Main column */}
				<div className="min-w-0 space-y-6">
					{/* Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Tour overview</CardTitle>
							<CardDescription>
								Main information about this travel package.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							{tour.shortDescription && (
								<p className="text-sm font-medium leading-relaxed">
									{tour.shortDescription}
								</p>
							)}
							{tour.shortDescription && tour.description && <Separator />}
							{tour.description ? (
								<p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
									{tour.description}
								</p>
							) : (
								<EmptyState message="No description added yet." />
							)}
						</CardContent>
					</Card>

					{/* Trip details */}
					<Card>
						<CardHeader>
							<CardTitle>Trip details</CardTitle>
							<CardDescription>
								Duration, route, and traveler requirements.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								<DetailItem label="Starting point" value={tour.startLocation} />
								<DetailItem label="Ending point" value={tour.endLocation} />
								<DetailItem label="Tour type" value={formattedType} />
								<DetailItem
									label="Minimum age"
									value={`${tour.minAge} years`}
								/>
								<DetailItem
									label="Maximum age"
									value={`${tour.maxAge} years`}
								/>
								<DetailItem
									label="Group size"
									value={
										tour.maxGroupSize
											? `${tour.minGroupSize}–${tour.maxGroupSize} travelers`
											: `${tour.minGroupSize}+ travelers`
									}
								/>
								<DetailItem
									label="Transport"
									value={tour.transportIncluded ? "Included" : "Not included"}
								/>
								<DetailItem label="Currency" value={tour.currency} />
							</div>

							{meals.length > 0 && (
								<>
									<Separator className="my-5" />
									<div className="space-y-2">
										<h3 className="text-sm font-medium">Meals included</h3>
										<div className="flex flex-wrap gap-2">
											{meals.map((meal) => (
												<Badge variant="secondary" key={meal}>
													{meal}
												</Badge>
											))}
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<ListSection
						title="Tour highlights"
						description="The main experiences offered by this package."
						items={tour.highlights}
					/>

					<div className="grid gap-6 lg:grid-cols-2">
						<ListSection
							title="What's included"
							description="Services included in the tour package."
							items={tour.inclusions}
						/>
						<ListSection
							title="What's excluded"
							description="Expenses and services not covered."
							items={tour.exclusions}
							variant="negative"
						/>
					</div>

					{/* Itinerary */}
					<Card>
						<CardHeader>
							<CardTitle>Itinerary</CardTitle>
							<CardDescription>Day-by-day plan for the tour.</CardDescription>
						</CardHeader>
						<CardContent>
							{itinerary.length > 0 ? (
								<ItineraryTimeline entries={itinerary} />
							) : (
								<EmptyState
									icon={CalendarDays}
									title="No itinerary added"
									message="Add day-by-day activities to help customers understand the tour schedule."
									action={
										<Button variant="outline" size="sm" asChild>
											<Link to="/tours/$tourId/edit" params={{ tourId }}>
												<Pencil className="mr-2 size-4" />
												Add itinerary
											</Link>
										</Button>
									}
								/>
							)}
						</CardContent>
					</Card>

					{/* Policies */}
					<Card>
						<CardHeader>
							<CardTitle>Policies and notes</CardTitle>
							<CardDescription>
								Important terms associated with this tour.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<PolicyBlock
								title="Cancellation policy"
								content={tour.cancellationPolicySummary}
							/>
							<Separator />
							<PolicyBlock
								title="Terms and conditions"
								content={tour.termsSummary}
							/>
							<Separator />
							<div className="space-y-3">
								<h3 className="text-sm font-semibold">Important notes</h3>
								{notes.length > 0 ? (
									<ul className="space-y-2">
										{notes.map((note, index) => (
											<li
												key={`${note}-${index}`}
												className="flex items-start gap-2 text-sm text-muted-foreground"
											>
												<span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
												{note}
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm italic text-muted-foreground/70">
										No important notes provided.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Media */}
					<Card>
						<CardHeader className="flex-row items-start justify-between gap-3">
							<div className="space-y-1.5">
								<CardTitle>Media</CardTitle>
								<CardDescription>
									Featured image and gallery for this tour.
								</CardDescription>
							</div>
							<Button variant="outline" size="sm" asChild>
								<Link to="/tours/$tourId/edit" params={{ tourId }}>
									<ImageIcon className="mr-2 size-4" />
									Manage
								</Link>
							</Button>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="space-y-2">
								<p className="text-sm font-medium">Featured image</p>
								{tour.featuredImage ? (
									<div className="max-w-xl">
										<GalleryImage
											src={tour.featuredImage}
											alt={`${tour.title} featured image`}
										/>
									</div>
								) : (
									<EmptyState
										icon={ImageIcon}
										title="No featured image"
										message="Add a cover image to improve the public tour page."
									/>
								)}
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium">
									Gallery{gallery.length > 0 && ` (${gallery.length})`}
								</p>
								{gallery.length > 0 ? (
									<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
										{gallery.map((url, index) => (
											<GalleryImage
												key={`${url}-${index}`}
												src={url}
												alt={`${tour.title} gallery image ${index + 1}`}
											/>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										No additional gallery images configured.
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right sidebar */}
				<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
					<Card>
						<CardHeader>
							<CardTitle>Publishing</CardTitle>
							<CardDescription>Current visibility settings.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">
									Publication
								</span>
								<StatusBadge
									status={tour.isPublished ? "Published" : "Draft"}
								/>
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">
									Availability
								</span>
								<StatusBadge
									status={tour.isActive ? "Published" : "Inactive"}
								/>
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">Featured</span>
								<span className="text-sm font-medium">
									{tour.isFeatured ? "Yes" : "No"}
								</span>
							</div>

							{tour.isPublished && !tour.isActive && (
								<div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
									<AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
									This tour is published but inactive, so customers can't book
									it.
								</div>
							)}

							<Separator />

							<Button className="w-full" asChild>
								{editLink}
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Route</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
									<MapPin className="size-4 text-primary" />
								</div>
								<div className="min-w-0 space-y-3">
									<div>
										<p className="text-xs text-muted-foreground">Starts at</p>
										<p className="text-sm font-medium">{tour.startLocation}</p>
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Ends at</p>
										<p className="text-sm font-medium">{tour.endLocation}</p>
									</div>
									{tour.destinationId && (
										<p className="break-all text-xs text-muted-foreground">
											Destination ID: {tour.destinationId}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>SEO preview</CardTitle>
							<CardDescription>How it may appear in search.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-1.5">
							<p className="text-sm font-medium text-blue-700 dark:text-blue-400">
								{tour.seoTitle || tour.title}
							</p>
							<p className="break-all text-xs text-emerald-700 dark:text-emerald-400">
								/tours/{tour.slug}
							</p>
							<p className="text-xs leading-relaxed text-muted-foreground">
								{tour.seoDescription ||
									tour.shortDescription ||
									"No SEO description provided."}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Record information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<DetailItem label="URL slug" value={tour.slug} />
							<DetailItem label="Tour code" value={tour.code} />
							<DetailItem label="Category" value={formattedCategory} />

							{(formatDate(createdAt) || formatDate(updatedAt)) && (
								<>
									<Separator />
									<div className="space-y-2 text-xs text-muted-foreground">
										{formatDate(createdAt) && (
											<div className="flex items-center gap-2">
												<Clock3 className="size-3.5" />
												Created {formatDate(createdAt)}
											</div>
										)}
										{formatDate(updatedAt) && (
											<div className="flex items-center gap-2">
												<Clock3 className="size-3.5" />
												Updated {formatDate(updatedAt)}
											</div>
										)}
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
