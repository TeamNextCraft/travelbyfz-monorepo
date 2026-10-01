import { getDb } from "@repo/db/client";
import { createTourRepository } from "@repo/db/repository/tours";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod"

export const getPublicTours = createServerFn({ method: "GET" }).handler(async () => {
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
    try {
      const db = getDb(env.DB);
      const result = await createTourRepository(db).findPublicBySlug(data.slug);
      return result ?? null; // use null: undefined can't be serialized reliably
    } catch (err) {
      console.error("getPublicTourbySlug failed", { slug: data.slug, err });
      throw err;
    }
  });

export const getTourReviews = createServerFn()
  .validator(z.object({
    tourId: z.string(),
    limit: z.number().min(0).default(10).optional(),
    offset: z.number().min(0).optional(),
  }))
  .handler(async ({ data }) => {
    const { tourId, limit, offset } = data;
    try {
      const db = getDb(env.DB);
      const result = await createTourRepository(db).getReviews(tourId, limit, offset);
      return result ?? null;
    } catch (err) {
      console.error("failed to fetch reviews for tourId: ", tourId);
      throw err;
    }
  })

