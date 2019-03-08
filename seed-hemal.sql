
ALTER TABLE `milestones`
ADD `is_deleted` tinyint(1) NULL DEFAULT '0';

ALTER TABLE `tasks`
CHANGE `status` `task_status` varchar(50) COLLATE 'latin1_swedish_ci' NOT NULL AFTER `priority`;

ALTER TABLE `tasks`
CHANGE `start_date` `start_date` date NOT NULL AFTER `task_details`,
CHANGE `end_date` `end_date` date NOT NULL AFTER `start_date`;