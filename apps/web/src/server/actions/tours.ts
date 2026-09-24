import { db } from "#/lib/db-config.ts";
import { createTourRepository } from "@repo/db/repository/tours";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPublicTours = createServerFn().handler(async () => {
  const data = await createTourRepository(db).getPublicToursList();

  return data.map((tour) => ({
    ...tour,
    duration: `${tour.durationDays}D/${tour.durationNights}N`,
    destination: tour.destination ?? "N/A",
    state: tour.state ?? "N/A",
    image: tour.image ?? "/images/placeholder.jpg",
    groupSize: tour.groupSize ?? 0,
  }));
});

export const getPublicTourbySlug = createServerFn()
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const result = await createTourRepository(db).findBySlug(data.slug);
    if (result) {
      console.log({
        file: "server/actions/tours.ts",
        output: result,
      })
      return result
    }
    return undefined;
  });

