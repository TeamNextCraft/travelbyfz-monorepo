import { useForm } from "@tanstack/react-form-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  FileText,
  ImagePlus,
  Info,
  MapPin,
  Plane,
  Plus,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { TagInputList } from "#/components/common/TagInputList.tsx";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import { Textarea } from "#/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/tours/new")({
  component: CreateTourPage,
});

const textareaClass =
  "min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

export type TourFormPayload = {
  destinationId: string | null;
  title: string;
  tagline: string;
  slug: string;
  code: string;
  category: string;
  type: string;
  shortDescription: string | null;
  description: string;
  durationDays: number;
  durationNights: number;
  startLocation: string;
  endLocation: string;
  currency: string;
  tag: string | null;
  minAge: number;
  maxAge: number;
  minGroupSize: number;
  maxGroupSize: number | null;
  difficulty: "Easy" | "Moderate" | "Hard";
  transportIncluded: boolean;
  mealsIncluded: string[] | null;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: unknown[] | null;
  cancellationPolicySummary: string | null;
  termsSummary: string | null;
  importantNotes: string[] | null;
  featuredImage: string | null;
  gallery: string[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Info;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
        <Icon className="size-4 text-primary" />
      </div>

      <div className="space-y-1">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
const requiredLines = (message: string) =>
  z.array(z.string()).refine((lines) => lines.some((l) => l.trim()), message);

export const tourInsertSchema = z.object({
  destinationId: z.string().nullable(),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required").max(200),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),
  code: z.string().min(1, "Tour code is required"),
  category: z.string().min(1, "Select a category"),
  type: z.string().min(1),
  shortDescription: z.string().max(500).nullable(),
  description: z.string().min(1, "Description is required"),
  durationDays: z.number().int().min(1),
  durationNights: z.number().int().min(0),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  currency: z.string().min(1),
  tag: z.string().nullable(),
  minAge: z.number().int().min(0),
  maxAge: z.number().int().min(0),
  minGroupSize: z.number().int().min(1),
  maxGroupSize: z.number().int().min(1).nullable(),
  difficulty: z.enum(["Easy", "Moderate", "Hard"]),
  transportIncluded: z.boolean(),
  mealsIncluded: z.array(z.string()).nullable(),
  inclusions: requiredLines("Add at least one inclusion"),
  exclusions: requiredLines("Add at least one exclusion"),
  highlights: requiredLines("Add at least one highlight"),
  itinerary: z.array(z.unknown()).nullable(),
  cancellationPolicySummary: z.string().nullable(),
  termsSummary: z.string().nullable(),
  importantNotes: z.array(z.string()).nullable(),
  featuredImage: z.string().url("Enter a valid URL").nullable(),
  gallery: z.array(z.string()).nullable(),
  seoTitle: z.string().max(200).nullable(),
  seoDescription: z.string().max(320).nullable(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isActive: z.boolean(),
});

function CreateTourPage() {
  const form = useForm({
    defaultValues: {
      destinationId: null,
      title: "",
      tagline: "",
      slug: "",
      code: "",
      category: "",
      type: "group",
      shortDescription: null,
      description: "",
      durationDays: 5,
      durationNights: 4,
      startLocation: "",
      endLocation: "",
      currency: "INR",
      tag: null,
      minAge: 5,
      maxAge: 75,
      minGroupSize: 1,
      maxGroupSize: null,
      difficulty: "Easy",
      transportIncluded: true,
      mealsIncluded: null,
      inclusions: [],
      exclusions: [],
      highlights: [],
      itinerary: null,
      cancellationPolicySummary: null,
      termsSummary: null,
      importantNotes: null,
      featuredImage: null,
      gallery: null,
      seoTitle: null,
      seoDescription: null,
      isFeatured: false,
      isPublished: false,
      isActive: true,
    } as TourFormPayload,
    validators: {
      onSubmit: tourInsertSchema,
      onBlur: tourInsertSchema,
    },
    onSubmit: async ({ value }) => {},
  });

  return (
    <main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
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

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Create tour
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a travel package for your customers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-500" />
            New tour
          </Badge>
        </div>
      </section>

      <form
        id="tour-create-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main form */}
          <div className="min-w-0 space-y-6">
            {/* Basic information */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={FileText}
                  title="Basic information"
                  description="Add the title and essential details customers will see."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <form.Field name="title">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="Enter tour title"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="tagline">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Tagline</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="e.g. Discover the beauty of Kashmir"
                        />
                        <FieldDescription>
                          A short phrase that communicates the experience.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="slug">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                            placeholder="kashmir-paradise"
                          />
                          <FieldDescription>
                            Used in the public tour URL.
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="code">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Tour Code
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                            placeholder="DOM-KAS-001"
                          />
                          <FieldDescription>
                            A unique internal reference.
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <form.Field name="shortDescription">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Short Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Introduce the tour in a few sentences..."
                        />
                        <FieldDescription>
                          A concise summary for cards and search results.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Full Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Write the complete tour description..."
                        />
                        <FieldDescription>
                          Describe the experience, main attractions, and what
                          customers can expect.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </CardContent>
            </Card>

            {/* Destination and classification */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={MapPin}
                  title="Destination and category"
                  description="Organize the tour and associate it with a destination."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <form.Field name="destinationId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Destination ID
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="Destination record ID"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="category">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value ?? ""}
                            onValueChange={(value) =>
                              field.handleChange(
                                value as TourFormPayload["difficulty"],
                              )
                            }
                          >
                            <SelectTrigger
                              aria-invalid={isInvalid}
                              className="min-w-[120px]"
                            >
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="adventure">
                                Adventure
                              </SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="honeymoon">
                                Honeymoon
                              </SelectItem>
                              <SelectItem value="pilgrimage">
                                Pilgrimage
                              </SelectItem>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="beach">Beach</SelectItem>
                              <SelectItem value="nature">Nature</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="type">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Tour type
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value ?? ""}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger
                              aria-invalid={isInvalid}
                              className="min-w-[120px]"
                            >
                              <SelectValue placeholder="Tour type" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="group">Group tour</SelectItem>
                              <SelectItem value="private">
                                Private tour
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom tour
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <form.Field name="tag">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Tag</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="e.g. Bestseller"
                        />
                        <FieldDescription>
                          Optional label, such as Bestseller, Trending, or
                          Summer Special.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </CardContent>
            </Card>

            {/* Trip details */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={Plane}
                  title="Trip details"
                  description="Specify the duration, route, and travel requirements."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="startLocation">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Start Location
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                            placeholder="e.g. Srinagar Airport"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="endLocation">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            End Location
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                            placeholder="e.g. Srinagar Airport"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="durationDays">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Duration (days)
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="durationNights">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Duration (nights)
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="difficulty">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Difficulty
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value ?? ""}
                            onValueChange={(value) =>
                              field.handleChange(
                                value as TourFormPayload["difficulty"],
                              )
                            }
                          >
                            <SelectTrigger
                              aria-invalid={isInvalid}
                              className="min-w-[120px]"
                            >
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="currency">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.state.value ?? ""}
                            onValueChange={(value) =>
                              field.handleChange(
                                value as TourFormPayload["currency"],
                              )
                            }
                          >
                            <SelectTrigger
                              aria-invalid={isInvalid}
                              className="min-w-[120px]"
                            >
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="INR">
                                INR — Indian Rupee
                              </SelectItem>
                              <SelectItem value="USD">
                                USD — US Dollar
                              </SelectItem>
                              <SelectItem value="AED">
                                AED — UAE Dirham
                              </SelectItem>
                              <SelectItem value="EUR">EUR — Euro</SelectItem>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <form.Field name="minAge">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Minimum age
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="maxAge">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Maximum age
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="minGroupSize">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Minimum group size
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="maxGroupSize">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Maximum group size
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                            type="number"
                            placeholder="e.g. 5"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                <form.Field name="transportIncluded">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                          aria-invalid={isInvalid}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>
                            Transport included
                          </FieldLabel>
                          <FieldDescription>
                            Transport is included in this tour package.
                          </FieldDescription>
                        </FieldContent>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </CardContent>
            </Card>

            {/* Tour highlights */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={Sparkles}
                  title="Tour highlights"
                  description="Highlight the main experiences and set customer expectations."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <form.Field name="highlights">
                  {(field) => (
                    <TagInputList
                      label="Highlights"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. Professional mountain guide"
                    />
                  )}
                </form.Field>

                <form.Field name="inclusions">
                  {(field) => (
                    <TagInputList
                      label="Inclusions"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. Professional mountain guide"
                    />
                  )}
                </form.Field>

                <form.Field name="exclusions">
                  {(field) => (
                    <TagInputList
                      label="Exclusions"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. Professional mountain guide"
                    />
                  )}
                </form.Field>

                <form.Field name="mealsIncluded">
                  {(field) => (
                    <TagInputList
                      label="Meals Included"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. Professional mountain guide"
                    />
                  )}
                </form.Field>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={CalendarDays}
                  title="Itinerary"
                  description="Add day-by-day information for the tour."
                />
              </CardHeader>

              <CardContent className="space-y-3">
                <Field
                  label="Itinerary JSON"
                  htmlFor="itineraryJson"
                  hint="Optional. Enter a JSON array matching your shared TourItinerary type. The exact fields depend on that type's definition."
                >
                  <Textarea
                    id="itineraryJson"
                    name="itineraryJson"
                    className="min-h-36 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={"[\n  {\n    ...\n  }\n]"}
                    defaultValue="[]"
                  />
                </Field>

                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Your database stores the itinerary as structured JSON. A
                      dedicated day-by-day itinerary builder would provide a
                      friendlier editing experience once the TourItinerary shape
                      is confirmed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={FileText}
                  title="Policies and notes"
                  description="Provide important information before customers book."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <Field
                  label="Cancellation policy"
                  htmlFor="cancellationPolicySummary"
                >
                  <Textarea
                    id="cancellationPolicySummary"
                    name="cancellationPolicySummary"
                    className={textareaClass}
                    placeholder="Describe cancellation deadlines and applicable charges..."
                  />
                </Field>

                <Field label="Terms and conditions" htmlFor="termsSummary">
                  <Textarea
                    id="termsSummary"
                    name="termsSummary"
                    className={textareaClass}
                    placeholder="Enter the key terms that apply to this tour..."
                  />
                </Field>

                <form.Field name="importantNotes">
                  {(field) => (
                    <TagInputList
                      label="Important notes"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. Professional mountain guide"
                    />
                  )}
                </form.Field>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={ImagePlus}
                  title="Tour images"
                  description="Configure the featured image and additional gallery URLs."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <form.Field name="featuredImage">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Featured image URL
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                    placeholder="https://example.com/tour-cover.jpg"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="gallery">
                  {(field) => (
                    <TagInputList
                      label="Gallery image URLs"
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      isTouched={field.state.meta.isTouched}
                      isValid={field.state.meta.isValid}
                      errors={field.state.meta.errors}
                      placeholder="e.g. https://example.com/gallery-image-1.jpg"
                    />
                  )}
                </form.Field>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={Search}
                  title="Search engine optimization"
                  description="Configure the title and description used by search engines."
                />
              </CardHeader>

              <CardContent className="space-y-5">
                <Field label="SEO title" htmlFor="seoTitle">
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    placeholder="Kashmir Paradise Tour | FZ Tours & Travels"
                    maxLength={200}
                  />
                </Field>

                <Field
                  label="SEO description"
                  htmlFor="seoDescription"
                  hint="Write a clear, concise summary of the tour."
                >
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    className="min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Discover Kashmir with our thoughtfully planned tour package..."
                    maxLength={320}
                  />
                </Field>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish settings</CardTitle>
                <CardDescription>
                  Control the visibility of this tour.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <form.Field name="isActive">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                          aria-invalid={isInvalid}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>Active</FieldLabel>
                          <FieldDescription>
                            The tour is enabled in the administration system.
                          </FieldDescription>
                        </FieldContent>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="isFeatured">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                          aria-invalid={isInvalid}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>Featured</FieldLabel>
                          <FieldDescription>
                            Mark this tour as featured for use on the public
                            website.
                          </FieldDescription>
                        </FieldContent>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Publishing and activating are separate controls. A
                      published but inactive tour should not be treated as
                      available for customers.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  name="intent"
                  value="draft"
                  variant="outline"
                  className="w-full"
                >
                  <Save className="mr-2 size-4" />
                  Save as draft
                </Button>

                <Button
                  type="submit"
                  name="intent"
                  value="publish"
                  className="w-full"
                >
                  <Check className="mr-2 size-4" />
                  Publish tour
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  asChild
                >
                  <Link to="/tours">Cancel</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Before publishing</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {[
                  "Check the tour title and URL slug.",
                  "Review the itinerary and trip duration.",
                  "Confirm the inclusions and exclusions.",
                  "Add a featured image.",
                  "Verify pricing for scheduled departures.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border">
                      <Check className="size-2.5 text-muted-foreground" />
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </form>
    </main>
  );
}
