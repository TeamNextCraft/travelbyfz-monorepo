import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Info,
  CreditCard,
  Landmark,
  Smartphone,
  Tag,
  Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Checkbox } from "#/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  TooltipProvider,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingTier = {
  label: string;
  price: number;
  description: string;
};

type TourSummary = {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  rating: number;
  reviewCount: number;
  image: string;
  pricingTiers: PricingTier[];
};

type AddOn = {
  id: string;
  label: string;
  description: string;
  price: number;
  perPerson: boolean;
};

// ─── Search params schema ─────────────────────────────────────────────────────

const bookSearchSchema = z.object({
  tier: z.string().optional(),
});

// ─── Form schemas per step ────────────────────────────────────────────────────

const travellersSchema = z.object({
  travelDate: z.string().min(1, "Please select a travel date"),
  guestCount: z.number().min(1).max(20),
  tier: z.string().min(1, "Please select a package tier"),
  travellers: z
    .array(
      z.object({
        firstName: z.string().min(1, "Required"),
        lastName: z.string().min(1, "Required"),
        age: z.string().min(1, "Required"),
        gender: z.enum(["Male", "Female", "Other"]),
      })
    )
    .min(1),
});

const contactSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z
    .string()
    .min(10, "Enter a valid 10-digit number")
    .max(10, "Enter a valid 10-digit number"),
  city: z.string().min(2, "Required"),
  specialRequests: z.string().optional(),
  agreeTerms: z.boolean().refine((v) => v, "You must agree to the terms"),
});

type TravellersData = z.infer<typeof travellersSchema>;
type ContactData = z.infer<typeof contactSchema>;

// ─── Static data (replace with loader) ───────────────────────────────────────

const TOURS_DB: Record<string, TourSummary> = {
  "kerala-backwaters": {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    rating: 4.9,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    pricingTiers: [
      { label: "Standard", price: 18500, description: "3★ hotels + AC houseboat" },
      { label: "Deluxe", price: 26000, description: "4★ hotels + premium houseboat" },
      { label: "Luxury", price: 45000, description: "5★ CGH Earth + private houseboat" },
    ],
  },
  "rajasthan-royals": {
    id: "rajasthan-royals",
    title: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    rating: 4.8,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    pricingTiers: [
      { label: "Standard", price: 24999, description: "3★ heritage hotels" },
      { label: "Deluxe", price: 35000, description: "4★ palace hotels" },
      { label: "Luxury", price: 68000, description: "Taj/Oberoi properties" },
    ],
  },
};

const ADD_ONS: AddOn[] = [
  {
    id: "travel-insurance",
    label: "Travel Insurance",
    description: "Comprehensive coverage — medical, cancellation & baggage",
    price: 799,
    perPerson: true,
  },
  {
    id: "airport-transfer",
    label: "Airport / Station Pickup",
    description: "AC cab pickup & drop from nearest airport or railway station",
    price: 1200,
    perPerson: false,
  },
  {
    id: "photo-package",
    label: "Professional Photography",
    description: "Dedicated photographer for 1 day with 50 edited photos",
    price: 3500,
    perPerson: false,
  },
  {
    id: "early-checkin",
    label: "Early Check-in (Day 1)",
    description: "Guaranteed room ready from 8 AM on arrival day",
    price: 1500,
    perPerson: false,
  },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, Rupay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, description: "All major banks" },
];

const GST_RATE = 0.05;

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Trip Details" },
  { id: 2, label: "Travellers" },
  { id: 3, label: "Add-ons" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Confirmed" },
];

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/tours/$tourId/book")({
  validateSearch: bookSearchSchema,
  loader: async ({ params }) => {
    const tour = TOURS_DB[params.tourId] ?? null;
    if (!tour) throw notFound();
    return { tour };
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🗺️</div>
      <h1 className="text-2xl font-bold">Tour not found</h1>
      <Link to="/domestic/tours" className={buttonVariants()}>Browse all tours</Link>
    </div>
  ),
  // Uncomment once you have Better Auth wired:
  // beforeLoad: async ({ context }) => {
  //   const user = await getUser();
  //   if (!user) throw redirect({ to: "/auth/sign-in", search: { redirect: window.location.pathname } });
  // },
  component: BookingPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function BookingPage() {
  const { tour } = Route.useLoaderData();
  const { tier: tierFromUrl } = Route.useSearch();

  const defaultTier =
    tour.pricingTiers.find((t) => t.label === tierFromUrl) ??
    tour.pricingTiers[0];

  // Wizard state
  const [step, setStep] = useState(1);

  // Step 1 & 2 data
  const [travellersData, setTravellersData] = useState<TravellersData>({
    travelDate: "",
    guestCount: 2,
    tier: defaultTier.label,
    travellers: [
      { firstName: "", lastName: "", age: "", gender: "Male" },
      { firstName: "", lastName: "", age: "", gender: "Male" },
    ],
  });

  // Step 3 — contact + terms
  const [contactData, setContactData] = useState<ContactData>({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    specialRequests: "",
    agreeTerms: false,
  });

  // Step 4 — add-ons & payment
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId] = useState(
    () => "WI" + Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  // Pricing calculations
  const selectedTier =
    tour.pricingTiers.find((t) => t.label === travellersData.tier) ??
    tour.pricingTiers[0];

  const pricing = useMemo(() => {
    const base = selectedTier.price * travellersData.guestCount;
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = ADD_ONS.find((a) => a.id === id);
      if (!addon) return sum;
      return sum + (addon.perPerson ? addon.price * travellersData.guestCount : addon.price);
    }, 0);
    const discount = promoApplied ? Math.round(base * 0.1) : 0;
    const subtotal = base + addOnsTotal - discount;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;
    return { base, addOnsTotal, discount, subtotal, gst, total };
  }, [selectedTier, travellersData.guestCount, selectedAddOns, promoApplied]);

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "WANDER10") setPromoApplied(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    // Wire to createServerFn:
    // await createBooking({ data: { tourId: tour.id, ...travellersData, ...contactData, addOns: selectedAddOns, paymentMethod, totalAmount: pricing.total } });
    await new Promise((r) => setTimeout(r, 1500)); // simulate API
    setIsSubmitting(false);
    setStep(5);
  };

  if (step === 5) {
    return <ConfirmationScreen tour={tour} bookingId={bookingId} pricing={pricing} />;
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-muted/20">
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="border-b bg-background sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
            <Link
              to="/domestic/tours/$tourId"
              params={{ tourId: tour.id }}
              className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5" })}
            >
              <ArrowLeft size={15} />
              Back
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <p className="text-sm font-semibold truncate flex-1">{tour.title}</p>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Shield size={12} className="text-green-600" />
              Secure checkout
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* ── Step indicator ───────────────────────────────────────────── */}
          <StepIndicator currentStep={step} steps={STEPS.slice(0, 4)} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* ── Left — Step content ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {step === 1 && (
                <Step1TripDetails
                  tour={tour}
                  data={travellersData}
                  onChange={setTravellersData}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2Travellers
                  data={travellersData}
                  onChange={setTravellersData}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <Step3AddOns
                  addOns={ADD_ONS}
                  selected={selectedAddOns}
                  guestCount={travellersData.guestCount}
                  onToggle={toggleAddOn}
                  contactData={contactData}
                  onContactChange={setContactData}
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                />
              )}
              {step === 4 && (
                <Step4Payment
                  paymentMethod={paymentMethod}
                  onPaymentChange={setPaymentMethod}
                  promoCode={promoCode}
                  onPromoChange={setPromoCode}
                  promoApplied={promoApplied}
                  onApplyPromo={applyPromo}
                  pricing={pricing}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep(3)}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </div>

            {/* ── Right — Order summary ──────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <OrderSummary
                tour={tour}
                travellersData={travellersData}
                selectedTier={selectedTier}
                selectedAddOns={selectedAddOns}
                pricing={pricing}
                promoApplied={promoApplied}
              />
            </aside>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { id: number; label: string }[];
}) {
  return (
    <nav aria-label="Booking steps">
      <ol className="flex items-center gap-0">
        {steps.map((s, i) => {
          const done = currentStep > s.id;
          const active = currentStep === s.id;
          return (
            <li key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all",
                    done
                      ? "bg-primary border-primary text-primary-foreground"
                      : active
                      ? "border-primary text-primary bg-background"
                      : "border-border text-muted-foreground bg-background"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-xs hidden sm:block",
                    active ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mb-4 transition-colors",
                    done ? "bg-primary" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Step 1 — Trip Details ────────────────────────────────────────────────────

function Step1TripDetails({
  tour,
  data,
  onChange,
  onNext,
}: {
  tour: TourSummary;
  data: TravellersData;
  onChange: (d: TravellersData) => void;
  onNext: () => void;
}) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split("T")[0];

  const canProceed = data.travelDate && data.guestCount >= 1 && data.tier;

  const setGuestCount = (n: number) => {
    const count = Math.max(1, Math.min(20, n));
    // Sync travellers array length
    const current = data.travellers;
    const updated =
      count > current.length
        ? [
            ...current,
            ...Array.from({ length: count - current.length }, () => ({
              firstName: "",
              lastName: "",
              age: "",
              gender: "Male" as const,
            })),
          ]
        : current.slice(0, count);
    onChange({ ...data, guestCount: count, travellers: updated });
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-bold">Trip Details</h2>
        <p className="text-sm text-muted-foreground">
          Select your travel date, group size, and package.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Travel date */}
        <div className="space-y-2">
          <Label htmlFor="travel-date" className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-primary" />
            Travel Date
          </Label>
          <Input
            id="travel-date"
            type="date"
            min={minDateStr}
            value={data.travelDate}
            onChange={(e) => onChange({ ...data, travelDate: e.target.value })}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">
            Tours depart every Friday & Saturday. Booking must be made at least 7 days in advance.
          </p>
        </div>

        <Separator />

        {/* Guest count */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            Number of Guests
          </Label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuestCount(data.guestCount - 1)}
              disabled={data.guestCount <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              aria-label="Decrease guests"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center text-lg font-bold tabular-nums">
              {data.guestCount}
            </span>
            <button
              type="button"
              onClick={() => setGuestCount(data.guestCount + 1)}
              disabled={data.guestCount >= 20}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              aria-label="Increase guests"
            >
              <Plus size={16} />
            </button>
            <span className="text-sm text-muted-foreground">
              {data.guestCount === 1 ? "person" : "people"}
            </span>
          </div>
          {data.guestCount >= 6 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Tag size={11} />
              Group discount applied at checkout
            </Badge>
          )}
        </div>

        <Separator />

        {/* Tier selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1.5">
            Package Tier
          </Label>
          <div className="space-y-2.5">
            {tour.pricingTiers.map((tier) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => onChange({ ...data, tier: tier.label })}
                className={cn(
                  "w-full text-left rounded-xl border p-3.5 transition-all",
                  data.tier === tier.label
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/60 hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                        data.tier === tier.label
                          ? "border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {data.tier === tier.label && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-semibold text-sm">{tier.label}</span>
                  </div>
                  <span className="font-bold text-primary text-sm">
                    ₹{tier.price.toLocaleString("en-IN")}{" "}
                    <span className="font-normal text-xs text-muted-foreground">
                      /person
                    </span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  {tier.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          disabled={!canProceed}
          onClick={onNext}
        >
          Continue to Traveller Details
          <ArrowRight size={16} />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Step 2 — Travellers ──────────────────────────────────────────────────────

function Step2Travellers({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: TravellersData;
  onChange: (d: TravellersData) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const updateTraveller = (
    i: number,
    field: keyof TravellersData["travellers"][0],
    value: string
  ) => {
    const updated = data.travellers.map((t, idx) =>
      idx === i ? { ...t, [field]: value } : t
    );
    onChange({ ...data, travellers: updated });
  };

  const canProceed = data.travellers.every(
    (t) => t.firstName && t.lastName && t.age
  );

  return (
    <div className="space-y-4">
      {data.travellers.map((traveller, i) => (
        <Card key={i} className="border-border/60">
          <CardHeader className="pb-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </span>
              Traveller {i + 1}
              {i === 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  Primary
                </Badge>
              )}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`fn-${i}`} className="text-xs">
                  First Name
                </Label>
                <Input
                  id={`fn-${i}`}
                  placeholder="Rahul"
                  value={traveller.firstName}
                  onChange={(e) => updateTraveller(i, "firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`ln-${i}`} className="text-xs">
                  Last Name
                </Label>
                <Input
                  id={`ln-${i}`}
                  placeholder="Sharma"
                  value={traveller.lastName}
                  onChange={(e) => updateTraveller(i, "lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`age-${i}`} className="text-xs">
                  Age
                </Label>
                <Input
                  id={`age-${i}`}
                  type="number"
                  min={1}
                  max={100}
                  placeholder="28"
                  value={traveller.age}
                  onChange={(e) => updateTraveller(i, "age", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`gender-${i}`} className="text-xs">
                  Gender
                </Label>
                <Select
                  value={traveller.gender}
                  onValueChange={(v) => updateTraveller(i, "gender", v)}
                >
                  <SelectTrigger id={`gender-${i}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button
          className="flex-1 gap-2"
          size="lg"
          disabled={!canProceed}
          onClick={onNext}
        >
          Continue to Add-ons
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 — Add-ons + Contact ───────────────────────────────────────────────

function Step3AddOns({
  addOns,
  selected,
  guestCount,
  onToggle,
  contactData,
  onContactChange,
  onBack,
  onNext,
}: {
  addOns: AddOn[];
  selected: string[];
  guestCount: number;
  onToggle: (id: string) => void;
  contactData: ContactData;
  onContactChange: (d: ContactData) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canProceed =
    contactData.contactName &&
    contactData.contactEmail &&
    contactData.contactPhone.length === 10 &&
    contactData.city &&
    contactData.agreeTerms;

  return (
    <div className="space-y-5">
      {/* Add-ons */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold">Optional Add-ons</h2>
          <p className="text-sm text-muted-foreground">
            Enhance your trip with these extras.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {addOns.map((addon) => {
            const isSelected = selected.includes(addon.id);
            const addonPrice = addon.perPerson
              ? addon.price * guestCount
              : addon.price;
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => onToggle(addon.id)}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/60 hover:border-primary/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggle(addon.id)}
                      className="mt-0.5"
                      aria-label={addon.label}
                    />
                    <div>
                      <p className="font-semibold text-sm">{addon.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-primary">
                      +₹{addonPrice.toLocaleString("en-IN")}
                    </p>
                    {addon.perPerson && (
                      <p className="text-xs text-muted-foreground">
                        ₹{addon.price.toLocaleString("en-IN")}/person
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Contact details */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold">Contact Details</h2>
          <p className="text-sm text-muted-foreground">
            Your booking confirmation will be sent here.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name" className="text-xs flex items-center gap-1.5">
              <User size={13} className="text-primary" />
              Full Name
            </Label>
            <Input
              id="contact-name"
              placeholder="Rahul Sharma"
              value={contactData.contactName}
              onChange={(e) =>
                onContactChange({ ...contactData, contactName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs flex items-center gap-1.5">
                <Mail size={13} className="text-primary" />
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="rahul@email.com"
                value={contactData.contactEmail}
                onChange={(e) =>
                  onContactChange({ ...contactData, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone" className="text-xs flex items-center gap-1.5">
                <Phone size={13} className="text-primary" />
                Mobile (10 digits)
              </Label>
              <div className="flex">
                <span className="flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-sm text-muted-foreground">
                  +91
                </span>
                <Input
                  id="contact-phone"
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={contactData.contactPhone}
                  onChange={(e) =>
                    onContactChange({
                      ...contactData,
                      contactPhone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-city" className="text-xs flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              Your City
            </Label>
            <Input
              id="contact-city"
              placeholder="Mumbai"
              value={contactData.city}
              onChange={(e) =>
                onContactChange({ ...contactData, city: e.target.value })
              }
              className="max-w-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="special-requests" className="text-xs">
              Special Requests{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="special-requests"
              rows={3}
              placeholder="Dietary requirements, medical conditions, room preferences..."
              value={contactData.specialRequests}
              onChange={(e) =>
                onContactChange({ ...contactData, specialRequests: e.target.value })
              }
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="agree-terms"
              checked={contactData.agreeTerms}
              onCheckedChange={(v) =>
                onContactChange({ ...contactData, agreeTerms: !!v })
              }
            />
            <Label
              htmlFor="agree-terms"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Link
                to="/domestic/terms"
                className="text-primary underline underline-offset-2"
                target="_blank"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/domestic/cancellation-policy"
                className="text-primary underline underline-offset-2"
                target="_blank"
              >
                Cancellation Policy
              </Link>
              .
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button
          className="flex-1 gap-2"
          size="lg"
          disabled={!canProceed}
          onClick={onNext}
        >
          Continue to Payment
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4 — Payment ─────────────────────────────────────────────────────────

function Step4Payment({
  paymentMethod,
  onPaymentChange,
  promoCode,
  onPromoChange,
  promoApplied,
  onApplyPromo,
  pricing,
  isSubmitting,
  onBack,
  onConfirm,
}: {
  paymentMethod: string;
  onPaymentChange: (v: string) => void;
  promoCode: string;
  onPromoChange: (v: string) => void;
  promoApplied: boolean;
  onApplyPromo: () => void;
  pricing: ReturnType<typeof useMemo<any, any>>;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Promo code */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Tag size={15} className="text-primary" />
            Promo Code
          </h2>
        </CardHeader>
        <CardContent>
          {promoApplied ? (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
              <CheckCircle2 size={15} />
              <span>
                <strong>WANDER10</strong> applied — 10% off base price!
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code (try WANDER10)"
                value={promoCode}
                onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button
                variant="outline"
                onClick={onApplyPromo}
                disabled={!promoCode}
                className="shrink-0"
              >
                Apply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold">Payment Method</h2>
          <p className="text-sm text-muted-foreground">
            All transactions are secured with 256-bit SSL encryption.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={paymentMethod} onValueChange={onPaymentChange}>
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/60 hover:border-primary/40"
                  )}
                  onClick={() => onPaymentChange(method.id)}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
                  </div>
                  <Label htmlFor={method.id} className="cursor-pointer flex-1">
                    <p className="font-semibold text-sm">{method.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {/* Dummy payment input for UPI */}
          {paymentMethod === "upi" && (
            <div className="space-y-1.5 mt-3">
              <Label htmlFor="upi-id" className="text-xs">
                UPI ID
              </Label>
              <Input
                id="upi-id"
                placeholder="yourname@upi"
                className="max-w-xs"
              />
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-green-600" />
              Razorpay secured
            </span>
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-green-600" />
              PCI DSS compliant
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Final amount notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20 p-4 flex items-start gap-2.5 text-sm text-blue-800 dark:text-blue-300">
        <Info size={15} className="shrink-0 mt-0.5" />
        <p>
          You won't be charged yet. Clicking "Confirm Booking" will initiate the
          payment flow via Razorpay. Your booking is only confirmed once payment
          is successful.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button
          className="flex-1 gap-2"
          size="lg"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm & Pay ₹{pricing.total.toLocaleString("en-IN")}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({
  tour,
  travellersData,
  selectedTier,
  selectedAddOns,
  pricing,
  promoApplied,
}: {
  tour: TourSummary;
  travellersData: TravellersData;
  selectedTier: PricingTier;
  selectedAddOns: string[];
  pricing: any;
  promoApplied: boolean;
}) {
  return (
    <Card className="border-border/60 sticky top-20">
      {/* Tour thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-bold text-sm leading-tight">{tour.title}</p>
          <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {tour.destination}
          </p>
        </div>
      </div>

      <CardContent className="pt-4 space-y-4">
        {/* Trip info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            {
              icon: Clock,
              label: "Duration",
              value: tour.duration,
            },
            {
              icon: Users,
              label: "Guests",
              value: `${travellersData.guestCount} ${travellersData.guestCount === 1 ? "person" : "people"}`,
            },
            {
              icon: CalendarDays,
              label: "Travel date",
              value: travellersData.travelDate
                ? new Date(travellersData.travelDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Not selected",
            },
            {
              icon: Star,
              label: "Package",
              value: selectedTier.label,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg bg-muted/50 px-2.5 py-2">
              <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                <Icon size={11} />
                <span>{label}</span>
              </div>
              <p className="font-semibold text-xs">{value}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              ₹{selectedTier.price.toLocaleString("en-IN")} × {travellersData.guestCount}{" "}
              {travellersData.guestCount === 1 ? "person" : "people"}
            </span>
            <span>₹{pricing.base.toLocaleString("en-IN")}</span>
          </div>

          {selectedAddOns.length > 0 && (
            <div className="space-y-1">
              {selectedAddOns.map((id) => {
                const addon = ADD_ONS.find((a) => a.id === id)!;
                const addonTotal = addon.perPerson
                  ? addon.price * travellersData.guestCount
                  : addon.price;
                return (
                  <div key={id} className="flex justify-between text-muted-foreground text-xs">
                    <span>+ {addon.label}</span>
                    <span>₹{addonTotal.toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>
          )}

          {promoApplied && (
            <div className="flex justify-between text-green-700 dark:text-green-400 text-xs font-medium">
              <span>Promo discount (WANDER10)</span>
              <span>−₹{pricing.discount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground text-xs">
            <span>GST (5%)</span>
            <span>₹{pricing.gst.toLocaleString("en-IN")}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">
              ₹{pricing.total.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Inclusive of all taxes & charges
          </p>
        </div>

        {/* Cancellation note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5">
          <Shield size={12} className="text-green-600 shrink-0 mt-0.5" />
          Free cancellation up to 15 days before travel date.
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Confirmation Screen ──────────────────────────────────────────────────────

function ConfirmationScreen({
  tour,
  bookingId,
  pricing,
}: {
  tour: TourSummary;
  bookingId: string;
  pricing: any;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2
              size={40}
              className="text-green-600"
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Booking Confirmed! 🎉</h1>
          <p className="text-muted-foreground mt-2">
            Your adventure is locked in. A confirmation has been sent to your
            email and WhatsApp.
          </p>
        </div>

        {/* Booking ID card */}
        <Card className="border-border/60 text-left">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Booking ID</span>
              <Badge variant="secondary" className="font-mono font-bold tracking-wider">
                {bookingId}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tour</span>
                <span className="font-medium text-right max-w-[180px]">
                  {tour.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{tour.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-primary">
                  ₹{pricing.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's next */}
        <div className="text-left space-y-2.5">
          <p className="text-sm font-semibold">What happens next?</p>
          {[
            "You'll receive a detailed itinerary PDF within 2 hours",
            "Your travel manager will call within 24 hours to confirm logistics",
            "Full payment confirmation via SMS & email",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2
                size={15}
                className="text-green-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              {item}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            to="/domestic/bookings"
            className={buttonVariants({ size: "lg", className: "w-full gap-2" })}
          >
            View My Bookings
            <ChevronRight size={16} />
          </Link>
          <Link
            to="/domestic/tours"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })}
          >
            Browse More Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
