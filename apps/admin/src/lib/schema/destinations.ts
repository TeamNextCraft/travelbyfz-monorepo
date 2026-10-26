import { z } from "zod";

const nullableText = (max?: number) => {
	const schema = max ? z.string().max(max) : z.string();
	return z.union([schema, z.literal("").transform(() => null), z.null()]);
};

export const destinationSeasonSchema = z.object({
	name: z.enum(["Peak", "Shoulder", "Off-season"]),
	months: z.string().min(1, "Months are required"),
	description: z.string().min(1, "Description is required"),
	temp: z.string().min(1, "Temperature is required"),
});

export const destinationAttractionSchema = z.object({
	name: z.string().min(1, "Attraction name is required"),
	type: z.string().min(1, "Attraction type is required"),
	description: z.string().min(1, "Description is required"),
	image: z.url("Enter a valid image URL").or(z.literal("")),
	timings: z.string().optional(),
	entryFee: z.string().optional(),
});

export const destinationTravelOptionSchema = z.object({
	mode: z.enum(["Flight", "Train", "Bus", "Road"]),
	from: z.string().min(1, "Starting point is required"),
	duration: z.string().min(1, "Duration is required"),
	details: z.string().min(1, "Details are required"),
});

export const destinationCuisineSchema = z.object({
	name: z.string().min(1, "Cuisine name is required"),
	description: z.string().min(1, "Description is required"),
});

export const destinationInsertSchema = z.object({
	name: z.string().min(1, "Destination name is required"),
	slug: z
		.string()
		.regex(
			/^[a-z0-9]+(-[a-z0-9]+)*$/,
			"Use lowercase letters, numbers and hyphens only",
		),
	country: z.string().default("India"),
	state: z.string().min(1, "State is required"),
	city: nullableText(),
	region: z
		.enum(["North", "South", "East", "West", "Central", "Islands"])
		.nullable(),
	category: z
		.array(
			z.enum([
				"Beach",
				"Hill Station",
				"Cultural",
				"Religious",
				"Adventure",
				"Wildlife",
			]),
		)
		.nullable(),
	tourCount: z.number().int().min(0).default(0),
	rating: z.number().min(0).max(5).default(0),
	tagline: nullableText(),
	highlights: z.array(z.string()).default([]),
	isTrending: z.boolean().default(false),
	shortDescription: nullableText(500),
	description: nullableText(),
	coverImage: z.url("Enter a valid URL").nullable().or(nullableText()),
	gallery: z.array(z.url()).nullable(),
	bestTimeToVisit: nullableText(),
	popularFor: z.array(z.string()).nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	seoTitle: nullableText(200),
	seoDescription: nullableText(320),
	seasons: z.array(destinationSeasonSchema).nullable(),
	reviewCount: z.number().int().min(0).default(0),
	area: nullableText(),
	language: nullableText(),
	currency: nullableText(),
	attractions: z.array(destinationAttractionSchema).nullable(),
	cuisine: z.array(destinationCuisineSchema).nullable(),
	howToReach: z.array(destinationTravelOptionSchema).nullable(),
	travelTips: z.array(z.string()).nullable(),
	doList: z.array(z.string()).nullable(),
	dontList: z.array(z.string()).nullable(),
	isFeatured: z.boolean().default(false),
	isActive: z.boolean().default(true),
});

// Type inference for the form payload
export type DestinationInsertFormValues = z.infer<
	typeof destinationInsertSchema
>;
