import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  MapPin,
  Plus,
  Users,
  Wallet,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
})

const stats = [
  {
    title: "Total Bookings",
    value: "1,284",
    description: "Compared to last month",
    change: "+12.5%",
    trend: "up",
    icon: CalendarDays,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Total Revenue",
    value: "₹18,42,500",
    description: "Compared to last month",
    change: "+8.2%",
    trend: "up",
    icon: Wallet,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Active Tours",
    value: "38",
    description: "Currently published",
    change: "+3 this month",
    trend: "up",
    icon: Compass,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    title: "New Enquiries",
    value: "24",
    description: "Awaiting follow-up",
    change: "5 need attention",
    trend: "down",
    icon: Users,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
] as const

const recentBookings = [
  {
    reference: "BK-2026-001",
    customer: "Rahul Sharma",
    tour: "Kashmir Paradise",
    date: "Oct 28, 2026",
    guests: 2,
    amount: 24500,
    status: "Confirmed",
  },
  {
    reference: "BK-2026-002",
    customer: "Priya Patel",
    tour: "Rajasthan Heritage",
    date: "Nov 04, 2026",
    guests: 4,
    amount: 48600,
    status: "Pending",
  },
  {
    reference: "BK-2026-003",
    customer: "Amit Verma",
    tour: "Kerala Backwaters",
    date: "Nov 12, 2026",
    guests: 2,
    amount: 32000,
    status: "Confirmed",
  },
  {
    reference: "BK-2026-004",
    customer: "Neha Desai",
    tour: "Goa Beach Escape",
    date: "Nov 18, 2026",
    guests: 3,
    amount: 38700,
    status: "Pending",
  },
  {
    reference: "BK-2026-005",
    customer: "Karan Mehta",
    tour: "Manali Adventure",
    date: "Nov 25, 2026",
    guests: 2,
    amount: 18500,
    status: "Cancelled",
  },
] as const

const upcomingDepartures = [
  {
    tour: "Kashmir Paradise",
    destination: "Srinagar, Kashmir",
    date: "Oct 28, 2026",
    booked: 18,
    capacity: 24,
  },
  {
    tour: "Rajasthan Heritage",
    destination: "Jaipur, Rajasthan",
    date: "Nov 04, 2026",
    booked: 22,
    capacity: 25,
  },
  {
    tour: "Kerala Backwaters",
    destination: "Alleppey, Kerala",
    date: "Nov 12, 2026",
    booked: 12,
    capacity: 20,
  },
] as const

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusClass(status: string) {
  switch (status) {
    case "Confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Pending":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function DashboardPage() {
  return (
    <main className="min-w-0 space-y-8 p-4 md:p-6 lg:p-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Welcome back! Here's an overview of your travel business.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/bookings">
              <CalendarDays className="mr-2 size-4" />
              View bookings
            </Link>
          </Button>

          <Button asChild>
            <Link to="/tours/new">
              <Plus className="mr-2 size-4" />
              Create tour
            </Link>
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon =
            stat.trend === "up" ? ArrowUpRight : ArrowDownRight

          return (
            <Card key={stat.title} className="gap-4 py-5">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
                <CardDescription className="font-medium text-foreground">
                  {stat.title}
                </CardDescription>

                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${stat.trend === "up"
                      ? "text-emerald-600"
                      : "text-orange-600"
                      }`}
                  >
                    <TrendIcon className="size-3.5" />
                    {stat.change}
                  </span>

                  <span className="text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Main dashboard content */}
      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent bookings */}
        <Card className="min-w-0 gap-0 overflow-hidden py-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3 py-5">
            <div className="space-y-1">
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>
                The latest reservations made by your customers.
              </CardDescription>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/bookings">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Tour</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.reference}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="font-medium">
                          {booking.customer}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {booking.reference}
                        </div>
                      </td>

                      <td className="min-w-40 px-5 py-4">
                        <div className="font-medium">{booking.tour}</div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {booking.date} · {booking.guests} guests
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {formatCurrency(booking.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={getStatusClass(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming departures */}
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3 py-5">
            <div className="space-y-1">
              <CardTitle>Upcoming departures</CardTitle>
              <CardDescription>
                Keep track of your next scheduled tours.
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="View all departures"
            >
              <Link to="/departures">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-5 py-5">
            {upcomingDepartures.map((departure) => {
              const percentage = Math.min(
                100,
                Math.round(
                  (departure.booked / departure.capacity) * 100,
                ),
              )

              return (
                <div key={departure.tour} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                      <MapPin className="size-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {departure.tour}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {departure.destination}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {departure.date}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Seats booked
                      </span>

                      <span className="font-medium">
                        {departure.booked}/{departure.capacity}
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${departure.tour} seats booked`}
                      aria-valuemin={0}
                      aria-valuemax={departure.capacity}
                      aria-valuenow={departure.booked}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <Button variant="outline" className="w-full" asChild>
              <Link to="/departures">
                Manage departures
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Quick actions
          </h2>

          <p className="text-sm text-muted-foreground">
            Common tasks to help manage your travel business.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            icon={Compass}
            title="Create a tour"
            description="Add a new travel package."
            to="/tours/new"
          />

          <QuickAction
            icon={MapPin}
            title="Add a destination"
            description="Manage your travel destinations."
            to="/destinations/new"
          />

          <QuickAction
            icon={CheckCircle2}
            title="Manage bookings"
            description="Review and update reservations."
            to="/bookings"
          />

          <QuickAction
            icon={Clock3}
            title="Review enquiries"
            description="Follow up with potential customers."
            to="/enquiries"
          />
        </div>
      </section>
    </main>
  )
}

function QuickAction({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: typeof Compass
  title: string
  description: string
  to: string
}) {
  return (
    <Card className="gap-4 py-5 transition-colors hover:border-primary/40">
      <CardContent className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>

          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-xs"
            asChild
          >
            <Link to={to}>
              Open
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
