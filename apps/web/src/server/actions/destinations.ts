import { getDb } from "@repo/db/client";
import { createDestinationRepository } from "@repo/db/repository/destinations";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import z from "zod";

export const getPublicDestinations = createServerFn()
  .handler(async () => {
    try {
      const db = getDb(env.DB);
      const data = await createDestinationRepository(db).getPublicDestinationsList();

      return data.map((destination) => ({
        ...destination,
        bestTime: destination.bestTimeToVisit || "All Year Round",
        image: destination.coverImage || "/images/destinations/default.jpg",
        heighlights: destination.highlights || [],
        region: destination.region ?? "North",
      }));

    } catch (err) {
      console.error("Error! fetching destination by slug", err);
      throw err
    }
  });

export const getPublicDestinationBySlug = createServerFn({ method: "GET" })
  .validator(z.object({
    slug: z.string(),
  }))
  .handler(async ({ data }) => {
    try {

      const db = getDb(env.DB);
      const dest = await createDestinationRepository(db).findBySlug(data.slug);

      if (!dest) return null;

      const tours = await createDestinationRepository(db).getPublicDestinationsTours(dest.id);

      return {
        ...dest,
        tourCount: tours.length,
        tours: tours,
      };

    } catch (err) {
      console.error("Error! fetching destination by slug", err);
      throw err
    }
  })
