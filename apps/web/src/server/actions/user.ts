import { getDb } from "@repo/db/client";
import { createTourBookingRepository } from "@repo/db/repository/tour-booking-repository";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { auth } from "#/lib/auth";
import z from "zod";

export const getCurrentUserBookings = createServerFn({
  method: "GET",
}).handler(async () => {
  // 1. Read the authenticated session from the incoming request.
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  // 2. Reject unauthenticated requests.
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 3. Derive the user ID from the verified session.
  const userId = session.user.id;

  // 4. Query only this user's bookings.
  const repo = createTourBookingRepository(getDb(env.DB));
  const bookings = await repo.listUserBookings(userId);

  if (bookings.length === 0) {
    return [];
  }

  const addons = await repo.listUserBookingAddons(
    bookings.map((booking) => booking.id),
  );

  return bookings.map((booking) => ({
    ...booking,
    addOns: addons
      .filter((addon) => addon.bookingId === booking.id)
      .map((addon) => addon.addonName)
      .filter((name): name is string => name !== null),
  }));
});

export const getBookingDetailsById = createServerFn({
  method: "GET"
})
  .validator(z.object({
    bookingId: z.string(),
  }))
  .handler(async ({ data }) => {
    try {
      // 1. Read the authenticated session from the incoming request.
      const session = await auth.api.getSession({
        headers: getRequestHeaders(),
      });

      // 2. Reject unauthenticated requests.
      if (!session) {
        throw new Error("Unauthorized");
      }

      const repo = createTourBookingRepository(getDb(env.DB));

      const booking = await repo.getBookingById(data.bookingId);

      if (!booking) {
        throw new Error("Booking Not Found");
      }

      const travellers = await repo.getBookingTravelers(booking.id);

      const addons = await repo.listUserBookingAddons([booking.id]);

      const payments = await repo.getUserBookingPayments(booking.id);

      const reviews = await repo.listBookingReviews(booking.id);

      return {
        ...booking,
        addons: addons,
        travellers: travellers,
        payments: payments,
        reviews: reviews,
      };
    } catch (err) {
      console.error({
        code: 505,
        message: "Error getting booking from db",
        error: err,
      })
      throw err;
    }
  })
