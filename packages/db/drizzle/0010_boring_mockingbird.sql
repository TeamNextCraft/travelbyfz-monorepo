PRAGMA defer_foreign_keys = on;--> statement-breakpoint

CREATE TABLE `__new_bookings` (
  `id` text PRIMARY KEY NOT NULL,
  `booking_ref` text NOT NULL,
  `user_id` text,
  `tour_id` text NOT NULL,
  `departure_id` text NOT NULL,
  `coupon_id` text,
  `status` text DEFAULT 'pending' NOT NULL,
  `payment_status` text DEFAULT 'pending' NOT NULL,
  `contact_name` text NOT NULL,
  `contact_email` text NOT NULL,
  `contact_phone` text NOT NULL,
  `contact_city` text,
  `adult_count` integer DEFAULT 1 NOT NULL,
  `child_count` integer DEFAULT 0 NOT NULL,
  `room_type` text,
  `special_requests` text,
  `subtotal_amount` integer NOT NULL,
  `discount_amount` integer DEFAULT 0 NOT NULL,
  `tax_amount` integer DEFAULT 0 NOT NULL,
  `addon_amount` integer DEFAULT 0 NOT NULL,
  `total_amount` integer NOT NULL,
  `paid_amount` integer DEFAULT 0 NOT NULL,
  `due_amount` integer DEFAULT 0 NOT NULL,
  `booked_at` integer NOT NULL,
  `confirmed_at` integer,
  `cancelled_at` integer,
  `completed_at` integer,
  `cancellation_reason` text,
  `source` text DEFAULT 'website' NOT NULL,
  `internal_notes` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  `tier_label` text,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE restrict,
  FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE restrict,
  FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE set null
);--> statement-breakpoint

INSERT INTO `__new_bookings` (
  `id`, `booking_ref`, `user_id`, `tour_id`, `departure_id`, `coupon_id`,
  `status`, `payment_status`, `contact_name`, `contact_email`, `contact_phone`,
  `contact_city`, `adult_count`, `child_count`, `room_type`, `special_requests`,
  `subtotal_amount`, `discount_amount`, `tax_amount`, `addon_amount`,
  `total_amount`, `paid_amount`, `due_amount`, `booked_at`, `confirmed_at`,
  `cancelled_at`, `completed_at`, `cancellation_reason`, `source`,
  `internal_notes`, `created_at`, `updated_at`, `tier_label`
)
SELECT
  `id`, `booking_ref`, `user_id`, `tour_id`, `departure_id`, `coupon_id`,
  `status`, `payment_status`, `contact_name`, `contact_email`, `contact_phone`,
  `contact_city`, `adult_count`, `child_count`, `room_type`, `special_requests`,
  `subtotal_amount`, `discount_amount`, `tax_amount`, `addon_amount`,
  `total_amount`, `paid_amount`, `due_amount`, `booked_at`, `confirmed_at`,
  `cancelled_at`, `completed_at`, `cancellation_reason`, `source`,
  `internal_notes`, `created_at`, `updated_at`, `tier_label`
FROM `bookings`;--> statement-breakpoint

DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint

CREATE UNIQUE INDEX `bookings_ref_unique` ON `bookings` (`booking_ref`);--> statement-breakpoint
CREATE INDEX `bookings_user_idx` ON `bookings` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookings_tour_idx` ON `bookings` (`tour_id`);--> statement-breakpoint
CREATE INDEX `bookings_departure_idx` ON `bookings` (`departure_id`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `bookings_payment_status_idx` ON `bookings` (`payment_status`);--> statement-breakpoint
CREATE INDEX `bookings_booked_at_idx` ON `bookings` (`booked_at`);--> statement-breakpoint
CREATE INDEX `bookings_email_idx` ON `bookings` (`contact_email`);--> statement-breakpoint

CREATE TABLE `__new_departure_pricing` (
  `id` text PRIMARY KEY NOT NULL,
  `departure_id` text NOT NULL,
  `room_type` text NOT NULL,
  `price` integer NOT NULL,
  `compare_at_price` integer,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint

INSERT INTO `__new_departure_pricing` (
  `id`, `departure_id`, `room_type`, `price`, `compare_at_price`, `created_at`
)
SELECT
  `id`, `departure_id`, `room_type`, `price`, `compare_at_price`, `created_at`
FROM `departure_pricing`;--> statement-breakpoint

DROP TABLE `departure_pricing`;--> statement-breakpoint
ALTER TABLE `__new_departure_pricing` RENAME TO `departure_pricing`;--> statement-breakpoint

CREATE UNIQUE INDEX `departure_pricing_unique`
ON `departure_pricing` (`room_type`, `departure_id`);--> statement-breakpoint
CREATE INDEX `departure_pricing_departure_idx`
ON `departure_pricing` (`departure_id`);--> statement-breakpoint
CREATE INDEX `departure_pricing_tier_room_price_idx`
ON `departure_pricing` (`room_type`, `price`);--> statement-breakpoint

CREATE TABLE `__new_departures` (
  `id` text PRIMARY KEY NOT NULL,
  `tour_id` text NOT NULL,
  `code` text NOT NULL,
  `start_date` integer NOT NULL,
  `end_date` integer NOT NULL,
  `total_seats` integer NOT NULL,
  `available_seats` integer NOT NULL,
  `status` text DEFAULT 'scheduled' NOT NULL,
  `booking_deadline` integer,
  `notes` text,
  `is_guaranteed` integer DEFAULT false NOT NULL,
  `is_active` integer DEFAULT true NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint

INSERT INTO `__new_departures` (
  `id`, `tour_id`, `code`, `start_date`, `end_date`, `total_seats`,
  `available_seats`, `status`, `booking_deadline`, `notes`,
  `is_guaranteed`, `is_active`, `created_at`, `updated_at`
)
SELECT
  `id`, `tour_id`, `code`, `start_date`, `end_date`, `total_seats`,
  `available_seats`, `status`, `booking_deadline`, `notes`,
  `is_guaranteed`, `is_active`, `created_at`, `updated_at`
FROM `departures`;--> statement-breakpoint

DROP TABLE `departures`;--> statement-breakpoint
ALTER TABLE `__new_departures` RENAME TO `departures`;--> statement-breakpoint

CREATE UNIQUE INDEX `departures_code_unique` ON `departures` (`code`);--> statement-breakpoint
CREATE INDEX `departures_tour_idx` ON `departures` (`tour_id`);--> statement-breakpoint
CREATE INDEX `departures_start_date_idx` ON `departures` (`start_date`);--> statement-breakpoint
CREATE INDEX `departures_status_idx` ON `departures` (`status`);--> statement-breakpoint
CREATE INDEX `departures_active_idx` ON `departures` (`is_active`);--> statement-breakpoint

DROP TABLE `tour_tiers`;--> statement-breakpoint

ALTER TABLE `user` ADD `status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `approved_at` integer;--> statement-breakpoint

CREATE UNIQUE INDEX `enquiries_tour_interest_user_unique`
ON `enquiries` (`user_id`, `tour_id`)
WHERE "enquiries"."source" = 'tour_interest';--> statement-breakpoint

PRAGMA defer_foreign_keys = off;


-- PRAGMA foreign_keys=OFF;--> statement-breakpoint
-- 
-- CREATE TABLE `__new_bookings` (
-- 	`id` text PRIMARY KEY NOT NULL,
-- 	`booking_ref` text NOT NULL,
-- 	`user_id` text,
-- 	`tour_id` text NOT NULL,
-- 	`departure_id` text NOT NULL,
-- 	`coupon_id` text,
-- 	`status` text DEFAULT 'pending' NOT NULL,
-- 	`payment_status` text DEFAULT 'pending' NOT NULL,
-- 	`contact_name` text NOT NULL,
-- 	`contact_email` text NOT NULL,
-- 	`contact_phone` text NOT NULL,
-- 	`contact_city` text,
-- 	`adult_count` integer DEFAULT 1 NOT NULL,
-- 	`child_count` integer DEFAULT 0 NOT NULL,
-- 	`room_type` text,
-- 	`special_requests` text,
-- 	`subtotal_amount` integer NOT NULL,
-- 	`discount_amount` integer DEFAULT 0 NOT NULL,
-- 	`tax_amount` integer DEFAULT 0 NOT NULL,
-- 	`addon_amount` integer DEFAULT 0 NOT NULL,
-- 	`total_amount` integer NOT NULL,
-- 	`paid_amount` integer DEFAULT 0 NOT NULL,
-- 	`due_amount` integer DEFAULT 0 NOT NULL,
-- 	`booked_at` integer NOT NULL,
-- 	`confirmed_at` integer,
-- 	`cancelled_at` integer,
-- 	`completed_at` integer,
-- 	`cancellation_reason` text,
-- 	`source` text DEFAULT 'website' NOT NULL,
-- 	`internal_notes` text,
-- 	`created_at` integer NOT NULL,
-- 	`updated_at` integer NOT NULL,
-- 	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
-- 	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE restrict,
-- 	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE restrict,
-- 	FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE set null
-- ); --> statement-breakpoint
-- 
-- INSERT INTO `__new_bookings`("id", "booking_ref", "user_id", "tour_id", "departure_id", "coupon_id", "status", "payment_status", "contact_name", "contact_email", "contact_phone", "contact_city", "adult_count", "child_count", "room_type", "special_requests", "subtotal_amount", "discount_amount", "tax_amount", "addon_amount", "total_amount", "paid_amount", "due_amount", "booked_at", "confirmed_at", "cancelled_at", "completed_at", "cancellation_reason", "source", "internal_notes", "created_at", "updated_at") SELECT "id", "booking_ref", "user_id", "tour_id", "departure_id", "coupon_id", "status", "payment_status", "contact_name", "contact_email", "contact_phone", "contact_city", "adult_count", "child_count", "room_type", "special_requests", "subtotal_amount", "discount_amount", "tax_amount", "addon_amount", "total_amount", "paid_amount", "due_amount", "booked_at", "confirmed_at", "cancelled_at", "completed_at", "cancellation_reason", "source", "internal_notes", "created_at", "updated_at" FROM `bookings`;--> statement-breakpoint
-- 
-- DROP TABLE `bookings`;--> statement-breakpoint
-- ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
-- 
-- 
-- CREATE UNIQUE INDEX `bookings_ref_unique` ON `bookings` (`booking_ref`);--> statement-breakpoint
-- CREATE INDEX `bookings_user_idx` ON `bookings` (`user_id`);--> statement-breakpoint
-- CREATE INDEX `bookings_tour_idx` ON `bookings` (`tour_id`);--> statement-breakpoint
-- CREATE INDEX `bookings_departure_idx` ON `bookings` (`departure_id`);--> statement-breakpoint
-- CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
-- CREATE INDEX `bookings_payment_status_idx` ON `bookings` (`payment_status`);--> statement-breakpoint
-- CREATE INDEX `bookings_booked_at_idx` ON `bookings` (`booked_at`);--> statement-breakpoint
-- CREATE INDEX `bookings_email_idx` ON `bookings` (`contact_email`);--> statement-breakpoint
-- 
-- CREATE TABLE `__new_departure_pricing` (
-- 	`id` text PRIMARY KEY NOT NULL,
-- 	`departure_id` text NOT NULL,
-- 	`room_type` text NOT NULL,
-- 	`price` integer NOT NULL,
-- 	`compare_at_price` integer,
-- 	`created_at` integer NOT NULL,
-- 	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE cascade
-- );--> statement-breakpoint
-- 
-- INSERT INTO `__new_departure_pricing`("id", "departure_id", "room_type", "price", "compare_at_price", "created_at") SELECT "id", "departure_id", "room_type", "price", "compare_at_price", "created_at" FROM `departure_pricing`;--> statement-breakpoint
-- 
-- DROP TABLE `departure_pricing`;--> statement-breakpoint
-- 
-- ALTER TABLE `__new_departure_pricing` RENAME TO `departure_pricing`;--> statement-breakpoint
-- 
-- CREATE UNIQUE INDEX `departure_pricing_unique` ON `departure_pricing` (`room_type`,`departure_id`);--> statement-breakpoint
-- CREATE INDEX `departure_pricing_departure_idx` ON `departure_pricing` (`departure_id`);--> statement-breakpoint
-- CREATE INDEX `departure_pricing_tier_room_price_idx` ON `departure_pricing` (`room_type`,`price`);--> statement-breakpoint
-- 
-- CREATE TABLE `__new_departures` (
-- 	`id` text PRIMARY KEY NOT NULL,
-- 	`tour_id` text NOT NULL,
-- 	`code` text NOT NULL,
-- 	`start_date` integer NOT NULL,
-- 	`end_date` integer NOT NULL,
-- 	`total_seats` integer NOT NULL,
-- 	`available_seats` integer NOT NULL,
-- 	`status` text DEFAULT 'scheduled' NOT NULL,
-- 	`booking_deadline` integer,
-- 	`notes` text,
-- 	`is_guaranteed` integer DEFAULT false NOT NULL,
-- 	`is_active` integer DEFAULT true NOT NULL,
-- 	`created_at` integer NOT NULL,
-- 	`updated_at` integer NOT NULL,
-- 	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
-- );--> statement-breakpoint
-- INSERT INTO `__new_departures`("id", "tour_id", "code", "start_date", "end_date", "total_seats", "available_seats", "status", "booking_deadline", "notes", "is_guaranteed", "is_active", "created_at", "updated_at") SELECT "id", "tour_id", "code", "start_date", "end_date", "total_seats", "available_seats", "status", "booking_deadline", "notes", "is_guaranteed", "is_active", "created_at", "updated_at" FROM `departures`;--> statement-breakpoint
-- 
-- DROP TABLE `departures`;--> statement-breakpoint
-- 
-- ALTER TABLE `__new_departures` RENAME TO `departures`;--> statement-breakpoint
-- 
-- CREATE UNIQUE INDEX `departures_code_unique` ON `departures` (`code`);--> statement-breakpoint
-- CREATE INDEX `departures_tour_idx` ON `departures` (`tour_id`);--> statement-breakpoint
-- CREATE INDEX `departures_start_date_idx` ON `departures` (`start_date`);--> statement-breakpoint
-- CREATE INDEX `departures_status_idx` ON `departures` (`status`);--> statement-breakpoint
-- CREATE INDEX `departures_active_idx` ON `departures` (`is_active`);--> statement-breakpoint
-- 
-- DROP TABLE `tour_tiers`;--> statement-breakpoint
-- 
-- ALTER TABLE `user` ADD `status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
-- ALTER TABLE `user` ADD `approved_at` integer;--> statement-breakpoint
-- 
-- CREATE UNIQUE INDEX `enquiries_tour_interest_user_unique` ON `enquiries` (`user_id`,`tour_id`) WHERE "enquiries"."source" = 'tour_interest';
-- 
-- PRAGMA defer_foreign_keys = off;
