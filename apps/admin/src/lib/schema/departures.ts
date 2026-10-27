import { departureStatuses, roomTypes } from "@repo/db/schema/domestic.ts";
import { z } from "zod";

const nullableText = (max?: number) => {
	const schema = max ? z.string().max(max) : z.string();
	return z.union([schema, z.literal("").transform(() => null), z.null()]);
};

const nullableDate = z.preprocess(
	(val) => (val === "" || val === null || val === undefined ? null : val),
	z.coerce.date().nullable(),
);

export const departurePricingSchema = z.object({
	roomType: z.enum(roomTypes),
	price: z.number().int().min(0, "Price must be a valid number"),
	compareAtPrice: z.number().int().min(0).nullable().optional(),
});

export const departureInsertSchema = z
	.object({
		tourId: z.string().min(1, "Tour selection is required"),
		code: z.string().min(1, "Departure code is required"),
		startDate: z.date("Invalid start date"),
		endDate: z.date("End date is required"),
		totalSeats: z.number().int().min(1, "Total seats must be at least 1"),
		availableSeats: z
			.number()
			.int()
			.min(0, "Available seats cannot be negative"),
		status: z.enum(departureStatuses).default("scheduled"),
		bookingDeadline: nullableDate,
		cancellationDeadline: nullableDate,
		notes: nullableText(),
		isGuaranteed: z.boolean().default(false),
		isActive: z.boolean().default(true),
		pricing: z
			.array(departurePricingSchema)
			.min(1, "At least one pricing configuration is required"),
	})
	.refine((data) => data.endDate >= data.startDate, {
		message: "End date must be on or after the start date",
		path: ["endDate"],
	})
	.refine((data) => data.availableSeats <= data.totalSeats, {
		message: "Available seats cannot exceed total seats",
		path: ["availableSeats"],
	})
	.refine(
		(data) => {
			if (data.bookingDeadline) {
				return data.bookingDeadline <= data.startDate;
			}
			return true;
		},
		{
			message: "Booking deadline cannot be after the tour start date",
			path: ["bookingDeadline"],
		},
	);

export type DepartureInsertFormValues = z.infer<typeof departureInsertSchema>;
