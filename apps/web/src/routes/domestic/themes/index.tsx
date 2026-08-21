import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mountain,
  Heart,
  Users,
  Landmark,
  Waves,
  Trees,
  Sparkles,
  ArrowRight,
  Clock3,
  IndianRupee,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/domestic/themes/")({
  component: DomesticThemesPage,
});

type ThemeItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  accent: string;
  iconWrap: string;
  startingPrice: string;
  duration: string;
  destinations: string[];
};

const themes: ThemeItem[] = [
  {
    slug: "family",
    title: "Family Trips",
    description:
      "Comfort-first itineraries with easy travel flow, popular sightseeing, safe stays, and enough flexibility for all age groups.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    icon: Users,
    badge: "Easy pace",
    accent: "from-[#183d46]/85 via-[#183d46]/45 to-transparent",
    iconWrap: "bg-teal-100 text-teal-700",
    startingPrice: "₹12,999",
    duration: "3–6 days",
    destinations: ["Goa", "Kerala", "Jaipur", "Shimla"],
  },
  {
    slug: "honeymoon",
    title: "Honeymoon Escapes",
    description:
      "Private stays, scenic drives, slower itineraries, and romantic add-ons for couples starting their first journey together.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    icon: Heart,
    badge: "Romantic stays",
    accent: "from-[#4b2234]/85 via-[#4b2234]/45 to-transparent",
    iconWrap: "bg-rose-100 text-rose-700",
    startingPrice: "₹18,500",
    duration: "4–7 days",
    destinations: ["Kashmir", "Andaman", "Munnar", "Udaipur"],
  },
  {
    slug: "adventure",
    title: "Adventure Tours",
    description:
      "For travellers who want motion, altitude, trails, rafting, camps, and more than just checking tourist spots from a list.",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
    icon: Mountain,
    badge: "High energy",
    accent: "from-[#1f2d18]/85 via-[#1f2d18]/45 to-transparent",
    iconWrap: "bg-lime-100 text-lime-700",
    startingPrice: "₹15,999",
    duration: "5–9 days",
    destinations: ["Manali", "Rishikesh", "Ladakh", "Meghalaya"],
  },
  {
    slug: "spiritual",
    title: "Spiritual Journeys",
    description:
      "Faith-led trips covering temples, jyotirlingas, sacred rivers, and pilgrimage circuits with practical travel planning.",
    image:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
    icon: Sparkles,
    badge: "Pilgrim friendly",
    accent: "from-[#5a4317]/85 via-[#5a4317]/45 to-transparent",
    iconWrap: "bg-amber-100 text-amber-700",
    startingPrice: "₹9,499",
    duration: "2–6 days",
    destinations: ["Varanasi", "Ayodhya", "Haridwar", "Dwarka"],
  },
  {
    slug: "heritage",
    title: "Heritage & Culture",
    description:
      "Built around forts, palaces, old cities, food trails, museums, and local storytelling instead of rushed generic sightseeing.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    icon: Landmark,
    badge: "Story-rich",
    accent: "from-[#40301d]/85 via-[#40301d]/45 to-transparent",
    iconWrap: "bg-orange-100 text-orange-700",
    startingPrice: "₹11,499",
    duration: "3–7 days",
    destinations: ["Jaipur", "Jodhpur", "Hampi", "Mysore"],
  },
  {
    slug: "beach",
    title: "Beach Holidays",
    description:
      "Relaxed coastal plans with resort stays, island transfers, sunsets, water activities, and less day-to-day travel stress.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    icon: Waves,
    badge: "Relaxed",
    accent: "from-[#12354c]/85 via-[#12354c]/45 to-transparent",
    iconWrap: "bg-sky-100 text-sky-700",
    startingPrice: "₹14,999",
    duration: "3–6 days",
    destinations: ["Goa", "Andaman", "Gokarna", "Pondicherry"],
  },
  {
    slug: "nature",
    title: "Nature Retreats",
    description:
      "Quiet hill, forest, and backwater escapes for travellers who want slower mornings, cleaner air, and less crowded routes.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    icon: Trees,
    badge: "Slow travel",
    accent: "from-[#203524]/85 via-[#203524]/45 to-transparent",
    iconWrap: "bg-emerald-100 text-emerald-700",
    startingPrice: "₹10,999",
    duration: "2–5 days",
    destinations: ["Coorg", "Wayanad", "Sikkim", "Tirthan"],
  },
  {
    slug: "weekend",
    title: "Weekend Getaways",
    description:
      "Short-format trips from major cities for travellers who want clean planning, minimal leave, and a fast reset.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    icon: MapPinned,
    badge: "Short breaks",
    accent: "from-[#2b3347]/85 via-[#2b3347]/45 to-transparent",
    iconWrap: "bg-violet-100 text-violet-700",
    startingPrice: "₹6,999",
    duration: "2–3 days",
    destinations: ["Saputara", "Mount Abu", "Lonavala", "Udaipur"],
  },
];

const highlights = [
  {
    title: "Curated by travel intent",
    description:
      "Themes help travellers browse by mood and purpose instead of searching blindly through every package.",
  },
  {
    title: "Better comparison",
    description:
      "Each theme groups similar trip styles, making pricing, pace, and destinations easier to compare.",
  },
  {
    title: "Cleaner planning flow",
    description:
      "Users can choose a trip type first, then narrow into destination, departure, and budget.",
  },
];

function DomesticThemesPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,63,69,0.12),transparent_38%),radial-gradient(circle_at_top_right,rgba(14,116,144,0.10),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.92))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-teal-200 bg-teal-50 text-teal-700"
            >
              Domestic Themes
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find trips by travel style, not just destination.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Some travellers want peace, some want movement, some want family
              comfort, and some want a spiritual route. Browse domestic travel
              themes first, then enter the tours that actually match the kind of
              trip you want.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/domestic/tours"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                Explore all tours
              </Link>

              <Link
                to="/domestic/custom-trip"
                className={buttonVariants({
                  variant: "outline",
                  className: "border-slate-200 bg-white/80 text-slate-900 hover:bg-white",
                })}
              >
                Plan a custom trip
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-slate-700">
                  <ShieldCheck className="size-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Browse categories
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Domestic travel themes
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Start broad, then go specific. Each theme gives users an easier path
            into the right kind of package instead of forcing them to read every
            tour card one by one.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {themes.map((theme) => {
            const Icon = theme.icon;

            return (
              <Card
                key={theme.slug}
                className="group overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t",
                      theme.accent
                    )}
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/15">
                      {theme.badge}
                    </Badge>
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl shadow-sm",
                        theme.iconWrap
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="text-2xl font-bold">{theme.title}</h3>
                    <p className="mt-1 text-sm text-white/80">
                      {theme.destinations.join(" • ")}
                    </p>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-900">
                    {theme.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-600">
                    {theme.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      <IndianRupee className="size-3.5" />
                      Starting {theme.startingPrice}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      <Clock3 className="size-3.5" />
                      {theme.duration}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Popular destinations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {theme.destinations.map((destination) => (
                        <span
                          key={destination}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                        >
                          {destination}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/domestic/tours"
                      search={{ theme: theme.slug }}
                      className={buttonVariants({
                        className:
                          "flex-1 bg-slate-900 text-white hover:bg-slate-800",
                      })}
                    >
                      View tours
                    </Link>

                    <Link
                      to="/domestic/custom-trip"
                      search={{ theme: theme.slug }}
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                      })}
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Need help deciding?
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Tell us your travel style and we’ll shortlist the right tours.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              If you already know your budget, group type, pace, or preferred
              region, we can narrow it down faster than browsing every package
              manually.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/domestic/custom-trip"
              className={buttonVariants({
                className: "bg-slate-900 text-white hover:bg-slate-800",
              })}
            >
              Plan my trip
            </Link>
            <a
              href="tel:+919000000000"
              className={buttonVariants({
                variant: "outline",
                className: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              })}
            >
              Call travel expert
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}