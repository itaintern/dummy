-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `add_questions`;
CREATE TABLE `add_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qb_id` int(50) NOT NULL,
  `qs_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `qbId` (`qb_id`),
  KEY `qsId` (`qs_id`),
  CONSTRAINT `add_questions_ibfk_5` FOREIGN KEY (`qb_id`) REFERENCES `question_banks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `add_questions_ibfk_6` FOREIGN KEY (`qs_id`) REFERENCES `question_sets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alerts_modules_operators_id` int(11) NOT NULL,
  `to_email` varchar(50) NOT NULL,
  `cc_email` varchar(500) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `alerts_modules_operators_id` (`alerts_modules_operators_id`),
  CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`alerts_modules_operators_id`) REFERENCES `alerts_modules_operators` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `alerts_conditions`;
CREATE TABLE `alerts_conditions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alerts_id` int(11) NOT NULL,
  `field` varchar(50) NOT NULL,
  `operator` varchar(50) NOT NULL,
  `compare_value` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `alerts_id` (`alerts_id`),
  CONSTRAINT `alerts_conditions_ibfk_1` FOREIGN KEY (`alerts_id`) REFERENCES `alerts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `alerts_modules_operators`;
CREATE TABLE `alerts_modules_operators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modules_operators` varchar(50) NOT NULL,
  `idetifiers` char(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `modules_id` (`modules_operators`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `alerts_modules_operators` (`id`, `modules_operators`, `idetifiers`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'Projects',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'Releases',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'Holidays',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'Leaves',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	'Batches',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	'User stories',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	'Exam schedule',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	'Test plan',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	'Project plan',	'm',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	'< (Less than)',	'o',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(11,	'> (Greater than)',	'o',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(12,	'< = (Less than Equal to)',	'o',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(13,	'> = (Greater than Equal to)',	'o',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(14,	'= = (Equal to)',	'o',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `appreciations`;
CREATE TABLE `appreciations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `to_id` int(11) NOT NULL,
  `from_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `comment` varchar(800) NOT NULL,
  `appreciation_date` date DEFAULT NULL,
  `is_active_comment` tinyint(1) DEFAULT '0',
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `from` (`from_id`),
  KEY `to` (`to_id`),
  CONSTRAINT `appreciations_ibfk_3` FOREIGN KEY (`from_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appreciations_ibfk_4` FOREIGN KEY (`to_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `assign_projects`;
CREATE TABLE `assign_projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `projects_id` int(11) NOT NULL,
  `reporting_user_id` int(11) NOT NULL,
  `estimated_start_date` date NOT NULL,
  `estimated_end_date` date NOT NULL,
  `actual_start_date` date NOT NULL,
  `actual_end_date` date DEFAULT NULL,
  `daily_estimated_hours` int(20) NOT NULL,
  `estimated_hours` int(6) NOT NULL,
  `project_role` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `employee` (`employee_id`),
  KEY `reportingUser` (`reporting_user_id`),
  KEY `project` (`projects_id`),
  CONSTRAINT `assign_projects_ibfk_10` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assign_projects_ibfk_11` FOREIGN KEY (`projects_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assign_projects_ibfk_12` FOREIGN KEY (`reporting_user_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companies_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `tie_up_date` date NOT NULL,
  `contact_person` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `primary_contact_no` varchar(15) NOT NULL,
  `secondary_contact_no` varchar(15) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `zip_code` int(6) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `Company` (`companies_id`),
  CONSTRAINT `clients_ibfk_2` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `company_holidays`;
CREATE TABLE `company_holidays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companies_id` int(11) NOT NULL,
  `holiday_date` date NOT NULL,
  `discription` varchar(800) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `message` varchar(200) NOT NULL,
  `type` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `company_id` (`companies_id`),
  CONSTRAINT `company_holidays_ibfk_1` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `company_modules`;
CREATE TABLE `company_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companies_id` int(11) NOT NULL,
  `sub_modules_id` int(11) NOT NULL,
  `modules_id` int(11) NOT NULL,
  `display_title` varchar(50) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `company` (`companies_id`),
  KEY `module` (`modules_id`),
  KEY `subModule` (`sub_modules_id`),
  CONSTRAINT `company_modules_ibfk_1` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`),
  CONSTRAINT `company_modules_ibfk_2` FOREIGN KEY (`modules_id`) REFERENCES `modules` (`id`),
  CONSTRAINT `company_modules_ibfk_3` FOREIGN KEY (`sub_modules_id`) REFERENCES `sub_modules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `course_modules`;
CREATE TABLE `course_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manage_courses_id` int(11) NOT NULL,
  `learning_modules_Id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `courseId` (`manage_courses_id`),
  KEY `moduleId` (`learning_modules_Id`),
  CONSTRAINT `course_modules_ibfk_1` FOREIGN KEY (`manage_courses_id`) REFERENCES `manage_courses` (`id`),
  CONSTRAINT `course_modules_ibfk_2` FOREIGN KEY (`learning_modules_Id`) REFERENCES `learning_modules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companies_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `description` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `company` (`companies_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `departments` (`id`, `companies_id`, `title`, `contact_number`, `description`, `status`, `is_deleted`, `secret`) VALUES
(3,	16,	'Analysis',	'987654321',	'this department is all about analyst',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	13,	'Develop',	'1278547896',	'this department is all about development',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	20,	'title',	'1234567890',	'this is a description...',	NULL,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `designations`;
CREATE TABLE `designations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companies_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `company` (`companies_id`),
  CONSTRAINT `designations_ibfk_1` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `designations` (`id`, `companies_id`, `title`, `status`, `is_deleted`, `secret`) VALUES
(4,	13,	'Business Analyst',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employees_id` int(11) NOT NULL,
  `companies_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `file` text,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `company` (`companies_id`),
  KEY `employee` (`employees_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`employees_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `duration_types`;
CREATE TABLE `duration_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `duration_types` (`id`, `title`, `secret`) VALUES
(1,	'Month',	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'Days',	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'Weeks',	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'Year',	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `email_templates`;
CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `body` varchar(500) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `departments_id` int(11) NOT NULL,
  `designations_id` int(11) NOT NULL,
  `roles_id` int(11) NOT NULL,
  `companies_id` int(11) NOT NULL,
  `employee_number` varchar(20) NOT NULL DEFAULT '0',
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `join_date` date NOT NULL,
  `leave_date` date DEFAULT NULL,
  `birth_date` date NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `emergency_number` varchar(15) NOT NULL,
  `primary_email` varchar(255) NOT NULL,
  `secondary_email` varchar(255) NOT NULL,
  `address` varchar(200) NOT NULL,
  `password` varchar(800) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `zipcode` varchar(20) NOT NULL,
  `city` varchar(50) NOT NULL,
  `is_primary` tinyint(1) DEFAULT NULL,
  `profile_picture` text,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `department` (`departments_id`),
  KEY `role` (`roles_id`),
  KEY `company` (`companies_id`),
  KEY `designation` (`designations_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`departments_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`designations_id`) REFERENCES `designations` (`id`),
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` text,
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `learning_modules`;
CREATE TABLE `learning_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `link` text NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `statusId` (`status_id`),
  CONSTRAINT `learning_modules_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `cc_email` varchar(50) DEFAULT NULL,
  `message` varchar(50) NOT NULL,
  `start_date` varchar(100) NOT NULL,
  `end_date` varchar(100) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `leave_status` varchar(50) NOT NULL,
  `reason` varchar(50) NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `fromEmployeeId` (`from_id`),
  KEY `toEmployeeId` (`to_id`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `manage_batches`;
CREATE TABLE `manage_batches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manage_courses_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `courseId` (`manage_courses_id`),
  KEY `statusId` (`status_id`),
  CONSTRAINT `manage_batches_ibfk_1` FOREIGN KEY (`manage_courses_id`) REFERENCES `manage_courses` (`id`),
  CONSTRAINT `manage_batches_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `manage_courses`;
CREATE TABLE `manage_courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `learning_modules_id` int(11) NOT NULL,
  `duration_types_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `duration` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `duration` (`duration`),
  KEY `moduleId` (`learning_modules_id`),
  KEY `statusId` (`status_id`),
  KEY `durationtypeId` (`duration_types_id`),
  CONSTRAINT `manage_courses_ibfk_1` FOREIGN KEY (`learning_modules_id`) REFERENCES `learning_modules` (`id`),
  CONSTRAINT `manage_courses_ibfk_2` FOREIGN KEY (`duration_types_id`) REFERENCES `duration_types` (`id`),
  CONSTRAINT `manage_courses_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `manage_quizes`;
CREATE TABLE `manage_quizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_sets_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `quesetId` (`question_sets_id`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `manage_quizes_ibfk_1` FOREIGN KEY (`question_sets_id`) REFERENCES `question_sets` (`id`),
  CONSTRAINT `manage_quizes_ibfk_2` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` int(11) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `organizations`;
CREATE TABLE `organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `license` varchar(15) NOT NULL DEFAULT 'basic',
  `validity` datetime NOT NULL,
  `org_secret` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  UNIQUE KEY `org_secret` (`org_secret`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `organization_profile`;
CREATE TABLE `organization_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_code` varchar(50) NOT NULL,
  `primary_contact_person` varchar(50) NOT NULL,
  `secondary_contact_person` varchar(50) NOT NULL,
  `primary_contact_no` varchar(15) NOT NULL,
  `secondary_contact_no` varchar(15) NOT NULL,
  `address` varchar(200) NOT NULL,
  `state` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `zip_code` int(20) NOT NULL,
  `logo` text,
  `display_title` varchar(50) NOT NULL,
  `sn_no` varchar(50) NOT NULL,
  `gst_no` varchar(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roles_id` int(11) NOT NULL,
  `modules_id` int(11) DEFAULT NULL,
  `companies_id` int(11) DEFAULT NULL,
  `sub_modules_id` int(11) DEFAULT NULL,
  `edit_record` tinyint(1) DEFAULT NULL,
  `view_record` tinyint(1) DEFAULT NULL,
  `create_record` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT NULL,
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `RoleId` (`roles_id`),
  KEY `ModuleId` (`modules_id`),
  KEY `CompanyId` (`companies_id`),
  KEY `SubModule` (`sub_modules_id`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`modules_id`) REFERENCES `modules` (`id`),
  CONSTRAINT `permissions_ibfk_3` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`),
  CONSTRAINT `permissions_ibfk_4` FOREIGN KEY (`sub_modules_id`) REFERENCES `sub_modules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `departments_id` int(11) NOT NULL,
  `designations_id` int(11) NOT NULL,
  `roles_id` int(11) NOT NULL,
  `companies_id` int(11) NOT NULL,
  `employee_number` varchar(20) NOT NULL DEFAULT '0',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `join_date` date NOT NULL,
  `leave_date` date DEFAULT NULL,
  `birth_date` date NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `emergency_number` varchar(15) NOT NULL,
  `primary_email` varchar(255) NOT NULL,
  `secondary_email` varchar(255) NOT NULL,
  `address` varchar(200) NOT NULL,
  `password` varchar(800) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `zipCode` varchar(20) NOT NULL,
  `city` varchar(50) NOT NULL,
  `is_primary` tinyint(1) DEFAULT NULL,
  `profile_picture` text,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `department` (`departments_id`),
  KEY `role` (`roles_id`),
  KEY `company` (`companies_id`),
  KEY `designation` (`designations_id`),
  KEY `user` (`users_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  CONSTRAINT `profiles_ibfk_2` FOREIGN KEY (`departments_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `profiles_ibfk_3` FOREIGN KEY (`designations_id`) REFERENCES `designations` (`id`),
  CONSTRAINT `profiles_ibfk_4` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `profiles_ibfk_5` FOREIGN KEY (`companies_id`) REFERENCES `organization_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clients_id` int(11) NOT NULL,
  `project_name` varchar(50) NOT NULL,
  `project_description` varchar(2000) NOT NULL,
  `estimated_start_date` date NOT NULL,
  `estimated_hours` int(6) NOT NULL,
  `daily_estimated_hours` int(2) NOT NULL,
  `estimated_end_date` date NOT NULL,
  `dev_url` varchar(2000) NOT NULL,
  `qa_url` varchar(2000) NOT NULL,
  `po_url` varchar(2000) NOT NULL,
  `demo_url` varchar(2000) NOT NULL,
  `live_url` varchar(2000) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `client` (`clients_id`),
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`clients_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `question_banks`;
CREATE TABLE `question_banks` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `manage_courses_id` int(11) NOT NULL,
  `qus` varchar(500) NOT NULL,
  `option1` varchar(500) NOT NULL,
  `option2` varchar(500) NOT NULL,
  `option3` varchar(500) NOT NULL,
  `option4` varchar(500) NOT NULL,
  `ans` varchar(500) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `course` (`manage_courses_id`),
  CONSTRAINT `question_banks_ibfk_1` FOREIGN KEY (`manage_courses_id`) REFERENCES `manage_courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `question_sets`;
CREATE TABLE `question_sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `releases`;
CREATE TABLE `releases` (
  `id` bigint(4) NOT NULL AUTO_INCREMENT,
  `projects_id` int(11) NOT NULL,
  `release_no` varchar(4) NOT NULL,
  `version_no` varchar(10) NOT NULL,
  `release_date` date NOT NULL,
  `status` varchar(10) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `projects_id` (`projects_id`),
  CONSTRAINT `releases_ibfk_1` FOREIGN KEY (`projects_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '1',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `schedule_quizes`;
CREATE TABLE `schedule_quizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_sets_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `quesetId` (`question_sets_id`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `schedule_quizes_ibfk_1` FOREIGN KEY (`question_sets_id`) REFERENCES `question_sets` (`id`),
  CONSTRAINT `schedule_quizes_ibfk_2` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(4) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `sub_modules`;
CREATE TABLE `sub_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modules_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `module` (`modules_id`),
  CONSTRAINT `sub_modules_ibfk_1` FOREIGN KEY (`modules_id`) REFERENCES `modules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignee_id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `task_details` varchar(100) NOT NULL,
  `start_date` varchar(100) NOT NULL,
  `end_date` varchar(200) NOT NULL,
  `priority` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `Assignee` (`assignee_id`),
  KEY `Reporter` (`reporter_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `test_cases`;
CREATE TABLE `test_cases` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `backlog_id` bigint(20) NOT NULL,
  `test_status_id` tinyint(1) DEFAULT NULL,
  `testcase_no` varchar(10) NOT NULL,
  `testcase_description` varchar(200) NOT NULL,
  `access_path` varchar(150) NOT NULL,
  `precondition` varchar(150) DEFAULT NULL,
  `test_step` varchar(50) DEFAULT NULL,
  `test_data` varchar(250) DEFAULT NULL,
  `expected_result` varchar(100) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `execution_date` date DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `status` (`test_status_id`),
  KEY `backlogId` (`backlog_id`),
  CONSTRAINT `test_cases_ibfk_1` FOREIGN KEY (`backlog_id`) REFERENCES `user_stories` (`id`),
  CONSTRAINT `test_cases_ibfk_2` FOREIGN KEY (`test_status_id`) REFERENCES `test_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `test_executions`;
CREATE TABLE `test_executions` (
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `test_cases_id` bigint(11) NOT NULL,
  `backlog_id` bigint(20) NOT NULL,
  `test_plans_id` bigint(10) NOT NULL,
  `test_status_id` tinyint(1) NOT NULL,
  `estimated_hours` int(10) NOT NULL,
  `comments` varchar(250) NOT NULL,
  `is_active` int(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `testcaseId` (`test_cases_id`),
  KEY `backlogId` (`backlog_id`),
  KEY `testplanId` (`test_plans_id`),
  KEY `statusId` (`test_status_id`),
  CONSTRAINT `test_executions_ibfk_1` FOREIGN KEY (`test_cases_id`) REFERENCES `test_cases` (`id`),
  CONSTRAINT `test_executions_ibfk_2` FOREIGN KEY (`backlog_id`) REFERENCES `user_stories` (`id`),
  CONSTRAINT `test_executions_ibfk_3` FOREIGN KEY (`test_plans_id`) REFERENCES `test_plans` (`id`),
  CONSTRAINT `test_executions_ibfk_5` FOREIGN KEY (`test_status_id`) REFERENCES `test_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `test_plans`;
CREATE TABLE `test_plans` (
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `backlog_id` bigint(20) NOT NULL,
  `test_cases_id` bigint(11) NOT NULL,
  `test_status_id` tinyint(1) NOT NULL,
  `estimated_hours` bigint(20) NOT NULL,
  `version_name` varchar(50) NOT NULL,
  `release_date` date DEFAULT NULL,
  `bug_verification` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `statusId` (`test_status_id`),
  KEY `backlogId` (`backlog_id`),
  KEY `testcaseId` (`test_cases_id`),
  CONSTRAINT `test_plans_ibfk_1` FOREIGN KEY (`backlog_id`) REFERENCES `user_stories` (`id`),
  CONSTRAINT `test_plans_ibfk_2` FOREIGN KEY (`test_cases_id`) REFERENCES `test_cases` (`id`),
  CONSTRAINT `test_plans_ibfk_4` FOREIGN KEY (`test_status_id`) REFERENCES `test_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `test_status`;
CREATE TABLE `test_status` (
  `id` tinyint(1) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `token` varchar(50) NOT NULL DEFAULT '1',
  `lease` datetime DEFAULT '0001-01-01 00:00:00',
  `role` varchar(50) DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `email`, `username`, `password`, `token`, `lease`, `role`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'superadmin@example.com',	'superadmin',	'17c4520f6cfd1ab53d8745e84681eb49',	'8822cdce-8a79-4df4-8878-cc4a34bea5b7',	'2018-11-23 06:05:49',	'superadmin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'admin@example.com',	'admin',	'21232f297a57a5a743894a0e4a801fc3',	'acfe98c4-c975-406e-8979-1bc0a0b82101',	'2019-01-17 10:10:14',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'user@example.com',	'user',	'ee11cbb19052e40b07aac0ca060c23ee',	'0ecb0c49-9c4b-441d-912c-417340427fab',	'2018-11-23 06:06:14',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'uday@yopmail.com',	'uday',	'79ab5af2f180d47599bf0dd0e46a2184',	'12345',	'2018-02-02 00:00:00',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	'jaimini@yopmail.com',	'jaimini',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'42b90e29-4625-4b5b-b451-b29a8e8b6af1',	'0001-01-01 00:00:00',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	'anjana@yopmail.com',	'anjana',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'bc0271f6-8d2b-4fb4-b549-3fa382f8c2a2',	'2018-10-02 15:10:17',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	'prot@yopmail.com',	'prot@yopmail.com',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'3e153d7b-31f3-452d-8795-198ed544367f',	'2018-10-22 10:08:40',	'admin',	1,	0,	'0cf3c7c4-58de-4937-84d5-a5b6a6915bf4'),
(9,	'jdcdsjfsa@yopmail.com',	'jdcdsjfsa@yopmail.com',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'1',	'0001-01-01 00:00:00',	'admin',	1,	0,	'666962a1-5f17-4ec5-9546-7defc610a8ad'),
(10,	'uday2@yopmail.com',	'uday',	'21232f297a57a5a743894a0e4a801fc3',	'6c9f7215-bfdd-4a07-95c1-bf8a136d36e5',	'2018-10-22 10:11:09',	'user',	1,	0,	'0cf3c7c4-58de-4937-84d5-a5b6a6915bf4');

DROP TABLE IF EXISTS `user_groups`;
CREATE TABLE `user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `secret` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_group_id_secret` (`user_id`,`group_id`,`secret`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_groups` (`id`, `user_id`, `group_id`, `secret`) VALUES
(9,	2,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	4,	4,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	6,	3,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	7,	3,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(11,	7,	4,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `user_stories`;
CREATE TABLE `user_stories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `test_status_id` tinyint(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  `user_story` varchar(1000) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `statusId` (`test_status_id`),
  CONSTRAINT `user_stories_ibfk_2` FOREIGN KEY (`test_status_id`) REFERENCES `test_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2019-01-23 06:34:04

---- Create SQL Script on 2019-01-19

DROP TABLE IF EXISTS `milestones`;
CREATE TABLE `milestones` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `milestone_name` varchar(25) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `pid` int(10) DEFAULT NULL,
  `secret` text,
  `estimated_start_date` date DEFAULT NULL,
  `estimated_end_date` date DEFAULT NULL,
  `flag` tinytext,
  `status_value` tinytext,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`),
  CONSTRAINT `milestones_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `project_lists`;
CREATE TABLE `project_lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `mid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `secret` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mid` (`mid`),
  KEY `pid` (`pid`),
  CONSTRAINT `project_lists_ibfk_1` FOREIGN KEY (`mid`) REFERENCES `milestones` (`id`),



DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignee_id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `task_details` varchar(100) NOT NULL,
  `start_date` varchar(100) NOT NULL,
  `end_date` varchar(200) NOT NULL,
  `priority` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  `MID` int(11) NOT NULL,
  `project_lists_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Assignee` (`assignee_id`),
  KEY `Reporter` (`reporter_id`),
  KEY `MID` (`MID`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`MID`) REFERENCES `milestones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clients_id` int(11) NOT NULL,
  `project_name` varchar(50) NOT NULL,
  `project_description` varchar(2000) NOT NULL,
  `estimated_start_date` date NOT NULL,
  `estimated_hours` int(6) NOT NULL,
  `daily_estimated_hours` int(2) NOT NULL,
  `estimated_end_date` date NOT NULL,
  `dev_url` varchar(2000) NOT NULL,
  `qa_url` varchar(2000) NOT NULL,
  `po_url` varchar(2000) NOT NULL,
  `demo_url` varchar(2000) NOT NULL,
  `live_url` varchar(2000) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `client` (`clients_id`),
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`clients_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



  CONSTRAINT `project_lists_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `releases`;
CREATE TABLE `releases` (
  `id` bigint(4) NOT NULL AUTO_INCREMENT,
  `projects_id` int(11) NOT NULL,
  `release_no` varchar(4) NOT NULL,
  `version_no` varchar(10) NOT NULL,
  `release_date` date NOT NULL,
  `status` varchar(10) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`),
  KEY `projects_id` (`projects_id`),
  CONSTRAINT `releases_ibfk_1` FOREIGN KEY (`projects_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
