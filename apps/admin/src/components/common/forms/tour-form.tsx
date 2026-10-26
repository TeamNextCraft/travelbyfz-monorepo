import { type AnyFieldApi, useForm } from "@tanstack/react-form-start";
import {
	ArrowLeft,
	CalendarDays,
	Check,
	FileText,
	ImagePlus,
	Info,
	Loader2,
	MapPin,
	Plane,
	Search,
	Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { z } from "zod";
import { ItineraryInputList } from "#/components/common/itinerary-input-list";
import { CheckboxField } from "#/components/form/checkbox-input";
import { SelectField } from "#/components/form/select-input";
import { TextAreaField } from "#/components/form/text-area-input";
import { TextField } from "#/components/form/text-input";
import { TextInputArray } from "#/components/form/text-input-array";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { tourInsertSchema } from "#/lib/schema";

export type TourInputSchema = z.infer<typeof tourInsertSchema>;

export const emptyTour: TourInputSchema = {
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
} as TourInputSchema;

/* ------------------------------------------------------------------ */
/* Small field helpers                                                 */
/* ------------------------------------------------------------------ */

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

function FormSection({
	icon,
	title,
	description,
	children,
}: {
	icon: typeof Info;
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<SectionHeading icon={icon} title={title} description={description} />
			</CardHeader>
			<CardContent className="space-y-5">{children}</CardContent>
		</Card>
	);
}

function TagField({
	field,
	label,
	placeholder,
}: {
	field: AnyFieldApi;
	label: string;
	placeholder: string;
}) {
	return (
		<TextInputArray
			label={label}
			name={field.name}
			value={field.state.value}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			isTouched={field.state.meta.isTouched}
			isValid={field.state.meta.isValid}
			errors={field.state.meta.errors}
			placeholder={placeholder}
		/>
	);
}

const CATEGORY_OPTIONS = [
	{ value: "adventure", label: "Adventure" },
	{ value: "family", label: "Family" },
	{ value: "honeymoon", label: "Honeymoon" },
	{ value: "pilgrimage", label: "Pilgrimage" },
	{ value: "cultural", label: "Cultural" },
	{ value: "beach", label: "Beach" },
	{ value: "nature", label: "Nature" },
	{ value: "other", label: "Other" },
];

const TYPE_OPTIONS = [
	{ value: "group", label: "Group tour" },
	{ value: "private", label: "Private tour" },
	{ value: "custom", label: "Custom tour" },
];

const DIFFICULTY_OPTIONS = [
	{ value: "Easy", label: "Easy" },
	{ value: "Moderate", label: "Moderate" },
	{ value: "Hard", label: "Hard" },
];

const CURRENCY_OPTIONS = [
	{ value: "INR", label: "INR — Indian Rupee" },
	{ value: "USD", label: "USD — US Dollar" },
	{ value: "AED", label: "AED — UAE Dirham" },
	{ value: "EUR", label: "EUR — Euro" },
];

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

type TourFormProps = {
	mode: "create" | "edit";
	defaultValues?: TourInputSchema;
	onSubmit: (value: TourInputSchema) => Promise<void>;
	onCancel: () => void;
};

export function TourForm({
	mode,
	defaultValues = emptyTour,
	onSubmit,
	onCancel,
}: TourFormProps) {
	const isEdit = mode === "edit";

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: tourInsertSchema,
			onBlur: tourInsertSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						onClick={onCancel}
					>
						<ArrowLeft className="mr-2 size-4" />
						{isEdit ? "Back to tour" : "Back to tours"}
					</Button>

					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{isEdit ? "Edit tour" : "Create tour"}
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							{isEdit
								? "Update the details of this travel package."
								: "Create a travel package for your customers."}
						</p>
					</div>
				</div>

				<Badge variant="outline" className="gap-1.5">
					<span
						className={`size-1.5 rounded-full ${isEdit ? "bg-blue-500" : "bg-amber-500"}`}
					/>
					{isEdit ? "Editing" : "New tour"}
				</Badge>
			</section>

			<form
				id="tour-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					{/* Main form */}
					<div className="min-w-0 space-y-6">
						<FormSection
							icon={FileText}
							title="Basic information"
							description="Add the title and essential details customers will see."
						>
							<form.Field name="title">
								{(field) => (
									<TextField
										field={field}
										label="Title"
										placeholder="Enter tour title"
									/>
								)}
							</form.Field>

							<form.Field name="tagline">
								{(field) => (
									<TextField
										field={field}
										label="Tagline"
										placeholder="e.g. Discover the beauty of Kashmir"
										description="A short phrase that communicates the experience."
									/>
								)}
							</form.Field>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="slug">
									{(field) => (
										<TextField
											field={field}
											label="Slug"
											placeholder="kashmir-paradise"
											description="Used in the public tour URL."
										/>
									)}
								</form.Field>
								<form.Field name="code">
									{(field) => (
										<TextField
											field={field}
											label="Tour Code"
											placeholder="DOM-KAS-001"
											description="A unique internal reference."
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="shortDescription">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Short Description"
										placeholder="Introduce the tour in a few sentences..."
										description="A concise summary for cards and search results."
									/>
								)}
							</form.Field>

							<form.Field name="description">
								{(field) => (
									<TextAreaField
										field={field}
										label="Full Description"
										placeholder="Write the complete tour description..."
										description="Describe the experience, main attractions, and what customers can expect."
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={MapPin}
							title="Destination and category"
							description="Organize the tour and associate it with a destination."
						>
							<form.Field name="destinationId">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Destination ID"
										placeholder="Destination record ID"
									/>
								)}
							</form.Field>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="category">
									{(field) => (
										<SelectField
											field={field}
											label="Category"
											placeholder="Select Category"
											options={CATEGORY_OPTIONS}
										/>
									)}
								</form.Field>
								<form.Field name="type">
									{(field) => (
										<SelectField
											field={field}
											label="Tour type"
											placeholder="Tour type"
											options={TYPE_OPTIONS}
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="tag">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Tag"
										placeholder="e.g. Bestseller"
										description="Optional label, such as Bestseller, Trending, or Summer Special."
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={Plane}
							title="Trip details"
							description="Specify the duration, route, and travel requirements."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="startLocation">
									{(field) => (
										<TextField
											field={field}
											label="Start Location"
											placeholder="e.g. Srinagar Airport"
										/>
									)}
								</form.Field>
								<form.Field name="endLocation">
									{(field) => (
										<TextField
											field={field}
											label="End Location"
											placeholder="e.g. Srinagar Airport"
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="durationDays">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Duration (days)"
											placeholder="e.g. 5"
										/>
									)}
								</form.Field>
								<form.Field name="durationNights">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Duration (nights)"
											placeholder="e.g. 4"
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="difficulty">
									{(field) => (
										<SelectField
											field={field}
											label="Difficulty"
											placeholder="Difficulty"
											options={DIFFICULTY_OPTIONS}
										/>
									)}
								</form.Field>
								<form.Field name="currency">
									{(field) => (
										<SelectField
											field={field}
											label="Currency"
											placeholder="Currency"
											options={CURRENCY_OPTIONS}
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="minAge">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Minimum age"
											placeholder="e.g. 5"
										/>
									)}
								</form.Field>
								<form.Field name="maxAge">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Maximum age"
											placeholder="e.g. 75"
										/>
									)}
								</form.Field>
								<form.Field name="minGroupSize">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Minimum group size"
											placeholder="e.g. 1"
										/>
									)}
								</form.Field>
								<form.Field name="maxGroupSize">
									{(field) => (
										<TextField
											field={field}
											type="number"
											nullable
											label="Maximum group size"
											placeholder="No limit"
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="transportIncluded">
								{(field) => (
									<CheckboxField
										field={field}
										label="Transport included"
										description="Transport is included in this tour package."
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={Sparkles}
							title="Tour highlights"
							description="Highlight the main experiences and set customer expectations."
						>
							<form.Field name="highlights">
								{(field) => (
									<TagField
										field={field}
										label="Highlights"
										placeholder="e.g. Shikara ride on Dal Lake"
									/>
								)}
							</form.Field>
							<form.Field name="inclusions">
								{(field) => (
									<TagField
										field={field}
										label="Inclusions"
										placeholder="e.g. Airport transfers"
									/>
								)}
							</form.Field>
							<form.Field name="exclusions">
								{(field) => (
									<TagField
										field={field}
										label="Exclusions"
										placeholder="e.g. Airfare"
									/>
								)}
							</form.Field>
							<form.Field name="mealsIncluded">
								{(field) => (
									<TagField
										field={field}
										label="Meals Included"
										placeholder="e.g. Daily breakfast"
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={CalendarDays}
							title="Itinerary"
							description="Add day-by-day information for the tour."
						>
							<form.Field name="itinerary">
								{(field) => (
									<ItineraryInputList
										label="Tour Itinerary"
										name={field.name}
										value={field.state.value}
										onChange={field.handleChange}
										isTouched={field.state.meta.isTouched}
										// NOTE: was `!isValid` in the original, which looked inverted
										isValid={field.state.meta.isValid}
										errors={field.state.meta.errors}
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={FileText}
							title="Policies and notes"
							description="Provide important information before customers book."
						>
							<form.Field name="cancellationPolicySummary">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Cancellation policy"
										placeholder="Describe cancellation deadlines and applicable charges..."
									/>
								)}
							</form.Field>
							<form.Field name="termsSummary">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Terms and conditions"
										placeholder="Enter the key terms that apply to this tour..."
									/>
								)}
							</form.Field>
							<form.Field name="importantNotes">
								{(field) => (
									<TagField
										field={field}
										label="Important notes"
										placeholder="e.g. Carry a valid government ID"
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={ImagePlus}
							title="Tour images"
							description="Configure the featured image and additional gallery URLs."
						>
							<form.Field name="featuredImage">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Featured image URL"
										placeholder="https://example.com/tour-cover.jpg"
									/>
								)}
							</form.Field>
							<form.Field name="gallery">
								{(field) => (
									<TagField
										field={field}
										label="Gallery image URLs"
										placeholder="e.g. https://example.com/gallery-image-1.jpg"
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={Search}
							title="Search engine optimization"
							description="Configure the title and description used by search engines."
						>
							<form.Field name="seoTitle">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="SEO title"
										placeholder="Kashmir Paradise Tour | FZ Tours & Travels"
									/>
								)}
							</form.Field>
							<form.Field name="seoDescription">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="SEO description"
										placeholder="Discover Kashmir with our thoughtfully planned tour package..."
									/>
								)}
							</form.Field>
						</FormSection>
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
									{(field) => (
										<CheckboxField
											field={field}
											label="Active"
											description="The tour is enabled in the administration system."
										/>
									)}
								</form.Field>

								<form.Field name="isFeatured">
									{(field) => (
										<CheckboxField
											field={field}
											label="Featured"
											description="Mark this tour as featured for use on the public website."
										/>
									)}
								</form.Field>

								{/* The original create page never exposed isPublished; in edit mode it must be editable */}
								{isEdit && (
									<form.Field name="isPublished">
										{(field) => (
											<CheckboxField
												field={field}
												label="Published"
												description="Visible on the public website when also active."
											/>
										)}
									</form.Field>
								)}

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

								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											type="submit"
											className="w-full"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<Loader2 className="animate-spin" />
											) : isEdit ? (
												"Save changes"
											) : (
												"Publish tour"
											)}
										</Button>
									)}
								</form.Subscribe>

								<Button
									type="button"
									variant="ghost"
									className="w-full"
									onClick={onCancel}
								>
									Cancel
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									{isEdit ? "Before saving" : "Before publishing"}
								</CardTitle>
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
