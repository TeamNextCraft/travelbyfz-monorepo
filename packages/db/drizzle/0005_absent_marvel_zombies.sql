ALTER TABLE `tours` ADD `tag` text;--> statement-breakpoint
ALTER TABLE `tours` ADD `important_notes` text;--> statement-breakpoint
-- ALTER TABLE `tours` ADD `pricing_tiers` text NOT NULL;
ALTER TABLE `tours` ADD `pricing_tiers` text NOT NULL DEFAULT '[{"label":"Standard","description":"Default pricing tier","price":0}]';
