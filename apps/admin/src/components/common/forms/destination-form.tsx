import { type AnyFieldApi, useForm } from "@tanstack/react-form-start";
import {
	ArrowLeft,
	Check,
	Compass,
	FileText,
	ImagePlus,
	Info,
	Loader2,
	Map,
	Search,
} from "lucide-react";
import type { ReactNode } from "react";
import type { z } from "zod";

// Note: Replace/add your specific custom array inputs for attractions, seasons, etc. here if you build them.
// import { AttractionInputList } from "#/components/common/attraction-input-list";

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
import { destinationInsertSchema } from "#/lib/schema/destinations";

export type DestinationInputSchema = z.infer<typeof destinationInsertSchema>;

export const emptyDestination: DestinationInputSchema = {
	name: "",
	slug: "",
	country: "India",
	state: "",
	city: null,
	region: null,
	category: null,
	tourCount: 0,
	rating: 0,
	tagline: null,
	highlights: [],
	isTrending: false,
	shortDescription: null,
	description: null,
	coverImage: null,
	gallery: null,
	bestTimeToVisit: null,
	popularFor: null,
	latitude: null,
	longitude: null,
	seoTitle: null,
	seoDescription: null,
	seasons: null,
	reviewCount: 0,
	area: null,
	language: null,
	currency: null,
	attractions: null,
	cuisine: null,
	howToReach: null,
	travelTips: null,
	doList: null,
	dontList: null,
	isFeatured: false,
	isActive: true,
} as DestinationInputSchema;

/* ------------------------------------------------------------------ */
/* Small field helpers                                                */
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
	description,
}: {
	field: AnyFieldApi;
	label: string;
	placeholder: string;
	description?: string;
}) {
	return (
		<TextInputArray
			label={label}
			name={field.name}
			value={field.state.value || []}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			isTouched={field.state.meta.isTouched}
			isValid={field.state.meta.isValid}
			errors={field.state.meta.errors}
			placeholder={placeholder}
			description={description}
		/>
	);
}

const REGION_OPTIONS = [
	{ value: "North", label: "North India" },
	{ value: "South", label: "South India" },
	{ value: "East", label: "East India" },
	{ value: "West", label: "West India" },
	{ value: "Central", label: "Central India" },
	{ value: "Islands", label: "Islands" },
];

/* ------------------------------------------------------------------ */
/* Form                                                               */
/* ------------------------------------------------------------------ */

type DestinationFormProps = {
	mode: "create" | "edit";
	defaultValues?: DestinationInputSchema;
	onSubmit: (value: DestinationInputSchema) => Promise<void>;
	onCancel: () => void;
};

export function DestinationForm({
	mode,
	defaultValues = emptyDestination,
	onSubmit,
	onCancel,
}: DestinationFormProps) {
	const isEdit = mode === "edit";

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: destinationInsertSchema,
			onBlur: destinationInsertSchema,
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
						{isEdit ? "Back to destination" : "Back to destinations"}
					</Button>

					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{isEdit ? "Edit destination" : "Create destination"}
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							{isEdit
								? "Update the details and content for this destination."
								: "Add a new destination to your catalog."}
						</p>
					</div>
				</div>

				<Badge variant="outline" className="gap-1.5">
					<span
						className={`size-1.5 rounded-full ${isEdit ? "bg-blue-500" : "bg-amber-500"}`}
					/>
					{isEdit ? "Editing" : "New destination"}
				</Badge>
			</section>

			<form
				id="destination-form"
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
							description="Add the name, tagline, and descriptive content."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="name">
									{(field) => (
										<TextField
											field={field}
											label="Destination Name"
											placeholder="e.g. Kashmir, Goa, Kerala"
										/>
									)}
								</form.Field>
								<form.Field name="slug">
									{(field) => (
										<TextField
											field={field}
											label="Slug"
											placeholder="kashmir"
											description="Used in the public URL."
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="tagline">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Tagline"
										placeholder="e.g. Heaven on Earth"
										description="A catchy phrase to summarize the vibe."
									/>
								)}
							</form.Field>

							<form.Field name="shortDescription">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Short Description"
										placeholder="Introduce the destination in a few sentences..."
										description="Used in grid cards and previews."
									/>
								)}
							</form.Field>

							<form.Field name="description">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Full Description"
										placeholder="Write a comprehensive guide about the destination..."
										description="The main body text on the destination page."
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={Map}
							title="Location specifics"
							description="Define geographical boundaries and regional categorization."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="country">
									{(field) => (
										<TextField
											field={field}
											label="Country"
											placeholder="e.g. India"
										/>
									)}
								</form.Field>
								<form.Field name="state">
									{(field) => (
										<TextField
											field={field}
											label="State / Province"
											placeholder="e.g. Jammu & Kashmir"
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-3">
								<form.Field name="city">
									{(field) => (
										<TextField
											field={field}
											nullable
											label="City"
											placeholder="Optional"
										/>
									)}
								</form.Field>
								<form.Field name="area">
									{(field) => (
										<TextField
											field={field}
											nullable
											label="Area/Zone"
											placeholder="Optional"
										/>
									)}
								</form.Field>
								<form.Field name="region">
									{(field) => (
										<SelectField
											field={field}
											label="Region"
											placeholder="Select Region"
											options={REGION_OPTIONS}
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="latitude">
									{(field) => (
										<TextField
											field={field}
											type="number"
											nullable
											label="Latitude"
											placeholder="e.g. 34.0837"
										/>
									)}
								</form.Field>
								<form.Field name="longitude">
									{(field) => (
										<TextField
											field={field}
											type="number"
											nullable
											label="Longitude"
											placeholder="e.g. 74.7973"
										/>
									)}
								</form.Field>
							</div>
						</FormSection>

						<FormSection
							icon={Compass}
							title="Traveler guides & tips"
							description="Provide helpful information, lists, and cultural details."
						>
							<div className="grid gap-5 sm:grid-cols-3">
								<form.Field name="bestTimeToVisit">
									{(field) => (
										<TextField
											field={field}
											nullable
											label="Best time to visit"
											placeholder="e.g. March to August"
										/>
									)}
								</form.Field>
								<form.Field name="language">
									{(field) => (
										<TextField
											field={field}
											nullable
											label="Languages spoken"
											placeholder="e.g. Hindi, Kashmiri"
										/>
									)}
								</form.Field>
								<form.Field name="currency">
									{(field) => (
										<TextField
											field={field}
											nullable
											label="Currency"
											placeholder="e.g. INR"
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="highlights">
								{(field) => (
									<TagField
										field={field}
										label="Highlights"
										placeholder="e.g. Shikara Rides, Snow-capped mountains"
									/>
								)}
							</form.Field>

							<form.Field name="popularFor">
								{(field) => (
									<TagField
										field={field}
										label="Popular For"
										placeholder="e.g. Honeymoon, Nature"
									/>
								)}
							</form.Field>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="doList">
									{(field) => (
										<TagField
											field={field}
											label="Dos (What to do)"
											placeholder="e.g. Carry warm clothes"
										/>
									)}
								</form.Field>
								<form.Field name="dontList">
									{(field) => (
										<TagField
											field={field}
											label="Don'ts (What to avoid)"
											placeholder="e.g. Don't litter in the lakes"
										/>
									)}
								</form.Field>
							</div>

							<form.Field name="travelTips">
								{(field) => (
									<TagField
										field={field}
										label="General Travel Tips"
										placeholder="e.g. Keep local cash handy"
									/>
								)}
							</form.Field>
						</FormSection>

						{/* 
              NOTE: If you create custom JSON array components for Destinations 
              (like ItineraryInputList in TourForm), you can add them here.
              For example:
              
              <FormSection icon={Navigation} title="Rich Details" description="Manage attractions, cuisines, and seasons">
                  <form.Field name="attractions">
                      {(field) => <AttractionInputList ... />}
                  </form.Field>
              </FormSection>
            */}

						<FormSection
							icon={ImagePlus}
							title="Media"
							description="Configure the primary cover image and additional gallery pictures."
						>
							<form.Field name="coverImage">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Cover image URL"
										placeholder="https://example.com/kashmir-cover.jpg"
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
										placeholder="Kashmir Travel Guide | FZ Tours & Travels"
									/>
								)}
							</form.Field>
							<form.Field name="seoDescription">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="SEO description"
										placeholder="Discover everything you need to know about traveling to Kashmir..."
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
									Control the visibility and ranking of this destination.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<form.Field name="isActive">
									{(field) => (
										<CheckboxField
											field={field}
											label="Active"
											description="The destination is visible and usable in the system."
										/>
									)}
								</form.Field>

								<form.Field name="isFeatured">
									{(field) => (
										<CheckboxField
											field={field}
											label="Featured"
											description="Pin this destination to featured sections on the homepage."
										/>
									)}
								</form.Field>

								<form.Field name="isTrending">
									{(field) => (
										<CheckboxField
											field={field}
											label="Trending"
											description="Mark this as a highly popular/trending location."
										/>
									)}
								</form.Field>

								<div className="rounded-lg bg-muted/50 p-3">
									<div className="flex items-start gap-2">
										<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
										<p className="text-xs leading-relaxed text-muted-foreground">
											Only active destinations can be selected when creating new
											tours.
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
												"Create destination"
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
									{isEdit ? "Before saving" : "Before creating"}
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-3">
								{[
									"Check spelling for city, state, and country.",
									"Ensure the URL slug is SEO friendly.",
									"Upload a high-quality cover image.",
									"Add compelling highlights and dos/don'ts.",
									"Verify geographic coordinates (optional).",
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
