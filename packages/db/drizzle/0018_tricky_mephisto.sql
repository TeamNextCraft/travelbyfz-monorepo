ALTER TABLE `rateLimit` RENAME TO `rate_limit`;--> statement-breakpoint
DROP INDEX `rateLimit_key_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `rate_limit_key_unique` ON `rate_limit` (`key`);