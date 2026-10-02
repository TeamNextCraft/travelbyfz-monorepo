import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Phone,
  Share2,
  Heart,
  Utensils,
  BedDouble,
  Bus,
  Camera,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";
import { getPublicTourbySlug, getTourReviews } from "#/server/actions/tours";
import { useQuery } from "@tanstack/react-query"
import { TourDetailSkeleton } from "#/components/common/domestic/tour-details-skeleton";
import { TourDetailError } from "#/components/common/domestic/tour-details-error";
import { useServerFn } from "@tanstack/react-start";
import type { PublicTour } from "@repo/types/domestic/tour"

type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  location: string;
};

export const Route = createFileRoute("/domestic/tours/$slug/")({
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🗺️</div>
      <h1 className="text-2xl font-bold">Tour not found</h1>
      <p className="text-muted-foreground max-w-xs">
        This tour doesn't exist or may have been removed.
      </p>
      <Link to="/domestic/tours" className={buttonVariants()}>
        Browse all tours
      </Link>
    </div>
  ),
  component: TourDetailPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function TourDetailPage() {

  const { slug } = Route.useParams();
  const fetchTourDetails = useServerFn(getPublicTourbySlug);
  const fetchTourReviews = useServerFn(getTourReviews);
  const [selectedTier, setSelectedTier] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const {
    data: fetchedTour,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tour", slug],
    queryFn: () => fetchTourDetails({ data: { slug } }),
  });

  const tourId = fetchedTour?.id;

  const {
    data: fetchedReviews,
    isPending: reviewsPending,
    isError: reviewsIsError,
    error: reviewsError,
    refetch: reviewsRefetch,
  } = useQuery({
    queryKey: ["tour-reviews", tourId],
    queryFn: () => {
      if (!tourId) throw new Error("Tour ID is missing");

      return fetchTourReviews({ data: { tourId } });
    },
    enabled: !!tourId,
  });

  console.log({
    file: "tours/$slug/index.tsx",
    fetchedTour: fetchedTour
  })

  if (isPending) {
    return <TourDetailSkeleton />;
  }

  if (isError) {
    return <TourDetailError error={error} onRetry={() => refetch()} />
  }

  if (!fetchedTour) {
    throw notFound();
  }

  if (!fetchedTour.destination) throw notFound();

  const selectedPrice = fetchedTour?.pricingTiers[selectedTier]?.price;

  return (
    <TooltipProvider>
      <main>
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
              aria-label="Breadcrumb"
            >
              <Link to="/domestic" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <Link
                to="/domestic/tours"
                className="hover:text-foreground transition-colors"
              >
                Tours
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <span className="text-foreground font-medium truncate max-w-xs">
                {fetchedTour.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* ── Left / Main column ───────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              {fetchedTour.images === null || fetchedTour.images?.length === 0 ? (
                <div
                  className="flex aspect-[16/9] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/50 px-4 text-center"
                  role="img"
                  aria-label={`No photos available for ${fetchedTour.title}`}
                >
                  <Camera
                    size={36}
                    className="text-muted-foreground/60"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">No photos available yet</p>
                    <p className="text-sm text-muted-foreground">
                      Photos for this tour will be added soon.
                    </p>
                  </div>
                </div>
              ) : (
                <GallerySection images={fetchedTour.images} title={fetchedTour.title} />
              )}
              {/* Title block */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {fetchedTour.tag && (
                    <Badge className="bg-amber-500 text-black border-0 font-semibold text-xs">
                      {fetchedTour.tag}
                    </Badge>
                  )}
                  <Badge variant="secondary">{fetchedTour.category}</Badge>
                  <DifficultyBadge level={fetchedTour.difficulty} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                      {fetchedTour.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">{fetchedTour.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          aria-label="Share fetchedTour"
                          onClick={() =>
                            navigator.share?.({
                              title: fetchedTour.title,
                              url: window.location.href,
                            })
                          }
                        >
                          <Share2 size={15} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-9 w-9 transition-colors",
                            wishlisted &&
                            "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20"
                          )}
                          aria-label={
                            wishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          onClick={() => setWishlisted((v) => !v)}
                        >
                          <Heart
                            size={15}
                            className={cn(wishlisted && "fill-red-500")}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {wishlisted ? "Wishlisted" : "Add to wishlist"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Quick meta row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden="true" />
                    {fetchedTour.destination}, {fetchedTour.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} aria-hidden="true" />
                    {fetchedTour.durationDays}D / {fetchedTour.durationNights}N
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} aria-hidden="true" />
                    Max {fetchedTour.groupSize} people
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-foreground">
                      {fetchedTour.rating}
                    </span>
                    <span>({fetchedTour.reviewCount} reviews)</span>
                  </span>
                </div>
              </div>

              <Separator />

              {/* Tabs — Overview / Itinerary / Inclusions / Reviews */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">
                    Itinerary ({fetchedTour.durationDays}D)
                  </TabsTrigger>
                  <TabsTrigger value="inclusions">
                    Inclusions
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({fetchedTour.reviewCount})
                  </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {fetchedTour.overview}
                  </p>

                  <div>
                    <h2 className="font-bold text-lg mb-3">
                      fetchedTour Highlights
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {fetchedTour.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            size={16}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: BedDouble, label: "Accommodation", value: `${fetchedTour.durationDays - 1} Nights` },
                      { icon: Bus, label: "Transport", value: "AC Vehicle" },
                      { icon: Utensils, label: "Meals", value: "As per plan" },
                      { icon: Camera, label: "Sightseeing", value: "Guided" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/60"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon size={15} aria-hidden="true" />
                        </div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Important notes */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 space-y-2">
                    <h3 className="flex items-center gap-2 font-semibold text-sm text-amber-800 dark:text-amber-400">
                      <Info size={15} aria-hidden="true" />
                      Important Notes
                    </h3>
                    <ul className="space-y-1.5">
                      {fetchedTour.importantNotes?.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-amber-800/80 dark:text-amber-400/80"
                        >
                          <AlertCircle
                            size={13}
                            className="shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Itinerary */}
                <TabsContent value="itinerary" className="mt-6">
                  <Accordion type="single" collapsible defaultValue="day-1">
                    {fetchedTour?.itinerary?.map((day) => (
                      <AccordionItem
                        key={day.day}
                        value={`day-${day.day}`}
                        className="border border-border/60 rounded-xl mb-3 px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {day.day}
                            </span>
                            <div>
                              <p className="font-semibold text-sm leading-snug">
                                {day.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                {day.meals.map((meal) => (
                                  <span
                                    key={meal}
                                    className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                                  >
                                    {meal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {day.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {day.highlights.map((h) => (
                              <Badge key={h} variant="secondary" className="text-xs font-normal">
                                {h}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Inclusions */}
                <TabsContent value="inclusions" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Check size={16} aria-hidden="true" />
                        What's Included
                      </h3>
                      <ul className="space-y-2.5">
                        {fetchedTour.inclusions.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <CheckCircle2
                              size={15}
                              className="text-green-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <X size={16} aria-hidden="true" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2.5">
                        {fetchedTour.exclusions.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                          >
                            <X
                              size={15}
                              className="text-red-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="mt-6 space-y-5">
                  {/* Rating summary */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/60">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{fetchedTour.rating}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={cn(
                              i < Math.round(fetchedTour.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fetchedTour.reviewCount} reviews
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <p className="text-sm text-muted-foreground">
                      Travellers consistently praise the quality of guides, houseboat
                      experience, and overall value for money.
                    </p>
                  </div>

                  {fetchedReviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* ── Right / Sticky Booking Sidebar ───────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <Card className="border-border/60 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting from
                        </p>
                        <p className="text-3xl font-bold text-primary leading-tight">
                          ₹{selectedPrice.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per person · excl. GST
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="font-semibold">{fetchedTour.rating}</span>
                        <span className="text-muted-foreground">
                          ({fetchedTour.reviewCount})
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tier selector */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Choose package tier</p>
                      {fetchedTour.pricingTiers?.map((tier, i) => (
                        <button
                          key={tier.label}
                          onClick={() => setSelectedTier(i)}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 transition-all duration-150",
                            selectedTier === i
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border/60 hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{tier.label}</p>
                            <p className="text-sm font-bold text-primary">
                              ₹{tier.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {tier.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    <Separator />

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { label: "Duration", value: `${fetchedTour.durationDays}D / ${fetchedTour.durationNights}N` },
                        { label: "Group size", value: `Max ${fetchedTour.groupSize}` },
                        { label: "Min age", value: `${fetchedTour.minAge}+ years` },
                        { label: "Difficulty", value: fetchedTour.difficulty },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg bg-muted/50 px-3 py-2">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      to="/domestic/tours/$slug/book"
                      params={{ slug: fetchedTour.slug }}
                      search={{ tier: fetchedTour.pricingTiers[selectedTier]?.label ?? "Standard" }}
                      className={buttonVariants({
                        className: "w-full gap-2",
                        size: "lg",
                      })}
                    >
                      Book This Tour
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() =>
                        document
                          .getElementById("request")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Phone size={14} aria-hidden="true" />
                      Request customisation
                    </Button>

                    {/* Trust strip */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <Shield size={12} className="text-green-600" aria-hidden="true" />
                      Secure booking · Free cancellation up to 15 days
                    </div>
                  </CardContent>
                </Card>

                {/* Need help card */}
                <Card className="border-border/60 bg-muted/30">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-semibold mb-1">
                      Need help deciding?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Our travel experts are available Mon–Sat, 9AM–7PM IST.
                    </p>
                    <a
                      href="tel:+919876543210"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full gap-2",
                      })}
                    >
                      <Phone size={13} aria-hidden="true" />
                      +91 98765 43210
                    </a>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main >
    </TooltipProvider >
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-muted">
        <img
          src={images[active]}
          alt={`${title} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
          width={1200}
          height={675}
        />
        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Next photo"
        >
          <ChevronRight size={18} />
        </button>
        {/* Counter */}
        <span className="absolute bottom-3 right-3 text-xs text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
              active === i
                ? "border-primary opacity-100"
                : "border-transparent opacity-60 hover:opacity-90"
            )}
            aria-label={`View photo ${i + 1}`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              width={64}
              height={48}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {review.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        "{review.text}"
      </p>
    </Card>
  );
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: PublicTour["difficulty"] }) {
  const styles = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Challenging: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <Badge className={cn("border-0 text-xs font-medium", styles[level])}>
      {level}
    </Badge>
  );
}
