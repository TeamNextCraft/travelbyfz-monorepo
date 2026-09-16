PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_destinations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text DEFAULT 'India' NOT NULL,
	`state` text NOT NULL,
	`city` text,
	`region` text,
	`category` text,
	`tour_count` integer DEFAULT 0 NOT NULL,
	`rating` real DEFAULT 0,
	`tagline` text,
	`highlights` text DEFAULT '[]' NOT NULL,
	`is_trending` integer DEFAULT false NOT NULL,
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
INSERT INTO `__new_destinations`("id", "name", "slug", "country", "state", "city", "region", "category", "tour_count", "rating", "tagline", "highlights", "is_trending", "short_description", "description", "cover_image", "gallery", "best_time_to_visit", "popular_for", "latitude", "longitude", "seo_title", "seo_description", "is_featured", "is_active", "created_at", "updated_at") SELECT "id", "name", "slug", "country", "state", "city", "region", "category", "tour_count", "rating", "tagline", "highlights", "is_trending", "short_description", "description", "cover_image", "gallery", "best_time_to_visit", "popular_for", "latitude", "longitude", "seo_title", "seo_description", "is_featured", "is_active", "created_at", "updated_at" FROM `destinations`;--> statement-breakpoint
DROP TABLE `destinations`;--> statement-breakpoint
ALTER TABLE `__new_destinations` RENAME TO `destinations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE INDEX `destinations_state_idx` ON `destinations` (`state`);--> statement-breakpoint
CREATE INDEX `destinations_featured_idx` ON `destinations` (`is_featured`);--> statement-breakpoint
CREATE INDEX `destinations_active_idx` ON `destinations` (`is_active`);--> statement-breakpoint
CREATE TABLE `__new_tours` (
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
	`avg_rating` real DEFAULT 0 NOT NULL,
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
INSERT INTO `__new_tours`("id", "destination_id", "title", "slug", "code", "category", "type", "short_description", "description", "duration_days", "duration_nights", "start_location", "end_location", "base_price", "compare_at_price", "currency", "min_age", "max_age", "max_group_size", "min_group_size", "difficulty", "transport_included", "meals_included", "inclusions", "exclusions", "highlights", "itinerary", "cancellation_policy_summary", "terms_summary", "featured_image", "gallery", "seo_title", "seo_description", "avg_rating", "review_count", "booking_count", "is_featured", "is_published", "is_active", "created_at", "updated_at") SELECT "id", "destination_id", "title", "slug", "code", "category", "type", "short_description", "description", "duration_days", "duration_nights", "start_location", "end_location", "base_price", "compare_at_price", "currency", "min_age", "max_age", "max_group_size", "min_group_size", "difficulty", "transport_included", "meals_included", "inclusions", "exclusions", "highlights", "itinerary", "cancellation_policy_summary", "terms_summary", "featured_image", "gallery", "seo_title", "seo_description", "avg_rating", "review_count", "booking_count", "is_featured", "is_published", "is_active", "created_at", "updated_at" FROM `tours`;--> statement-breakpoint
DROP TABLE `tours`;--> statement-breakpoint
ALTER TABLE `__new_tours` RENAME TO `tours`;--> statement-breakpoint
CREATE UNIQUE INDEX `tours_slug_unique` ON `tours` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tours_code_unique` ON `tours` (`code`);--> statement-breakpoint
CREATE INDEX `tours_destination_idx` ON `tours` (`destination_id`);--> statement-breakpoint
CREATE INDEX `tours_category_idx` ON `tours` (`category`);--> statement-breakpoint
CREATE INDEX `tours_featured_idx` ON `tours` (`is_featured`);--> statement-breakpoint
CREATE INDEX `tours_published_idx` ON `tours` (`is_published`);--> statement-breakpoint
CREATE INDEX `tours_active_idx` ON `tours` (`is_active`);