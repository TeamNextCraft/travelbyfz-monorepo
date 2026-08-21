import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  HeadphonesIcon,
  CalendarDays,
  HelpCircle,
  Users,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button, buttonVariants } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";
import { useForm } from "@tanstack/react-form";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/contact")({
  component: ContactPage,
});

// ─── Types & schema ───────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit mobile number")
    .max(10, "Enter a valid 10-digit mobile number")
    .regex(/^\d+$/, "Only digits allowed"),
  subject: z.string().min(1, "Please select a subject"),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  groupSize: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Static data ──────────────────────────────────────────────────────────────

const OFFICES = [
  {
    city: "Mumbai",
    label: "Head Office",
    address: "304, Sunshine Tower, Nariman Point, Mumbai — 400021",
    phone: "+91 22 4567 8900",
    email: "mumbai@wanderinn.com",
    hours: "Mon–Sat: 9 AM – 7 PM",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.0!2d72.8239!3d18.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU1JzMwLjciTiA3MsKwNDknMjYuMCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin",
  },
  {
    city: "Jaipur",
    label: "North India Office",
    address: "12, Pink City Mall, MI Road, Jaipur — 302001",
    phone: "+91 141 4567 890",
    email: "jaipur@wanderinn.com",
    hours: "Mon–Sat: 9 AM – 6 PM",
    mapEmbed: null,
  },
  {
    city: "Kochi",
    label: "South India Office",
    address: "2nd Floor, Marine Drive Complex, Kochi — 682031",
    phone: "+91 484 4567 890",
    email: "kochi@wanderinn.com",
    hours: "Mon–Sat: 9 AM – 6 PM",
    mapEmbed: null,
  },
];

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    subtext: "Mon–Sat, 9 AM – 7 PM IST",
    action: "tel:+919876543210",
    actionLabel: "Call now",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+91 98765 43210",
    subtext: "Typically replies in < 1 hour",
    action: "https://wa.me/919876543210",
    actionLabel: "Open WhatsApp",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@wanderinn.com",
    subtext: "We reply within 24 hours",
    action: "mailto:hello@wanderinn.com",
    actionLabel: "Send email",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: HeadphonesIcon,
    label: "On-Trip Support",
    value: "+91 98765 99999",
    subtext: "24/7 for active bookings only",
    action: "tel:+919876599999",
    actionLabel: "Emergency line",
    color:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
];

const SUBJECTS = [
  { value: "new-booking", label: "New Tour Booking" },
  { value: "custom-itinerary", label: "Custom Itinerary Request" },
  { value: "existing-booking", label: "Query About Existing Booking" },
  { value: "cancellation", label: "Cancellation / Refund" },
  { value: "group-booking", label: "Group / Corporate Booking" },
  { value: "feedback", label: "Feedback or Complaint" },
  { value: "partnership", label: "Partnership / B2B" },
  { value: "other", label: "Other" },
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 2–4 weeks in advance for regular tours, and 6–8 weeks for peak season (October–March) or Ladakh/Andaman packages, which have limited availability. Houseboat slots in Kerala fill up 2 months ahead during December–January.",
  },
  {
    q: "Do you offer EMI or installment payment?",
    a: "Yes. You can split your payment into 2 installments — 50% at the time of booking to secure your slot, and the balance 30 days before your travel date. We accept all major credit cards, UPI, net banking, and popular buy-now-pay-later platforms like Simpl and Lazypay.",
  },
  {
    q: "Can I customise a tour package?",
    a: "Absolutely. Customisation is one of our specialities. You can extend or shorten any standard itinerary, upgrade or downgrade hotel categories, add or remove stops, adjust pace, or build a completely bespoke tour from scratch. Use the inquiry form above or call us directly.",
  },
  {
    q: "What happens if I need to cancel?",
    a: "Our cancellation policy is: 90% refund if cancelled 30+ days before travel, 50% for 15–29 days, 25% for 7–14 days, and no refund within 7 days. Cancellations due to government-issued travel advisories or natural disasters are eligible for full credit notes valid for 12 months.",
  },
  {
    q: "Is travel insurance included?",
    a: "Travel insurance is an optional add-on (₹799/person) you can select during booking. We strongly recommend it, especially for hill station and island tours where weather-related disruptions are possible. It covers medical emergencies, trip cancellation, and baggage loss.",
  },
  {
    q: "Do you cater to senior citizens or differently-abled travellers?",
    a: "Yes. We have dedicated itineraries designed for senior travellers with a slower pace, accessible accommodation, and flexible activity options. Let us know any specific accessibility requirements in your inquiry and we'll customise accordingly.",
  },
  {
    q: "Are your guides licensed?",
    a: "All our guides hold Ministry of Tourism–approved Regional Level Guide licences. They are background-checked, fluent in English and Hindi (plus regional languages where applicable), and have completed our internal WanderInn hospitality training.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function ContactPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Contact channels ─────────────────────────────────────────── */}
      <ChannelsSection />

      {/* ── Form + offices ───────────────────────────────────────────── */}
      <FormAndOfficesSection />

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── CTA strip ────────────────────────────────────────────────── */}
      <CTAStrip />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b py-16 sm:py-20 px-4 overflow-hidden relative">
      {/* Dot grid decoration */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            We're real people — not a chatbot
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
            Let's plan your <br />
            perfect trip together.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
            Have a destination in mind? A custom itinerary request? Or just a
            question? Reach out — our travel specialists respond within a few
            hours, not days.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
            {[
              { icon: Clock, text: "Mon–Sat, 9 AM – 7 PM IST" },
              { icon: CheckCircle2, text: "Reply within 4 hours" },
              { icon: Users, text: "No bots. Real experts." },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon size={14} className="text-primary" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Channels ─────────────────────────────────────────────────────────────────

function ChannelsSection() {
  return (
    <section className="py-10 px-4 bg-muted/20 border-b">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <Card
                key={ch.label}
                className="border-border/60 hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-5 pb-5 space-y-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      ch.color
                    )}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{ch.label}</p>
                    <p className="text-sm font-medium text-primary mt-0.5">
                      {ch.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ch.subtext}
                    </p>
                  </div>
                  <a
                    href={ch.action}
                    target={
                      ch.action.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      ch.action.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "w-full text-xs gap-1.5",
                    })}
                  >
                    {ch.actionLabel}
                    <ArrowRight size={12} />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Form + Offices ───────────────────────────────────────────────────────────

function FormAndOfficesSection() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* ── Inquiry form ──────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Fill in the details below and a travel specialist will get back
                to you within 4 hours.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* ── Offices ────────────────────────────────────────────── */}
          <aside className="space-y-4">
            <h2 className="text-lg font-bold">Our Offices</h2>
            {OFFICES.map((office) => (
              <OfficeCard key={office.city} office={office} />
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      destination: "",
      travelDate: "",
      groupSize: "",
      message: "",
    },
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async (values) => {

    },
  });

  const subject = form.watch("subject");
  const showTripFields =
    subject === "new-booking" || subject === "custom-itinerary";

  if (submitted) {
    return (
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
            <h3 className="text-xl font-bold mb-1">Message received!</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Thank you for reaching out. One of our travel specialists will
              contact you within{" "}
              <span className="font-semibold text-foreground">4 hours</span>{" "}
              on the phone number / email you provided.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Send another message
            </button>
            <Link
              to="/tours"
              className={buttonVariants({ size: "sm", className: "gap-2" })}
            >
              Browse tours
              <ArrowRight size={13} />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
        setSubmitted(true);
      }}
      className="space-y-5"
      noValidate
    >
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Rahul Sharma"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="rahul@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone + Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="98765 43210"
              {...register("phone")}
              aria-invalid={!!errors.phone}
              className={cn("pl-12", errors.phone && "border-destructive")}
              maxLength={10}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject">
            Subject <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={(v) =>
              setValue("subject", v, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="subject"
              className={cn(errors.subject && "border-destructive")}
            >
              <SelectValue placeholder="What's this about?" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs text-destructive">
              {errors.subject.message}
            </p>
          )}
        </div>
      </div>

      {/* Trip fields — shown only for booking/itinerary subjects */}
      {showTripFields && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
          <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <CalendarDays size={13} />
            Trip details (optional but helpful)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="destination" className="text-xs">
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="e.g. Kerala, Ladakh"
                {...register("destination")}
                className="text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="travelDate" className="text-xs">
                Approx. Travel Date
              </Label>
              <Input
                id="travelDate"
                type="month"
                {...register("travelDate")}
                className="text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="groupSize" className="text-xs">
                Group Size
              </Label>
              <Select
                onValueChange={(v) => setValue("groupSize", v)}
              >
                <SelectTrigger id="groupSize" className="h-9 text-sm">
                  <SelectValue placeholder="How many?" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3–4", "5–8", "9–15", "16+"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g} {g === "1" ? "person" : "people"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us what you have in mind — destinations you're interested in, special requirements, budget range, or any questions you have..."
          {...register("message")}
          rows={5}
          aria-invalid={!!errors.message}
          className={cn("resize-none text-sm", errors.message && "border-destructive")}
          maxLength={1500}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground text-right">
            {watch("message")?.length ?? 0}/1500
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send Message
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          We reply within 4 hours on working days.
        </p>
      </div>
    </form>
  );
}

// ─── Office Card ──────────────────────────────────────────────────────────────

function OfficeCard({
  office,
}: {
  office: (typeof OFFICES)[number];
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm">{office.city}</p>
          <Badge variant="secondary" className="text-xs">
            {office.label}
          </Badge>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin
              size={12}
              className="shrink-0 mt-0.5 text-primary"
              aria-hidden="true"
            />
            <span>{office.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-primary shrink-0" aria-hidden="true" />
            <a
              href={`tel:${office.phone.replace(/\s/g, "")}`}
              className="hover:text-foreground transition-colors"
            >
              {office.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-primary shrink-0" aria-hidden="true" />
            <a
              href={`mailto:${office.email}`}
              className="hover:text-foreground transition-colors"
            >
              {office.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-primary shrink-0" aria-hidden="true" />
            <span>{office.hours}</span>
          </div>
        </div>

        {/* Embed map for head office */}
        {office.mapEmbed && (
          <div className="mt-2 rounded-lg overflow-hidden border border-border/60 aspect-video">
            <iframe
              src={office.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${office.city} office map`}
              className="w-full h-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 bg-muted/20 border-t">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Common Questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Can't find your answer?{" "}
            <a
              href="mailto:hello@wanderinn.com"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              Email us directly
            </a>
            .
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  index,
  faq,
  isOpen,
  onToggle,
}: {
  index: number;
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        isOpen
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-background hover:border-primary/20"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
        aria-expanded={isOpen}
        aria-controls={`faq-${index}`}
      >
        <span
          className={cn(
            "font-semibold text-sm leading-snug",
            isOpen ? "text-primary" : "text-foreground"
          )}
        >
          {faq.q}
        </span>
        <span
          className={cn(
            "shrink-0 transition-colors",
            isOpen ? "text-primary" : "text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <div
        id={`faq-${index}`}
        role="region"
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className="px-4 pb-4">
          <Separator className="mb-3" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── CTA Strip ────────────────────────────────────────────────────────────────

function CTAStrip() {
  return (
    <section className="py-14 px-4 border-t bg-background">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-lg">Not sure where to start?</p>
            <p className="text-muted-foreground text-sm mt-0.5">
              Browse our curated tour packages — filtered by region, duration,
              category, and budget.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/domestic/destinations"
            className={buttonVariants({
              variant: "outline",
              className: "gap-2",
            })}
          >
            Explore Destinations
          </Link>
          <Link
            to="/domestic/tours"
            className={buttonVariants({ className: "gap-2" })}
          >
            Browse All Tours
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
