import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Info,
  MapPin,
  Pencil,
  PlaneTakeoff,
  Users,
  XCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Separator } from "#/components/ui/separator"

export const Route = createFileRoute(
  "/_authenticated/departures/$departureId/",
)({
  component: DepartureDetailsPage,
})

type DepartureStatus =
  | "scheduled"
  | "full"
  | "closed"
  | "cancelled"
  | "completed"

type RoomType = "single" | "double" | "triple" | "quad" | "child"

type DeparturePricing = {
  id: string
  roomType: RoomType
  price: number
  compareAtPrice: number | null
}

type Departure = {
  id: string
  tourId: string
  tourTitle: string
  tourCode: string
  destination: string
  code: string
  startDate: string
  endDate: string
  totalSeats: number
  availableSeats: number
  status: DepartureStatus
  bookingDeadline: string | null
  cancellationDeadline: string | null
  notes: string | null
  isGuaranteed: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  pricing: DeparturePricing[]
}

// Sample data for UI development.
// Replace with a record returned by getDepartureById(departureId).
const sampleDeparture: Departure = {
  id: "dep-001",
  tourId: "tour-001",
  tourTitle: "Kashmir Paradise",
  tourCode: "DOM-KAS-001",
  destination: "Srinagar, Kashmir",
  code: "KAS-OCT-001",
  startDate: "2026-10-28T10:00:00",
  endDate: "2026-11-02T18:00:00",
  totalSeats: 24,
  availableSeats: 6,
  status: "scheduled",
  bookingDeadline: "2026-10-26T23:59:00",
  cancellationDeadline: "2026-10-23T23:59:00",
  notes:
    "Confirm airport pickup arrangements and hotel allocations before departure.",
  isGuaranteed: true,
  isActive: true,
  createdAt: "2026-09-15T10:00:00",
  updatedAt: "2026-10-20T14:30:00",
  pricing: [
    {
      id: "price-001",
      roomType: "single",
      price: 35000,
      compareAtPrice: 40000,
    },
    {
      id: "price-002",
      roomType: "double",
      price: 29500,
      compareAtPrice: 34000,
    },
    {
      id: "price-003",
      roomType: "triple",
      price: 27000,
      compareAtPrice: null,
    },
    {
      id: "price-004",
      roomType: "quad",
      price: 25000,
      compareAtPrice: null,
    },
  ],
}

const roomTypeLabels: Record<RoomType, string> = {
  single: "Single occupancy",
  double: "Double occupancy",
  triple: "Triple occupancy",
  quad: "Quad occupancy",
  child: "Child",
}

function formatDateTime(value: string | null) {
  if (!value) return "Not specified"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Invalid date"

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return "Invalid date range"
  }

  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return `${dateFormatter.format(startDate)} – ${dateFormatter.format(endDate)}`
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getStatusClass(status: DepartureStatus) {
  switch (status) {
    case "scheduled":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "full":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "closed":
      return "border-slate-200 bg-slate-100 text-slate-600"
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700"
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }
}

function StatusBadge({ status }: { status: DepartureStatus }) {
  return (
    <Badge variant="outline" className={getStatusClass(status)}>
      {formatLabel(status)}
    </Badge>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium">{value}</p>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
  iconClass: string
}) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-0">
        <CardDescription className="font-medium">
          {title}
        </CardDescription>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function DepartureDetailsPage() {
  const { departureId } = Route.useParams()

  // TODO: Fetch this record using getDepartureById(departureId).
  const departure = sampleDeparture

  const bookedSeats =
    departure.totalSeats - departure.availableSeats

  const occupiedPercentage =
    departure.totalSeats > 0
      ? Math.round((bookedSeats / departure.totalSeats) * 100)
      : 0

  const pricing = [...departure.pricing].sort((a, b) => {
    const roomOrder: RoomType[] = [
      "single",
      "double",
      "triple",
      "quad",
      "child",
    ]

    return (
      roomOrder.indexOf(a.roomType) -
      roomOrder.indexOf(b.roomType)
    )
  })

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 w-fit text-muted-foreground"
            asChild
          >
            <Link to="/departures">
              <ArrowLeft className="mr-2 size-4" />
              Back to departures
            </Link>
          </Button>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {departure.tourTitle}
              </h1>

              {departure.isGuaranteed && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  <CheckCircle2 className="size-3.5" />
                  Guaranteed
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Departure {departure.code}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={departure.status} />

              <Badge variant="outline">
                {departure.isActive ? "Active" : "Inactive"}
              </Badge>

              <span className="text-xs text-muted-foreground">
                ID: {departureId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link
              to="/tours/$tourId"
              params={{ tourId: departure.tourId }}
            >
              <ExternalLink className="mr-2 size-4" />
              View tour
            </Link>
          </Button>

          {/* Add the departure edit route when it is implemented. */}
          <Button variant="outline" disabled>
            <Pencil className="mr-2 size-4" />
            Edit departure
          </Button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total seats"
          value={departure.totalSeats.toLocaleString("en-IN")}
          description="Departure capacity"
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          title="Available seats"
          value={departure.availableSeats.toLocaleString("en-IN")}
          description={`${bookedSeats} seats occupied`}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          title="Occupancy"
          value={`${occupiedPercentage}%`}
          description="Seats occupied"
          icon={PlaneTakeoff}
          iconClass="bg-violet-50 text-violet-600"
        />

        <MetricCard
          title="Pricing options"
          value={pricing.length.toString()}
          description="Configured room categories"
          icon={Users}
          iconClass="bg-amber-50 text-amber-600"
        />
      </section>

      {/* Main content */}
      <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Departure schedule</CardTitle>
              <CardDescription>
                Travel dates and operational deadlines.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                  <CalendarDays className="size-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">Travel dates</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateRange(
                      departure.startDate,
                      departure.endDate,
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  label="Departure date and time"
                  value={formatDateTime(departure.startDate)}
                />

                <DetailItem
                  label="Return date and time"
                  value={formatDateTime(departure.endDate)}
                />

                <DetailItem
                  label="Booking deadline"
                  value={formatDateTime(departure.bookingDeadline)}
                />

                <DetailItem
                  label="Cancellation deadline"
                  value={formatDateTime(
                    departure.cancellationDeadline,
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seat capacity */}
          <Card>
            <CardHeader>
              <CardTitle>Seat availability</CardTitle>
              <CardDescription>
                Capacity and occupancy for this departure.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <DetailItem
                  label="Total seats"
                  value={departure.totalSeats}
                />

                <DetailItem
                  label="Seats occupied"
                  value={bookedSeats}
                />

                <DetailItem
                  label="Seats remaining"
                  value={departure.availableSeats}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Capacity utilization
                  </span>

                  <span className="font-medium">
                    {occupiedPercentage}%
                  </span>
                </div>

                <div
                  className="h-3 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="Departure seat occupancy"
                  aria-valuemin={0}
                  aria-valuemax={departure.totalSeats}
                  aria-valuenow={bookedSeats}
                >
                  <div
                    className={`h-full rounded-full transition-all ${occupiedPercentage >= 90
                      ? "bg-amber-500"
                      : "bg-primary"
                      }`}
                    style={{ width: `${occupiedPercentage}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {departure.availableSeats === 0
                    ? "No seats are currently available."
                    : `${departure.availableSeats} seats remain available.`}
                </p>
              </div>

              <div className="rounded-lg border border-dashed p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Occupied seats are calculated as total seats minus
                    available seats. This assumes the values remain
                    synchronized with actual bookings in the database.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="gap-0 overflow-hidden py-0">
            <CardHeader className="flex flex-row items-center justify-between gap-3 py-5">
              <div>
                <CardTitle>Departure pricing</CardTitle>
                <CardDescription className="mt-1">
                  Per-person selling prices by room category.
                </CardDescription>
              </div>

              <Badge variant="secondary">
                {pricing.length} options
              </Badge>
            </CardHeader>

            <Separator />

            {pricing.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-muted/30 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">
                        Room type
                      </th>
                      <th className="px-5 py-3 font-medium">
                        Selling price
                      </th>
                      <th className="px-5 py-3 font-medium">
                        Original price
                      </th>
                      <th className="px-5 py-3 font-medium">
                        Discount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {pricing.map((item) => {
                      const discount =
                        item.compareAtPrice !== null &&
                          item.compareAtPrice > item.price
                          ? Math.round(
                            ((item.compareAtPrice - item.price) /
                              item.compareAtPrice) *
                            100,
                          )
                          : null

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-muted/20"
                        >
                          <td className="px-5 py-4 font-medium">
                            {roomTypeLabels[item.roomType]}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-medium">
                            {formatCurrency(item.price)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                            {item.compareAtPrice !== null
                              ? formatCurrency(item.compareAtPrice)
                              : "—"}
                          </td>

                          <td className="px-5 py-4">
                            {discount !== null ? (
                              <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-emerald-700"
                              >
                                {discount}% off
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <CardContent className="py-12 text-center">
                <p className="font-medium">No pricing configured</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This departure has no room pricing options yet.
                </p>
              </CardContent>
            )}

            <Separator />

            <div className="px-5 py-3 text-xs text-muted-foreground">
              Prices are per person in INR and exclude GST.
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
              <CardDescription>
                Operational information for administrators.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {departure.notes ? (
                <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
                  <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {departure.notes}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No internal notes have been added.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
          {/* Associated tour */}
          <Card>
            <CardHeader>
              <CardTitle>Associated tour</CardTitle>
              <CardDescription>
                The travel package linked to this departure.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/5">
                <PlaneTakeoff className="size-5 text-primary" />
              </div>

              <div>
                <h3 className="font-medium">{departure.tourTitle}</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {departure.tourCode}
                </p>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{departure.destination}</span>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link
                  to="/tours/$tourId"
                  params={{ tourId: departure.tourId }}
                >
                  View tour details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Operational status */}
          <Card>
            <CardHeader>
              <CardTitle>Operational status</CardTitle>
              <CardDescription>
                Current departure settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Status
                </span>

                <StatusBadge status={departure.status} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Active
                </span>

                <Badge variant="outline">
                  {departure.isActive ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Guaranteed
                </span>

                {departure.isGuaranteed ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <CheckCircle2 className="mr-1 size-3" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    No
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {departure.status === "cancelled" ? (
                  <XCircle className="size-4 shrink-0 text-red-600" />
                ) : departure.status === "completed" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <Clock3 className="size-4 shrink-0" />
                )}

                <span>
                  {departure.status === "cancelled"
                    ? "This departure is cancelled."
                    : departure.status === "completed"
                      ? "This departure is completed."
                      : departure.status === "full"
                        ? "No seats are available."
                        : departure.status === "closed"
                          ? "Bookings are closed."
                          : "This departure is scheduled."}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Record information */}
          <Card>
            <CardHeader>
              <CardTitle>Record information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailItem
                label="Departure ID"
                value={departureId}
              />

              <DetailItem
                label="Departure code"
                value={departure.code}
              />

              <DetailItem
                label="Created at"
                value={formatDateTime(departure.createdAt)}
              />

              <DetailItem
                label="Last updated"
                value={formatDateTime(departure.updatedAt)}
              />
            </CardContent>
          </Card>

          {/* Deadline reminder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Important deadlines
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Booking deadline
                </p>

                <p className="mt-1 text-sm font-medium">
                  {departure.bookingDeadline
                    ? formatDateTime(departure.bookingDeadline)
                    : "Not configured"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground">
                  Cancellation deadline
                </p>

                <p className="mt-1 text-sm font-medium">
                  {departure.cancellationDeadline
                    ? formatDateTime(departure.cancellationDeadline)
                    : "Not configured"}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}
