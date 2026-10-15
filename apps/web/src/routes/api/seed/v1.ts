import { getDb } from "@repo/db/client";
import {
  destinations,
  tours,
} from "@repo/db/schema/domestic.js";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { count, eq } from "drizzle-orm";

const TOUR_ID = "f76c2256-5728-476c-901d-0a0640524bd2";

const ANDAMAN_DESTINATION = {
  name: "Andaman Islands",
  slug: "andaman-islands",

  country: "India",
  state: "Andaman & Nicobar Islands",
  city: null,

  tagline: "Turquoise waters, island escapes and coastal adventures",

  shortDescription:
    "Explore the Andaman Islands through beach sunsets, island stays and historic landmarks.",

  description:
    "Discover the Andaman Islands with visits to Sri Vijaya Puram " +
    "(Port Blair) and Swaraj Dweep (Havelock Island). Explore the " +
    "historic Cellular Jail, unwind at Radhanagar Beach and enjoy " +
    "snorkelling and scuba-diving experiences, subject to weather " +
    "and local availability.",

  highlights: [
    "Radhanagar Beach",
    "Swaraj Dweep (Havelock Island)",
    "Cellular Jail",
    "Elephant Beach",
  ],

  popularFor: [
    "Beach holidays",
    "Honeymoon trips",
    "Scuba diving",
    "Snorkelling",
    "Island stays",
    "Heritage sightseeing",
  ],

  bestTimeToVisit: "October to May",

  seoTitle: "Andaman Islands Tours & Beach Holidays",
  seoDescription:
    "Explore Andaman Islands tours covering Port Blair, Havelock, " +
    "Radhanagar Beach and Cellular Jail. Discover itineraries and " +
    "enquire about upcoming departures.",

  isTrending: false,
  isFeatured: true,
  isActive: true,
} satisfies typeof destinations.$inferInsert;

export const Route = createFileRoute("/api/seed/v1")({
  server: {
    handlers: {
      GET: async () => {
        // Keep this seed endpoint unavailable in production.
        if (!import.meta.env.DEV) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const db = getDb(env.DB);

          const tour = await db
            .select({
              id: tours.id,
              title: tours.title,
              featuredImage: tours.featuredImage,
            })
            .from(tours)
            .where(eq(tours.id, TOUR_ID))
            .get();

          if (!tour) {
            return Response.json(
              {
                success: false,
                error: "Andaman tour not found. Check TOUR_ID.",
              },
              { status: 404 },
            );
          }

          // Re-running does not create duplicate destinations.
          await db
            .insert(destinations)
            .values({
              ...ANDAMAN_DESTINATION,
              coverImage: tour.featuredImage,
            })
            .onConflictDoNothing({
              target: destinations.slug,
            });

          const destination = await db
            .select({
              id: destinations.id,
              name: destinations.name,
              state: destinations.state,
            })
            .from(destinations)
            .where(
              eq(destinations.slug, ANDAMAN_DESTINATION.slug),
            )
            .get();

          if (!destination) {
            throw new Error("Could not find the seeded destination.");
          }

          // This link fixes destination/state returning null.
          await db
            .update(tours)
            .set({
              destinationId: destination.id,
              updatedAt: new Date(),
            })
            .where(eq(tours.id, tour.id));

          // Recalculate instead of incrementing on every seed run.
          const totals = await db
            .select({ total: count() })
            .from(tours)
            .where(eq(tours.destinationId, destination.id))
            .get();

          await db
            .update(destinations)
            .set({
              tourCount: totals?.total ?? 0,
              updatedAt: new Date(),
            })
            .where(eq(destinations.id, destination.id));

          return Response.json({
            success: true,
            destination,
            linkedTour: {
              id: tour.id,
              title: tour.title,
            },
          });
        } catch (error) {
          console.error("Andaman destination seed failed", error);

          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to seed Andaman destination",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
