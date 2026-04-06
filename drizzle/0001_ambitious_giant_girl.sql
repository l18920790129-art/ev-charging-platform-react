CREATE TABLE `analysis_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(100) NOT NULL,
	`lat` float NOT NULL,
	`lng` float NOT NULL,
	`user_message` text NOT NULL,
	`ai_response` text NOT NULL,
	`total_score` float DEFAULT 0,
	`score_breakdown` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analysis_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `charging_stations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`district` varchar(100) NOT NULL,
	`connectors` int NOT NULL DEFAULT 4,
	`power` float NOT NULL DEFAULT 60,
	`operator` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `charging_stations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exclusion_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`zone_type` varchar(50) NOT NULL,
	`center_lat` float NOT NULL,
	`center_lng` float NOT NULL,
	`radius_km` float NOT NULL DEFAULT 0.5,
	`boundary_json` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exclusion_zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memory_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memory_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `memory_sessions_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `poi_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` varchar(50) NOT NULL,
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`district` varchar(100) NOT NULL,
	`address` text,
	`daily_flow` int NOT NULL DEFAULT 0,
	`influence_weight` float NOT NULL DEFAULT 1,
	`ev_demand_score` float NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `poi_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(100) NOT NULL,
	`address` varchar(300) NOT NULL,
	`lat` float NOT NULL,
	`lng` float NOT NULL,
	`total_score` float DEFAULT 0,
	`report_content` text NOT NULL,
	`score_breakdown` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traffic_flow` (
	`id` int AUTO_INCREMENT NOT NULL,
	`road_name` varchar(200) NOT NULL,
	`road_level` varchar(50) NOT NULL,
	`start_lat` float NOT NULL,
	`start_lng` float NOT NULL,
	`end_lat` float NOT NULL,
	`end_lng` float NOT NULL,
	`center_lat` float NOT NULL,
	`center_lng` float NOT NULL,
	`daily_flow` int NOT NULL DEFAULT 0,
	`peak_flow` int NOT NULL DEFAULT 0,
	`ev_ratio` float NOT NULL DEFAULT 0.05,
	`heat_weight` float NOT NULL DEFAULT 1,
	`district` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `traffic_flow_id` PRIMARY KEY(`id`)
);
