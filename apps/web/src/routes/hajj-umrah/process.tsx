import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  HeartHandshake,
  Landmark,
  Luggage,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  Star,
  Stethoscope,
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

export const Route = createFileRoute("/hajj-umrah/process")({
  component: HajjUmrahProcessPage,
});

const processSteps = [
  {
    step: "01",
    title: "Initial inquiry and consultation",
    icon: MessageCircle,
    summary:
      "We begin by understanding whether you need Hajj, Umrah, Ramadan Umrah, or a custom family or group plan.",
    details: [
      "Discuss travel type, preferred dates, group size, and departure city.",
      "Recommend the most suitable package category based on comfort and budget.",
      "Clarify what is included, expected pricing range, and next steps before registration.",
    ],
  },
  {
    step: "02",
    title: "Registration and seat confirmation",
    icon: BadgeCheck,
    summary:
      "Once you choose a package, we begin the registration process and confirm availability according to the current travel season.",
    details: [
      "Collect primary traveller information and reserve the selected package or group slot.",
      "Explain the payment schedule and any package-specific conditions.",
      "Share the document checklist and preparation timeline.",
    ],
  },
  {
    step: "03",
    title: "Document collection and verification",
    icon: FileText,
    summary:
      "We help you prepare the documents required for visa and travel processing, and we review them before submission.",
    details: [
      "Passport copies, photographs, vaccination details, and identity documents are collected.",
      "Document quality and validity are checked before submission.",
      "Any missing items are flagged early to avoid delays later in the process.",
    ],
  },
  {
    step: "04",
    title: "Visa processing",
    icon: Shield,
    summary:
      "The visa phase depends on current Saudi regulations, the type of pilgrimage, and the eligibility rules in force at that time.",
    details: [
      "Umrah and Hajj visa processes are not the same, and Hajj follows a separate quota-based route.",
      "For eligible Umrah travellers, current Saudi guidance also distinguishes tourist eVisa use from Hajj-specific visas.",
      "We handle the submission flow and keep you informed while approval is pending.",
    ],
  },
  {
    step: "05",
    title: "Pre-departure guidance",
    icon: Users,
    summary:
      "Before departure, we conduct a briefing so pilgrims understand rituals, practical travel steps, hotel expectations, and group coordination.",
    details: [
      "Review Ihram guidance, ritual sequence, group instructions, and airport preparation.",
      "Discuss weather, crowd conditions, packing essentials, and personal readiness.",
      "Share accommodation details, transport flow, and emergency contact information.",
    ],
  },
  {
    step: "06",
    title: "Flights, arrival, and hotel transfer",
    icon: Plane,
    summary:
      "We coordinate travel from your departure city to Saudi Arabia and guide the transition from airport arrival to hotel check-in.",
    details: [
      "International departure support is coordinated according to the selected group plan.",
      "Airport handling, immigration, and transfer instructions are provided.",
      "Pilgrims are moved to their Makkah or Madinah accommodation according to itinerary order.",
    ],
  },
  {
    step: "07",
    title: "Pilgrimage stay and on-ground support",
    icon: Landmark,
    summary:
      "During the sacred journey, our role is to support the logistical side so pilgrims can focus on worship with more peace of mind.",
    details: [
      "Guided movement, local coordination, and practical support continue during the stay.",
      "For Hajj, this includes support around the structured rites and group movement.",
      "For Umrah, this includes hotel coordination, ziyarat support, and practical assistance where needed.",
    ],
  },
  {
    step: "08",
    title: "Return journey and follow-up",
    icon: HeartHandshake,
    summary:
      "After completion of the trip, we coordinate the return journey and remain available for practical follow-up where needed.",
    details: [
      "Airport transfer and departure formalities are coordinated according to the itinerary.",
      "Group return is managed from Saudi Arabia back to India.",
      "Any pending documentation or clarification is supported after return when applicable.",
    ],
  },
];

const supportBlocks = [
  {
    title: "Documents",
    icon: FileCheck2,
    points: [
      "Passport validity check",
      "Photograph requirements",
      "Identity proof review",
      "Application-readiness support",
    ],
  },
  {
    title: "Health preparation",
    icon: Stethoscope,
    points: [
      "Vaccination guidance",
      "Medication planning reminders",
      "Elderly travel preparation tips",
      "Basic wellness precautions",
    ],
  },
  {
    title: "Travel readiness",
    icon: Luggage,
    points: [
      "Packing checklist",
      "Ihram and clothing reminders",
      "Climate and walking expectations",
      "Airport and baggage guidance",
    ],
  },
];

const processNotes = [
  {
    label: "Hajj is quota-based",
    text:
      "Hajj travel follows a separate approval and allocation structure, so availability and process timing differ from Umrah. [web:176][web:178]",
  },
  {
    label: "Umrah visa handling can vary",
    text:
      "Umrah travel rules can change based on nationality, eligibility, and current Saudi policy, including tourist eVisa pathways for eligible travellers. [web:176]",
  },
  {
    label: "Timelines are seasonal",
    text:
      "Visa timing, hotel access, and travel planning can shift significantly during Ramadan and peak pilgrimage periods. [web:176][web:178]",
  },
];

const faqItems = [
  {
    question: "How early should I begin the process?",
    answer:
      "For Umrah, earlier planning gives you better flight and hotel choices, while Hajj usually requires much earlier registration because it follows a quota-based process. [web:176][web:178]",
  },
  {
    question: "Do you help with documents?",
    answer:
      "Yes, the process is designed to include document collection, review, and submission support before visa processing begins. [web:176]",
  },
  {
    question: "Will I receive pre-departure guidance?",
    answer:
      "Yes, the process includes a pre-departure briefing covering rituals, travel flow, hotel expectations, and practical preparation. [web:176][web:178]",
  },
];

function HajjUmrahProcessPage() {
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
              Hajj & Umrah Process
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Understand the journey before the journey begins.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This page explains how the full pilgrimage process works, from your
              first inquiry and registration to visa handling, pre-departure
              preparation, travel, on-ground support, and return.
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

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <Clock3 className="mb-2 size-4 text-amber-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Step-by-step clarity
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  The full travel flow is explained clearly so families know what to expect. [web:175][web:183]
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <Shield className="mb-2 size-4 text-amber-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Process with guidance
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  Visa and operational steps are easier to trust when handled in a guided sequence. [web:176][web:178]
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <Users className="mb-2 size-4 text-amber-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Built for pilgrims
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  The process focuses on reassurance, preparation, and support rather than aggressive selling. [web:175][web:177]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Process timeline
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From inquiry to sacred return.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Each stage is designed to reduce uncertainty and keep pilgrims informed
            about what happens next. Structured process pages like this improve trust
            because they make the journey legible before commitment. [web:175][web:183]
          </p>
        </div>

        <div className="space-y-5">
          {processSteps.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.step}
                className="overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm"
              >
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-[220px_1fr]">
                    <div className="border-b border-border/50 bg-[#f4efe6]/70 p-6 lg:border-b-0 lg:border-r">
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Step {item.step}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm leading-7 text-slate-700">
                        {item.summary}
                      </p>

                      <div className="mt-4 grid gap-3">
                        {item.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-start gap-3 rounded-xl border border-border/50 bg-slate-50 p-4"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <p className="text-sm leading-6 text-slate-600">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      {index < processSteps.length - 1 && (
                        <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                          Next step
                          <ChevronRight className="size-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Support preparation blocks */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Preparation support
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              What we help you prepare for.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Pilgrimage planning is not just about booking seats and hotels.
              Preparation around documents, health, and travel readiness is a major
              part of the journey. [web:176][web:178]
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {supportBlocks.map((block) => {
              const Icon = block.icon;

              return (
                <Card
                  key={block.title}
                  className="rounded-2xl border-amber-100 bg-white shadow-sm"
                >
                  <CardHeader>
                    <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">
                      {block.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {block.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        <p className="text-sm leading-6 text-slate-600">{point}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                <CircleAlert className="size-5 text-amber-700" />
                Important process notes
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                These are the practical realities pilgrims should know before choosing
                dates and packages.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {processNotes.map((note) => (
                <div
                  key={note.label}
                  className="rounded-xl border border-border/60 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {note.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {note.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Quick process summary</CardTitle>
              <CardDescription className="text-slate-300">
                A simple view of what pilgrims usually move through.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                "Inquiry",
                "Registration",
                "Documents",
                "Visa",
                "Briefing",
                "Departure",
                "Pilgrimage stay",
                "Return",
              ].map((item, idx) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-amber-600/20 text-xs font-bold text-amber-300">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-white/85">{item}</span>
                  </div>
                  <ChevronRight className="size-4 text-white/35" />
                </div>
              ))}

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Star className="mt-0.5 size-4 shrink-0 text-amber-300" />
                  <p className="text-sm leading-6 text-white/75">
                    Clear step sequencing is one of the strongest trust signals on
                    service-heavy pages because it reduces confusion before inquiry. [web:175][web:183]
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              FAQs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Common questions about the process.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-border/60 bg-slate-50 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.question}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/hajj-umrah/faq"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
              })}
            >
              Read full FAQ
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Ready to begin
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Speak to our team and start the process with clarity.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              We’ll help you understand the right package, current documents,
              likely timelines, and the next practical step for your pilgrimage.
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
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              <Phone className="mr-2 size-4" />
              Call now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}