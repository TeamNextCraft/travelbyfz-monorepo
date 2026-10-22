import { getDb } from "@repo/db/client";
import {
  departurePricing,
} from "@repo/db/schema/domestic.js";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

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

          const departureIds = [
            "e5918fa9-b8ce-4508-86ab-5fcb76ec4b6a",
            "ded0f806-e2d7-444e-8d87-4c28c9325c40",
            "581f2c9b-a627-4dfb-acbe-041d28ecf337",
          ];

          const data = departureIds.map((departureId) => {
            return [
              { departureId, roomType: "single" as const, price: 45000, compareAtPrice: 52000 },
              { departureId, roomType: "double" as const, price: 32000, compareAtPrice: 38000 },
              { departureId, roomType: "triple" as const, price: 28000, compareAtPrice: 33000 },
              { departureId, roomType: "quad" as const, price: 24000, compareAtPrice: 28000 },
              { departureId, roomType: "child" as const, price: 18000, compareAtPrice: 22000 },
            ]
          })

          let response;

          const modified_data = data.map(v => v).flat(1);

          //           const pricingData = departureIds.flatMap((departureId) => [
          //             { departureId, roomType: "single" as const, price: 45000, compareAtPrice: 52000 },
          //             { departureId, roomType: "double" as const, price: 32000, compareAtPrice: 38000 },
          //             { departureId, roomType: "triple" as const, price: 28000, compareAtPrice: 33000 },
          //             { departureId, roomType: "quad" as const, price: 24000, compareAtPrice: 28000 },
          //             { departureId, roomType: "child" as const, price: 18000, compareAtPrice: 22000 },
          //           ]);
          //
          //           console.log("pricingData: ", pricingData)


          response = await db.insert(departurePricing).values(data.map(v => v).flat(1));


          return Response.json({
            success: true,
            data: response,
            len: modified_data.length
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
