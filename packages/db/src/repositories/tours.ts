import { and, desc, eq, like, or } from "drizzle-orm";
import { getDb } from "#/client.js";
import { tours } from "#/schema/domestic.js";
import { tourSelectSchema } from '../../../types/src/domestic';
import { destinations } from '../schema/domestic';

type Database = ReturnType<typeof getDb>;
type TourInsert = typeof tours.$inferInsert;
type TourUpdate = Partial<Omit<TourInsert, "id" | "createdAt">>;

export function createTourRepository(db: Database) {
  return {
    getPublicToursList() {
      return await db.select({
        id: tours.id,
        title: tours.title,
        destination: destinations.name,
        state: destinations.state,
        duration: tours.durationDays,
        price: tours.basePrice,
        rating: tours.avgRating,
        reviewsCount: tours.reviewCount,
        category: tours.category,
        image: tours.featuredImage,
        groupSize: tours.maxGroupSize,
        highlights: tours.highlights,
      }).from(tours)
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

    findPublicBySlug(slug: string) {
      return db
        .select()
        .from(tours)
        .where(
          and(
            eq(tours.slug, slug),
            eq(tours.isActive, true),
            eq(tours.isPublished, true),
          ),
        )
        .get();
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
  };
}