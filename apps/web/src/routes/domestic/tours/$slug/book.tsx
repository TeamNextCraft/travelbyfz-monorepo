import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertCircle, ArrowLeft, ArrowRight, BedDouble, CalendarDays, CheckCircle2,
  ChevronRight, Clock, CreditCard, Info, Landmark, Loader2, Mail, MapPin, Minus,
  Phone, Plus, Shield, Smartphone, Star, Tag, User, Users,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { Badge } from "#/components/ui/badge";
import { Checkbox } from "#/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "#/components/ui/select";
import { getPublicTourbySlug, getTourAddons } from "#/server/actions/tours";
import {
  createBooking,
  getTourDepartures,
  validateCoupon,
  verifyPayment,
} from "#/server/actions/tour-booking";
import type { TourPricingTier, TourAddOn } from "@repo/types/domestic/tour";
import { TourDetailError } from "#/components/common/domestic/tour-details-error";
import { BookingSkeleton } from "#/components/common/domestic/tour-booking-skeleton";
import { TourDetailNotFound } from "#/components/common/domestic/tour-details-not-found";

// ─── Types ────────────────────────────────────────────────────────────────────
// Move these into @repo/types once the server functions return them.

type RoomType = "single" | "double" | "triple" | "quad" | "child";
type Gender = "male" | "female" | "other";
type PaymentMethod = "upi" | "card" | "netbanking";

type DepartureOption = {
  id: string;
  code: string;
  startDate: Date | string;
  endDate: Date | string;
  price: number;
  discountedPrice: number | null;
  totalSeats: number;
  availableSeats: number;
  status: "scheduled" | "full" | "closed" | "cancelled" | "completed";
  bookingDeadline: Date | string | null;
  isGuaranteed: boolean;
  notes: string | null;
  pricing: { roomType: RoomType; price: number }[]; // from departure_pricing
};

type AppliedCoupon = {
  id: string;
  code: string;
  title: string | null;
  type: "percentage" | "flat";
  value: number;
  maxDiscountAmount: number | null;
};

type TourSummary = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  pricingTiers: TourPricingTier[];
  minAge: number;
  maxAge: number;
  minGroupSize: number;
  maxGroupSize: number | null;
  cancellationPolicySummary: string | null;
};

type TripState = {
  departureId: string;
  roomType: RoomType | "";
  adults: number;
  children: number;
  tier: string;
};

type TravellerInput = {
  firstName: string;
  lastName: string;
  age: string;
  gender: Gender;
};

type ContactData = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  specialRequests: string;
  agreeTerms: boolean;
};

type Errors = Record<string, string>;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (res: any) => void) => void;
    };
  }
}

// ─── Constants & schemas ──────────────────────────────────────────────────────

const BRAND_NAME = "Your Travel Brand";
const GST_RATE = 0.05;
const CHILD_MAX_AGE = 11; // 12+ is priced as adult
const MAX_GUESTS = 20;
const LOW_SEATS_THRESHOLD = 5;

const ROOM_LABELS: Record<RoomType, { label: string; hint: string }> = {
  single: { label: "Single", hint: "1 person per room" },
  double: { label: "Double sharing", hint: "2 per room" },
  triple: { label: "Triple sharing", hint: "3 per room" },
  quad: { label: "Quad sharing", hint: "4 per room" },
  child: { label: "Child", hint: "Child rate" },
};

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, description: "All major banks" },
] as const;

const STEPS = [
  { id: 1, label: "Departure" },
  { id: 2, label: "Travellers" },
  { id: 3, label: "Add-ons & Contact" },
  { id: 4, label: "Payment" },
];

const bookSearchSchema = z.object({
  tier: z.string().optional(),
  departure: z.string().optional(),
});

const travellerSchema = z.object({
  firstName: z.string().trim().min(1, "Required"),
  lastName: z.string().trim().min(1, "Required"),
  age: z.string().min(1, "Required"),
  gender: z.enum(["male", "female", "other"]),
});

const contactSchema = z.object({
  contactName: z.string().trim().min(2, "Name must be at least 2 characters"),
  contactEmail: z.email("Enter a valid email"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  city: z.string().trim().min(2, "Required"),
  specialRequests: z.string().max(500, "Max 500 characters").optional(),
  agreeTerms: z.boolean().refine((v) => v, "You must agree to the terms"),
});

export const Route = createFileRoute("/domestic/tours/$slug/book")({
  validateSearch: bookSearchSchema,
  notFoundComponent: () => <TourDetailNotFound />,
  component: BookingPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const nightsBetween = (a: Date | string, b: Date | string) =>
  Math.max(1, Math.round((+new Date(b) - +new Date(a)) / 86_400_000));

function zodErrors(err: z.ZodError, prefix = ""): Errors {
  const out: Errors = {};
  for (const issue of err.issues) {
    const key = [prefix, ...issue.path].filter((p) => p !== "").join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function isDepartureBookable(d: DepartureOption) {
  const now = Date.now();
  if (d.status !== "scheduled" || d.availableSeats < 1) return false;
  if (+new Date(d.startDate) <= now) return false;
  if (d.bookingDeadline && +new Date(d.bookingDeadline) <= now) return false;
  return true;
}

function departureBlockedReason(d: DepartureOption) {
  if (d.status === "full" || d.availableSeats < 1) return "Sold out";
  if (d.status !== "scheduled") return "Closed";
  if (d.bookingDeadline && +new Date(d.bookingDeadline) <= Date.now()) return "Booking closed";
  if (+new Date(d.startDate) <= Date.now()) return "Departed";
  return null;
}

function roomPrice(dep: DepartureOption | undefined, room: RoomType | "") {
  if (!dep || !room) return undefined;
  return dep.pricing.find((p) => p.roomType === room)?.price;
}

function makeTravellers(count: number, existing: TravellerInput[] = []): TravellerInput[] {
  return Array.from({ length: count }, (_, i) =>
    existing[i] ?? { firstName: "", lastName: "", age: "", gender: "male" as Gender }
  );
}

function computeDiscount(base: number, coupon: AppliedCoupon | null) {
  if (!coupon) return 0;
  let d = coupon.type === "percentage" ? Math.round((base * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscountAmount) d = Math.min(d, coupon.maxDiscountAmount);
  return Math.min(d, base);
}

// UI estimate only. The server must recompute everything from IDs.
function computePricing(args: {
  departure?: DepartureOption;
  tier?: TourPricingTier;
  roomType: RoomType | "";
  adults: number;
  children: number;
  addons: TourAddOn[];
  coupon: AppliedCoupon | null;
}) {
  const { departure, tier, roomType, adults, children, addons, coupon } = args;
  const guests = adults + children;

  const fallback = departure ? (departure.discountedPrice ?? departure.price) : (tier?.price ?? 0);
  const adultUnit = roomPrice(departure, roomType) ?? fallback;
  const childUnit = roomPrice(departure, "child") ?? adultUnit;

  const adultsTotal = adultUnit * adults;
  const childrenTotal = childUnit * children;
  const base = adultsTotal + childrenTotal;

  const addOnsTotal = addons.reduce(
    (sum, a) => sum + (a.perPerson ? a.price * guests : a.price), 0
  );
  const discount = computeDiscount(base, coupon);
  const subtotal = base + addOnsTotal - discount;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return { adultUnit, childUnit, adultsTotal, childrenTotal, base, addOnsTotal, discount, subtotal, gst, total };
}
type Pricing = ReturnType<typeof computePricing>;

let razorpayPromise: Promise<boolean> | null = null;
function loadRazorpay() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  razorpayPromise ??= new Promise<boolean>((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => { razorpayPromise = null; resolve(false); };
    document.body.appendChild(s);
  });
  return razorpayPromise;
}

// ─── Page (data loading) ──────────────────────────────────────────────────────

function BookingPage() {
  const { slug } = Route.useParams();
  const fetchTour = useServerFn(getPublicTourbySlug);
  const fetchAddons = useServerFn(getTourAddons);
  const fetchDepartures = useServerFn(getTourDepartures);

  const tourQ = useQuery({
    queryKey: ["tour", slug],
    queryFn: () => fetchTour({ data: { slug } }),
  });
  const tourId = tourQ.data?.id;

  const addonsQ = useQuery({
    queryKey: ["tour-addons"],
    queryFn: () => fetchAddons(),
  });

  const departuresQ = useQuery({
    queryKey: ["tour-departures", tourId],
    queryFn: () => fetchDepartures({ data: { tourId: tourId! } }),
    enabled: !!tourId,
  });

  if (tourQ.isPending) return <BookingSkeleton />;
  if (tourQ.isError)
    return <TourDetailError error={tourQ.error} onRetry={() => tourQ.refetch()} isRetrying={tourQ.isRefetching} />;
  if (!tourQ.data || !tourQ.data.destination) throw notFound();

  if (addonsQ.isError)
    return <TourDetailError error={addonsQ.error} onRetry={() => addonsQ.refetch()} isRetrying={addonsQ.isRefetching} />;
  if (departuresQ.isError)
    return <TourDetailError error={departuresQ.error} onRetry={() => departuresQ.refetch()} isRetrying={departuresQ.isRefetching} />;
  if (addonsQ.isPending || departuresQ.isPending) return <BookingSkeleton />;

  const t = tourQ.data;
  const tour: TourSummary = {
    id: t.id,
    slug: t.slug,
    title: t.title,
    destination: t.destination,
    state: t.state ?? "N/A",
    duration: `${t.durationDays}D / ${t.durationNights}N`,
    rating: t.rating,
    reviewCount: t.reviewCount,
    image: t.featuredImage ?? t.images?.[0],
    pricingTiers: t.pricingTiers ?? [],
    minAge: t.minAge ?? 0,
    maxAge: t.maxAge ?? 100,
    minGroupSize: t.minGroupSize ?? 1,
    maxGroupSize: t.maxGroupSize ?? null,
    cancellationPolicySummary: t.cancellationPolicySummary ?? null,
  };

  return (
    <BookingWizard
      tour={tour}
      addons={addonsQ.data as TourAddOn[]}
      departures={departuresQ.data as DepartureOption[]}
    />
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

function BookingWizard({
  tour, addons, departures,
}: {
  tour: TourSummary;
  addons: TourAddOn[];
  departures: DepartureOption[];
}) {
  const { tier: tierFromUrl, departure: departureFromUrl } = Route.useSearch();
  const createBookingOrder = useServerFn(createBooking);
  const verifyPaymentFn = useServerFn(verifyPayment);

  const sortedDepartures = useMemo(
    () => [...departures].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate)),
    [departures]
  );

  const defaultTier =
    tour.pricingTiers.find((t) => t.label === tierFromUrl) ?? tour.pricingTiers[0];

  const initialDeparture =
    sortedDepartures.find((d) => d.id === departureFromUrl && isDepartureBookable(d)) ??
    sortedDepartures.find(isDepartureBookable);

  const pickRoom = (dep?: DepartureOption): RoomType | "" =>
    dep?.pricing.find((p) => p.roomType === "double")?.roomType ??
    dep?.pricing.find((p) => p.roomType !== "child")?.roomType ?? "";

  const [step, setStep] = useState(1);
  const [trip, setTrip] = useState<TripState>({
    departureId: initialDeparture?.id ?? "",
    roomType: pickRoom(initialDeparture),
    adults: Math.min(2, initialDeparture?.availableSeats ?? 2),
    children: 0,
    tier: defaultTier?.label ?? "",
  });
  const [travellers, setTravellers] = useState<TravellerInput[]>(() =>
    makeTravellers(Math.min(2, initialDeparture?.availableSeats ?? 2))
  );
  const [contact, setContact] = useState<ContactData>({
    contactName: "", contactEmail: "", contactPhone: "", city: "",
    specialRequests: "", agreeTerms: false,
  });
  const [selectedAddOns, setSelectedAddOns] = useState<TourAddOn[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [promoCode, setPromoCode] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ bookingRef: string; amount: number } | null>(null);

  const pending = useRef<{ sig: string; booking: any } | null>(null);
  const validateCouponFn = useServerFn(validateCoupon);

  const departure = sortedDepartures.find((d) => d.id === trip.departureId);
  const selectedTier = tour.pricingTiers.find((t) => t.label === trip.tier) ?? tour.pricingTiers[0];
  const guests = trip.adults + trip.children;

  const pricing = useMemo(
    () => computePricing({
      departure, tier: selectedTier, roomType: trip.roomType,
      adults: trip.adults, children: trip.children, addons: selectedAddOns, coupon,
    }),
    [departure, selectedTier, trip.roomType, trip.adults, trip.children, selectedAddOns, coupon]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    pending.current = null;
  }, [trip, travellers, contact, selectedAddOns, coupon, paymentMethod]);

  // ── Trip handlers ──
  const maxGuests = Math.min(
    MAX_GUESTS,
    tour.maxGroupSize ?? MAX_GUESTS,
    departure?.availableSeats ?? MAX_GUESTS
  );

  const selectDeparture = (dep: DepartureOption) => {
    if (!isDepartureBookable(dep)) return;
    const cap = Math.min(MAX_GUESTS, tour.maxGroupSize ?? MAX_GUESTS, dep.availableSeats);
    let adults = Math.min(trip.adults, cap);
    let children = Math.min(trip.children, Math.max(0, cap - adults));
    if (adults < 1) adults = 1;
    setTrip({ ...trip, departureId: dep.id, roomType: pickRoom(dep), adults, children });
    setTravellers((prev) => makeTravellers(adults + children, prev));
    setCoupon(null);
    setCouponError(null);
    setErrors({});
  };

  const setCounts = (adults: number, children: number) => {
    setTrip((t) => ({ ...t, adults, children }));
    setTravellers((prev) => makeTravellers(adults + children, prev));
  };

  const toggleAddOn = (addon: TourAddOn) =>
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon]
    );

  // ── Validation per step ──
  const validateStep1 = () => {
    const e: Errors = {};
    if (!departure) e.departureId = "Please select a departure date";
    else if (!isDepartureBookable(departure)) e.departureId = "This departure is no longer available";
    if (!trip.tier) e.tier = "Please select a package tier";
    if (departure?.pricing.length && !trip.roomType) e.roomType = "Please select a room type";
    if (guests < tour.minGroupSize) e.guests = `Minimum group size is ${tour.minGroupSize}`;
    if (departure && guests > departure.availableSeats)
      e.guests = `Only ${departure.availableSeats} seats left on this departure`;
    if (trip.adults < 1) e.guests = "At least one adult is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Errors = {};
    travellers.forEach((t, i) => {
      const r = travellerSchema.safeParse(t);
      if (!r.success) Object.assign(e, zodErrors(r.error, `t${i}`));
      const age = Number(t.age);
      const isChild = i >= trip.adults;
      if (t.age && !e[`t${i}.age`]) {
        if (!Number.isInteger(age) || age < 1) e[`t${i}.age`] = "Enter a valid age";
        else if (age < tour.minAge) e[`t${i}.age`] = `Minimum age is ${tour.minAge}`;
        else if (age > tour.maxAge) e[`t${i}.age`] = `Maximum age is ${tour.maxAge}`;
        else if (isChild && age > CHILD_MAX_AGE) e[`t${i}.age`] = `Children must be ${CHILD_MAX_AGE} or under`;
        else if (!isChild && age <= CHILD_MAX_AGE) e[`t${i}.age`] = `Adults must be ${CHILD_MAX_AGE + 1}+`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const r = contactSchema.safeParse(contact);
    const e = r.success ? {} : zodErrors(r.error);
    setErrors(e);
    return r.success;
  };

  const goNext = (from: number) => {
    const ok = from === 1 ? validateStep1() : from === 2 ? validateStep2() : validateStep3();
    if (!ok) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    if (from === 2 && !contact.contactName) {
      const p = travellers[0];
      setContact((c) => ({ ...c, contactName: `${p.firstName} ${p.lastName}`.trim() }));
    }
    setErrors({});
    setStep(from + 1);
  };

  const goBack = (from: number) => {
    setErrors({});
    setStep(from - 1);
  };

  // ── Coupon ──
  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code || !departure) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await validateCouponFn({
        data: { code, tourId: tour.id, departureId: departure.id, amount: pricing.base },
      });
      setCoupon(res);
      toast.success(`Coupon ${res.code} applied`);
    } catch (err) {
      setCoupon(null);
      setCouponError(err instanceof Error ? err.message : "Invalid or expired coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removePromo = () => {
    setCoupon(null);
    setPromoCode("");
    setCouponError(null);
  };

  // ── Payment ──
  const buildPayload = () => ({
    tourId: tour.id,
    departureId: trip.departureId,
    tier: trip.tier,
    roomType: trip.roomType || null,
    adultCount: trip.adults,
    childCount: trip.children,
    travellers: travellers.map((t, i) => ({
      firstName: t.firstName.trim(),
      lastName: t.lastName.trim(),
      age: Number(t.age),
      gender: t.gender,
      isPrimary: i === 0,
    })),
    contactName: contact.contactName.trim(),
    contactEmail: contact.contactEmail.trim().toLowerCase(),
    contactPhone: contact.contactPhone,
    contactCity: contact.city.trim(),
    specialRequests: contact.specialRequests.trim() || null,
    addonIds: selectedAddOns.map((a) => a.id),
    couponCode: coupon?.code ?? null,
    paymentMethod,
    source: "website" as const,
  });

  const handleConfirmBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const sig = JSON.stringify(payload);

      let booking = pending.current?.sig === sig ? pending.current.booking : null;
      if (!booking) {
        booking = await createBookingOrder({ data: payload });
        pending.current = { sig, booking };
      }

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) throw new Error("Could not load the payment gateway. Check your connection.");

      const rzp = new window.Razorpay({
        key: booking.razorpay.keyId,
        order_id: booking.razorpay.orderId,
        amount: booking.razorpay.amountPaise,
        currency: "INR",
        name: BRAND_NAME,
        description: tour.title,
        prefill: {
          name: contact.contactName,
          email: contact.contactEmail,
          contact: contact.contactPhone,
          method: paymentMethod,
        },
        notes: { bookingRef: booking.bookingRef },
        theme: { color: "#0f766e" },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.info("Payment cancelled. Your seats are held for a short time, so you can retry.");
          },
        },
        handler: async (res: any) => {
          try {
            await verifyPaymentFn({
              data: {
                bookingId: booking.bookingId,
                razorpayOrderId: res.razorpay_order_id,
                razorpayPaymentId: res.razorpay_payment_id,
                razorpaySignature: res.razorpay_signature,
              },
            });
            setConfirmed({ bookingRef: booking.bookingRef, amount: booking.amount });
            setStep(5);
          } catch {
            toast.error(
              `Payment received but verification failed. Please contact support with reference ${booking.bookingRef}.`,
              { duration: 15000 }
            );
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      rzp.on("payment.failed", (res: any) => {
        setIsSubmitting(false);
        toast.error(res?.error?.description ?? "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (step === 5 && confirmed && departure) {
    return <ConfirmationScreen tour={tour} departure={departure} bookingRef={confirmed.bookingRef} amount={confirmed.amount} />;
  }

  return (
    <main className="min-h-screen bg-muted/20 pb-24 lg:pb-0">
      <div className="border-b bg-background sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Link
            to="/domestic/tours/$slug"
            params={{ slug: tour.slug }}
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
        <StepIndicator currentStep={step} steps={STEPS} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <Step1Departure
                tour={tour}
                departures={sortedDepartures}
                trip={trip}
                setTrip={setTrip}
                departure={departure}
                maxGuests={maxGuests}
                errors={errors}
                onSelectDeparture={selectDeparture}
                onCounts={setCounts}
                onNext={() => goNext(1)}
              />
            )}
            {step === 2 && (
              <Step2Travellers
                travellers={travellers}
                adults={trip.adults}
                errors={errors}
                onChange={setTravellers}
                onBack={() => goBack(2)}
                onNext={() => goNext(2)}
              />
            )}
            {step === 3 && (
              <Step3AddOns
                addOns={addons}
                selected={selectedAddOns}
                guestCount={guests}
                onToggle={toggleAddOn}
                contact={contact}
                onContactChange={setContact}
                errors={errors}
                onBack={() => goBack(3)}
                onNext={() => goNext(3)}
              />
            )}
            {step === 4 && (
              <Step4Payment
                paymentMethod={paymentMethod}
                onPaymentChange={setPaymentMethod}
                promoCode={promoCode}
                onPromoChange={setPromoCode}
                coupon={coupon}
                couponError={couponError}
                couponLoading={couponLoading}
                onApplyPromo={applyPromo}
                onRemovePromo={removePromo}
                pricing={pricing}
                isSubmitting={isSubmitting}
                onBack={() => goBack(4)}
                onConfirm={handleConfirmBooking}
              />
            )}
          </div>

          <aside className="lg:col-span-1">
            <OrderSummary
              tour={tour}
              departure={departure}
              trip={trip}
              selectedTier={selectedTier}
              selectedAddOns={selectedAddOns}
              pricing={pricing}
              coupon={coupon}
            />
          </aside>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-background px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Estimated total</p>
          <p className="font-bold text-lg text-primary">{inr(pricing.total)}</p>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {departure ? fmtDate(departure.startDate) : "No departure selected"}
          <br />
          {guests} {guests === 1 ? "guest" : "guests"}
        </p>
      </div>
    </main>
  );
}

// ─── Small UI bits ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive flex items-center gap-1 mt-1" role="alert">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

function Counter({
  label, hint, value, min, max, onChange,
}: {
  label: string; hint: string; value: number; min: number; max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-lg font-bold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
          aria-label={`Increase ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function StepIndicator({
  currentStep, steps,
}: {
  currentStep: number; steps: { id: number; label: string }[];
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
                  className={cn("flex-1 h-0.5 mx-2 mb-4 transition-colors", done ? "bg-primary" : "bg-border")}
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

// ─── Step 1 — Departure, room, guests, tier ───────────────────────────────────

function Step1Departure({
  tour, departures, trip, setTrip, departure, maxGuests, errors,
  onSelectDeparture, onCounts, onNext,
}: {
  tour: TourSummary;
  departures: DepartureOption[];
  trip: TripState;
  setTrip: (t: TripState) => void;
  departure?: DepartureOption;
  maxGuests: number;
  errors: Errors;
  onSelectDeparture: (d: DepartureOption) => void;
  onCounts: (adults: number, children: number) => void;
  onNext: () => void;
}) {
  const guests = trip.adults + trip.children;
  const hasBookable = departures.some(isDepartureBookable);
  const rooms = departure?.pricing.filter((p) => p.roomType !== "child") ?? [];

  return (
    <div className="space-y-5">
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            Choose your departure
          </h2>
          <p className="text-sm text-muted-foreground">
            Fixed-date group departures. Prices and seats are per departure.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {departures.length === 0 || !hasBookable ? (
            <div className="rounded-xl border border-dashed p-6 text-center space-y-2">
              <p className="font-semibold text-sm">No departures open for booking</p>
              <p className="text-xs text-muted-foreground">
                All scheduled batches are full or closed. Check the tour page or contact us for a custom date.
              </p>
            </div>
          ) : null}

          {departures.map((dep) => {
            const blocked = departureBlockedReason(dep);
            const selected = trip.departureId === dep.id;
            const unit = dep.discountedPrice ?? dep.price;
            const lowSeats = !blocked && dep.availableSeats <= LOW_SEATS_THRESHOLD;
            return (
              <button
                key={dep.id}
                type="button"
                disabled={!!blocked}
                onClick={() => onSelectDeparture(dep)}
                aria-pressed={selected}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all",
                  selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/60 hover:border-primary/50",
                  blocked && "opacity-50 cursor-not-allowed hover:border-border/60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-sm">
                      {fmtDate(dep.startDate)} → {fmtDate(dep.endDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nightsBetween(dep.startDate, dep.endDate)} nights · Code {dep.code}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {blocked && <Badge variant="secondary" className="text-xs">{blocked}</Badge>}
                      {lowSeats && (
                        <Badge variant="destructive" className="text-xs">
                          Only {dep.availableSeats} seats left
                        </Badge>
                      )}
                      {!blocked && !lowSeats && (
                        <Badge variant="secondary" className="text-xs">
                          {dep.availableSeats} seats available
                        </Badge>
                      )}
                      {dep.isGuaranteed && (
                        <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-600">
                          <CheckCircle2 size={10} />
                          Guaranteed departure
                        </Badge>
                      )}
                    </div>
                    {dep.bookingDeadline && !blocked && (
                      <p className="text-xs text-muted-foreground">
                        Book by {fmtDate(dep.bookingDeadline)}
                      </p>
                    )}
                    {dep.notes && <p className="text-xs text-muted-foreground">{dep.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary text-sm">{inr(unit)}</p>
                    {dep.discountedPrice && dep.discountedPrice < dep.price && (
                      <p className="text-xs text-muted-foreground line-through">{inr(dep.price)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">/person</p>
                  </div>
                </div>
              </button>
            );
          })}
          <FieldError message={errors.departureId} />
        </CardContent>
      </Card>

      {rooms.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BedDouble size={16} className="text-primary" />
              Room type
            </h2>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={trip.roomType}
              onValueChange={(v) => setTrip({ ...trip, roomType: v as RoomType })}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {rooms.map((r) => (
                <Label
                  key={r.roomType}
                  htmlFor={`room-${r.roomType}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all",
                    trip.roomType === r.roomType
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/60 hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={r.roomType} id={`room-${r.roomType}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{ROOM_LABELS[r.roomType].label}</p>
                    <p className="text-xs text-muted-foreground font-normal">{ROOM_LABELS[r.roomType].hint}</p>
                  </div>
                  <span className="font-bold text-sm text-primary">{inr(r.price)}</span>
                </Label>
              ))}
            </RadioGroup>
            <FieldError message={errors.roomType} />
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Users size={16} className="text-primary" />
            Who's travelling?
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <Counter
            label="Adults"
            hint={`Age ${CHILD_MAX_AGE + 1}+`}
            value={trip.adults}
            min={1}
            max={Math.max(1, maxGuests - trip.children)}
            onChange={(n) => onCounts(n, trip.children)}
          />
          <Counter
            label="Children"
            hint={`Age ${tour.minAge || 2}–${CHILD_MAX_AGE}`}
            value={trip.children}
            min={0}
            max={Math.max(0, maxGuests - trip.adults)}
            onChange={(n) => onCounts(trip.adults, n)}
          />
          <p className="text-xs text-muted-foreground">
            {guests} {guests === 1 ? "guest" : "guests"} selected
            {departure && ` · ${departure.availableSeats} seats left on this departure`}
            {tour.minGroupSize > 1 && ` · minimum ${tour.minGroupSize} per booking`}
          </p>
          {guests >= 6 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Tag size={11} />
              Ask about group discounts after booking
            </Badge>
          )}
          <FieldError message={errors.guests} />
        </CardContent>
      </Card>

      {tour.pricingTiers.length > 1 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="text-base font-bold">Package tier</h2>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {tour.pricingTiers.map((tier) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => setTrip({ ...trip, tier: tier.label })}
                className={cn(
                  "w-full text-left rounded-xl border p-3.5 transition-all",
                  trip.tier === tier.label
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/60 hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      trip.tier === tier.label ? "border-primary" : "border-muted-foreground"
                    )}
                  >
                    {trip.tier === tier.label && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <span className="font-semibold text-sm">{tier.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">{tier.description}</p>
              </button>
            ))}
            <FieldError message={errors.tier} />
          </CardContent>
        </Card>
      )}

      <Button className="w-full gap-2" size="lg" disabled={!departure} onClick={onNext}>
        Continue to Traveller Details
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

// ─── Step 2 — Travellers ──────────────────────────────────────────────────────

function Step2Travellers({
  travellers, adults, errors, onChange, onBack, onNext,
}: {
  travellers: TravellerInput[];
  adults: number;
  errors: Errors;
  onChange: (t: TravellerInput[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const update = (i: number, field: keyof TravellerInput, value: string) =>
    onChange(travellers.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  return (
    <div className="space-y-4">
      {travellers.map((t, i) => {
        const isChild = i >= adults;
        return (
          <Card key={i} className="border-border/60">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {i + 1}
                </span>
                Traveller {i + 1}
                {i === 0 && <Badge variant="secondary" className="text-xs ml-1">Primary</Badge>}
                {isChild && <Badge variant="outline" className="text-xs ml-1">Child</Badge>}
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`fn-${i}`} className="text-xs">First name</Label>
                  <Input
                    id={`fn-${i}`}
                    placeholder="Rahul"
                    autoComplete={i === 0 ? "given-name" : "off"}
                    value={t.firstName}
                    aria-invalid={!!errors[`t${i}.firstName`]}
                    onChange={(e) => update(i, "firstName", e.target.value)}
                  />
                  <FieldError message={errors[`t${i}.firstName`]} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`ln-${i}`} className="text-xs">Last name</Label>
                  <Input
                    id={`ln-${i}`}
                    placeholder="Sharma"
                    autoComplete={i === 0 ? "family-name" : "off"}
                    value={t.lastName}
                    aria-invalid={!!errors[`t${i}.lastName`]}
                    onChange={(e) => update(i, "lastName", e.target.value)}
                  />
                  <FieldError message={errors[`t${i}.lastName`]} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`age-${i}`} className="text-xs">Age</Label>
                  <Input
                    id={`age-${i}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={100}
                    placeholder={isChild ? "8" : "28"}
                    value={t.age}
                    aria-invalid={!!errors[`t${i}.age`]}
                    onChange={(e) => update(i, "age", e.target.value)}
                  />
                  <FieldError message={errors[`t${i}.age`]} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`gender-${i}`} className="text-xs">Gender</Label>
                  <Select value={t.gender} onValueChange={(v) => update(i, "gender", v)}>
                    <SelectTrigger id={`gender-${i}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button className="flex-1 gap-2" size="lg" onClick={onNext}>
          Continue to Add-ons
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 — Add-ons + Contact ───────────────────────────────────────────────

function Step3AddOns({
  addOns, selected, guestCount, onToggle, contact, onContactChange, errors, onBack, onNext,
}: {
  addOns: TourAddOn[];
  selected: TourAddOn[];
  guestCount: number;
  onToggle: (a: TourAddOn) => void;
  contact: ContactData;
  onContactChange: (d: ContactData) => void;
  errors: Errors;
  onBack: () => void;
  onNext: () => void;
}) {
  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) =>
    onContactChange({ ...contact, [k]: v });

  return (
    <div className="space-y-5">
      {addOns.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-bold">Optional add-ons</h2>
            <p className="text-sm text-muted-foreground">Enhance your trip with these extras.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {addOns.map((addon) => {
              const isSelected = selected.some((a) => a.id === addon.id);
              const addonPrice = addon.perPerson ? addon.price * guestCount : addon.price;
              return (
                <div
                  key={addon.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggle(addon)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggle(addon);
                    }
                  }}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 transition-all cursor-pointer",
                    isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/60 hover:border-primary/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={isSelected} className="mt-0.5 pointer-events-none" aria-label={addon.label} />
                      <div>
                        <p className="font-semibold text-sm">{addon.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-primary">+{inr(addonPrice)}</p>
                      {addon.perPerson && (
                        <p className="text-xs text-muted-foreground">{inr(addon.price)}/person</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold">Contact details</h2>
          <p className="text-sm text-muted-foreground">Your booking confirmation will be sent here.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name" className="text-xs flex items-center gap-1.5">
              <User size={13} className="text-primary" />
              Full name
            </Label>
            <Input
              id="contact-name"
              placeholder="Rahul Sharma"
              autoComplete="name"
              value={contact.contactName}
              aria-invalid={!!errors.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
            <FieldError message={errors.contactName} />
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
                autoComplete="email"
                value={contact.contactEmail}
                aria-invalid={!!errors.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
              />
              <FieldError message={errors.contactEmail} />
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
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="9876543210"
                  value={contact.contactPhone}
                  aria-invalid={!!errors.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value.replace(/\D/g, ""))}
                  className="rounded-l-none"
                />
              </div>
              <FieldError message={errors.contactPhone} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-city" className="text-xs flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              Your city
            </Label>
            <Input
              id="contact-city"
              placeholder="Vadodara"
              autoComplete="address-level2"
              value={contact.city}
              aria-invalid={!!errors.city}
              onChange={(e) => set("city", e.target.value)}
              className="max-w-xs"
            />
            <FieldError message={errors.city} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="special-requests" className="text-xs">
              Special requests <span className="text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="special-requests"
              rows={3}
              maxLength={500}
              placeholder="Dietary requirements, medical conditions, room preferences..."
              value={contact.specialRequests}
              onChange={(e) => set("specialRequests", e.target.value)}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <FieldError message={errors.specialRequests} />
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="agree-terms"
                checked={contact.agreeTerms}
                onCheckedChange={(v) => set("agreeTerms", !!v)}
              />
              <Label htmlFor="agree-terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link to="/domestic/terms" className="text-primary underline underline-offset-2" target="_blank">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link to="/domestic/cancellation-policy" className="text-primary underline underline-offset-2" target="_blank">
                  Cancellation Policy
                </Link>
                .
              </Label>
            </div>
            <FieldError message={errors.agreeTerms} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button className="flex-1 gap-2" size="lg" onClick={onNext}>
          Continue to Payment
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4 — Payment ─────────────────────────────────────────────────────────

function Step4Payment({
  paymentMethod, onPaymentChange, promoCode, onPromoChange, coupon, couponError,
  couponLoading, onApplyPromo, onRemovePromo, pricing, isSubmitting, onBack, onConfirm,
}: {
  paymentMethod: PaymentMethod;
  onPaymentChange: (v: PaymentMethod) => void;
  promoCode: string;
  onPromoChange: (v: string) => void;
  coupon: AppliedCoupon | null;
  couponError: string | null;
  couponLoading: boolean;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  pricing: Pricing;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-5">
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Tag size={15} className="text-primary" />
            Coupon
          </h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {coupon ? (
            <div className="flex items-center justify-between gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>
                  <strong>{coupon.code}</strong> applied — you save {inr(pricing.discount)}
                </span>
              </span>
              <button type="button" onClick={onRemovePromo} className="text-xs underline">
                Remove
              </button>
            </div>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                onApplyPromo();
              }}
            >
              <Input
                placeholder="Enter coupon code"
                value={promoCode}
                onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button type="submit" variant="outline" disabled={!promoCode || couponLoading} className="shrink-0">
                {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
              </Button>
            </form>
          )}
          <FieldError message={couponError ?? undefined} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-bold">Preferred payment method</h2>
          <p className="text-sm text-muted-foreground">
            You can still switch methods inside the Razorpay window.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={paymentMethod} onValueChange={(v) => onPaymentChange(v as PaymentMethod)}>
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <Label
                  key={m.id}
                  htmlFor={m.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
                    paymentMethod === m.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/60 hover:border-primary/40"
                  )}
                >
                  <RadioGroupItem value={m.id} id={m.id} />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-muted-foreground font-normal">{m.description}</p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-green-600" />
              Payments processed by Razorpay
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20 p-4 flex items-start gap-2.5 text-sm text-blue-800 dark:text-blue-300">
        <Info size={15} className="shrink-0 mt-0.5" />
        <p>
          You won't be charged yet. Clicking the button creates your booking and opens Razorpay.
          Seats are confirmed only after the payment succeeds. The final amount is recalculated
          securely on our server.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={15} />
          Back
        </Button>
        <Button className="flex-1 gap-2" size="lg" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm &amp; Pay {inr(pricing.total)}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Order summary ────────────────────────────────────────────────────────────

function OrderSummary({
  tour, departure, trip, selectedTier, selectedAddOns, pricing, coupon,
}: {
  tour: TourSummary;
  departure?: DepartureOption;
  trip: TripState;
  selectedTier?: TourPricingTier;
  selectedAddOns: TourAddOn[];
  pricing: Pricing;
  coupon: AppliedCoupon | null;
}) {
  const guests = trip.adults + trip.children;
  const info = [
    { icon: Clock, label: "Duration", value: tour.duration },
    { icon: Users, label: "Guests", value: `${trip.adults} adult${trip.adults > 1 ? "s" : ""}${trip.children ? `, ${trip.children} child${trip.children > 1 ? "ren" : ""}` : ""}` },
    { icon: CalendarDays, label: "Departure", value: departure ? `${fmtDate(departure.startDate)}` : "Not selected" },
    { icon: Star, label: trip.roomType ? "Room" : "Package", value: trip.roomType ? ROOM_LABELS[trip.roomType].label : (selectedTier?.label ?? "-") },
  ];

  return (
    <Card className="border-border/60 sticky top-20 p-0 pb-2">
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-bold text-sm leading-tight">{tour.title}</p>
          <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {tour.destination}
          </p>
        </div>
      </div>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {info.map(({ icon: Icon, label, value }) => (
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

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{inr(pricing.adultUnit)} × {trip.adults} adult{trip.adults > 1 ? "s" : ""}</span>
            <span>{inr(pricing.adultsTotal)}</span>
          </div>
          {trip.children > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>{inr(pricing.childUnit)} × {trip.children} child{trip.children > 1 ? "ren" : ""}</span>
              <span>{inr(pricing.childrenTotal)}</span>
            </div>
          )}

          {selectedAddOns.length > 0 && (
            <div className="space-y-1">
              {selectedAddOns.map((a) => (
                <div key={a.id} className="flex justify-between text-muted-foreground text-xs">
                  <span>+ {a.label}</span>
                  <span>{inr(a.perPerson ? a.price * guests : a.price)}</span>
                </div>
              ))}
            </div>
          )}

          {coupon && pricing.discount > 0 && (
            <div className="flex justify-between text-green-700 dark:text-green-400 text-xs font-medium">
              <span>Coupon ({coupon.code})</span>
              <span>−{inr(pricing.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground text-xs">
            <span>GST ({GST_RATE * 100}%)</span>
            <span>{inr(pricing.gst)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">{inr(pricing.total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Inclusive of GST. Final amount is confirmed at payment.</p>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5">
          <Shield size={12} className="text-green-600 shrink-0 mt-0.5" />
          {tour.cancellationPolicySummary ?? "See the cancellation policy for refund terms."}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

function ConfirmationScreen({
  tour, departure, bookingRef, amount,
}: {
  tour: TourSummary;
  departure: DepartureOption;
  bookingRef: string;
  amount: number;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2 size={40} className="text-green-600" aria-hidden="true" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Booking confirmed 🎉</h1>
          <p className="text-muted-foreground mt-2">
            Payment received. A confirmation is on its way to your email and WhatsApp.
          </p>
        </div>

        <Card className="border-border/60 text-left">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Booking ref</span>
              <Badge variant="secondary" className="font-mono font-bold tracking-wider">{bookingRef}</Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tour</span>
                <span className="font-medium text-right">{tour.title}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Departure</span>
                <span className="font-medium text-right">
                  {fmtDate(departure.startDate)} → {fmtDate(departure.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{tour.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="font-bold text-primary">{inr(amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-left space-y-2.5">
          <p className="text-sm font-semibold">What happens next?</p>
          {[
            "You'll receive a detailed itinerary PDF shortly",
            "Your travel manager will call within 24 hours to confirm logistics",
            "Payment receipt via SMS & email",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link to="/domestic/bookings" className={buttonVariants({ size: "lg", className: "w-full gap-2" })}>
            View my bookings
            <ChevronRight size={16} />
          </Link>
          <Link to="/domestic/tours" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>
            Browse more tours
          </Link>
        </div>
      </div>
    </div>
  );
}

// import {
//   createFileRoute,
//   Link,
//   notFound,
// } from "@tanstack/react-router";
// import { z } from "zod";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   Users,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   Clock,
//   Star,
//   Shield,
//   CheckCircle2,
//   ChevronRight,
//   Plus,
//   Minus,
//   Info,
//   CreditCard,
//   Landmark,
//   Smartphone,
//   Tag,
//   Loader2,
// } from "lucide-react";
// import { useState, useMemo } from "react";
// import { Button, buttonVariants } from "#/components/ui/button";
// import { Input } from "#/components/ui/input";
// import { Label } from "#/components/ui/label";
// import { Badge } from "#/components/ui/badge";
// import { Card, CardContent, CardHeader } from "#/components/ui/card";
// import { Separator } from "#/components/ui/separator";
// import { Checkbox } from "#/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "#/components/ui/select";
// import {
//   TooltipProvider,
// } from "#/components/ui/tooltip";
// import { cn } from "#/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import { useServerFn } from "@tanstack/react-start";
// import { getPublicTourbySlug, getTourAddons } from "#/server/actions/tours";
// import type { TourPricingTier, TourAddOn } from "@repo/types/domestic/tour"
// import { TourDetailError } from "#/components/common/domestic/tour-details-error";
// import { BookingSkeleton } from "#/components/common/domestic/tour-booking-skeleton";
// import { TourDetailNotFound } from "#/components/common/domestic/tour-details-not-found";
// import { toast } from "sonner";
// import { createBooking } from "#/server/actions/tour-booking";
// 
// type TourSummary = {
//   id: string;
//   slug: string;
//   title: string;
//   destination: string;
//   state: string;
//   duration: string;
//   durationDays: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   pricingTiers: TourPricingTier[];
// };
// 
// const bookSearchSchema = z.object({
//   tier: z.string().optional(),
// });
// 
// const travellersSchema = z.object({
//   travelDate: z.string().min(1, "Please select a travel date"),
//   guestCount: z.number().min(1).max(20),
//   tier: z.string().min(1, "Please select a package tier"),
//   travellers: z
//     .array(
//       z.object({
//         firstName: z.string().min(1, "Required"),
//         lastName: z.string().min(1, "Required"),
//         age: z.string().min(1, "Required"),
//         gender: z.enum(["Male", "Female", "Other"]),
//       })
//     )
//     .min(1),
// });
// 
// const contactSchema = z.object({
//   contactName: z.string().min(2, "Name must be at least 2 characters"),
//   contactEmail: z.email("Enter a valid email"),
//   contactPhone: z
//     .string()
//     .min(10, "Enter a valid 10-digit number")
//     .max(10, "Enter a valid 10-digit number"),
//   city: z.string().min(2, "Required"),
//   specialRequests: z.string().optional(),
//   agreeTerms: z.boolean().refine((v) => v, "You must agree to the terms"),
// });
// 
// type TravellersData = z.infer<typeof travellersSchema>;
// type ContactData = z.infer<typeof contactSchema>;
// 
// const ADD_ONS: TourAddOn[] = [
//   {
//     id: "travel-insurance",
//     label: "Travel Insurance",
//     description: "Comprehensive coverage — medical, cancellation & baggage",
//     price: 799,
//     perPerson: true,
//   },
//   {
//     id: "airport-transfer",
//     label: "Airport / Station Pickup",
//     description: "AC cab pickup & drop from nearest airport or railway station",
//     price: 1200,
//     perPerson: false,
//   },
//   {
//     id: "photo-package",
//     label: "Professional Photography",
//     description: "Dedicated photographer for 1 day with 50 edited photos",
//     price: 3500,
//     perPerson: false,
//   },
//   {
//     id: "early-checkin",
//     label: "Early Check-in (Day 1)",
//     description: "Guaranteed room ready from 8 AM on arrival day",
//     price: 1500,
//     perPerson: false,
//   },
// ];
// 
// const PAYMENT_METHODS = [
//   { id: "upi", label: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
//   { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, Rupay" },
//   { id: "netbanking", label: "Net Banking", icon: Landmark, description: "All major banks" },
// ];
// 
// const GST_RATE = 0.05;
// 
// // ─── Steps config ─────────────────────────────────────────────────────────────
// 
// const STEPS = [
//   { id: 1, label: "Trip Details" },
//   { id: 2, label: "Travellers" },
//   { id: 3, label: "Add-ons" },
//   { id: 4, label: "Payment" },
//   { id: 5, label: "Confirmed" },
// ];
// 
// export const Route = createFileRoute("/domestic/tours/$slug/book")({
//   validateSearch: bookSearchSchema,
//   notFoundComponent: () => <TourDetailNotFound />,
//   // Uncomment once you have Better Auth wired:
//   // beforeLoad: async ({ context }) => {
//   //   const user = await getUser();
//   //   if (!user) throw redirect({ to: "/auth/sign-in", search: { redirect: window.location.pathname } });
//   // },
//   component: BookingPage,
// });
// 
// // ─── Page ─────────────────────────────────────────────────────────────────────
// 
// function BookingPage() {
//   const { slug } = Route.useParams();
//   const fetchTourDetails = useServerFn(getPublicTourbySlug);
//   const fetchTourAddOns = useServerFn(getTourAddons);
// 
//   const { data: fetchedTour, isPending, isError, error, refetch, isRefetching } =
//     useQuery({
//       queryKey: ["tour", slug],
//       queryFn: () => fetchTourDetails({ data: { slug } }),
//     });
// 
//   const {
//     data: fetchedAddons,
//     isPending: addonsPending,
//     isError: addonsIsError,
//     error: addonsError,
//     refetch: refetchAddons,
//   } = useQuery({
//     queryKey: ["tour-addons"],
//     queryFn: () => fetchTourAddOns(),
//   });
// 
//   if (isPending) return <BookingSkeleton />;
//   if (isError)
//     return <TourDetailError error={error} onRetry={() => refetch()} isRetrying={isRefetching} />;
//   if (!fetchedTour) throw notFound();
// 
//   if (!fetchedTour.destination) throw notFound();
// 
//   if (addonsIsError) {
//     return (
//       <TourDetailError
//         error={addonsError}
//         onRetry={() => refetchAddons()}
//       />
//     );
//   }
// 
//   const tour: TourSummary = {
//     id: fetchedTour.id,
//     slug: fetchedTour.slug,
//     title: fetchedTour.title,
//     destination: fetchedTour.destination,
//     state: fetchedTour.state ?? "N/A",
//     duration: `${fetchedTour.durationDays}D / ${fetchedTour.durationNights}N`,
//     durationDays: fetchedTour.durationDays,
//     rating: fetchedTour.rating,
//     reviewCount: fetchedTour.reviewCount,
//     image: fetchedTour.featuredImage ?? fetchedTour.images?.[0],
//     pricingTiers: fetchedTour.pricingTiers ?? [],
//   };
// 
//   return <BookingWizard tour={tour} addons={(addonsPending) ? ADD_ONS : fetchedAddons} />;
// }
// 
// function BookingWizard({ tour, addons }: { tour: TourSummary, addons: TourAddOn[] }) {
//   const { tier: tierFromUrl } = Route.useSearch();
//   const createBookingOrder = useServerFn(createBooking);
// 
//   const defaultTier =
//     tour.pricingTiers.find((t) => t.label === tierFromUrl) ??
//     tour.pricingTiers[0];
//   const [step, setStep] = useState(1);
// 
//   // Step 1 & 2 data
//   const [travellersData, setTravellersData] = useState<TravellersData>({
//     travelDate: "",
//     guestCount: 2,
//     tier: defaultTier?.label ?? "",
//     travellers: [
//       { firstName: "", lastName: "", age: "", gender: "Male" },
//       { firstName: "", lastName: "", age: "", gender: "Male" },
//     ],
//   });
// 
//   // Step 3 — contact + terms
//   const [contactData, setContactData] = useState<ContactData>({
//     contactName: "",
//     contactEmail: "",
//     contactPhone: "",
//     city: "",
//     specialRequests: "",
//     agreeTerms: false,
//   });
// 
//   // Step 4 — add-ons & payment
//   const [selectedAddOns, setSelectedAddOns] = useState<TourAddOn[]>([]);
//   const [paymentMethod, setPaymentMethod] = useState<"upi" | "netbanking" | "card">("upi");
//   const [promoCode, setPromoCode] = useState("");
//   const [promoApplied, setPromoApplied] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingId] = useState(
//     () => "FZ" + Math.random().toString(36).slice(2, 8).toUpperCase()
//   );
// 
//   // Pricing calculations
//   const selectedTier =
//     tour.pricingTiers.find((t) => t.label === travellersData.tier) ??
//     tour.pricingTiers[0];
// 
//   const pricing = useMemo(() => {
//     const base = (selectedTier?.price ?? 0) * travellersData.guestCount;
//     const addOnsTotal = selectedAddOns.reduce((sum, addon) => {
//       return sum + (addon.perPerson ? addon.price * travellersData.guestCount : addon.price);
//     }, 0);
//     const discount = promoApplied ? Math.round(base * 0.1) : 0;
//     const subtotal = base + addOnsTotal - discount;
//     const gst = Math.round(subtotal * GST_RATE);
//     const total = subtotal + gst;
//     return { base, addOnsTotal, discount, subtotal, gst, total };
//   }, [selectedTier, travellersData.guestCount, selectedAddOns, promoApplied]);
// 
//   const toggleAddOn = (addon: TourAddOn) =>
//     setSelectedAddOns((prev) =>
//       prev.map((v) => v.id).includes(addon.id) ? prev.filter((a) => a !== addon) : [...prev, addon]
//     );
// 
//   const applyPromo = () => {
//     if (promoCode.trim().toUpperCase() === "WANDER10") setPromoApplied(true);
//   };
// 
//   const handleConfirmBooking = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     try {
//       // Wire to createServerFn:
//       console.log({
//         data: { tourId: tour.id, ...travellersData, ...contactData, addons: selectedAddOns.map(a => a), paymentMethod, amount: pricing.total }
//       })
//       const response = await createBookingOrder({ data: { tourId: tour.id, ...travellersData, ...contactData, addons: selectedAddOns.map(a => a), paymentMethod, amount: pricing.total } });
// 
//       toast.success("Booking created successfully", {
//         description: `Your booking reference is ${response.bookingId}`
//       })
//       setIsSubmitting(false);
//       setStep(5);
//     } catch (err) {
//       console.error("Payment could not be started. Please try again.");
//       toast.error("Payment could not be started. Please try again");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// 
//   if (step === 5) {
//     return <ConfirmationScreen tour={tour} bookingId={bookingId} pricing={pricing} />;
//   }
// 
//   return (
//     <TooltipProvider>
//       <main className="min-h-screen bg-muted/20">
//         {/* ── Top bar ──────────────────────────────────────────────────── */}
//         <div className="border-b bg-background sticky top-0 z-30">
//           <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
//             <Link
//               to="/domestic/tours/$slug"
//               params={{ slug: tour.slug }}
//               className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5" })}
//             >
//               <ArrowLeft size={15} />
//               Back
//             </Link>
//             <Separator orientation="vertical" className="h-5" />
//             <p className="text-sm font-semibold truncate flex-1">{tour.title}</p>
//             <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
//               <Shield size={12} className="text-green-600" />
//               Secure checkout
//             </div>
//           </div>
//         </div>
// 
//         <div className="mx-auto max-w-5xl px-4 py-8">
//           {/* ── Step indicator ───────────────────────────────────────────── */}
//           <StepIndicator currentStep={step} steps={STEPS.slice(0, 4)} />
// 
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
//             {/* ── Left — Step content ──────────────────────────────────────── */}
//             <div className="lg:col-span-2 space-y-4">
//               {step === 1 && (
//                 <Step1TripDetails
//                   tour={tour}
//                   data={travellersData}
//                   onChange={setTravellersData}
//                   onNext={() => setStep(2)}
//                 />
//               )}
//               {step === 2 && (
//                 <Step2Travellers
//                   data={travellersData}
//                   onChange={setTravellersData}
//                   onBack={() => setStep(1)}
//                   onNext={() => setStep(3)}
//                 />
//               )}
//               {step === 3 && (
//                 <Step3AddOns
//                   addOns={addons}
//                   selected={selectedAddOns}
//                   guestCount={travellersData.guestCount}
//                   onToggle={toggleAddOn}
//                   contactData={contactData}
//                   onContactChange={setContactData}
//                   onBack={() => setStep(2)}
//                   onNext={() => setStep(4)}
//                 />
//               )}
//               {step === 4 && (
//                 <Step4Payment
//                   paymentMethod={paymentMethod}
//                   onPaymentChange={setPaymentMethod}
//                   promoCode={promoCode}
//                   onPromoChange={setPromoCode}
//                   promoApplied={promoApplied}
//                   onApplyPromo={applyPromo}
//                   pricing={pricing}
//                   isSubmitting={isSubmitting}
//                   onBack={() => setStep(3)}
//                   onConfirm={handleConfirmBooking}
//                 />
//               )}
//             </div>
// 
//             {/* ── Right — Order summary ──────────────────────────────────── */}
//             <aside className="lg:col-span-1">
//               <OrderSummary
//                 tour={tour}
//                 travellersData={travellersData}
//                 selectedTier={selectedTier}
//                 selectedAddOns={selectedAddOns}
//                 pricing={pricing}
//                 promoApplied={promoApplied}
//               />
//             </aside>
//           </div>
//         </div>
//       </main>
//     </TooltipProvider>
//   );
// }
// 
// // ─── Step Indicator ───────────────────────────────────────────────────────────
// 
// function StepIndicator({
//   currentStep,
//   steps,
// }: {
//   currentStep: number;
//   steps: { id: number; label: string }[];
// }) {
//   return (
//     <nav aria-label="Booking steps">
//       <ol className="flex items-center gap-0">
//         {steps.map((s, i) => {
//           const done = currentStep > s.id;
//           const active = currentStep === s.id;
//           return (
//             <li key={s.id} className="flex items-center flex-1 last:flex-none">
//               <div className="flex flex-col items-center gap-1">
//                 <div
//                   className={cn(
//                     "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all",
//                     done
//                       ? "bg-primary border-primary text-primary-foreground"
//                       : active
//                         ? "border-primary text-primary bg-background"
//                         : "border-border text-muted-foreground bg-background"
//                   )}
//                   aria-current={active ? "step" : undefined}
//                 >
//                   {done ? <CheckCircle2 size={16} /> : s.id}
//                 </div>
//                 <span
//                   className={cn(
//                     "text-xs hidden sm:block",
//                     active ? "text-primary font-semibold" : "text-muted-foreground"
//                   )}
//                 >
//                   {s.label}
//                 </span>
//               </div>
//               {i < steps.length - 1 && (
//                 <div
//                   className={cn(
//                     "flex-1 h-0.5 mx-2 mb-4 transition-colors",
//                     done ? "bg-primary" : "bg-border"
//                   )}
//                   aria-hidden="true"
//                 />
//               )}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }
// 
// // ─── Step 1 — Trip Details ────────────────────────────────────────────────────
// 
// function Step1TripDetails({
//   tour,
//   data,
//   onChange,
//   onNext,
// }: {
//   tour: TourSummary;
//   data: TravellersData;
//   onChange: (d: TravellersData) => void;
//   onNext: () => void;
// }) {
//   const minDate = new Date();
//   minDate.setDate(minDate.getDate() + 7);
//   const minDateStr = minDate.toISOString().split("T")[0];
// 
//   const canProceed = data.travelDate && data.guestCount >= 1 && data.tier;
// 
//   const setGuestCount = (n: number) => {
//     const count = Math.max(1, Math.min(20, n));
//     // Sync travellers array length
//     const current = data.travellers;
//     const updated =
//       count > current.length
//         ? [
//           ...current,
//           ...Array.from({ length: count - current.length }, () => ({
//             firstName: "",
//             lastName: "",
//             age: "",
//             gender: "Male" as const,
//           })),
//         ]
//         : current.slice(0, count);
//     onChange({ ...data, guestCount: count, travellers: updated });
//   };
// 
//   return (
//     <Card className="border-border/60">
//       <CardHeader className="pb-2">
//         <h2 className="text-lg font-bold">Trip Details</h2>
//         <p className="text-sm text-muted-foreground">
//           Select your travel date, group size, and package.
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Travel date */}
//         <div className="space-y-2">
//           <Label htmlFor="travel-date" className="flex items-center gap-1.5">
//             <CalendarDays size={14} className="text-primary" />
//             Travel Date
//           </Label>
//           <Input
//             id="travel-date"
//             type="date"
//             min={minDateStr}
//             value={data.travelDate}
//             onChange={(e) => onChange({ ...data, travelDate: e.target.value })}
//             className="max-w-xs"
//           />
//           <p className="text-xs text-muted-foreground">
//             Tours depart every Friday & Saturday. Booking must be made at least 7 days in advance.
//           </p>
//         </div>
// 
//         <Separator />
// 
//         {/* Guest count */}
//         <div className="space-y-2">
//           <Label className="flex items-center gap-1.5">
//             <Users size={14} className="text-primary" />
//             Number of Guests
//           </Label>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => setGuestCount(data.guestCount - 1)}
//               disabled={data.guestCount <= 1}
//               className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
//               aria-label="Decrease guests"
//             >
//               <Minus size={16} />
//             </button>
//             <span className="w-10 text-center text-lg font-bold tabular-nums">
//               {data.guestCount}
//             </span>
//             <button
//               type="button"
//               onClick={() => setGuestCount(data.guestCount + 1)}
//               disabled={data.guestCount >= 20}
//               className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
//               aria-label="Increase guests"
//             >
//               <Plus size={16} />
//             </button>
//             <span className="text-sm text-muted-foreground">
//               {data.guestCount === 1 ? "person" : "people"}
//             </span>
//           </div>
//           {data.guestCount >= 6 && (
//             <Badge variant="secondary" className="text-xs gap-1">
//               <Tag size={11} />
//               Group discount applied at checkout
//             </Badge>
//           )}
//         </div>
// 
//         <Separator />
// 
//         {/* Tier selection */}
//         <div className="space-y-3">
//           <Label className="flex items-center gap-1.5">
//             Package Tier
//           </Label>
//           <div className="space-y-2.5">
//             {tour.pricingTiers.map((tier) => (
//               <button
//                 key={tier.label}
//                 type="button"
//                 onClick={() => onChange({ ...data, tier: tier.label })}
//                 className={cn(
//                   "w-full text-left rounded-xl border p-3.5 transition-all",
//                   data.tier === tier.label
//                     ? "border-primary bg-primary/5 ring-1 ring-primary"
//                     : "border-border/60 hover:border-primary/50"
//                 )}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={cn(
//                         "h-4 w-4 rounded-full border-2 flex items-center justify-center",
//                         data.tier === tier.label
//                           ? "border-primary"
//                           : "border-muted-foreground"
//                       )}
//                     >
//                       {data.tier === tier.label && (
//                         <div className="h-2 w-2 rounded-full bg-primary" />
//                       )}
//                     </div>
//                     <span className="font-semibold text-sm">{tier.label}</span>
//                   </div>
//                   <span className="font-bold text-primary text-sm">
//                     ₹{tier.price.toLocaleString("en-IN")}{" "}
//                     <span className="font-normal text-xs text-muted-foreground">
//                       /person
//                     </span>
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1 ml-6">
//                   {tier.description}
//                 </p>
//               </button>
//             ))}
//           </div>
//         </div>
// 
//         <Button
//           className="w-full gap-2"
//           size="lg"
//           disabled={!canProceed}
//           onClick={onNext}
//         >
//           Continue to Traveller Details
//           <ArrowRight size={16} />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
// 
// // ─── Step 2 — Travellers ──────────────────────────────────────────────────────
// 
// function Step2Travellers({
//   data,
//   onChange,
//   onBack,
//   onNext,
// }: {
//   data: TravellersData;
//   onChange: (d: TravellersData) => void;
//   onBack: () => void;
//   onNext: () => void;
// }) {
//   const updateTraveller = (
//     i: number,
//     field: keyof TravellersData["travellers"][0],
//     value: string
//   ) => {
//     const updated = data.travellers.map((t, idx) =>
//       idx === i ? { ...t, [field]: value } : t
//     );
//     onChange({ ...data, travellers: updated });
//   };
// 
//   const canProceed = data.travellers.every(
//     (t) => t.firstName && t.lastName && t.age
//   );
// 
//   return (
//     <div className="space-y-4">
//       {data.travellers.map((traveller, i) => (
//         <Card key={i} className="border-border/60">
//           <CardHeader className="pb-3">
//             <h3 className="font-bold text-base flex items-center gap-2">
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
//                 {i + 1}
//               </span>
//               Traveller {i + 1}
//               {i === 0 && (
//                 <Badge variant="secondary" className="text-xs ml-1">
//                   Primary
//                 </Badge>
//               )}
//             </h3>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label htmlFor={`fn-${i}`} className="text-xs">
//                   First Name
//                 </Label>
//                 <Input
//                   id={`fn-${i}`}
//                   placeholder="Rahul"
//                   value={traveller.firstName}
//                   onChange={(e) => updateTraveller(i, "firstName", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor={`ln-${i}`} className="text-xs">
//                   Last Name
//                 </Label>
//                 <Input
//                   id={`ln-${i}`}
//                   placeholder="Sharma"
//                   value={traveller.lastName}
//                   onChange={(e) => updateTraveller(i, "lastName", e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label htmlFor={`age-${i}`} className="text-xs">
//                   Age
//                 </Label>
//                 <Input
//                   id={`age-${i}`}
//                   type="number"
//                   min={1}
//                   max={100}
//                   placeholder="28"
//                   value={traveller.age}
//                   onChange={(e) => updateTraveller(i, "age", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor={`gender-${i}`} className="text-xs">
//                   Gender
//                 </Label>
//                 <Select
//                   value={traveller.gender}
//                   onValueChange={(v) => updateTraveller(i, "gender", v)}
//                 >
//                   <SelectTrigger id={`gender-${i}`}>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
// 
//       <div className="flex gap-3">
//         <Button variant="outline" className="gap-1.5" onClick={onBack}>
//           <ArrowLeft size={15} />
//           Back
//         </Button>
//         <Button
//           className="flex-1 gap-2"
//           size="lg"
//           disabled={!canProceed}
//           onClick={onNext}
//         >
//           Continue to Add-ons
//           <ArrowRight size={16} />
//         </Button>
//       </div>
//     </div>
//   );
// }
// 
// // ─── Step 3 — Add-ons + Contact ───────────────────────────────────────────────
// 
// function Step3AddOns({
//   addOns,
//   selected,
//   guestCount,
//   onToggle,
//   contactData,
//   onContactChange,
//   onBack,
//   onNext,
// }: {
//   addOns: TourAddOn[];
//   selected: TourAddOn[];
//   guestCount: number;
//   onToggle: (addon: TourAddOn) => void;
//   contactData: ContactData;
//   onContactChange: (d: ContactData) => void;
//   onBack: () => void;
//   onNext: () => void;
// }) {
//   const canProceed =
//     contactData.contactName &&
//     contactData.contactEmail &&
//     contactData.contactPhone.length === 10 &&
//     contactData.city &&
//     contactData.agreeTerms;
// 
//   return (
//     <div className="space-y-5">
//       {/* Add-ons */}
//       <Card className="border-border/60">
//         <CardHeader className="pb-2">
//           <h2 className="text-lg font-bold">Optional Add-ons</h2>
//           <p className="text-sm text-muted-foreground">
//             Enhance your trip with these extras.
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {addOns.map((addon) => {
//             const isSelected = selected.map((addon) => addon.id).includes(addon.id);
//             const addonPrice = addon.perPerson
//               ? addon.price * guestCount
//               : addon.price;
//             return (
//               <button
//                 key={addon.id}
//                 type="button"
//                 onClick={() => onToggle(addon)}
//                 className={cn(
//                   "w-full text-left rounded-xl border p-4 transition-all",
//                   isSelected
//                     ? "border-primary bg-primary/5 ring-1 ring-primary"
//                     : "border-border/60 hover:border-primary/40"
//                 )}
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-start gap-3">
//                     <Checkbox
//                       checked={isSelected}
//                       onCheckedChange={() => onToggle(addon)}
//                       className="mt-0.5"
//                       aria-label={addon.label}
//                     />
//                     <div>
//                       <p className="font-semibold text-sm">{addon.label}</p>
//                       <p className="text-xs text-muted-foreground mt-0.5">
//                         {addon.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right shrink-0">
//                     <p className="font-bold text-sm text-primary">
//                       +₹{addonPrice.toLocaleString("en-IN")}
//                     </p>
//                     {addon.perPerson && (
//                       <p className="text-xs text-muted-foreground">
//                         ₹{addon.price.toLocaleString("en-IN")}/person
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </CardContent>
//       </Card>
// 
//       {/* Contact details */}
//       <Card className="border-border/60">
//         <CardHeader className="pb-2">
//           <h2 className="text-lg font-bold">Contact Details</h2>
//           <p className="text-sm text-muted-foreground">
//             Your booking confirmation will be sent here.
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-1.5">
//             <Label htmlFor="contact-name" className="text-xs flex items-center gap-1.5">
//               <User size={13} className="text-primary" />
//               Full Name
//             </Label>
//             <Input
//               id="contact-name"
//               placeholder="Rahul Sharma"
//               value={contactData.contactName}
//               onChange={(e) =>
//                 onContactChange({ ...contactData, contactName: e.target.value })
//               }
//             />
//           </div>
// 
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <Label htmlFor="contact-email" className="text-xs flex items-center gap-1.5">
//                 <Mail size={13} className="text-primary" />
//                 Email
//               </Label>
//               <Input
//                 id="contact-email"
//                 type="email"
//                 placeholder="rahul@email.com"
//                 value={contactData.contactEmail}
//                 onChange={(e) =>
//                   onContactChange({ ...contactData, contactEmail: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="contact-phone" className="text-xs flex items-center gap-1.5">
//                 <Phone size={13} className="text-primary" />
//                 Mobile (10 digits)
//               </Label>
//               <div className="flex">
//                 <span className="flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-sm text-muted-foreground">
//                   +91
//                 </span>
//                 <Input
//                   id="contact-phone"
//                   type="tel"
//                   maxLength={10}
//                   placeholder="9876543210"
//                   value={contactData.contactPhone}
//                   onChange={(e) =>
//                     onContactChange({
//                       ...contactData,
//                       contactPhone: e.target.value.replace(/\D/g, ""),
//                     })
//                   }
//                   className="rounded-l-none"
//                 />
//               </div>
//             </div>
//           </div>
// 
//           <div className="space-y-1.5">
//             <Label htmlFor="contact-city" className="text-xs flex items-center gap-1.5">
//               <MapPin size={13} className="text-primary" />
//               Your City
//             </Label>
//             <Input
//               id="contact-city"
//               placeholder="Mumbai"
//               value={contactData.city}
//               onChange={(e) =>
//                 onContactChange({ ...contactData, city: e.target.value })
//               }
//               className="max-w-xs"
//             />
//           </div>
// 
//           <div className="space-y-1.5">
//             <Label htmlFor="special-requests" className="text-xs">
//               Special Requests{" "}
//               <span className="text-muted-foreground">(optional)</span>
//             </Label>
//             <textarea
//               id="special-requests"
//               rows={3}
//               placeholder="Dietary requirements, medical conditions, room preferences..."
//               value={contactData.specialRequests}
//               onChange={(e) =>
//                 onContactChange({ ...contactData, specialRequests: e.target.value })
//               }
//               className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//             />
//           </div>
// 
//           <div className="flex items-start gap-2.5 pt-1">
//             <Checkbox
//               id="agree-terms"
//               checked={contactData.agreeTerms}
//               onCheckedChange={(v) =>
//                 onContactChange({ ...contactData, agreeTerms: !!v })
//               }
//             />
//             <Label
//               htmlFor="agree-terms"
//               className="text-sm font-normal leading-relaxed cursor-pointer"
//             >
//               I agree to the{" "}
//               <Link
//                 to="/domestic/terms"
//                 className="text-primary underline underline-offset-2"
//                 target="_blank"
//               >
//                 Terms & Conditions
//               </Link>{" "}
//               and{" "}
//               <Link
//                 to="/domestic/cancellation-policy"
//                 className="text-primary underline underline-offset-2"
//                 target="_blank"
//               >
//                 Cancellation Policy
//               </Link>
//               .
//             </Label>
//           </div>
//         </CardContent>
//       </Card>
// 
//       <div className="flex gap-3">
//         <Button variant="outline" className="gap-1.5" onClick={onBack}>
//           <ArrowLeft size={15} />
//           Back
//         </Button>
//         <Button
//           className="flex-1 gap-2"
//           size="lg"
//           disabled={!canProceed}
//           onClick={onNext}
//         >
//           Continue to Payment
//           <ArrowRight size={16} />
//         </Button>
//       </div>
//     </div>
//   );
// }
// 
// // ─── Step 4 — Payment ─────────────────────────────────────────────────────────
// 
// function Step4Payment({
//   paymentMethod,
//   onPaymentChange,
//   promoCode,
//   onPromoChange,
//   promoApplied,
//   onApplyPromo,
//   pricing,
//   isSubmitting,
//   onBack,
//   onConfirm,
// }: {
//   paymentMethod: string;
//   onPaymentChange: (v: string) => void;
//   promoCode: string;
//   onPromoChange: (v: string) => void;
//   promoApplied: boolean;
//   onApplyPromo: () => void;
//   pricing: ReturnType<typeof useMemo<any, any>>;
//   isSubmitting: boolean;
//   onBack: () => void;
//   onConfirm: () => void;
// }) {
//   return (
//     <div className="space-y-5">
//       {/* Promo code */}
//       <Card className="border-border/60">
//         <CardHeader className="pb-2">
//           <h2 className="text-base font-bold flex items-center gap-2">
//             <Tag size={15} className="text-primary" />
//             Promo Code
//           </h2>
//         </CardHeader>
//         <CardContent>
//           {promoApplied ? (
//             <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
//               <CheckCircle2 size={15} />
//               <span>
//                 <strong>WANDER10</strong> applied — 10% off base price!
//               </span>
//             </div>
//           ) : (
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Enter promo code (try WANDER10)"
//                 value={promoCode}
//                 onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
//                 className="uppercase"
//               />
//               <Button
//                 variant="outline"
//                 onClick={onApplyPromo}
//                 disabled={!promoCode}
//                 className="shrink-0"
//               >
//                 Apply
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
// 
//       {/* Payment method */}
//       <Card className="border-border/60">
//         <CardHeader className="pb-2">
//           <h2 className="text-lg font-bold">Payment Method</h2>
//           <p className="text-sm text-muted-foreground">
//             All transactions are secured with 256-bit SSL encryption.
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <RadioGroup value={paymentMethod} onValueChange={onPaymentChange}>
//             {PAYMENT_METHODS.map((method) => {
//               const Icon = method.icon;
//               return (
//                 <div
//                   key={method.id}
//                   className={cn(
//                     "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
//                     paymentMethod === method.id
//                       ? "border-primary bg-primary/5 ring-1 ring-primary"
//                       : "border-border/60 hover:border-primary/40"
//                   )}
//                   onClick={() => onPaymentChange(method.id)}
//                 >
//                   <RadioGroupItem value={method.id} id={method.id} />
//                   <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
//                     <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
//                   </div>
//                   <Label htmlFor={method.id} className="cursor-pointer flex-1">
//                     <p className="font-semibold text-sm">{method.label}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {method.description}
//                     </p>
//                   </Label>
//                 </div>
//               );
//             })}
//           </RadioGroup>
// 
//           {/* Trust indicators */}
//           <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
//             <span className="flex items-center gap-1">
//               <Shield size={11} className="text-green-600" />
//               Razorpay secured
//             </span>
//             <span className="flex items-center gap-1">
//               <Shield size={11} className="text-green-600" />
//               PCI DSS compliant
//             </span>
//           </div>
//         </CardContent>
//       </Card>
// 
//       {/* Final amount notice */}
//       <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20 p-4 flex items-start gap-2.5 text-sm text-blue-800 dark:text-blue-300">
//         <Info size={15} className="shrink-0 mt-0.5" />
//         <p>
//           You won't be charged yet. Clicking "Confirm Booking" will initiate the
//           payment flow via Razorpay. Your booking is only confirmed once payment
//           is successful.
//         </p>
//       </div>
// 
//       <div className="flex gap-3">
//         <Button variant="outline" className="gap-1.5" onClick={onBack} disabled={isSubmitting}>
//           <ArrowLeft size={15} />
//           Back
//         </Button>
//         <Button
//           className="flex-1 gap-2"
//           size="lg"
//           onClick={onConfirm}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 size={16} className="animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               Confirm & Pay ₹{pricing.total.toLocaleString("en-IN")}
//               <ArrowRight size={16} />
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }
// 
// // ─── Order Summary Sidebar ────────────────────────────────────────────────────
// 
// function OrderSummary({
//   tour,
//   travellersData,
//   selectedTier,
//   selectedAddOns,
//   pricing,
//   promoApplied,
// }: {
//   tour: TourSummary;
//   travellersData: TravellersData;
//   selectedTier: TourPricingTier;
//   selectedAddOns: TourAddOn[];
//   pricing: any;
//   promoApplied: boolean;
// }) {
//   return (
//     <Card className="border-border/60 sticky top-20 p-0 pb-2">
//       {/* Tour thumbnail */}
//       <div className="relative aspect-video overflow-hidden rounded-t-xl">
//         <img
//           src={tour.image}
//           alt={tour.title}
//           className="w-full h-full object-cover"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//         <div className="absolute bottom-3 left-3 text-white">
//           <p className="font-bold text-sm leading-tight">{tour.title}</p>
//           <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
//             <MapPin size={11} />
//             {tour.destination}
//           </p>
//         </div>
//       </div>
// 
//       <CardContent className="space-y-4">
//         {/* Trip info */}
//         <div className="grid grid-cols-2 gap-2 text-xs">
//           {[
//             {
//               icon: Clock,
//               label: "Duration",
//               value: tour.duration,
//             },
//             {
//               icon: Users,
//               label: "Guests",
//               value: `${travellersData.guestCount} ${travellersData.guestCount === 1 ? "person" : "people"}`,
//             },
//             {
//               icon: CalendarDays,
//               label: "Travel date",
//               value: travellersData.travelDate
//                 ? new Date(travellersData.travelDate).toLocaleDateString("en-IN", {
//                   day: "numeric",
//                   month: "short",
//                   year: "numeric",
//                 })
//                 : "Not selected",
//             },
//             {
//               icon: Star,
//               label: "Package",
//               value: selectedTier.label,
//             },
//           ].map(({ icon: Icon, label, value }) => (
//             <div key={label} className="rounded-lg bg-muted/50 px-2.5 py-2">
//               <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
//                 <Icon size={11} />
//                 <span>{label}</span>
//               </div>
//               <p className="font-semibold text-xs">{value}</p>
//             </div>
//           ))}
//         </div>
// 
//         <Separator />
// 
//         {/* Price breakdown */}
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between text-muted-foreground">
//             <span>
//               ₹{selectedTier.price.toLocaleString("en-IN")} × {travellersData.guestCount}{" "}
//               {travellersData.guestCount === 1 ? "person" : "people"}
//             </span>
//             <span>₹{pricing.base.toLocaleString("en-IN")}</span>
//           </div>
// 
//           {selectedAddOns.length > 0 && (
//             <div className="space-y-1">
//               {selectedAddOns.map((addon) => {
//                 const addonTotal = addon.perPerson
//                   ? addon.price * travellersData.guestCount
//                   : addon.price;
//                 return (
//                   <div key={addon.id} className="flex justify-between text-muted-foreground text-xs">
//                     <span>+ {addon.label}</span>
//                     <span>₹{addonTotal.toLocaleString("en-IN")}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
// 
//           {promoApplied && (
//             <div className="flex justify-between text-green-700 dark:text-green-400 text-xs font-medium">
//               <span>Promo discount (WANDER10)</span>
//               <span>−₹{pricing.discount.toLocaleString("en-IN")}</span>
//             </div>
//           )}
// 
//           <div className="flex justify-between text-muted-foreground text-xs">
//             <span>GST (5%)</span>
//             <span>₹{pricing.gst.toLocaleString("en-IN")}</span>
//           </div>
// 
//           <Separator />
// 
//           <div className="flex justify-between font-bold text-base">
//             <span>Total</span>
//             <span className="text-primary">
//               ₹{pricing.total.toLocaleString("en-IN")}
//             </span>
//           </div>
//           <p className="text-xs text-muted-foreground">
//             Inclusive of all taxes & charges
//           </p>
//         </div>
// 
//         {/* Cancellation note */}
//         <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5">
//           <Shield size={12} className="text-green-600 shrink-0 mt-0.5" />
//           Free cancellation up to 15 days before travel date.
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
// 
// // ─── Confirmation Screen ──────────────────────────────────────────────────────
// 
// function ConfirmationScreen({
//   tour,
//   bookingId,
//   pricing,
// }: {
//   tour: TourSummary;
//   bookingId: string;
//   pricing: any;
// }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-16">
//       <div className="max-w-md w-full text-center space-y-6">
//         {/* Success icon */}
//         <div className="flex justify-center">
//           <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
//             <CheckCircle2
//               size={40}
//               className="text-green-600"
//               aria-hidden="true"
//             />
//           </div>
//         </div>
// 
//         <div>
//           <h1 className="text-2xl font-bold">Booking Confirmed! 🎉</h1>
//           <p className="text-muted-foreground mt-2">
//             Your adventure is locked in. A confirmation has been sent to your
//             email and WhatsApp.
//           </p>
//         </div>
// 
//         {/* Booking ID card */}
//         <Card className="border-border/60 text-left">
//           <CardContent className="pt-5 space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-muted-foreground">Booking ID</span>
//               <Badge variant="secondary" className="font-mono font-bold tracking-wider">
//                 {bookingId}
//               </Badge>
//             </div>
//             <Separator />
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Tour</span>
//                 <span className="font-medium text-right max-w-[180px]">
//                   {tour.title}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Duration</span>
//                 <span className="font-medium">{tour.duration}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Amount Paid</span>
//                 <span className="font-bold text-primary">
//                   ₹{pricing.total.toLocaleString("en-IN")}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
// 
//         {/* What's next */}
//         <div className="text-left space-y-2.5">
//           <p className="text-sm font-semibold">What happens next?</p>
//           {[
//             "You'll receive a detailed itinerary PDF within 2 hours",
//             "Your travel manager will call within 24 hours to confirm logistics",
//             "Full payment confirmation via SMS & email",
//           ].map((item, i) => (
//             <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
//               <CheckCircle2
//                 size={15}
//                 className="text-green-600 shrink-0 mt-0.5"
//                 aria-hidden="true"
//               />
//               {item}
//             </div>
//           ))}
//         </div>
// 
//         {/* Actions */}
//         <div className="flex flex-col gap-2.5 pt-2">
//           <Link
//             to="/domestic/bookings"
//             className={buttonVariants({ size: "lg", className: "w-full gap-2" })}
//           >
//             View My Bookings
//             <ChevronRight size={16} />
//           </Link>
//           <Link
//             to="/domestic/tours"
//             className={buttonVariants({
//               variant: "outline",
//               size: "lg",
//               className: "w-full",
//             })}
//           >
//             Browse More Tours
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
