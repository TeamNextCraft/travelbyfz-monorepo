import { getDb } from "@repo/db/client";
import {
  tours,
  tourTiers
} from "@repo/db/schema/domestic.js";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/seed/v1")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const db = getDb(env.DB);

          const tour_ids = await db.select({ id: tours.id }).from(tours)

          console.log({
            data: tour_ids
          })

          const promise = tour_ids.forEach((id) => {
            return db.insert(tourTiers).values([
              {
                tourId: id.id,
                slug: "standard",
                label: "Standard",
                description: "3★ hotels, AC sleeper houseboat, shared group of up to 12",
                sortOrder: 0,
                isActive: true,
              },
              {
                tourId: id.id,
                slug: "delux",
                label: "Delux",
                description: "4★ hotels, premium houseboat with AC cabin, group of up to 8",
                sortOrder: 1,
                isActive: true,
              },
              {
                tourId: id.id,
                slug: "luxury",
                label: "Luxury",
                description: "5★ CGH Earth properties, private luxury houseboat, couple/family only",
                sortOrder: 2,
                isActive: true,
              },
            ])
          })

          Promise.all(promise)

          if (!tour_ids) return undefined;

          return Response.json({
            success: true,
          });
        } catch (error) {
          console.error("Seed failed", error);

          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to seed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
