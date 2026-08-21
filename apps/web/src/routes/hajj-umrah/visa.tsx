import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe,
  HeartHandshake,
  Info,
  Landmark,
  MessageCircle,
  Phone,
  Shield,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react";

import { buttonVariants } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/hajj-umrah/visa")({
  component: HajjUmrahVisaPage,
});

const visaTypes = [
  {
    title: "Hajj visa",
    badge: "Hajj only",
    description:
      "Hajj travel follows a separate pilgrimage route and should not be treated the same as general Umrah travel. Hajj arrangements are quota-based and more tightly controlled.",
    points: [
      "Separate from tourist or ordinary Umrah travel pathways.",
      "Typically linked to seasonal Hajj allocation and approved operators.",
      "Requires earlier planning and confirmation than regular Umrah travel.",
    ],
  },
  {
    title: "Umrah visa / Umrah pathway",
    badge: "Umrah",
    description:
      "Umrah can be performed under current Saudi-approved pathways that may include dedicated Umrah processing or other eligible visa channels depending on the traveller’s profile and current policy.",
    points: [
      "Processing route may vary by nationality and current regulations.",
      "Often handled with support from an approved travel operator or current official visa pathway.",
      "Always confirm current eligibility before payment or travel planning.",
    ],
  },
  {
    title: "Tourist / eVisa pathway for Umrah",
    badge: "Umrah allowed, not Hajj",
    description:
      "Saudi guidance indicates that tourist visa pathways can allow Umrah for eligible travellers, but they do not permit Hajj and eligibility depends on official rules at the time of application.",
    points: [
      "May allow Umrah for eligible travellers.",
      "Does not replace Hajj visa requirements.",
      "Must be checked against the latest official policy before travel.",
    ],
  },
];

const commonDocuments = [
  "Passport with sufficient validity",
  "Recent passport-size photographs",
  "Identity details matching passport records",
  "Vaccination or health documents if currently required",
  "Travel itinerary or booking details where applicable",
  "Any additional documents requested by the current Saudi process",
];

const preparationTips = [
  {
    title: "Start early",
    description:
      "Visa and international travel guidance consistently recommends beginning early because document issues, seasonal demand, and policy updates can create delays.",
  },
  {
    title: "Check the latest rule set",
    description:
      "Visa rules can change, so your agency page should clearly state that travellers must confirm current requirements before submission and before departure.",
  },
  {
    title: "Match passport details exactly",
    description:
      "Application information should match the passport exactly to avoid preventable processing issues.",
  },
  {
    title: "Plan health requirements in advance",
    description:
      "Pilgrims should prepare vaccination and health documentation well before departure if required under current Saudi rules.",
  },
];

const importantNotes = [
  {
    title: "Umrah is not Hajj",
    text:
      "Tourist or Umrah-eligible visa pathways do not replace the separate Hajj process, and Hajj requires its own approved route.",
  },
  {
    title: "Policies can change seasonally",
    text:
      "Ramadan, Hajj season, and regulatory updates can affect timelines, entry pathways, and operational requirements.",
  },
  {
    title: "Final authority is official guidance",
    text:
      "Your website should guide pilgrims clearly, but final visa requirements should always be confirmed with official Saudi sources and your latest operator process.",
  },
];

const officialLinks = [
  {
    label: "Saudi Ministry of Hajj and Umrah",
    href: "https://haj.gov.sa/en/Umrah",
  },
  {
    label: "Saudia visa information",
    href: "https://www.saudia.com/explore/visit-saudi-arabia/visas",
  },
  {
    label: "Flynas visa guidance",
    href: "https://www.flynas.com/en/visa",
  },
];

const faqItems = [
  {
    question: "Can I perform Umrah on a tourist visa?",
    answer:
      "Saudi guidance indicates that eligible travellers may perform Umrah through tourist visa pathways, but that does not permit Hajj and should always be checked against current official eligibility rules.",
  },
  {
    question: "Is Hajj visa the same as Umrah visa?",
    answer:
      "No. Hajj is a separate pilgrimage process with its own seasonal structure and approvals, and it should not be treated like ordinary Umrah travel.",
  },
  {
    question: "How early should I apply?",
    answer:
      "The safest approach is to begin early, because visa processing, seasonal demand, and documentation corrections can all affect timing.",
  },
  {
    question: "Will your agency help with documents?",
    answer:
      "Yes. We help review common documents, explain the current process, and guide pilgrims toward the right application path before submission.",
  },
];

function HajjUmrahVisaPage() {
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
              Visa Guidance
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Clear visa guidance for Hajj and Umrah pilgrims.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This page explains the common visa pathways, typical document
              expectations, and the important difference between Hajj and Umrah
              travel. Rules can change, so we help you understand the process
              and confirm the latest requirements before you apply.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/hajj-umrah/process"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                View process
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
                  This page is for guidance only. Final visa eligibility, document
                  rules, and entry conditions must always be confirmed against the
                  latest official Saudi sources before travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visa pathways */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Visa pathways
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Understand the main difference first.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The most important thing pilgrims need to understand is that Hajj and
            Umrah are not processed in the same way. Official Saudi and airline-linked
            guidance clearly separates Hajj from Umrah-capable tourist or Umrah
            visa pathways. [web:188][web:185][web:190]
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visaTypes.map((item) => (
            <Card
              key={item.title}
              className="rounded-2xl border-border/60 bg-white shadow-sm"
            >
              <CardHeader>
                <Badge
                  variant="outline"
                  className="w-fit border-amber-200 bg-amber-50 text-amber-700"
                >
                  {item.badge}
                </Badge>
                <CardTitle className="pt-3 text-xl text-slate-900">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-6 text-slate-600">{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Documents and prep */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                  <FileText className="size-5 text-amber-700" />
                  Common documents
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Document requirements can vary, but these are the most common
                  items pilgrims should prepare early.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {commonDocuments.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-slate-50 p-4"
                  >
                    <FileCheck2 className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Preparation tips</CardTitle>
                <CardDescription className="text-slate-300">
                  Good preparation reduces delays and confusion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {preparationTips.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/75">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Important notes
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Things pilgrims should not misunderstand.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {importantNotes.map((item) => (
            <Card
              key={item.title}
              className="rounded-2xl border-border/60 bg-white shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
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

      {/* Official sources */}
      <section className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                  <Globe className="size-5 text-amber-700" />
                  Official and reference links
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  These are the kinds of sources pilgrims should check before relying
                  on any summary page. Official sources are the final authority on
                  current rules. [web:190][web:188][web:185]
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {officialLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="size-4 text-slate-400" />
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                  <Info className="size-5 text-amber-700" />
                  Our role as your travel agency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    We help pilgrims understand the right path before applying.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    We review common documents and explain what is usually needed.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    We help reduce avoidable mistakes before submission.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                  <p className="text-sm leading-7 text-slate-700">
                    We do not replace official Saudi visa policy or final approval authority.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            FAQs
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Common visa questions.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
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
      </section>

      {/* CTA */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Need help with the right visa path
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Talk to us before you submit anything.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              We’ll help you understand the current route, document expectations,
              and what to confirm from official sources before you apply.
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