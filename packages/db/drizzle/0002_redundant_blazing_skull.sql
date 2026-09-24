ALTER TABLE `destinations` ADD `category` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `tour_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `destinations` ADD `rating` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `destinations` ADD `highlights` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `is_trending` integer DEFAULT false NOT NULL;