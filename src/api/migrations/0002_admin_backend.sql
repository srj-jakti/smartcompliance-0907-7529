CREATE TABLE IF NOT EXISTS `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL DEFAULT 'support',
	`is_active` integer DEFAULT true,
	`created_at` integer,
	UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`plan` text NOT NULL DEFAULT 'free',
	`status` text NOT NULL DEFAULT 'active',
	`seats` integer DEFAULT 5,
	`billing_cycle` text DEFAULT 'monthly',
	`amount` real DEFAULT 0,
	`renews_at` integer,
	`notes` text,
	`created_at` integer,
	UNIQUE(`firm_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`firm_name` text,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`user_role` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text NOT NULL DEFAULT 'open',
	`priority` text NOT NULL DEFAULT 'medium',
	`assigned_to` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `support_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`author_id` text NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`target_role` text DEFAULT 'all',
	`is_active` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `firm_ai_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`ai_key` text NOT NULL,
	`base_url` text DEFAULT 'https://api.openai.com/v1',
	`model` text DEFAULT 'gpt-4o',
	`is_active` integer DEFAULT true,
	`created_at` integer,
	UNIQUE(`firm_id`)
);
