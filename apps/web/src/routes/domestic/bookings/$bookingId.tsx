import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Download,
  Phone,
  Mail,
  Shield,
  ChevronRight,
  Copy,
  Share2,
  Printer,
  CreditCard,
  Receipt,
  User,
  MessageSquare,
  ThumbsUp,
  Camera,
  Loader2,
  Info,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { Label } from "#/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Traveller = {
  firstName: string;
  lastName: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  isPrimary?: boolean;
};

type PaymentRecord = {
  id: string;
  date: string;
  method: string;
  amount: number;
  status: "success" | "pending" | "failed";
  transactionId: string;
};

type BookingDetail = {
  id: string;
  bookingRef: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  state: string;
  heroImage: string;
  status: BookingStatus;
  travelDate: string;
  returnDate: string;
  bookedOn: string;
  duration: string;
  guestCount: number;
  tierLabel: string;
  travellers: Traveller[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactCity: string;
  specialRequests?: string;
  addOns: { label: string; amount: number; perPerson: boolean }[];
  basePrice: number;
  gstAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  payments: PaymentRecord[];
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  cancellationDeadline?: string;
  canCancel: boolean;
  review?: { rating: number; comment: string; submittedOn: string };
};

// ─── Search params ────────────────────────────────────────────────────────────

const bookingDetailSearch = z.object({
  tab: z.enum(["overview", "travellers", "invoice", "review"]).optional(),
});

// ─── Mock DB ──────────────────────────────────────────────────────────────────

const BOOKING_DB: Record<string, BookingDetail> = {
  "bk-001": {
    id: "bk-001",
    bookingRef: "WI4F9A2K",
    tourId: "kerala-backwaters",
    tourTitle: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85",
    status: "confirmed",
    travelDate: "2026-08-15",
    returnDate: "2026-08-19",
    bookedOn: "2026-06-03",
    duration: "5 Days / 4 Nights",
    guestCount: 2,
    tierLabel: "Deluxe",
    travellers: [
      { firstName: "Moin", lastName: "Malek", age: "24", gender: "Male", isPrimary: true },
      { firstName: "Arjun", lastName: "Mehta", age: "25", gender: "Male" },
    ],
    contactName: "Moin Malek",
    contactEmail: "moin@example.com",
    contactPhone: "+91 98765 43210",
    contactCity: "Bhuj, Gujarat",
    specialRequests: "Vegetarian meals preferred. Window seat on houseboat if possible.",
    addOns: [
      { label: "Travel Insurance", amount: 799, perPerson: true },
      { label: "Airport Pickup", amount: 1200, perPerson: false },
    ],
    basePrice: 52000,
    gstAmount: 2860,
    discountAmount: 0,
    totalAmount: 56456,
    paidAmount: 56456,
    payments: [
      {
        id: "pay-1",
        date: "2026-06-03",
        method: "UPI (GPay)",
        amount: 56456,
        status: "success",
        transactionId: "TXN8F3K2M9P",
      },
    ],
    highlights: [
      "Overnight houseboat cruise on Vembanad Lake",
      "Spice plantation walk in Thekkady",
      "Kathakali performance in Fort Kochi",
      "Chinese fishing net experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi → Fort Kochi",
        description:
          "Arrive at Kochi International Airport. Transfer to Fort Kochi hotel. Evening stroll along the Chinese fishing nets, followed by a Kathakali performance.",
      },
      {
        day: 2,
        title: "Kochi → Alleppey Houseboat",
        description:
          "Check out and drive to Alleppey (1.5 hrs). Board your premium houseboat at noon. Cruise through the backwaters, pass paddy fields and coconut groves. Overnight stay on the houseboat.",
      },
      {
        day: 3,
        title: "Alleppey → Kumarakom → Thekkady",
        description:
          "Morning canoe ride through narrow canals. Disembark and drive to Thekkady (3 hrs). Spice plantation walk in the afternoon. Evening wildlife boat safari at Periyar Lake.",
      },
      {
        day: 4,
        title: "Thekkady → Munnar",
        description:
          "Morning drive through the scenic Western Ghats to Munnar (3 hrs). Visit Tea Museum. Evening walk through Eravikulam National Park. Overnight in a tea-estate resort.",
      },
      {
        day: 5,
        title: "Munnar → Kochi Departure",
        description:
          "Sunrise at Top Station for panoramic Nilgiri views. Drive back to Kochi airport (4 hrs). Transfer to airport for onward journey. Tour ends.",
      },
    ],
    inclusions: [
      "4 nights accommodation (Deluxe category)",
      "Overnight houseboat with all meals",
      "Daily breakfast at hotels",
      "All transfers in AC vehicle",
      "Expert English-speaking tour guide",
      "Kathakali performance tickets",
      "Periyar boat safari entry",
      "Tea Museum entry",
      "Travel Insurance (add-on)",
      "Airport Pickup (add-on)",
    ],
    exclusions: [
      "Airfare / train tickets to Kochi",
      "Lunch & dinner at hotels (except houseboat)",
      "Personal expenses, tips, and souvenirs",
      "Anything not mentioned in inclusions",
    ],
    cancellationDeadline: "2026-07-15",
    canCancel: true,
  },

  "bk-002": {
    id: "bk-002",
    bookingRef: "WI9C1R7T",
    tourId: "rajasthan-royals",
    tourTitle: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=85",
    status: "pending",
    travelDate: "2026-10-05",
    returnDate: "2026-10-11",
    bookedOn: "2026-06-01",
    duration: "7 Days / 6 Nights",
    guestCount: 4,
    tierLabel: "Standard",
    travellers: [
      { firstName: "Moin", lastName: "Malek", age: "24", gender: "Male", isPrimary: true },
      { firstName: "Priya", lastName: "Malek", age: "22", gender: "Female" },
      { firstName: "Ravi", lastName: "Malek", age: "50", gender: "Male" },
      { firstName: "Sunita", lastName: "Malek", age: "48", gender: "Female" },
    ],
    contactName: "Moin Malek",
    contactEmail: "moin@example.com",
    contactPhone: "+91 98765 43210",
    contactCity: "Bhuj, Gujarat",
    addOns: [],
    basePrice: 99996,
    gstAmount: 5250,
    discountAmount: 0,
    totalAmount: 105246,
    paidAmount: 52623,
    payments: [
      {
        id: "pay-1",
        date: "2026-06-01",
        method: "Net Banking (HDFC)",
        amount: 52623,
        status: "success",
        transactionId: "TXN2R9K1X5M",
      },
    ],
    highlights: [
      "Amber Fort jeep ride & Sheesh Mahal",
      "Mehrangarh Fort in Jodhpur",
      "Sunset boat ride on Lake Pichola, Udaipur",
      "Camel safari in Jaisalmer desert",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Arrive in Jaipur. Check in to heritage hotel. Evening visit to Chokhi Dhani village." },
      { day: 2, title: "Jaipur Sightseeing", description: "Amber Fort, Hawa Mahal, Jantar Mantar, City Palace. Evening bazaar walk at Johari Bazaar." },
      { day: 3, title: "Jaipur → Jodhpur", description: "Drive to Jodhpur (5 hrs). Visit Mehrangarh Fort and explore the Blue City on foot." },
      { day: 4, title: "Jodhpur → Jaisalmer", description: "Drive to Jaisalmer (3.5 hrs). Evening camel safari and overnight desert camp." },
      { day: 5, title: "Jaisalmer → Udaipur", description: "Sunrise at the sand dunes. Fly/drive to Udaipur. Check in to lake-facing hotel." },
      { day: 6, title: "Udaipur Sightseeing", description: "City Palace, Jagdish Temple, Saheliyon Ki Bari. Sunset boat ride on Lake Pichola." },
      { day: 7, title: "Udaipur Departure", description: "Free morning. Transfer to Udaipur Airport / Railway Station. Tour ends." },
    ],
    inclusions: [
      "6 nights accommodation (Standard heritage hotels)",
      "Daily breakfast",
      "All surface transfers in AC vehicles",
      "Camel safari with overnight camp",
      "Boat ride on Lake Pichola",
      "All monument entry fees",
      "English-speaking guide throughout",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Lunch & dinner",
      "Jaisalmer to Udaipur flight (if opted)",
      "Personal expenses",
    ],
    cancellationDeadline: "2026-09-05",
    canCancel: true,
  },

  "bk-003": {
    id: "bk-003",
    bookingRef: "WI2M8B5X",
    tourId: "leh-ladakh",
    tourTitle: "Ladakh Land of High Passes",
    destination: "Leh",
    state: "Ladakh",
    heroImage:
      "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1200&q=85",
    status: "completed",
    travelDate: "2026-07-10",
    returnDate: "2026-07-18",
    bookedOn: "2026-05-12",
    duration: "9 Days / 8 Nights",
    guestCount: 2,
    tierLabel: "Deluxe",
    travellers: [
      { firstName: "Moin", lastName: "Malek", age: "24", gender: "Male", isPrimary: true },
      { firstName: "Arjun", lastName: "Mehta", age: "25", gender: "Male" },
    ],
    contactName: "Moin Malek",
    contactEmail: "moin@example.com",
    contactPhone: "+91 98765 43210",
    contactCity: "Bhuj, Gujarat",
    addOns: [
      { label: "Travel Insurance", amount: 799, perPerson: true },
      { label: "Professional Photography", amount: 3500, perPerson: false },
    ],
    basePrice: 90000,
    gstAmount: 4775,
    discountAmount: 0,
    totalAmount: 99073,
    paidAmount: 99073,
    payments: [
      {
        id: "pay-1",
        date: "2026-05-12",
        method: "Credit Card (HDFC Visa)",
        amount: 99073,
        status: "success",
        transactionId: "TXN5Z7W3Q8N",
      },
    ],
    highlights: [
      "Sunrise puja at Thiksey Monastery",
      "Pangong Tso Lake overnight camp",
      "Khardung La — World's highest motorable pass",
      "Bactrian camel safari in Nubra Valley",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Leh — Acclimatization", description: "Arrive in Leh. Rest and acclimatize. Short walk to Leh Palace. No strenuous activity." },
      { day: 2, title: "Leh Local Sightseeing", description: "Shanti Stupa, Leh Market, Hall of Fame Museum, Magnetic Hill." },
      { day: 3, title: "Thiksey & Hemis Monasteries", description: "Morning puja at Thiksey. Afternoon visit to Hemis Monastery. Evening in Leh." },
      { day: 4, title: "Leh → Nubra Valley via Khardung La", description: "Drive over Khardung La Pass (5,359m). Descend to Nubra Valley. Camel safari at Hunder sand dunes." },
      { day: 5, title: "Nubra → Pangong Lake", description: "Drive to Pangong Tso via Shyok Valley. Witness the colour-changing lake. Overnight in tented camp." },
      { day: 6, title: "Pangong Lake → Leh", description: "Sunrise at Pangong. Return to Leh via Chang La. Afternoon rest." },
      { day: 7, title: "Lamayuru & Alchi Monasteries", description: "Day trip to Lamayuru — the moonland landscape and ancient monastery." },
      { day: 8, title: "Free Day / White Water Rafting", description: "Optional rafting on Zanskar River. Shopping in Leh Market." },
      { day: 9, title: "Departure from Leh", description: "Early morning transfer to Leh Airport. Tour ends." },
    ],
    inclusions: [
      "8 nights accommodation (Deluxe hotels + tented camps)",
      "All meals (breakfast & dinner)",
      "All transfers in SUV / Innova",
      "Inner Line Permits for Nubra & Pangong",
      "Camel safari in Nubra",
      "English-speaking local guide",
      "Oxygen cylinders for emergencies",
      "Travel Insurance (add-on)",
      "Professional Photography — 1 day (add-on)",
    ],
    exclusions: [
      "Flights to/from Leh",
      "Rafting charges (optional)",
      "Personal expenses",
      "Lunch during day trips",
    ],
    canCancel: false,
    review: {
      rating: 5,
      comment:
        "Absolutely life-changing trip! The Pangong Lake at sunset was beyond words. The guide Tenzin was brilliant. Highly recommend the photography add-on — the photos are priceless. Would book again without hesitation.",
      submittedOn: "2026-07-21",
    },
  },
};

// ─── Status config ────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  timelineColor: string;
};

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badgeClass:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    timelineColor: "bg-green-500",
  },
  pending: {
    label: "Payment Pending",
    icon: AlertCircle,
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    timelineColor: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    icon: Star,
    badgeClass:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    timelineColor: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass:
      "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    timelineColor: "bg-red-500",
  },
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/bookings/$bookingId")({
  validateSearch: bookingDetailSearch,
  loader: async ({ params }) => {
    const booking = BOOKING_DB[params.bookingId] ?? null;
    if (!booking) throw notFound();
    return { booking };
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🎫</div>
      <h1 className="text-2xl font-bold">Booking not found</h1>
      <p className="text-muted-foreground text-sm max-w-xs">
        This booking reference doesn't exist or may have been removed.
      </p>
      <Link to="/domestic/bookings" className={buttonVariants()}>
        Back to My Bookings
      </Link>
    </div>
  ),
  component: BookingDetailPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function BookingDetailPage() {
  const { booking } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [copied, setCopied] = useState(false);

  const config = STATUS_CONFIG[booking.status];
  const StatusIcon = config.icon;

  const activeTab = search.tab ?? "overview";

  const balance = booking.totalAmount - booking.paidAmount;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const copyRef = () => {
    navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-muted/20">
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="border-b bg-background sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
            <Link
              to="/domestic/bookings"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5" })}
            >
              <ArrowLeft size={15} />
              My Bookings
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Booking
              </span>
              <code className="text-sm font-bold font-mono">
                #{booking.bookingRef}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyRef}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy booking reference"
                  >
                    {copied ? (
                      <CheckCircle2 size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy reference"}
                </TooltipContent>
              </Tooltip>
            </div>
            <Badge
              variant="outline"
              className={cn("gap-1 text-xs shrink-0", config.badgeClass)}
            >
              <StatusIcon size={11} aria-hidden="true" />
              {config.label}
            </Badge>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* ── Hero card ─────────────────────────────────────────────── */}
          <HeroCard booking={booking} config={config} balance={balance} />

          {/* ── Pending payment banner ────────────────────────────────── */}
          {booking.status === "pending" && balance > 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/20 p-4">
              <AlertCircle
                size={18}
                className="text-amber-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Balance payment of ₹{balance.toLocaleString("en-IN")} is due
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Your booking is held. Complete payment to confirm all spots.
                  Booking auto-cancels in 72 hrs if unpaid.
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs"
              >
                Pay ₹{balance.toLocaleString("en-IN")}
              </Button>
            </div>
          )}

          {/* ── Tabs ─────────────────────────────────────────────────── */}
          <div className="mt-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) =>
                navigate({ search: (p) => ({ ...p, tab: v as any }), replace: true })
              }
            >
              <TabsList className="w-full justify-start overflow-x-auto mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="travellers">Travellers</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="review">
                  {booking.review ? "My Review" : "Leave Review"}
                </TabsTrigger>
              </TabsList>

              {/* ── Overview ──────────────────────────────────────────── */}
              <TabsContent value="overview">
                <OverviewTab booking={booking} fmt={fmt} />
              </TabsContent>

              {/* ── Travellers ────────────────────────────────────────── */}
              <TabsContent value="travellers">
                <TravellersTab booking={booking} />
              </TabsContent>

              {/* ── Invoice ───────────────────────────────────────────── */}
              <TabsContent value="invoice">
                <InvoiceTab booking={booking} fmt={fmt} />
              </TabsContent>

              {/* ── Review ────────────────────────────────────────────── */}
              <TabsContent value="review">
                <ReviewTab booking={booking} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({
  booking,
  config,
  balance,
}: {
  booking: BookingDetail;
  config: StatusConfig;
  balance: number;
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="relative h-44 sm:h-56 overflow-hidden">
        <img
          src={booking.heroImage}
          alt={booking.tourTitle}
          className="w-full h-full object-cover"
          loading="eager"
          width={960}
          height={224}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h1 className="text-white font-bold text-xl sm:text-2xl leading-tight">
            {booking.tourTitle}
          </h1>
          <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
            <MapPin size={13} aria-hidden="true" />
            {booking.destination}, {booking.state}
          </p>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6">
        {/* Key dates row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Travel Date",
              value: fmt(booking.travelDate),
              icon: CalendarDays,
            },
            {
              label: "Return Date",
              value: fmt(booking.returnDate),
              icon: CalendarDays,
            },
            {
              label: "Duration",
              value: booking.duration,
              icon: Clock,
            },
            {
              label: "Guests",
              value: `${booking.guestCount} ${booking.guestCount > 1 ? "people" : "person"}`,
              icon: Users,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <Icon size={11} aria-hidden="true" />
                {label}
              </p>
              <p className="text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Package</p>
              <p className="font-semibold">{booking.tierLabel}</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="font-bold text-primary tabular-nums">
                ₹{booking.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            {balance > 0 && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <p className="text-xs text-amber-600">Balance Due</p>
                  <p className="font-bold text-amber-600 tabular-nums">
                    ₹{balance.toLocaleString("en-IN")}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Share2 size={14} />
                  <span className="sr-only">Share booking</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share booking</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span className="sr-only">Print</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print booking</TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs"
            >
              <Download size={13} />
              Download PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  booking,
  fmt,
}: {
  booking: BookingDetail;
  fmt: (s: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left — itinerary + inclusions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Trip highlights */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="font-bold text-base">Trip Highlights</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {booking.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  {h}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="font-bold text-base">Day-by-Day Itinerary</h2>
          </CardHeader>
          <CardContent>
            <ol className="space-y-0">
              {booking.itinerary.map((day, i) => (
                <li key={day.day} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {day.day}
                    </div>
                    {i < booking.itinerary.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1 mb-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5 pt-0.5 min-w-0">
                    <p className="font-semibold text-sm">{day.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {day.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Inclusions & Exclusions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-green-200 dark:border-green-900/40">
            <CardHeader className="pb-2">
              <h2 className="font-bold text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 size={15} />
                What's Included
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {booking.inclusions.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle2
                      size={12}
                      className="text-green-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-900/40">
            <CardHeader className="pb-2">
              <h2 className="font-bold text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <XCircle size={15} />
                Not Included
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {booking.exclusions.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <XCircle
                      size={12}
                      className="text-red-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right — contact + cancellation */}
      <div className="space-y-4">
        {/* Contact info */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <h2 className="font-bold text-sm">Contact Details</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { icon: User, label: "Name", value: booking.contactName },
              { icon: Mail, label: "Email", value: booking.contactEmail },
              { icon: Phone, label: "Phone", value: booking.contactPhone },
              { icon: MapPin, label: "City", value: booking.contactCity },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon
                  size={13}
                  className="text-muted-foreground shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium text-xs">{value}</p>
                </div>
              </div>
            ))}
            {booking.specialRequests && (
              <>
                <Separator />
                <div className="flex items-start gap-2.5">
                  <MessageSquare
                    size={13}
                    className="text-muted-foreground shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Special Requests
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {booking.specialRequests}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cancellation policy */}
        {booking.canCancel && booking.cancellationDeadline && (
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <h2 className="font-bold text-sm flex items-center gap-1.5">
                <Shield size={13} className="text-primary" />
                Cancellation Policy
              </h2>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              {[
                { days: "30+ days before", refund: "90% refund" },
                { days: "15–29 days before", refund: "50% refund" },
                { days: "7–14 days before", refund: "25% refund" },
                { days: "< 7 days before", refund: "No refund" },
              ].map(({ days, refund }) => (
                <div key={days} className="flex justify-between">
                  <span>{days}</span>
                  <span className="font-medium text-foreground">{refund}</span>
                </div>
              ))}
              <Separator />
              <p className="text-primary font-medium">
                Free cancel before{" "}
                {fmt(booking.cancellationDeadline)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card className="border-border/60">
          <CardContent className="pt-4 space-y-3">
            <h2 className="font-bold text-sm">Need Help?</h2>
            <p className="text-xs text-muted-foreground">
              Our support team is available Mon–Sat, 9 AM – 7 PM IST.
            </p>
            <a
              href="tel:+919876543210"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "w-full gap-2 text-xs",
              })}
            >
              <Phone size={13} />
              +91 98765 43210
            </a>
            <a
              href="mailto:support@wanderinn.com"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "w-full gap-2 text-xs",
              })}
            >
              <Mail size={13} />
              support@wanderinn.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Travellers Tab ───────────────────────────────────────────────────────────

function TravellersTab({ booking }: { booking: BookingDetail }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        {booking.travellers.length} traveller
        {booking.travellers.length > 1 ? "s" : ""} on this booking.
      </p>
      {booking.travellers.map((t, i) => (
        <Card key={i} className="border-border/60">
          <CardContent className="pt-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {t.firstName[0]}{t.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <p className="font-bold text-sm">
                    {t.firstName} {t.lastName}
                  </p>
                  {t.isPrimary && (
                    <Badge variant="secondary" className="text-xs">
                      Primary Contact
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Traveller {i + 1}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {[
                    { label: "Age", value: t.age + " yrs" },
                    { label: "Gender", value: t.gender },
                    { label: "Passport", value: "Not required (domestic)" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium text-xs">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Note */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground">
        <Info size={14} className="shrink-0 mt-0.5 text-primary" aria-hidden="true" />
        <p>
          For domestic tours, government-issued photo ID (Aadhaar, PAN, or
          Driving Licence) must be carried by all travellers. Originals required
          at hotels and checkpoints.
        </p>
      </div>
    </div>
  );
}

// ─── Invoice Tab ──────────────────────────────────────────────────────────────

function InvoiceTab({
  booking,
  fmt,
}: {
  booking: BookingDetail;
  fmt: (s: string) => string;
}) {
  const balance = booking.totalAmount - booking.paidAmount;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Invoice card */}
      <Card className="border-border/60" id="invoice-card">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg">Tax Invoice</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                WanderInn Tours Pvt. Ltd. · GSTIN: 24XXXXX1234X1ZX
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold">#{booking.bookingRef}</p>
              <p className="text-xs text-muted-foreground">
                Issued: {fmt(booking.bookedOn)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <Separator />

          {/* Billed to */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                Billed To
              </p>
              <p className="font-semibold">{booking.contactName}</p>
              <p className="text-xs text-muted-foreground">{booking.contactEmail}</p>
              <p className="text-xs text-muted-foreground">{booking.contactPhone}</p>
              <p className="text-xs text-muted-foreground">{booking.contactCity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                Trip Details
              </p>
              <p className="font-semibold">{booking.tourTitle}</p>
              <p className="text-xs text-muted-foreground">
                {fmt(booking.travelDate)} → {fmt(booking.returnDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {booking.guestCount} guests · {booking.tierLabel} · {booking.duration}
              </p>
            </div>
          </div>

          <Separator />

          {/* Line items */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground text-xs font-medium uppercase tracking-wide">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <Separator />

            {/* Base fare */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {booking.tourTitle} — {booking.tierLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹{(booking.basePrice / booking.guestCount).toLocaleString("en-IN")} ×{" "}
                  {booking.guestCount} guests
                </p>
              </div>
              <span className="tabular-nums font-medium">
                ₹{booking.basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Add-ons */}
            {booking.addOns.map((addon) => {
              const total = addon.perPerson
                ? addon.amount * booking.guestCount
                : addon.amount;
              return (
                <div
                  key={addon.label}
                  className="flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium flex items-center gap-1.5">
                      <Tag size={12} className="text-primary" aria-hidden="true" />
                      {addon.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {addon.perPerson
                        ? `₹${addon.amount.toLocaleString("en-IN")} × ${booking.guestCount} guests`
                        : "Fixed add-on"}
                    </p>
                  </div>
                  <span className="tabular-nums font-medium">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}

            {/* Discount */}
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-green-700 dark:text-green-400">
                <span className="font-medium">Promo Discount</span>
                <span className="tabular-nums font-medium">
                  −₹{booking.discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <Separator />

            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">
                ₹{(booking.totalAmount - booking.gstAmount).toLocaleString("en-IN")}
              </span>
            </div>

            {/* GST */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                GST (5% — SAC 99694)
              </span>
              <span className="tabular-nums">
                ₹{booking.gstAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary tabular-nums">
                ₹{booking.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Paid / Balance */}
            <div className="flex justify-between text-sm text-green-700 dark:text-green-400">
              <span>Amount Paid</span>
              <span className="tabular-nums font-medium">
                ₹{booking.paidAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {balance > 0 && (
              <div className="flex justify-between text-sm text-amber-600 font-semibold">
                <span>Balance Due</span>
                <span className="tabular-nums">
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Receipt size={16} className="text-primary" />
            Payment History
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {booking.payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard size={14} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-xs">{p.method}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {p.transactionId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold tabular-nums text-sm">
                  ₹{p.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground">{fmt(p.date)}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs shrink-0",
                  p.status === "success"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : p.status === "pending"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-red-200 bg-red-50 text-red-600"
                )}
              >
                {p.status === "success"
                  ? "Paid"
                  : p.status === "pending"
                  ? "Pending"
                  : "Failed"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Download */}
      <Button variant="outline" className="gap-2">
        <Download size={14} />
        Download Invoice PDF
      </Button>
    </div>
  );
}

// ─── Review Tab ───────────────────────────────────────────────────────────────

function ReviewTab({ booking }: { booking: BookingDetail }) {
  const [rating, setRating] = useState(booking.review?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(booking.review?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!booking.review);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  if (booking.status !== "completed" && !booking.review) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4 max-w-sm mx-auto">
        <div className="text-5xl">🗓️</div>
        <h3 className="font-bold text-lg">Trip not completed yet</h3>
        <p className="text-sm text-muted-foreground">
          You can leave a review after you've completed your trip on{" "}
          <span className="font-medium">
            {new Date(booking.returnDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
            })}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {submitted ? (
        // ── Submitted state ─────────────────────────────────────────────
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/10">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <ThumbsUp
                  size={18}
                  className="text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-bold text-sm">
                  Thank you for your review, {booking.contactName.split(" ")[0]}!
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.review?.submittedOn
                    ? `Submitted on ${new Date(booking.review.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
                    : "Just now"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Star display */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={22}
                  className={cn(
                    s <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  )}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 text-sm font-semibold">
                {ratingLabels[rating]}
              </span>
            </div>

            <blockquote className="text-sm text-muted-foreground italic leading-relaxed border-l-2 border-primary/30 pl-3">
              "{comment}"
            </blockquote>

            <p className="text-xs text-muted-foreground">
              Your review helps other travellers make informed decisions. 🙏
            </p>
          </CardContent>
        </Card>
      ) : (
        // ── Review form ─────────────────────────────────────────────────
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Camera size={16} className="text-primary" />
              Rate Your Experience
            </h2>
            <p className="text-xs text-muted-foreground">
              How was your trip to {booking.destination}? Your honest feedback
              helps us and future travellers.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Star rating */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Overall Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${s} out of 5`}
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-colors",
                        s <= (hovered || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                ))}
                {(hovered || rating) > 0 && (
                  <span className="ml-2 text-sm font-semibold text-amber-600">
                    {ratingLabels[hovered || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <Label htmlFor="review-comment" className="text-sm font-medium">
                Your Review
              </Label>
              <Textarea
                id="review-comment"
                placeholder={`Share what you loved about ${booking.tourTitle}. Mention the guide, accommodations, food, and any memorable moments...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none text-sm"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/1000
              </p>
            </div>

            <Button
              className="gap-2"
              disabled={rating === 0 || comment.trim().length < 10 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Star size={14} />
                  Submit Review
                </>
              )}
            </Button>
            {rating === 0 && (
              <p className="text-xs text-muted-foreground">
                Please select a star rating to continue.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tour summary card */}
      <Card className="border-border/60">
        <CardContent className="pt-4 flex items-center gap-4">
          <img
            src={booking.heroImage}
            alt={booking.tourTitle}
            className="h-14 w-20 rounded-lg object-cover shrink-0"
            loading="lazy"
            width={80}
            height={56}
          />
          <div className="min-w-0">
            <p className="font-bold text-sm line-clamp-1">{booking.tourTitle}</p>
            <p className="text-xs text-muted-foreground">{booking.destination}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(booking.travelDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {booking.guestCount} guests
            </p>
          </div>
          <Link
            to="/domestic/tours/$tourId"
            params={{ tourId: booking.tourId }}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1 ml-auto text-xs shrink-0",
            })}
          >
            View tour
            <ChevronRight size={12} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}