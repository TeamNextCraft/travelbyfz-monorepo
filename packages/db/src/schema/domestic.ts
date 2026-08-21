import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth";

/**
 * D1 / SQLite notes:
 * - use TEXT for ids
 * - use integer({ mode: "boolean" }) for booleans
 * - use integer({ mode: "timestamp" }) for Date fields
 * - use text({ mode: "json" }) for JSON blobs
 */

export const bookingStatuses = [
  "draft",
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "refunded",
] as const;
export const paymentStatuses = [
  "pending",
  "paid",
  "partial",
  "failed",
  "refunded",
] as const;
export const paymentMethods = [
  "upi",
  "card",
  "net_banking",
  "cash",
  "wallet",
  "manual",
] as const;
export const departureStatuses = [
  "scheduled",
  "full",
  "closed",
  "cancelled",
  "completed",
] as const;
export const enquiryStatuses = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
  "spam",
] as const;
export const couponTypes = ["percentage", "flat"] as const;
export const couponScopes = ["all", "tour", "departure"] as const;
export const roomTypes = ["single", "double", "triple", "quad", "child"] as const;
export const travellerGenders = ["male", "female", "other"] as const;
export const reviewStatuses = ["pending", "approved", "rejected"] as const;

// -----------------------------------------------------------------------------
// destinations
// -----------------------------------------------------------------------------

export const destinations = sqliteTable(
  "destinations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    name: text("name").notNull(),
    slug: text("slug").notNull(),

    country: text("country").notNull().default("India"),
    state: text("state").notNull(),
    city: text("city"),

    shortDescription: text("short_description"),
    description: text("description"),

    coverImage: text("cover_image"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>(),

    bestTimeToVisit: text("best_time_to_visit"),
    popularFor: text("popular_for", { mode: "json" }).$type<string[]>(),

    latitude: real("latitude"),
    longitude: real("longitude"),

    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
     uniqueIndex("destinations_slug_unique").on(table.slug),
     index("destinations_state_idx").on(table.state),
     index("destinations_featured_idx").on(table.isFeatured),
    index("destinations_active_idx").on(table.isActive),
  ]
);

// -----------------------------------------------------------------------------
// tours
// -----------------------------------------------------------------------------

export const tours = sqliteTable(
  "tours",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    destinationId: text("destination_id").references(() => destinations.id, {
      onDelete: "set null",
    }),

    title: text("title").notNull(),
    slug: text("slug").notNull(),
    code: text("code").notNull(),

    category: text("category").notNull(), // adventure, family, honeymoon, pilgrimage
    type: text("type").notNull(), // group, private, custom

    shortDescription: text("short_description"),
    description: text("description").notNull(),

    durationDays: integer("duration_days").notNull(),
    durationNights: integer("duration_nights").notNull(),

    startLocation: text("start_location").notNull(),
    endLocation: text("end_location").notNull(),

    basePrice: integer("base_price").notNull(), // store paise? for D1 simplest is integer rupees or paise
    compareAtPrice: integer("compare_at_price"),

    currency: text("currency").notNull().default("INR"),

    minAge: integer("min_age"),
    maxAge: integer("max_age"),
    maxGroupSize: integer("max_group_size"),
    minGroupSize: integer("min_group_size").default(1),

    difficulty: text("difficulty"), // easy/moderate/hard
    transportIncluded: integer("transport_included", { mode: "boolean" })
      .notNull()
      .default(true),
    mealsIncluded: text("meals_included", { mode: "json" }).$type<string[]>(),

    inclusions: text("inclusions", { mode: "json" }).$type<string[]>().notNull(),
    exclusions: text("exclusions", { mode: "json" }).$type<string[]>().notNull(),
    highlights: text("highlights", { mode: "json" }).$type<string[]>().notNull(),

    itinerary: text("itinerary", { mode: "json" }).$type<
      Array<{
        day: number;
        title: string;
        description: string;
        hotel?: string;
        meals?: string[];
      }>
    >(),

    cancellationPolicySummary: text("cancellation_policy_summary"),
    termsSummary: text("terms_summary"),

    featuredImage: text("featured_image"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>(),

    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    avgRating: real("avg_rating").default(0),
    reviewCount: integer("review_count").notNull().default(0),
    bookingCount: integer("booking_count").notNull().default(0),

    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" })
      .notNull()
      .default(true),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
     uniqueIndex("tours_slug_unique").on(table.slug),
     uniqueIndex("tours_code_unique").on(table.code),
     index("tours_destination_idx").on(table.destinationId),
     index("tours_category_idx").on(table.category),
     index("tours_featured_idx").on(table.isFeatured),
     index("tours_published_idx").on(table.isPublished),
     index("tours_active_idx").on(table.isActive),
  ] 
);

// -----------------------------------------------------------------------------
// departures / batches
// -----------------------------------------------------------------------------

export const departures = sqliteTable(
  "departures",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),

    code: text("code").notNull(),

    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }).notNull(),

    price: integer("price").notNull(),
    discountedPrice: integer("discounted_price"),

    totalSeats: integer("total_seats").notNull(),
    availableSeats: integer("available_seats").notNull(),

    status: text("status", { enum: departureStatuses })
      .notNull()
      .default("scheduled"),

    bookingDeadline: integer("booking_deadline", { mode: "timestamp" }),
    notes: text("notes"),

    isGuaranteed: integer("is_guaranteed", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
     uniqueIndex("departures_code_unique").on(table.code),
     index("departures_tour_idx").on(table.tourId),
     index("departures_start_date_idx").on(table.startDate),
     index("departures_status_idx").on(table.status),
     index("departures_active_idx").on(table.isActive),
  ]
);

// -----------------------------------------------------------------------------
// tour pricing by room type / pax config
// -----------------------------------------------------------------------------

export const departurePricing = sqliteTable(
  "departure_pricing",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    departureId: text("departure_id")
      .notNull()
      .references(() => departures.id, { onDelete: "cascade" }),

    roomType: text("room_type", { enum: roomTypes }).notNull(),
    price: integer("price").notNull(),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
   uniqueIndex("departure_pricing_unique").on(
      table.departureId,
      table.roomType
    ),
  ] 
);

// -----------------------------------------------------------------------------
// add-ons
// -----------------------------------------------------------------------------

export const addons = sqliteTable(
  "addons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),

    price: integer("price").notNull(),
    perPerson: integer("per_person", { mode: "boolean" }).notNull().default(true),

    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
   uniqueIndex("addons_slug_unique").on(table.slug),
   index("addons_active_idx").on(table.isActive),
  ] 
);

// -----------------------------------------------------------------------------
// mapping tours <-> addons
// -----------------------------------------------------------------------------

export const tourAddons = sqliteTable(
  "tour_addons",
  {
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    addonId: text("addon_id")
      .notNull()
      .references(() => addons.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [ 
   primaryKey({ columns: [table.tourId, table.addonId] }),
  ] 
);

// -----------------------------------------------------------------------------
// coupons
// -----------------------------------------------------------------------------

export const coupons = sqliteTable(
  "coupons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    code: text("code").notNull(),
    title: text("title"),
    description: text("description"),

    type: text("type", { enum: couponTypes }).notNull(),
    scope: text("scope", { enum: couponScopes }).notNull().default("all"),

    value: integer("value").notNull(), // % or flat amount
    minBookingAmount: integer("min_booking_amount"),
    maxDiscountAmount: integer("max_discount_amount"),

    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").notNull().default(0),

    startsAt: integer("starts_at", { mode: "timestamp" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }),

    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
   uniqueIndex("coupons_code_unique").on(table.code),
   index("coupons_active_idx").on(table.isActive),
   index("coupons_expires_idx").on(table.expiresAt),
  ] 
);

// optional coupon scoping
export const couponTargets = sqliteTable(
  "coupon_targets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    couponId: text("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    tourId: text("tour_id").references(() => tours.id, { onDelete: "cascade" }),
    departureId: text("departure_id").references(() => departures.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [ 
   index("coupon_targets_coupon_idx").on(table.couponId),
  ] 
);

// -----------------------------------------------------------------------------
// bookings
// -----------------------------------------------------------------------------

export const bookings = sqliteTable(
  "bookings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingRef: text("booking_ref").notNull(),

    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "restrict" }),
    departureId: text("departure_id")
      .notNull()
      .references(() => departures.id, { onDelete: "restrict" }),

    couponId: text("coupon_id").references(() => coupons.id, { onDelete: "set null" }),

    status: text("status", { enum: bookingStatuses }).notNull().default("pending"),
    paymentStatus: text("payment_status", { enum: paymentStatuses })
      .notNull()
      .default("pending"),

    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: text("contact_phone").notNull(),
    contactCity: text("contact_city"),

    guestCount: integer("guest_count").notNull(),
    adultCount: integer("adult_count").notNull().default(1),
    childCount: integer("child_count").notNull().default(0),

    roomType: text("room_type", { enum: roomTypes }),
    specialRequests: text("special_requests"),

    subtotalAmount: integer("subtotal_amount").notNull(),
    discountAmount: integer("discount_amount").notNull().default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    addonAmount: integer("addon_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),
    paidAmount: integer("paid_amount").notNull().default(0),
    dueAmount: integer("due_amount").notNull().default(0),

    bookedAt: integer("booked_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
    cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
    completedAt: integer("completed_at", { mode: "timestamp" }),

    cancellationReason: text("cancellation_reason"),
    source: text("source").notNull().default("website"), // website, admin, phone, whatsapp

    internalNotes: text("internal_notes"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
   uniqueIndex("bookings_ref_unique").on(table.bookingRef),
   index("bookings_user_idx").on(table.userId),
   index("bookings_tour_idx").on(table.tourId),
   index("bookings_departure_idx").on(table.departureId),
   index("bookings_status_idx").on(table.status),
   index("bookings_payment_status_idx").on(table.paymentStatus),
   index("bookings_booked_at_idx").on(table.bookedAt),
   index("bookings_email_idx").on(table.contactEmail),
  ] 
);

// -----------------------------------------------------------------------------
// travellers per booking
// -----------------------------------------------------------------------------

export const bookingTravellers = sqliteTable(
  "booking_travellers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),

    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    fullName: text("full_name"),

    dateOfBirth: integer("date_of_birth", { mode: "timestamp" }),
    age: integer("age"),
    gender: text("gender", { enum: travellerGenders }),

    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),

    phone: text("phone"),
    email: text("email"),

    idType: text("id_type"), // aadhaar, pan, passport, dl
    idNumber: text("id_number"),

    roomType: text("room_type", { enum: roomTypes }),
    dietaryPreferences: text("dietary_preferences", { mode: "json" }).$type<string[]>(),
    medicalNotes: text("medical_notes"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("booking_travellers_booking_idx").on(table.bookingId),
    index("booking_travellers_primary_idx").on(
      table.bookingId,
      table.isPrimary
    ),
  ] 
);

// -----------------------------------------------------------------------------
// booking addons snapshot
// -----------------------------------------------------------------------------

export const bookingAddons = sqliteTable(
  "booking_addons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),

    addonId: text("addon_id").references(() => addons.id, { onDelete: "set null" }),

    title: text("title").notNull(), // snapshot
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull().default(1),
    totalPrice: integer("total_price").notNull(),
    perPerson: integer("per_person", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [
    index("booking_addons_booking_idx").on(table.bookingId),
  ]
);

// -----------------------------------------------------------------------------
// payments
// -----------------------------------------------------------------------------

export const payments = sqliteTable(
  "payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),

    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("INR"),

    status: text("status", { enum: paymentStatuses }).notNull().default("pending"),
    method: text("method", { enum: paymentMethods }),

    provider: text("provider"), // razorpay, cashfree, manual
    providerOrderId: text("provider_order_id"),
    providerPaymentId: text("provider_payment_id"),
    providerSignature: text("provider_signature"),

    paidAt: integer("paid_at", { mode: "timestamp" }),
    notes: text("notes"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [ 
    index("payments_booking_idx").on(table.bookingId),
    index("payments_status_idx").on(table.status),
    index("payments_provider_payment_idx").on(
      table.providerPaymentId
    ),
  ]
);

// -----------------------------------------------------------------------------
// refunds
// -----------------------------------------------------------------------------

export const refunds = sqliteTable(
  "refunds",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),

    paymentId: text("payment_id").references(() => payments.id, {
      onDelete: "set null",
    }),

    amount: integer("amount").notNull(),
    reason: text("reason"),
    status: text("status").notNull().default("pending"), // pending, processed, failed

    processedAt: integer("processed_at", { mode: "timestamp" }),
    providerRefundId: text("provider_refund_id"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    refundsBookingIdx: index("refunds_booking_idx").on(table.bookingId),
    refundsPaymentIdx: index("refunds_payment_idx").on(table.paymentId),
  })
);

// -----------------------------------------------------------------------------
// reviews
// -----------------------------------------------------------------------------

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),

    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment"),

    status: text("status", { enum: reviewStatuses }).notNull().default("pending"),
    isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),

    submittedAt: integer("submitted_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    approvedAt: integer("approved_at", { mode: "timestamp" }),
  },
  (table) => [
    index("reviews_tour_idx").on(table.tourId),
    index("reviews_user_idx").on(table.userId),
    index("reviews_status_idx").on(table.status),
    index("reviews_featured_idx").on(table.isFeatured),
  ]
);

// -----------------------------------------------------------------------------
// enquiries / leads
// -----------------------------------------------------------------------------

export const enquiries = sqliteTable(
  "enquiries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    tourId: text("tour_id").references(() => tours.id, { onDelete: "set null" }),
    departureId: text("departure_id").references(() => departures.id, {
      onDelete: "set null",
    }),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    city: text("city"),

    subject: text("subject"),
    message: text("message").notNull(),

    travelMonth: text("travel_month"),
    groupSize: integer("group_size"),
    budgetMin: integer("budget_min"),
    budgetMax: integer("budget_max"),

    status: text("status", { enum: enquiryStatuses }).notNull().default("new"),
    assignedTo: text("assigned_to").references(() => user.id, {
      onDelete: "set null",
    }),

    source: text("source").notNull().default("website"),
    notes: text("notes"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("enquiries_tour_idx").on(table.tourId),
    index("enquiries_status_idx").on(table.status),
    index("enquiries_email_idx").on(table.email),
    index("enquiries_created_at_idx").on(table.createdAt),
  ]
);

// -----------------------------------------------------------------------------
// blog / content (optional but useful for SEO)
// -----------------------------------------------------------------------------

export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),

    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),

    coverImage: text("cover_image"),
    tags: text("tags", { mode: "json" }).$type<string[]>(),

    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    publishedAt: integer("published_at", { mode: "timestamp" }),

    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("blog_posts_slug_unique").on(table.slug),
    index("blog_posts_published_idx").on(table.isPublished),
  ]
);

// -----------------------------------------------------------------------------
// app settings
// -----------------------------------------------------------------------------

export const appSettings = sqliteTable(
  "app_settings",
  {
    key: text("key").primaryKey(),
    value: text("value", { mode: "json" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  }
);

// -----------------------------------------------------------------------------
// exports
// -----------------------------------------------------------------------------

export type Destination = typeof destinations.$inferSelect;
export type Tour = typeof tours.$inferSelect;
export type Departure = typeof departures.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type BookingTraveller = typeof bookingTravellers.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;