import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  RefreshCw,
  Mail,
  FileText,
  Server,
  Trash2,
  Bell,
  ChevronRight,
  ArrowUp,
  Info,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/privacy/")({
  component: PrivacyPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "1 June 2026";
const EFFECTIVE_DATE = "1 June 2026";
const COMPANY_NAME = "WanderInn Tours Pvt. Ltd.";
const DPO_EMAIL = "privacy@wanderinn.com";
const COMPANY_ADDRESS =
  "304, Sunshine Tower, Nariman Point, Mumbai — 400021, Maharashtra, India";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "data-collected", label: "Data We Collect", icon: Database },
  { id: "how-we-use", label: "How We Use Data", icon: Eye },
  { id: "sharing", label: "Sharing & Disclosure", icon: Share2 },
  { id: "retention", label: "Data Retention", icon: Server },
  { id: "security", label: "Security", icon: Lock },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "third-party", label: "Third-Party Links", icon: Globe },
  { id: "children", label: "Children's Privacy", icon: FileText },
  { id: "updates", label: "Policy Updates", icon: RefreshCw },
  { id: "contact", label: "Contact & DPO", icon: Mail },
];

const DATA_CATEGORIES = [
  {
    category: "Identity & Contact",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    items: [
      "Full name and date of birth",
      "Email address and mobile number",
      "Home / billing address",
      "Government-issued ID numbers (Aadhaar, PAN — for domestic travel regulations)",
      "Passport details (where required for specific tours)",
    ],
    basis: "Contract performance; Legal obligation",
  },
  {
    category: "Booking & Transaction",
    icon: FileText,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    items: [
      "Tour package, travel dates, and group details",
      "Payment method (card last 4 digits, UPI ID — not full card numbers)",
      "Transaction IDs and payment status",
      "Booking history and cancellation records",
      "Special requests and dietary / accessibility preferences",
    ],
    basis: "Contract performance; Legitimate interest",
  },
  {
    category: "Usage & Technical",
    icon: Server,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    items: [
      "IP address and browser type",
      "Device identifiers and operating system",
      "Pages visited, time spent, and click patterns",
      "Referral source (how you found our website)",
      "Session duration and search queries on the site",
    ],
    basis: "Legitimate interest; Consent (for analytics cookies)",
  },
  {
    category: "Communications",
    icon: Mail,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    items: [
      "Emails, WhatsApp messages, and chat transcripts with our team",
      "Feedback forms and customer support ticket content",
      "Survey responses and NPS ratings",
      "Reviews and testimonials you submit",
    ],
    basis: "Legitimate interest; Consent",
  },
];

const USE_PURPOSES = [
  {
    icon: CheckCircle2,
    title: "Fulfilling your booking",
    description:
      "Processing your reservation, confirming with hotels and guides, sending itinerary documents, and managing your travel arrangements end-to-end.",
  },
  {
    icon: Bell,
    title: "Communications & alerts",
    description:
      "Sending booking confirmations, payment receipts, pre-trip reminders, real-time travel alerts, and post-trip follow-ups.",
  },
  {
    icon: RefreshCw,
    title: "Customer support",
    description:
      "Resolving queries, processing cancellations and amendments, handling complaints, and maintaining support ticket history.",
  },
  {
    icon: Shield,
    title: "Fraud prevention & security",
    description:
      "Detecting and preventing fraudulent transactions, verifying identity for high-value bookings, and protecting against unauthorized account access.",
  },
  {
    icon: Eye,
    title: "Improving our services",
    description:
      "Analysing booking patterns and website usage (in aggregated, anonymised form) to improve tour design, pricing, and the website experience.",
  },
  {
    icon: Mail,
    title: "Marketing (with consent)",
    description:
      "Sending newsletters, destination guides, promotional offers, and new tour announcements — only if you have opted in. You can withdraw consent at any time.",
  },
  {
    icon: FileText,
    title: "Legal & regulatory compliance",
    description:
      "Maintaining records required under GST, the Companies Act, DPDPA 2023, and other applicable laws. Sharing data with government authorities when legally mandated.",
  },
];

const THIRD_PARTY_CATEGORIES = [
  {
    category: "Hotels & Accommodation",
    purpose: "Confirm reservations and share guest details as required",
    data: "Name, contact, ID proof, dietary/accessibility preferences",
    retention: "Duration of stay + 1 year",
  },
  {
    category: "Transport Operators",
    purpose: "Arrange airport pickups, inter-city transfers, vehicle bookings",
    data: "Name, pickup/drop location, flight details",
    retention: "Duration of tour",
  },
  {
    category: "Tour Guides & Activity Providers",
    purpose: "Coordinate itinerary execution",
    data: "Name, group size, special requirements",
    retention: "Duration of tour",
  },
  {
    category: "Payment Gateways (Razorpay)",
    purpose: "Process and verify payments securely",
    data: "Transaction amount, payment method type, device metadata",
    retention: "Per Razorpay's policy (typically 5 years)",
  },
  {
    category: "Insurance Providers",
    purpose: "Issue travel insurance policies (if add-on purchased)",
    data: "Name, DOB, contact, booking details",
    retention: "Policy term + 7 years",
  },
  {
    category: "Analytics (Google Analytics 4)",
    purpose: "Website usage analytics",
    data: "Anonymised IP, pages visited, session data",
    retention: "14 months (GA4 default)",
  },
  {
    category: "Email & SMS Platform (Resend / Twilio)",
    purpose: "Transactional emails and SMS notifications",
    data: "Email address, phone number, booking reference",
    retention: "90 days of logs",
  },
  {
    category: "Cloud Infrastructure (AWS / Cloudflare)",
    purpose: "Hosting, CDN, and DDoS protection",
    data: "All data stored on our servers",
    retention: "Per our own retention schedule",
  },
];

const YOUR_RIGHTS = [
  {
    icon: Eye,
    title: "Right to Access",
    description:
      "Request a copy of all personal data we hold about you. We will respond within 30 days.",
    action: "Email privacy@wanderinn.com with 'Data Access Request'",
  },
  {
    icon: RefreshCw,
    title: "Right to Correction",
    description:
      "Ask us to correct inaccurate or incomplete personal data. We will update records within 7 business days.",
    action: "Log in to your account or email us",
  },
  {
    icon: Trash2,
    title: "Right to Erasure",
    description:
      "Request deletion of your personal data. We will comply unless retention is required for legal or contractual obligations.",
    action: "Email privacy@wanderinn.com with 'Erasure Request'",
  },
  {
    icon: Lock,
    title: "Right to Restrict Processing",
    description:
      "Ask us to stop processing your data for certain purposes (e.g., marketing) while you contest its accuracy or our legal basis.",
    action: "Email us specifying which processing to restrict",
  },
  {
    icon: Share2,
    title: "Right to Data Portability",
    description:
      "Request your data in a structured, machine-readable format (JSON or CSV) to transfer to another service.",
    action: "Email privacy@wanderinn.com with 'Portability Request'",
  },
  {
    icon: Bell,
    title: "Right to Withdraw Consent",
    description:
      "Withdraw consent for marketing communications at any time by clicking 'Unsubscribe' in any email or contacting us.",
    action: "Unsubscribe link in emails or contact us",
  },
  {
    icon: Shield,
    title: "Right to Grievance Redressal",
    description:
      "Lodge a complaint with our Data Protection Officer or directly with the Data Protection Board of India under DPDPA 2023.",
    action: "Email privacy@wanderinn.com or contact the DPB",
  },
];

const COOKIE_TYPES = [
  {
    type: "Strictly Necessary",
    canOptOut: false,
    purpose:
      "Session management, authentication, CSRF protection, and booking flow state. Cannot be disabled — the site will not function without these.",
    examples: "Session token, CSRF token, cookie consent preference",
    duration: "Session / 30 days",
  },
  {
    type: "Functional",
    canOptOut: true,
    purpose:
      "Remembering your preferences such as dark/light mode, language, recently viewed tours, and search filters.",
    examples: "theme, locale, recent-tours",
    duration: "1 year",
  },
  {
    type: "Analytics",
    canOptOut: true,
    purpose:
      "Understanding how visitors use the website using anonymised, aggregated data. We use Google Analytics 4 with IP anonymisation enabled.",
    examples: "_ga, _gid, _ga_XXXXXXXX",
    duration: "14 months (GA4)",
  },
  {
    type: "Marketing",
    canOptOut: true,
    purpose:
      "Tracking conversions and serving relevant ads on third-party platforms. We use Google Ads conversion tracking and Meta Pixel — only with your consent.",
    examples: "_fbp, _gcl_au, ads/ga-audiences",
    duration: "90 days – 2 years",
  },
];

const RETENTION_SCHEDULE = [
  {
    dataType: "Booking records & invoices",
    retention: "7 years",
    reason: "GST, Companies Act, and tax audit requirements",
  },
  {
    dataType: "Customer account data",
    retention: "3 years after last login or booking",
    reason:
      "Legitimate interest in maintaining account history; DPDPA 2023 guidelines",
  },
  {
    dataType: "Payment transaction records",
    retention: "7 years",
    reason: "RBI guidelines and financial audit requirements",
  },
  {
    dataType: "Support & complaint records",
    retention: "3 years",
    reason:
      "Dispute resolution, legal claims, Consumer Protection Act compliance",
  },
  {
    dataType: "Marketing consent records",
    retention: "Until consent withdrawn + 1 year",
    reason:
      "Evidence of consent under DPDPA 2023; unsubscribe record maintenance",
  },
  {
    dataType: "Website analytics data",
    retention: "14 months (anonymised)",
    reason: "GA4 default; anonymised so DPDPA personal data rules do not apply",
  },
  {
    dataType: "CCTV footage (office premises)",
    retention: "30 days",
    reason: "Security purposes; overwritten automatically",
  },
  {
    dataType: "Job applicant data",
    retention: "6 months post-rejection",
    reason:
      "Potential re-engagement; deleted thereafter unless applicant requests retention",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className="border-b bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Shield size={20} className="text-primary" aria-hidden="true" />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                {COMPANY_NAME} is committed to protecting your personal data.
                This policy explains what we collect, why we collect it, how we
                use it, and the rights you have under the{" "}
                <span className="font-medium text-foreground">
                  Digital Personal Data Protection Act, 2023 (DPDPA)
                </span>{" "}
                and other applicable Indian laws.
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground shrink-0 space-y-1">
              <p>
                Last updated:{" "}
                <span className="font-semibold text-foreground">
                  {LAST_UPDATED}
                </span>
              </p>
              <p>
                Effective from:{" "}
                <span className="font-semibold text-foreground">
                  {EFFECTIVE_DATE}
                </span>
              </p>
              <Badge variant="secondary" className="mt-1">
                Version 2.0
              </Badge>
            </div>
          </div>

          {/* DPDPA compliance banner */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Info
              size={16}
              className="shrink-0 text-primary mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground/80">
              This policy is compliant with the{" "}
              <span className="font-semibold">
                Digital Personal Data Protection Act, 2023 (DPDPA)
              </span>
              , the{" "}
              <span className="font-semibold">
                Information Technology Act, 2000
              </span>
              , and the{" "}
              <span className="font-semibold">
                IT (Reasonable Security Practices) Rules, 2011
              </span>
              . Questions? Email our Data Protection Officer at{" "}
              <a
                href={`mailto:${DPO_EMAIL}`}
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                {DPO_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex gap-10 items-start">
          {/* ── Sticky Sidebar ──────────────────────────────────────── */}
          <aside
            className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-20"
            aria-label="Privacy policy navigation"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Contents
            </p>
            <nav>
              <ul className="space-y-0.5" role="list">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors",
                        activeSection === id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      aria-current={
                        activeSection === id ? "location" : undefined
                      }
                    >
                      <Icon size={13} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{label}</span>
                      {activeSection === id && (
                        <ChevronRight
                          size={12}
                          className="ml-auto shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator className="my-4" />
            <div className="px-2 space-y-2">
              <Link
                to="/terms"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full text-xs gap-1.5 justify-start",
                })}
              >
                <FileText size={12} />
                Terms & Conditions
              </Link>
              <Link
                to="/contact"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "w-full text-xs gap-1.5 justify-start",
                })}
              >
                <Mail size={12} />
                Contact DPO
              </Link>
            </div>
          </aside>

          {/* ── Content ─────────────────────────────────────────────── */}
          <article className="flex-1 min-w-0 space-y-14">

            {/* 1. Overview */}
            <PolicySection id="overview" icon={Shield} title="1. Overview">
              <p>
                {COMPANY_NAME} ("we", "us", "our") operates the website at
                wanderinn.com and provides domestic tour packages across India.
                In doing so, we collect and process personal data about our
                customers, website visitors, and prospective travellers.
              </p>
              <p>
                This Privacy Policy describes our practices in relation to
                personal data, including what data we collect, the legal basis
                on which we process it, how we share it, how long we retain it,
                and the rights available to you as a Data Principal under the
                Digital Personal Data Protection Act, 2023 (DPDPA).
              </p>
              <p>
                By using our Website or making a booking, you acknowledge that
                you have read and understood this Privacy Policy. Where
                processing is based on your consent, you have the right to
                withdraw that consent at any time without affecting the
                lawfulness of processing carried out prior to withdrawal.
              </p>

              {/* At-a-glance highlights */}
              <div className="grid sm:grid-cols-3 gap-3 mt-2 not-prose">
                {[
                  {
                    icon: Lock,
                    title: "We don't sell your data",
                    desc: "Your personal data is never sold to third parties for advertising.",
                  },
                  {
                    icon: Shield,
                    title: "DPDPA 2023 compliant",
                    desc: "We follow India's latest data protection framework.",
                  },
                  {
                    icon: UserCheck,
                    title: "You're in control",
                    desc: "Access, correct, or delete your data — anytime.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="border-border/60">
                    <CardContent className="pt-4 pb-4 space-y-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={14} aria-hidden="true" />
                      </div>
                      <p className="font-semibold text-xs">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </PolicySection>

            {/* 2. Data Collected */}
            <PolicySection
              id="data-collected"
              icon={Database}
              title="2. Personal Data We Collect"
            >
              <p>
                We collect personal data only to the extent necessary for the
                purposes described in this policy. The categories of data we
                collect are set out below, along with the legal basis for
                processing under DPDPA 2023.
              </p>

              <div className="space-y-4 not-prose">
                {DATA_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card key={cat.category} className="border-border/60">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg",
                              cat.color
                            )}
                          >
                            <Icon size={14} aria-hidden="true" />
                          </div>
                          <p className="font-bold text-sm">{cat.category}</p>
                          <Badge
                            variant="outline"
                            className="ml-auto text-xs font-normal"
                          >
                            {cat.basis}
                          </Badge>
                        </div>
                        <ul className="space-y-1.5">
                          {cat.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <span
                                className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p>
                We do not collect sensitive personal data such as biometric
                information, racial or ethnic origin, political opinions,
                religious beliefs, or health data — except where a traveller
                voluntarily discloses dietary or medical information as part of
                a special request, in which case it is used solely for tour
                fulfilment.
              </p>
            </PolicySection>

            {/* 3. How We Use Data */}
            <PolicySection
              id="how-we-use"
              icon={Eye}
              title="3. How We Use Your Data"
            >
              <p>
                We process personal data only for specific, legitimate purposes.
                We do not use your data in ways that are incompatible with the
                purpose for which it was collected. The table below outlines our
                processing purposes:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 not-prose">
                {USE_PURPOSES.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-xl border border-border/60 p-3.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={13} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs mb-0.5">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p>
                Where we rely on{" "}
                <span className="font-semibold text-foreground">consent</span>{" "}
                as the legal basis for processing (e.g., marketing emails), you
                may withdraw consent at any time. Withdrawal does not affect
                processing carried out before withdrawal. We will continue to
                send transactional communications (booking confirmations,
                payment receipts, trip reminders) regardless of marketing
                consent, as these are necessary for contract performance.
              </p>
            </PolicySection>

            {/* 4. Sharing & Disclosure */}
            <PolicySection
              id="sharing"
              icon={Share2}
              title="4. Sharing &amp; Disclosure"
            >
              <p>
                We do not sell, rent, or trade your personal data to any third
                party. We share data only with the following categories of
                recipients, and only to the extent strictly necessary:
              </p>

              <div className="not-prose overflow-x-auto rounded-xl border border-border/60 mt-3">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      {[
                        "Recipient",
                        "Purpose",
                        "Data Shared",
                        "Retention by Recipient",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {THIRD_PARTY_CATEGORIES.map((row) => (
                      <tr
                        key={row.category}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs font-medium text-foreground align-top">
                          {row.category}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground align-top">
                          {row.purpose}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground align-top">
                          {row.data}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground align-top whitespace-nowrap">
                          {row.retention}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                We may also disclose personal data to government authorities,
                law enforcement, or regulators where required by law or a valid
                court order. In such cases, we will notify the affected
                individual unless prohibited from doing so by law.
              </p>

              <p>
                All third-party service providers we engage are contractually
                required to process personal data only in accordance with our
                instructions and to implement appropriate technical and
                organisational security measures.
              </p>
            </PolicySection>

            {/* 5. Retention */}
            <PolicySection
              id="retention"
              icon={Server}
              title="5. Data Retention"
            >
              <p>
                We retain personal data only for as long as necessary for the
                purposes for which it was collected, or as required by
                applicable law. Our retention schedule is set out below:
              </p>

              <div className="not-prose overflow-x-auto rounded-xl border border-border/60 mt-3">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      {["Data Type", "Retention Period", "Legal Basis"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-foreground"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {RETENTION_SCHEDULE.map((row) => (
                      <tr
                        key={row.dataType}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs font-medium text-foreground align-top">
                          {row.dataType}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground align-top whitespace-nowrap font-semibold">
                          {row.retention}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground align-top">
                          {row.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                Upon expiry of the applicable retention period, personal data is
                securely deleted or irreversibly anonymised. Where data must be
                retained for legal reasons beyond the primary purpose, it is
                archived and access-restricted.
              </p>
            </PolicySection>

            {/* 6. Security */}
            <PolicySection id="security" icon={Lock} title="6. Security">
              <p>
                We implement appropriate technical and organisational measures
                to protect personal data against unauthorised access,
                disclosure, alteration, or destruction. Our security practices
                include:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 not-prose">
                {[
                  {
                    title: "Encryption in transit",
                    desc: "All data transmitted between your browser and our servers is encrypted using TLS 1.3. We enforce HTTPS sitewide with HSTS.",
                  },
                  {
                    title: "Encryption at rest",
                    desc: "Databases containing personal data are encrypted at rest using AES-256. Backups are also encrypted.",
                  },
                  {
                    title: "Access controls",
                    desc: "Role-based access control (RBAC) limits access to personal data on a strict need-to-know basis. All access is logged and audited.",
                  },
                  {
                    title: "PCI-DSS compliance",
                    desc: "We do not store full card numbers. Payment processing is handled by Razorpay, which is PCI-DSS Level 1 certified.",
                  },
                  {
                    title: "Security testing",
                    desc: "We conduct periodic vulnerability assessments and penetration testing, and engage independent security auditors annually.",
                  },
                  {
                    title: "Incident response",
                    desc: "We maintain a documented incident response plan. In the event of a data breach affecting your rights, we will notify you and the Data Protection Board within the timeframes prescribed by DPDPA 2023.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-2.5 rounded-xl border border-border/60 p-3.5"
                  >
                    <Lock
                      size={13}
                      className="shrink-0 text-primary mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-xs mb-0.5">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p>
                Despite our best efforts, no security system is impenetrable. If
                you believe your account or personal data has been compromised,
                please contact us immediately at{" "}
                <a
                  href="mailto:security@wanderinn.com"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  security@wanderinn.com
                </a>
                .
              </p>
            </PolicySection>

            {/* 7. Your Rights */}
            <PolicySection
              id="your-rights"
              icon={UserCheck}
              title="7. Your Rights as a Data Principal"
            >
              <p>
                Under the Digital Personal Data Protection Act, 2023 (DPDPA),
                you have the following rights as a Data Principal (i.e., the
                individual whose personal data we process). We will respond to
                all verified requests within 30 days.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 not-prose">
                {YOUR_RIGHTS.map((right) => {
                  const Icon = right.icon;
                  return (
                    <Card key={right.title} className="border-border/60">
                      <CardContent className="pt-4 pb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon size={13} aria-hidden="true" />
                          </div>
                          <p className="font-bold text-xs">{right.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {right.description}
                        </p>
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <p className="text-xs text-foreground font-medium">
                            How to exercise:{" "}
                            <span className="font-normal text-muted-foreground">
                              {right.action}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p>
                To protect your privacy, we may need to verify your identity
                before responding to a data rights request. We will not charge
                a fee for exercising your rights unless the request is manifestly
                unfounded or excessive, in which case we may charge a reasonable
                fee or decline to act.
              </p>
            </PolicySection>

            {/* 8. Cookies */}
            <PolicySection id="cookies" icon={Cookie} title="8. Cookies">
              <p>
                Our website uses cookies and similar tracking technologies to
                provide a functional, personalised, and secure browsing
                experience. A cookie is a small text file stored on your device
                by your browser. We use four categories of cookies:
              </p>

              <div className="space-y-3 not-prose">
                {COOKIE_TYPES.map((cookie) => (
                  <div
                    key={cookie.type}
                    className="rounded-xl border border-border/60 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-bold text-sm">{cookie.type}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          cookie.canOptOut
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400"
                            : "border-green-200 bg-green-50 text-green-700 dark:border-green-800/40 dark:bg-green-950/20 dark:text-green-400"
                        )}
                      >
                        {cookie.canOptOut ? "Opt-out available" : "Always active"}
                      </Badge>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {cookie.duration}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {cookie.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Examples:{" "}
                      </span>
                      <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">
                        {cookie.examples}
                      </code>
                    </p>
                  </div>
                ))}
              </div>

              <p>
                You can manage cookie preferences at any time via the Cookie
                Settings banner displayed on your first visit, or by adjusting
                your browser settings to block or delete cookies. Note that
                disabling strictly necessary cookies will prevent core website
                functionality including the booking flow.
              </p>
            </PolicySection>

            {/* 9. Third-Party Links */}
            <PolicySection
              id="third-party"
              icon={Globe}
              title="9. Third-Party Links &amp; Embeds"
            >
              <p>
                Our website may contain links to third-party websites, social
                media platforms, and embedded content (such as Google Maps and
                YouTube travel videos). Clicking on these links or interacting
                with embedded content may result in those third parties
                collecting data about you.
              </p>
              <p>
                We have no control over, and are not responsible for, the
                privacy practices of third-party websites. We encourage you to
                review the privacy policy of any third-party site you visit. The
                inclusion of a link or embed does not constitute our endorsement
                of that website or its privacy practices.
              </p>
              <p>
                Third-party services we embed or link to may include: Google
                Maps (for office locations and destination maps), YouTube (for
                destination preview videos), Instagram (for travel photos), and
                Razorpay (for payment processing). Each of these services has
                its own privacy policy governing data collection.
              </p>
            </PolicySection>

            {/* 10. Children's Privacy */}
            <PolicySection
              id="children"
              icon={FileText}
              title="10. Children's Privacy"
            >
              <p>
                Our Website and services are not directed at children under the
                age of 18. We do not knowingly collect personal data directly
                from children. Minors may travel with us only as part of a group
                booking made by a responsible adult (parent or legal guardian)
                who accepts our Terms and Conditions and this Privacy Policy on
                their behalf.
              </p>
              <p>
                If we become aware that we have inadvertently collected personal
                data from a child under 18 without verifiable parental consent,
                we will take steps to delete that data promptly. If you believe
                we have collected data about your child without consent, please
                contact us at{" "}
                <a
                  href={`mailto:${DPO_EMAIL}`}
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  {DPO_EMAIL}
                </a>
                .
              </p>
            </PolicySection>

            {/* 11. Policy Updates */}
            <PolicySection
              id="updates"
              icon={RefreshCw}
              title="11. Policy Updates"
            >
              <p>
                We review and update this Privacy Policy periodically to reflect
                changes in our practices, applicable laws, or regulatory
                guidance. When we make material changes, we will:
              </p>
              <ul className="space-y-2 mt-2">
                {[
                  "Post the revised policy on this page with an updated 'Last Updated' date",
                  "Send an email notification to registered customers for significant changes",
                  "Display a prominent notice on the Website for 30 days following a material change",
                  "Where required by DPDPA 2023, seek fresh consent before processing data in a new way",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                Your continued use of the Website after the effective date of a
                revised Privacy Policy constitutes your acceptance of the
                changes. We recommend reviewing this page periodically.
              </p>
            </PolicySection>

            {/* 12. Contact & DPO */}
            <PolicySection
              id="contact"
              icon={Mail}
              title="12. Contact &amp; Data Protection Officer"
            >
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or the processing of your personal data, please
                contact our Data Protection Officer:
              </p>

              <div className="not-prose rounded-xl border border-border/60 bg-muted/30 p-5 space-y-3 mt-2">
                <p className="font-bold text-sm">Data Protection Officer</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {[
                    { label: "Name", value: "Priya Nair" },
                    {
                      label: "Designation",
                      value: "Data Protection Officer",
                    },
                    { label: "Email", value: DPO_EMAIL, isEmail: true },
                    { label: "Company", value: COMPANY_NAME },
                    { label: "Address", value: COMPANY_ADDRESS },
                    {
                      label: "Response Time",
                      value:
                        "Acknowledgement within 72 hours; substantive response within 30 days",
                    },
                  ].map(({ label, value, isEmail }) => (
                    <div key={label} className="flex gap-2">
                      <span className="font-medium text-foreground w-32 shrink-0 text-xs">
                        {label}:
                      </span>
                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="text-primary underline underline-offset-2 hover:no-underline text-xs"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-xs">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p>
                If you are not satisfied with our response, you have the right
                to lodge a complaint with the{" "}
                <span className="font-semibold text-foreground">
                  Data Protection Board of India
                </span>{" "}
                established under the Digital Personal Data Protection Act,
                2023, once it becomes operational. Details of the Board and the
                complaint mechanism will be published by the Government of India
                and updated here accordingly.
              </p>

              <p>
                You may also contact the{" "}
                <span className="font-semibold text-foreground">
                  Ministry of Electronics and Information Technology (MeitY)
                </span>{" "}
                at{" "}
                <a
                  href="https://meity.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  meity.gov.in
                </a>{" "}
                for queries related to data protection law in India.
              </p>
            </PolicySection>

            {/* Footer */}
            <Separator />
            <div className="py-4 text-xs text-muted-foreground space-y-2">
              <p>
                This Privacy Policy was last updated on{" "}
                <span className="font-semibold text-foreground">
                  {LAST_UPDATED}
                </span>{" "}
                and supersedes all prior versions.
              </p>
              <p>
                © {new Date().getFullYear()} {COMPANY_NAME}. All rights
                reserved.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/terms"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Terms & Conditions
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/cancellation-policy"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Cancellation Policy
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/contact"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Contact Us
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PolicySection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 space-y-4"
      aria-labelledby={`heading-${id}`}
    >
      <div className="flex items-center gap-3 pb-2 border-b border-border/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={15} aria-hidden="true" />
        </div>
        <h2
          id={`heading-${id}`}
          className="text-lg font-bold tracking-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground">
        {children}
      </div>
    </section>
  );
}