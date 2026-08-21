import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  HeartHandshake,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Star,
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

export const Route = createFileRoute("/hajj-umrah/")({
  component: HajjUmrahHomepage,
});

// ─── Data ──────────────────────────────────────────────────────────────────

const packageTypes = [
  {
    slug: "hajj",
    title: "Hajj Packages",
    subtitle: "Annual pilgrimage",
    description:
      "Group Hajj packages with visa processing, flights, Makkah & Madinah hotel accommodation, ground transport, and guided ziyarat.",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80",
    badge: "Annual",
    badgeColor: "border-amber-300 bg-amber-50 text-amber-800",
    startingFrom: "₹3,50,000",
    duration: "28–35 days",
    features: ["Visa included", "Group departure", "Full board hotel", "Guided ziyarat"],
  },
  {
    slug: "umrah",
    title: "Umrah Packages",
    subtitle: "Year-round pilgrimage",
    description:
      "Flexible Umrah packages throughout the year with direct flights, premium Makkah hotels, Madinah ziyarat, and full documentation support.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80",
    badge: "Year-round",
    badgeColor: "border-teal-300 bg-teal-50 text-teal-800",
    startingFrom: "₹85,000",
    duration: "10–21 days",
    features: ["Economy & Premium", "Flexible dates", "Madinah stay", "Visa included"],
  },
  {
    slug: "ramadan-umrah",
    title: "Ramadan Umrah",
    subtitle: "Sacred month packages",
    description:
      "Specially designed packages for Ramadan with proximity hotels, Taraweeh at Masjid al-Haram, and suhoor & iftar arrangements.",
    image:
      "https://images.unsplash.com/photo-1615886753866-79396abc4a5e?auto=format&fit=crop&w=900&q=80",
    badge: "Ramadan only",
    badgeColor: "border-violet-300 bg-violet-50 text-violet-800",
    startingFrom: "₹1,20,000",
    duration: "14–28 days",
    features: ["Proximity hotels", "Taraweeh access", "Suhoor & iftar", "Last 10 days option"],
  },
  {
    slug: "custom-group",
    title: "Custom Group",
    subtitle: "Family & community",
    description:
      "Tailored packages for family groups, mosque committees, and community organisations with private transport and flexible scheduling.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    badge: "Custom",
    badgeColor: "border-sky-300 bg-sky-50 text-sky-800",
    startingFrom: "On request",
    duration: "Custom",
    features: ["Private group", "Custom itinerary", "Dedicated guide", "Flexible size"],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Register your interest",
    description:
      "Submit a quick inquiry with your preferred package type, dates, and group size.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Document submission",
    description:
      "We guide you through passport, photo, vaccination certificate, and other required documents.",
    icon: BadgeCheck,
  },
  {
    step: "03",
    title: "Visa processing",
    description:
      "We handle your Saudi visa application end-to-end and keep you updated throughout.",
    icon: Shield,
  },
  {
    step: "04",
    title: "Pre-departure briefing",
    description:
      "A dedicated session covering rituals, rules, hotel details, packing list, and group coordination.",
    icon: Users,
  },
  {
    step: "05",
    title: "Sacred journey",
    description:
      "Travel with a guided group, stay in vetted hotels, and receive on-ground support throughout.",
    icon: Landmark,
  },
  {
    step: "06",
    title: "Safe return",
    description:
      "Coordinated return travel with airport handling and post-trip documentation support.",
    icon: HeartHandshake,
  },
];

const trustStats = [
  { value: "12+", label: "Years of service", icon: Clock3 },
  { value: "8,400+", label: "Pilgrims served", icon: Users },
  { value: "Licensed", label: "Ministry approved", icon: BadgeCheck },
  { value: "4.9 / 5", label: "Pilgrim satisfaction", icon: Star },
];

const testimonials = [
  {
    name: "Arif Hussain",
    city: "Ahmedabad",
    quote:
      "Every step from documentation to return was handled with care. We never had to worry about anything during the entire journey.",
    package: "Umrah Package",
    year: "2024",
    initials: "AH",
  },
  {
    name: "Fatima Shaikh",
    city: "Surat",
    quote:
      "The Ramadan package was a dream fulfilled. The hotel was close to Haram, and the team guided us beautifully through every ritual.",
    package: "Ramadan Umrah",
    year: "2024",
    initials: "FS",
  },
  {
    name: "Yusuf Memon",
    city: "Bhuj",
    quote:
      "We went as a family of 11 with elderly members. The custom group arrangement was perfect — private transport, thoughtful pacing, and personal attention.",
    package: "Custom Group",
    year: "2025",
    initials: "YM",
  },
];

const faqs = [
  {
    question: "What is included in the Umrah package?",
    answer:
      "Our Umrah packages include return flights, Saudi Umrah visa, airport transfers, hotel stays in Makkah and Madinah, guided ziyarat, and pre-departure documentation support.",
  },
  {
    question: "Can women perform Umrah without a mahram?",
    answer:
      "Women over 45 years may perform Umrah with an organised group under Ministry of Hajj guidelines. Women under 45 must be accompanied by a mahram. We will guide you through the current regulations at the time of booking.",
  },
  {
    question: "How early should I register for Hajj?",
    answer:
      "Hajj seats are allocated by quota. We recommend registering 6–12 months in advance. Contact us early to secure your spot in the next departure.",
  },
  {
    question: "Do you handle visa rejection cases?",
    answer:
      "While visa approval is at the discretion of Saudi authorities, we guide all applicants through complete documentation to minimise rejection risk and advise on re-application if needed.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

function HajjUmrahHomepage() {
  return (
    <main className="bg-[#faf9f6]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1800&q=80"
          alt="Masjid al-Haram, Makkah"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/82 via-[#1a1208]/55 to-[#1a1208]/90" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <Badge className="mb-6 border-amber-400/30 bg-amber-400/15 text-amber-200 hover:bg-amber-400/15">
              Trusted since 2013 · Ministry approved
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your sacred journey, <br className="hidden sm:block" />
              planned with care.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Hajj, Umrah, and Ramadan Umrah packages for pilgrims across India.
              We handle visa, flights, hotels, and on-ground guidance — so you
              can focus entirely on your ibadah.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hajj-umrah/packages"
                className={buttonVariants({
                  className:
                    "bg-amber-600 text-white hover:bg-amber-700 shadow-lg",
                })}
              >
                View all packages
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call us now
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur-sm"
                  >
                    <Icon className="mb-1.5 size-4 text-amber-300" />
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/65">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Package categories ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Packages
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose the pilgrimage that's right for you.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            We offer four types of pilgrimage programs — Hajj, Umrah, Ramadan
            Umrah, and custom group arrangements — each with full documentation,
            accommodation, and on-ground guidance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {packageTypes.map((pkg) => (
            <Card
              key={pkg.slug}
              className="group overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/70 via-transparent to-transparent" />
                <Badge
                  variant="outline"
                  className={cn(
                    "absolute left-3 top-3 text-xs font-semibold",
                    pkg.badgeColor
                  )}
                >
                  {pkg.badge}
                </Badge>
              </div>

              <CardHeader className="pb-2 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  {pkg.subtitle}
                </p>
                <CardTitle className="text-lg text-slate-900">
                  {pkg.title}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  {pkg.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {pkg.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="size-3 text-amber-600" />
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div>
                    <p className="text-xs text-slate-500">Starting from</p>
                    <p className="text-base font-bold text-slate-900">
                      {pkg.startingFrom}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {pkg.duration}
                    </p>
                  </div>
                </div>

                <Link
                  to="/hajj-umrah/packages"
                  search={{ type: pkg.slug }}
                  className={buttonVariants({
                    className:
                      "w-full bg-slate-900 text-white hover:bg-slate-800",
                  })}
                >
                  View packages
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From inquiry to your sacred return.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We handle every operational detail so you can begin your
              spiritual preparation without logistical worry.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-3xl font-bold text-slate-100">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  {idx < processSteps.length - 1 && (
                    <div className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 lg:block">
                      <ChevronRight className="size-5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/hajj-umrah/process"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-amber-200 bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Read the full process
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(180,130,40,0.08),transparent_48%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Why travel with us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              More than a booking — a guided sacred journey.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We've helped thousands of pilgrims from Gujarat and across India
              fulfil this sacred obligation. Our work covers every step from
              document guidance to on-ground support in Makkah and Madinah.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                {
                  icon: BadgeCheck,
                  title: "Ministry approved & licensed",
                  desc: "We are a registered Hajj & Umrah operator recognised by relevant authorities.",
                },
                {
                  icon: Building2,
                  title: "Vetted hotels near Haram",
                  desc: "All accommodation is selected for proximity, cleanliness, and comfort.",
                },
                {
                  icon: Users,
                  title: "Dedicated group guide",
                  desc: "Every group travels with an experienced Islamic guide for ritual and logistical support.",
                },
                {
                  icon: Shield,
                  title: "Visa handled end-to-end",
                  desc: "We take full responsibility for Saudi visa applications, reducing stress and uncertainty.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white p-4 shadow-sm"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80"
              alt="Pilgrims at Masjid al-Haram"
              className="h-[520px] w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
              width={900}
              height={520}
            />

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-amber-100 bg-white p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Star className="size-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.9 / 5</p>
                  <p className="text-xs text-slate-500">
                    Based on 1,200+ pilgrim reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="border-t bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Words from our pilgrims.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/8 bg-white/5 p-6"
              >
                <Quote className="mb-4 size-6 text-amber-400/60" />
                <p className="text-sm leading-7 text-white/80">
                  "{item.quote}"
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-600/20 text-sm font-bold text-amber-300">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="size-3" />
                      {item.city} · {item.package} · {item.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/hajj-umrah/gallery"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white",
              })}
            >
              See more reviews & photos
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ strip ────────────────────────────────────────────────────── */}
      <section className="border-y bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Common questions
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Questions pilgrims often ask us.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {faq.question}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/hajj-umrah/faq"
              className={buttonVariants({
                variant: "outline",
                className: "border-slate-200 bg-white text-slate-900",
              })}
            >
              Read all FAQs
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#6f5516]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,80,0.18),transparent_55%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Begin your journey
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to plan your pilgrimage?
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              Contact us to discuss your package preference, travel dates, and
              group details. Our team will guide you from registration to your
              safe return.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/hajj-umrah/packages"
              className={buttonVariants({
                className: "bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Explore packages
            </Link>

            <a
              href="tel:+919000000000"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
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
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              <MessageCircle className="mr-2 size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
