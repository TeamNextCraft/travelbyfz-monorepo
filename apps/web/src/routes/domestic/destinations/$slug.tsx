import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Thermometer,
  Users,
  Camera,
  Utensils,
  ShoppingBag,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";
import { getPublicDestinationBySlug } from "#/server/actions/destinations";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/destinations/$slug")({
  loader: async ({ params }) => {
    const dest = await getPublicDestinationBySlug({ data: { slug: params.slug } });
    if (!dest) throw notFound();
    return { dest };
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🗺️</div>
      <h1 className="text-2xl font-bold">Destination not found</h1>
      <p className="text-muted-foreground max-w-xs">
        This destination doesn't exist yet or may have been moved.
      </p>
      <Link to="/domestic/destinations" className={buttonVariants()}>
        Browse all destinations
      </Link>
    </div>
  ),
  component: DestinationDetailPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function DestinationDetailPage() {
  const { dest } = Route.useLoaderData();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection dest={dest} />

      {/* ── Breadcrumb + meta bar ─────────────────────────────────────── */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link
              to="/domestic/destinations"
              className="hover:text-foreground transition-colors"
            >
              Destinations
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-foreground font-medium">{dest.name}</span>
          </nav>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{dest.rating}</span>
              <span>({dest.reviewCount.toLocaleString()} reviews)</span>
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {dest.state}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <Clock size={13} />
              Best: {dest.bestTimeToVisit}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* ── Main column ────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start overflow-x-auto mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attractions">Attractions</TabsTrigger>
                <TabsTrigger value="tours">
                  Tours ({dest.tourCount})
                </TabsTrigger>
                <TabsTrigger value="plan">Plan Your Trip</TabsTrigger>
              </TabsList>

              {/* Overview tab */}
              <TabsContent value="overview" className="space-y-10">
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    About {dest.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                {/* Gallery */}
                {dest.gallery && (
                  <GalleryGrid images={dest.gallery} name={dest.name} />
                )}

                {/* Best time / Seasons */}
                {dest.seasons && (
                  <SeasonsSection seasons={dest.seasons} />
                )}

                {/* Cuisine */}
                {dest.cuisine && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Utensils size={18} className="text-primary" />
                      Local Cuisine
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {dest.cuisine.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-xl border border-border/60 p-4 bg-muted/20"
                        >
                          <p className="font-semibold text-sm mb-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Attractions tab */}
              {dest.attractions && dest.attractions.length > 0 && (
                <TabsContent value="attractions" className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    {dest.attractions.length} top attractions in {dest.name}
                  </p>
                  {dest.attractions.map((attraction) => (
                    <AttractionCard key={attraction.name} attraction={attraction} />
                  ))}
                </TabsContent>
              )}

              {/* Tours tab */}
              <TabsContent value="tours" className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {dest.tourCount} tours available to {dest.name}
                  </p>
                  <Link
                    to="/domestic/tours"
                    search={{ state: dest.state }}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    View all
                    <ArrowRight size={13} className="ml-1" />
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {dest?.tours.map((tour) => (
                    <TourCardItem key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* CTA */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
                  <p className="font-semibold">
                    Want a custom {dest.name} itinerary?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our travel experts craft personalised plans based on your
                    dates, group size, and budget.
                  </p>
                  <Link
                    to="/"
                    className={buttonVariants({ size: "sm", className: "gap-2" })}
                  >
                    Request custom trip
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </TabsContent>

              {/* Plan tab */}
              <TabsContent value="plan" className="space-y-10">
                {/* How to reach */}
                {dest.howToReach && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-primary" />
                      How to Reach {dest.name}
                    </h2>
                    <div className="space-y-3">
                      {dest.howToReach.map((option) => (
                        <HowToReachCard key={option.mode} option={option} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel tips */}
                {dest.travelTips && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Info size={18} className="text-primary" />
                      Travel Tips
                    </h2>
                    <ul className="space-y-2.5">
                      {dest.travelTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            size={15}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Do & Don't */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {dest.doList && (
                    <div>
                      <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2 text-sm">
                        <CheckCircle2 size={15} />
                        Do's
                      </h3>
                      <ul className="space-y-2.5">
                        {dest.doList.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-green-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dest.dontList && (
                    <div>
                      <h3 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2 text-sm">
                        <AlertCircle size={15} />
                        Don'ts
                      </h3>
                      <ul className="space-y-2.5">
                        {dest.dontList.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <AlertCircle
                              size={13}
                              className="text-red-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <aside className="space-y-4">
            {/* Quick info card */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-4">
                <h3 className="font-bold text-sm">Quick Info</h3>
                <Separator />
                <div className="space-y-3 text-sm">
                  {[
                    { label: "State", value: dest.state, icon: MapPin },
                    { label: "Region", value: dest.region, icon: Map },
                    { label: "Best Time", value: dest.bestTimeToVisit, icon: CalendarDays },
                    { label: "Language", value: dest.language, icon: Users },
                    { label: "Currency", value: dest.currency, icon: ShoppingBag },
                    { label: "Area", value: dest.area, icon: Camera },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                        {label}
                      </span>
                      <span className="font-medium text-right text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category tags */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-3">
                <h3 className="font-bold text-sm">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {dest.category?.map((cat) => (
                    <Link
                      key={cat}
                      to="/domestic/destinations"
                      search={{ category: cat }}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                        className: "text-xs h-7 px-2.5",
                      })}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tours CTA */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-5 space-y-3 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={22} aria-hidden="true" />
                </div>
                <p className="font-bold text-sm">
                  {dest.tourCount} tours to {dest.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  All-inclusive packages starting from ₹9,800/person.
                </p>
                <Link
                  to="/domestic/tours"
                  search={{ state: dest.state }}
                  className={buttonVariants({ className: "w-full gap-2", size: "sm" })}
                >
                  Browse tours
                  <ArrowRight size={13} />
                </Link>
              </CardContent>
            </Card>

            {/* Need help */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-2">
                <p className="font-bold text-sm">Need help planning?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Call our {dest.name} specialists — Mon–Sat, 9 AM–7 PM IST.
                </p>
                <a
                  href="tel:+919876543210"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "w-full gap-2 mt-1",
                  })}
                >
                  +91 98765 43210
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ dest }: { dest: DestinationDetail }) {
  return (
    <section className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
      <img
        src={dest.coverImage}
        alt={dest.name}
        className="w-full h-full object-cover"
        loading="eager"
        width={1600}
        height={900}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {dest.category?.map((cat) => (
                  <Badge
                    key={cat}
                    className="bg-white/20 text-white border-white/20 backdrop-blur-sm text-xs"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                {dest.name}
              </h1>
              <p className="text-white/80 mt-2 text-base sm:text-lg max-w-xl">
                {dest.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {dest.state}, {dest.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  {dest.rating} · {dest.reviewCount.toLocaleString()} reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Best: {dest.bestTimeToVisit}
                </span>
              </div>
            </div>

            <Link
              to="/domestic/tours"
              search={{ state: dest.state }}
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2 shrink-0",
              })}
            >
              View {dest.tourCount} Tours
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Grid ─────────────────────────────────────────────────────────────

function GalleryGrid({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Camera size={18} className="text-primary" />
        Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative overflow-hidden rounded-xl group",
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            )}
          >
            <img
              src={img}
              alt={`${name} photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              width={400}
              height={400}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Seasons ──────────────────────────────────────────────────────────────────

function SeasonsSection({ seasons }: { seasons: Season[] }) {
  const colors: Record<Season["name"], string> = {
    Peak: "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20",
    Shoulder: "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20",
    "Off-season": "border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/20",
  };

  const textColors: Record<Season["name"], string> = {
    Peak: "text-green-800 dark:text-green-300",
    Shoulder: "text-amber-800 dark:text-amber-300",
    "Off-season": "text-blue-800 dark:text-blue-300",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="text-primary" />
        Best Time to Visit
      </h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {seasons.map((season) => {
          // const Icon = season.icon;
          return (
            <div
              key={season.name}
              className={cn(
                "rounded-xl border p-4 space-y-2",
                colors[season.name]
              )}
            >
              <div className={cn("flex items-center gap-2", textColors[season.name])}>
                {/* <Icon size={16} aria-hidden="true" />*/}
                <span className="font-bold text-sm">{season.name}</span>
              </div>
              <p className={cn("text-xs font-semibold", textColors[season.name])}>
                {season.months}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {season.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Thermometer size={11} aria-hidden="true" />
                {season.temp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Attraction Card ──────────────────────────────────────────────────────────

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative overflow-hidden sm:w-44 shrink-0 aspect-video sm:aspect-auto">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={176}
            height={132}
          />
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base">{attraction.name}</h3>
            <Badge variant="secondary" className="text-xs shrink-0">
              {attraction.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {attraction.description}
          </p>
          {(attraction.timings || attraction.entryFee) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {attraction.timings && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {attraction.timings}
                </span>
              )}
              {attraction.entryFee && (
                <span className="flex items-center gap-1">
                  <ShoppingBag size={11} />
                  {attraction.entryFee}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Tour Card (in destination context) ──────────────────────────────────────

function TourCardItem({ tour }: { tour: TourCard }) {
  return (
    <Link
      to="/domestic/tours/$slug"
      params={{ slug: tour.slug }}
      className="group block rounded-xl overflow-hidden border border-border/60 hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={225}
        />
        {tour.tag && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 text-xs font-semibold">
            {tour.tag}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm leading-snug mb-1">{tour.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {tour.duration} Nights
          </span>
          <span className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {tour.rating} ({tour.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-primary font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            View tour
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── How to Reach Card ────────────────────────────────────────────────────────

function HowToReachCard({ option }: { option: TravelOption }) {
  const Icon = option.icon;
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold text-sm">{option.mode}</p>
          <Badge variant="secondary" className="text-xs">
            {option.duration}
          </Badge>
          <span className="text-xs text-muted-foreground">from {option.from}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {option.details}
        </p>
      </div>
    </div>
  );
}
