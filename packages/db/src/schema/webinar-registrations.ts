import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const webinarRegistrations = sqliteTable(
  "webinar_registrations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    city: text("city"),

    amount: integer("amount").notNull(), // in paise

    razorpayOrderId: text("razorpay_order_id").notNull(),
    razorpayPaymentId: text("razorpay_payment_id"),

    status: text("status")
      .notNull()
      .default("created"), // created | paid | failed

    zoomLinkSent: integer("zoom_link_sent", { mode: "boolean" })
      .notNull()
      .default(false),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  }
);