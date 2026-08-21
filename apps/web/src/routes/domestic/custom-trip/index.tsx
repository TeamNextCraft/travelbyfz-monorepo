import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HeartHandshake,
  Mail,
  MapPinned,
  Mountain,
  Phone,
  Route as RouteIcon,
  SendHorizonal,
  Sparkles,
  Users,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";

export const Route = createFileRoute("/domestic/custom-trip/")({
  component: DomesticCustomTripPage,
});

const tripThemes = [
  "Family",
  "Honeymoon",
  "Adventure",
  "Spiritual",
  "Nature",
  "Beach",
  "Heritage",
  "Weekend",
];

const paceOptions = ["Relaxed", "Balanced", "Fast-paced"];
const budgetOptions = [
  "Under ₹10,000 per person",
  "₹10,000 – ₹20,000 per person",
  "₹20,000 – ₹35,000 per person",
  "₹35,000+ per person",
];

const helpPoints = [
  {
    title: "Tell us your plan",
    description:
      "Share destination ideas, dates, group size, and what kind of trip you want.",
    icon: RouteIcon,
  },
  {
    title: "We prepare options",
    description:
      "Our team shortlists destinations, hotels, transport, and pacing that fit your request.",
    icon: Sparkles,
  },
  {
    title: "Refine and confirm",
    description:
      "You review the plan, request changes if needed, and move ahead only when it feels right.",
    icon: HeartHandshake,
  },
];

const trustItems = [
  "Human-planned itineraries, not generic package copy",
  "Flexible pacing for families, couples, and groups",
  "Destination, stay, and transport guidance in one flow",
  "Clear inquiry process before payment or booking commitment",
];

function DomesticCustomTripPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    departureCity: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "",
    theme: "",
    budget: "",
    pace: "",
    notes: "",
  });

  const isFormValid = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.phone.trim() &&
      form.destination.trim() &&
      form.startDate.trim() &&
      form.travelers.trim()
    );
  }, [form]);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid) return;

    // TODO: connect to server action / API
    setSubmitted(true);
  }

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,63,69,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.10),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.92))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-teal-200 bg-teal-50 text-teal-700"
            >
              Domestic Custom Trip
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build a trip around your people, pace, and budget.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Not every traveller wants a ready-made package. Share what kind of
              domestic trip you want, and we’ll shape a plan that fits your
              dates, group, comfort level, and destination goals.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/70 bg-white/75 p-4 text-sm leading-6 text-slate-700 shadow-sm backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <Clock3 className="size-4 text-teal-700" />
                Quick inquiry flow
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <HeartHandshake className="size-4 text-teal-700" />
                Human trip planning
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <BadgeIndianRupee className="size-4 text-teal-700" />
                Budget-aware suggestions
              </div>
            </div>
          </div>

          <div className="grid gap-4 self-start">
            {helpPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="rounded-2xl border-border/60 bg-white/80 shadow-sm backdrop-blur-sm"
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="size-5" />
                    </div>

                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        Step {index + 1}
                      </div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
            <CardHeader className="border-b border-border/50 pb-5">
              <CardTitle className="text-2xl text-slate-900">
                Tell us about your trip
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                Fill in the essentials so our team can suggest the right route,
                stay options, and itinerary flow for your domestic travel plan.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Contact details
                      </p>
                      <p className="text-xs text-muted-foreground">
                        We’ll use this to send your trip suggestions and follow up.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={form.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                          id="phone"
                          placeholder="+91 90000 00000"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel details */}
                  <div className="space-y-4 border-t border-border/50 pt-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Travel details
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Share the basic structure of the trip you have in mind.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="departureCity">Departure city</Label>
                        <Input
                          id="departureCity"
                          placeholder="Ahmedabad, Mumbai, Delhi..."
                          value={form.departureCity}
                          onChange={(e) =>
                            updateField("departureCity", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination">Preferred destination</Label>
                        <Input
                          id="destination"
                          placeholder="Goa, Kashmir, Kerala..."
                          value={form.destination}
                          onChange={(e) =>
                            updateField("destination", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={form.startDate}
                          onChange={(e) => updateField("startDate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">End date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={form.endDate}
                          onChange={(e) => updateField("endDate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelers">Number of travellers</Label>
                        <Input
                          id="travelers"
                          placeholder="2 adults, 1 child"
                          value={form.travelers}
                          onChange={(e) => updateField("travelers", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme">Trip theme</Label>
                        <div className="relative">
                          <select
                            id="theme"
                            value={form.theme}
                            onChange={(e) => updateField("theme", e.target.value)}
                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select a theme</option>
                            {tripThemes.map((theme) => (
                              <option key={theme} value={theme}>
                                {theme}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget range</Label>
                        <div className="relative">
                          <select
                            id="budget"
                            value={form.budget}
                            onChange={(e) => updateField("budget", e.target.value)}
                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select budget</option>
                            {budgetOptions.map((budget) => (
                              <option key={budget} value={budget}>
                                {budget}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pace">Trip pace</Label>
                        <div className="relative">
                          <select
                            id="pace"
                            value={form.pace}
                            onChange={(e) => updateField("pace", e.target.value)}
                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select pace</option>
                            {paceOptions.map((pace) => (
                              <option key={pace} value={pace}>
                                {pace}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Extra notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Share anything useful: hotel preference, elderly travellers, kids, transport needs, must-visit places, food preference, etc."
                        className="min-h-[120px]"
                        value={form.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-6 text-muted-foreground">
                      By sending this inquiry, you’re asking our team to prepare
                      a customized domestic trip suggestion based on your inputs.
                    </p>

                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <SendHorizonal className="mr-2 size-4" />
                      Send inquiry
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Inquiry received
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Thanks, {form.fullName || "traveller"}. We’ve captured your
                        custom domestic trip request and your team can now review
                        destination, dates, budget, and pace before sharing the
                        next options with you.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSubmitted(false)}
                        >
                          Send another inquiry
                        </Button>

                        <Button
                          asChild
                          className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                          <a href="tel:+919000000000">Talk to travel expert</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side column */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">What helps us plan better</CardTitle>
                <CardDescription className="text-slate-300">
                  The more clearly you describe the trip, the better the first
                  recommendation will be.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-300" />
                  <p>Flexible dates or fixed dates, both are useful.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-4 shrink-0 text-teal-300" />
                  <p>Group type matters: couples, families, elders, friends, kids.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mountain className="mt-0.5 size-4 shrink-0 text-teal-300" />
                  <p>
                    Mention if you prefer sightseeing, relaxation, spirituality,
                    adventure, or a balanced mix.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-0.5 size-4 shrink-0 text-teal-300" />
                  <p>
                    If you don’t know the destination yet, describe the vibe you
                    want and we can suggest places.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Need direct assistance?
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Use the inquiry form or reach out directly for faster trip
                  discussion.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <a
                  href="tel:+919000000000"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
                >
                  <Phone className="size-4 text-teal-700" />
                  +91 90000 00000
                </a>

                <a
                  href="mailto:hello@travelbyfz.com"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
                >
                  <Mail className="size-4 text-teal-700" />
                  hello@travelbyfz.com
                </a>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Common custom requests
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Family-friendly itinerary",
                    "Temple circuit",
                    "Hill station stay",
                    "Private cab included",
                    "Premium hotel only",
                    "Weekend departure",
                    "Senior-citizen friendly",
                    "Food preference planning",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}