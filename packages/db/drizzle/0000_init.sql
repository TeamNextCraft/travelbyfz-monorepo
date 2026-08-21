CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`first_name` text,
	`last_name` text,
	`phone` text,
	`password_hash` text,
	`role` text DEFAULT 'customer' NOT NULL,
	`phone_verified` integer DEFAULT false NOT NULL,
	`date_of_birth` integer,
	`gender` text,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `user` (`phone`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `user` (`role`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `user` (`created_at`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `addons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`per_person` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `addons_slug_unique` ON `addons` (`slug`);--> statement-breakpoint
CREATE INDEX `addons_active_idx` ON `addons` (`is_active`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image` text,
	`tags` text,
	`is_published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_published_idx` ON `blog_posts` (`is_published`);--> statement-breakpoint
CREATE TABLE `booking_addons` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`addon_id` text,
	`title` text NOT NULL,
	`unit_price` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`total_price` integer NOT NULL,
	`per_person` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `booking_addons_booking_idx` ON `booking_addons` (`booking_id`);--> statement-breakpoint
CREATE TABLE `booking_travellers` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`full_name` text,
	`date_of_birth` integer,
	`age` integer,
	`gender` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`phone` text,
	`email` text,
	`id_type` text,
	`id_number` text,
	`room_type` text,
	`dietary_preferences` text,
	`medical_notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `booking_travellers_booking_idx` ON `booking_travellers` (`booking_id`);--> statement-breakpoint
CREATE INDEX `booking_travellers_primary_idx` ON `booking_travellers` (`booking_id`,`is_primary`);--> statement-breakpoint
CREATE TABLE `bookings` (
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
	`guest_count` integer NOT NULL,
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
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_ref_unique` ON `bookings` (`booking_ref`);--> statement-breakpoint
CREATE INDEX `bookings_user_idx` ON `bookings` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookings_tour_idx` ON `bookings` (`tour_id`);--> statement-breakpoint
CREATE INDEX `bookings_departure_idx` ON `bookings` (`departure_id`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `bookings_payment_status_idx` ON `bookings` (`payment_status`);--> statement-breakpoint
CREATE INDEX `bookings_booked_at_idx` ON `bookings` (`booked_at`);--> statement-breakpoint
CREATE INDEX `bookings_email_idx` ON `bookings` (`contact_email`);--> statement-breakpoint
CREATE TABLE `coupon_targets` (
	`id` text PRIMARY KEY NOT NULL,
	`coupon_id` text NOT NULL,
	`tour_id` text,
	`departure_id` text,
	FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `coupon_targets_coupon_idx` ON `coupon_targets` (`coupon_id`);--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`title` text,
	`description` text,
	`type` text NOT NULL,
	`scope` text DEFAULT 'all' NOT NULL,
	`value` integer NOT NULL,
	`min_booking_amount` integer,
	`max_discount_amount` integer,
	`usage_limit` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`starts_at` integer,
	`expires_at` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE INDEX `coupons_active_idx` ON `coupons` (`is_active`);--> statement-breakpoint
CREATE INDEX `coupons_expires_idx` ON `coupons` (`expires_at`);--> statement-breakpoint
CREATE TABLE `departure_pricing` (
	`id` text PRIMARY KEY NOT NULL,
	`departure_id` text NOT NULL,
	`room_type` text NOT NULL,
	`price` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departure_pricing_unique` ON `departure_pricing` (`departure_id`,`room_type`);--> statement-breakpoint
CREATE TABLE `departures` (
	`id` text PRIMARY KEY NOT NULL,
	`tour_id` text NOT NULL,
	`code` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`price` integer NOT NULL,
	`discounted_price` integer,
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
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departures_code_unique` ON `departures` (`code`);--> statement-breakpoint
CREATE INDEX `departures_tour_idx` ON `departures` (`tour_id`);--> statement-breakpoint
CREATE INDEX `departures_start_date_idx` ON `departures` (`start_date`);--> statement-breakpoint
CREATE INDEX `departures_status_idx` ON `departures` (`status`);--> statement-breakpoint
CREATE INDEX `departures_active_idx` ON `departures` (`is_active`);--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text DEFAULT 'India' NOT NULL,
	`state` text NOT NULL,
	`city` text,
	`short_description` text,
	`description` text,
	`cover_image` text,
	`gallery` text,
	`best_time_to_visit` text,
	`popular_for` text,
	`latitude` real,
	`longitude` real,
	`seo_title` text,
	`seo_description` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE INDEX `destinations_state_idx` ON `destinations` (`state`);--> statement-breakpoint
CREATE INDEX `destinations_featured_idx` ON `destinations` (`is_featured`);--> statement-breakpoint
CREATE INDEX `destinations_active_idx` ON `destinations` (`is_active`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`tour_id` text,
	`departure_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`city` text,
	`subject` text,
	`message` text NOT NULL,
	`travel_month` text,
	`group_size` integer,
	`budget_min` integer,
	`budget_max` integer,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text,
	`source` text DEFAULT 'website' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assigned_to`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `enquiries_tour_idx` ON `enquiries` (`tour_id`);--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`);--> statement-breakpoint
CREATE INDEX `enquiries_email_idx` ON `enquiries` (`email`);--> statement-breakpoint
CREATE INDEX `enquiries_created_at_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`method` text,
	`provider` text,
	`provider_order_id` text,
	`provider_payment_id` text,
	`provider_signature` text,
	`paid_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payments_booking_idx` ON `payments` (`booking_id`);--> statement-breakpoint
CREATE INDEX `payments_status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `payments_provider_payment_idx` ON `payments` (`provider_payment_id`);--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`payment_id` text,
	`amount` integer NOT NULL,
	`reason` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`processed_at` integer,
	`provider_refund_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `refunds_booking_idx` ON `refunds` (`booking_id`);--> statement-breakpoint
CREATE INDEX `refunds_payment_idx` ON `refunds` (`payment_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text,
	`tour_id` text NOT NULL,
	`user_id` text,
	`rating` integer NOT NULL,
	`title` text,
	`comment` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`submitted_at` integer NOT NULL,
	`approved_at` integer,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `reviews_tour_idx` ON `reviews` (`tour_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_status_idx` ON `reviews` (`status`);--> statement-breakpoint
CREATE INDEX `reviews_featured_idx` ON `reviews` (`is_featured`);--> statement-breakpoint
CREATE TABLE `tour_addons` (
	`tour_id` text NOT NULL,
	`addon_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`tour_id`, `addon_id`),
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` text PRIMARY KEY NOT NULL,
	`destination_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`code` text NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`short_description` text,
	`description` text NOT NULL,
	`duration_days` integer NOT NULL,
	`duration_nights` integer NOT NULL,
	`start_location` text NOT NULL,
	`end_location` text NOT NULL,
	`base_price` integer NOT NULL,
	`compare_at_price` integer,
	`currency` text DEFAULT 'INR' NOT NULL,
	`min_age` integer,
	`max_age` integer,
	`max_group_size` integer,
	`min_group_size` integer DEFAULT 1,
	`difficulty` text,
	`transport_included` integer DEFAULT true NOT NULL,
	`meals_included` text,
	`inclusions` text NOT NULL,
	`exclusions` text NOT NULL,
	`highlights` text NOT NULL,
	`itinerary` text,
	`cancellation_policy_summary` text,
	`terms_summary` text,
	`featured_image` text,
	`gallery` text,
	`seo_title` text,
	`seo_description` text,
	`avg_rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0 NOT NULL,
	`booking_count` integer DEFAULT 0 NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tours_slug_unique` ON `tours` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tours_code_unique` ON `tours` (`code`);--> statement-breakpoint
CREATE INDEX `tours_destination_idx` ON `tours` (`destination_id`);--> statement-breakpoint
CREATE INDEX `tours_category_idx` ON `tours` (`category`);--> statement-breakpoint
CREATE INDEX `tours_featured_idx` ON `tours` (`is_featured`);--> statement-breakpoint
CREATE INDEX `tours_published_idx` ON `tours` (`is_published`);--> statement-breakpoint
CREATE INDEX `tours_active_idx` ON `tours` (`is_active`);--> statement-breakpoint
CREATE TABLE `webinar_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`city` text,
	`amount` integer NOT NULL,
	`razorpay_order_id` text NOT NULL,
	`razorpay_payment_id` text,
	`status` text DEFAULT 'created' NOT NULL,
	`zoom_link_sent` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
