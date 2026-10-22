ALTER TABLE `bookings` ADD `tour_addons_selected` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `seasons` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `review_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `destinations` ADD `area` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `language` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `currency` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `attractions` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `cuisine` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `travel_tips` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `do_list` text;--> statement-breakpoint
ALTER TABLE `destinations` ADD `dont_list` text;
ALTER TABLE `destinations` ADD `how_to_reach` text;
