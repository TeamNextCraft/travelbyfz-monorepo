import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	Banknote,
	Bus,
	CalendarDays,
	Check,
	Clock3,
	Compass,
	Copy,
	ExternalLink,
	FileText,
	Globe,
	ImageIcon,
	Languages,
	Map,
	MapPin,
	Mountain,
	Pencil,
	Plane,
	RefreshCw,
	Star,
	Train,
	Utensils,
	X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
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
import { Skeleton } from "#/components/ui/skeleton";
import { getDestinationDetails } from "#/server/actions/destinations";

export const Route = createFileRoute(
	"/_authenticated/destinations/$destinationId/",
)({
	component: DestinationDetailsPage,
});

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type DestinationStatus = "Active" | "Inactive";

function getDestinationStatus(isActive: boolean): DestinationStatus {
	return isActive ? "Active" : "Inactive";
}

const STATUS_STYLES: Record<DestinationStatus, string> = {
	Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Inactive: "border-slate-200 bg-slate-100 text-slate-600",
};

function formatLabel(value?: string | null) {
	if (!value) return "—";

	return value
		.replaceAll("_", " ")
		.replaceAll("-", " ")
		.replace(/\b\w/g, (character) => character.toUpperCase());
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

function formatRating(rating?: number | null) {
	if (rating == null || !Number.isFinite(rating) || rating <= 0) {
		return "—";
	}

	return rating.toFixed(1);
}

function useCopyToClipboard() {
	const [copied, setCopied] = useState(false);

	const copy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			toast.success("Copied to clipboard");

			window.setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	return { copied, copy };
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

function StatusBadge({ isActive }: { isActive: boolean }) {
	const status = getDestinationStatus(isActive);

	return (
		<Badge variant="outline" className={STATUS_STYLES[status]}>
			{status}
		</Badge>
	);
}

function DetailItem({ label, value }: { label: string; value?: ReactNode }) {
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
}: {
	icon?: typeof FileText;
	title?: string;
	message: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center">
			<Icon className="size-7 text-muted-foreground" />

			{title && <h3 className="mt-3 text-sm font-semibold">{title}</h3>}

			<p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
		</div>
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
	icon: typeof Star;
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

function PillList({
	items,
	emptyMessage = "Nothing added yet.",
}: {
	items?: string[] | null;
	emptyMessage?: string;
}) {
	const list = items ?? [];

	if (list.length === 0) {
		return (
			<p className="text-sm italic text-muted-foreground">{emptyMessage}</p>
		);
	}

	return (
		<div className="flex flex-wrap gap-2">
			{list.map((item, index) => (
				<Badge
					key={`${item}-${index}`}
					variant="secondary"
					className="font-normal"
				>
					{item}
				</Badge>
			))}
		</div>
	);
}

function BulletList({
	title,
	description,
	items,
	variant = "positive",
}: {
	title: string;
	description?: string;
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

				{description && <CardDescription>{description}</CardDescription>}
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

function MediaImage({
	src,
	alt,
	className = "",
}: {
	src: string;
	alt: string;
	className?: string;
}) {
	const [failed, setFailed] = useState(false);

	if (!src || failed) {
		return (
			<div
				className={`flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/30 p-4 text-center ${className}`}
			>
				<div>
					<ImageIcon className="mx-auto size-7 text-muted-foreground" />

					<p className="mt-2 text-xs text-muted-foreground">
						Image unavailable
					</p>
				</div>
			</div>
		);
	}

	return (
		<a
			href={src}
			target="_blank"
			rel="noreferrer"
			className={`group relative block aspect-video overflow-hidden rounded-lg border bg-muted ${className}`}
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

/* -------------------------------------------------------------------------- */
/* Loading state                                                              */
/* -------------------------------------------------------------------------- */

function DestinationDetailsSkeleton() {
	return (
		<main
			className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8"
			aria-busy="true"
			aria-label="Loading destination details"
		>
			<div className="space-y-3">
				<Skeleton className="h-8 w-36" />
				<Skeleton className="h-9 w-80 max-w-full" />
				<Skeleton className="h-4 w-96 max-w-full" />
				<Skeleton className="h-5 w-64 max-w-full" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((index) => (
					<Skeleton key={index} className="h-32" />
				))}
			</div>

			<div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div className="min-w-0 space-y-6">
					<Skeleton className="h-72" />
					<Skeleton className="h-48" />
					<Skeleton className="h-64" />
					<Skeleton className="h-72" />
				</div>

				<div className="space-y-6">
					<Skeleton className="h-52" />
					<Skeleton className="h-48" />
					<Skeleton className="h-56" />
				</div>
			</div>
		</main>
	);
}

/* -------------------------------------------------------------------------- */
/* Error state                                                                */
/* -------------------------------------------------------------------------- */

function DestinationDetailsError({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) {
	return (
		<main className="min-w-0 p-4 md:p-6 lg:p-8">
			<Card className="mx-auto max-w-lg">
				<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
					<div className="flex size-11 items-center justify-center rounded-full bg-red-50">
						<AlertTriangle className="size-5 text-red-600" />
					</div>

					<h1 className="text-lg font-semibold">
						Couldn't load this destination
					</h1>

					<p className="text-sm text-muted-foreground">{message}</p>

					<div className="mt-2 flex flex-wrap justify-center gap-2">
						{onRetry && (
							<Button variant="outline" onClick={onRetry}>
								<RefreshCw className="mr-2 size-4" />
								Try again
							</Button>
						)}

						<Button variant="ghost" asChild>
							<Link to="/destinations">
								<ArrowLeft className="mr-2 size-4" />
								Back to destinations
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

/* -------------------------------------------------------------------------- */
/* Destination details page                                                   */
/* -------------------------------------------------------------------------- */

function DestinationDetailsPage() {
	const { destinationId } = Route.useParams();
	const fetchDestination = useServerFn(getDestinationDetails);
	const { copied, copy } = useCopyToClipboard();

	const {
		data: destination,
		isPending,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["destination-details", destinationId],
		queryFn: () => fetchDestination({ data: { destinationId } }),
	});

	if (isPending) {
		return <DestinationDetailsSkeleton />;
	}

	if (isError) {
		return (
			<DestinationDetailsError
				message={
					error instanceof Error
						? error.message
						: "Something went wrong while loading this destination."
				}
				onRetry={() => {
					void refetch();
				}}
			/>
		);
	}

	if (!destination) {
		return (
			<DestinationDetailsError message="This destination doesn't exist or may have been deleted." />
		);
	}

	// Normalize nullable arrays to keep rendering predictable.
	const categories = destination.category ?? [];
	const highlights = destination.highlights ?? [];
	const gallery = destination.gallery ?? [];
	const popularFor = destination.popularFor ?? [];
	const seasons = destination.seasons ?? [];
	const attractions = destination.attractions ?? [];
	const cuisine = destination.cuisine ?? [];
	const travelOptions = destination.howToReach ?? [];
	const travelTips = destination.travelTips ?? [];
	const doList = destination.doList ?? [];
	const dontList = destination.dontList ?? [];

	const status = getDestinationStatus(destination.isActive);

	const hasCoordinates =
		destination.latitude != null && destination.longitude != null;

	const mapUrl = hasCoordinates
		? `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`
		: null;

	const locationParts = [
		destination.city,
		destination.state,
		destination.country,
	]
		.filter(Boolean)
		.join(", ");

	const formattedLocation = [
		destination.region,
		destination.state,
		destination.country,
	]
		.filter(Boolean)
		.join(" · ");

	const editLink = (
		<Link to="/destinations/$destinationId/edit" params={{ destinationId }}>
			<Pencil className="mr-2 size-4" />
			Edit destination
		</Link>
	);

	const createdAt = destination.createdAt;
	const updatedAt = destination.updatedAt;

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page heading */}
			<section className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-start">
				<div className="min-w-0 space-y-3">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						asChild
					>
						<Link to="/destinations">
							<ArrowLeft className="mr-2 size-4" />
							Back to destinations
						</Link>
					</Button>

					<div className="space-y-2">
						<div className="flex min-w-0 flex-wrap items-center gap-2">
							<h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
								{destination.name}
							</h1>

							{destination.isFeatured && (
								<Badge
									variant="outline"
									className="gap-1 border-amber-200 bg-amber-50 text-amber-700"
								>
									<Star className="size-3 fill-amber-400 text-amber-400" />
									Featured
								</Badge>
							)}

							{destination.isTrending && (
								<Badge variant="secondary">Trending</Badge>
							)}
						</div>

						{destination.tagline && (
							<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
								{destination.tagline}
							</p>
						)}

						<div className="flex flex-wrap items-center gap-2">
							<StatusBadge isActive={destination.isActive} />

							{categories.map((category) => (
								<Badge variant="secondary" key={category}>
									{category}
								</Badge>
							))}

							{destination.region && (
								<Badge variant="outline">
									{formatLabel(destination.region)} India
								</Badge>
							)}
						</div>

						<div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
							<span>Slug</span>

							<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
								{destination.slug}
							</code>

							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => void copy(destination.slug)}
								aria-label="Copy destination slug"
							>
								<Copy className="size-3.5" />
							</Button>

							<span className="mx-1">·</span>

							<span>ID</span>

							<code className="max-w-48 truncate rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
								{destination.id}
							</code>

							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => void copy(destination.id)}
								aria-label="Copy destination ID"
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

					{mapUrl && (
						<Button variant="outline" asChild>
							<a href={mapUrl} target="_blank" rel="noreferrer">
								<ExternalLink className="mr-2 size-4" />
								Open map
							</a>
						</Button>
					)}
				</div>
			</section>

			{/* Overview statistics */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Associated tours"
					value={(destination.tourCount ?? 0).toLocaleString("en-IN")}
					description="Tours linked to this destination"
					icon={Compass}
				/>

				<MetricCard
					title="Average rating"
					value={formatRating(destination.rating)}
					description={
						destination.reviewCount > 0
							? `${destination.reviewCount.toLocaleString("en-IN")} ${
									destination.reviewCount === 1 ? "review" : "reviews"
								}`
							: "No reviews yet"
					}
					icon={Star}
				/>

				<MetricCard
					title="Categories"
					value={categories.length.toString()}
					description="Destination classifications"
					icon={Mountain}
				/>

				<MetricCard
					title="Attractions"
					value={attractions.length.toString()}
					description="Attractions configured"
					icon={Map}
				/>
			</section>

			{/* Main content and sidebar */}
			<section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div className="min-w-0 space-y-6">
					{/* Cover image */}
					<Card>
						<CardHeader>
							<CardTitle>Destination cover</CardTitle>
							<CardDescription>
								The primary image representing this destination.
							</CardDescription>
						</CardHeader>

						<CardContent>
							{destination.coverImage ? (
								<MediaImage
									src={destination.coverImage}
									alt={`${destination.name} cover`}
									className="max-w-3xl"
								/>
							) : (
								<EmptyState
									icon={ImageIcon}
									title="No cover image"
									message="Add a cover image to make this destination more visually appealing."
								/>
							)}
						</CardContent>
					</Card>

					{/* Destination overview */}
					<Card>
						<CardHeader>
							<CardTitle>Destination overview</CardTitle>
							<CardDescription>
								Description and essential information about this location.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-5">
							{destination.shortDescription && (
								<p className="text-sm font-medium leading-relaxed">
									{destination.shortDescription}
								</p>
							)}

							{destination.shortDescription && destination.description && (
								<Separator />
							)}

							{destination.description ? (
								<p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
									{destination.description}
								</p>
							) : (
								<EmptyState message="No detailed description added yet." />
							)}
						</CardContent>
					</Card>

					{/* Location information */}
					<Card>
						<CardHeader>
							<CardTitle>Location information</CardTitle>
							<CardDescription>
								Geographical information and practical location details.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<div className="flex items-start gap-3 rounded-lg border p-4">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
									<MapPin className="size-5 text-primary" />
								</div>

								<div className="min-w-0 space-y-1">
									<p className="font-medium">{destination.name}</p>

									<p className="text-sm text-muted-foreground">
										{locationParts || "Location not specified"}
									</p>

									{destination.area && (
										<p className="text-sm text-muted-foreground">
											Area: {destination.area}
										</p>
									)}
								</div>
							</div>

							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								<DetailItem label="Country" value={destination.country} />

								<DetailItem label="State" value={destination.state} />

								<DetailItem label="City" value={destination.city} />

								<DetailItem
									label="Region"
									value={formatLabel(destination.region)}
								/>

								<DetailItem label="Area" value={destination.area} />

								<DetailItem label="Language" value={destination.language} />

								<DetailItem label="Currency" value={destination.currency} />

								<DetailItem label="Latitude" value={destination.latitude} />

								<DetailItem label="Longitude" value={destination.longitude} />
							</div>

							{hasCoordinates && (
								<>
									<Separator />

									<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
										<div>
											<p className="text-sm font-medium">Map coordinates</p>

											<p className="mt-1 text-xs text-muted-foreground">
												{destination.latitude}, {destination.longitude}
											</p>
										</div>

										<Button variant="outline" size="sm" asChild>
											<a href={mapUrl!} target="_blank" rel="noreferrer">
												<MapPin className="mr-2 size-4" />
												View on Google Maps
											</a>
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Highlights */}
					<Card>
						<CardHeader>
							<CardTitle>Destination highlights</CardTitle>
							<CardDescription>
								Important experiences and features that define this destination.
							</CardDescription>
						</CardHeader>

						<CardContent>
							{highlights.length > 0 ? (
								<ul className="grid gap-3 sm:grid-cols-2">
									{highlights.map((highlight, index) => (
										<li
											key={`${highlight}-${index}`}
											className="flex items-start gap-3 rounded-lg border p-3"
										>
											<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
												<Star className="size-4 text-primary" />
											</div>

											<p className="pt-1 text-sm leading-relaxed">
												{highlight}
											</p>
										</li>
									))}
								</ul>
							) : (
								<EmptyState
									icon={Star}
									message="No destination highlights have been added."
								/>
							)}
						</CardContent>
					</Card>

					{/* What the destination is popular for */}
					<Card>
						<CardHeader>
							<CardTitle>Popular for</CardTitle>
							<CardDescription>
								Activities and experiences associated with this destination.
							</CardDescription>
						</CardHeader>

						<CardContent>
							<PillList
								items={popularFor}
								emptyMessage="No popular activities or experiences added."
							/>
						</CardContent>
					</Card>

					{/* Seasons */}
					<Card>
						<CardHeader>
							<CardTitle>Best time to visit</CardTitle>
							<CardDescription>
								Seasonal information to help travelers plan their visits.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-5">
							{destination.bestTimeToVisit && (
								<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
									<div className="flex items-start gap-3">
										<CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />

										<div>
											<p className="text-sm font-semibold">
												Recommended visiting period
											</p>

											<p className="mt-1 text-sm text-muted-foreground">
												{destination.bestTimeToVisit}
											</p>
										</div>
									</div>
								</div>
							)}

							{seasons.length > 0 ? (
								<div className="grid gap-4 md:grid-cols-2">
									{seasons.map((season, index) => (
										<div
											key={`${season.name}-${index}`}
											className="space-y-3 rounded-lg border p-4"
										>
											<div className="flex flex-wrap items-center justify-between gap-2">
												<h3 className="font-semibold">{season.name}</h3>

												<Badge variant="secondary">{season.months}</Badge>
											</div>

											<p className="text-sm leading-relaxed text-muted-foreground">
												{season.description}
											</p>

											<Separator />

											<div className="flex items-center gap-2 text-sm">
												<Clock3 className="size-4 text-muted-foreground" />
												<span className="text-muted-foreground">
													Temperature:
												</span>
												<span className="font-medium">{season.temp}</span>
											</div>
										</div>
									))}
								</div>
							) : !destination.bestTimeToVisit ? (
								<EmptyState
									icon={CalendarDays}
									message="Seasonal information has not been added yet."
								/>
							) : null}
						</CardContent>
					</Card>

					{/* Attractions */}
					<Card>
						<CardHeader>
							<CardTitle>Attractions</CardTitle>
							<CardDescription>
								Places and experiences visitors can explore at this destination.
							</CardDescription>
						</CardHeader>

						<CardContent>
							{attractions.length > 0 ? (
								<div className="grid gap-4 md:grid-cols-2">
									{attractions.map((attraction, index) => (
										<div
											key={`${attraction.name}-${index}`}
											className="overflow-hidden rounded-lg border"
										>
											{attraction.image && (
												<MediaImage
													src={attraction.image}
													alt={attraction.name}
													className="rounded-none border-0"
												/>
											)}

											<div className="space-y-3 p-4">
												<div className="space-y-1.5">
													<div className="flex flex-wrap items-center justify-between gap-2">
														<h3 className="font-semibold">{attraction.name}</h3>

														<Badge variant="secondary">{attraction.type}</Badge>
													</div>

													<p className="text-sm leading-relaxed text-muted-foreground">
														{attraction.description}
													</p>
												</div>

												{(attraction.timings || attraction.entryFee) && (
													<>
														<Separator />

														<div className="grid gap-3 sm:grid-cols-2">
															{attraction.timings && (
																<DetailItem
																	label="Timings"
																	value={attraction.timings}
																/>
															)}

															{attraction.entryFee && (
																<DetailItem
																	label="Entry fee"
																	value={attraction.entryFee}
																/>
															)}
														</div>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptyState
									icon={MapPin}
									title="No attractions added"
									message="Add attractions to help travelers discover interesting places."
								/>
							)}
						</CardContent>
					</Card>

					{/* Cuisine */}
					<Card>
						<CardHeader>
							<CardTitle>Local cuisine</CardTitle>
							<CardDescription>
								Food and culinary experiences associated with this destination.
							</CardDescription>
						</CardHeader>

						<CardContent>
							{cuisine.length > 0 ? (
								<div className="grid gap-4 sm:grid-cols-2">
									{cuisine.map((item, index) => (
										<div
											key={`${item.name}-${index}`}
											className="flex items-start gap-3 rounded-lg border p-4"
										>
											<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
												<Utensils className="size-4 text-orange-600" />
											</div>

											<div className="space-y-1">
												<h3 className="text-sm font-semibold">{item.name}</h3>

												<p className="text-sm leading-relaxed text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptyState
									icon={Utensils}
									title="No cuisine information"
									message="Add local dishes and culinary experiences for this destination."
								/>
							)}
						</CardContent>
					</Card>

					{/* How to reach */}
					<Card>
						<CardHeader>
							<CardTitle>How to reach</CardTitle>
							<CardDescription>
								Available transportation options and travel information.
							</CardDescription>
						</CardHeader>

						<CardContent>
							{travelOptions.length > 0 ? (
								<div className="space-y-4">
									{travelOptions.map((option, index) => {
										const TransportIcon =
											option.mode === "Flight"
												? Plane
												: option.mode === "Train"
													? Train
													: option.mode === "Bus"
														? Bus
														: Map;

										return (
											<div
												key={`${option.mode}-${option.from}-${index}`}
												className="flex items-start gap-3 rounded-lg border p-4"
											>
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
													<TransportIcon className="size-5 text-primary" />
												</div>

												<div className="min-w-0 flex-1 space-y-2">
													<div className="flex flex-wrap items-center justify-between gap-2">
														<h3 className="font-semibold">{option.mode}</h3>

														<Badge variant="outline">{option.duration}</Badge>
													</div>

													<p className="text-sm text-muted-foreground">
														From {option.from}
													</p>

													<p className="text-sm leading-relaxed text-muted-foreground">
														{option.details}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<EmptyState
									icon={Map}
									title="No travel options added"
									message="Add flight, train, bus, or road information to help visitors plan their journey."
								/>
							)}
						</CardContent>
					</Card>

					{/* Travel tips and do/don't */}
					<BulletList
						title="Travel tips"
						description="Practical advice for travelers visiting this destination."
						items={travelTips}
					/>

					<div className="grid gap-6 lg:grid-cols-2">
						<BulletList
							title="Things to do"
							description="Recommended activities for visitors."
							items={doList}
						/>

						<BulletList
							title="Things to avoid"
							description="Precautions and activities visitors should avoid."
							items={dontList}
							variant="negative"
						/>
					</div>

					{/* Gallery */}
					<Card>
						<CardHeader className="flex-row items-start justify-between gap-3">
							<div className="space-y-1.5">
								<CardTitle>Destination gallery</CardTitle>

								<CardDescription>
									Additional images associated with this destination.
								</CardDescription>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link
									to="/destinations/$destinationId/edit"
									params={{ destinationId }}
								>
									<ImageIcon className="mr-2 size-4" />
									Manage
								</Link>
							</Button>
						</CardHeader>

						<CardContent>
							{gallery.length > 0 ? (
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{gallery.map((url, index) => (
										<MediaImage
											key={`${url}-${index}`}
											src={url}
											alt={`${destination.name} gallery image ${index + 1}`}
										/>
									))}
								</div>
							) : (
								<EmptyState
									icon={ImageIcon}
									title="No gallery images"
									message="Add additional images to showcase this destination."
								/>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right sidebar */}
				<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
					{/* Destination status */}
					<Card>
						<CardHeader>
							<CardTitle>Destination status</CardTitle>

							<CardDescription>
								Current visibility and promotion settings.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">
									Availability
								</span>

								<StatusBadge isActive={destination.isActive} />
							</div>

							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">Featured</span>

								<span className="text-sm font-medium">
									{destination.isFeatured ? "Yes" : "No"}
								</span>
							</div>

							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">Trending</span>

								<span className="text-sm font-medium">
									{destination.isTrending ? "Yes" : "No"}
								</span>
							</div>

							<Separator />

							<Button className="w-full" asChild>
								{editLink}
							</Button>
						</CardContent>
					</Card>

					{/* SEO preview */}
					<Card>
						<CardHeader>
							<CardTitle>SEO preview</CardTitle>

							<CardDescription>
								Search metadata configured for this destination.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-2">
							<p className="text-sm font-medium text-blue-700 dark:text-blue-400">
								{destination.seoTitle || destination.name}
							</p>

							<p className="break-all text-xs text-emerald-700 dark:text-emerald-400">
								/destinations/{destination.slug}
							</p>

							<p className="text-xs leading-relaxed text-muted-foreground">
								{destination.seoDescription ||
									destination.shortDescription ||
									"No SEO description provided."}
							</p>
						</CardContent>
					</Card>

					{/* Destination categories */}
					<Card>
						<CardHeader>
							<CardTitle>Classification</CardTitle>

							<CardDescription>
								Categories and destination attributes.
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							<div className="space-y-2">
								<p className="text-sm font-medium">Categories</p>

								<PillList
									items={categories}
									emptyMessage="No categories configured."
								/>
							</div>

							<Separator />

							<DetailItem
								label="Region"
								value={formatLabel(destination.region)}
							/>

							<DetailItem label="Country" value={destination.country} />

							<DetailItem
								label="Best time to visit"
								value={destination.bestTimeToVisit}
							/>
						</CardContent>
					</Card>

					{/* Record information */}
					<Card>
						<CardHeader>
							<CardTitle>Record information</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							<DetailItem label="Destination name" value={destination.name} />

							<DetailItem label="URL slug" value={destination.slug} />

							<DetailItem
								label="Destination ID"
								value={
									<code className="break-all font-mono text-xs">
										{destination.id}
									</code>
								}
							/>

							{(formatDate(createdAt) || formatDate(updatedAt)) && (
								<>
									<Separator />

									<div className="space-y-3 text-xs text-muted-foreground">
										{formatDate(createdAt) && (
											<div className="flex items-center gap-2">
												<Clock3 className="size-3.5 shrink-0" />
												<span>Created {formatDate(createdAt)}</span>
											</div>
										)}

										{formatDate(updatedAt) && (
											<div className="flex items-center gap-2">
												<Clock3 className="size-3.5 shrink-0" />
												<span>Updated {formatDate(updatedAt)}</span>
											</div>
										)}
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Travel details */}
					<Card>
						<CardHeader>
							<CardTitle>Travel details</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
									<Languages className="size-4 text-muted-foreground" />
								</div>

								<div className="min-w-0">
									<p className="text-xs text-muted-foreground">Language</p>
									<p className="break-words text-sm font-medium">
										{destination.language || "Not specified"}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
									<Banknote className="size-4 text-muted-foreground" />
								</div>

								<div className="min-w-0">
									<p className="text-xs text-muted-foreground">Currency</p>
									<p className="break-words text-sm font-medium">
										{destination.currency || "Not specified"}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
									<Globe className="size-4 text-muted-foreground" />
								</div>

								<div className="min-w-0">
									<p className="text-xs text-muted-foreground">Full location</p>
									<p className="break-words text-sm font-medium">
										{formattedLocation || "Not specified"}
									</p>
								</div>
							</div>

							{hasCoordinates && (
								<Button variant="outline" className="w-full" asChild>
									<a href={mapUrl!} target="_blank" rel="noreferrer">
										<MapPin className="mr-2 size-4" />
										Open map
									</a>
								</Button>
							)}
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
