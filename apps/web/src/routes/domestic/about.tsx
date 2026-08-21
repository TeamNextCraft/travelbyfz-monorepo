import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Users,
  Star,
  Shield,
  Heart,
  Compass,
  Leaf,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { buttonVariants } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/about")({
  component: AboutPage,
});

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "12,000+", label: "Happy Travellers", icon: Users },
  { value: "4.9★", label: "Average Rating", icon: Star },
  { value: "85+", label: "Destinations", icon: MapPin },
  { value: "9 Yrs", label: "In Business", icon: Award },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "No hidden charges, no bait-and-switch. Every rupee you pay is broken down before you confirm. We believe honest pricing builds lasting relationships.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: Heart,
    title: "Traveller-First",
    description:
      "Your comfort, safety, and experience drive every decision we make — from the hotels we select to the guides we hire. If something goes wrong, we fix it. No excuses.",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    icon: Compass,
    title: "Authentic Experiences",
    description:
      "We curate trips that go beyond monuments. Spice walks, village home-stays, tribal craft markets — real India, not just the tourist trail.",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: Leaf,
    title: "Responsible Tourism",
    description:
      "We partner with eco-certified stays, use low-emission vehicles where possible, and donate 1% of every booking to local conservation initiatives.",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
];

const TEAM = [
  {
    name: "Anika Sharma",
    role: "Founder & CEO",
    bio: "Former IIM-A grad who quit consulting to follow her real passion — making India accessible and magical for every Indian traveller. 15 years exploring every corner of the country.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    location: "Mumbai",
    since: "2016",
  },
  {
    name: "Rohan Verma",
    role: "Head of Operations",
    bio: "Ex-hospitality veteran with 12 years across Taj and Oberoi properties. Rohan ensures every hotel, vehicle, and guide meets our obsessively high standards.",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80",
    location: "Jaipur",
    since: "2017",
  },
  {
    name: "Priya Nair",
    role: "South India Specialist",
    bio: "Born in Kerala, travelled all 29 states. Priya has personally stayed in every property we recommend in South India and written the itinerary notes for over 60 tours.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    location: "Kochi",
    since: "2018",
  },
  {
    name: "Tenzin Wangchuk",
    role: "Himalayan Expert",
    bio: "Born in Leh, certified mountaineer, and passionate Ladakhi culture guide. Tenzin leads our high-altitude expeditions and trains all our North India ground staff.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    location: "Leh",
    since: "2019",
  },
];

const MILESTONES = [
  {
    year: "2016",
    title: "Founded in Mumbai",
    description:
      "Started with 3 tours to Rajasthan and a team of 2. Our first group of 8 travellers gave us a perfect 5-star review.",
  },
  {
    year: "2018",
    title: "Expanded to South India",
    description:
      "Launched Kerala, Karnataka, and Tamil Nadu circuits. Crossed 500 bookings in our second full year of South India operations.",
  },
  {
    year: "2020",
    title: "Survived & Adapted",
    description:
      "COVID paused travel, but we retrained guides, upgraded properties, and built our online booking platform — emerging stronger.",
  },
  {
    year: "2022",
    title: "10,000 Travellers Milestone",
    description:
      "Crossed 10,000 happy travellers. Launched our Responsible Tourism pledge — 1% of every booking to local conservation.",
  },
  {
    year: "2024",
    title: "Best Domestic Tour Operator",
    description:
      "Awarded 'Best Domestic Tour Operator — Western India' by Travel + Leisure India & South Asia.",
  },
  {
    year: "2026",
    title: "85 Destinations & Growing",
    description:
      "Now covering all 6 regions of India with 85+ destinations, 200+ tour packages, and a full-stack booking platform.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sneha Kapoor",
    location: "Pune",
    tour: "Kerala Backwaters",
    rating: 5,
    text: "I've used four different tour operators over the years, and WanderInn is in a completely different league. The houseboat they arranged was stunning, the guide was knowledgeable, and when our return flight got cancelled, they sorted out accommodation on the spot at no extra cost. That's customer service.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
  },
  {
    name: "Vikram Shetty",
    location: "Bangalore",
    tour: "Leh Ladakh Expedition",
    rating: 5,
    text: "Tenzin our guide knew every monastery, every mountain pass, every hidden viewpoint. The acclimatization protocol they follow is genuinely careful — I've had altitude sickness on other Ladakh trips, not this one.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    tour: "Rajasthan Heritage",
    rating: 5,
    text: "Booked for a family of 6 including two elderly parents. They thought of everything — rest stops, accessible hotel rooms, light pace on Day 4 because my mother was tired. I didn't have to ask for a single thing.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
];

const CERTIFICATIONS = [
  "Ministry of Tourism, Govt. of India — Approved Tour Operator",
  "IATA Accredited Agent",
  "Travel + Leisure India — Best Domestic Operator 2024",
  "Ecotourism Society of India — Member",
  "TAAI (Travel Agents Association of India) — Member",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <StatsStrip />

      {/* ── Our story ────────────────────────────────────────────────── */}
      <StorySection />

      {/* ── Values ───────────────────────────────────────────────────── */}
      <ValuesSection />

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <TimelineSection />

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <TeamSection />

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── Certifications ───────────────────────────────────────────── */}
      <CertificationsSection />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CTASection />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85"
          alt="India landscape"
          className="w-full h-full object-cover"
          loading="eager"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <div className="max-w-xl">
          <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
            Est. 2016 · Mumbai, India
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
            We live <br />
            to show you <br />
            <span className="text-amber-400">Incredible India.</span>
          </h1>
          <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-md">
            WanderInn is a domestic tour operator run by passionate travellers
            who believe every Indian deserves to experience the full wonder of
            their own country — without the stress.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/domestic/tours"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2",
              })}
            >
              Explore Our Tours
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/domestic/contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-white/30 text-white hover:bg-white/10 gap-2",
              })}
            >
              <Phone size={15} />
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────

function StatsStrip() {
  return (
    <section className="border-b border-t bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2 py-8 px-6 text-center"
            >
              <Icon size={20} className="text-primary" aria-hidden="true" />
              <p className="text-3xl font-bold tracking-tight tabular-nums">
                {value}
              </p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

function StorySection() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images grid */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80"
              alt="Kerala backwaters"
              className="rounded-2xl object-cover aspect-[3/4] w-full"
              loading="lazy"
              width={300}
              height={400}
            />
            <div className="space-y-3 pt-8">
              <img
                src="https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80"
                alt="Ladakh"
                className="rounded-2xl object-cover aspect-square w-full"
                loading="lazy"
                width={300}
                height={300}
              />
              <img
                src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80"
                alt="Rajasthan"
                className="rounded-2xl object-cover aspect-video w-full"
                loading="lazy"
                width={300}
                height={169}
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Our Story
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug">
                Built by travellers, <br className="hidden sm:block" />
                for travellers.
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                WanderInn was born out of frustration. In 2015, our founder
                Anika booked a "premium" Rajasthan tour with a well-known
                operator — and got a cramped shared bus, a 2-star hotel
                masquerading as 4-star, and a guide who read from a Wikipedia
                printout.
              </p>
              <p>
                She spent the next year visiting every property, vetting every
                guide, and building an operation from the ground up — one where
                "what you see is exactly what you get." The first WanderInn tour
                ran in January 2016 with 8 guests. All 8 came back the following
                year.
              </p>
              <p>
                Today, we're a team of 40+ travel obsessives spread across
                India. We've collectively visited every destination we sell,
                personally vetted every hotel and guide, and made it our mission
                that no WanderInn traveller ever has that frustrating experience
                Anika had.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                "Every property personally inspected",
                "Guides certified & background-checked",
                "Prices fixed — no last-minute surprises",
                "24/7 on-trip support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2
                    size={14}
                    className="text-primary shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            What We Stand For
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Our values aren't on a poster.
            <br />
            They're in how we operate.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="border-border/60 hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6 space-y-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      value.color
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-base">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineSection() {
  return (
    <section className="py-20 px-4 bg-muted/20 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Our Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Nine years. One obsession.
          </h2>
        </div>

        <div className="relative">
          {/* Centre line — desktop */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block"
            aria-hidden="true"
          />
          {/* Left line — mobile */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-border md:hidden"
            aria-hidden="true"
          />

          <ol className="space-y-8 md:space-y-10">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={m.year}
                  className={cn(
                    "relative flex items-start gap-4 md:gap-0",
                    "pl-10 md:pl-0"
                  )}
                >
                  {/* Mobile dot */}
                  <div
                    className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background md:hidden"
                    aria-hidden="true"
                  />

                  {/* Desktop layout: alternating */}
                  <div
                    className={cn(
                      "hidden md:flex w-full items-start gap-8",
                      isLeft ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-1",
                        isLeft ? "text-right" : "text-left"
                      )}
                    >
                      <Card className="inline-block border-border/60 hover:shadow-md transition-shadow max-w-xs">
                        <CardContent className="pt-4 pb-4 px-5">
                          <Badge
                            variant="secondary"
                            className="mb-2 tabular-nums"
                          >
                            {m.year}
                          </Badge>
                          <h3 className="font-bold text-sm mb-1">{m.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {m.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Centre dot */}
                    <div className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-3">
                      <div
                        className="h-4 w-4 rounded-full bg-primary ring-4 ring-background"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1" aria-hidden="true" />
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden">
                    <Badge variant="secondary" className="mb-2 tabular-nums">
                      {m.year}
                    </Badge>
                    <h3 className="font-bold text-sm mb-1">{m.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────

function TeamSection() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            The People Behind Every Trip
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Meet the team.
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            We're not a faceless corporation. We're 40+ real people who love
            travel and genuinely care whether your trip is extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <Card
              key={member.name}
              className="group overflow-hidden border-border/60 hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs">
                  <MapPin size={11} aria-hidden="true" />
                  {member.location}
                </div>
              </div>

              <CardContent className="pt-4 pb-5 space-y-2">
                <div>
                  <h3 className="font-bold text-base">{member.name}</h3>
                  <p className="text-xs font-medium text-primary">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
                <p className="text-xs text-muted-foreground">
                  With WanderInn since{" "}
                  <span className="font-semibold text-foreground">
                    {member.since}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wider team note */}
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={22} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base">
              Plus 36 more ground staff across India
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              From local guides in Varanasi to camp managers in Ladakh — every
              member of our extended team is personally vetted, background
              checked, and trained to WanderInn standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Traveller Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Don't take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="border-border/60 hover:shadow-md transition-shadow flex flex-col"
            >
              <CardContent className="pt-6 flex flex-col flex-1 gap-4">
                {/* Quote icon */}
                <Quote
                  size={28}
                  className="text-primary/20 fill-primary/20"
                  aria-hidden="true"
                />

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  "{t.text}"
                </p>

                <Separator />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.location} · {t.tour}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/domestic/tours"
            className={buttonVariants({
              variant: "outline",
              className: "gap-2",
            })}
          >
            Read all 2,800+ reviews
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationsSection() {
  return (
    <section className="py-14 px-4 border-t border-b bg-background">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award size={22} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base mb-3">
              Licences & Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <Badge
                  key={cert}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  <CheckCircle2
                    size={11}
                    className="mr-1.5 text-green-600"
                    aria-hidden="true"
                  />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center space-y-5">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Ready to explore India <br />
          the right way?
        </h2>
        <p className="text-white/75 text-lg max-w-xl mx-auto">
          85+ destinations. 200+ curated tours. Zero hidden charges. Let us
          handle the details while you make the memories.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/domestic/tours"
            className={buttonVariants({
              size: "lg",
              className:
                "bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2",
            })}
          >
            Browse All Tours
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/domestic/contact"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-white/30 text-white hover:bg-white/10 gap-2",
            })}
          >
            <Mail size={15} />
            Get in Touch
          </Link>
        </div>

        {/* Trust micro-copy */}
        <p className="text-white/50 text-sm pt-2">
          No upfront commitment · Free itinerary consultation · Cancel anytime
          before 30 days
        </p>
      </div>
    </section>
  );
}