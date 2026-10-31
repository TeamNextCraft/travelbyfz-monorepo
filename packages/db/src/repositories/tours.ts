import {
	and,
	asc,
	desc,
	eq,
	gt,
	inArray,
	like,
	lt,
	min,
	ne,
	or,
} from "drizzle-orm";
import { getDb } from "#/client.js";
import {
	addons,
	departurePricing,
	departures,
	destinations,
	enquiries,
	reviews,
	tourAddons,
	tours,
} from "#/schema/domestic.js";

type Database = ReturnType<typeof getDb>;
type TourInsert = typeof tours.$inferInsert;
type TourUpdate = Partial<Omit<TourInsert, "id" | "createdAt">>;

export function createTourRepository(db: Database) {
	return {
		getPublicToursList(
			roomType: (typeof departurePricing.$inferSelect)["roomType"] = "double",
		) {
			const now = new Date();

			const fromPriceQuery = db
				.select({
					tourId: departures.tourId,
					fromPrice: min(departurePricing.price).as("from_price"),
				})
				.from(departures)
				.innerJoin(
					departurePricing,
					eq(departurePricing.departureId, departures.id),
				)
				.where(
					and(
						eq(departures.isActive, true),
						eq(departures.status, "scheduled"),
						gt(departures.availableSeats, 0),
						gt(departures.startDate, now),
						eq(departurePricing.roomType, roomType),
					),
				)
				.groupBy(departures.tourId)
				.as("tour_from_price");

			return db
				.select({
					id: tours.id,
					slug: tours.slug,
					title: tours.title,
					tagline: tours.tagline,
					durationDays: tours.durationDays,
					durationNights: tours.durationNights,
					rating: tours.avgRating,
					reviewCount: tours.reviewCount,
					category: tours.category,
					image: tours.featuredImage,
					groupSize: tours.maxGroupSize,
					highlights: tours.highlights,
					difficulty: tours.difficulty,
					destination: destinations.name,
					state: destinations.state,
					fromPrice: fromPriceQuery.fromPrice,
				})
				.from(tours)
				.leftJoin(destinations, eq(tours.destinationId, destinations.id))
				.leftJoin(fromPriceQuery, eq(fromPriceQuery.tourId, tours.id))
				.where(and(eq(tours.isActive, true), eq(tours.isPublished, true)))
				.orderBy(asc(tours.title));
		},
		list(input?: {
			search?: string;
			destinationId?: string;
			category?: string;
			type?: string;
			activeOnly?: boolean;
			publishedOnly?: boolean;
		}) {
			const conditions = [];

			if (input?.search) {
				const search = `%${input.search}%`;

				conditions.push(
					or(
						like(tours.title, search),
						like(tours.slug, search),
						like(tours.code, search),
					),
				);
			}

			if (input?.destinationId) {
				conditions.push(eq(tours.destinationId, input.destinationId));
			}

			if (input?.category) {
				conditions.push(eq(tours.category, input.category));
			}

			if (input?.type) {
				conditions.push(eq(tours.type, input.type));
			}

			if (input?.activeOnly) {
				conditions.push(eq(tours.isActive, true));
			}

			if (input?.publishedOnly) {
				conditions.push(eq(tours.isPublished, true));
			}

			return db
				.select()
				.from(tours)
				.where(conditions.length ? and(...conditions) : undefined)
				.orderBy(desc(tours.createdAt));
		},

		findById(id: string) {
			return db.select().from(tours).where(eq(tours.id, id)).get();
		},

		findBySlug(slug: string) {
			return db.select().from(tours).where(eq(tours.slug, slug)).get();
		},

		async findPublicBySlug(slug: string) {
			const tour = await db
				.select({
					id: tours.id,
					slug: tours.slug,
					title: tours.title,
					featuredImage: tours.featuredImage,
					tagline: tours.tagline,
					destination: destinations.name,
					state: destinations.state,
					durationNights: tours.durationNights,
					durationDays: tours.durationDays,
					category: tours.category,
					rating: tours.avgRating,
					reviewCount: tours.reviewCount,
					maxGroupSize: tours.maxGroupSize,
					minGroupSize: tours.minGroupSize,
					minAge: tours.minAge,
					maxAge: tours.maxAge,
					difficulty: tours.difficulty,
					tag: tours.tag,
					images: tours.gallery,
					overview: tours.description,
					highlights: tours.highlights,
					inclusions: tours.inclusions,
					exclusions: tours.exclusions,
					itinerary: tours.itinerary,
					importantNotes: tours.importantNotes,
					cancellationPolicySummary: tours.cancellationPolicySummary,
				})
				.from(tours)
				.leftJoin(destinations, eq(tours.destinationId, destinations.id))
				.where(
					and(
						eq(tours.slug, slug),
						eq(tours.isActive, true),
						eq(tours.isPublished, true),
					),
				)
				.get();

			if (!tour) return undefined;

			// Lowest price room type across open, future departures.
			const priceRows = await db
				.select({
					roomTypes: departurePricing.roomType,
					price: min(departurePricing.price),
				})
				.from(departurePricing)
				.innerJoin(departures, eq(departures.id, departurePricing.departureId))
				.where(
					and(
						eq(departures.tourId, tour.id),
						eq(departures.isActive, true),
						eq(departures.status, "scheduled"),
						gt(departures.availableSeats, 0),
						lt(departures.startDate, new Date()),
						ne(departurePricing.roomType, "child"),
					),
				)
				.groupBy(departurePricing.roomType);

			const prices = priceRows
				.map((t) => t.price)
				.filter((p): p is number => p !== null);

			return {
				...tour,
				fromPrice: prices.length ? Math.min(...prices) : null,
				hasUpcomingDepartures: priceRows.length > 0,
			};
		},

		create(input: TourInsert) {
			return db.insert(tours).values(input).returning().get();
		},

		update(id: string, input: TourUpdate) {
			return db
				.update(tours)
				.set({
					...input,
					updatedAt: new Date(),
				})
				.where(eq(tours.id, id))
				.returning()
				.get();
		},

		publish(id: string) {
			return db
				.update(tours)
				.set({
					isPublished: true,
					updatedAt: new Date(),
				})
				.where(eq(tours.id, id))
				.returning()
				.get();
		},

		unpublish(id: string) {
			return db
				.update(tours)
				.set({
					isPublished: false,
					updatedAt: new Date(),
				})
				.where(eq(tours.id, id))
				.returning()
				.get();
		},

		archive(id: string) {
			return db
				.update(tours)
				.set({
					isActive: false,
					isPublished: false,
					updatedAt: new Date(),
				})
				.where(eq(tours.id, id))
				.returning()
				.get();
		},

		remove(id: string) {
			return db.delete(tours).where(eq(tours.id, id)).returning().get();
		},

		getReviews(tourId: string, limit: number = 10, offest: number = 0) {
			return db
				.select()
				.from(reviews)
				.where(eq(reviews.tourId, tourId))
				.limit(limit)
				.offset(offest);
		},

		getTourAddons(tourId: string) {
			const addonIds = db
				.select({
					id: tourAddons.addonId,
				})
				.from(tourAddons)
				.where(eq(tourAddons.tourId, tourId));

			return db
				.select({
					id: addons.id,
					description: addons.description,
					price: addons.price,
					perPerson: addons.perPerson,
					label: addons.title,
				})
				.from(addons)
				.where(and(eq(addons.isActive, true), inArray(addons.id, addonIds)))
				.orderBy(asc(addons.title));
		},

		findTourInterest(userId: string, tourId: string) {
			return db
				.select({
					id: enquiries.id,
				})
				.from(enquiries)
				.where(
					and(
						eq(enquiries.userId, userId),
						eq(enquiries.tourId, tourId),
						eq(enquiries.source, "tour_interest"),
					),
				)
				.get();
		},

		async registerTourInterest(input: {
			userId: string;
			tourId: string;
			tourTitle: string;
			name: string;
			email: string;
		}) {
			const inserted = await db
				.insert(enquiries)
				.values({
					userId: input.userId,
					tourId: input.tourId,
					name: input.name,
					email: input.email,
					subject: `Interest in ${input.tourTitle}`,
					message:
						`I am interested in ${input.tourTitle}. ` +
						"Please contact me about future departures.",
					source: "tour_interest",
					status: "new",
				})
				.onConflictDoNothing()
				.returning({
					id: enquiries.id,
				})
				.get();

			// The unique index prevents duplicate records even when
			// requests arrive simultaneously.
			if (inserted) {
				return {
					id: inserted.id,
					alreadyRegistered: false,
				};
			}

			const existing = await this.findTourInterest(input.userId, input.tourId);

			if (!existing) {
				throw new Error("Could not register tour interest.");
			}

			return {
				id: existing.id,
				alreadyRegistered: true,
			};
		},
	};
}
