import { getDb } from "#/client.js";
import { destinations } from "#/schema/domestic.js";
import { and, desc, eq, like } from "drizzle-orm";

type Database = ReturnType<typeof getDb>;

export function createDestinationRepository(db: Database) {
  return {
    async getPublicDestinationsList() {
      return await db.select({
        id: destinations.id,
        name: destinations.name,
        state: destinations.state,
        region: destinations.region,
        category: destinations.category,
        tourCount: destinations.tourCount,
        rating: destinations.rating,
        bestTimeToVisit: destinations.bestTimeToVisit,
        coverImage: destinations.coverImage,
        tagline: destinations.tagline,
        highlights: destinations.highlights,
        isTrending: destinations.isTrending,
        country: destinations.country,
        isActive: destinations.isActive,
      })
        .from(destinations)
        .where(eq(destinations.isActive, true))
        .orderBy(desc(destinations.createdAt));
    },
    list(input?: { search?: string; activeOnly?: boolean }) {
      const conditions = [];

      if (input?.search) {
        conditions.push(like(destinations.name, `%${input.search}%`));
      }

      if (input?.activeOnly) {
        conditions.push(eq(destinations.isActive, true));
      }

      return db
        .select()
        .from(destinations)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(destinations.createdAt));
    },

    findById(id: string) {
      return db
        .select()
        .from(destinations)
        .where(eq(destinations.id, id))
        .get();
    },

    create(input: typeof destinations.$inferInsert) {
      return db.insert(destinations).values(input).returning().get();
    },

    update(id: string, input: Partial<typeof destinations.$inferInsert>) {
      return db
        .update(destinations)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(destinations.id, id))
        .returning()
        .get();
    },

    archive(id: string) {
      return db
        .update(destinations)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(destinations.id, id))
        .returning()
        .get();
    },
  };
}
