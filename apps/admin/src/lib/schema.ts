import { z } from "zod";

const requiredLines = (message: string) =>
	z.array(z.string()).refine((lines) => lines.some((l) => l.trim()), message);

const nullableText = (max?: number) => {
	const schema = max ? z.string().max(max) : z.string();
	return z.union([schema, z.literal("").transform(() => null), z.null()]);
};

const itinerarySchema = z.object({
	day: z.number().min(1),
	title: z.string().min(2),
	description: z.string(),
	hotel: z.string().optional(),
	meals: z.array(z.string()).optional(),
	highlights: z.array(z.string()).optional(),
});

export const tourInsertSchema = z.object({
	destinationId: nullableText(),
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
	shortDescription: nullableText(500),
	description: z.string().min(1, "Description is required"),
	durationDays: z.number().int().min(1),
	durationNights: z.number().int().min(0),
	startLocation: z.string().min(1, "Start location is required"),
	endLocation: z.string().min(1, "End location is required"),
	currency: z.string().min(1),
	tag: nullableText(),
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
	itinerary: z.array(itinerarySchema).nullable(),
	cancellationPolicySummary: nullableText(),
	termsSummary: nullableText(),
	importantNotes: z.array(z.string()).nullable(),
	featuredImage: z.url("Enter a valid URL").nullable(),
	gallery: z.array(z.url()).nullable(),
	seoTitle: nullableText(200),
	seoDescription: nullableText(320),
	isFeatured: z.boolean(),
	isPublished: z.boolean(),
	isActive: z.boolean(),
});
