import { getDb } from "@repo/db/client";
import { createTourBookingRepository } from "@repo/db/repository/tour-booking-repository";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import z from "zod";

export const getCurrentUserBookings = createServerFn({ method: "GET" })
  .validator(z.object({
    userId: z.string(),
  }))
  .handler(async ({ data }) => {
    try {
      const db = getDb(env.DB);
      const result = await createTourBookingRepository(db).listUserBookings(data.userId);
      return result ?? null;
    } catch (err) {
      console.error("failed to fetch bookings for user", err);
      throw err;
    }
  })
