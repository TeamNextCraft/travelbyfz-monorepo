import { useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowDownUp,
  CheckCircle2,
  CirclePlus,
  Compass,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Search,
  Star,
  XCircle,
} from "lucide-react"

import { Button } from "#/components/ui/button"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"

export const Route = createFileRoute("/_authenticated/tours/")({
  component: ToursPage,
})

type Tour = {
  id: string
  title: string
  code: string
  destination: string
  category: string
  type: string
  durationDays: number
  durationNights: number
  avgRating: number
  reviewCount: number
  bookingCount: number
  isFeatured: boolean
  isPublished: boolean
  isActive: boolean
}

// Sample data for UI development.
// Replace this array with data returned by your server function.
const sampleTours: Tour[] = [
  {
    id: "tour-001",
    title: "Kashmir Paradise",
    code: "DOM-KAS-001",
    destination: "Srinagar, Kashmir",
    category: "Family",
    type: "Group",
    durationDays: 6,
    durationNights: 5,
    avgRating: 4.8,
    reviewCount: 124,
    bookingCount: 86,
    isFeatured: true,
    isPublished: true,
    isActive: true,
  },
  {
    id: "tour-002",
    title: "Rajasthan Heritage Trail",
    code: "DOM-RAJ-002",
    destination: "Jaipur, Rajasthan",
    category: "Cultural",
    type: "Group",
    durationDays: 5,
    durationNights: 4,
    avgRating: 4.6,
    reviewCount: 89,
    bookingCount: 64,
    isFeatured: true,
    isPublished: true,
    isActive: true,
  },
  {
    id: "tour-003",
    title: "Kerala Backwaters Escape",
    code: "DOM-KER-003",
    destination: "Alleppey, Kerala",
    category: "Nature",
    type: "Private",
    durationDays: 4,
    durationNights: 3,
    avgRating: 4.9,
    reviewCount: 76,
    bookingCount: 52,
    isFeatured: false,
    isPublished: true,
    isActive: true,
  },
  {
    id: "tour-004",
    title: "Goa Beach Holiday",
    code: "DOM-GOA-004",
    destination: "North Goa",
    category: "Beach",
    type: "Group",
    durationDays: 4,
    durationNights: 3,
    avgRating: 4.5,
    reviewCount: 48,
    bookingCount: 41,
    isFeatured: false,
    isPublished: true,
    isActive: true,
  },
  {
    id: "tour-005",
    title: "Manali Mountain Adventure",
    code: "DOM-MAN-005",
    destination: "Manali, Himachal Pradesh",
    category: "Adventure",
    type: "Group",
    durationDays: 6,
    durationNights: 5,
    avgRating: 0,
    reviewCount: 0,
    bookingCount: 0,
    isFeatured: false,
    isPublished: false,
    isActive: true,
  },
  {
    id: "tour-006",
    title: "Golden Temple Pilgrimage",
    code: "DOM-AMR-006",
    destination: "Amritsar, Punjab",
    category: "Pilgrimage",
    type: "Private",
    durationDays: 3,
    durationNights: 2,
    avgRating: 4.7,
    reviewCount: 31,
    bookingCount: 24,
    isFeatured: false,
    isPublished: true,
    isActive: false,
  },
]

type StatusFilter = "all" | "published" | "draft" | "inactive"

function getTourStatus(tour: Tour) {
  if (!tour.isActive) return "Inactive"
  if (!tour.isPublished) return "Draft"
  return "Published"
}

function getStatusClass(status: string) {
  switch (status) {
    case "Published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Draft":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Inactive":
      return "border-slate-200 bg-slate-100 text-slate-600"
    default:
      return ""
  }
}

function ToursPage() {
  const [tours] = useState<Tour[]>(sampleTours)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<"title" | "bookings">("title")

  const categories = useMemo(
    () => [...new Set(tours.map((tour) => tour.category))].sort(),
    [tours],
  )

  const stats = useMemo(
    () => ({
      total: tours.length,
      published: tours.filter(
        (tour) => tour.isActive && tour.isPublished,
      ).length,
      drafts: tours.filter(
        (tour) => tour.isActive && !tour.isPublished,
      ).length,
      inactive: tours.filter((tour) => !tour.isActive).length,
    }),
    [tours],
  )

  const filteredTours = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = tours.filter((tour) => {
      const matchesSearch =
        !query ||
        tour.title.toLowerCase().includes(query) ||
        tour.code.toLowerCase().includes(query) ||
        tour.destination.toLowerCase().includes(query) ||
        tour.category.toLowerCase().includes(query)

      const matchesCategory =
        category === "all" || tour.category === category

      const matchesStatus =
        status === "all" ||
        (status === "published" &&
          tour.isPublished &&
          tour.isActive) ||
        (status === "draft" &&
          !tour.isPublished &&
          tour.isActive) ||
        (status === "inactive" && !tour.isActive)

      return matchesSearch && matchesCategory && matchesStatus
    })

    return result.sort((a, b) => {
      if (sortBy === "bookings") {
        return b.bookingCount - a.bookingCount
      }

      return a.title.localeCompare(b.title)
    })
  }, [tours, search, category, status, sortBy])

  function resetFilters() {
    setSearch("")
    setCategory("all")
    setStatus("all")
  }

  const hasFilters =
    search.trim() !== "" || category !== "all" || status !== "all"

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tours
          </h1>

          <p className="text-sm text-muted-foreground">
            Create, manage, and organize your travel packages.
          </p>
        </div>

        <Button asChild>
          <Link to="/tours/new">
            <CirclePlus className="mr-2 size-4" />
            Create tour
          </Link>
        </Button>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TourStatCard
          title="Total tours"
          value={stats.total}
          description="Across all categories"
          icon={Compass}
          iconClass="bg-blue-50 text-blue-600"
        />

        <TourStatCard
          title="Published"
          value={stats.published}
          description="Active and visible"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <TourStatCard
          title="Drafts"
          value={stats.drafts}
          description="Not yet published"
          icon={Pencil}
          iconClass="bg-amber-50 text-amber-600"
        />

        <TourStatCard
          title="Inactive"
          value={stats.inactive}
          description="Currently disabled"
          icon={XCircle}
          iconClass="bg-slate-100 text-slate-600"
        />
      </section>

      {/* Tours table */}
      <Card className="gap-0 overflow-hidden py-0">
        {/* Table heading */}
        <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">All tours</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and manage your tour packages.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit">
            {filteredTours.length}{" "}
            {filteredTours.length === 1 ? "tour" : "tours"}
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-y bg-muted/20 p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tours, code, destination..."
              className="bg-background pl-9"
              aria-label="Search tours"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              aria-label="Filter by status"
              className="h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle tour sort order"
              title="Toggle sort order"
              onClick={() =>
                setSortBy((current) =>
                  current === "title" ? "bookings" : "title",
                )
              }
            >
              <ArrowDownUp className="size-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table className="min-w-[850px]">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-5 text-xs">Tour</TableHead>
              <TableHead className="h-11 px-5 text-xs">Category</TableHead>
              <TableHead className="h-11 px-5 text-xs">Duration</TableHead>
              <TableHead className="h-11 px-5 text-xs">Performance</TableHead>
              <TableHead className="h-11 px-5 text-xs">Status</TableHead>
              <TableHead className="h-11 px-5 text-right text-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTours.map((tour) => {
              const tourStatus = getTourStatus(tour)

              return (
                <TableRow key={tour.id}>
                  {/* Tour information */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                        <Compass className="size-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tour.title}</span>

                          {tour.isFeatured && (
                            <Star
                              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                              aria-label="Featured tour"
                            />
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          <span>{tour.destination}</span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {tour.code}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-5 py-4">
                    <Badge variant="secondary">{tour.category}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tour.type}
                    </p>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="px-5 py-4">
                    <div className="font-medium">{tour.durationDays} days</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tour.durationNights} nights
                    </p>
                  </TableCell>

                  {/* Performance */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-1 font-medium">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {tour.reviewCount > 0 ? tour.avgRating.toFixed(1) : "—"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tour.bookingCount} bookings
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={getStatusClass(tourStatus)}
                    >
                      {tourStatus}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${tour.title}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/tours/$tourId" params={{ tourId: tour.id }}>
                            <Eye className="mr-2 size-4" />
                            View details
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="/tours/$tourId/edit"
                            params={{ tourId: tour.id }}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit tour
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Empty state */}
        {filteredTours.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h3 className="font-semibold">No tours found</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>

            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Table footer */}
        <div className="flex flex-col gap-2 border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredTours.length} of {tours.length} tours
          </span>

          <span>
            Sort by: {sortBy === "title" ? "Tour name" : "Most bookings"}
          </span>
        </div>
      </Card>
    </main>
  )
}

function TourStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string
  value: number
  description: string
  icon: typeof Compass
  iconClass: string
}) {
  return (
    <Card className="gap-4 py-5">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon className="size-5" />
          </div>
        </div>

        <div className="text-2xl font-semibold tracking-tight">
          {value.toLocaleString("en-IN")}
        </div>

        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
