import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileText,
  HeartHandshake,
  HelpCircle,
  MessageCircle,
  Phone,
  Shield,
  Stethoscope,
  Users,
  Wallet,
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

export const Route = createFileRoute("/hajj-umrah/faq")({
  component: HajjUmrahFaqPage,
});

const faqGroups = [
  {
    title: "Packages and booking",
    icon: BadgeCheck,
    description:
      "Questions pilgrims usually ask before choosing a package or confirming a seat.",
    items: [
      {
        question: "What is included in your Hajj and Umrah packages?",
        answer:
          "Most packages commonly include visa support, flights, hotel stay, local transfers, and guidance, but exact inclusions depend on the package category and season.",
      },
      {
        question: "Do you have economy and premium options?",
        answer:
          "Yes. We usually provide economy, standard, premium, and custom group options so pilgrims can choose based on comfort, group needs, and budget.",
      },
      {
        question: "Can I reserve first and confirm later?",
        answer:
          "Reservation and confirmation rules depend on the package type, season, and seat availability, so our team will explain the current hold and payment timeline before you commit.",
      },
      {
        question: "Do you arrange custom family or community group travel?",
        answer:
          "Yes. We can plan custom departures for families, mosque groups, and community groups with flexible dates, hotel preferences, and support needs.",
      },
    ],
  },
  {
    title: "Visa and eligibility",
    icon: Shield,
    description:
      "These questions cover the most common uncertainty area for pilgrims: the visa route.",
    items: [
      {
        question: "Is Hajj visa the same as Umrah visa?",
        answer:
          "No. Hajj is a separate pilgrimage process and should not be treated like standard Umrah travel or tourist visa travel.",
      },
      {
        question: "Can Umrah be performed on a tourist visa?",
        answer:
          "Depending on nationality and current Saudi rules, eligible travellers may be able to perform Umrah through tourist visa pathways, but this should always be confirmed against the latest official guidance.",
      },
      {
        question: "Do you help with visa documents?",
        answer:
          "Yes. We help pilgrims understand the usual document requirements, review common documents, and guide them through the right process before submission.",
      },
      {
        question: "Who gives the final visa approval?",
        answer:
          "Final approval comes from the relevant Saudi authorities, not from the travel agency, so all applications remain subject to current official rules and approval decisions.",
      },
    ],
  },
  {
    title: "Women, mahram, and group travel",
    icon: Users,
    description:
      "These are among the most sensitive and frequently asked planning questions.",
    items: [
      {
        question: "Is a mahram always required?",
        answer:
          "Mahram-related rules can depend on the type of travel, the traveller’s age, current policy, and the package structure, so we advise pilgrims based on the latest applicable guidance.",
      },
      {
        question: "Can women travel in a women-only group?",
        answer:
          "Current official Hajj guidance indicates that women may register in women-only groups in some cases, but the exact pathway and eligibility should always be checked at the time of booking.",
      },
      {
        question: "Do you arrange family-friendly packages?",
        answer:
          "Yes. Many pilgrims travel as couples or families, and we can help suggest packages that are more suitable for elders, children, or larger family groups.",
      },
      {
        question: "Can elderly pilgrims get additional support?",
        answer:
          "Yes. We can help assess hotel distance, pacing, transport needs, and whether a custom group or more comfortable category is better for elderly travellers.",
      },
    ],
  },
  {
    title: "Preparation and health",
    icon: Stethoscope,
    description:
      "Practical readiness matters as much as the booking itself for a smooth pilgrimage.",
    items: [
      {
        question: "What documents should I prepare first?",
        answer:
          "Pilgrims should typically prepare a valid passport, photographs, identity details, and any current vaccination or medical documents that may be required.",
      },
      {
        question: "Are vaccines required?",
        answer:
          "Official guidance for Hajj may include required vaccines such as meningococcal vaccination, while other vaccines may be recommended depending on current policy and season.",
      },
      {
        question: "Will you provide a pre-departure briefing?",
        answer:
          "Yes. We provide practical guidance on rituals, travel flow, packing, hotel expectations, and group coordination before departure.",
      },
      {
        question: "What should I pack?",
        answer:
          "Packing needs vary by package and season, but common essentials include required clothing, daily medicines, simple footwear, identity copies, and lightweight luggage.",
      },
    ],
  },
  {
    title: "Payments, timing, and cancellations",
    icon: Wallet,
    description:
      "Many users look for this section before they feel comfortable making contact or paying.",
    items: [
      {
        question: "How early should I book?",
        answer:
          "It is better to begin early, especially for Hajj and Ramadan travel, because flights, hotel availability, and processing timelines become more restrictive during peak periods.",
      },
      {
        question: "Can prices change after inquiry?",
        answer:
          "Yes. Flight costs, hotel availability, seasonal demand, and policy changes can affect final pricing, so all live prices should be confirmed before payment.",
      },
      {
        question: "What happens if I cancel?",
        answer:
          "Cancellation terms depend on the package stage, payment status, permit or visa stage, and supplier conditions, so our team explains the applicable cancellation policy before confirmation.",
      },
      {
        question: "Do official systems also have payment deadlines?",
        answer:
          "Yes. Official Hajj guidance shows that booking invoices and cancellation timing can be time-sensitive, so pilgrims should avoid delaying once the approved process begins.",
      },
    ],
  },
];

const quickLinks = [
  {
    title: "See package options",
    description: "Compare Hajj, Umrah, Ramadan, and custom group packages.",
    to: "/hajj-umrah/packages" as const,
  },
  {
    title: "Understand the process",
    description: "Read the full journey from inquiry to return.",
    to: "/hajj-umrah/process" as const,
  },
  {
    title: "Read visa guidance",
    description: "Understand common pathways and document expectations.",
    to: "/hajj-umrah/visa" as const,
  },
];

const officialNotes = [
  "Official Ministry FAQ material includes questions on Hajj eligibility, mahram exceptions, payment windows, vaccines, and cancellations, which shows the kind of information pilgrims expect to find clearly explained. [web:199]",
  "A strong FAQ section helps support trust and conversion by answering concerns directly on the page instead of forcing every visitor into a support chat or call. [web:194][web:197][web:200]",
];

function HajjUmrahFaqPage() {
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
              Frequently Asked Questions
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Answers for the questions pilgrims ask most.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This FAQ page brings together the most common questions about
              packages, visas, preparation, family travel, payments, and
              cancellations so you can understand the basics before speaking
              with our team.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/hajj-umrah/packages"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                View packages
              </Link>

              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call us now
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <p className="text-sm leading-7 text-slate-700">
                  FAQ pages work best when they answer real objections clearly and
                  early, which improves trust and reduces unnecessary support friction. [web:194][web:197][web:200]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-700">
                Open page
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ groups */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="space-y-6">
          {faqGroups.map((group) => {
            const Icon = group.icon;

            return (
              <Card
                key={group.title}
                className="rounded-2xl border-border/60 bg-white shadow-sm"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900">
                        {group.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                        {group.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl border border-border/60 bg-slate-50 p-5 open:bg-white"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
                          <p className="text-sm font-semibold leading-6 text-slate-900">
                            {item.question}
                          </p>
                        </div>

                        <ChevronDown className="mt-1 size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="mt-4 border-t border-border/60 pt-4">
                        <p className="text-sm leading-7 text-slate-600">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Official notes */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Why this FAQ matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officialNotes.map((note, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border/60 bg-slate-50 p-4"
                  >
                    <p className="text-sm leading-7 text-slate-600">{note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Important reminder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    Final visa rules, eligibility, and operational details depend
                    on the latest official policy at the time of travel.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    Payment windows, booking stages, and cancellation timing can
                    become stricter closer to the travel season.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    For women-only groups, mahram-related questions, and Hajj-specific
                    conditions, always verify the latest applicable guidance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-sm sm:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Still have questions
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Speak with our team for the latest answers.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              We can help clarify package differences, document requirements,
              timelines, family travel concerns, and the most suitable next step
              for your pilgrimage.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
            <a
              href="tel:+919000000000"
              className={buttonVariants({
                className: "bg-amber-600 text-white hover:bg-amber-700",
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
                  "border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white",
              })}
            >
              <MessageCircle className="mr-2 size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Bottom links */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Continue exploring
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Move from questions to planning.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              Review packages, understand the process, and read visa guidance
              before starting your journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/hajj-umrah/process"
              className={buttonVariants({
                className: "bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Read process
            </Link>

            <Link
              to="/hajj-umrah/visa"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              Visa guidance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}