import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@repo/db/client";
import { bookingAddons, bookings, bookingTravellers, coupons, departurePricing, departures, tours, payments, couponTargets, addons } from "@repo/db/schema/domestic.js";

const GST_RATE = 0.05;
const CHILD_MAX_AGE = 11;
const HOLD_MINUTES = 15; // how long seats are held while the user pays
const RZP_API = "https://api.razorpay.com/v1";

type Db = ReturnType<typeof getDb>;

// TODO: wire to Better Auth, e.g. (await auth.api.getSession({ headers }))?.user.id
async function getOptionalUserId(): Promise<string | null> {
  return null;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const ROOM_TYPES = ["single", "double", "triple", "quad", "child"] as const;
type RoomType = (typeof ROOM_TYPES)[number];

const normCode = (c: string) => c.trim().toUpperCase();
const toPaise = (rupees: number) => Math.round(rupees * 100);

function makeBookingRef() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return "FZ" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function discountFor(
  base: number,
  c: { type: "percentage" | "flat"; value: number; maxDiscountAmount: number | null }
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

// ─── Coupon resolution (used by validateCoupon AND createBooking) ─────────────

async function resolveCoupon(
  db: Db,
  input: { code: string; tourId: string; departureId: string; amount: number }
) {
  const code = normCode(input.code);
  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.code, code) });
  const now = Date.now();

  if (!coupon || !coupon.isActive) throw new Error("Invalid coupon code");
  if (coupon.startsAt && +coupon.startsAt > now) throw new Error("This coupon is not active yet");
  if (coupon.expiresAt && +coupon.expiresAt < now) throw new Error("This coupon has expired");
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
    throw new Error("This coupon has reached its usage limit");
  if (coupon.minBookingAmount && input.amount < coupon.minBookingAmount)
    throw new Error(`Minimum booking amount for this coupon is ₹${coupon.minBookingAmount.toLocaleString("en-IN")}`);

  if (coupon.scope !== "all") {
    const targets = await db.select().from(couponTargets).where(eq(couponTargets.couponId, coupon.id));
    const ok =
      coupon.scope === "tour"
        ? targets.some((t) => t.tourId === input.tourId)
        : targets.some((t) => t.departureId === input.departureId);
    if (!ok) throw new Error("This coupon is not valid for the selected tour");
  }
  return coupon;
}

const couponInput = z.object({
  code: z.string().trim().min(1).max(40),
  tourId: z.string().min(1),
  departureId: z.string().min(1),
  amount: z.number().int().nonnegative(),
});

// ─── 1. getTourDepartures ─────────────────────────────────────────────────────

export const getTourDepartures = createServerFn({ method: "GET" })
  .validator(z.object({ tourId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getDb(env.DB);
    const rows = await db
      .select()
      .from(departures)
      .where(
        and(
          eq(departures.tourId, data.tourId),
          eq(departures.isActive, true),
          inArray(departures.status, ["scheduled", "full"]),
          gt(departures.startDate, new Date())
        )
      )
      .orderBy(departures.startDate);

    if (rows.length === 0) return [];

    const prices = await db
      .select()
      .from(departurePricing)
      .where(inArray(departurePricing.departureId, rows.map((r) => r.id)));

    return rows.map((d) => ({
      id: d.id,
      code: d.code,
      startDate: d.startDate,
      endDate: d.endDate,
      price: d.price,
      discountedPrice: d.discountedPrice,
      totalSeats: d.totalSeats,
      availableSeats: d.availableSeats,
      status: d.status,
      bookingDeadline: d.bookingDeadline,
      isGuaranteed: d.isGuaranteed,
      notes: d.notes,
      pricing: prices
        .filter((p) => p.departureId === d.id)
        .map((p) => ({ roomType: p.roomType, price: p.price })),
    }));
  });

// ─── 2. validateCoupon ────────────────────────────────────────────────────────

export const validateCoupon = createServerFn({ method: "POST" })
  .validator(couponInput)
  .handler(async ({ data }) => {
    const c = await resolveCoupon(getDb(env.DB), data);
    return {
      id: c.id,
      code: c.code,
      title: c.title,
      type: c.type,
      value: c.value,
      maxDiscountAmount: c.maxDiscountAmount,
    };
  });

// ─── 3. createBooking ─────────────────────────────────────────────────────────

const createBookingInput = z.object({
  tourId: z.string().min(1),
  departureId: z.string().min(1),
  tier: z.string().min(1),
  roomType: z.enum(ROOM_TYPES).nullable(),
  adultCount: z.number().int().min(1).max(20),
  childCount: z.number().int().min(0).max(20),
  travellers: z
    .array(
      z.object({
        firstName: z.string().trim().min(1).max(60),
        lastName: z.string().trim().min(1).max(60),
        age: z.number().int().min(1).max(120),
        gender: z.enum(["male", "female", "other"]),
        isPrimary: z.boolean(),
      })
    )
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

async function createRazorpayOrder(args: { amountPaise: number; receipt: string; bookingId: string }) {
  const res = await fetch(`${RZP_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`),
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

async function reserveSeats(db: Db, departureId: string, n: number) {
  const rows = await db
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
        sql`${departures.availableSeats} >= ${n}`
      )
    )
    .returning({ id: departures.id });
  return rows.length > 0;
}

async function releaseSeats(db: Db, departureId: string, n: number) {
  await db
    .update(departures)
    .set({
      availableSeats: sql`MIN(${departures.availableSeats} + ${n}, ${departures.totalSeats})`,
      status: sql`CASE WHEN ${departures.status} = 'full' THEN 'scheduled' ELSE ${departures.status} END`,
      updatedAt: new Date(),
    })
    .where(eq(departures.id, departureId));
}

async function reserveCoupon(db: Db, couponId: string) {
  const rows = await db
    .update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1` })
    .where(
      and(
        eq(coupons.id, couponId),
        or(isNull(coupons.usageLimit), sql`${coupons.usedCount} < ${coupons.usageLimit}`)
      )
    )
    .returning({ id: coupons.id });
  return rows.length > 0;
}

async function releaseCoupon(db: Db, couponId: string) {
  await db
    .update(coupons)
    .set({ usedCount: sql`MAX(${coupons.usedCount} - 1, 0)` })
    .where(eq(coupons.id, couponId));
}

export const createBooking = createServerFn({ method: "POST" })
  .validator(createBookingInput)
  .handler(async ({ data }) => {
    const db = getDb(env.DB);
    const guests = data.adultCount + data.childCount;

    // ── Load & validate ──
    const tour = await db.query.tours.findFirst({
      where: and(eq(tours.id, data.tourId), eq(tours.isPublished, true), eq(tours.isActive, true)),
    });
    if (!tour) throw new Error("This tour is no longer available");

    const departure = await db.query.departures.findFirst({
      where: and(eq(departures.id, data.departureId), eq(departures.tourId, tour.id)),
    });
    if (!departure || !bookable(departure)) throw new Error("This departure is no longer available");

    if (!tour.pricingTiers?.some((t) => t.label === data.tier)) throw new Error("Invalid package tier");
    if (data.travellers.length !== guests) throw new Error("Traveller details do not match the guest count");
    if (data.travellers.filter((t) => t.isPrimary).length !== 1) throw new Error("Exactly one primary traveller is required");
    if (guests < tour.minGroupSize) throw new Error(`Minimum group size is ${tour.minGroupSize}`);
    if (tour.maxGroupSize && guests > tour.maxGroupSize) throw new Error(`Maximum group size is ${tour.maxGroupSize}`);
    if (guests > departure.availableSeats) throw new Error(`Only ${departure.availableSeats} seats left on this departure`);

    // First `adultCount` travellers are adults, the rest are children (same order as the UI).
    data.travellers.forEach((t, i) => {
      const isChild = i >= data.adultCount;
      if (t.age < tour.minAge || t.age > tour.maxAge)
        throw new Error(`Traveller ${i + 1}: age must be between ${tour.minAge} and ${tour.maxAge}`);
      if (isChild !== t.age <= CHILD_MAX_AGE)
        throw new Error(`Traveller ${i + 1}: age does not match the adult/child count`);
    });

    // ── Pricing (rupees, integers) ──
    const priceRows = await db.select().from(departurePricing).where(eq(departurePricing.departureId, departure.id));
    const roomPrice = (r: RoomType) => priceRows.find((p) => p.roomType === r)?.price;

    const hasRooms = priceRows.some((p) => p.roomType !== "child");
    if (hasRooms && (!data.roomType || data.roomType === "child" || roomPrice(data.roomType) == null))
      throw new Error("Please select a valid room type");

    const adultUnit = (data.roomType && roomPrice(data.roomType)) || departure.discountedPrice || departure.price;
    const childUnit = roomPrice("child") ?? adultUnit;
    const base = adultUnit * data.adultCount + childUnit * data.childCount;

    let addonRows: (typeof addons.$inferSelect)[] = [];
    if (data.addonIds.length) {
      const ids = [...new Set(data.addonIds)];
      addonRows = await db.select().from(addons).where(and(inArray(addons.id, ids), eq(addons.isActive, true)));
      if (addonRows.length !== ids.length) throw new Error("One of the selected add-ons is unavailable");
    }
    const addonLines = addonRows.map((a) => {
      const quantity = a.perPerson ? guests : 1;
      return { addon: a, quantity, total: a.price * quantity };
    });
    const addonAmount = addonLines.reduce((s, l) => s + l.total, 0);

    let coupon: typeof coupons.$inferSelect | null = null;
    let discount = 0;
    if (data.couponCode) {
      coupon = await resolveCoupon(db, {
        code: data.couponCode, tourId: tour.id, departureId: departure.id, amount: base,
      });
      discount = discountFor(base, coupon);
    }

    const subtotal = base + addonAmount - discount;
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + tax;

    // ── Reserve inventory atomically ──
    if (!(await reserveSeats(db, departure.id, guests)))
      throw new Error("Sorry, those seats were just taken. Please pick another departure or fewer guests.");

    let couponReserved = false;
    if (coupon) {
      couponReserved = await reserveCoupon(db, coupon.id);
      if (!couponReserved) {
        await releaseSeats(db, departure.id, guests);
        throw new Error("This coupon has reached its usage limit");
      }
    }

    const bookingId = crypto.randomUUID();
    const bookingRef = makeBookingRef();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_MINUTES * 60_000);

    try {
      const order = await createRazorpayOrder({ amountPaise: toPaise(total), receipt: bookingRef, bookingId });
      const userId = await getOptionalUserId();

      await db.batch([
        db.insert(bookings).values({
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
        }),
        db.insert(bookingTravellers).values(
          data.travellers.map((t, i) => ({
            bookingId,
            firstName: t.firstName,
            lastName: t.lastName,
            fullName: `${t.firstName} ${t.lastName}`,
            age: t.age,
            gender: t.gender,
            isPrimary: t.isPrimary,
            roomType: i >= data.adultCount ? ("child" as const) : data.roomType,
          }))
        ),
        ...(addonLines.length
          ? [
            db.insert(bookingAddons).values(
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
              }))
            ),
          ]
          : []),
        db.insert(payments).values({
          bookingId,
          amount: total,
          currency: "INR",
          status: "pending",
          method: data.paymentMethod,
          provider: "razorpay",
          providerOrderId: order.id,
          paymentDueAt: expiresAt,
          expiresAt,
        }),
      ] as any);

      return {
        bookingId,
        bookingRef,
        amount: total,
        razorpay: { orderId: order.id, keyId: env.RAZORPAY_KEY_ID as string, amountPaise: toPaise(total) },
      };
    } catch (err) {
      // Roll back inventory if anything after reservation fails.
      await releaseSeats(db, departure.id, guests).catch(() => { });
      if (coupon && couponReserved) await releaseCoupon(db, coupon.id).catch(() => { });
      console.error("createBooking failed", err);
      throw err instanceof Error && err.message.startsWith("Could not")
        ? err
        : new Error("Could not create your booking. Please try again.");
    }
  });

// ─── 4. verifyPayment ─────────────────────────────────────────────────────────

const enc = new TextEncoder();
const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function fetchRazorpayPayment(paymentId: string) {
  const res = await fetch(`${RZP_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: "Basic " + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`) },
  });
  if (!res.ok) throw new Error("Could not verify payment with the gateway");
  return (await res.json()) as {
    id: string; order_id: string; amount: number; status: string; method: string;
  };
}

const mapMethod = (m: string) =>
  (["upi", "card", "netbanking", "wallet"] as const).find((x) => x === m) ?? "manual";

// Idempotent: safe to call from verifyPayment, the webhook, or both.
async function markPaid(
  db: Db,
  args: { orderId: string; paymentId: string; signature: string | null; rzp: Awaited<ReturnType<typeof fetchRazorpayPayment>> }
) {
  const payment = await db.query.payments.findFirst({ where: eq(payments.providerOrderId, args.orderId) });
  if (!payment) throw new Error("Payment record not found");

  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, payment.bookingId) });
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
    const ok = await reserveSeats(db, booking.departureId, guests);
    if (!ok) note = "REFUND NEEDED: payment captured after hold expired and seats are gone.";
    if (ok && booking.couponId) await reserveCoupon(db, booking.couponId);
  }

  const now = new Date();
  const confirm = !note;

  // Atomic claim: only one caller flips payment_status to paid.
  const claimed = await db
    .update(bookings)
    .set({
      status: confirm ? "confirmed" : "cancelled",
      paymentStatus: "paid",
      paidAmount: payment.amount,
      dueAmount: 0,
      confirmedAt: confirm ? now : null,
      cancellationReason: confirm ? null : "Payment after hold expiry",
      internalNotes: note ? `${booking.internalNotes ?? ""} | ${note}` : booking.internalNotes,
      updatedAt: now,
    })
    .where(and(eq(bookings.id, booking.id), sql`${bookings.paymentStatus} != 'paid'`))
    .returning({ id: bookings.id });

  if (claimed.length === 0) return booking; // lost the race, other caller did the work

  await db.batch([
    db
      .update(payments)
      .set({
        status: "paid",
        method: mapMethod(args.rzp.method),
        providerPaymentId: args.paymentId,
        providerSignature: args.signature,
        paidAt: now,
        updatedAt: now,
      })
      .where(eq(payments.id, payment.id)),
    db
      .update(tours)
      .set({ bookingCount: sql`${tours.bookingCount} + ${confirm ? 1 : 0}` })
      .where(eq(tours.id, booking.tourId)),
  ] as any);

  if (note) throw new Error(`Your payment was received but the seats are no longer available. Reference ${booking.bookingRef}: we will refund you.`);
  return { ...booking, status: "confirmed" as const };
}

export const verifyPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      bookingId: z.string().min(1),
      razorpayOrderId: z.string().min(1),
      razorpayPaymentId: z.string().min(1),
      razorpaySignature: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const db = getDb(env.DB);

    const payment = await db.query.payments.findFirst({
      where: and(eq(payments.bookingId, data.bookingId), eq(payments.providerOrderId, data.razorpayOrderId)),
    });
    if (!payment) throw new Error("Payment not found for this booking");

    const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET as string, `${data.razorpayOrderId}|${data.razorpayPaymentId}`);
    if (!safeEqual(expected, data.razorpaySignature)) {
      await db.update(payments).set({ status: "failed", paymentFailedAt: new Date() })
        .where(and(eq(payments.id, payment.id), eq(payments.status, "pending")));
      throw new Error("Payment signature verification failed");
    }

    // Cross-check amount/status with Razorpay itself (never trust the client alone).
    const rzp = await fetchRazorpayPayment(data.razorpayPaymentId);
    const booking = await markPaid(db, {
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
      signature: data.razorpaySignature,
      rzp,
    });

    return { bookingId: booking.id, bookingRef: booking.bookingRef, status: "confirmed" as const };
  });

// ─── Webhook (backup if the user closes the tab after paying) ─────────────────
// Mount in e.g. src/routes/api/razorpay-webhook.ts:
//   server: { handlers: { POST: ({ request }) => handleRazorpayWebhook(request) } }
// Dashboard: subscribe to payment.captured and payment.failed, set RAZORPAY_WEBHOOK_SECRET.

export async function handleRazorpayWebhook(request: Request) {
  const raw = await request.text();
  const sig = request.headers.get("x-razorpay-signature") ?? "";
  const expected = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET as string, raw);
  if (!safeEqual(expected, sig)) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(raw) as { event: string; payload: { payment?: { entity: any } } };
  const entity = event.payload.payment?.entity;
  if (!entity) return new Response("ok");
  const db = getDb(env.DB);

  try {
    if (event.event === "payment.captured") {
      await markPaid(db, { orderId: entity.order_id, paymentId: entity.id, signature: null, rzp: entity });
    } else if (event.event === "payment.failed") {
      await db.update(payments)
        .set({ paymentFailedAt: new Date(), notes: entity.error_description ?? null })
        .where(and(eq(payments.providerOrderId, entity.order_id), eq(payments.status, "pending")));
    }
  } catch (e) {
    console.error("webhook error", e);
    return new Response("retry", { status: 500 }); // Razorpay will retry
  }
  return new Response("ok");
}

// ─── Cron: release seats from unpaid bookings ─────────────────────────────────
// wrangler.jsonc: "triggers": { "crons": ["*/10 * * * *"] }
// In your worker's scheduled(): ctx.waitUntil(releaseExpiredBookings())

export async function releaseExpiredBookings() {
  const db = getDb(env.DB);
  const stale = await db
    .select({
      paymentId: payments.id, bookingId: bookings.id, departureId: bookings.departureId,
      couponId: bookings.couponId, guests: sql<number>`${bookings.adultCount} + ${bookings.childCount}`
    })
    .from(payments)
    .innerJoin(bookings, eq(bookings.id, payments.bookingId))
    .where(and(eq(payments.status, "pending"), eq(bookings.status, "pending"), lt(payments.expiresAt, new Date())));

  for (const s of stale) {
    // Claim first so two cron runs can't double-release.
    const claimed = await db.update(bookings)
      .set({ status: "cancelled", cancelledAt: new Date(), cancellationReason: "Payment not completed in time" })
      .where(and(eq(bookings.id, s.bookingId), eq(bookings.status, "pending")))
      .returning({ id: bookings.id });
    if (!claimed.length) continue;

    await db.update(payments).set({ status: "failed", paymentFailedAt: new Date() }).where(eq(payments.id, s.paymentId));
    await releaseSeats(db, s.departureId, s.guests);
    if (s.couponId) await releaseCoupon(db, s.couponId);
  }
  return stale.length;
}


// import { db } from "#/lib/db-config";
// import { bookings, payments } from "@repo/db/schema/domestic.js";
// import { createServerFn } from "@tanstack/react-start";
// import { env } from "cloudflare:workers";
// import { z } from "zod";
// 
// export const createBooking = createServerFn({ method: "POST" })
//   .validator(z.object({
//     tourId: z.string(),
//     departureId: z.string(),
//     amount: z.number().min(100),
//     paymentMethod: z.enum(["upi", "netbanking", "card"]),
//     addons: z.array(z.object({
//       id: z.string(),
//       label: z.string(),
//       description: z.string(),
//       price: z.number(),
//       perPerson: z.boolean()
//     })).optional(),
//     contactName: z.string(),
//     contactEmail: z.email(),
//     contactPhone: z.number(),
//     contactCity: z.string(),
//     guestCount: z.number(),
//     adultCount: z.number(),
//     childCount: z.number(),
// 
//     roomType: z.string(),
//     specialRequests: z.string(),
//     subtotalAmount: z.number(),
//     discountAmount: z.number(),
//     taxAmount: z.number(),
//     totalAmount: z.number(),
//     paidAmount: z.number(),
//     dueAmount: z.string(),
//   }))
//   .handler(async ({ data }) => {
//     console.log({
//       input_data: data,
//     })
//     try {
//       if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
//         throw new Error("Razorpay credentials are not configured");
//       }
// 
//       const amountPaise = Math.round(data.amount * 100);
// 
//       const bookingRef = `FZ-${crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`
// 
//       const [booking] = await db
//         .insert(bookings)
//         .values({
//           bookingRef,
//           tourId: data.tourId,
//           departureId: data.departureId,
// 
//           status: "pending",
//           paymentStatus: "pending",
// 
//           contactName: data.contactName,
//           contactEmail: data.contactEmail,
//           contactPhone: data.contactPhone,
//           contactCity: data.contactCity,
// 
//           guestCount: data.guestCount,
//           adultCount: data.adultCount,
//           childCount: data.childCount,
// 
//           roomType: data.roomType,
//           specialRequests: data.specialRequests,
// 
//           subtotalAmount: amountPaise,
//           discountAmount: 0,
//           taxAmount: 0,
//           addonAmount: 0,
//           totalAmount: amountPaise,
//           paidAmount: 0,
//           dueAmount: amountPaise,
// 
//           source: "website"
//         })
//         .returning();
// 
//       if (!booking) {
//         throw new Error("Could not create local booking");
//       }
// 
//       const bookingId = booking.id;
// 
//       const [payment] = await db
//         .insert(payments)
//         .values({
//           bookingId: bookingId,
//           amount: amountPaise,
//           currency: "INR",
//           status: "pending",
//           method: data.paymentMethod,
//           provider: "razorpay"
//         })
//         .returning();
// 
//       if (!payment) {
//         throw new Error("Could not create local payment");
//       }
// 
//       const razorpayResponse = await fetch(
//         "https://api.razorpay.com/v1/orders",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization:
//               "Basic " +
//               btoa(
//                 `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
//               ),
//           },
//           body: JSON.stringify({
//             amount: amountPaise,
//             currency: "INR",
//             receipt: bookingRef,
//             notes: {
//               type: "tour_booking",
//               bookingId: booking.id,
//               paymentId: payment.id,
//             },
//           }),
//         },
//       );
//       const responseText = await razorpayResponse.text();
// 
//       if (!razorpayResponse.ok) {
//         console.error("Razorpay order creation failed", {
//           status: razorpayResponse.status,
//           body: responseText,
//           bookingId: booking.id,
//           paymentId: payment.id,
//         });
// 
//         throw new Error(
//           `Razorpay order creation failed: ${responseText}`,
//         );
//       }
// 
//       const razorpayOrder = JSON.parse(responseText) as RazorpayOrder;
// 
//       if (!razorpayOrder.id) {
//         throw new Error("Razorpay did not return an order ID");
//       }
// 
//       /*
//        * Link the Razorpay order to your local payment.
//        * The webhook uses this field to find the booking.
//        */
//       await db
//         .update(payments)
//         .set({
//           providerOrderId: razorpayOrder.id,
//           updatedAt: new Date(),
//         })
//         .where(eq(payments.id, payment.id));
// 
//       return {
//         bookingId: booking.id,
//         paymentId: payment.id,
//         bookingRef: booking.bookingRef,
// 
//         orderId: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         keyId: env.RAZORPAY_KEY_ID,
//       };
//     } catch (error) {
//       console.error("Failed to book tour", {
//         error,
//         message: error instanceof Error ? error.message : String(error),
//         bookingId,
//         paymentId,
//       });
// 
//       /*
//        * Do not blindly delete records if Razorpay might already have
//        * created an order. Mark them failed or abandoned instead.
//        *
//        * Add cleanup/status updates here if your schema supports them.
//        */
// 
//       throw new Error(
//         error instanceof Error
//           ? error.message
//           : "Failed to book tour",
//       );
//     }
//   });
