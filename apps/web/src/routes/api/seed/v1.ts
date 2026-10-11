import { getDb } from "@repo/db/client";
import {
  departures,
  departurePricing,
  tours,
} from "@repo/db/schema/domestic.js";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { inArray } from "drizzle-orm";

const DAY = 24 * 60 * 60 * 1000;
const daysFromNow = (d: number) => new Date(Date.now() + d * DAY);

// Offsets are relative to today, so the seed data never goes stale.
const DEPARTURE_TEMPLATES = [
  {
    suffix: "A",
    startIn: 30,
    nights: 5,
    price: 32000,
    discountedPrice: 29500,
    totalSeats: 20,
    availableSeats: 14,
    status: "scheduled",
    deadlineDaysBefore: 7,
    notes: "Early batch. Pickup from Surat on request.",
    isGuaranteed: true,
    isActive: true,
    rooms: { single: 38000, double: 29500, triple: 27500, child: 19500 },
  },
  {
    suffix: "B",
    startIn: 55,
    nights: 5,
    price: 34500,
    discountedPrice: null,
    totalSeats: 25,
    availableSeats: 25,
    status: "scheduled",
    deadlineDaysBefore: 7,
    notes: null,
    isGuaranteed: false,
    isActive: true,
    rooms: { single: 41000, double: 34500, triple: 32000, child: 22000 },
  },
  {
    suffix: "C",
    startIn: 78,
    nights: 5,
    price: 42000,
    discountedPrice: 39000,
    totalSeats: 18,
    availableSeats: 6, // low seats: tests the "only N seats left" error
    status: "scheduled",
    deadlineDaysBefore: 10,
    notes: "Festive special. Gala dinner included.",
    isGuaranteed: true,
    isActive: true,
    rooms: { single: 49000, double: 39000, triple: 36500, child: 26000 },
  },
  {
    suffix: "D",
    startIn: 97,
    nights: 5,
    price: 33000,
    discountedPrice: null,
    totalSeats: 20,
    availableSeats: 0, // sold out
    status: "full",
    deadlineDaysBefore: 7,
    notes: "Sold out. Waitlist only.",
    isGuaranteed: true,
    isActive: true,
    rooms: { single: 39000, double: 33000, triple: 30500, child: 21000 },
  },
  {
    suffix: "E",
    startIn: 125,
    nights: 5,
    price: 35500,
    discountedPrice: 33000,
    totalSeats: 22,
    availableSeats: 22,
    status: "scheduled",
    deadlineDaysBefore: null, // no booking deadline
    notes: "No booking deadline.",
    isGuaranteed: false,
    isActive: true,
    rooms: { single: 42000, double: 33000, triple: 31000, child: 22500 },
  },
  {
    suffix: "X",
    startIn: 150,
    nights: 5,
    price: 36000,
    discountedPrice: null,
    totalSeats: 20,
    availableSeats: 20,
    status: "scheduled",
    deadlineDaysBefore: 7,
    notes: "Inactive: should never appear in listings.",
    isGuaranteed: false,
    isActive: false,
    rooms: { single: 43000, double: 36000, triple: 33500, child: 23000 },
  },
] as const;

// D1 allows at most 100 bound params per statement, so insert in chunks.
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export const Route = createFileRoute("/api/seed/v1")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const db = getDb(env.DB);

          // Optional: /api/seed/departures?tours=3 (default 3 tours)
          const limit = Number(new URL(request.url).searchParams.get("tours") ?? 3);
          const tourRows = await db
            .select({ id: tours.id })
            .from(tours)
            .limit(Number.isFinite(limit) && limit > 0 ? limit : 3);

          if (!tourRows.length) {
            return Response.json(
              { success: false, error: "No tours found. Seed tours first." },
              { status: 400 },
            );
          }

          // Build departure rows; the code is unique, so re-running is safe.
          const planned = tourRows.flatMap((tour, tIdx) =>
            DEPARTURE_TEMPLATES.map((t) => {
              const startDate = daysFromNow(t.startIn);
              return {
                template: t,
                row: {
                  id: crypto.randomUUID(),
                  tourId: tour.id,
                  code: `FZ-T${tIdx + 1}-${t.suffix}`,
                  startDate,
                  endDate: new Date(startDate.getTime() + t.nights * DAY),
                  price: t.price,
                  discountedPrice: t.discountedPrice,
                  totalSeats: t.totalSeats,
                  availableSeats: t.availableSeats,
                  status: t.status,
                  bookingDeadline:
                    t.deadlineDaysBefore === null
                      ? null
                      : new Date(startDate.getTime() - t.deadlineDaysBefore * DAY),
                  notes: t.notes,
                  isGuaranteed: t.isGuaranteed,
                  isActive: t.isActive,
                },
              };
            }),
          );

          let departuresInserted = 0;
          for (const part of chunk(planned, 4)) {
            const res = await db
              .insert(departures)
              .values(part.map((p) => p.row))
              .onConflictDoNothing({ target: departures.code })
              .returning({ id: departures.id });
            departuresInserted += res.length;
          }

          // Re-read ids by code so pricing links to rows that actually exist,
          // including ones from an earlier run.
          const codes = planned.map((p) => p.row.code);
          const saved = await db
            .select({ id: departures.id, code: departures.code })
            .from(departures)
            .where(inArray(departures.code, codes));
          const idByCode = new Map(saved.map((d) => [d.code, d.id]));

          const pricingRows = planned.flatMap((p) => {
            const departureId = idByCode.get(p.row.code);
            if (!departureId) return [];
            return Object.entries(p.template.rooms).map(([roomType, price]) => ({
              departureId,
              roomType: roomType as "single" | "double" | "triple" | "child",
              price,
            }));
          });

          let pricingInserted = 0;
          for (const part of chunk(pricingRows, 10)) {
            const res = await db
              .insert(departurePricing)
              .values(part)
              .onConflictDoNothing() // unique (departureId, roomType)
              .returning({ id: departurePricing.id });
            pricingInserted += res.length;
          }

          return Response.json({
            success: true,
            tours: tourRows.length,
            departuresInserted,
            pricingInserted,
            codes,
          });
        } catch (error) {
          console.error("Departure seed failed", error);

          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to seed departures",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
