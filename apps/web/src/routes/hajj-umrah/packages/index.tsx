import {
  Link,
  createFileRoute,
  type SearchSchemaInput,
} from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Hotel,
  Landmark,
  MapPin,
  Plane,
  SearchX,
  Shield,
  Users,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

type PackageType = "all" | "hajj" | "umrah" | "ramadan-umrah" | "custom-group";
type CategoryType = "all" | "economy" | "standard" | "premium";
type DurationType = "all" | "10-14" | "15-21" | "22-35" | "custom";
type SortType = "recommended" | "price-low" | "duration-short";

type PackagesSearch = {
  type: PackageType;
  category: CategoryType;
  duration: DurationType;
  sort: SortType;
};

export const Route = createFileRoute("/hajj-umrah/packages/")({
  validateSearch: (
    search: Record<string, unknown> & SearchSchemaInput
  ): PackagesSearch => {
    const type = String(search.type ?? "all") as PackageType;
    const category = String(search.category ?? "all") as CategoryType;
    const duration = String(search.duration ?? "all") as DurationType;
    const sort = String(search.sort ?? "recommended") as SortType;

    return {
      type:
        type === "hajj" ||
        type === "umrah" ||
        type === "ramadan-umrah" ||
        type === "custom-group" ||
        type === "all"
          ? type
          : "all",
      category:
        category === "economy" ||
        category === "standard" ||
        category === "premium" ||
        category === "all"
          ? category
          : "all",
      duration:
        duration === "10-14" ||
        duration === "15-21" ||
        duration === "22-35" ||
        duration === "custom" ||
        duration === "all"
          ? duration
          : "all",
      sort:
        sort === "recommended" ||
        sort === "price-low" ||
        sort === "duration-short"
          ? sort
          : "recommended",
    };
  },
  component: HajjUmrahPackagesPage,
});

type PackageItem = {
  id: string;
  slug: string;
  title: string;
  type: Exclude<PackageType, "all">;
  category: Exclude<CategoryType, "all"> | "custom";
  durationValue: number | null;
  durationLabel: string;
  departureMonth: string;
  departureCity: string;
  price: number | null;
  priceLabel: string;
  hotels: string;
  image: string;
  summary: string;
  includes: string[];
  trustNotes: string[];
  badge: string;
  badgeClass: string;
};

const packages: PackageItem[] = [
  {
    id: "pkg-hajj-economy-01",
    slug: "economy-hajj-28-days",
    title: "Economy Hajj - 28 Days",
    type: "hajj",
    category: "economy",
    durationValue: 28,
    durationLabel: "28 days",
    departureMonth: "Dhul Hijjah",
    departureCity: "Mumbai",
    price: 350000,
    priceLabel: "₹3,50,000",
    hotels: "Makkah + Madinah standard hotels",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A guided group Hajj package with essential services, reliable accommodation, and complete visa and transport handling.",
    includes: ["Visa", "Flights", "Hotels", "Transport"],
    trustNotes: ["Group guide included", "Pre-departure briefing"],
    badge: "Economy",
    badgeClass: "border-slate-300 bg-slate-50 text-slate-700",
  },
  {
    id: "pkg-hajj-premium-01",
    slug: "premium-hajj-30-days",
    title: "Premium Hajj - 30 Days",
    type: "hajj",
    category: "premium",
    durationValue: 30,
    durationLabel: "30 days",
    departureMonth: "Dhul Hijjah",
    departureCity: "Ahmedabad",
    price: 525000,
    priceLabel: "₹5,25,000",
    hotels: "Closer-to-Haram premium hotels",
    image:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A premium Hajj option with upgraded hotels, smoother group logistics, and higher comfort for families and elderly pilgrims.",
    includes: ["Visa", "Flights", "Premium hotels", "Transport"],
    trustNotes: ["Closer hotel access", "Comfort-focused itinerary"],
    badge: "Premium",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-800",
  },
  {
    id: "pkg-umrah-standard-01",
    slug: "standard-umrah-14-days",
    title: "Standard Umrah - 14 Days",
    type: "umrah",
    category: "standard",
    durationValue: 14,
    durationLabel: "14 days",
    departureMonth: "All year",
    departureCity: "Mumbai",
    price: 95000,
    priceLabel: "₹95,000",
    hotels: "Makkah + Madinah standard stay",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Balanced Umrah package for families and first-time pilgrims with reliable accommodation and guided ziyarat.",
    includes: ["Visa", "Flights", "Hotels", "Ziyarat"],
    trustNotes: ["Ideal for first-time pilgrims", "Documentation support"],
    badge: "Standard",
    badgeClass: "border-teal-300 bg-teal-50 text-teal-800",
  },
  {
    id: "pkg-umrah-premium-01",
    slug: "premium-umrah-10-days",
    title: "Premium Umrah - 10 Days",
    type: "umrah",
    category: "premium",
    durationValue: 10,
    durationLabel: "10 days",
    departureMonth: "All year",
    departureCity: "Delhi",
    price: 145000,
    priceLabel: "₹1,45,000",
    hotels: "Premium proximity hotels",
    image:
      "https://images.unsplash.com/photo-1615886753866-79396abc4a5e?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Shorter premium Umrah for travellers seeking proximity hotels, efficient planning, and a smoother premium stay.",
    includes: ["Visa", "Flights", "Premium hotels", "Ziyarat"],
    trustNotes: ["Short duration", "Closer hotel distance"],
    badge: "Premium",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-800",
  },
  {
    id: "pkg-ramadan-01",
    slug: "ramadan-umrah-21-days",
    title: "Ramadan Umrah - 21 Days",
    type: "ramadan-umrah",
    category: "standard",
    durationValue: 21,
    durationLabel: "21 days",
    departureMonth: "Ramadan",
    departureCity: "Mumbai",
    price: 185000,
    priceLabel: "₹1,85,000",
    hotels: "Ramadan-focused Makkah stay",
    image:
      "https://images.unsplash.com/photo-1577433422003-5d3fbf4ebfa7?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A spiritually focused Ramadan Umrah package with carefully selected stay arrangements and group coordination during the holy month.",
    includes: ["Visa", "Flights", "Hotels", "Ramadan support"],
    trustNotes: ["Ramadan-specific planning", "Iftar/suhoor guidance"],
    badge: "Ramadan",
    badgeClass: "border-violet-300 bg-violet-50 text-violet-800",
  },
  {
    id: "pkg-custom-01",
    slug: "family-group-umrah-custom",
    title: "Custom Family / Group Umrah",
    type: "custom-group",
    category: "custom",
    durationValue: null,
    durationLabel: "Flexible duration",
    departureMonth: "Flexible",
    departureCity: "Any major city",
    price: null,
    priceLabel: "On request",
    hotels: "Custom hotel and transport plan",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    summary:
      "For families, mosque groups, and communities who want a tailored departure, private group structure, and custom support.",
    includes: ["Custom itinerary", "Private group", "Visa support", "Flexible stay"],
    trustNotes: ["Ideal for elders", "Flexible scheduling"],
    badge: "Custom",
    badgeClass: "border-sky-300 bg-sky-50 text-sky-800",
  },
];

const packageTypeTabs: { label: string; value: PackageType }[] = [
  { label: "All packages", value: "all" },
  { label: "Hajj", value: "hajj" },
  { label: "Umrah", value: "umrah" },
  { label: "Ramadan Umrah", value: "ramadan-umrah" },
  { label: "Custom Group", value: "custom-group" },
];

function HajjUmrahPackagesPage() {
  const search = Route.useSearch();

  const filteredPackages = useMemo(() => {
    let result = [...packages];

    if (search.type !== "all") {
      result = result.filter((pkg) => pkg.type === search.type);
    }

    if (search.category !== "all") {
      result = result.filter((pkg) => pkg.category === search.category);
    }

    if (search.duration !== "all") {
      result = result.filter((pkg) => {
        if (search.duration === "custom") return pkg.durationValue === null;
        if (pkg.durationValue === null) return false;
        if (search.duration === "10-14") {
          return pkg.durationValue >= 10 && pkg.durationValue <= 14;
        }
        if (search.duration === "15-21") {
          return pkg.durationValue >= 15 && pkg.durationValue <= 21;
        }
        if (search.duration === "22-35") {
          return pkg.durationValue >= 22 && pkg.durationValue <= 35;
        }
        return true;
      });
    }

    if (search.sort === "price-low") {
      result.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    }

    if (search.sort === "duration-short") {
      result.sort((a, b) => (a.durationValue ?? Number.MAX_SAFE_INTEGER) - (b.durationValue ?? Number.MAX_SAFE_INTEGER));
    }

    return result;
  }, [search]);

  return (
    <main className="bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(18,63,69,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.94))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-amber-200 bg-amber-50 text-amber-700"
            >
              Hajj & Umrah Packages
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Choose a package with clarity, comfort, and guidance.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore Hajj, Umrah, Ramadan Umrah, and custom group options with
              clear duration, price range, hotel type, and inclusion highlights.
              Use simple filters to find the package that best matches your
              travel needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <Shield className="size-4 text-amber-700" />
                Ministry-guided process
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <BadgeCheck className="size-4 text-amber-700" />
                Visa and documentation support
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <Users className="size-4 text-amber-700" />
                Group and family options
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Filter className="size-4 text-amber-700" />
            Filter packages
          </div>

          <div className="flex flex-wrap gap-2">
            {packageTypeTabs.map((tab) => {
              const isActive = search.type === tab.value;

              return (
                <Link
                  key={tab.value}
                  to="/hajj-umrah/packages"
                  search={{
                    ...search,
                    type: tab.value,
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Category
              </label>
              <select
                value={search.category}
                onChange={(e) => {
                  window.location.href = `/hajj-umrah/packages?type=${search.type}&category=${e.target.value}&duration=${search.duration}&sort=${search.sort}`;
                }}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="all">All categories</option>
                <option value="economy">Economy</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Duration
              </label>
              <select
                value={search.duration}
                onChange={(e) => {
                  window.location.href = `/hajj-umrah/packages?type=${search.type}&category=${search.category}&duration=${e.target.value}&sort=${search.sort}`;
                }}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="all">All durations</option>
                <option value="10-14">10–14 days</option>
                <option value="15-21">15–21 days</option>
                <option value="22-35">22–35 days</option>
                <option value="custom">Custom / flexible</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Sort by
              </label>
              <select
                value={search.sort}
                onChange={(e) => {
                  window.location.href = `/hajj-umrah/packages?type=${search.type}&category=${search.category}&duration=${search.duration}&sort=${e.target.value}`;
                }}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="duration-short">Shortest duration</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                to="/hajj-umrah/packages"
                search={{
                  type: "all",
                  category: "all",
                  duration: "all",
                  sort: "recommended",
                }}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "h-11 w-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                })}
              >
                Reset filters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredPackages.length}
              </span>{" "}
              package{filteredPackages.length === 1 ? "" : "s"}
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Prices are starting estimates and should be confirmed at inquiry.
          </p>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <SearchX className="size-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No packages matched these filters
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Try broadening the category or duration filter, or reset the
              filters to explore all available packages.
            </p>
            <div className="mt-5">
              <Link
                to="/hajj-umrah/packages"
                search={{
                  type: "all",
                  category: "all",
                  duration: "all",
                  sort: "recommended",
                }}
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                Reset and view all
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid md:grid-cols-[280px_1fr]">
                  <div className="relative h-64 md:h-full">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/65 via-transparent to-transparent" />
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute left-3 top-3 text-xs font-semibold",
                        pkg.badgeClass
                      )}
                    >
                      {pkg.badge}
                    </Badge>
                  </div>

                  <div className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-700">
                            {pkg.type.replace("-", " ")}
                          </p>
                          <CardTitle className="mt-1 text-xl text-slate-900">
                            {pkg.title}
                          </CardTitle>
                          <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                            {pkg.summary}
                          </CardDescription>
                        </div>

                        <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">
                          <p className="text-xs text-slate-500">Starting from</p>
                          <p className="text-lg font-bold text-slate-900">
                            {pkg.priceLabel}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-5 pt-0">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                          <CalendarDays className="mt-0.5 size-4 text-amber-700" />
                          <div>
                            <p className="text-xs text-slate-500">Departure</p>
                            <p className="text-sm font-medium text-slate-800">
                              {pkg.departureMonth}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                          <MapPin className="mt-0.5 size-4 text-amber-700" />
                          <div>
                            <p className="text-xs text-slate-500">Departure city</p>
                            <p className="text-sm font-medium text-slate-800">
                              {pkg.departureCity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                          <Clock3 className="mt-0.5 size-4 text-amber-700" />
                          <div>
                            <p className="text-xs text-slate-500">Duration</p>
                            <p className="text-sm font-medium text-slate-800">
                              {pkg.durationLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                          <Hotel className="mt-0.5 size-4 text-amber-700" />
                          <div>
                            <p className="text-xs text-slate-500">Stay</p>
                            <p className="text-sm font-medium text-slate-800">
                              {pkg.hotels}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {pkg.includes.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="grid gap-2">
                        {pkg.trustNotes.map((note) => (
                          <div
                            key={note}
                            className="inline-flex items-center gap-2 text-sm text-slate-600"
                          >
                            <BadgeCheck className="size-4 text-amber-700" />
                            {note}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-3 border-t border-border/50 pt-4">
                        <Link
                          to="/hajj-umrah/packages/$packageId"
                          params={{ packageId: pkg.slug }}
                          className={buttonVariants({
                            className:
                              "bg-slate-900 text-white hover:bg-slate-800",
                          })}
                        >
                          View details
                          <ArrowRight className="ml-2 size-4" />
                        </Link>

                        <Link
                          to="/hajj-umrah/custom-group"
                          search={{ package: pkg.slug }}
                          className={buttonVariants({
                            variant: "outline",
                            className:
                              "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                          })}
                        >
                          Send inquiry
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="border-t bg-[#f4efe6]/70">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-2 text-amber-700">
              <Shield className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Clear package guidance
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              We present duration, stay type, and inclusions clearly so families
              and first-time pilgrims can compare with confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-2 text-amber-700">
              <Plane className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              End-to-end travel handling
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Visa, flight coordination, hotel planning, and group support are
              integrated into the planning process.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-2 text-amber-700">
              <Landmark className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Built for pilgrims, not tourists
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The page is designed around pilgrimage planning needs: category,
              duration, trust, and guided next steps.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}