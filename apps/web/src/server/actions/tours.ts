import { db } from "#/lib/db-config.ts";
import { getDb } from "@repo/db/client";
import { createTourRepository } from "@repo/db/repository/tours";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "cloudflare:workers";

export const getPublicTours = createServerFn({ method: "GET" }).handler(async () => {
  console.log({
    file: 'server/actions/tours.ts',
    output: "server function getPublicTours called",
  })

  try {
    const db = getDb(env.DB);

    const data = await createTourRepository(db).getPublicToursList();

    console.error({
      file: "server/actions/tours.ts",
      output: data,
    })

    if (!data) {
      return [];
    }

    return data.map((tour) => ({
      ...tour,
      duration: `${tour.durationDays}D/${tour.durationNights}N`,
      destination: tour.destination ?? "N/A",
      state: tour.state ?? "N/A",
      image: tour.image ?? "/images/placeholder.jpg",
      groupSize: tour.groupSize ?? 0,
    }));
  } catch (error) {
    console.error({
      message: "Error fetching data form db.",
      error: error
    })

    return [];
  }
});

export const getPublicTourbySlug = createServerFn()
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const result = await createTourRepository(db).findPublicBySlug(data.slug);
    if (result) {
      console.log({
        file: "server/actions/tours.ts",
        output: result,
      })
      return result
    }
    return undefined;
  });

