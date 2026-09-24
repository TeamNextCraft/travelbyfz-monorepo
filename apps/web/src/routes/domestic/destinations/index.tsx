import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Search,
  MapPin,
  Mountain,
  Waves,
  Landmark,
  TreePine,
  Star,
  ArrowRight,
  X,
  Map,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";
import type { DestinationCategory, DestinationRegion, PublicDestination } from "@repo/types/domestic";
import { useQuery } from "@tanstack/react-query";
import { getPublicDestinations } from "#/server/actions/destinations.ts";
import { DESTINATIONS_LOCAL_DATA } from "#/lib/constants.ts";

const destSearchSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  category: z.string().optional(),
});

type Destination = PublicDestination;

// ─── Config ───────────────────────────────────────────────────────────────────

const REGIONS: { id: DestinationRegion | "All"; label: string; icon: React.ElementType }[] = [
  { id: "All", label: "All India", icon: Map },
  { id: "North", label: "North", icon: Mountain },
  { id: "South", label: "South", icon: Landmark },
  { id: "East", label: "East", icon: TreePine },
  { id: "West", label: "West", icon: Waves },
  { id: "Central", label: "Central", icon: Landmark },
  { id: "Islands", label: "Islands", icon: Waves },
];

const CATEGORIES: (DestinationCategory | "All")[] = [
  "All",
  "Beach",
  "Hill Station",
  "Cultural",
  "Religious",
  "Adventure",
  "Wildlife",
];

const CATEGORY_STYLES: Record<DestinationCategory, string> = {
  Beach: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Hill Station": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cultural: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Religious: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Adventure: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Wildlife: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/destinations/")({
  validateSearch: destSearchSchema,
  component: DestinationsPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function DestinationsPage() {
  const {
    data: fetchedDestinations,
    isPending,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["destinations"],
    queryFn: getPublicDestinations, 
  })

  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  
  const q = search.q ?? "";
  const activeRegion = (search.region as DestinationRegion | "All") ?? "All";
  const activeCategory = (search.category as DestinationCategory | "All") ?? "All";
  
  // const destinations = fetchedDestinations ?? [];
  const destinations = DESTINATIONS_LOCAL_DATA ?? [];
  const setSearch = (updates: Record<string, string | undefined>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  const clearFilters = () => navigate({ search: {}, replace: true });

  const hasActiveFilters =
    !!q ||
    (activeRegion !== "All" && !!activeRegion) ||
    (activeCategory !== "All" && !!activeCategory);

  // Trending destinations for the hero strip
  const trending = useMemo(
    () =>
      destinations
        .filter((d) => ("isTrending" in d ? d.isTrending : d.trending))
        .slice(0, 6),
    [destinations]
  );

  // Filtered results
  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (q) {
        const lower = q.toLowerCase();
        if (
          !d.name.toLowerCase().includes(lower) &&
          !d.state.toLowerCase().includes(lower) &&
          !d.tagline?.toLowerCase().includes(lower)
        )
          return false;
      }
      if (activeRegion !== "All" && d.region !== activeRegion) return false;
      if (activeCategory !== "All" && !d.category?.includes(activeCategory))
        return false;
      return true;
    });
  }, [q, activeRegion, activeCategory, destinations]);

  // Group by region for browsing view
  const groupedByRegion = useMemo(() => {
    const groups: Partial<Record<DestinationRegion, Destination[]>> = {};
    filtered.forEach((d) => {
      if (!groups[d.region]) groups[d.region] = [];
      groups[d.region]!.push(d);
    });
    return groups;
  }, [filtered]);

  const regionOrder: DestinationRegion[] = ["North", "South", "West", "East", "Central", "Islands"];

  const isFiltering = hasActiveFilters;

  console.log({
    file: "destinations/index.tsx",
    output: filtered,
    isPending,
    error,
    isError
  })

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Explore India
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Where do you want <br className="hidden sm:block" />
              to go next?
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">
              From the Himalayas to the Indian Ocean — {filtered.length} destinations
              across every region of India.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search destinations, states..."
                value={q}
                onChange={(e) =>
                  setSearch({ q: e.target.value || undefined })
                }
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              {q && (
                <button
                  onClick={() => setSearch({ q: undefined })}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative map dots — purely visual */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-5 dark:opacity-[0.03] pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </section>

      {/* ── Trending strip ───────────────────────────────────────────── */}
      {!isFiltering && (
        <section className="border-b bg-muted/20 py-8 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <span className="text-base">🔥</span> Trending Right Now
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {trending.map((dest) => (
                <TrendingCard key={dest.id} dest={dest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="border-b bg-background sticky top-[57px] z-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Region tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {REGIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  setSearch({ region: id === "All" ? undefined : id })
                }
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                  activeRegion === id || (id === "All" && !activeRegion)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </button>
            ))}

            <Separator orientation="vertical" className="h-5 mx-1 shrink-0" />

            {/* Category pills */}
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSearch({
                    category: activeCategory === cat ? undefined : cat,
                  })
                }
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors shrink-0",
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 shrink-0 underline underline-offset-2"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        {filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : isFiltering ? (
          // Flat grid when filtering
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              destination{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((dest) => (
                <DestinationCard key={dest.id} dest={dest} />
              ))}
            </div>
          </div>
        ) : (
          // Grouped by region when browsing all
          <div className="space-y-14">
            {regionOrder.map((region) => {
              const dests = groupedByRegion[region];
              if (!dests?.length) return null;
              return (
                <RegionSection key={region} region={region} destinations={dests} />
              );
            })}
          </div>
        )}
      </div>

      {/* ── CTA banner ───────────────────────────────────────────────── */}
      <section className="border-t bg-muted/30 py-16 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Can't find your dream destination?
          </h2>
          <p className="text-muted-foreground">
            We build custom itineraries to anywhere in India. Tell us where you
            want to go and we'll craft the perfect plan.
          </p>
          <Link
            to="/"
            search={{ scrollTo: "request" }}
            className={buttonVariants({ size: "lg", className: "gap-2" })}
          >
            Request a custom trip
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── Region Section ───────────────────────────────────────────────────────────

function RegionSection({
  region,
  destinations,
}: {
  region: DestinationRegion;
  destinations: Destination[];
}) {
  const regionMeta: Record<DestinationRegion, { emoji: string; description: string }> = {
    North: { emoji: "🏔️", description: "Himalayas, forts, heritage & spiritual heartland" },
    South: { emoji: "🌴", description: "Backwaters, temples, coffee hills & pristine coastlines" },
    East: { emoji: "🍵", description: "Tea gardens, tribal culture, Bengal delta & Himalayan foothills" },
    West: { emoji: "🏖️", description: "Desert, beaches, Bollywood & ancient stepwells" },
    Central: { emoji: "🐯", description: "Tiger reserves, UNESCO temples & the heart of India" },
    Islands: { emoji: "🐠", description: "Coral reefs, turquoise lagoons & untouched island beaches" },
  };

  const { emoji, description } = regionMeta[region];

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span aria-hidden="true">{emoji}</span>
            {region} India
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {destinations.map((dest) => (
          <DestinationCard key={dest.id} dest={dest} />
        ))}
      </div>
    </div>
  );
}

// ─── Destination Card ─────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      to="/domestic/destinations/$slug"
      params={{ slug: dest.id }}
      className="group block rounded-2xl overflow-hidden border border-border/60 bg-background hover:shadow-lg transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={300}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Trending badge */}
        {dest.trending && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 text-xs font-semibold">
            🔥 Trending
          </Badge>
        )}

        {/* Category pills */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {(dest.category !== null) ? dest.category.slice(0, 1).map((cat) => (
            <Badge
              key={cat}
              className={cn("border-0 text-xs", CATEGORY_STYLES[cat])}
            >
              {cat}
            </Badge>
          )) : (<></>)}
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-lg leading-tight drop-shadow">
            {dest.name}
          </p>
          <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={10} />
            {dest.state}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-3">
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {dest.tagline}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1">
          {dest.highlights?.slice(0, 2).map((h) => (
            <span
              key={h}
              className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {dest.rating}
            </span>
            <span>{dest.tourCount} tours</span>
          </div>
          <span className="text-xs text-primary font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Explore
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Trending Card (compact) ──────────────────────────────────────────────────

function TrendingCard({ dest }: { dest: Destination }) {
  return (
    <Link
      to="/domestic/destinations/$slug"
      params={{ slug: dest.id }}
      className="group relative overflow-hidden rounded-xl aspect-square block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        width={200}
        height={200}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-sm font-bold leading-tight">{dest.name}</p>
        <p className="text-white/70 text-xs">{dest.state}</p>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-4xl">
        🗺️
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">No destinations found</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Try adjusting your filters or search term.
        </p>
      </div>
      <button
        onClick={onClear}
        className={buttonVariants({ variant: "outline" })}
      >
        Clear filters
      </button>
    </div>
  );
}
