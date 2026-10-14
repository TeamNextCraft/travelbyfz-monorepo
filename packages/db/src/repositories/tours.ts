import { and, desc, eq, like, or, asc, min, gt, ne } from "drizzle-orm";
import { getDb } from "#/client.js";
import { addons, departurePricing, departures, reviews, tours, destinations, tourTiers } from "#/schema/domestic.js";

type Database = ReturnType<typeof getDb>;
type TourInsert = typeof tours.$inferInsert;
type TourUpdate = Partial<Omit<TourInsert, "id" | "createdAt">>;

export function createTourRepository(db: Database) {
  return {
    getPublicToursList(roomType: typeof departurePricing.$inferSelect["roomType"] = "double") {
      const now = new Date();

      const fromPriceQuery = db.select({
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
          )
        )
        .groupBy(departures.tourId)
        .as("tour_from_price")


      return db.select({
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
        .where(
          and(
            eq(tours.isActive, true),
            eq(tours.isPublished, true),
          ),
        )
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
      const tour = await db.select({
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

      const tiers = await db.select({
        id: tourTiers.id,
        slug: tourTiers.slug,
        label: tourTiers.label,
        description: tourTiers.description,
      })
        .from(tourTiers)
        .where(
          and(
            eq(tourTiers.tourId, tour.id),
            eq(tourTiers.isActive, true),
          )
        )
        .orderBy(
          asc(tourTiers.sortOrder),
        )

      // Lowest price per tier and room type across open, future departures.
      const priceRows = await db.select({
        tierId: departurePricing.tierId,
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
            gt(departures.startDate, new Date()),
            ne(departurePricing.roomType, "child"),
          )
        )
        .groupBy(departurePricing.tierId, departurePricing.roomType);



      const pricingTiers = tiers.map((t) => {
        const rows = priceRows.filter((r) => r.tierId === t.id && r.price != null);
        const double = rows.find((r) => r.roomTypes === "double");
        const fromPrice = rows.length
          ? (double?.price ?? Math.min(...rows.map((r) => r.price as number)))
          : null;
        return { ...t, fromPrice };
      });

      console.log({
        pricingTiers: pricingTiers
      })

      const prices = pricingTiers
        .map((t) => t.fromPrice)
        .filter((p): p is number => p !== null);

      return {
        ...tour,
        pricingTiers,
        fromPrice: prices.length ? Math.min(...prices) : null,
        hasUpcomingDepartures: prices.length > 0,
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
      return db.select().from(reviews).where(eq(reviews.tourId, tourId)).limit(limit).offset(offest)
    },

    getAddons() {
      return db.select({
        id: addons.id,
        description: addons.description,
        price: addons.price,
        perPerson: addons.perPerson,
        label: addons.title,
      })
        .from(addons)
        .where(eq(addons.isActive, true))
        .orderBy(asc(addons.title));
    }
  };
}
