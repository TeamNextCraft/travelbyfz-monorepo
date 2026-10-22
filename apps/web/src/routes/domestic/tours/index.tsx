import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Star,
  ArrowUpDown,
  X,
  Grid2X2,
  List,
  Filter,
  ArrowRight,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Badge } from "#/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/components/ui/sheet";
import { Slider } from "#/components/ui/slider";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { ScrollArea } from "#/components/ui/scroll-area";
import { cn } from "#/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getPublicTours } from "#/server/actions/tours.ts";
import type { PublicTour } from "@repo/types/domestic/tour"
import { ToursError, ToursLoading } from "#/components/common/domestic/tours-status-components.tsx";
import { useServerFn } from "@tanstack/react-start";

type Category =
  | "Beach"
  | "Adventure"
  | "Cultural"
  | "Religious"
  | "Hill Station";
type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "duration-asc";
type ViewMode = "grid" | "list";

const toursSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z
    .enum(["popular", "price-asc", "price-desc", "rating", "duration-asc"])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  maxDays: z.number().optional(),
  state: z.string().optional(),
});

type ToursSearch = z.infer<typeof toursSearchSchema>;

const CATEGORIES: Category[] = [
  "Beach",
  "Adventure",
  "Cultural",
  "Religious",
  "Hill Station",
];

const CATEGORY_STYLES: Record<string, string> = {
  Beach: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Adventure:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Cultural:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Religious:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Hill Station":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "duration-asc", label: "Shortest Duration" },
];

const MAX_PRICE = 50000;

export const Route = createFileRoute("/domestic/tours/")({
  validateSearch: toursSearchSchema,
  component: ToursPage,
});

function ToursPage() {

  const fetchTours = useServerFn(getPublicTours);

  const {
    data: fetchedTours,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["tours-array"],
    queryFn: () => fetchTours(),
  });

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/domestic/tours/" });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const q = search.q ?? "";
  const category = search.category ?? "";
  const sort = search.sort ?? "popular";
  const minPrice = search.minPrice ?? 0;
  const maxPrice = search.maxPrice ?? MAX_PRICE;
  const maxDays = search.maxDays ?? 30;
  const selectedState = search.state ?? "";

  const tours = fetchedTours ?? [];

  const allStates = useMemo(
    () => [...new Set(tours.map((tour) => tour.state))].sort(),
    [tours],
  );

  const filteredTours = useMemo(() => {
    const result = tours.filter((tour) => {
      if (tour.price === null) return false;

      const query = q.trim().toLowerCase();

      const matchesSearch =
        !query ||
        tour.title.toLowerCase().includes(query) ||
        tour.destination.toLowerCase().includes(query) ||
        tour.state.toLowerCase().includes(query);

      const matchesCategory =
        !category || tour.category === category;

      const matchesState =
        !selectedState || tour.state === selectedState;

      const matchesPrice =
        tour.price >= minPrice && tour.price <= maxPrice;

      const matchesDuration =
        tour.durationDays <= maxDays;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesState &&
        matchesPrice &&
        matchesDuration
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        case "duration-asc":
          return a.durationDays - b.durationDays;

        case "popular":
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [
    tours,
    q,
    category,
    selectedState,
    minPrice,
    maxPrice,
    maxDays,
    sort,
  ]);

  const setSearch = (updates: Partial<ToursSearch>) => {
    navigate({
      search: (previous) => ({
        ...previous,
        ...updates,
      }),
      replace: true,
    });
  };

  const clearAllFilters = () => {
    navigate({
      search: {},
      replace: true,
    });
  };

  const activeFilterCount = [
    category,
    selectedState,
    search.minPrice !== undefined,
    search.maxPrice !== undefined && search.maxPrice < MAX_PRICE,
    search.maxDays !== undefined && search.maxDays < 30,
  ].filter(Boolean).length;

  // Tours those published but not yet planned to departure
  const published_only_tours = tours.filter(t => t.price === null);

  const hasScheduledTours = filteredTours.length > 0;
  const hasUnscheduledTours = published_only_tours.length > 0;
  const hasAnyTours = hasScheduledTours || hasUnscheduledTours;

  const TourCard = viewMode === "grid" ? TourGridCard : TourListCard;

  const toursLayoutClassName =
    viewMode === "grid"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "flex flex-col gap-4";


  console.log({
    tours: tours,
    published_only_tours: published_only_tours,
  })


  return (
    <main>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Explore India
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            All Tour Packages
          </h1>
          <p className="text-muted-foreground max-w-xl">
            {tours.length} handcrafted domestic tours — from weekend getaways to
            epic multi-week expeditions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search tours, destinations, states..."
              value={q}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
              className="pl-9 w-full"
            />
            {q && (
              <button
                onClick={() => setSearch({ q: undefined })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <Select
            value={sort}
            onValueChange={(v) => setSearch({ sort: v as SortOption })}
          >
            <SelectTrigger className="w-full sm:w-48 shrink-0">
              <ArrowUpDown size={14} className="mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter sheet trigger */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="shrink-0 gap-2">
                <Filter size={14} aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="px-5 py-4 border-b">
                <SheetTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-[calc(100dvh-80px)]">
                <div className="p-5 space-y-7">
                  {/* Category */}
                  <FilterSection title="Category">
                    <div className="space-y-2.5">
                      {CATEGORIES.map((cat) => (
                        <div key={cat} className="flex items-center gap-2.5">
                          <Checkbox
                            id={`cat-${cat}`}
                            checked={category === cat}
                            onCheckedChange={(checked) =>
                              setSearch({
                                category: checked ? cat : undefined,
                              })
                            }
                          />
                          <Label
                            htmlFor={`cat-${cat}`}
                            className="text-sm cursor-pointer font-normal"
                          >
                            {cat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FilterSection>

                  <Separator />

                  {/* State */}
                  <FilterSection title="State / Region">
                    <Select
                      value={selectedState || "all"}
                      onValueChange={(v) =>
                        setSearch({ state: v === "all" ? undefined : v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All states</SelectItem>
                        {allStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <Separator />

                  {/* Price range */}
                  <FilterSection title="Budget (per person)">
                    <div className="pt-1 space-y-4">
                      <Slider
                        min={0}
                        max={MAX_PRICE}
                        step={500}
                        value={[minPrice, maxPrice]}
                        onValueChange={([min, max]) =>
                          setSearch({
                            minPrice: min > 0 ? min : undefined,
                            maxPrice: max < MAX_PRICE ? max : undefined,
                          })
                        }
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>₹{minPrice.toLocaleString("en-IN")}</span>
                        <span>
                          {maxPrice >= MAX_PRICE
                            ? "₹50,000+"
                            : `₹${maxPrice.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    </div>
                  </FilterSection>

                  <Separator />

                  {/* Duration */}
                  <FilterSection title="Max Duration (days)">
                    <div className="pt-1 space-y-4">
                      <Slider
                        min={1}
                        max={15}
                        step={1}
                        value={[Math.min(maxDays, 15)]}
                        onValueChange={([v]) =>
                          setSearch({ maxDays: v < 15 ? v : undefined })
                        }
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Up to{" "}
                        <span className="font-semibold text-foreground">
                          {maxDays >= 15 ? "15+" : maxDays}
                        </span>{" "}
                        days
                      </p>
                    </div>
                  </FilterSection>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* View mode toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Grid view"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ── Active filter chips ───────────────────────────────────────── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {category && (
              <FilterChip
                label={`Category: ${category}`}
                onRemove={() => setSearch({ category: undefined })}
              />
            )}
            {selectedState && (
              <FilterChip
                label={`State: ${selectedState}`}
                onRemove={() => setSearch({ state: undefined })}
              />
            )}
            {(search.minPrice ||
              (search.maxPrice && search.maxPrice < MAX_PRICE)) && (
                <FilterChip
                  label={`₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice >= MAX_PRICE ? "50,000+" : maxPrice.toLocaleString("en-IN")}`}
                  onRemove={() =>
                    setSearch({ minPrice: undefined, maxPrice: undefined })
                  }
                />
              )}
            {search.maxDays && search.maxDays < 30 && (
              <FilterChip
                label={`Max ${maxDays} days`}
                onRemove={() => setSearch({ maxDays: undefined })}
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Results count ─────────────────────────────────────────────── */}
        <p className="text-sm text-muted-foreground mb-5">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredTours.length}
          </span>{" "}
          {filteredTours.length === 1 ? "tour" : "tours"}
          {q && (
            <>
              {" "}
              for <span className="font-semibold text-foreground">"{q}"</span>
            </>
          )}
        </p>

        {/* ── Tour Grid / List ──────────────────────────────────────────── */}
        {isPending ? (
          <ToursLoading />
        ) : isError ? (
          <ToursError error={error} onRetry={refetch} />
        ) : !hasAnyTours ? (
          <EmptyState onClear={clearAllFilters} />
        ) : (
          <div className="space-y-12">
            {hasScheduledTours && (
              <section aria-labelledby="available-tours-heading">
                <div className="mb-5">
                  <h2
                    id="available-tours-heading"
                    className="text-xl font-semibold tracking-tight"
                  >
                    Available to book
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore tours with upcoming departures and choose your travel dates.
                  </p>
                </div>

                <div className={toursLayoutClassName}>
                  {filteredTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </section>
            )}

            {hasUnscheduledTours && (
              <section
                aria-labelledby="upcoming-tours-heading"
                className={
                  hasScheduledTours ? "border-t border-border/60 pt-8" : undefined
                }
              >
                <div className="mb-5">
                  <h2
                    id="upcoming-tours-heading"
                    className="text-xl font-semibold tracking-tight"
                  >
                    More tours to explore
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    These tours aren’t currently open for booking.
                    Explore the itineraries and enquire about future departures.
                  </p>
                </div>

                <div className={toursLayoutClassName}>
                  {published_only_tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main >
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function TourGridCard({ tour }: { tour: PublicTour }) {
  const hasPrice = tour.price != null;

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden border-border/60 py-0 transition-shadow duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Link
          to="/domestic/tours/$slug"
          params={{ slug: tour.slug }}
          aria-label={`View ${tour.title}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
            loading="lazy"
            width={600}
            height={375}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tour.tag && (
              <Badge className="border-0 bg-amber-400 text-xs font-semibold text-black">
                {tour.tag}
              </Badge>
            )}

            {!hasPrice && (
              <Badge className="border-0 bg-background/95 text-xs text-foreground shadow-sm">
                Dates coming soon
              </Badge>
            )}
          </div>

          <Badge
            className={cn(
              "shrink-0 border-0 text-xs font-medium",
              CATEGORY_STYLES[tour.category],
            )}
          >
            {tour.category}
          </Badge>
        </div>
      </div>

      {/* Title and destination */}
      <CardHeader className="gap-2 px-5 pb-3 pt-5">
        <h3 className="text-base font-bold leading-snug">
          <Link
            to="/domestic/tours/$slug"
            params={{ slug: tour.slug }}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {tour.title}
          </Link>
        </h3>

        <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />

          <span className="truncate">
            {tour.destination}
            {tour.state && tour.state !== tour.destination
              ? `, ${tour.state}`
              : ""}
          </span>
        </div>
      </CardHeader>

      {/* Details */}
      <CardContent className="flex-1 space-y-3 px-5 pb-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={13} aria-hidden="true" />
            {tour.duration}
          </span>

          {tour.groupSize > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users size={13} aria-hidden="true" />
              Max {tour.groupSize} people
            </span>
          )}
        </div>

        <TourRating
          rating={tour.rating}
          reviewCount={tour.reviewCount}
        />

        {tour.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tour.highlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {highlight}
              </span>
            ))}

            {tour.highlights.length > 2 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                +{tour.highlights.length - 2} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Price and action */}
      <CardFooter className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-border/60 bg-muted/20 px-5 py-4">
        <TourPrice price={tour.price} />

        <Link
          to="/domestic/tours/$slug"
          params={{ slug: tour.slug }}
          className={buttonVariants({
            variant: hasPrice ? "default" : "outline",
            size: "sm",
            className: "shrink-0 gap-1.5",
          })}
        >
          View tour
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}

function TourListCard({ tour }: { tour: PublicTour }) {
  const hasPrice = tour.price != null;

  return (
    <Card className="group gap-0 overflow-hidden border-border/60 py-0 transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-52 lg:w-60">
          <Link
            to="/domestic/tours/$slug"
            params={{ slug: tour.slug }}
            aria-label={`View ${tour.title}`}
            className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <img
              src={tour.image}
              alt={tour.title}
              className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none sm:absolute sm:inset-0"
              loading="lazy"
              width={600}
              height={375}
            />
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
            {tour.tag && (
              <Badge className="border-0 bg-amber-400 text-xs font-semibold text-black">
                {tour.tag}
              </Badge>
            )}

            {!hasPrice && (
              <Badge className="border-0 bg-background/95 text-xs text-foreground shadow-sm">
                Dates coming soon
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "border-0 text-xs font-medium",
                    CATEGORY_STYLES[tour.category],
                  )}
                >
                  {tour.category}
                </Badge>

                <TourRating
                  rating={tour.rating}
                  reviewCount={tour.reviewCount}
                />
              </div>

              <h3 className="text-base font-bold leading-snug sm:text-lg">
                <Link
                  to="/domestic/tours/$slug"
                  params={{ slug: tour.slug }}
                  className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {tour.title}
                </Link>
              </h3>

              <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <span>
                  {tour.destination}
                  {tour.state && tour.state !== tour.destination
                    ? `, ${tour.state}`
                    : ""}
                </span>
              </div>
            </div>

            {/* Desktop price */}
            <TourPrice
              price={tour.price}
              className="hidden max-w-44 shrink-0 text-right sm:block"
            />
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" />
              {tour.duration}
            </span>

            {tour.groupSize > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users size={13} aria-hidden="true" />
                Max {tour.groupSize} people
              </span>
            )}
          </div>

          {/* Highlights */}
          {tour.highlights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tour.highlights.slice(0, 3).map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {highlight}
                </span>
              ))}

              {tour.highlights.length > 3 && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  +{tour.highlights.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-border/50 pt-4">
            <TourPrice
              price={tour.price}
              className="sm:hidden"
            />

            <Link
              to="/domestic/tours/$slug"
              params={{ slug: tour.slug }}
              className={buttonVariants({
                variant: hasPrice ? "default" : "outline",
                size: "sm",
                className: "ml-auto shrink-0 gap-1.5",
              })}
            >
              View tour
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Search size={28} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">No tours found</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Try adjusting your filters or search query to find what you're looking
          for.
        </p>
      </div>
      <Button variant="outline" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="hover:text-primary/60 transition-colors"
      >
        <X size={12} />
      </button>
    </span>
  );
}

// ─── Filter section wrapper ───────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function TourPrice({
  price,
  className,
}: {
  price: PublicTour["price"];
  className?: string;
}) {
  if (price == null) {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="text-sm font-semibold text-foreground">
          Dates to be announced
        </p>
        <p className="text-xs text-muted-foreground">
          Enquire about future departures
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs text-muted-foreground">From</p>

      <p className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
        ₹{price.toLocaleString("en-IN")}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Per person · twin sharing
      </p>

      <p className="text-xs text-muted-foreground">Excludes GST</p>
    </div>
  );
}

function TourRating({
  rating,
  reviewCount,
}: {
  rating: PublicTour["rating"];
  reviewCount: PublicTour["reviewCount"];
}) {
  if (reviewCount <= 0) {
    return (
      <span className="text-xs text-muted-foreground">
        No reviews yet
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <Star
        size={13}
        className="fill-amber-400 text-amber-400"
        aria-hidden="true"
      />

      <span className="font-semibold text-foreground">{rating}</span>

      <span className="text-muted-foreground">
        ({reviewCount.toLocaleString("en-IN")}{" "}
        {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </span>
  );
}
