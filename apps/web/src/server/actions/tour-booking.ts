import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { getDb } from "@repo/db/client";
import {
  addons, coupons,
  departures,
} from "@repo/db/schema/domestic.js";
import { createTourBookingRepository } from "@repo/db/repository/tour-booking-repository";
import { hmacSha256, safeEqual } from "#/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const GST_RATE = 0.05;
const CHILD_MAX_AGE = 11;
const HOLD_MINUTES = 15; // how long seats are held while the user pays
const RZP_API = "https://api.razorpay.com/v1";

const ROOM_TYPES = ["single", "double", "triple", "quad", "child"] as const;
type RoomType = (typeof ROOM_TYPES)[number];

const toPaise = (rupees: number) => Math.round(rupees * 100);

// TODO: wire to Better Auth, e.g. (await auth.api.getSession({ headers }))?.user.id
async function getOptionalUserId(): Promise<string | null> {
  return null;
}

const ID_REGEX = {
  aadhaar: /^\d{12}$/,
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  passport: /^[A-Z]\d{7}$/,
  driving_license: /^[A-Z]{2}\d{13}$/,
  voter_id: /^[A-Z]{3}\d{7}$/,
} as const;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function makeBookingRef() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return "FZ" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function discountFor(
  base: number,
  c: { type: "percentage" | "flat"; value: number; maxDiscountAmount: number | null },
) {
  let d = c.type === "percentage" ? Math.round((base * c.value) / 100) : c.value;
  if (c.maxDiscountAmount) d = Math.min(d, c.maxDiscountAmount);
  return Math.max(0, Math.min(d, base));
}

function bookable(d: typeof departures.$inferSelect) {
  const now = Date.now();
  return (
    d.isActive &&
    d.status === "scheduled" &&
    d.availableSeats > 0 &&
    +d.startDate > now &&
    (!d.bookingDeadline || +d.bookingDeadline > now)
  );
}

function ageAt(dob: string, ref: Date) {
  const d = new Date(`${dob}T00:00:00`);
  let age = ref.getFullYear() - d.getFullYear();
  const m = ref.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < d.getDate())) age--;
  return age;
}

const maskId = (type: string | null, num: string | null) =>
  !num ? null : type === "aadhaar" ? `XXXXXXXX${num.slice(-4)}` : num;

// ─── Coupon resolution (used by validateCoupon AND createBooking) ─────────────

const couponInput = z.object({
  code: z.string().trim().min(1).max(40),
  tourId: z.string().min(1),
  departureId: z.string().min(1),
  amount: z.number().int().nonnegative(),
});

async function resolveCoupon(
  r: ReturnType<typeof createTourBookingRepository>,
  input: z.infer<typeof couponInput>,
) {
  const c = await r.findCouponByCode(input.code.trim().toUpperCase());
  const now = Date.now();

  if (!c || !c.isActive) throw new Error("Invalid coupon code");
  if (c.startsAt && +c.startsAt > now) throw new Error("This coupon is not active yet");
  if (c.expiresAt && +c.expiresAt < now) throw new Error("This coupon has expired");
  if (c.usageLimit != null && c.usedCount >= c.usageLimit)
    throw new Error("This coupon has reached its usage limit");
  if (c.minBookingAmount && input.amount < c.minBookingAmount)
    throw new Error(
      `Minimum booking amount for this coupon is ₹${c.minBookingAmount.toLocaleString("en-IN")}`,
    );

  if (c.scope !== "all") {
    const targets = await r.listCouponTargets(c.id);
    const ok =
      c.scope === "tour"
        ? targets.some((t) => t.tourId === input.tourId)
        : targets.some((t) => t.departureId === input.departureId);
    if (!ok) throw new Error("This coupon is not valid for the selected tour");
  }
  return c;
}

// ─── 1. getTourDepartures ─────────────────────────────────────────────────────

export const getTourDepartures = createServerFn({ method: "GET" })
  .validator(z.object({ tourId: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      const r = createTourBookingRepository(getDb(env.DB));
      const rows = await r.listDepartures(data.tourId);
      if (!rows.length) return [];

      const prices = await r.listDeparturePricing(rows.map((d) => d.id));

      return rows.map((d) => {
        const departurePrice = prices.find((departurePricing) => departurePricing.departureId === d.id);
        return {
          id: d.id,
          code: d.code,
          startDate: d.startDate,
          endDate: d.endDate,
          price: departurePrice?.compareAtPrice,
          discountedPrice: departurePrice?.price,
          totalSeats: d.totalSeats,
          availableSeats: d.availableSeats,
          status: d.status,
          bookingDeadline: d.bookingDeadline,
          isGuaranteed: d.isGuaranteed,
          notes: d.notes,
          pricing: prices
            .filter((p) => p.departureId === d.id)
            .map((p) => ({ roomType: p.roomType, price: p.price })),
        }
      });
    } catch (err) {
      console.error("failed to fetch departures for tourId:", data.tourId, err);
      throw err;
    }
  });

// ─── 2. validateCoupon ────────────────────────────────────────────────────────

export const validateCoupon = createServerFn({ method: "POST" })
  .validator(couponInput)
  .handler(async ({ data }) => {
    try {
      const repo = createTourBookingRepository(getDb(env.DB));
      const c = await resolveCoupon(repo, data);
      return {
        id: c.id,
        code: c.code,
        title: c.title,
        type: c.type,
        value: c.value,
        maxDiscountAmount: c.maxDiscountAmount,
      };
    } catch (err) {
      console.error("coupon validation failed:", data.code, err);
      throw err;
    }
  });

// ─── 3. createBooking ─────────────────────────────────────────────────────────

const createBookingInput = z.object({
  tourId: z.string().min(1),
  departureId: z.string().min(1),
  roomType: z.enum(ROOM_TYPES).nullable(),
  adultCount: z.number().int().min(1).max(20),
  childCount: z.number().int().min(0).max(20),
  //   travellers: z
  //     .array(
  //       z.object({
  //         firstName: z.string().trim().min(1).max(60),
  //         lastName: z.string().trim().min(1).max(60),
  //         age: z.number().int().min(1).max(120),
  //         gender: z.enum(["male", "female", "other"]),
  //         isPrimary: z.boolean(),
  //       }),
  //     )
  //     .min(1)
  //     .max(20),
  travellers: z.
    array(
      z.object({
        firstName: z.string().trim().min(1).max(60),
        lastName: z.string().trim().min(1).max(60),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
        age: z.number().int().min(0).max(120),
        gender: z.enum(["male", "female", "other"]),
        isPrimary: z.boolean(),
        phone: z.string().regex(/^[6-9]\d{9}$/).nullable(),
        email: z.email().nullable(),
        idType: z.enum(["aadhaar", "pan", "passport", "driving_license", "voter_id"]).nullable(),
        idNumber: z.string().max(30).nullable(),
        dietaryPreferences: z.array(z.string().max(30)).max(10),
        medicalNotes: z.string().max(500).nullable(),
      })
        .refine((t) => !t.idType || (t.idNumber && ID_REGEX[t.idType].test(t.idNumber)), {
          message: "Invalid ID number",
          path: ["idNumber"],
        }))
    .min(1)
    .max(20),
  contactName: z.string().trim().min(2).max(100),
  contactEmail: z.email(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/),
  contactCity: z.string().trim().min(2).max(80),
  specialRequests: z.string().max(500).nullable(),
  addonIds: z.array(z.string()).max(20),
  couponCode: z.string().nullable(),
  paymentMethod: z.enum(["upi", "card", "netbanking"]),
  source: z.enum(["website"]).default("website"),
});

async function createRazorpayOrder(args: {
  amountPaise: number;
  receipt: string;
  bookingId: string;
  keyId: string;
  keySecret: string;
}) {
  const res = await fetch(`${RZP_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${args.keyId}:${args.keySecret}`),
    },
    body: JSON.stringify({
      amount: args.amountPaise,
      currency: "INR",
      receipt: args.receipt,
      notes: { bookingId: args.bookingId },
    }),
  });
  if (!res.ok) {
    console.error("Razorpay order failed", res.status, await res.text());
    throw new Error("Could not start payment. Please try again.");
  }
  return (await res.json()) as { id: string };
}

export const createBooking = createServerFn({ method: "POST" })
  .validator(createBookingInput)
  .handler(async ({ data }) => {
    const r = createTourBookingRepository(getDb(env.DB));
    const guests = data.adultCount + data.childCount;

    // ── Load & validate ──
    const tour = await r.findBookableTour(data.tourId);
    if (!tour) throw new Error("This tour is no longer available");

    const departure = await r.findDeparture(tour.id, data.departureId);
    if (!departure || !bookable(departure))
      throw new Error("This departure is no longer available");

    if (data.travellers.length !== guests)
      throw new Error("Traveller details do not match the guest count");
    if (data.travellers.filter((t) => t.isPrimary).length !== 1)
      throw new Error("Exactly one primary traveller is required");
    if (guests < tour.minGroupSize)
      throw new Error(`Minimum group size is ${tour.minGroupSize}`);
    if (tour.maxGroupSize && guests > tour.maxGroupSize)
      throw new Error(`Maximum group size is ${tour.maxGroupSize}`);
    if (guests > departure.availableSeats)
      throw new Error(`Only ${departure.availableSeats} seats left on this departure`);

    // First `adultCount` travellers are adults, the rest are children (same order as the UI).
    //     data.travellers.forEach((t, i) => {
    //       const isChild = i >= data.adultCount;
    //       if (t.age < tour.minAge || t.age > tour.maxAge)
    //         throw new Error(
    //           `Traveller ${i + 1}: age must be between ${tour.minAge} and ${tour.maxAge}`,
    //         );
    //       if (isChild !== t.age <= CHILD_MAX_AGE)
    //         throw new Error(`Traveller ${i + 1}: age does not match the adult/child count`);
    //     });
    const primary = data.travellers.find((t) => t.isPrimary);
    if (!primary?.phone || !primary?.email)
      throw new Error("Primary traveller needs a phone number and email");

    const ageOf = (t: (typeof data.travellers)[number]) =>
      t.dateOfBirth ? ageAt(t.dateOfBirth, departure.startDate) : t.age;

    data.travellers.forEach((t, i) => {
      const age = ageOf(t);
      const isChild = i >= data.adultCount;
      if (age < tour.minAge || age > tour.maxAge)
        throw new Error(`Traveller ${i + 1} age must be between ${tour.minAge} and ${tour.maxAge}`);
      if (isChild !== (age <= CHILD_MAX_AGE))
        throw new Error(`Traveller ${i + 1} age does not match the adult/child count`);
    });

    // ── Pricing (rupees, integers) ──
    const priceRows = await r.listDeparturePricing([departure.id]);
    const roomPrice = (rt: RoomType) =>
      priceRows.find((p) => p.roomType === rt)?.price;

    const hasRooms = priceRows.some((p) => p.roomType !== "child");
    if (
      hasRooms &&
      (!data.roomType || data.roomType === "child" || roomPrice(data.roomType) == null)
    )
      throw new Error("Please select a valid room type");

    const adultUnit =
      (data.roomType && roomPrice(data.roomType)) ||
      departure.discountedPrice ||
      departure.price;
    const childUnit = roomPrice("child") ?? adultUnit;
    const base = adultUnit * data.adultCount + childUnit * data.childCount;

    let addonRows: (typeof addons.$inferSelect)[] = [];
    if (data.addonIds.length) {
      const ids = [...new Set(data.addonIds)];
      addonRows = await r.listActiveAddons(ids);
      if (addonRows.length !== ids.length)
        throw new Error("One of the selected add-ons is unavailable");
    }
    const addonLines = addonRows.map((a) => {
      const quantity = a.perPerson ? guests : 1;
      return { addon: a, quantity, total: a.price * quantity };
    });
    const addonAmount = addonLines.reduce((s, l) => s + l.total, 0);

    let coupon: typeof coupons.$inferSelect | null = null;
    let discount = 0;
    if (data.couponCode) {
      coupon = await resolveCoupon(r, {
        code: data.couponCode,
        tourId: tour.id,
        departureId: departure.id,
        amount: base,
      });
      discount = discountFor(base, coupon);
    }

    const subtotal = base + addonAmount - discount;
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + tax;

    // ── Reserve inventory atomically ──
    const reserved = await r.reserveSeats(departure.id, guests);
    if (!reserved)
      throw new Error(
        "Sorry, those seats were just taken. Please pick another departure or fewer guests.",
      );

    let couponReserved: { id: string } | undefined;
    if (coupon) {
      couponReserved = await r.reserveCoupon(coupon.id);
      if (!couponReserved) {
        await r.releaseSeats(departure.id, guests);
        throw new Error("This coupon has reached its usage limit");
      }
    }

    const bookingId = crypto.randomUUID();
    const bookingRef = makeBookingRef();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_MINUTES * 60_000);

    try {
      const order = await createRazorpayOrder({
        amountPaise: toPaise(total),
        receipt: bookingRef,
        bookingId,
        keyId: env.RAZORPAY_KEY_ID as string,
        keySecret: env.RAZORPAY_KEY_SECRET as string,
      });
      const userId = await getOptionalUserId();

      await r.createBooking({
        id: bookingId,
        bookingRef,
        userId,
        tourId: tour.id,
        departureId: departure.id,
        couponId: coupon?.id ?? null,
        status: "pending",
        paymentStatus: "pending",
        contactName: data.contactName,
        contactEmail: data.contactEmail.toLowerCase(),
        contactPhone: data.contactPhone,
        contactCity: data.contactCity,
        adultCount: data.adultCount,
        childCount: data.childCount,
        roomType: data.roomType,
        specialRequests: data.specialRequests,
        subtotalAmount: base,
        discountAmount: discount,
        taxAmount: tax,
        addonAmount,
        totalAmount: total,
        paidAmount: 0,
        dueAmount: total,
        source: data.source,
        internalNotes: `tier: ${data.tier}`,
        bookedAt: now,
      });

      //       await r.insertTravellers(
      //         data.travellers.map((t, i) => ({
      //           bookingId,
      //           firstName: t.firstName,
      //           lastName: t.lastName,
      //           fullName: `${t.firstName} ${t.lastName}`,
      //           age: t.age,
      //           gender: t.gender,
      //           isPrimary: t.isPrimary,
      //           roomType: i >= data.adultCount ? ("child" as const) : data.roomType,
      //         })),
      //       );
      await r.insertTravellers(
        data.travellers.map((t, i) => ({
          bookingId,
          firstName: t.firstName,
          lastName: t.lastName,
          fullName: `${t.firstName} ${t.lastName}`,
          dateOfBirth: t.dateOfBirth ? new Date(`${t.dateOfBirth}T00:00:00`) : null,
          age: ageOf(t),
          gender: t.gender,
          isPrimary: t.isPrimary,
          phone: t.phone,
          email: t.email,
          idType: t.idType,
          idNumber: maskId(t.idType, t.idNumber),
          roomType: i >= data.adultCount ? ("child" as const) : data.roomType,
          dietaryPreferences: t.dietaryPreferences,
          medicalNotes: t.medicalNotes,
        })),
      );

      if (addonLines.length) {
        await r.insertBookingAddons(
          addonLines.map((l) => ({
            bookingId,
            addonId: l.addon.id,
            title: l.addon.title,
            unitPrice: l.addon.price,
            departureStartDate: departure.startDate,
            departureEndDate: departure.endDate,
            quantity: l.quantity,
            totalPrice: l.total,
            perPerson: l.addon.perPerson,
          })),
        );
      }

      await r.insertPayment({
        bookingId,
        amount: total,
        currency: "INR",
        status: "pending",
        method: data.paymentMethod,
        provider: "razorpay",
        providerOrderId: order.id,
        paymentDueAt: expiresAt,
        expiresAt,
      });

      return {
        bookingId,
        bookingRef,
        amount: total,
        razorpay: {
          orderId: order.id,
          keyId: env.RAZORPAY_KEY_ID as string,
          amountPaise: toPaise(total),
        },
      };
    } catch (err) {
      // Roll back inventory if anything after reservation fails.
      await r.releaseSeats(departure.id, guests).catch(() => { });
      if (coupon && couponReserved) await r.releaseCoupon(coupon.id).catch(() => { });
      console.error("createBooking failed", err);
      throw err instanceof Error && err.message.startsWith("Could not")
        ? err
        : new Error("Could not create your booking. Please try again.");
    }
  });

// ─── 4. verifyPayment ─────────────────────────────────────────────────────────

const fetchRazorpayPayment = createServerOnlyFn(async (paymentId: string) => {
  const res = await fetch(`${RZP_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: "Basic " + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`),
    },
  });
  if (!res.ok) throw new Error("Could not verify payment with the gateway");
  return (await res.json()) as {
    id: string;
    order_id: string;
    amount: number;
    status: string;
    method: string;
  };
});

const mapMethod = (m: string) =>
  (["upi", "card", "netbanking", "wallet"] as const).find((x) => x === m) ?? "manual";

// Idempotent: safe to call from verifyPayment, the webhook, or both.
async function markPaid(
  r: ReturnType<typeof createTourBookingRepository>,
  args: {
    orderId: string;
    paymentId: string;
    signature: string | null;
    rzp: Awaited<ReturnType<typeof fetchRazorpayPayment>>;
  },
) {
  const payment = await r.findPaymentByOrder(args.orderId);
  if (!payment) throw new Error("Payment record not found");

  const booking = await r.findBooking(payment.bookingId);
  if (!booking) throw new Error("Booking not found");

  if (payment.status === "paid") return booking; // already processed

  if (args.rzp.order_id !== args.orderId || args.rzp.amount !== toPaise(payment.amount))
    throw new Error("Payment amount mismatch");
  if (args.rzp.status !== "captured")
    throw new Error("Payment has not been captured yet");

  const guests = booking.adultCount + booking.childCount;
  let note: string | null = null;

  // Hold expired and seats were released: try to take them back, else flag for refund.
  if (booking.status === "cancelled") {
    const ok = await r.reserveSeats(booking.departureId, guests);
    if (!ok)
      note = "REFUND NEEDED: payment captured after hold expired and seats are gone.";
    if (ok && booking.couponId) await r.reserveCoupon(booking.couponId);
  }

  const now = new Date();
  const confirm = !note;

  // Atomic claim: only one caller flips payment_status to paid.
  const claimed = await r.confirmBooking(booking.id, {
    status: confirm ? "confirmed" : "cancelled",
    paymentStatus: "paid",
    paidAmount: payment.amount,
    dueAmount: 0,
    confirmedAt: confirm ? now : null,
    cancellationReason: confirm ? null : "Payment after hold expiry",
    internalNotes: note
      ? `${booking.internalNotes ?? ""} | ${note}`
      : booking.internalNotes,
  });

  if (!claimed) return booking; // lost the race, other caller did the work

  await r.markPaymentPaid(payment.id, {
    status: "paid",
    method: mapMethod(args.rzp.method),
    providerPaymentId: args.paymentId,
    providerSignature: args.signature,
    paidAt: now,
  });

  if (confirm) await r.incrementBookingCount(booking.tourId);

  if (note)
    throw new Error(
      `Your payment was received but the seats are no longer available. Reference ${booking.bookingRef}: we will refund you.`,
    );
  return { ...booking, status: "confirmed" as const };
}

export const verifyPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      bookingId: z.string().min(1),
      razorpayOrderId: z.string().min(1),
      razorpayPaymentId: z.string().min(1),
      razorpaySignature: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const r = createTourBookingRepository(getDb(env.DB));

    const payment = await r.findPaymentForBooking(data.bookingId, data.razorpayOrderId);
    if (!payment) throw new Error("Payment not found for this booking");

    const expected = await hmacSha256(
      env.RAZORPAY_KEY_SECRET as string,
      `${data.razorpayOrderId}|${data.razorpayPaymentId}`,
    );
    if (!safeEqual(expected, data.razorpaySignature)) {
      await r.markPaymentFailed(payment.id, {
        status: "failed",
        paymentFailedAt: new Date(),
      });
      throw new Error("Payment signature verification failed");
    }

    // Cross-check amount/status with Razorpay itself (never trust the client alone).
    const rzp = await fetchRazorpayPayment(data.razorpayPaymentId);
    const booking = await markPaid(r, {
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
      signature: data.razorpaySignature,
      rzp,
    });

    return {
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      status: "confirmed" as const,
    };
  });

// ─── Webhook (backup if the user closes the tab after paying) ─────────────────
// Mount in e.g. src/routes/api/razorpay-webhook.ts:
//   server: { handlers: { POST: ({ request }) => handleRazorpayWebhook(request) } }
// Dashboard: subscribe to payment.captured and payment.failed, set RAZORPAY_WEBHOOK_SECRET.

export const handleRazorpayWebhook = createServerOnlyFn(async (request: Request) => {
  const raw = await request.text();
  const sig = request.headers.get("x-razorpay-signature") ?? "";
  const expected = await hmacSha256(env.RAZORPAY_WEBHOOK_SECRET as string, raw);
  if (!safeEqual(expected, sig)) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(raw) as {
    event: string;
    payload: { payment?: { entity: any } };
  };
  const entity = event.payload.payment?.entity;
  if (!entity) return new Response("ok");

  const r = createTourBookingRepository(getDb(env.DB));
  try {
    if (event.event === "payment.captured") {
      await markPaid(r, {
        orderId: entity.order_id,
        paymentId: entity.id,
        signature: null,
        rzp: entity,
      });
    } else if (event.event === "payment.failed") {
      const payment = await r.findPaymentByOrder(entity.order_id);
      if (payment)
        await r.markPaymentFailed(payment.id, {
          paymentFailedAt: new Date(),
          notes: entity.error_description ?? null,
        });
    }
  } catch (e) {
    console.error("webhook error", e);
    return new Response("retry", { status: 500 }); // Razorpay will retry
  }
  return new Response("ok");
});

// ─── Cron: release seats from unpaid bookings ─────────────────────────────────
// wrangler.jsonc: "triggers": { "crons": ["*/10 * * * *"] }
// In your worker's scheduled(): ctx.waitUntil(releaseExpiredBookings())

export const releaseExpiredBookings = createServerOnlyFn(async () => {
  const r = createTourBookingRepository(getDb(env.DB));
  const stale = await r.listExpiredHolds();

  for (const s of stale) {
    // Claim first so two cron runs can't double-release.
    const claimed = await r.cancelIfPending(s.bookingId);
    if (!claimed) continue;

    await r.markPaymentFailed(s.paymentId, {
      status: "failed",
      paymentFailedAt: new Date(),
    });
    await r.releaseSeats(s.departureId, s.guests);
    if (s.couponId) await r.releaseCoupon(s.couponId);
  }
  return stale.length;
});
