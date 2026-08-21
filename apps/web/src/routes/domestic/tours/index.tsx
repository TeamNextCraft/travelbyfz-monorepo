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
  ChevronDown,
  Grid2X2,
  List,
  Filter,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "Beach" | "Adventure" | "Cultural" | "Religious" | "Hill Station";
type SortOption = "popular" | "price-asc" | "price-desc" | "rating" | "duration-asc";
type ViewMode = "grid" | "list";

type Tour = {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  price: number;
  rating: number;
  reviewCount: number;
  category: Category;
  image: string;
  tag?: string;
  groupSize: number;
  highlights: string[];
};

// ─── Search Params Schema (URL-persisted filters) ─────────────────────────────

const toursSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["popular", "price-asc", "price-desc", "rating", "duration-asc"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  maxDays: z.number().optional(),
  state: z.string().optional(),
});

type ToursSearch = z.infer<typeof toursSearchSchema>;

// ─── Static tour data (replace with loader + DB) ─────────────────────────────

const ALL_TOURS: Tour[] = [
  {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    duration: "5D / 4N",
    durationDays: 5,
    price: 18500,
    rating: 4.9,
    reviewCount: 312,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    tag: "Best Seller",
    groupSize: 12,
    highlights: ["Houseboat stay", "Spice plantation", "Kathakali show"],
  },
  {
    id: "rajasthan-royals",
    title: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    duration: "7D / 6N",
    durationDays: 7,
    price: 24999,
    rating: 4.8,
    reviewCount: 198,
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    tag: "Popular",
    groupSize: 10,
    highlights: ["Amber Fort", "Desert safari", "Lake Pichola cruise"],
  },
  {
    id: "spiti-valley",
    title: "Spiti Valley Expedition",
    destination: "Kaza",
    state: "Himachal Pradesh",
    duration: "8D / 7N",
    durationDays: 8,
    price: 32000,
    rating: 4.7,
    reviewCount: 145,
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80",
    tag: "New",
    groupSize: 8,
    highlights: ["Key Monastery", "Chandratal Lake", "4WD off-roading"],
  },
  {
    id: "char-dham",
    title: "Char Dham Yatra",
    destination: "Badrinath · Kedarnath · Gangotri · Yamunotri",
    state: "Uttarakhand",
    duration: "12D / 11N",
    durationDays: 12,
    price: 42000,
    rating: 4.9,
    reviewCount: 421,
    category: "Religious",
    image: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
    tag: "Best Seller",
    groupSize: 15,
    highlights: ["4 sacred shrines", "Helicopter option", "Vedic rituals"],
  },
  {
    id: "coorg-retreat",
    title: "Coorg Coffee & Nature Retreat",
    destination: "Madikeri",
    state: "Karnataka",
    duration: "4D / 3N",
    durationDays: 4,
    price: 14500,
    rating: 4.6,
    reviewCount: 87,
    category: "Hill Station",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
    groupSize: 10,
    highlights: ["Coffee plantation walk", "Abbey Falls", "Jungle safari"],
  },
  {
    id: "andaman-escape",
    title: "Andaman Island Escape",
    destination: "Port Blair · Havelock",
    state: "Andaman & Nicobar",
    duration: "6D / 5N",
    durationDays: 6,
    price: 38000,
    rating: 4.8,
    reviewCount: 230,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80",
    groupSize: 12,
    highlights: ["Scuba diving", "Radhanagar Beach", "Cellular Jail tour"],
  },
  {
    id: "varanasi-spiritual",
    title: "Varanasi Spiritual Journey",
    destination: "Varanasi",
    state: "Uttar Pradesh",
    duration: "3D / 2N",
    durationDays: 3,
    price: 9800,
    rating: 4.7,
    reviewCount: 176,
    category: "Religious",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80",
    groupSize: 15,
    highlights: ["Ganga Aarti", "Sunrise boat ride", "Sarnath visit"],
  },
  {
    id: "manali-adventure",
    title: "Manali Adventure & Snow",
    destination: "Manali",
    state: "Himachal Pradesh",
    duration: "6D / 5N",
    durationDays: 6,
    price: 22000,
    rating: 4.7,
    reviewCount: 289,
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    tag: "Popular",
    groupSize: 12,
    highlights: ["Rohtang Pass", "River rafting", "Solang Valley zip-line"],
  },
  {
    id: "goa-beaches",
    title: "Goa Sun, Sand & Seafood",
    destination: "North & South Goa",
    state: "Goa",
    duration: "5D / 4N",
    durationDays: 5,
    price: 16500,
    rating: 4.5,
    reviewCount: 341,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
    groupSize: 15,
    highlights: ["Beach hopping", "Water sports", "Spice plantation tour"],
  },
  {
    id: "ooty-nilgiris",
    title: "Ooty & Nilgiris Explorer",
    destination: "Ooty",
    state: "Tamil Nadu",
    duration: "4D / 3N",
    durationDays: 4,
    price: 12000,
    rating: 4.5,
    reviewCount: 112,
    category: "Hill Station",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600&q=80",
    groupSize: 10,
    highlights: ["Toy train ride", "Botanical Garden", "Tea estate walk"],
  },
  {
    id: "golden-triangle",
    title: "Golden Triangle — Delhi Agra Jaipur",
    destination: "Delhi · Agra · Jaipur",
    state: "Multi-State",
    duration: "6D / 5N",
    durationDays: 6,
    price: 19500,
    rating: 4.8,
    reviewCount: 507,
    category: "Cultural",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
    groupSize: 12,
    highlights: ["Taj Mahal sunrise", "Red Fort", "City Palace Jaipur"],
  },
  {
    id: "ladakh-expedition",
    title: "Ladakh Land of High Passes",
    destination: "Leh · Nubra · Pangong",
    state: "Ladakh",
    duration: "9D / 8N",
    durationDays: 9,
    price: 45000,
    rating: 4.9,
    reviewCount: 193,
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
    groupSize: 8,
    highlights: ["Pangong Lake", "Nubra Valley", "Khardung La pass"],
  },
];

const ALL_STATES = [...new Set(ALL_TOURS.map((t) => t.state))].sort();
const CATEGORIES: Category[] = ["Beach", "Adventure", "Cultural", "Religious", "Hill Station"];

const CATEGORY_STYLES: Record<Category, string> = {
  Beach: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Adventure: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Cultural: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Religious: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Hill Station": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "duration-asc", label: "Shortest Duration" },
];

const MAX_PRICE = 50000;

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/tours/")({
  validateSearch: toursSearchSchema,
  // When you hook up a DB, swap static data:
  // loader: async ({ context }) => ({ tours: await getAllTours() }),
  component: ToursPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function ToursPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/domestic/tours/" });

  // Local UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  // Derive filter state from URL search params
  const q = search.q ?? "";
  const category = search.category ?? "";
  const sort = search.sort ?? "popular";
  const minPrice = search.minPrice ?? 0;
  const maxPrice = search.maxPrice ?? MAX_PRICE;
  const maxDays = search.maxDays ?? 30;
  const selectedState = search.state ?? "";

  // Update URL search params
  const setSearch = (updates: Partial<ToursSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  const clearAllFilters = () => {
    navigate({ search: {}, replace: true });
  };

  // Count active filters for badge
  const activeFilterCount = [
    category,
    selectedState,
    search.minPrice,
    search.maxPrice !== undefined && search.maxPrice < MAX_PRICE,
    search.maxDays && search.maxDays < 30,
  ].filter(Boolean).length;

  // Filter + sort logic
  const filteredTours = useMemo(() => {
    let result = ALL_TOURS.filter((tour) => {
      if (q) {
        const lower = q.toLowerCase();
        if (
          !tour.title.toLowerCase().includes(lower) &&
          !tour.destination.toLowerCase().includes(lower) &&
          !tour.state.toLowerCase().includes(lower)
        )
          return false;
      }
      if (category && tour.category !== category) return false;
      if (selectedState && tour.state !== selectedState) return false;
      if (tour.price < minPrice || tour.price > maxPrice) return false;
      if (tour.durationDays > maxDays) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "duration-asc":
        result.sort((a, b) => a.durationDays - b.durationDays);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [q, category, selectedState, minPrice, maxPrice, maxDays, sort]);

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
            {ALL_TOURS.length} handcrafted domestic tours — from weekend
            getaways to epic multi-week expeditions.
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
              onChange={(e) =>
                setSearch({ q: e.target.value || undefined })
              }
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
                        {ALL_STATES.map((s) => (
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
                  : "text-muted-foreground hover:bg-muted"
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
                  : "text-muted-foreground hover:bg-muted"
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
            {(search.minPrice || (search.maxPrice && search.maxPrice < MAX_PRICE)) && (
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
              for{" "}
              <span className="font-semibold text-foreground">"{q}"</span>
            </>
          )}
        </p>

        {/* ── Tour Grid / List ──────────────────────────────────────────── */}
        {filteredTours.length === 0 ? (
          <EmptyState onClear={clearAllFilters} />
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourGridCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTours.map((tour) => (
              <TourListCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function TourGridCard({ tour }: { tour: Tour }) {
  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border-border/60">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={600}
          height={375}
        />
        {tour.tag && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 font-semibold text-xs">
            {tour.tag}
          </Badge>
        )}
        <Badge
          className={cn(
            "absolute top-3 right-3 border-0 text-xs font-medium",
            CATEGORY_STYLES[tour.category]
          )}
        >
          {tour.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h2 className="font-bold text-base leading-snug">{tour.title}</h2>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
          <MapPin size={12} aria-hidden="true" />
          <span className="truncate">{tour.destination}</span>
          <span className="mx-1 text-border">·</span>
          <span className="shrink-0">{tour.state}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {tour.rating}
            <span className="text-muted-foreground/70">({tour.reviewCount})</span>
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tour.highlights.slice(0, 2).map((h) => (
            <span
              key={h}
              className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border/60">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-xl font-bold text-primary leading-tight">
            ₹{tour.price.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-muted-foreground"> /person</span>
          </p>
        </div>
        <Link
          to="/domestic/tours/$tourId"
          params={{ tourId: tour.id }}
          className={buttonVariants({ size: "sm" })}
        >
          View tour
        </Link>
      </CardFooter>
    </Card>
  );
}

// ─── List Card ────────────────────────────────────────────────────────────────

function TourListCard({ tour }: { tour: Tour }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative overflow-hidden sm:w-56 shrink-0 aspect-video sm:aspect-auto">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={224}
            height={160}
          />
          {tour.tag && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 font-semibold text-xs">
              {tour.tag}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  className={cn(
                    "border-0 text-xs font-medium",
                    CATEGORY_STYLES[tour.category]
                  )}
                >
                  {tour.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star size={11} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  {tour.rating} ({tour.reviewCount} reviews)
                </span>
              </div>
              <h2 className="font-bold text-base leading-snug">{tour.title}</h2>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin size={12} aria-hidden="true" />
                <span>{tour.destination}, {tour.state}</span>
              </div>
            </div>

            {/* Price — visible at md+ */}
            <div className="hidden sm:block text-right shrink-0">
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-2xl font-bold text-primary leading-tight">
                ₹{tour.price.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">/person</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Clock size={13} aria-hidden="true" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1">
              <ChevronDown size={13} aria-hidden="true" />
              Max {tour.groupSize} people
            </span>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tour.highlights.map((h) => (
              <span
                key={h}
                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            {/* Price on mobile */}
            <div className="sm:hidden">
              <p className="text-lg font-bold text-primary leading-tight">
                ₹{tour.price.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-muted-foreground"> /person</span>
              </p>
            </div>
            <div className="sm:hidden" />

            <Link
              to="/domestic/tours/$tourId"
              params={{ tourId: tour.id }}
              className={buttonVariants({ size: "sm", className: "ml-auto" })}
            >
              View tour
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