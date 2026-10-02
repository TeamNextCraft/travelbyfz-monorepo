import { getDb } from "@repo/db/client";
import { addons } from "@repo/db/schema/domestic.js";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

const ADD_ONS = [
  {
    slug: "travel-insurance",
    title: "Travel Insurance",
    description: "Comprehensive coverage — medical, cancellation & baggage",
    price: 799,
    perPerson: true,
  },
  {
    slug: "airport-transfer",
    title: "Airport / Station Pickup",
    description: "AC cab pickup & drop from nearest airport or railway station",
    price: 1200,
    perPerson: false,
  },
  {
    slug: "photo-package",
    title: "Professional Photography",
    description: "Dedicated photographer for 1 day with 50 edited photos",
    price: 3500,
    perPerson: false,
  },
  {
    slug: "early-checkin",
    title: "Early Check-in (Day 1)",
    description: "Guaranteed room ready from 8 AM on arrival day",
    price: 1500,
    perPerson: false,
  },
] as const;

export const Route = createFileRoute("/api/seed/v1")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const db = getDb(env.DB);

          const values = ADD_ONS.map((addon) => ({
            slug: addon.slug,
            title: addon.title,
            description: addon.description,
            price: addon.price,
            perPerson: addon.perPerson,
            isActive: true,
          }));

          const result = await db
            .insert(addons)
            .values(values)
            .onConflictDoNothing({
              target: addons.slug,
            })
            .returning({
              id: addons.id,
              slug: addons.slug,
            });

          return Response.json({
            success: true,
            inserted: result.length,
            addons: result,
          });
        } catch (error) {
          console.error("Add-on seed failed", error);

          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to seed add-ons",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
