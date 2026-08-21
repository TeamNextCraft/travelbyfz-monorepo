import { createFileRoute, Link } from "@tanstack/react-router";
import {
  XCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  CloudLightning,
  ArrowRight,
  Mail,
  Phone,
  Info,
  CalendarDays,
  BadgePercent,
  ArrowUp,
  Loader2,
  Send,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/cancellation-policy/")({
  component: CancellationPolicyPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "1 June 2026";

const REFUND_TIERS = [
  {
    window: "30+ days",
    label: "30 or more days before travel",
    refundPct: 90,
    refundLabel: "90% refund",
    description:
      "The 50% deposit you paid at booking is non-refundable. The remaining 90% figure applies to your total tour cost — we absorb the difference.",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    badgeClass:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    example: {
      total: 60000,
      refund: 54000,
      forfeited: 6000,
    },
  },
  {
    window: "15–29 days",
    label: "15 to 29 days before travel",
    refundPct: 50,
    refundLabel: "50% refund",
    description:
      "Half the tour cost is returned. At this stage we've committed to hotel and transport bookings on your behalf which incur penalties.",
    color: "bg-amber-400",
    textColor: "text-amber-700 dark:text-amber-400",
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    example: {
      total: 60000,
      refund: 30000,
      forfeited: 30000,
    },
  },
  {
    window: "7–14 days",
    label: "7 to 14 days before travel",
    refundPct: 25,
    refundLabel: "25% refund",
    description:
      "Most costs are already locked in — hotels, guides, and transport are non-refundable this close to departure.",
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-400",
    badgeClass:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    example: {
      total: 60000,
      refund: 15000,
      forfeited: 45000,
    },
  },
  {
    window: "< 7 days",
    label: "Less than 7 days before travel",
    refundPct: 0,
    refundLabel: "No refund",
    description:
      "Cancellations within 7 days of departure are fully non-refundable. Consider purchasing travel insurance to protect against last-minute cancellations.",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    badgeClass:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    example: {
      total: 60000,
      refund: 0,
      forfeited: 60000,
    },
  },
  {
    window: "No-show",
    label: "No-show on travel date",
    refundPct: 0,
    refundLabel: "No refund",
    description:
      "Failure to show up on the Travel Date without prior written notice constitutes a no-show. The full tour cost is forfeited.",
    color: "bg-red-700",
    textColor: "text-red-700 dark:text-red-400",
    badgeClass:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    example: {
      total: 60000,
      refund: 0,
      forfeited: 60000,
    },
  },
];

const SCENARIOS = [
  {
    icon: CloudLightning,
    title: "Force Majeure / Natural Disaster",
    badge: "Credit Note",
    badgeClass:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    description:
      "If your tour is cancelled due to a cyclone, flood, earthquake, government travel ban, epidemic, or other Force Majeure event, you receive a full Credit Note valid for 12 months. Cash refunds are at our discretion and may take up to 60 days.",
    steps: [
      "We notify you as soon as cancellation is confirmed",
      "A Credit Note equal to 100% of your paid amount is issued within 5 business days",
      "Redeem the credit note against any WanderInn tour within 12 months",
      "Credit notes are non-transferable and non-encashable",
    ],
  },
  {
    icon: RefreshCw,
    title: "Company-Initiated Cancellation",
    badge: "Full Refund or Rebook",
    badgeClass:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    description:
      "If WanderInn cancels your tour due to insufficient group size or operational reasons (not Force Majeure), you have the choice of a full cash refund, a date change at no extra cost, or a Credit Note.",
    steps: [
      "We notify you at least 10 days before departure wherever possible",
      "Choose from: full refund, free date change, or credit note",
      "Refunds processed within 7–10 business days",
      "We bear no liability for independently booked flights or accommodation",
    ],
  },
  {
    icon: Shield,
    title: "Travel Insurance Claim",
    badge: "Insurance Covers",
    badgeClass:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
    description:
      "If you purchased our optional Travel Insurance add-on (₹799/person), cancellations for covered reasons — medical emergencies, death of immediate family, jury duty, or travel disruptions — may be fully reimbursed through the insurer.",
    steps: [
      "Notify us and the insurer as soon as possible",
      "Submit required documentation (doctor's certificate, etc.)",
      "Insurer processes the claim directly — typically 10–15 business days",
      "WanderInn provides supporting booking documents on request",
    ],
  },
  {
    icon: CalendarDays,
    title: "Date Change Request",
    badge: "Amendment Fee",
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    description:
      "Want to postpone rather than cancel? You can change your travel date up to 15 days before departure for an amendment fee of ₹500/person plus any cost difference from the new dates.",
    steps: [
      "Submit date change request in writing at least 15 days before departure",
      "Amendment fee: ₹500 per person",
      "Any price difference for new dates is payable immediately",
      "Date changes within 7 days of departure are not permitted",
    ],
  },
];

const FAQS = [
  {
    q: "How do I submit a cancellation request?",
    a: 'All cancellation requests must be submitted in writing by email to cancellations@wanderinn.com or using the form on this page. Please include your booking reference number, full name, and reason for cancellation. Verbal requests (phone, WhatsApp) are not accepted as the official cancellation date.',
  },
  {
    q: "When does the cancellation clock start?",
    a: "The cancellation date is the date on which your written request is received by WanderInn — not the date you sent it. We recommend emailing us and following up with a WhatsApp message to ensure receipt. You will receive a written acknowledgement within 2 business hours (during working hours).",
  },
  {
    q: "How long does a refund take to reach my account?",
    a: "Refunds are processed within 7–10 business days of the cancellation confirmation email. Depending on your bank or payment method, the credit may appear 3–5 business days after processing. Credit/debit card refunds may take up to 10 business days to reflect, depending on the issuing bank.",
  },
  {
    q: "What if I paid by UPI or NEFT? Can I get a refund to a different account?",
    a: "Refunds are always issued to the original payment method. For UPI payments, the refund is credited to the UPI-linked bank account. For NEFT, we will issue a bank transfer to the account you provide. We cannot issue refunds to a different account or person than the original payer.",
  },
  {
    q: "Can I cancel just one person from a group booking?",
    a: "Yes. You can cancel individual travellers from a group booking. The applicable refund will be calculated based on per-person tour cost and the cancellation window. The remaining group's booking will continue unaffected. Note that per-person pricing may change if the group size falls below a minimum threshold.",
  },
  {
    q: "What happens if I fall ill right before the trip?",
    a: "Without travel insurance, a last-minute medical cancellation falls under our standard policy (< 7 days = no refund). If you purchased our Travel Insurance add-on, a documented medical emergency may qualify for a full reimbursement from the insurer. We recommend buying travel insurance at the time of booking — adding it after the fact does not cover pre-existing conditions or known events.",
  },
  {
    q: "Are add-ons (insurance, airport pickup) also refunded?",
    a: "Add-ons are refunded at the same rate as the main tour package, except Travel Insurance premiums (₹799/person), which are non-refundable once issued by the insurer, and any third-party services (e.g., flight tickets purchased on your behalf) which are subject to the third party's own cancellation policy.",
  },
];

const cancellationFormSchema = z.object({
  bookingRef: z
    .string()
    .min(6, "Enter a valid booking reference")
    .toUpperCase(),
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a 10-digit number")
    .max(10)
    .regex(/^\d+$/, "Digits only"),
  reason: z.string().min(1, "Please select a reason"),
  details: z.string().min(10, "Please provide more detail"),
});

type CancellationFormData = z.infer<typeof cancellationFormSchema>;

const CANCELLATION_REASONS = [
  { value: "personal", label: "Personal / Family reason" },
  { value: "medical", label: "Medical emergency" },
  { value: "work", label: "Work commitment" },
  { value: "travel-disruption", label: "Travel / flight disruption" },
  { value: "natural-disaster", label: "Natural disaster / Force Majeure" },
  { value: "financial", label: "Financial constraint" },
  { value: "date-change", label: "I want to change dates instead" },
  { value: "other", label: "Other" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function CancellationPolicyPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <RefundTiersSection />
      <VisualTimelineSection />
      <ScenariosSection />
      <FAQSection />
      <CancellationFormSection />
      <CTAStrip />

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            buttonVariants({ size: "sm" }),
            "fixed bottom-6 right-6 z-50 gap-1.5 shadow-lg"
          )}
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
          Top
        </button>
      )}
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="border-b bg-muted/30 py-14 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <XCircle size={18} aria-hidden="true" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Cancellation Policy
              </h1>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              We understand that plans change. Our policy is designed to be as
              fair as possible — the earlier you cancel, the more you get back.
              Here's everything you need to know.
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground shrink-0 space-y-1">
            <p>
              Last updated:{" "}
              <span className="font-semibold text-foreground">{LAST_UPDATED}</span>
            </p>
            <Badge variant="secondary">Version 2.4</Badge>
          </div>
        </div>

        {/* Quick navigation pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { label: "Refund Schedule", href: "#refund-tiers" },
            { label: "Timeline", href: "#timeline" },
            { label: "Special Scenarios", href: "#scenarios" },
            { label: "FAQs", href: "#faqs" },
            { label: "Submit Request", href: "#request-form" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xs gap-1.5 h-8",
              })}
            >
              {label}
              <ArrowRight size={11} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── Refund Tiers ─────────────────────────────────────────────────────────────

function RefundTiersSection() {
  return (
    <section id="refund-tiers" className="py-16 px-4 scroll-mt-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Refund Schedule
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How much will I get back?
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Refund percentage is calculated on the{" "}
            <span className="font-semibold text-foreground">
              total tour cost paid
            </span>
            , not just the balance. The earlier you cancel, the more you
            recover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {REFUND_TIERS.map((tier) => (
            <RefundTierCard key={tier.window} tier={tier} />
          ))}
        </div>

        {/* Example callout */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-950/20 p-4">
          <Info
            size={16}
            className="shrink-0 text-blue-600 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Note on the 50% deposit:</span> The
            deposit you pay at booking is non-refundable in all cases. However,
            our refund percentages above are calculated on the{" "}
            <em>total tour cost</em> — so a 90% refund means WanderInn absorbs
            the gap to still give you back 90% overall.
          </p>
        </div>
      </div>
    </section>
  );
}

function RefundTierCard({ tier }: { tier: (typeof REFUND_TIERS)[0] }) {
  return (
    <Card className="border-border/60 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Colour bar */}
      <div className={cn("h-1.5 w-full", tier.color)} aria-hidden="true" />

      <CardContent className="pt-4 pb-5 flex flex-col flex-1 gap-3">
        {/* Window badge */}
        <Badge
          variant="outline"
          className={cn("text-xs self-start font-semibold", tier.badgeClass)}
        >
          {tier.window}
        </Badge>

        {/* Refund percentage */}
        <div>
          <p
            className={cn(
              "text-3xl font-bold tabular-nums tracking-tight",
              tier.textColor
            )}
          >
            {tier.refundPct}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            of total tour cost
          </p>
        </div>

        <Separator />

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {tier.description}
        </p>

        {/* Example calc */}
        <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
          <p className="font-semibold text-foreground text-xs">Example</p>
          <div className="flex justify-between text-muted-foreground">
            <span>Tour cost</span>
            <span className="tabular-nums">
              ₹{tier.example.total.toLocaleString("en-IN")}
            </span>
          </div>
          <div
            className={cn(
              "flex justify-between font-semibold",
              tier.textColor
            )}
          >
            <span>You get back</span>
            <span className="tabular-nums">
              ₹{tier.example.refund.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Forfeited</span>
            <span className="tabular-nums">
              ₹{tier.example.forfeited.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Visual Timeline ──────────────────────────────────────────────────────────

function VisualTimelineSection() {
  return (
    <section
      id="timeline"
      className="py-16 px-4 bg-muted/20 border-t border-b scroll-mt-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Visual Timeline
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cancellation windows at a glance
          </h2>
        </div>

        {/* Timeline bar */}
        <div className="relative mb-4">
          <div className="flex rounded-full overflow-hidden h-8" role="img" aria-label="Cancellation refund timeline bar">
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "40%" }}
              title="30+ days: 90% refund"
            >
              90%
            </div>
            <div
              className="bg-amber-400 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "20%" }}
              title="15–29 days: 50% refund"
            >
              50%
            </div>
            <div
              className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "15%" }}
              title="7–14 days: 25% refund"
            >
              25%
            </div>
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "25%" }}
              title="< 7 days: 0% refund"
            >
              0%
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex text-xs text-muted-foreground justify-between px-1 mb-8">
          <span>Booking date</span>
          <span>30 days before</span>
          <span>15 days</span>
          <span>7 days</span>
          <span className="text-right">Travel date →</span>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          {[
            {
              step: "01",
              icon: Mail,
              title: "Submit written request",
              description:
                "Email cancellations@wanderinn.com with your booking reference. The date of receipt is your official cancellation date.",
            },
            {
              step: "02",
              icon: CheckCircle2,
              title: "We confirm & calculate",
              description:
                "We acknowledge within 2 business hours and send you a cancellation confirmation with the exact refund amount.",
            },
            {
              step: "03",
              icon: CreditCard,
              title: "Refund processed",
              description:
                "Refund is processed within 7–10 business days to your original payment method. Bank timelines may add 3–5 days.",
            },
          ].map(({ step, icon: Icon, title, description }) => (
            <div key={step} className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                {step}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

function ScenariosSection() {
  return (
    <section id="scenarios" className="py-16 px-4 scroll-mt-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Special Situations
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Not all cancellations are the same.
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Certain circumstances are handled differently from our standard
            schedule. Here's how we handle them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card
                key={scenario.title}
                className="border-border/60 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{scenario.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs shrink-0", scenario.badgeClass)}
                        >
                          {scenario.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Separator className="mb-3" />
                  <p className="text-xs font-semibold text-foreground mb-2">
                    How it works:
                  </p>
                  <ol className="space-y-1.5">
                    {scenario.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-muted-foreground"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Partial cancellation note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
          <BadgePercent
            size={16}
            className="shrink-0 text-primary mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold mb-0.5">
              Partial group cancellations
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you need to remove individual travellers from a group booking,
              each person's refund is calculated at the per-person tour cost
              using the standard schedule above. The remaining group continues
              unaffected. If dropping a traveller brings the group below a
              minimum size threshold, per-person pricing may be recalculated for
              the remaining group.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faqs"
      className="py-16 px-4 bg-muted/20 border-t scroll-mt-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Common Questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cancellation FAQs
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border transition-colors",
                open === i
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/60 bg-background hover:border-primary/20"
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
                aria-expanded={open === i}
              >
                <span
                  className={cn(
                    "font-semibold text-sm leading-snug",
                    open === i ? "text-primary" : "text-foreground"
                  )}
                >
                  {faq.q}
                </span>
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    open === i ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {open === i ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  open === i ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-4 pb-4">
                  <Separator className="mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cancellation Request Form ────────────────────────────────────────────────

function CancellationFormSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CancellationFormData>({
    resolver: zodResolver(cancellationFormSchema),
  });

  const onSubmit = async (_data: CancellationFormData) => {
    // await submitCancellationRequest({ data: _data });
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitted(true);
  };

  return (
    <section
      id="request-form"
      className="py-16 px-4 border-t scroll-mt-20"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Submit a Request
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cancel your booking
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Fill in the form below. Your cancellation date is the date we{" "}
            <span className="font-semibold text-foreground">receive</span> this
            request. You'll get a confirmation email within 2 business hours.
          </p>
        </div>

        {submitted ? (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/10">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                <CheckCircle2
                  size={32}
                  className="text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Cancellation request received
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  We've noted today,{" "}
                  <span className="font-semibold text-foreground">
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  , as your official cancellation date. A confirmation with
                  your refund amount will be sent to your email within 2
                  business hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Submit another request
                </button>
                <Link
                  to="/bookings"
                  className={buttonVariants({
                    size: "sm",
                    className: "gap-2",
                  })}
                >
                  My Bookings
                  <ArrowRight size={13} />
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Booking ref + name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bookingRef">
                  Booking Reference{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bookingRef"
                  placeholder="e.g. WI4F9A2K"
                  {...register("bookingRef")}
                  className={cn(
                    "font-mono uppercase",
                    errors.bookingRef && "border-destructive"
                  )}
                />
                {errors.bookingRef && (
                  <p className="text-xs text-destructive">
                    {errors.bookingRef.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="can-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="can-name"
                  placeholder="As on booking"
                  {...register("name")}
                  className={cn(errors.name && "border-destructive")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="can-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="can-email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="can-phone">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                    +91
                  </span>
                  <Input
                    id="can-phone"
                    type="tel"
                    placeholder="98765 43210"
                    {...register("phone")}
                    maxLength={10}
                    className={cn(
                      "pl-12",
                      errors.phone && "border-destructive"
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <Label htmlFor="can-reason">
                Reason for Cancellation{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(v) =>
                  setValue("reason", v, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="can-reason"
                  className={cn(errors.reason && "border-destructive")}
                >
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reason && (
                <p className="text-xs text-destructive">
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="space-y-1.5">
              <Label htmlFor="can-details">
                Additional Details{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="can-details"
                placeholder="Please provide any additional context — e.g. which travellers to cancel (if partial), supporting documentation you can provide, or whether you'd prefer a date change over a refund..."
                {...register("details")}
                rows={4}
                className={cn(
                  "resize-none text-sm",
                  errors.details && "border-destructive"
                )}
                maxLength={800}
              />
              {errors.details ? (
                <p className="text-xs text-destructive">
                  {errors.details.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground text-right">
                  {watch("details")?.length ?? 0}/800
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 p-3.5">
              <AlertTriangle
                size={14}
                className="shrink-0 text-amber-600 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                By submitting this form, you acknowledge that today's date (
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                ) will be used as your official cancellation date and that the
                refund will be calculated accordingly.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              variant="destructive"
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={15} />
                  Submit Cancellation Request
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── CTA Strip ────────────────────────────────────────────────────────────────

function CTAStrip() {
  return (
    <section className="py-14 px-4 border-t bg-muted/20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "Need to change dates instead?",
              description:
                "Date changes cost ₹500/person + any price difference and must be requested 15+ days before travel.",
              action: "/contact",
              actionLabel: "Request date change",
            },
            {
              icon: HelpCircle,
              title: "Not sure about cancelling?",
              description:
                "Talk to our team — we may be able to hold your booking, find a replacement traveller, or suggest alternatives.",
              action: "/contact",
              actionLabel: "Talk to us",
            },
            {
              icon: Shield,
              title: "Protect future bookings",
              description:
                "Add Travel Insurance (₹799/person) at checkout to protect against unexpected cancellations.",
              action: "/tours",
              actionLabel: "Browse tours",
            },
          ].map(({ icon: Icon, title, description, action, actionLabel }) => (
            <div
              key={title}
              className="flex flex-col gap-3 p-5 rounded-xl border border-border/60 bg-background"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={16} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
              <Link
                to={action}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "self-start gap-1.5 text-xs",
                })}
              >
                {actionLabel}
                <ArrowRight size={11} />
              </Link>
            </div>
          ))}
        </div>

        {/* Direct contact */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Prefer to cancel by phone or email?</span>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 text-primary hover:underline underline-offset-2"
          >
            <Phone size={13} />
            +91 98765 43210
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="mailto:cancellations@wanderinn.com"
            className="flex items-center gap-1.5 text-primary hover:underline underline-offset-2"
          >
            <Mail size={13} />
            cancellations@wanderinn.com
          </a>
        </div>
      </div>
    </section>
  );
}
