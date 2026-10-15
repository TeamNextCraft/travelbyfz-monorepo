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
      price: tour.fromPrice ?? null,
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


export const getTourAddons = createServerFn()
  .handler(async () => {
    try {
      const db = getDb(env.DB);
      const result = await createTourRepository(db).getAddons();
      return result ?? null;
    } catch (err) {
      console.error("failed to fetch tour addons", err);
      throw err;
    }
  })

export const getMyTourInterest = createServerFn({ method: "GET" })
  .validator(z.object({
    tourId: z.uuid(),
  }))
  .handler(async ({ data }) => {
    const { getRequestHeaders, setResponseHeader } =
      await import("@tanstack/react-start/server");

    // Adjust this path to your server-side Better Auth instance.
    const { auth } = await import("@/lib/auth");

    setResponseHeader("Cache-Control", "private, no-store");

    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    if (!session) {
      throw new Error("Sign in to check your tour interest.");
    }

    const enquiry = await createTourRepository(
      getDb(env.DB),
    ).findTourInterest(session.user.id, data.tourId);

    return {
      interested: Boolean(enquiry),
    };
  });

export const registerTourInterest = createServerFn({ method: "POST" })
  .validator(z.object({
    tourId: z.uuid(),
  }))
  .handler(async ({ data }) => {
    const { getRequestHeaders, setResponseHeader } =
      await import("@tanstack/react-start/server");

    // Adjust this path to your server-side Better Auth instance.
    const { auth } = await import("@/lib/auth");

    setResponseHeader("Cache-Control", "private, no-store");

    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    if (!session) {
      throw new Error("Please sign in to register your interest.");
    }

    const db = getDb(env.DB);

    const tour = await createTourRepository(db).findById(data.tourId);

    if (!tour || !tour.isActive || !tour.isPublished) {
      throw new Error("This tour is not available.");
    }

    const result = await createTourRepository(
      db,
    ).registerTourInterest({
      userId: session.user.id,
      tourId: tour.id,
      tourTitle: tour.title,
      name: session.user.name,
      email: session.user.email,
    });

    return {
      ...result,
      interested: true,
    };
  });
