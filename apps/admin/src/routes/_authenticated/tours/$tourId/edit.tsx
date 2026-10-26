import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TourForm } from "#/components/common/forms/tour-form";
import { tourInsertSchema } from "#/lib/schema";
import { getTourDetails, updateTour } from "#/server/actions/tours";

export const Route = createFileRoute("/_authenticated/tours/$tourId/edit")({
	loader: async ({ params }) => {
		const tour = await getTourDetails({ data: { tourId: params.tourId } });
		if (!tour) throw new Error("Tour not found");
		return tour;
	},
	component: EditTourPage,
});

function EditTourPage() {
	const tour = Route.useLoaderData();
	const { tourId } = Route.useParams();
	const navigate = useNavigate();

	console.log({
		data: tour,
	});

	// parse() strips DB-only columns (id, createdAt, updatedAt, ...) so the
	// form only holds fields that exist in the insert schema.
	const defaultValues = tourInsertSchema.parse(tour);

	const goBack = () => navigate({ to: "/tours/$tourId", params: { tourId } });

	return (
		<TourForm
			mode="edit"
			defaultValues={defaultValues}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await updateTour({ data: { id: tourId, ...value } });
					toast.success("Tour updated");
					goBack();
				} catch (error) {
					console.error("Failed to update tour", error);
					toast.error("Failed to update tour");
				}
			}}
		/>
	);
}

// import { useQuery } from "@tanstack/react-query";
// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useServerFn } from "@tanstack/react-start";
// import {
// 	ArrowLeft,
// 	CalendarDays,
// 	Check,
// 	ChevronDown,
// 	FileText,
// 	ImagePlus,
// 	Info,
// 	MapPin,
// 	Save,
// 	Search,
// 	Settings2,
// } from "lucide-react";
// import { type FormEvent, type ReactNode } from "react";
// import { toast } from "sonner";
// import { Badge } from "#/components/ui/badge";
// import { Button } from "#/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "#/components/ui/card";
// import { Input } from "#/components/ui/input";
// import { Textarea } from "#/components/ui/textarea";
// import { getTourDetails } from "#/server/actions/tours";
//
// export const Route = createFileRoute("/_authenticated/tours/$tourId/edit")({
// 	component: EditTourPage,
// });
//
// // Temporary UI data.
// // Replace this with the result of getTourById(tourId).
// const sampleTour = {
// 	destinationId: "",
// 	title: "Kashmir Paradise",
// 	tagline: "Discover the breathtaking beauty of Kashmir",
// 	slug: "kashmir-paradise",
// 	code: "DOM-KAS-001",
// 	category: "family",
// 	type: "group",
// 	shortDescription:
// 		"Experience the beautiful valleys, lakes, and mountains of Kashmir.",
// 	description:
// 		"Discover Kashmir through its breathtaking landscapes, beautiful gardens, and memorable cultural experiences.",
// 	durationDays: 6,
// 	durationNights: 5,
// 	startLocation: "Srinagar Airport",
// 	endLocation: "Srinagar Airport",
// 	currency: "INR",
// 	tag: "Bestseller",
// 	minAge: 5,
// 	maxAge: 75,
// 	minGroupSize: 1,
// 	maxGroupSize: 20,
// 	difficulty: "Easy",
// 	transportIncluded: true,
// 	mealsIncluded: ["Breakfast", "Dinner"],
// 	inclusions: ["Hotel accommodation", "Daily breakfast", "Airport transfers"],
// 	exclusions: ["Flights", "Personal expenses", "Optional activities"],
// 	highlights: [
// 		"Dal Lake shikara ride",
// 		"Explore Mughal gardens",
// 		"Enjoy mountain views",
// 	],
// 	itinerary: [] as unknown[],
// 	cancellationPolicySummary: "",
// 	termsSummary: "",
// 	importantNotes: [] as string[],
// 	featuredImage: "",
// 	gallery: [] as string[],
// 	seoTitle: "Kashmir Paradise Tour | FZ Tours & Travels",
// 	seoDescription: "",
// 	isFeatured: true,
// 	isPublished: true,
// 	isActive: true,
// };
//
// const inputClass =
// 	"h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
//
// const textareaClass =
// 	"min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
//
// type SelectOption = {
// 	label: string;
// 	value: string;
// };
//
// function Field({
// 	label,
// 	htmlFor,
// 	required,
// 	hint,
// 	children,
// }: {
// 	label: string;
// 	htmlFor: string;
// 	required?: boolean;
// 	hint?: string;
// 	children: ReactNode;
// }) {
// 	return (
// 		<div className="min-w-0 space-y-2">
// 			<label htmlFor={htmlFor} className="text-sm font-medium leading-none">
// 				{label}
// 				{required && <span className="ml-1 text-destructive">*</span>}
// 			</label>
//
// 			{children}
//
// 			{hint && (
// 				<p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
// 			)}
// 		</div>
// 	);
// }
//
// function SelectField({
// 	id,
// 	name,
// 	defaultValue,
// 	required,
// 	options,
// }: {
// 	id: string;
// 	name: string;
// 	defaultValue: string;
// 	required?: boolean;
// 	options: SelectOption[];
// }) {
// 	return (
// 		<div className="relative">
// 			<select
// 				id={id}
// 				name={name}
// 				defaultValue={defaultValue}
// 				required={required}
// 				className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
// 			>
// 				{options.map((option) => (
// 					<option key={option.value} value={option.value}>
// 						{option.label}
// 					</option>
// 				))}
// 			</select>
//
// 			<ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
// 		</div>
// 	);
// }
//
// function SectionHeading({
// 	icon: Icon,
// 	title,
// 	description,
// }: {
// 	icon: typeof FileText;
// 	title: string;
// 	description: string;
// }) {
// 	return (
// 		<div className="flex items-start gap-3">
// 			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
// 				<Icon className="size-4 text-primary" />
// 			</div>
//
// 			<div className="space-y-1">
// 				<h2 className="font-semibold tracking-tight">{title}</h2>
// 				<p className="text-sm leading-relaxed text-muted-foreground">
// 					{description}
// 				</p>
// 			</div>
// 		</div>
// 	);
// }
//
// function CheckboxField({
// 	name,
// 	label,
// 	description,
// 	defaultChecked,
// }: {
// 	name: string;
// 	label: string;
// 	description: string;
// 	defaultChecked?: boolean;
// }) {
// 	return (
// 		<label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">
// 			<input
// 				type="checkbox"
// 				name={name}
// 				defaultChecked={defaultChecked}
// 				className="mt-1 size-4 shrink-0 accent-primary"
// 			/>
//
// 			<span className="min-w-0 space-y-1">
// 				<span className="block text-sm font-medium">{label}</span>
// 				<span className="block text-xs leading-relaxed text-muted-foreground">
// 					{description}
// 				</span>
// 			</span>
// 		</label>
// 	);
// }
//
// function toLines(value: string | string[] | null | undefined) {
// 	if (Array.isArray(value)) return value.join("\n");
// 	return value ?? "";
// }
//
// function optionalText(formData: FormData, key: string) {
// 	const value = formData.get(key);
//
// 	if (typeof value !== "string") return null;
//
// 	return value.trim() || null;
// }
//
// function lineList(formData: FormData, key: string): string[] {
// 	const value = formData.get(key);
//
// 	if (typeof value !== "string") return [];
//
// 	return value
// 		.split(/\r?\n/)
// 		.map((line) => line.trim())
// 		.filter(Boolean);
// }
//
// function numberValue(formData: FormData, key: string, fallback: number) {
// 	const value = formData.get(key);
//
// 	if (typeof value !== "string" || value.trim() === "") {
// 		return fallback;
// 	}
//
// 	const parsed = Number(value);
//
// 	return Number.isFinite(parsed) ? parsed : fallback;
// }
//
// function nullableNumber(formData: FormData, key: string) {
// 	const value = formData.get(key);
//
// 	if (typeof value !== "string" || value.trim() === "") {
// 		return null;
// 	}
//
// 	const parsed = Number(value);
//
// 	return Number.isFinite(parsed) ? parsed : null;
// }
//
// function EditTourPage() {
// 	const { tourId } = Route.useParams();
//
// 	const fetchTour = useServerFn(getTourDetails);
//
// 	const {
// 		data: tour,
// 		isPending,
// 		isError,
// 		error,
// 	} = useQuery({
// 		queryKey: ["tour-details", tourId],
// 		queryFn: () => fetchTour({ data: { tourId } }),
// 	});
//
// 	function handleSubmit(event: FormEvent<HTMLFormElement>) {
// 		event.preventDefault();
//
// 		const formData = new FormData(event.currentTarget);
//
// 		const submitter = (event.nativeEvent as SubmitEvent)
// 			.submitter as HTMLButtonElement | null;
//
// 		const intent = submitter?.value === "publish" ? "publish" : "save";
//
// 		const title = optionalText(formData, "title");
// 		const slug = optionalText(formData, "slug");
// 		const code = optionalText(formData, "code");
// 		const description = optionalText(formData, "description");
// 		const tagline = optionalText(formData, "tagline");
//
// 		if (!title || !slug || !code || !description || !tagline) {
// 			toast.error("Please complete all required fields.");
// 			return;
// 		}
//
// 		if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
// 			toast.error(
// 				"The URL slug must contain lowercase letters, numbers, and hyphens.",
// 			);
// 			return;
// 		}
//
// 		let itinerary: unknown[] | null = null;
// 		const itineraryJson = optionalText(formData, "itineraryJson");
//
// 		if (itineraryJson) {
// 			try {
// 				const parsed: unknown = JSON.parse(itineraryJson);
//
// 				if (!Array.isArray(parsed)) {
// 					toast.error("The itinerary must be a JSON array.");
// 					return;
// 				}
//
// 				itinerary = parsed;
// 			} catch {
// 				toast.error("The itinerary JSON is invalid.");
// 				return;
// 			}
// 		}
//
// 		const payload = {
// 			id: tourId,
//
// 			destinationId: optionalText(formData, "destinationId"),
// 			title,
// 			tagline,
// 			slug,
// 			code,
//
// 			category: optionalText(formData, "category"),
// 			type: optionalText(formData, "type"),
//
// 			shortDescription: optionalText(formData, "shortDescription"),
// 			description,
//
// 			durationDays: numberValue(formData, "durationDays", 1),
// 			durationNights: numberValue(formData, "durationNights", 0),
//
// 			startLocation: optionalText(formData, "startLocation"),
// 			endLocation: optionalText(formData, "endLocation"),
// 			currency: optionalText(formData, "currency") ?? "INR",
//
// 			tag: optionalText(formData, "tag"),
//
// 			minAge: numberValue(formData, "minAge", 5),
// 			maxAge: numberValue(formData, "maxAge", 75),
// 			minGroupSize: numberValue(formData, "minGroupSize", 1),
// 			maxGroupSize: nullableNumber(formData, "maxGroupSize"),
//
// 			difficulty: optionalText(formData, "difficulty"),
//
// 			transportIncluded: formData.has("transportIncluded"),
// 			mealsIncluded: lineList(formData, "mealsIncluded"),
//
// 			inclusions: lineList(formData, "inclusions"),
// 			exclusions: lineList(formData, "exclusions"),
// 			highlights: lineList(formData, "highlights"),
//
// 			itinerary,
//
// 			cancellationPolicySummary: optionalText(
// 				formData,
// 				"cancellationPolicySummary",
// 			),
// 			termsSummary: optionalText(formData, "termsSummary"),
// 			importantNotes: lineList(formData, "importantNotes"),
//
// 			featuredImage: optionalText(formData, "featuredImage"),
// 			gallery: lineList(formData, "gallery"),
//
// 			seoTitle: optionalText(formData, "seoTitle"),
// 			seoDescription: optionalText(formData, "seoDescription"),
//
// 			isFeatured: formData.has("isFeatured"),
// 			isPublished: intent === "publish",
// 			isActive: formData.has("isActive"),
// 		};
//
// 		// TODO:
// 		// Call your updateTour server function with:
// 		// { tourId, ...payload }
// 		//
// 		// The server must validate the input, check admin permissions,
// 		// verify the existing tour, and persist the changes with Drizzle.
//
// 		console.info("Update tour payload:", payload);
//
// 		toast.info(
// 			"The form is ready. Connect the updateTour server function to save changes.",
// 		);
// 	}
//
// 	return (
// 		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
// 			{/* Page header */}
// 			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
// 				<div className="space-y-2">
// 					<Button
// 						variant="ghost"
// 						size="sm"
// 						className="-ml-3 w-fit text-muted-foreground"
// 						asChild
// 					>
// 						<Link to="/tours">
// 							<ArrowLeft className="mr-2 size-4" />
// 							Back to tours
// 						</Link>
// 					</Button>
//
// 					<div>
// 						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
// 							Edit tour
// 						</h1>
//
// 						<p className="mt-1 text-sm text-muted-foreground">
// 							Update your tour package details and publishing settings.
// 						</p>
// 					</div>
// 				</div>
//
// 				<div className="flex flex-wrap items-center gap-2">
// 					<Badge variant="outline" className="font-mono">
// 						{tourId}
// 					</Badge>
//
// 					<Badge variant="secondary">Editing</Badge>
// 				</div>
// 			</section>
//
// 			{/* Form */}
// 			<form onSubmit={handleSubmit}>
// 				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
// 					<div className="min-w-0 space-y-6">
// 						{/* Basic information */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={FileText}
// 									title="Basic information"
// 									description="Edit the tour's public-facing title and description."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field label="Tour title" htmlFor="title" required>
// 									<Input
// 										id="title"
// 										name="title"
// 										defaultValue={sampleTour.title}
// 										required
// 										maxLength={200}
// 										className={inputClass}
// 									/>
// 								</Field>
//
// 								<Field label="Tagline" htmlFor="tagline" required>
// 									<Input
// 										id="tagline"
// 										name="tagline"
// 										defaultValue={sampleTour.tagline}
// 										required
// 										maxLength={200}
// 										className={inputClass}
// 									/>
// 								</Field>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field label="URL slug" htmlFor="slug" required>
// 										<Input
// 											id="slug"
// 											name="slug"
// 											defaultValue={sampleTour.slug}
// 											pattern="[a-z0-9]+(-[a-z0-9]+)*"
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
//
// 									<Field label="Tour code" htmlFor="code" required>
// 										<Input
// 											id="code"
// 											name="code"
// 											defaultValue={sampleTour.code}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
// 								</div>
//
// 								<Field label="Short description" htmlFor="shortDescription">
// 									<Textarea
// 										id="shortDescription"
// 										name="shortDescription"
// 										defaultValue={sampleTour.shortDescription}
// 										className={textareaClass}
// 										maxLength={500}
// 									/>
// 								</Field>
//
// 								<Field label="Full description" htmlFor="description" required>
// 									<Textarea
// 										id="description"
// 										name="description"
// 										defaultValue={sampleTour.description}
// 										className="min-h-40 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
// 										required
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
//
// 						{/* Destination and category */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={MapPin}
// 									title="Destination and category"
// 									description="Manage the destination and classification for this tour."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field
// 									label="Destination ID"
// 									htmlFor="destinationId"
// 									hint="Replace this field with a selector populated from your destinations table."
// 								>
// 									<Input
// 										id="destinationId"
// 										name="destinationId"
// 										defaultValue={sampleTour.destinationId}
// 										placeholder="Destination record ID"
// 										className={inputClass}
// 									/>
// 								</Field>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field label="Category" htmlFor="category" required>
// 										<SelectField
// 											id="category"
// 											name="category"
// 											defaultValue={sampleTour.category}
// 											required
// 											options={[
// 												{ label: "Adventure", value: "adventure" },
// 												{ label: "Family", value: "family" },
// 												{ label: "Honeymoon", value: "honeymoon" },
// 												{ label: "Pilgrimage", value: "pilgrimage" },
// 												{ label: "Cultural", value: "cultural" },
// 												{ label: "Beach", value: "beach" },
// 												{ label: "Nature", value: "nature" },
// 												{ label: "Other", value: "other" },
// 											]}
// 										/>
// 									</Field>
//
// 									<Field label="Tour type" htmlFor="type" required>
// 										<SelectField
// 											id="type"
// 											name="type"
// 											defaultValue={sampleTour.type}
// 											required
// 											options={[
// 												{ label: "Group", value: "group" },
// 												{ label: "Private", value: "private" },
// 												{ label: "Custom", value: "custom" },
// 											]}
// 										/>
// 									</Field>
// 								</div>
//
// 								<Field label="Tag" htmlFor="tag">
// 									<Input
// 										id="tag"
// 										name="tag"
// 										defaultValue={sampleTour.tag}
// 										placeholder="e.g. Bestseller"
// 										className={inputClass}
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
//
// 						{/* Trip information */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={MapPin}
// 									title="Trip details"
// 									description="Update duration, route, age requirements, and group size."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field
// 										label="Start location"
// 										htmlFor="startLocation"
// 										required
// 									>
// 										<Input
// 											id="startLocation"
// 											name="startLocation"
// 											defaultValue={sampleTour.startLocation}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
//
// 									<Field label="End location" htmlFor="endLocation" required>
// 										<Input
// 											id="endLocation"
// 											name="endLocation"
// 											defaultValue={sampleTour.endLocation}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
// 								</div>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field
// 										label="Duration (days)"
// 										htmlFor="durationDays"
// 										required
// 									>
// 										<Input
// 											id="durationDays"
// 											name="durationDays"
// 											type="number"
// 											min={1}
// 											defaultValue={sampleTour.durationDays}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
//
// 									<Field
// 										label="Duration (nights)"
// 										htmlFor="durationNights"
// 										required
// 									>
// 										<Input
// 											id="durationNights"
// 											name="durationNights"
// 											type="number"
// 											min={0}
// 											defaultValue={sampleTour.durationNights}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
// 								</div>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field label="Difficulty" htmlFor="difficulty" required>
// 										<SelectField
// 											id="difficulty"
// 											name="difficulty"
// 											defaultValue={sampleTour.difficulty}
// 											required
// 											options={[
// 												{ label: "Easy", value: "Easy" },
// 												{ label: "Moderate", value: "Moderate" },
// 												{ label: "Hard", value: "Hard" },
// 											]}
// 										/>
// 									</Field>
//
// 									<Field label="Currency" htmlFor="currency" required>
// 										<SelectField
// 											id="currency"
// 											name="currency"
// 											defaultValue={sampleTour.currency}
// 											required
// 											options={[
// 												{ label: "INR — Indian Rupee", value: "INR" },
// 												{ label: "USD — US Dollar", value: "USD" },
// 												{ label: "AED — UAE Dirham", value: "AED" },
// 												{ label: "EUR — Euro", value: "EUR" },
// 											]}
// 										/>
// 									</Field>
// 								</div>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field label="Minimum age" htmlFor="minAge" required>
// 										<Input
// 											id="minAge"
// 											name="minAge"
// 											type="number"
// 											min={0}
// 											defaultValue={sampleTour.minAge}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
//
// 									<Field label="Maximum age" htmlFor="maxAge" required>
// 										<Input
// 											id="maxAge"
// 											name="maxAge"
// 											type="number"
// 											min={0}
// 											defaultValue={sampleTour.maxAge}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
// 								</div>
//
// 								<div className="grid gap-5 sm:grid-cols-2">
// 									<Field
// 										label="Minimum group size"
// 										htmlFor="minGroupSize"
// 										required
// 									>
// 										<Input
// 											id="minGroupSize"
// 											name="minGroupSize"
// 											type="number"
// 											min={1}
// 											defaultValue={sampleTour.minGroupSize}
// 											required
// 											className={inputClass}
// 										/>
// 									</Field>
//
// 									<Field label="Maximum group size" htmlFor="maxGroupSize">
// 										<Input
// 											id="maxGroupSize"
// 											name="maxGroupSize"
// 											type="number"
// 											min={1}
// 											defaultValue={sampleTour.maxGroupSize ?? ""}
// 											className={inputClass}
// 										/>
// 									</Field>
// 								</div>
//
// 								<CheckboxField
// 									name="transportIncluded"
// 									label="Transport included"
// 									description="Transport is included in this tour package."
// 									defaultChecked={sampleTour.transportIncluded}
// 								/>
// 							</CardContent>
// 						</Card>
//
// 						{/* Highlights and inclusions */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={Check}
// 									title="Highlights and inclusions"
// 									description="Edit the experiences and services covered by this tour."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field label="Highlights" htmlFor="highlights" required>
// 									<Textarea
// 										id="highlights"
// 										name="highlights"
// 										defaultValue={toLines(sampleTour.highlights)}
// 										className={textareaClass}
// 										required
// 										placeholder="Enter one highlight per line"
// 									/>
// 								</Field>
//
// 								<Field label="What's included" htmlFor="inclusions" required>
// 									<Textarea
// 										id="inclusions"
// 										name="inclusions"
// 										defaultValue={toLines(sampleTour.inclusions)}
// 										className={textareaClass}
// 										required
// 										placeholder="Enter one inclusion per line"
// 									/>
// 								</Field>
//
// 								<Field label="What's excluded" htmlFor="exclusions" required>
// 									<Textarea
// 										id="exclusions"
// 										name="exclusions"
// 										defaultValue={toLines(sampleTour.exclusions)}
// 										className={textareaClass}
// 										required
// 										placeholder="Enter one exclusion per line"
// 									/>
// 								</Field>
//
// 								<Field label="Meals included" htmlFor="mealsIncluded">
// 									<Textarea
// 										id="mealsIncluded"
// 										name="mealsIncluded"
// 										defaultValue={toLines(sampleTour.mealsIncluded)}
// 										className={textareaClass}
// 										placeholder="Enter one meal per line"
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
//
// 						{/* Itinerary */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={CalendarDays}
// 									title="Itinerary"
// 									description="Update the structured day-by-day itinerary."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-3">
// 								<Field
// 									label="Itinerary JSON"
// 									htmlFor="itineraryJson"
// 									hint="The value must match your TourItinerary type from @repo/types/domestic/tour."
// 								>
// 									<Textarea
// 										id="itineraryJson"
// 										name="itineraryJson"
// 										className="min-h-40 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
// 										defaultValue={JSON.stringify(sampleTour.itinerary, null, 2)}
// 										spellCheck={false}
// 									/>
// 								</Field>
//
// 								<div className="flex items-start gap-2 rounded-lg border border-dashed p-3">
// 									<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
//
// 									<p className="text-xs leading-relaxed text-muted-foreground">
// 										This JSON editor is a temporary solution. A dedicated
// 										itinerary builder would make it easier to add, reorder, and
// 										edit individual days.
// 									</p>
// 								</div>
// 							</CardContent>
// 						</Card>
//
// 						{/* Policies */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={FileText}
// 									title="Policies and notes"
// 									description="Update cancellation terms and customer instructions."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field
// 									label="Cancellation policy"
// 									htmlFor="cancellationPolicySummary"
// 								>
// 									<Textarea
// 										id="cancellationPolicySummary"
// 										name="cancellationPolicySummary"
// 										defaultValue={sampleTour.cancellationPolicySummary}
// 										className={textareaClass}
// 									/>
// 								</Field>
//
// 								<Field label="Terms and conditions" htmlFor="termsSummary">
// 									<Textarea
// 										id="termsSummary"
// 										name="termsSummary"
// 										defaultValue={sampleTour.termsSummary}
// 										className={textareaClass}
// 									/>
// 								</Field>
//
// 								<Field label="Important notes" htmlFor="importantNotes">
// 									<Textarea
// 										id="importantNotes"
// 										name="importantNotes"
// 										defaultValue={toLines(sampleTour.importantNotes)}
// 										className={textareaClass}
// 										placeholder="Enter one note per line"
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
//
// 						{/* Images */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={ImagePlus}
// 									title="Tour images"
// 									description="Update the featured image and gallery."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field
// 									label="Featured image URL"
// 									htmlFor="featuredImage"
// 									hint="Use a publicly accessible URL or connect your image storage service."
// 								>
// 									<Input
// 										id="featuredImage"
// 										name="featuredImage"
// 										type="url"
// 										defaultValue={sampleTour.featuredImage}
// 										placeholder="https://example.com/tour-cover.jpg"
// 										className={inputClass}
// 									/>
// 								</Field>
//
// 								<Field label="Gallery image URLs" htmlFor="gallery">
// 									<Textarea
// 										id="gallery"
// 										name="gallery"
// 										defaultValue={toLines(sampleTour.gallery)}
// 										className={textareaClass}
// 										placeholder="Enter one image URL per line"
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
//
// 						{/* SEO */}
// 						<Card>
// 							<CardHeader>
// 								<SectionHeading
// 									icon={Search}
// 									title="Search engine optimization"
// 									description="Update search engine metadata for this tour."
// 								/>
// 							</CardHeader>
//
// 							<CardContent className="space-y-5">
// 								<Field label="SEO title" htmlFor="seoTitle">
// 									<Input
// 										id="seoTitle"
// 										name="seoTitle"
// 										defaultValue={sampleTour.seoTitle}
// 										maxLength={200}
// 										className={inputClass}
// 									/>
// 								</Field>
//
// 								<Field label="SEO description" htmlFor="seoDescription">
// 									<Textarea
// 										id="seoDescription"
// 										name="seoDescription"
// 										defaultValue={sampleTour.seoDescription}
// 										maxLength={320}
// 										className={textareaClass}
// 									/>
// 								</Field>
// 							</CardContent>
// 						</Card>
// 					</div>
//
// 					{/* Publish settings */}
// 					<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Tour settings</CardTitle>
// 								<CardDescription>
// 									Manage visibility and publishing status.
// 								</CardDescription>
// 							</CardHeader>
//
// 							<CardContent className="space-y-4">
// 								<CheckboxField
// 									name="isActive"
// 									label="Active"
// 									description="Enable this tour in your administration system."
// 									defaultChecked={sampleTour.isActive}
// 								/>
//
// 								<CheckboxField
// 									name="isFeatured"
// 									label="Featured tour"
// 									description="Highlight this tour on the public website."
// 									defaultChecked={sampleTour.isFeatured}
// 								/>
//
// 								<div className="rounded-lg bg-muted/50 p-3">
// 									<div className="flex items-start gap-2">
// 										<Settings2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
// 										<p className="text-xs leading-relaxed text-muted-foreground">
// 											Publishing is separate from activation. Confirm both
// 											settings before making this tour available to customers.
// 										</p>
// 									</div>
// 								</div>
//
// 								<Button
// 									type="submit"
// 									name="intent"
// 									value="save"
// 									variant="outline"
// 									className="w-full"
// 								>
// 									<Save className="mr-2 size-4" />
// 									Save changes
// 								</Button>
//
// 								<Button
// 									type="submit"
// 									name="intent"
// 									value="publish"
// 									className="w-full"
// 								>
// 									<Check className="mr-2 size-4" />
// 									Save & publish
// 								</Button>
//
// 								<Button
// 									type="button"
// 									variant="ghost"
// 									className="w-full"
// 									asChild
// 								>
// 									<Link to="/tours">Cancel</Link>
// 								</Button>
// 							</CardContent>
// 						</Card>
//
// 						<Card>
// 							<CardHeader>
// 								<CardTitle className="text-base">Before saving</CardTitle>
// 							</CardHeader>
//
// 							<CardContent className="space-y-3">
// 								{[
// 									"Verify the destination and tour code.",
// 									"Check duration and group-size limits.",
// 									"Review the itinerary and policies.",
// 									"Check the featured image URL.",
// 									"Confirm departure pricing separately.",
// 								].map((item) => (
// 									<div key={item} className="flex items-start gap-2">
// 										<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border">
// 											<Check className="size-2.5 text-muted-foreground" />
// 										</div>
//
// 										<p className="text-xs leading-relaxed text-muted-foreground">
// 											{item}
// 										</p>
// 									</div>
// 								))}
// 							</CardContent>
// 						</Card>
// 					</aside>
// 				</div>
// 			</form>
// 		</main>
// 	);
// }
