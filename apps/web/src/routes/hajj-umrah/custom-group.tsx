import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bus,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/hajj-umrah/custom-group")({
  component: HajjUmrahCustomGroupPage,
});

const benefits = [
  {
    title: "Planned around your group",
    description:
      "We shape the travel plan around your family, mosque group, or community needs instead of forcing everyone into a fixed package.",
    icon: Users,
  },
  {
    title: "Better support for elders",
    description:
      "Hotel distance, movement pacing, room preferences, and practical comfort can be planned more carefully for elderly pilgrims.",
    icon: HeartHandshake,
  },
  {
    title: "Flexible departure options",
    description:
      "Departure city, date preference, and stay duration can be discussed based on your group's priorities and budget.",
    icon: CalendarDays,
  },
  {
    title: "Easier coordination",
    description:
      "A group lead can work with us once, and we help organise the rest with more clarity and less confusion.",
    icon: BadgeCheck,
  },
];

const idealFor = [
  "Large families travelling together",
  "Mosque or community groups",
  "Women’s groups with specific planning needs",
  "Pilgrims travelling with elderly parents",
  "Groups wanting more hotel control or comfort preference",
  "Travellers who need a private or custom-paced plan",
];

const customOptions = [
  {
    title: "Travel dates and duration",
    description:
      "Choose preferred travel months, flexible windows, and stay duration based on your group’s schedule.",
    icon: Clock3,
  },
  {
    title: "Departure city",
    description:
      "Discuss departures from major Indian cities depending on group size and logistics.",
    icon: MapPin,
  },
  {
    title: "Hotel category and distance",
    description:
      "Choose between economy, standard, premium, or proximity-focused accommodation plans.",
    icon: BedDouble,
  },
  {
    title: "Ground movement and pacing",
    description:
      "Plan practical movement with group comfort in mind, especially where elders or children are involved.",
    icon: Bus,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Tell us about your group",
    text:
      "Share the group size, travel purpose, city, preferred month, and any special support needs.",
  },
  {
    step: "02",
    title: "We prepare a tailored outline",
    text:
      "We suggest a suitable travel structure with category options, stay ideas, and likely price direction.",
  },
  {
    step: "03",
    title: "Refine the arrangement",
    text:
      "We adjust the plan around comfort, elders, hotel distance, budget, and timeline before confirmation.",
  },
  {
    step: "04",
    title: "Move toward registration",
    text:
      "Once the structure is agreed, we guide the group lead on documentation, payment flow, and next operational steps.",
  },
];

const trustPoints = [
  "Group travel works best when needs are gathered early and planning starts from the group’s actual profile rather than a generic template.",
  "Multi-family pilgrimage coordination often requires hotel proximity, synchronized movement, and flexibility around elders or mixed-age groups.",
  "A clear inquiry-first page is stronger than forcing custom groups through a normal package checkout flow.",
];

function HajjUmrahCustomGroupPage() {
  return (
    <main className="bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(18,63,69,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.94))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-amber-200 bg-amber-50 text-amber-700"
            >
              Custom Family & Group Travel
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Plan a pilgrimage around your group, not around a fixed template.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This page is for families, mosque groups, and community organisers
              who want a more flexible Hajj or Umrah arrangement with better control
              over comfort, pacing, and group coordination.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
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
                    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                })}
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp us
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <p className="text-sm leading-7 text-slate-700">
                  Group travel planning is strongest when the organiser’s needs are
                  understood early, including timing, comfort level, and who is
                  travelling. [web:223][web:231]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Why choose custom
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for real group needs.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Standard packages work for many travellers, but custom planning is better
            when your group includes elders, mixed age ranges, or special comfort
            requirements. [web:224][web:227][web:230]
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-2xl border-border/60 bg-white shadow-sm"
              >
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Ideal for + custom options */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  This page is ideal for
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {idealFor.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  What can be customized
                </CardTitle>
                <CardDescription className="text-slate-300">
                  The exact scope depends on season, group size, and current availability.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {customOptions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-300">
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A simple consultation-led flow.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((item) => (
            <Card
              key={item.step}
              className="rounded-2xl border-border/60 bg-white shadow-sm"
            >
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-sm font-bold text-amber-700">
                  {item.step}
                </div>
                <CardTitle className="pt-3 text-xl text-slate-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust notes + form */}
      <section className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Why this structure works
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Custom and group travel pages should collect planning signals first,
                  because the right solution depends on the group itself. [web:223][web:231]
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border/60 bg-slate-50 p-4"
                  >
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Star className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <p className="text-sm leading-7 text-slate-700">
                      Group and family pilgrimage planning often becomes much smoother
                      when one organiser works with a dedicated team instead of each
                      traveller coordinating separately. [web:224][web:230]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Request a custom plan
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Share the basics and we’ll guide you toward a suitable structure.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Group lead name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9xxxx xxxxx"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Group size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 pilgrims"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Travel type
                    </label>
                    <select className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400">
                      <option>Custom Umrah</option>
                      <option>Custom Ramadan Umrah</option>
                      <option>Custom Hajj consultation</option>
                      <option>Women-only group inquiry</option>
                      <option>Family group inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                      Preferred travel month
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. January 2027"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-900">
                      Group details
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell us about elders, children, city of departure, hotel preference, comfort expectations, and any special support needs."
                      className="w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                      <Send className="mr-2 size-4" />
                      Send custom inquiry
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Prefer a standard option first
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Compare our regular packages before requesting a custom plan.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              If your group does not need a flexible arrangement, a standard package
              may already be the right fit.
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
              <ArrowRight className="ml-2 size-4" />
            </Link>

            <Link
              to="/hajj-umrah/contact"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              <FileText className="mr-2 size-4" />
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}