import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scale,
  BookOpen,
  CreditCard,
  XCircle,
  RefreshCw,
  Shield,
  AlertTriangle,
  Users,
  Globe,
  FileText,
  Mail,
  ChevronRight,
  ArrowUp,
  Info,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/terms/")({
  component: TermsPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "1 June 2026";
const EFFECTIVE_DATE = "1 June 2026";
const COMPANY_NAME = "WanderInn Tours Pvt. Ltd.";
const COMPANY_EMAIL = "legal@wanderinn.com";
const COMPANY_ADDRESS =
  "304, Sunshine Tower, Nariman Point, Mumbai — 400021, Maharashtra, India";
const COMPANY_GST = "24XXXXX1234X1ZX";
const COMPANY_CIN = "U63040MH2016PTC123456";

const SECTIONS = [
  { id: "definitions", label: "Definitions", icon: BookOpen },
  { id: "acceptance", label: "Acceptance of Terms", icon: FileText },
  { id: "bookings", label: "Bookings & Payments", icon: CreditCard },
  { id: "cancellation", label: "Cancellations & Refunds", icon: XCircle },
  { id: "changes", label: "Changes to Itinerary", icon: RefreshCw },
  { id: "liability", label: "Liability & Disclaimers", icon: AlertTriangle },
  { id: "conduct", label: "Traveller Conduct", icon: Users },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
  { id: "intellectual", label: "Intellectual Property", icon: Globe },
  { id: "governing", label: "Governing Law", icon: Scale },
  { id: "contact", label: "Contact & Grievances", icon: Mail },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("definitions");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className="border-b bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Scale
                  size={20}
                  className="text-primary"
                  aria-hidden="true"
                />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Terms &amp; Conditions
                </h1>
              </div>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                Please read these terms carefully before booking any tour with{" "}
                {COMPANY_NAME}. By making a booking you agree to be bound by
                these terms.
              </p>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground text-right shrink-0">
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
              <Badge variant="secondary" className="text-xs mt-1">
                Version 3.1
              </Badge>
            </div>
          </div>

          {/* Notice banner */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 p-4">
            <Info
              size={16}
              className="shrink-0 text-amber-600 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Important:</span> These terms
              constitute a legally binding agreement between you and{" "}
              {COMPANY_NAME}. If you do not agree with any part of these terms,
              please do not proceed with a booking. For queries, contact us at{" "}
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="underline underline-offset-2 hover:no-underline"
              >
                {COMPANY_EMAIL}
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
            aria-label="Terms navigation"
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
                      onClick={() => scrollToSection(id)}
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
                      <Icon
                        size={13}
                        className="shrink-0"
                        aria-hidden="true"
                      />
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
                to="/domestic/contact"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full text-xs gap-1.5 justify-start",
                })}
              >
                <Mail size={12} />
                Questions? Contact us
              </Link>
              <Link
                to="/"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "w-full text-xs gap-1.5 justify-start",
                })}
              >
                ← Back to Home
              </Link>
            </div>
          </aside>

          {/* ── Content ─────────────────────────────────────────────── */}
          <article className="flex-1 min-w-0 prose-content space-y-14">
            {/* 1. Definitions */}
            <TermsSection
              id="definitions"
              icon={BookOpen}
              title="1. Definitions"
            >
              <p>
                In these Terms and Conditions, the following words and phrases
                shall have the meanings set out below:
              </p>
              <DefinitionTable
                rows={[
                  [
                    "\"Company\", \"We\", \"Us\", \"Our\"",
                    `${COMPANY_NAME}, a company incorporated in India under CIN ${COMPANY_CIN}, with its registered office at ${COMPANY_ADDRESS}.`,
                  ],
                  [
                    '"You", "Traveller", "Customer"',
                    "Any individual, group, or entity that browses our website, makes an inquiry, or confirms a booking with the Company.",
                  ],
                  [
                    '"Booking"',
                    "A confirmed reservation made by the Customer for any tour package, service, or accommodation offered by the Company, evidenced by a Booking Confirmation and payment of a deposit.",
                  ],
                  [
                    '"Tour Package"',
                    "Any itinerary, service, accommodation, transport, guide, activity, or combination thereof offered by the Company on its website or through its sales team.",
                  ],
                  [
                    '"Booking Confirmation"',
                    "The electronic or physical document issued by the Company to the Customer upon receipt of a deposit, confirming the booking details.",
                  ],
                  [
                    '"Travel Date"',
                    "The date on which the Customer's tour commences as specified in the Booking Confirmation.",
                  ],
                  [
                    '"Force Majeure"',
                    "Any event beyond the reasonable control of the Company, including but not limited to acts of God, natural disasters, epidemics, pandemics, war, terrorism, strikes, government-imposed travel restrictions, or closure of borders.",
                  ],
                  [
                    '"Website"',
                    "The website operated by the Company at wanderinn.com and any associated subdomains or mobile applications.",
                  ],
                ]}
              />
            </TermsSection>

            {/* 2. Acceptance */}
            <TermsSection
              id="acceptance"
              icon={FileText}
              title="2. Acceptance of Terms"
            >
              <p>
                By accessing the Website, making an inquiry, or completing a
                booking, you confirm that you have read, understood, and agree
                to be bound by these Terms and Conditions in their entirety,
                together with our{" "}
                <Link
                  to="/domestic/privacy/"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Privacy Policy
                </Link>{" "}
                and any other policies referenced herein.
              </p>
              <p>
                If you are making a booking on behalf of other travellers, you
                represent and warrant that (a) you have the authority to bind
                each traveller to these Terms, (b) you have communicated these
                Terms to each traveller in the group, and (c) each traveller
                accepts these Terms.
              </p>
              <p>
                The Company reserves the right to amend these Terms at any time
                without prior notice. The revised Terms will be posted on the
                Website with the "Last Updated" date. Your continued use of the
                Website or any booking made after the effective date of the
                revised Terms constitutes acceptance of the revised Terms.
              </p>
              <p>
                You must be at least 18 years of age to make a booking. Minors
                may travel only under the supervision of a responsible adult
                traveller who has accepted these Terms on their behalf.
              </p>
            </TermsSection>

            {/* 3. Bookings & Payments */}
            <TermsSection
              id="bookings"
              icon={CreditCard}
              title="3. Bookings &amp; Payments"
            >
              <SubHeading>3.1 Booking Process</SubHeading>
              <p>
                A booking is deemed confirmed only upon (a) the Customer's
                completion of the online booking form or written acceptance of a
                custom quotation, (b) payment of the applicable deposit as
                specified at the time of booking, and (c) issuance of a Booking
                Confirmation by the Company. Verbal reservations, inquiries, or
                expressions of interest do not constitute a confirmed booking.
              </p>

              <SubHeading>3.2 Deposit &amp; Full Payment</SubHeading>
              <p>
                A non-refundable deposit of 50% of the total tour cost is
                required at the time of booking to secure the Customer's slot.
                The remaining balance must be paid no later than 30 days prior
                to the Travel Date. For bookings made within 30 days of the
                Travel Date, the full tour cost is payable at the time of
                booking. Failure to complete the balance payment by the due date
                may result in automatic cancellation of the booking without
                refund of the deposit.
              </p>

              <SubHeading>3.3 Accepted Payment Methods</SubHeading>
              <p>
                The Company accepts payment via UPI, NEFT/RTGS bank transfer,
                credit/debit cards (Visa, Mastercard, RuPay), and select
                Buy-Now-Pay-Later platforms (Simpl, Lazypay). All payments must
                be made in Indian Rupees (INR). The Company does not accept cash
                or payments from third-party accounts.
              </p>

              <SubHeading>3.4 Pricing &amp; GST</SubHeading>
              <p>
                All prices displayed on the Website are in INR and are inclusive
                of applicable Goods and Services Tax (GST) at the rate of 5%
                under SAC 99694 (Tour Operator Services). The Company's GST
                registration number is {COMPANY_GST}. Prices are subject to
                change without notice until a Booking Confirmation has been
                issued. The price stated in your Booking Confirmation is the
                final price and will not be altered after confirmation, except
                in cases where government-mandated taxes or levies are
                introduced or increased after the date of confirmation.
              </p>

              <SubHeading>3.5 Price Inclusions &amp; Exclusions</SubHeading>
              <p>
                Each Tour Package listing specifies what is included and
                excluded. Items not listed as included — including but not
                limited to airfare, personal expenses, tips, optional
                excursions, meals not specified, visa fees (if applicable), and
                personal travel insurance — are the sole responsibility of the
                Customer.
              </p>
            </TermsSection>

            {/* 4. Cancellations & Refunds */}
            <TermsSection
              id="cancellation"
              icon={XCircle}
              title="4. Cancellations &amp; Refunds"
            >
              <SubHeading>4.1 Cancellation by the Customer</SubHeading>
              <p>
                All cancellation requests must be submitted in writing to{" "}
                <a
                  href="mailto:cancellations@wanderinn.com"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  cancellations@wanderinn.com
                </a>
                . The date of receipt of the written request shall be treated as
                the cancellation date. The following refund schedule applies:
              </p>
              <RefundTable
                rows={[
                  [
                    "30 or more days before Travel Date",
                    "90% of total tour cost",
                    "Deposit portion is non-refundable; 90% applies to the overall total",
                  ],
                  [
                    "15–29 days before Travel Date",
                    "50% of total tour cost",
                    "—",
                  ],
                  [
                    "7–14 days before Travel Date",
                    "25% of total tour cost",
                    "—",
                  ],
                  [
                    "Less than 7 days before Travel Date",
                    "No refund",
                    "100% of tour cost is forfeited",
                  ],
                  [
                    "No-show on Travel Date",
                    "No refund",
                    "Full cost forfeited",
                  ],
                ]}
              />
              <p>
                Refunds, where applicable, will be processed within 7–10
                business days of the cancellation date to the original payment
                method. Bank processing time may add an additional 3–5 business
                days.
              </p>

              <SubHeading>4.2 Force Majeure Cancellations</SubHeading>
              <p>
                If a tour is cancelled due to Force Majeure events — including
                government-issued travel advisories, natural disasters, cyclones,
                severe flooding, or epidemic/pandemic declarations — the Customer
                will be issued a full Credit Note valid for 12 months from the
                date of issue, redeemable against any WanderInn tour. Cash
                refunds for Force Majeure cancellations are at the Company's
                sole discretion and may take up to 60 days to process.
              </p>

              <SubHeading>4.3 Cancellation by the Company</SubHeading>
              <p>
                The Company reserves the right to cancel any tour if the minimum
                group size is not achieved (where applicable), for operational
                reasons, or due to Force Majeure. In such cases, the Customer
                will be offered either (a) a full refund, (b) a date change at
                no additional cost, or (c) a Credit Note of equivalent value.
                The Company's liability is limited to the tour cost paid and
                does not extend to ancillary costs such as airfare or
                accommodation booked independently by the Customer.
              </p>

              <SubHeading>4.4 Travel Insurance</SubHeading>
              <p>
                The Company strongly recommends that all Customers purchase
                comprehensive travel insurance. The Company is not liable for
                any losses arising from a Customer's failure to obtain adequate
                insurance coverage, including losses arising from trip
                cancellation, medical emergencies, baggage loss, or travel
                delays.
              </p>
            </TermsSection>

            {/* 5. Changes to Itinerary */}
            <TermsSection
              id="changes"
              icon={RefreshCw}
              title="5. Changes to Itinerary"
            >
              <SubHeading>5.1 Changes by the Customer</SubHeading>
              <p>
                Requests to change travel dates, passenger names, accommodation
                category, or other booking details must be submitted in writing
                at least 15 days before the Travel Date. Changes are subject to
                availability and may incur an amendment fee of ₹500 per
                passenger per change, plus any cost difference resulting from
                the revised arrangements. Date changes are not permitted within
                7 days of the Travel Date.
              </p>

              <SubHeading>5.2 Changes by the Company</SubHeading>
              <p>
                The Company reserves the right to make minor alterations to the
                itinerary at any time, including changes to the order of
                sightseeing, substitution of hotels of an equivalent category,
                or route adjustments due to road conditions, weather, or
                operational requirements. The Company will notify the Customer
                of any significant changes (e.g., removal of a major
                destination) as soon as reasonably practicable and will offer a
                suitable alternative or a partial refund at its discretion.
              </p>

              <SubHeading>5.3 Weather &amp; Operational Disruptions</SubHeading>
              <p>
                Certain activities — including but not limited to high-altitude
                passes, river rafting, desert safaris, and boat rides — are
                subject to weather conditions and regulatory permissions. The
                Company does not guarantee the completion of any specific
                activity and will not be liable for any refund or compensation
                if an activity cannot be conducted due to weather, safety
                considerations, or government restrictions.
              </p>
            </TermsSection>

            {/* 6. Liability */}
            <TermsSection
              id="liability"
              icon={AlertTriangle}
              title="6. Liability &amp; Disclaimers"
            >
              <SubHeading>6.1 Limitation of Liability</SubHeading>
              <p>
                To the fullest extent permitted by applicable law, the Company's
                total liability to any Customer for any claim arising from or
                related to a booking shall not exceed the total tour cost paid
                by that Customer for the booking in question. The Company shall
                not be liable for any indirect, incidental, consequential,
                special, or punitive damages, including loss of profit, loss of
                enjoyment, or loss of opportunity.
              </p>

              <SubHeading>6.2 Third-Party Services</SubHeading>
              <p>
                The Company acts as an intermediary between Customers and
                third-party service providers including hotels, airlines, ground
                transport operators, activity providers, and restaurants. While
                the Company selects third-party providers with care, it is not
                responsible for the acts, omissions, negligence, or default of
                any third-party provider, nor for any injury, death, property
                damage, or loss howsoever caused by a third party.
              </p>

              <SubHeading>6.3 Health &amp; Medical Risks</SubHeading>
              <p>
                The Customer acknowledges that certain tours involve physical
                activity and travel to remote or high-altitude locations that may
                pose health risks. The Customer warrants that they and all
                travellers in their group are medically fit to undertake the
                booked tour. The Company strongly recommends that Customers
                consult a physician before booking adventure or high-altitude
                tours. The Company shall not be liable for any medical emergency,
                illness, or injury sustained during the tour.
              </p>

              <SubHeading>6.4 Website Accuracy</SubHeading>
              <p>
                The Company makes reasonable efforts to ensure information on
                the Website is accurate and up to date. However, descriptions,
                images, prices, and availability are subject to change without
                notice. The Company does not warrant the completeness or accuracy
                of Website content and shall not be liable for any reliance
                placed on such information.
              </p>
            </TermsSection>

            {/* 7. Traveller Conduct */}
            <TermsSection
              id="conduct"
              icon={Users}
              title="7. Traveller Conduct"
            >
              <p>
                The Customer and all travellers in their group agree to:
              </p>
              <TermsList
                items={[
                  "Behave in a respectful and courteous manner towards Company staff, guides, hotel personnel, and other travellers at all times.",
                  "Follow all instructions given by tour guides and the Company's representatives, particularly those relating to safety.",
                  "Carry valid government-issued photo identification (Aadhaar, PAN, Driving Licence, or Passport) for all domestic travel. The Company is not responsible for denied entry to hotels, checkpoints, or national parks due to failure to carry valid ID.",
                  "Respect local customs, traditions, and religious sentiments at all destinations. Inappropriate attire or behaviour at religious sites may result in denial of entry.",
                  "Refrain from the use of illegal substances. Possession or consumption of illegal substances will result in immediate termination of the tour without refund.",
                  "Refrain from any behaviour that could endanger the safety of the group or bring disrepute to the Company.",
                  "Not engage in any activity that could damage the natural environment, wildlife, or cultural heritage of the destinations visited.",
                ]}
              />
              <p>
                The Company reserves the right to remove any traveller from a
                tour at its sole discretion if their conduct is deemed
                inappropriate, unsafe, or in violation of these Terms. In such
                cases, no refund shall be payable for any unused portion of the
                tour, and the Company shall bear no responsibility for any
                additional costs incurred by the removed traveller.
              </p>
            </TermsSection>

            {/* 8. Privacy & Data */}
            <TermsSection
              id="privacy"
              icon={Shield}
              title="8. Privacy &amp; Data"
            >
              <p>
                The Company collects, processes, and stores personal data
                provided by Customers in accordance with the Information
                Technology (Amendment) Act, 2008, and the Digital Personal Data
                Protection Act, 2023 (DPDPA). By making a booking, the Customer
                consents to the collection and processing of their personal data
                for the purposes of fulfilling the booking, communicating with
                the Customer, and (with consent) sending promotional
                communications.
              </p>
              <p>
                The Customer's personal data — including name, contact details,
                identification numbers, and payment information — will be shared
                with third-party service providers (hotels, transport operators,
                guide agencies) solely to the extent necessary to fulfil the
                booked tour. The Company does not sell personal data to third
                parties for marketing purposes.
              </p>
              <p>
                For full details of how the Company collects, uses, and protects
                personal data, please refer to our{" "}
                <Link
                  to="/domestic/privacy/"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Privacy Policy
                </Link>
                , which forms part of this agreement.
              </p>
              <p>
                Customers have the right to access, correct, or request deletion
                of their personal data by writing to{" "}
                <a
                  href="mailto:privacy@wanderinn.com"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  privacy@wanderinn.com
                </a>
                .
              </p>
            </TermsSection>

            {/* 9. Intellectual Property */}
            <TermsSection
              id="intellectual"
              icon={Globe}
              title="9. Intellectual Property"
            >
              <p>
                All content on the Website — including but not limited to text,
                itineraries, photographs, videos, logos, graphics, icons, and
                software — is the exclusive property of {COMPANY_NAME} or its
                licensors and is protected by applicable Indian and international
                copyright, trademark, and intellectual property laws.
              </p>
              <p>
                The Customer is granted a limited, non-exclusive,
                non-transferable licence to access and use the Website for
                personal, non-commercial purposes. The Customer may not
                reproduce, distribute, modify, create derivative works from,
                publicly display, or commercially exploit any content from the
                Website without the prior written consent of the Company.
              </p>
              <p>
                Any user-generated content submitted by Customers — including
                reviews, ratings, photographs, or testimonials — remains the
                property of the Customer but the Customer grants the Company a
                worldwide, royalty-free, perpetual licence to use, reproduce,
                and display such content on the Website and in marketing
                materials.
              </p>
            </TermsSection>

            {/* 10. Governing Law */}
            <TermsSection
              id="governing"
              icon={Scale}
              title="10. Governing Law &amp; Dispute Resolution"
            >
              <SubHeading>10.1 Governing Law</SubHeading>
              <p>
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of India. Any disputes arising out of
                or in connection with these Terms shall be subject to the
                exclusive jurisdiction of the competent courts of Mumbai,
                Maharashtra.
              </p>

              <SubHeading>10.2 Dispute Resolution</SubHeading>
              <p>
                In the event of any dispute, the parties agree to first attempt
                to resolve the matter amicably through good-faith negotiation
                within 30 days of written notice of the dispute. If the dispute
                cannot be resolved amicably, it shall be referred to binding
                arbitration under the Arbitration and Conciliation Act, 1996,
                with a sole arbitrator appointed by mutual consent of the
                parties. The seat of arbitration shall be Mumbai and
                proceedings shall be conducted in English.
              </p>

              <SubHeading>10.3 Consumer Forum</SubHeading>
              <p>
                Nothing in these Terms limits or excludes any rights the
                Customer may have under applicable consumer protection
                legislation, including the Consumer Protection Act, 2019. The
                Customer may file a complaint with the appropriate District
                Consumer Disputes Redressal Commission if they are not satisfied
                with the Company's resolution.
              </p>
            </TermsSection>

            {/* 11. Contact */}
            <TermsSection
              id="contact"
              icon={Mail}
              title="11. Contact &amp; Grievance Redressal"
            >
              <p>
                For any queries, complaints, or grievance related to these Terms
                or any booking, please contact the Company's Grievance Officer:
              </p>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-5 space-y-3 not-prose">
                <p className="font-bold text-sm">Grievance Officer</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {[
                    { label: "Name", value: "Rohan Verma" },
                    { label: "Designation", value: "Head of Operations" },
                    { label: "Email", value: COMPANY_EMAIL, isEmail: true },
                    {
                      label: "Address",
                      value: COMPANY_ADDRESS,
                    },
                    {
                      label: "Response Time",
                      value: "Within 30 days of receipt of complaint",
                    },
                  ].map(({ label, value, isEmail }) => (
                    <div key={label} className="flex gap-2">
                      <span className="font-medium text-foreground w-28 shrink-0">
                        {label}:
                      </span>
                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="text-primary underline underline-offset-2 hover:no-underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Complaints should be submitted in writing with full booking
                details, a description of the issue, and any supporting
                documentation. The Grievance Officer will acknowledge receipt
                within 2 business days and provide a substantive response within
                30 days.
              </p>

              <div className="mt-2 rounded-xl border border-border/60 bg-muted/30 p-5 not-prose">
                <p className="font-bold text-sm mb-3">Company Details</p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {[
                    { label: "Company", value: COMPANY_NAME },
                    { label: "CIN", value: COMPANY_CIN },
                    { label: "GST No.", value: COMPANY_GST },
                    { label: "Registered Office", value: COMPANY_ADDRESS },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-foreground mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TermsSection>

            {/* Footer note */}
            <Separator />
            <div className="py-4 text-xs text-muted-foreground space-y-2">
              <p>
                These Terms and Conditions were last updated on{" "}
                <span className="font-semibold text-foreground">
                  {LAST_UPDATED}
                </span>{" "}
                and supersede all previous versions.
              </p>
              <p>
                © {new Date().getFullYear()} {COMPANY_NAME}. All rights
                reserved.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/domestic/privacy/"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Privacy Policy
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/domestic/contact"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Contact Us
                </Link>
                <span aria-hidden="true">·</span>
                <Link
                  to="/domestic"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* ── Back to top ──────────────────────────────────────────────── */}
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

function TermsSection({
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-sm text-foreground mt-5 mb-1.5">
      {children}
    </h3>
  );
}

function TermsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <span
            className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function DefinitionTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-foreground w-48">
              Term
            </th>
            <th className="text-left px-4 py-2.5 font-semibold text-xs text-foreground">
              Meaning
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map(([term, meaning]) => (
            <tr
              key={term}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-xs text-primary align-top whitespace-nowrap">
                {term}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                {meaning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefundTable({
  rows,
}: {
  rows: [string, string, string][];
}) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden mt-3 overflow-x-auto">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            {["Cancellation Window", "Refund Amount", "Notes"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 font-semibold text-xs text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map(([window, refund, notes], i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-xs font-medium text-foreground">
                {window}
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-xs font-semibold",
                  refund === "No refund"
                    ? "text-destructive"
                    : "text-green-700 dark:text-green-400"
                )}
              >
                {refund}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {notes || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}