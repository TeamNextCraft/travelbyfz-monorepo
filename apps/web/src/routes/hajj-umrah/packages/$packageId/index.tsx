import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  HeartHandshake,
  Hotel,
  Info,
  Landmark,
  Luggage,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  Star,
  Users,
  XCircle,
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

export const Route = createFileRoute("/hajj-umrah/packages/$packageId/")({
  loader: async ({ params }) => {
    const pkg = packageDetails.find((item) => item.slug === params.packageId);

    if (!pkg) {
      throw notFound();
    }

    return pkg;
  },
  component: HajjUmrahPackageDetailPage,
});

type PackageDetail = {
  id: string;
  slug: string;
  title: string;
  type: "hajj" | "umrah" | "ramadan-umrah" | "custom-group";
  category: string;
  priceLabel: string;
  durationLabel: string;
  departureMonth: string;
  departureCity: string;
  image: string;
  summary: string;
  hotelInfo: string;
  distanceInfo: string;
  idealFor: string;
  badge: string;
  badgeClass: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  documents: string[];
  trustNotes: string[];
  faq: { question: string; answer: string }[];
  itinerary: { day: string; title: string; description: string }[];
};

const packageDetails: PackageDetail[] = [
  {
    id: "pkg-hajj-economy-01",
    slug: "economy-hajj-28-days",
    title: "Economy Hajj - 28 Days",
    type: "hajj",
    category: "Economy",
    priceLabel: "₹3,50,000",
    durationLabel: "28 days",
    departureMonth: "Dhul Hijjah",
    departureCity: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A guided Hajj group package for pilgrims seeking dependable planning, complete visa support, and a spiritually focused journey with practical comfort.",
    hotelInfo: "Standard hotels in Makkah and Madinah",
    distanceInfo: "Within arranged shuttle / walking-access zone depending on phase",
    idealFor: "First-time pilgrims, families, and budget-conscious groups",
    badge: "Economy",
    badgeClass: "border-slate-300 bg-slate-50 text-slate-700",
    highlights: [
      "Saudi Hajj visa processing included",
      "Return flights from India",
      "Group leader and ritual guidance",
      "Makkah, Madinah, Mina, Arafat, and Muzdalifah arrangements",
      "Pre-departure orientation session",
    ],
    inclusions: [
      "Hajj visa processing",
      "Return airfare",
      "Accommodation in Makkah and Madinah",
      "Ground transport in Saudi Arabia",
      "Guided ziyarat",
      "Group coordination support",
      "Pre-departure briefing",
    ],
    exclusions: [
      "Personal shopping expenses",
      "Extra meals outside package scope",
      "Laundry and room service",
      "Individual medical expenses",
      "Any charges due to policy changes beyond package scope",
    ],
    documents: [
      "Valid passport",
      "Passport-size photographs",
      "Vaccination certificate",
      "Government-issued ID copy",
      "Any additional documents required by Saudi authorities",
    ],
    trustNotes: [
      "Structured group support throughout the journey",
      "Suitable for pilgrims who want guided assistance over independent planning",
    ],
    faq: [
      {
        question: "Is this package suitable for elderly pilgrims?",
        answer:
          "Yes, this package is often chosen by families travelling with elders, but hotel distance and walking expectations should still be reviewed before confirmation.",
      },
      {
        question: "Do you provide ritual guidance during Hajj?",
        answer:
          "Yes, group leaders and pre-departure briefings help pilgrims understand the sequence of rites and practical expectations.",
      },
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Departure from India",
        description:
          "Group assembly, international departure, arrival in Saudi Arabia, immigration formalities, and transfer to hotel.",
      },
      {
        day: "Day 3–6",
        title: "Initial stay in Makkah",
        description:
          "Rest, orientation, local guidance, and preparation for the Hajj rites with group coordination and briefings.",
      },
      {
        day: "Day 7–12",
        title: "Hajj rites phase",
        description:
          "Movement and support across Mina, Arafat, Muzdalifah, and related rites according to the Hajj schedule and official arrangements.",
      },
      {
        day: "Day 13–20",
        title: "Post-Hajj Makkah stay",
        description:
          "Return to Makkah accommodation for continued worship, rest, and recovery after the rites.",
      },
      {
        day: "Day 21–27",
        title: "Madinah stay and ziyarat",
        description:
          "Travel to Madinah, hotel check-in, prayer at Masjid an-Nabawi, and guided ziyarat to important locations.",
      },
      {
        day: "Day 28",
        title: "Return journey",
        description:
          "Airport transfer, departure formalities, and return flight to India.",
      },
    ],
  },
  {
    id: "pkg-umrah-standard-01",
    slug: "standard-umrah-14-days",
    title: "Standard Umrah - 14 Days",
    type: "umrah",
    category: "Standard",
    priceLabel: "₹95,000",
    durationLabel: "14 days",
    departureMonth: "All year",
    departureCity: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A balanced Umrah package built for first-time pilgrims and families, with accommodation, visa support, ziyarat, and guided travel flow.",
    hotelInfo: "Standard family-friendly hotels in Makkah and Madinah",
    distanceInfo: "Moderate hotel distance with planned transport support where needed",
    idealFor: "Families, first-time pilgrims, and small groups",
    badge: "Standard",
    badgeClass: "border-teal-300 bg-teal-50 text-teal-800",
    highlights: [
      "Flexible yearly departures",
      "Return flights and visa included",
      "Makkah and Madinah accommodation",
      "Guided ziyarat in Madinah",
      "Suitable for first-time Umrah travellers",
    ],
    inclusions: [
      "Umrah visa",
      "Return airfare",
      "Hotel accommodation",
      "Airport and local transfers",
      "Guided ziyarat",
      "Basic documentation support",
    ],
    exclusions: [
      "Personal expenses",
      "Upgraded room requests",
      "Additional nights not part of package",
      "Travel insurance unless separately added",
    ],
    documents: [
      "Valid passport",
      "Recent photographs",
      "Basic ID proof",
      "Vaccination certificate if applicable",
    ],
    trustNotes: [
      "Built for smooth, beginner-friendly pilgrimage planning",
      "A practical choice for travellers who want structure without premium pricing",
    ],
    faq: [
      {
        question: "Can this package work for a couple travelling together?",
        answer:
          "Yes, this package is commonly selected by couples and families and can usually be adjusted based on room preferences.",
      },
      {
        question: "Does the package include ziyarat?",
        answer:
          "Yes, guided ziyarat is included in the itinerary, especially during the Madinah stay.",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Departure and arrival",
        description:
          "Departure from India, airport assistance, arrival in Saudi Arabia, and hotel transfer.",
      },
      {
        day: "Day 2–7",
        title: "Makkah stay and Umrah performance",
        description:
          "Hotel stay in Makkah, performance of Umrah, rest, daily prayers, and flexible worship time.",
      },
      {
        day: "Day 8",
        title: "Travel to Madinah",
        description:
          "Check-out from Makkah, group transfer to Madinah, and hotel check-in.",
      },
      {
        day: "Day 9–13",
        title: "Madinah stay and ziyarat",
        description:
          "Prayer at Masjid an-Nabawi, guided ziyarat, and spiritually focused time in Madinah.",
      },
      {
        day: "Day 14",
        title: "Return to India",
        description:
          "Departure transfer, airport formalities, and return flight.",
      },
    ],
  },
  {
    id: "pkg-ramadan-01",
    slug: "ramadan-umrah-21-days",
    title: "Ramadan Umrah - 21 Days",
    type: "ramadan-umrah",
    category: "Standard",
    priceLabel: "₹1,85,000",
    durationLabel: "21 days",
    departureMonth: "Ramadan",
    departureCity: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1577433422003-5d3fbf4ebfa7?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A spiritually focused Ramadan Umrah package designed around worship rhythm, group coordination, and practical support during the holy month.",
    hotelInfo: "Ramadan-oriented hotel arrangement in Makkah and Madinah",
    distanceInfo: "Selected with prayer access and Ramadan crowd conditions in mind",
    idealFor: "Pilgrims who want to spend meaningful time in the holy month",
    badge: "Ramadan",
    badgeClass: "border-violet-300 bg-violet-50 text-violet-800",
    highlights: [
      "Ramadan-specific planning and support",
      "Suhoor and iftar guidance",
      "Makkah and Madinah stay",
      "Structured group coordination during peak travel period",
    ],
    inclusions: [
      "Visa processing",
      "Return airfare",
      "Hotel accommodation",
      "Transfers",
      "Ramadan coordination support",
      "Guided itinerary assistance",
    ],
    exclusions: [
      "Private transport upgrades",
      "Personal purchases",
      "Room service and incidental expenses",
      "Extra stay outside package dates",
    ],
    documents: [
      "Passport",
      "Photographs",
      "Vaccination details if required",
      "Any current seasonal documentation requested at booking time",
    ],
    trustNotes: [
      "Designed for one of the busiest and most spiritually significant travel periods",
      "Planning support is especially important during Ramadan crowd conditions",
    ],
    faq: [
      {
        question: "Why is Ramadan Umrah priced differently?",
        answer:
          "Ramadan demand, hotel availability, and travel volume typically raise costs, especially for better proximity and coordination.",
      },
      {
        question: "Is iftar included?",
        answer:
          "Specific meal arrangements depend on the package and hotel; we confirm those details during booking.",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Departure to Saudi Arabia",
        description:
          "International departure, arrival handling, and group hotel transfer.",
      },
      {
        day: "Day 2–12",
        title: "Makkah worship phase",
        description:
          "Umrah performance, Ramadan worship schedule, Taraweeh rhythm, and structured group support.",
      },
      {
        day: "Day 13",
        title: "Transfer to Madinah",
        description:
          "Travel from Makkah to Madinah with group coordination and hotel check-in.",
      },
      {
        day: "Day 14–20",
        title: "Madinah stay",
        description:
          "Prayer at Masjid an-Nabawi, ziyarat, and worship in a calmer environment before return.",
      },
      {
        day: "Day 21",
        title: "Return travel",
        description:
          "Airport transfer and flight back to India.",
      },
    ],
  },
  {
    id: "pkg-custom-01",
    slug: "family-group-umrah-custom",
    title: "Custom Family / Group Umrah",
    type: "custom-group",
    category: "Custom",
    priceLabel: "On request",
    durationLabel: "Flexible duration",
    departureMonth: "Flexible",
    departureCity: "Any major city",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A tailored group arrangement for families, community groups, and mosque-led travel requiring flexibility, private planning, and custom pacing.",
    hotelInfo: "Custom hotel selection based on group preference and budget",
    distanceInfo: "Chosen according to comfort, accessibility, and budget requirements",
    idealFor: "Large families, mosque groups, elders, and private community travel",
    badge: "Custom",
    badgeClass: "border-sky-300 bg-sky-50 text-sky-800",
    highlights: [
      "Flexible date planning",
      "Private group support",
      "Custom hotel and transport options",
      "Ideal for elders or special group needs",
    ],
    inclusions: [
      "Planning consultation",
      "Visa support",
      "Custom itinerary proposal",
      "Flexible hotel and transport arrangements",
    ],
    exclusions: [
      "Fixed public price quote",
      "Services not selected in the final proposal",
      "Optional upgrades not included in custom agreement",
    ],
    documents: [
      "Group lead contact details",
      "Traveller count",
      "Passport copies",
      "Preferred travel month",
      "Special assistance requirements if any",
    ],
    trustNotes: [
      "Best suited when a standard group package is too rigid",
      "Lets you plan around elders, private transport, or a custom departure city",
    ],
    faq: [
      {
        question: "Can you arrange wheelchair or elder-friendly support?",
        answer:
          "Yes, custom group planning is often the best choice when elderly pilgrims or special mobility needs are involved.",
      },
      {
        question: "Is there a fixed package price?",
        answer:
          "No, pricing depends on group size, travel month, city of departure, hotel preference, and support level requested.",
      },
    ],
    itinerary: [
      {
        day: "Step 1",
        title: "Initial consultation",
        description:
          "We understand your group size, dates, city, hotel preference, and support needs.",
      },
      {
        day: "Step 2",
        title: "Custom proposal",
        description:
          "A tailored package outline is prepared with price bands, stay options, and travel flow.",
      },
      {
        day: "Step 3",
        title: "Confirmation and documentation",
        description:
          "After approval, we begin visa preparation and travel coordination for the group.",
      },
      {
        day: "Step 4",
        title: "Sacred journey",
        description:
          "Your group travels under the agreed custom structure with the support level chosen in the plan.",
      },
    ],
  },
];

function HajjUmrahPackageDetailPage() {
  const pkg = Route.useLoaderData();

  return (
    <main className="bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/82 via-[#1a1208]/62 to-[#1a1208]/88" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl text-white">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Link
                to="/hajj-umrah/packages"
                className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                Packages
              </Link>
              <ChevronRight className="size-4 text-white/40" />
              <Badge
                variant="outline"
                className={cn("text-xs font-semibold", pkg.badgeClass)}
              >
                {pkg.badge}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {pkg.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {pkg.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <CalendarDays className="size-4 text-amber-300" />
                {pkg.departureMonth}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <MapPin className="size-4 text-amber-300" />
                {pkg.departureCity}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur-sm">
                <Clock3 className="size-4 text-amber-300" />
                {pkg.durationLabel}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hajj-umrah/custom-group"
                search={{ package: pkg.slug }}
                className={buttonVariants({
                  className: "bg-amber-600 text-white hover:bg-amber-700",
                })}
              >
                Send inquiry
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call now
              </a>

              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                })}
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary strip */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="rounded-2xl border border-border/60 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Starting from
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {pkg.priceLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Category
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {pkg.category}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Hotels
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {pkg.hotelInfo}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Best for
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {pkg.idealFor}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left column */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Package highlights
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  A quick overview of what makes this package suitable for your
                  pilgrimage planning.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {pkg.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Itinerary overview
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  This gives pilgrims and families a clearer picture of how the
                  travel flow is structured across the package.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pkg.itinerary.map((item, index) => (
                  <div
                    key={`${item.day}-${item.title}`}
                    className="relative rounded-2xl border border-border/60 bg-slate-50 p-5"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                          {item.day}
                        </p>
                        <h3 className="text-base font-semibold text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">
                    Inclusions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pkg.inclusions.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">
                    Exclusions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pkg.exclusions.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Required documents
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Exact documentation can vary with regulatory changes, but
                  these are the common essentials we prepare for.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {pkg.documents.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-slate-50 p-4"
                  >
                    <FileText className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Common questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pkg.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-xl border border-border/60 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Start your inquiry
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Talk to our team for current availability, final pricing,
                  room preference, and visa guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  to="/hajj-umrah/custom-group"
                  search={{ package: pkg.slug }}
                  className={buttonVariants({
                    className:
                      "w-full bg-amber-600 text-white hover:bg-amber-700",
                  })}
                >
                  Send package inquiry
                </Link>

                <a
                  href="tel:+919000000000"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "w-full border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white",
                  })}
                >
                  <Phone className="mr-2 size-4" />
                  Call travel advisor
                </a>

                <a
                  href="https://wa.me/919000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "w-full border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white",
                  })}
                >
                  <MessageCircle className="mr-2 size-4" />
                  WhatsApp us
                </a>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Package facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={Plane}
                  label="Travel"
                  value={`Departure from ${pkg.departureCity}`}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Departure period"
                  value={pkg.departureMonth}
                />
                <InfoRow
                  icon={Clock3}
                  label="Duration"
                  value={pkg.durationLabel}
                />
                <InfoRow
                  icon={Hotel}
                  label="Accommodation"
                  value={pkg.hotelInfo}
                />
                <InfoRow
                  icon={BedDouble}
                  label="Hotel distance"
                  value={pkg.distanceInfo}
                />
                <InfoRow
                  icon={Users}
                  label="Best suited for"
                  value={pkg.idealFor}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Why this package works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pkg.trustNotes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                  <CircleAlert className="size-5 text-amber-700" />
                  Important note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-700">
                  Final pricing, visa timelines, accommodation allocation, and
                  specific operational details can change based on season,
                  regulation updates, and current availability. Please confirm
                  all live details with our team before payment.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Trust & support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow
                  icon={Shield}
                  label="Visa process"
                  value="Guided end-to-end by our team"
                />
                <InfoRow
                  icon={Landmark}
                  label="On-ground support"
                  value="Pilgrimage guidance and coordination"
                />
                <InfoRow
                  icon={Bus}
                  label="Saudi transport"
                  value="Arranged as per package plan"
                />
                <InfoRow
                  icon={HeartHandshake}
                  label="Group care"
                  value="Structured support for families and elders"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA footer strip */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Need help deciding?
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Speak to our team before you choose your package.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              We can help compare categories, explain hotel differences, review
              elder-friendly options, and guide you on current documentation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/hajj-umrah/packages"
              className={buttonVariants({
                className: "bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Compare packages
            </Link>

            <Link
              to="/hajj-umrah/custom-group"
              search={{ package: pkg.slug }}
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              Send inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium leading-6 text-slate-800">{value}</p>
      </div>
    </div>
  );
}