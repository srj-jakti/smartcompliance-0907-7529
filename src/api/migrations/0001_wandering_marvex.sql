CREATE TABLE `leave_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`employee_name` text NOT NULL,
	`leave_type` text NOT NULL,
	`from_date` text NOT NULL,
	`to_date` text NOT NULL,
	`days` real NOT NULL,
	`reason` text,
	`status` text DEFAULT 'pending',
	`reviewed_by` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `sub_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'pending',
	`assigned_to` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `time_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_id` text NOT NULL,
	`task_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`employee_name` text NOT NULL,
	`hours` real NOT NULL,
	`description` text,
	`log_date` text NOT NULL,
	`created_at` integer
);
