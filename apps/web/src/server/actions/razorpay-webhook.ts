import { bookings, payments } from "@repo/db/schema/domestic.ts"
import { and, eq } from "drizzle-orm"
import { webinarRegistrations } from "@repo/db/schema/webinar-registrations.js";
import { db } from "#/lib/db-config";

export async function markOrderPaid({
  orderId,
  paymentId,
  paymentMethod,
  eventId,
}: {
  orderId: string;
  paymentId: string | null;
  paymentMethod: string | null;
  eventId: string | null;
}) {
  /*
   * Find the payment through providerOrderId.
   *
   * This assumes providerOrderId contains the Razorpay order ID.
   */
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.providerOrderId, orderId))
    .limit(1);

  if (payment) {
    return markTourBookingPaid({
      paymentRow: payment,
      orderId,
      paymentId,
      paymentMethod,
      eventId,
    });
  }

  /*
   * If no payments row exists, try the webinar table.
   */
  const [registration] = await db
    .select()
    .from(webinarRegistrations)
    .where(eq(webinarRegistrations.razorpayOrderId, orderId))
    .limit(1);

  if (registration) {
    return markWebinarRegistrationPaid({
      registration,
      orderId,
      paymentId,
    });
  }

  /*
   * An unknown order should normally return 200.
   * Otherwise Razorpay may keep retrying an order that belongs
   * to another application or an old deleted record.
   */
  console.warn("No local record found for Razorpay order", {
    orderId,
    paymentId,
  });

  return {
    type: "unknown",
    orderId,
  };
}

async function markTourBookingPaid({
  paymentRow,
  orderId,
  paymentId,
  paymentMethod,
  eventId,
}: {
  paymentRow: typeof payments.$inferSelect;
  orderId: string;
  paymentId: string | null;
  paymentMethod: typeof payments.$inferSelect['method'] | null;
  eventId: string | null;
}) {
  const now = new Date();

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, paymentRow.bookingId))
    .limit(1);

  if (!booking) {
    throw new Error(`Booking not found for payment ${paymentRow.id}`);
  }

  /*
   * Only update pending payments.
   *
   * This makes repeated payment.captured/order.paid events harmless.
   */
  const [updatedPayment] = await db
    .update(payments)
    .set({
      status: "paid",
      provider: "razorpay",
      providerOrderId: orderId,
      providerPaymentId: paymentId ?? paymentRow.providerPaymentId,
      method: paymentMethod ?? paymentRow.method,
      paidAt: paymentRow.paidAt ?? now,
      updatedAt: now,
      notes: eventId
        ? `Razorpay webhook event: ${eventId}`
        : paymentRow.notes,
    })
    .where(
      and(
        eq(payments.id, paymentRow.id),
        eq(payments.status, "pending"),
      ),
    )
    .returning();

  /*
   * If undefined, this payment was already marked paid or is no longer
   * pending. Do not send a duplicate confirmation.
   */
  if (!updatedPayment) {
    return {
      type: "tour_booking",
      bookingId: booking.id,
      alreadyProcessed: true,
    };
  }

  const paidAmount = updatedPayment.amount;
  const dueAmount = Math.max(booking.totalAmount - paidAmount, 0);

  /*
   * This updates the booking's payment fields.
   *
   * Replace "confirmed" with the valid value from your bookingStatuses enum.
   */
  const [updatedBooking] = await db
    .update(bookings)
    .set({
      paymentStatus: dueAmount === 0 ? "paid" : "partial",
      paidAmount,
      dueAmount,
      status: dueAmount === 0 ? "confirmed" : booking.status,
      confirmedAt: dueAmount === 0 ? booking.confirmedAt ?? now : booking.confirmedAt,
      updatedAt: now,
    })
    .where(eq(bookings.id, booking.id))
    .returning();

  if (!updatedBooking) {
    throw new Error(`Could not update booking ${booking.id}`);
  }

  /*
   * Send your tour confirmation here.
   *
   * Important: this is safe only if the notification itself has an
   * idempotency mechanism. See the recommended schema change below.
   */
  // await sendTourBookingConfirmation(updatedBooking);

  return {
    type: "tour_booking",
    bookingId: booking.id,
    paymentId: updatedPayment.id,
    alreadyProcessed: false,
  };
}

async function markWebinarRegistrationPaid({
  registration,
  paymentId,
}: {
  registration: typeof webinarRegistrations.$inferSelect;
  orderId: string;
  paymentId: string | null;
}) {
  /*
   * Atomically move only non-paid registrations to paid.
   *
   * This protects against payment.captured and order.paid both
   * triggering the confirmation.
   */
  const [updatedRegistration] = await db
    .update(webinarRegistrations)
    .set({
      status: "paid",
      razorpayPaymentId: paymentId ?? registration.razorpayPaymentId,
    })
    .where(
      and(
        eq(webinarRegistrations.id, registration.id),
        eq(webinarRegistrations.status, "created"),
      ),
    )
    .returning();

  /*
   * If no row returned, it was already paid or had another status.
   * Do not send the confirmation again.
   */
  if (!updatedRegistration) {
    return {
      type: "webinar_registration",
      registrationId: registration.id,
      alreadyProcessed: true,
    };
  }

  /*
   * You currently have zoomLinkSent, but no separate confirmationSent.
   * This line should be replaced by your notification logic.
   *
   * If the email includes the Zoom link, claim zoomLinkSent only after
   * successfully creating/fetching the Zoom link.
   */
  // await sendWebinarConfirmation(updatedRegistration);

  /*
   * If sendWebinarConfirmation sends the Zoom link successfully,
   * update zoomLinkSent = true.
   */
  // await db
  //   .update(webinarRegistrations)
  //   .set({ zoomLinkSent: true })
  //   .where(eq(webinarRegistrations.id, updatedRegistration.id));

  return {
    type: "webinar_registration",
    registrationId: updatedRegistration.id,
    alreadyProcessed: false,
  };
}

export async function markOrderFailed({
  orderId,
  paymentId,
}: {
  orderId: string;
  paymentId: string | null;
}) {
  const now = new Date();

  /*
   * Tour payment:
   * Do not overwrite an already-paid payment.
   */
  const [tourPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.providerOrderId, orderId))
    .limit(1);

  if (tourPayment) {
    const [failedPayment] = await db
      .update(payments)
      .set({
        status: "failed",
        providerPaymentId: paymentId ?? tourPayment.providerPaymentId,
        updatedAt: now,
      })
      .where(
        and(
          eq(payments.id, tourPayment.id),
          eq(payments.status, "pending"),
        ),
      )
      .returning();

    if (failedPayment) {
      const dueAmount = await getBookingDueAmount(tourPayment.bookingId);

      await db
        .update(bookings)
        .set({
          paymentStatus: "failed",
          dueAmount,
          updatedAt: now,
        })
        .where(eq(bookings.id, tourPayment.bookingId));
    }

    return;
  }

  /*
   * Webinar payment.
   *
   * Do not change paid registrations to failed.
   */
  await db
    .update(webinarRegistrations)
    .set({
      status: "failed",
      razorpayPaymentId: paymentId ?? undefined,
    })
    .where(
      and(
        eq(webinarRegistrations.razorpayOrderId, orderId),
        eq(webinarRegistrations.status, "created"),
      ),
    );
}

async function getBookingDueAmount(bookingId: string) {
  const [booking] = await db
    .select({
      totalAmount: bookings.totalAmount,
      paidAmount: bookings.paidAmount,
    })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    throw new Error(`Booking not found: ${bookingId}`);
  }

  return Math.max(booking.totalAmount - booking.paidAmount, 0);
}
