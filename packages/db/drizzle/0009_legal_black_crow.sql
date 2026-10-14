CREATE TABLE `tour_tiers` (
	`id` text PRIMARY KEY NOT NULL,
	`tour_id` text NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tour_tiers_tour_slug_unique` ON `tour_tiers` (`tour_id`,`slug`);--> statement-breakpoint
CREATE INDEX `tour_tiers_tour_idx` ON `tour_tiers` (`tour_id`);--> statement-breakpoint
DROP INDEX `departure_pricing_unique`;--> statement-breakpoint
ALTER TABLE `departure_pricing` ADD `tier_id` text REFERENCES tour_tiers(id);--> statement-breakpoint
ALTER TABLE `departure_pricing` ADD `compare_at_price` integer;--> statement-breakpoint
CREATE INDEX `departure_pricing_departure_idx` ON `departure_pricing` (`departure_id`);--> statement-breakpoint
CREATE INDEX `departure_pricing_tier_room_price_idx` ON `departure_pricing` (`tier_id`,`room_type`,`price`);--> statement-breakpoint
CREATE UNIQUE INDEX `departure_pricing_unique` ON `departure_pricing` (`tier_id`,`room_type`,`departure_id`);--> statement-breakpoint
ALTER TABLE `bookings` ADD `tier_id` text REFERENCES tour_tiers(id);--> statement-breakpoint
ALTER TABLE `bookings` ADD `tier_label` text;--> statement-breakpoint
ALTER TABLE `departures` ADD `tier_id` text REFERENCES tour_tiers(id);--> statement-breakpoint
ALTER TABLE `departures` DROP COLUMN `price`;--> statement-breakpoint
ALTER TABLE `departures` DROP COLUMN `discounted_price`;--> statement-breakpoint
ALTER TABLE `tours` DROP COLUMN `base_price`;--> statement-breakpoint
ALTER TABLE `tours` DROP COLUMN `compare_at_price`;--> statement-breakpoint
ALTER TABLE `tours` DROP COLUMN `pricing_tiers`;
