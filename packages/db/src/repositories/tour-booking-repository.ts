import { and, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import {
  addons, bookings, bookingAddons, bookingTravellers, coupons, couponTargets,
  departures, departurePricing, payments, tours,
} from "#/schema/domestic.js";
import { getDb } from "#/client.js";

type Database = ReturnType<typeof getDb>;

export function createTourBookingRepository(db: Database) {
  return {
    // ── Departures ──

    listDepartures(tourId: string) {
      return db
        .select()
        .from(departures)
        .where(
          and(
            eq(departures.tourId, tourId),
            eq(departures.isActive, true),
            inArray(departures.status, ["scheduled", "full"]),
            gt(departures.startDate, new Date()),
          ),
        )
        .orderBy(departures.startDate);
    },

    listDeparturePricing(departureIds: string[]) {
      return db
        .select()
        .from(departurePricing)
        .where(inArray(departurePricing.departureId, departureIds));
    },

    findDeparture(tourId: string, departureId: string) {
      return db
        .select()
        .from(departures)
        .where(and(eq(departures.id, departureId), eq(departures.tourId, tourId)))
        .get();
    },

    // Atomically takes n seats. Returns the row only if it succeeded.
    reserveSeats(departureId: string, n: number) {
      return db
        .update(departures)
        .set({
          availableSeats: sql`${departures.availableSeats} - ${n}`,
          status: sql`CASE WHEN ${departures.availableSeats} - ${n} = 0 THEN 'full' ELSE ${departures.status} END`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(departures.id, departureId),
            eq(departures.status, "scheduled"),
            eq(departures.isActive, true),
            sql`${departures.availableSeats} >= ${n}`,
          ),
        )
        .returning({ id: departures.id })
        .get();
    },

    releaseSeats(departureId: string, n: number) {
      return db
        .update(departures)
        .set({
          availableSeats: sql`MIN(${departures.availableSeats} + ${n}, ${departures.totalSeats})`,
          status: sql`CASE WHEN ${departures.status} = 'full' THEN 'scheduled' ELSE ${departures.status} END`,
          updatedAt: new Date(),
        })
        .where(eq(departures.id, departureId))
        .run();
    },

    // ── Coupons ──

    findCouponByCode(code: string) {
      return db.select().from(coupons).where(eq(coupons.code, code)).get();
    },

    listCouponTargets(couponId: string) {
      return db.select().from(couponTargets).where(eq(couponTargets.couponId, couponId));
    },

    reserveCoupon(couponId: string) {
      return db
        .update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(
          and(
            eq(coupons.id, couponId),
            or(isNull(coupons.usageLimit), sql`${coupons.usedCount} < ${coupons.usageLimit}`),
          ),
        )
        .returning({ id: coupons.id })
        .get();
    },

    releaseCoupon(couponId: string) {
      return db
        .update(coupons)
        .set({ usedCount: sql`MAX(${coupons.usedCount} - 1, 0)` })
        .where(eq(coupons.id, couponId))
        .run();
    },

    // ── Tours & add-ons ──

    findBookableTour(tourId: string) {
      return db
        .select()
        .from(tours)
        .where(and(eq(tours.id, tourId), eq(tours.isActive, true), eq(tours.isPublished, true)))
        .get();
    },

    listActiveAddons(ids: string[]) {
      return db
        .select()
        .from(addons)
        .where(and(inArray(addons.id, ids), eq(addons.isActive, true)));
    },

    // ── Bookings ──

    createBooking(input: typeof bookings.$inferInsert) {
      return db.insert(bookings).values(input).returning().get();
    },

    insertTravellers(rows: (typeof bookingTravellers.$inferInsert)[]) {
      return db.insert(bookingTravellers).values(rows).run();
    },

    insertBookingAddons(rows: (typeof bookingAddons.$inferInsert)[]) {
      return db.insert(bookingAddons).values(rows).run();
    },

    insertPayment(input: typeof payments.$inferInsert) {
      return db.insert(payments).values(input).returning().get();
    },

    findPaymentByOrder(orderId: string) {
      return db.select().from(payments).where(eq(payments.providerOrderId, orderId)).get();
    },

    findPaymentForBooking(bookingId: string, orderId: string) {
      return db
        .select()
        .from(payments)
        .where(and(eq(payments.bookingId, bookingId), eq(payments.providerOrderId, orderId)))
        .get();
    },

    findBooking(id: string) {
      return db.select().from(bookings).where(eq(bookings.id, id)).get();
    },

    // Idempotent claim: only one caller can flip payment_status to paid.
    confirmBooking(bookingId: string, values: Partial<typeof bookings.$inferInsert>) {
      return db
        .update(bookings)
        .set({ ...values, updatedAt: new Date() })
        .where(and(eq(bookings.id, bookingId), sql`${bookings.paymentStatus} != 'paid'`))
        .returning({ id: bookings.id })
        .get();
    },

    markPaymentPaid(paymentId: string, values: Partial<typeof payments.$inferInsert>) {
      return db.update(payments).set({ ...values, updatedAt: new Date() })
        .where(eq(payments.id, paymentId))
        .run();
    },

    markPaymentFailed(paymentId: string, values: Partial<typeof payments.$inferInsert>) {
      return db.update(payments).set({ ...values, updatedAt: new Date() })
        .where(eq(payments.id, paymentId))
        .run();
    },

    incrementBookingCount(tourId: string) {
      return db
        .update(tours)
        .set({ bookingCount: sql`${tours.bookingCount} + 1` })
        .where(eq(tours.id, tourId))
        .run();
    },

    // ── Cron ──

    listExpiredHolds() {
      return db
        .select({
          paymentId: payments.id,
          bookingId: bookings.id,
          departureId: bookings.departureId,
          couponId: bookings.couponId,
          guests: sql<number>`${bookings.adultCount} + ${bookings.childCount}`,
        })
        .from(payments)
        .innerJoin(bookings, eq(bookings.id, payments.bookingId))
        .where(
          and(
            eq(payments.status, "pending"),
            eq(bookings.status, "pending"),
            lt(payments.expiresAt, new Date()),
          ),
        );
    },

    cancelIfPending(bookingId: string) {
      return db
        .update(bookings)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: "Payment not completed in time",
        })
        .where(and(eq(bookings.id, bookingId), eq(bookings.status, "pending")))
        .returning({ id: bookings.id })
        .get();
    },
  };
}
