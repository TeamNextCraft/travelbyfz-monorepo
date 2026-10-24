import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  ExternalLink,
  FileText,
  ImageIcon,
  MapPin,
  Pencil,
  Star,
  Users,
  X,
} from "lucide-react"

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

export const Route = createFileRoute("/_authenticated/tours/$tourId/")({
  component: TourDetailsPage,
})

/**
 * Temporary sample data.
 *
 * Replace this with the result of getTourById(tourId).
 */
const sampleTour = {
  id: "tour-001",
  destinationId: null,

  title: "Kashmir Paradise",
  tagline: "Discover the breathtaking beauty of Kashmir",
  slug: "kashmir-paradise",
  code: "DOM-KAS-001",

  category: "family",
  type: "group",

  shortDescription:
    "Experience beautiful valleys, stunning lakes, and the magnificent mountains of Kashmir.",

  description:
    "Discover Kashmir through its breathtaking landscapes, beautiful Mughal gardens, peaceful lakes, and memorable cultural experiences. This tour combines sightseeing, comfortable accommodation, and opportunities to explore the region at a relaxed pace.",

  durationDays: 6,
  durationNights: 5,

  startLocation: "Srinagar Airport",
  endLocation: "Srinagar Airport",

  currency: "INR",
  tag: "Bestseller",

  minAge: 5,
  maxAge: 75,
  minGroupSize: 1,
  maxGroupSize: 20,

  difficulty: "Easy",

  transportIncluded: true,
  mealsIncluded: ["Breakfast", "Dinner"],

  inclusions: [
    "Hotel accommodation",
    "Daily breakfast",
    "Airport transfers",
    "Local sightseeing as per itinerary",
  ],

  exclusions: [
    "Flights unless specifically included",
    "Personal expenses",
    "Optional activities",
    "Meals not mentioned in inclusions",
  ],

  highlights: [
    "Enjoy a shikara ride on Dal Lake",
    "Explore the famous Mughal gardens",
    "Experience the beauty of Kashmir Valley",
    "Visit popular local attractions",
  ],

  itinerary: [],

  cancellationPolicySummary:
    "Cancellation charges depend on the cancellation date and applicable booking terms.",

  termsSummary:
    "Travelers must carry valid identification. Final departure arrangements are subject to confirmation.",

  importantNotes: [
    "Carry a valid photo ID.",
    "Weather conditions may affect sightseeing.",
    "Confirm departure dates before making travel arrangements.",
  ],

  featuredImage: null,
  gallery: [],

  avgRating: 4.8,
  reviewCount: 124,
  bookingCount: 86,

  isFeatured: true,
  isPublished: true,
  isActive: true,

  seoTitle: "Kashmir Paradise Tour | FZ Tours & Travels",
  seoDescription:
    "Discover Kashmir with a thoughtfully planned tour featuring scenic landscapes, sightseeing, and comfortable accommodation.",
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getTourStatus() {
  if (!sampleTour.isActive) return "Inactive"
  if (!sampleTour.isPublished) return "Draft"
  return "Published"
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Draft"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-100 text-slate-600"

  return (
    <Badge variant="outline" className={className}>
      {status}
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

function ListSection({
  title,
  description,
  items,
  included,
}: {
  title: string
  description: string
  items: string[]
  included?: boolean
}) {
  const Icon = included === false ? X : Check

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${included === false
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                  <Icon className="size-3.5" />
                </div>

                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySection message={`No ${title.toLowerCase()} added yet.`} />
        )}
      </CardContent>
    </Card>
  )
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
      <FileText className="mx-auto size-6 text-muted-foreground" />

      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function TourDetailsPage() {
  const { tourId } = Route.useParams()

  // TODO: Load the actual tour using getTourById(tourId).
  const tour = sampleTour
  const status = getTourStatus()

  const formattedCategory = formatLabel(tour.category)
  const formattedType = formatLabel(tour.type)

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 w-fit text-muted-foreground"
            asChild
          >
            <Link to="/tours">
              <ArrowLeft className="mr-2 size-4" />
              Back to tours
            </Link>
          </Button>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {tour.title}
              </h1>

              {tour.isFeatured && (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-200 bg-amber-50 text-amber-700"
                >
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  Featured
                </Badge>
              )}
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground">
              {tour.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              <Badge variant="secondary">{formattedCategory}</Badge>

              <Badge variant="outline">{formattedType}</Badge>

              <span className="text-xs text-muted-foreground">
                Tour code: {tour.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link
              to="/tours/$tourId/edit"
              params={{ tourId }}
            >
              <Pencil className="mr-2 size-4" />
              Edit tour
            </Link>
          </Button>

          {tour.isPublished && (
            <Button variant="outline" asChild>
              <a
                href={`/tours/${tour.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 size-4" />
                View public page
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Overview statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Bookings"
          value={tour.bookingCount.toLocaleString("en-IN")}
          description="Total bookings"
          icon={Users}
        />

        <MetricCard
          title="Average rating"
          value={
            tour.reviewCount > 0
              ? tour.avgRating.toFixed(1)
              : "—"
          }
          description={`${tour.reviewCount} reviews`}
          icon={Star}
        />

        <MetricCard
          title="Duration"
          value={`${tour.durationDays} days`}
          description={`${tour.durationNights} nights`}
          icon={CalendarDays}
        />

        <MetricCard
          title="Difficulty"
          value={tour.difficulty}
          description="Travel difficulty"
          icon={Compass}
        />
      </section>

      {/* Tour information and sidebar */}
      <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Tour overview</CardTitle>

              <CardDescription>
                Main information about this travel package.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {tour.description}
                </p>
              </div>

              {tour.shortDescription && (
                <>
                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">
                      Short description
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tour.shortDescription}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Trip details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip details</CardTitle>

              <CardDescription>
                Duration, route, and traveler requirements.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Starting point"
                  value={tour.startLocation}
                />

                <DetailItem
                  label="Ending point"
                  value={tour.endLocation}
                />

                <DetailItem
                  label="Tour type"
                  value={formattedType}
                />

                <DetailItem
                  label="Minimum age"
                  value={`${tour.minAge} years`}
                />

                <DetailItem
                  label="Maximum age"
                  value={`${tour.maxAge} years`}
                />

                <DetailItem
                  label="Minimum group size"
                  value={tour.minGroupSize}
                />

                <DetailItem
                  label="Maximum group size"
                  value={tour.maxGroupSize ?? "Not specified"}
                />

                <DetailItem
                  label="Transport"
                  value={tour.transportIncluded ? "Included" : "Not included"}
                />

                <DetailItem
                  label="Currency"
                  value={tour.currency}
                />
              </div>

              {tour.mealsIncluded.length > 0 && (
                <>
                  <Separator className="my-5" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      Meals included
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {tour.mealsIncluded.map((meal) => (
                        <Badge variant="secondary" key={meal}>
                          {meal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Highlights */}
          <ListSection
            title="Tour highlights"
            description="The main experiences offered by this package."
            items={tour.highlights}
          />

          {/* Inclusions and exclusions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ListSection
              title="What's included"
              description="Services included in the tour package."
              items={tour.inclusions}
            />

            <ListSection
              title="What's excluded"
              description="Expenses and services not covered."
              items={tour.exclusions}
              included={false}
            />
          </div>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>

              <CardDescription>
                Day-by-day plan for the tour.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {tour.itinerary.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {tour.itinerary.length} itinerary entries configured.
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Render each entry here using the actual TourItinerary
                    type from your shared types package.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-5 py-10 text-center">
                  <CalendarDays className="size-8 text-muted-foreground" />

                  <h3 className="mt-3 text-sm font-semibold">
                    No itinerary added
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Add day-by-day activities to help customers understand
                    the tour schedule.
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    asChild
                  >
                    <Link
                      to="/tours/$tourId/edit"
                      params={{ tourId }}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit itinerary
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Policies and notes</CardTitle>

              <CardDescription>
                Important terms associated with this tour.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <PolicyBlock
                title="Cancellation policy"
                content={tour.cancellationPolicySummary}
              />

              <Separator />

              <PolicyBlock
                title="Terms and conditions"
                content={tour.termsSummary}
              />

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Important notes
                </h3>

                {tour.importantNotes.length > 0 ? (
                  <ul className="space-y-2">
                    {tour.importantNotes.map((note) => (
                      <li
                        key={note}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No important notes provided.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image information */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>

              <CardDescription>
                Featured image and gallery configured for this tour.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {tour.featuredImage ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Featured image</p>

                  <a
                    href={tour.featuredImage}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {tour.featuredImage}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
                  <ImageIcon className="size-5 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      No featured image
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Add a cover image to improve the public tour page.
                    </p>
                  </div>
                </div>
              )}

              {tour.gallery.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gallery images</p>

                  {tour.gallery.map((imageUrl) => (
                    <a
                      key={imageUrl}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {imageUrl}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No additional gallery images configured.
                </p>
              )}

              <Button variant="outline" size="sm" asChild>
                <Link
                  to="/tours/$tourId/edit"
                  params={{ tourId }}
                >
                  <ImageIcon className="mr-2 size-4" />
                  Manage images
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>

              <CardDescription>
                Current visibility settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Publication
                </span>

                <StatusBadge
                  status={tour.isPublished ? "Published" : "Draft"}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Availability
                </span>

                <Badge variant="outline">
                  {tour.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Featured
                </span>

                <span className="text-sm font-medium">
                  {tour.isFeatured ? "Yes" : "No"}
                </span>
              </div>

              <Separator />

              <Button className="w-full" asChild>
                <Link
                  to="/tours/$tourId/edit"
                  params={{ tourId }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit tour
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Destination */}
          <Card>
            <CardHeader>
              <CardTitle>Destination</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
                <MapPin className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {tour.startLocation}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Start location
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium">
                  {tour.endLocation}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  End location
                </p>
              </div>

              {tour.destinationId && (
                <p className="break-all text-xs text-muted-foreground">
                  Destination ID: {tour.destinationId}
                </p>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO preview</CardTitle>

              <CardDescription>
                Search engine metadata.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm font-medium text-blue-700">
                {tour.seoTitle || tour.title}
              </p>

              <p className="break-all text-xs text-emerald-700">
                /tours/{tour.slug}
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {tour.seoDescription ||
                  tour.shortDescription ||
                  "No SEO description provided."}
              </p>
            </CardContent>
          </Card>

          {/* Record information */}
          <Card>
            <CardHeader>
              <CardTitle>Record information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailItem label="Tour ID" value={tourId} />

              <DetailItem label="Tour code" value={tour.code} />

              <DetailItem label="URL slug" value={tour.slug} />

              <DetailItem
                label="Category"
                value={formattedCategory}
              />

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />
                Database timestamps can be displayed here once the record
                is loaded from the server.
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: typeof Users
}) {
  return (
    <Card className="gap-4 py-5">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        </div>

        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function PolicyBlock({
  title,
  content,
}: {
  title: string
  content: string | null
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {content || "No information provided."}
      </p>
    </div>
  )
}
