import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Download,
  Phone,
  RotateCcw,
  Search,
  Filter,
  Star,
  Plane,
  X,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "#/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Booking = {
  id: string;
  bookingRef: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  state: string;
  heroImage: string;
  status: BookingStatus;
  travelDate: string;         // ISO date string
  returnDate: string;
  bookedOn: string;
  guestCount: number;
  tierLabel: string;
  totalAmount: number;
  paidAmount: number;
  addOns: string[];
  contactName: string;
  contactPhone: string;
  duration: string;
  canCancel: boolean;
  cancellationDeadline?: string;
  rating?: number;            // post-trip review rating
};

// ─── Search Params ────────────────────────────────────────────────────────────

const bookingsSearchSchema = z.object({
  status: z.enum(["all", "confirmed", "pending", "completed", "cancelled"]).optional(),
  q: z.string().optional(),
  sort: z.enum(["newest", "oldest", "travel-date"]).optional(),
});

// ─── Mock data (replace with createServerFn loader) ──────────────────────────

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk-001",
    bookingRef: "WI4F9A2K",
    tourId: "kerala-backwaters",
    tourTitle: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    status: "confirmed",
    travelDate: "2026-08-15",
    returnDate: "2026-08-19",
    bookedOn: "2026-06-03",
    guestCount: 2,
    tierLabel: "Deluxe",
    totalAmount: 54600,
    paidAmount: 54600,
    addOns: ["Travel Insurance", "Airport Pickup"],
    contactName: "Moin Malek",
    contactPhone: "+91 98765 43210",
    duration: "5D / 4N",
    canCancel: true,
    cancellationDeadline: "2026-07-15",
  },
  {
    id: "bk-002",
    bookingRef: "WI9C1R7T",
    tourId: "rajasthan-royals",
    tourTitle: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    status: "pending",
    travelDate: "2026-10-05",
    returnDate: "2026-10-11",
    bookedOn: "2026-06-01",
    guestCount: 4,
    tierLabel: "Standard",
    totalAmount: 104996,
    paidAmount: 52498,
    addOns: [],
    contactName: "Moin Malek",
    contactPhone: "+91 98765 43210",
    duration: "7D / 6N",
    canCancel: true,
    cancellationDeadline: "2026-09-05",
  },
  {
    id: "bk-003",
    bookingRef: "WI2M8B5X",
    tourId: "leh-ladakh",
    tourTitle: "Ladakh Land of High Passes",
    destination: "Leh",
    state: "Ladakh",
    heroImage:
      "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
    status: "completed",
    travelDate: "2026-07-10",
    returnDate: "2026-07-18",
    bookedOn: "2026-05-12",
    guestCount: 2,
    tierLabel: "Deluxe",
    totalAmount: 94500,
    paidAmount: 94500,
    addOns: ["Travel Insurance", "Professional Photography"],
    contactName: "Moin Malek",
    contactPhone: "+91 98765 43210",
    duration: "9D / 8N",
    canCancel: false,
    rating: 5,
  },
  {
    id: "bk-004",
    bookingRef: "WI6K3Z1P",
    tourId: "goa-beach",
    tourTitle: "Goa Beach & Heritage Weekend",
    destination: "North & South Goa",
    state: "Goa",
    heroImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
    status: "cancelled",
    travelDate: "2026-05-20",
    returnDate: "2026-05-23",
    bookedOn: "2026-04-10",
    guestCount: 3,
    tierLabel: "Standard",
    totalAmount: 35997,
    paidAmount: 0,
    addOns: [],
    contactName: "Moin Malek",
    contactPhone: "+91 98765 43210",
    duration: "4D / 3N",
    canCancel: false,
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  dotClass: string;
};

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badgeClass:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    dotClass: "bg-green-500",
  },
  pending: {
    label: "Payment Pending",
    icon: AlertCircle,
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    dotClass: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    icon: Star,
    badgeClass:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    dotClass: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass:
      "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    dotClass: "bg-red-500",
  },
};

const STATUS_TABS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All Bookings" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/bookings/")({
  validateSearch: bookingsSearchSchema,
  // Uncomment once auth is wired:
  // beforeLoad: async ({ context }) => {
  //   const user = await getUser();
  //   if (!user) throw redirect({ to: "/auth/sign-in", search: { redirect: "/bookings" } });
  // },
  // loader: async ({ context }) => {
  //   return { bookings: await getUserBookings({ data: context.user.id }) };
  // },
  component: BookingsPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function BookingsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const activeStatus = search.status ?? "all";
  const q = search.q ?? "";
  const sort = search.sort ?? "newest";

  const setSearch = (updates: Record<string, string | undefined>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }), replace: true });
  };

  // Cancellation dialog state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API
    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelTarget.id
          ? { ...b, status: "cancelled" as BookingStatus, canCancel: false, paidAmount: 0 }
          : b
      )
    );
    setIsCancelling(false);
    setCancelTarget(null);
  };

  // Stats for the summary strip
  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalSpent = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.paidAmount, 0);
    return { confirmed, pending, completed, totalSpent };
  }, [bookings]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = bookings.filter((b) => {
      if (activeStatus !== "all" && b.status !== activeStatus) return false;
      if (q) {
        const lower = q.toLowerCase();
        if (
          !b.tourTitle.toLowerCase().includes(lower) &&
          !b.destination.toLowerCase().includes(lower) &&
          !b.bookingRef.toLowerCase().includes(lower)
        )
          return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest")
        return new Date(b.bookedOn).getTime() - new Date(a.bookedOn).getTime();
      if (sort === "oldest")
        return new Date(a.bookedOn).getTime() - new Date(b.bookedOn).getTime();
      if (sort === "travel-date")
        return (
          new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime()
        );
      return 0;
    });

    return result;
  }, [bookings, activeStatus, q, sort]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <>
      <main className="min-h-screen bg-muted/20">
        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="border-b bg-background">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Welcome back, Moin 👋
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  My Bookings
                </h1>
              </div>
              <Link
                to="/domestic/tours"
                className={buttonVariants({ size: "sm", className: "gap-2 self-start sm:self-auto" })}
              >
                Book a new tour
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                {
                  label: "Upcoming",
                  value: stats.confirmed,
                  icon: Plane,
                  color: "text-green-600",
                },
                {
                  label: "Awaiting Payment",
                  value: stats.pending,
                  icon: AlertCircle,
                  color: "text-amber-600",
                },
                {
                  label: "Trips Completed",
                  value: stats.completed,
                  icon: CheckCircle2,
                  color: "text-blue-600",
                },
                {
                  label: "Total Spent",
                  value: `₹${(stats.totalSpent / 1000).toFixed(0)}K`,
                  icon: Star,
                  color: "text-primary",
                },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/60 bg-background p-4 space-y-1.5"
                >
                  <Icon size={15} className={color} aria-hidden="true" />
                  <p className="text-xl font-bold tabular-nums">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {/* ── Pending payment alert ─────────────────────────────────── */}
          {pendingCount > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/20 p-4">
              <AlertCircle
                size={18}
                className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {pendingCount} booking{pendingCount > 1 ? "s" : ""} awaiting
                  payment
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Complete your payment to confirm your spots. Pending bookings
                  are held for 72 hours.
                </p>
              </div>
              <button
                onClick={() => setSearch({ status: "pending" })}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 shrink-0 text-xs"
                )}
              >
                View
              </button>
            </div>
          )}

          {/* ── Filters ──────────────────────────────────────────────── */}
          <div className="space-y-3">
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {STATUS_TABS.map((tab) => {
                const count =
                  tab.value === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === tab.value).length;
                return (
                  <button
                    key={tab.value}
                    onClick={() =>
                      setSearch({
                        status: tab.value === "all" ? undefined : tab.value,
                      })
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                      activeStatus === tab.value ||
                        (tab.value === "all" && !search.status)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "text-xs rounded-full px-1.5 py-0.5 tabular-nums",
                        activeStatus === tab.value ||
                          (tab.value === "all" && !search.status)
                          ? "bg-white/20"
                          : "bg-muted"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search + sort row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search by tour, destination, or ref..."
                  value={q}
                  onChange={(e) =>
                    setSearch({ q: e.target.value || undefined })
                  }
                  className="pl-9 h-9 text-sm"
                />
                {q && (
                  <button
                    onClick={() => setSearch({ q: undefined })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <Select
                value={sort}
                onValueChange={(v) => setSearch({ sort: v })}
              >
                <SelectTrigger className="h-9 w-44 text-sm">
                  <SlidersHorizontal
                    size={13}
                    className="mr-1.5 text-muted-foreground"
                  />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="travel-date">Travel Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Booking list ─────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <EmptyState
              hasFilters={!!q || activeStatus !== "all"}
              onClear={() => navigate({ search: {}, replace: true })}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                booking{filtered.length !== 1 ? "s" : ""}
              </p>
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => setCancelTarget(booking)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Cancel dialog ─────────────────────────────────────────────── */}
      <CancelDialog
        booking={cancelTarget}
        isLoading={isCancelling}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: () => void;
}) {
  const config = STATUS_CONFIG[booking.status];
  const StatusIcon = config.icon;

  const travelDate = new Date(booking.travelDate);
  const returnDate = new Date(booking.returnDate);
  const bookedOn = new Date(booking.bookedOn);
  const daysUntil = Math.ceil(
    (travelDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isUpcoming = daysUntil > 0 && booking.status === "confirmed";

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const balance = booking.totalAmount - booking.paidAmount;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 hover:shadow-md transition-shadow",
        booking.status === "cancelled" && "opacity-70"
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-44 shrink-0 aspect-video sm:aspect-auto overflow-hidden">
          <img
            src={booking.heroImage}
            alt={booking.tourTitle}
            className="w-full h-full object-cover"
            loading="lazy"
            width={176}
            height={132}
          />
          {/* Countdown badge */}
          {isUpcoming && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
              {daysUntil}d away
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col gap-3 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <Link
                to="/domestic/bookings/$bookingId"
                params={{ bookingId: booking.id }}
                className="font-bold text-base hover:text-primary transition-colors line-clamp-1"
              >
                {booking.tourTitle}
              </Link>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={11} aria-hidden="true" />
                {booking.destination}, {booking.state}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs gap-1", config.badgeClass)}
            >
              <StatusIcon size={11} aria-hidden="true" />
              {config.label}
            </Badge>
          </div>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays size={12} aria-hidden="true" />
              {fmt(travelDate)} → {fmt(returnDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              {booking.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} aria-hidden="true" />
              {booking.guestCount} guest{booking.guestCount > 1 ? "s" : ""}
            </span>
            <span className="font-medium text-foreground">
              {booking.tierLabel}
            </span>
          </div>

          {/* Add-ons */}
          {booking.addOns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {booking.addOns.map((addon) => (
                <span
                  key={addon}
                  className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full"
                >
                  {addon}
                </span>
              ))}
            </div>
          )}

          <Separator />

          {/* Footer row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Pricing */}
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold tabular-nums">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              {balance > 0 && booking.status === "pending" && (
                <>
                  <Separator orientation="vertical" className="h-8" />
                  <div>
                    <p className="text-xs text-amber-600">Due</p>
                    <p className="font-bold text-amber-600 tabular-nums">
                      ₹{balance.toLocaleString("en-IN")}
                    </p>
                  </div>
                </>
              )}
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">Booked on</p>
                <p className="text-xs tabular-nums">{fmt(bookedOn)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">
                #{booking.bookingRef}
              </span>

              {/* Status-specific action */}
              {booking.status === "pending" && (
                <Link
                  to="/domestic/bookings/$bookingId"
                  params={{ bookingId: booking.id }}
                  className={buttonVariants({ size: "sm", className: "gap-1.5 h-8 text-xs" })}
                >
                  Pay Now
                  <ArrowRight size={12} />
                </Link>
              )}

              {booking.status === "completed" && !booking.rating && (
                <Link
                  to="/domestic/bookings/$bookingId"
                  params={{ bookingId: booking.id }}
                  search={{ tab: "review" }}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "gap-1.5 h-8 text-xs",
                  })}
                >
                  <Star size={12} />
                  Leave Review
                </Link>
              )}

              {booking.status === "completed" && booking.rating && (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Star
                    size={12}
                    className="fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  Rated {booking.rating}/5
                </span>
              )}

              {/* View details */}
              <Link
                to="/domestic/bookings/$bookingId"
                params={{ bookingId: booking.id }}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1 h-8 text-xs",
                })}
              >
                Details
                <ChevronRight size={12} />
              </Link>

              {/* Cancel */}
              {booking.canCancel && (
                <button
                  onClick={onCancel}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  )}
                >
                  <XCircle size={12} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Cancel Dialog ────────────────────────────────────────────────────────────

function CancelDialog({
  booking,
  isLoading,
  onClose,
  onConfirm,
}: {
  booking: Booking | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!booking) return null;

  const deadline = booking.cancellationDeadline
    ? new Date(booking.cancellationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const daysUntilTravel = Math.ceil(
    (new Date(booking.travelDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  const refundPercent =
    daysUntilTravel >= 30
      ? 90
      : daysUntilTravel >= 15
      ? 50
      : daysUntilTravel >= 7
      ? 25
      : 0;

  const refundAmount = Math.round(
    (booking.paidAmount * refundPercent) / 100
  );

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle size={18} />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel{" "}
            <span className="font-semibold text-foreground">
              {booking.tourTitle}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Booking summary */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking Ref</span>
              <span className="font-mono font-medium">#{booking.bookingRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Travel Date</span>
              <span className="font-medium">
                {new Date(booking.travelDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium">
                ₹{booking.paidAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Refund policy */}
          <div
            className={cn(
              "rounded-lg border p-3 text-sm space-y-2",
              refundPercent > 0
                ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20"
                : "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20"
            )}
          >
            <p
              className={cn(
                "font-semibold text-sm flex items-center gap-2",
                refundPercent > 0
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {refundPercent > 0 ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}
              {refundPercent > 0
                ? `${refundPercent}% refund — ₹${refundAmount.toLocaleString("en-IN")}`
                : "No refund applicable"}
            </p>
            <p className="text-xs text-muted-foreground">
              {daysUntilTravel >= 30
                ? "Cancellation 30+ days before travel — 90% refund."
                : daysUntilTravel >= 15
                ? "Cancellation 15–29 days before travel — 50% refund."
                : daysUntilTravel >= 7
                ? "Cancellation 7–14 days before travel — 25% refund."
                : "Cancellation within 7 days of travel — no refund."}
              {deadline && (
                <span className="block mt-1">
                  Free cancellation deadline was{" "}
                  <span className="font-medium">{deadline}</span>.
                </span>
              )}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Refunds are processed within 5–7 business days to the original
            payment method. This action cannot be undone.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Cancelling…
              </>
            ) : (
              <>
                <XCircle size={14} />
                Yes, Cancel Booking
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-4xl">
        {hasFilters ? "🔍" : "✈️"}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">
          {hasFilters ? "No bookings match your filters" : "No trips booked yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {hasFilters
            ? "Try a different status tab or clear the search."
            : "Your next adventure is waiting. Browse our tours and book your first trip!"}
        </p>
      </div>
      {hasFilters ? (
        <button onClick={onClear} className={buttonVariants({ variant: "outline" })}>
          <RotateCcw size={14} className="mr-2" />
          Clear filters
        </button>
      ) : (
        <Link to="/domestic/tours" className={buttonVariants({ className: "gap-2" })}>
          Browse tours
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}