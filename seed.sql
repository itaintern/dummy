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

INSERT INTO `add_questions` (`id`, `qb_id`, `qs_id`, `is_deleted`, `secret`) VALUES
(5,	2,	2,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	2,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	1,	2,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `alerts` (`id`, `alerts_modules_operators_id`, `to_email`, `cc_email`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	'admin1,admin2',	'user1,user2,user3',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(13,	1,	'abc@yopmail.com',	'xyz@yopmail.com,pqr@yopmail.com,alpha@yopmail.com',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(14,	3,	'mymail.yopmail.com',	'nomail.yopmail.com',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `alerts_conditions` (`id`, `alerts_id`, `field`, `operator`, `compare_value`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	13,	'project_name',	'14',	'PERFEQTA',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	13,	'estimated_end_date',	'14',	'02-12-2020',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	14,	'release_date',	'14',	'1224555',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	14,	'status',	'14',	'done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	14,	'holiday_date',	'14',	'31-12-18',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	14,	'status',	'14',	'pending',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `appreciations` (`id`, `to_id`, `from_id`, `type`, `comment`, `appreciation_date`, `is_active_comment`, `status`, `is_deleted`, `secret`) VALUES
(1,	8,	6,	'xyz',	'nothing',	'2018-10-06',	1,	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `clients` (`id`, `companies_id`, `name`, `tie_up_date`, `contact_person`, `email`, `primary_contact_no`, `secondary_contact_no`, `address`, `city`, `state`, `country`, `zip_code`, `status`, `is_deleted`, `secret`) VALUES
(4,	13,	'ProTSystem Pvt.Ltd',	'2018-01-05',	'Sahin Pathan',	'Sahinpathan@gmail.com',	'76568965',	'76568968',	'maninager',	'nadiad',	'gujarat',	'India',	26556,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	14,	'Vb soft pvt ltd',	'2018-03-03',	'pooja',	'pooja@gmail.com',	'7545555555',	'7545555555',	'ahmedabad',	'ahmedabad',	'Gujrate',	'UK',	2655611,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	13,	'Myra pvt ltd',	'2018-02-13',	'Rechal',	'Rechal1234@gmail.com',	'1236547895',	'8974563215',	'Alaska',	'Alaska',	'Ocla Hama',	'US',	356856,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	13,	'Sigma Blood',	'2018-03-03',	'Max',	'max@gmail.com',	'9585555646',	'1235686565',	'Green Place',	'ahmedabad',	'gujarat',	'India',	3568552,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	20,	'Perfeqta pvt ltd',	'2018-10-30',	'contact person',	'mail@mail.com',	'987654321',	'9988776655',	'address',	'city',	'state',	'india',	112233,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `company_holidays` (`id`, `companies_id`, `holiday_date`, `discription`, `subject`, `message`, `type`, `status`, `is_deleted`, `secret`) VALUES
(6,	14,	'2018-04-14',	'Enjoy1',	'uttarayan',	'Take care your self',	'half DAy',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	18,	'2018-11-11',	'celebration',	'Gandhi Jayanti',	'National holiday',	'Full Day',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	18,	'2018-10-10',	'password',	'password change',	'password',	'password',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	13,	'2018-10-10',	'organizationName',	'organizationName',	'organizationName',	'organizationName',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	14,	'2018-11-07',	'date test edit',	'date test edit',	'date test edit',	'date test edit',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(11,	21,	'2018-11-13',	'date done',	'date done',	'date work done',	'date done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(12,	20,	'2018-10-23',	'bbjbb',	'jhbjlbhb',	'hjbjbhbhj',	'bhjbhblblhbh',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(13,	16,	'2018-10-03',	'hse lo',	'hmmm',	'pass',	'planned',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `company_modules` (`id`, `companies_id`, `sub_modules_id`, `modules_id`, `display_title`, `status`, `is_deleted`, `secret`) VALUES
(2,	13,	3,	6,	'WeLearn',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	13,	3,	6,	'WeTrack',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	18,	6,	9,	'moduuules',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	20,	5,	6,	'my done',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	19,	6,	6,	'checkes',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `course_modules` (`id`, `manage_courses_id`, `learning_modules_Id`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	2,	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	2,	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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
(4,	13,	'Business Analyst',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	14,	'Developer',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	17,	'tum muje khun do',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `documents` (`id`, `employees_id`, `companies_id`, `title`, `type`, `file`, `status`, `is_deleted`, `secret`) VALUES
(6,	6,	14,	'title',	'Full Day',	'full file',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	8,	21,	'Myra The Boutique',	'feshion',	'feshion.mayra.txt',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `email_templates` (`id`, `type`, `subject`, `body`, `is_active`, `is_deleted`, `secret`) VALUES
(3,	'internal',	'leave application',	'hello, here by i \'m writing this email <<enter your reason>>',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'internal',	'emergency leave',	'hello, here by i \'m writing this email <<enter your reason>>',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `employees` (`id`, `departments_id`, `designations_id`, `roles_id`, `companies_id`, `employee_number`, `last_name`, `first_name`, `display_name`, `join_date`, `leave_date`, `birth_date`, `contact_number`, `emergency_number`, `primary_email`, `secondary_email`, `address`, `password`, `state`, `country`, `zipcode`, `city`, `is_primary`, `profile_picture`, `status`, `is_deleted`, `secret`) VALUES
(6,	3,	4,	6,	13,	'E-99',	'Pathan',	'Sahin',	'sahu',	'2017-12-13',	'2018-01-13',	'1996-04-12',	'1234567895',	'7896541235',	'sahin123@gmail.com',	'sahu123@gmail.com',	'vadgam',	'12345678',	'gujrat',	'india',	'384510',	'vadgam',	1,	'xyz',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	4,	5,	6,	13,	'123452',	'Bhati',	'Pooja',	'pinu',	'2018-04-13',	'2018-04-20',	'2018-04-06',	'1147544444',	'7777788877',	'pooja123@gmail.com',	'pinu@gmail.com',	'Green Place',	'123456',	'gujarat',	'India',	'6655455',	'ahmedabad',	NULL,	NULL,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	3,	4,	7,	14,	'E-89',	'rechal',	'max',	'max@gmail.com',	'2018-04-01',	'2018-04-26',	'1998-05-01',	'7888555686',	'5556869545',	'max@gmail.com',	'max@gmail.com',	'Green Place',	'xyz1234564',	'Gujrate',	'India',	'6655455',	'Ahemedabad',	NULL,	NULL,	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(11,	4,	5,	7,	20,	'emp93',	'kadchha',	'ud',	'ud',	'2018-10-12',	'2018-10-19',	'2018-10-26',	'8866008907',	'8866008907',	'kadchhaud@gmail.comm',	'kadchhaud@gmail.com',	'drive in road',	'udkadchha',	'done',	'India',	'380015',	'ahmedabad',	1,	'ud.png',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` text,
  `secret` varchar(50) DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `files` (`id`, `file`, `secret`) VALUES
(1,	'uploads/files/1-test',	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `groups` (`id`, `title`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'PERFEQTA',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'VC4',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'My Group',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `learning_modules` (`id`, `status_id`, `title`, `content`, `link`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	'abc',	'abc',	'abc',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `leave_requests` (`id`, `from_id`, `to_id`, `cc_email`, `message`, `start_date`, `end_date`, `type`, `leave_status`, `reason`, `is_paid`, `status`, `is_deleted`, `secret`) VALUES
(1,	6,	6,	NULL,	'Apply for leave',	'2018-04-01',	'2017-12-13',	'Full Day',	'Reject',	'you take lot of leaves',	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	8,	6,	'megnapatel@gmail.com',	'attending friend\'s wedding',	'2018-04-01',	'2018-04-02',	'Full Day',	'pending',	'',	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	6,	8,	NULL,	'sick leave',	'2018-04-29',	NULL,	'First Half',	'Approve',	'This is your last unpaid leave. take care',	0,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	10,	11,	'ccemail@mail.com',	'new message',	'2018-10-11 18:30:00',	'2018-10-11 18:30:00',	'half day',	'Approve',	'function',	0,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `manage_batches` (`id`, `manage_courses_id`, `status_id`, `title`, `start_date`, `end_date`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	'abcd',	'2017-12-13',	'2018-04-06',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	2,	1,	'Myra The Boutique',	'2018-10-19',	'2018-10-31',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	2,	1,	'Myra The Boutique',	'2018-11-13',	'2018-11-29',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	1,	1,	'abcd',	'2017-12-13',	'2018-11-13',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `manage_courses` (`id`, `learning_modules_id`, `duration_types_id`, `status_id`, `title`, `description`, `duration`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	2,	'xyz',	'abcd',	1,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	1,	2,	1,	'ewrewr',	'sdsas',	5,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	1,	1,	1,	'Myra The Boutique',	'beautique shop & cloths',	1234567890,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	1,	3,	1,	'change',	'changes is done',	10,	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `manage_quizes` (`id`, `question_sets_id`, `users_id`, `date`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	'2018-03-03',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	2,	4,	'2018-10-31',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	2,	3,	'2018-10-30',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `milestones`;
CREATE TABLE `milestones` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `milestone_name` varchar(25) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `pid` int(10) DEFAULT NULL,
  `eid` int(10) DEFAULT NULL,
  `secret` text,
  `estimated_start_date` date DEFAULT NULL,
  `estimated_end_date` date DEFAULT NULL,
  `flag` tinytext,
  `status_value` tinytext,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`),
  KEY `eid` (`eid`),
  CONSTRAINT `milestones_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `milestones_ibfk_2` FOREIGN KEY (`eid`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `milestones` (`id`, `milestone_name`, `pid`, `eid`, `secret`, `estimated_start_date`, `estimated_end_date`, `flag`, `status_value`) VALUES
(2,	'Hello',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-03',	'2019-03-04',	'External',	'Released'),
(3,	'Version 1.0',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-04-05',	'2019-05-06',	'External',	'Released'),
(4,	'maneesh',	6,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	NULL,	NULL),
(28,	'Myra',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	NULL,	NULL),
(29,	'Perfeqta',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	NULL,	NULL),
(30,	'mk',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	NULL,	NULL),
(31,	'dfghj',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	NULL,	NULL),
(33,	'gjdasd',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-11',	'2019-02-27',	'Internal',	'Released'),
(34,	'kmasd',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-12',	'2019-02-24',	'Internal',	'Released'),
(35,	'gfy',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-11',	'2019-02-27',	'Internal',	'Un-released'),
(36,	'mmmmm',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-11',	'2019-02-14',	'Internal',	'Released'),
(45,	'jcvzmxc',	6,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-03',	'2019-02-27',	'Internal',	'Un-released'),
(46,	'Milestone 1',	17,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-02-13',	'2019-02-19',	'Internal',	'Un-released'),
(47,	'zxczxcsd',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	'Internal',	NULL),
(48,	'z',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	NULL,	NULL,	'Internal',	NULL),
(49,	'Version 1.1',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-03-07',	'2019-03-28',	'External',	'Un-released'),
(53,	'Ver',	5,	NULL,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-03-13',	'2019-03-26',	'External',	'Released'),
(54,	'Ver',	NULL,	11,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	'2019-03-13',	'2019-03-22',	'Internal',	'Archieved');

DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` int(11) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `modules` (`id`, `title`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'Tasks',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'Releases',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'Test Execution',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'Manage Batches',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	'Schedule Quizes',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	'Holidays',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	'WeLearn',	1,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	'WeTrack',	1,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	'WeTest',	1,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	'Myra The Boutiques',	1,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(11,	'Projects',	1,	1,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(12,	'Hello',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `organizations` (`id`, `name`, `email`, `license`, `validity`, `org_secret`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'Default Organization',	'superadmin@example.com',	'super',	'0001-01-01 00:00:00',	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'ncashkd',	'jdcdsjfsa@yopmail.com',	'basic',	'2018-10-03 18:30:00',	'666962a1-5f17-4ec5-9546-7defc610a8ad',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'ProT',	'prot@yopmail.com',	'basic',	'2018-10-05 18:30:00',	'0cf3c7c4-58de-4937-84d5-a5b6a6915bf4',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `organization_profile` (`id`, `domain_code`, `primary_contact_person`, `secondary_contact_person`, `primary_contact_no`, `secondary_contact_no`, `address`, `state`, `city`, `country`, `zip_code`, `logo`, `display_title`, `sn_no`, `gst_no`, `status`, `is_deleted`, `secret`) VALUES
(13,	'toptech.com',	'sahin pathan',	'Dhaval Patel',	'7778044598',	'9784268565',	'govind vadi',	'Gujrate',	'nadiad',	'US',	26556,	'toptech.jpg',	'Top Technologies',	'SN65855',	'6E845566',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(14,	'prot.com',	'Meghna Vyash',	'Om Talsania',	'9598989895',	'7685474855',	'S.G.Road',	'gujarat',	'ahmedabad',	'India',	382445,	'prot.png',	'ProTSystems',	'SN655484',	'6E845587',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(16,	'prot',	'prot',	'kjhgfds',	'kjhgfrds',	'kjhgfd',	',kjhgf',	'Rajasthan',	'ahmedabad',	'UK',	55,	'prot',	'iuytre',	'14',	'55',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(17,	'ertyu',	'oiuy',	'oiuytre',	'kjuytr',	'likuyhtgf',	'klijhyg',	'Gujrate',	'ahmedabad',	'US',	656,	NULL,	'ytre',	'55',	'85',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(18,	'myfriend',	'uday',	'chirag',	'8866008907',	'8866008907',	'iscon',	'gujarat',	'ahmedabad',	'india',	380015,	'NO logo',	'UD company',	'8907',	'8907008907',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(19,	'organization code',	'i am',	'you are',	'123456789',	'987654321',	'iscon baleshwar 303',	'gujarat',	'ahmedabad',	'india',	380015,	'imlogo',	'organization company',	'SN112233',	'112233',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(20,	'98765',	'myCOMPANY',	'myCOMPANY',	'9876543210',	'9876543210',	'myCOMPANY',	'myCOMPANY',	'myCOMPANY',	'myCOMPANY',	987654,	'myCOMPANY',	'myCOMPANY',	'987',	'987654',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(21,	'1641',	'kjnjjkn',	'kjnkjknj',	'1564554520',	'2589631470',	'njnnn',	'jbjbjb',	'jbjbbjb',	'jbbjbj',	255882,	'bjbjbjb',	'jbjbjbjj',	'58924',	'13165468',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `profiles` (`id`, `users_id`, `departments_id`, `designations_id`, `roles_id`, `companies_id`, `employee_number`, `first_name`, `last_name`, `display_name`, `join_date`, `leave_date`, `birth_date`, `contact_number`, `emergency_number`, `primary_email`, `secondary_email`, `address`, `password`, `state`, `country`, `zipCode`, `city`, `is_primary`, `profile_picture`, `status`, `is_deleted`, `secret`) VALUES
(6,	1,	3,	4,	6,	13,	'E-99',	'Sahin',	'Pathan',	'sahu',	'2017-12-13',	'2018-01-13',	'1996-04-12',	'1234567895',	'7896541235',	'sahin123@gmail.com',	'sahu123@gmail.com',	'vadgam',	'12345678',	'gujrat',	'india',	'384510',	'vadgam',	1,	'xyz',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	1,	4,	5,	6,	13,	'123452',	'Pooja',	'Bhati',	'pinu',	'2018-04-13',	'2018-04-20',	'2018-04-06',	'1147544444',	'7777788877',	'pooja123@gmail.com',	'pinu@gmail.com',	'Green Place',	'123456',	'gujarat',	'India',	'6655455',	'ahmedabad',	NULL,	NULL,	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	1,	3,	4,	7,	14,	'E-89',	'max',	'rechal',	'max@gmail.com',	'2018-04-01',	'2018-04-26',	'1998-05-01',	'7888555686',	'5556869545',	'max@gmail.com',	'max@gmail.com',	'Green Place',	'xyz1234564',	'Gujrate',	'India',	'6655455',	'Ahemedabad',	NULL,	NULL,	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `projects` (`id`, `clients_id`, `project_name`, `project_description`, `estimated_start_date`, `estimated_hours`, `daily_estimated_hours`, `estimated_end_date`, `dev_url`, `qa_url`, `po_url`, `demo_url`, `live_url`, `version`, `type`, `is_active`, `is_deleted`, `secret`) VALUES
(5,	4,	'Myra',	'Saas base multi tenant web application',	'2018-02-12',	89,	5,	'2018-08-25',	'test.dev.yousocial.com',	'test.qa.yousocial.com',	'test.po.yousocial.com',	'test.domo.yousocial.com',	'www.yousocial.com',	1,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	4,	'Bizsuite-Bizsuite',	'For project management',	'2018-02-12',	84,	5,	'2018-02-17',	'test.dev.wetrack.com',	'test.qa.wetrack.com',	'test.po.wetrack.com',	'test.demo.wetrack.com',	'www.wetrack.com',	2,	'External',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	8,	'Bizforms',	'For firms management',	'2018-04-01',	300,	9,	'2018-11-30',	'dev.biomaketpalce.com',	'nbeqa.biomarketplace.com',	'nbepo.biomarketplace.com',	'demonbe.biomarketplace.com',	'Live.niomarketplace.com',	3,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	8,	'Perfeqta',	'Available for all',	'2018-10-11',	30,	6,	'2018-10-22',	'i don\'t know dev url.com',	'i don\'t know qa url.com',	'i don\'t know po url.com',	'i don\'t know demo url.com',	'i don\'t know demo url.com',	19,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	8,	'Wesuite',	'For personal use',	'2018-10-25',	25,	3,	'2018-10-25',	'dfghjkl@mail.com',	'redtfyhuijo@mail.com',	'xdfcgvhbnm@mail.com',	'trfgyuhjk@mail.com',	'cfgvhbjnkm@mail.com',	334455,	'Internal',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(17,	4,	'Boutique Management',	'For retailer',	'2019-02-13',	20,	2,	'2019-02-20',	'dev.com',	'qa.com',	'po.com',	'demo.com',	'live.com',	1,	'External',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(18,	4,	'Mobile application',	'To develop Mobile application',	'2019-01-03',	50,	2,	'2019-03-05',	'dev.com',	'qa.com',	'po.com',	'demo.com',	'live.com',	1,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(19,	8,	'Local App',	'For general usage',	'2019-02-02',	60,	2,	'2019-03-03',	'dev.com',	'qa.com',	'po.com',	'demo.com',	'live.com',	1,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(20,	8,	'Kashyap',	'Testing Testing',	'2019-02-21',	0,	0,	'2019-03-02',	'',	'',	'',	'',	'',	2,	'External',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(21,	8,	'Global App',	'Testing',	'2019-03-07',	0,	0,	'2019-03-14',	'',	'',	'',	'',	'',	2,	'Internal',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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
  CONSTRAINT `project_lists_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `project_lists` (`id`, `name`, `mid`, `pid`, `secret`) VALUES
(2,	'maneesh',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'xzbkjz',	33,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'pl4',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	'km',	28,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	'dasdsad',	33,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(19,	'mani',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(20,	'kmas',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(21,	'abc',	3,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(22,	'abc',	36,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(23,	'zgvjs',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(24,	'kml',	3,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(25,	'mk',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(26,	'hb',	31,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(27,	'ksingh',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(28,	'kh',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(29,	'mn',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(30,	'kkkk',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(31,	'kmsa',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(32,	'kml',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(33,	'kmla',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(34,	'kmshivam',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(35,	'klm',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(36,	'kn',	28,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(37,	'manusingh',	28,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(38,	'annu',	29,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(39,	'annu',	29,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(40,	'annu',	29,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(41,	'mk',	30,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(42,	'mk',	30,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(43,	'mksingh',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(44,	'mnxsa',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(45,	'mv',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(46,	'm',	3,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(47,	'ma',	28,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(48,	'mk',	28,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(49,	'Iteration 1',	46,	17,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(50,	'gg',	45,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(51,	'gf',	47,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(52,	'aaa',	2,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(53,	'what is it',	3,	5,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `question_banks` (`id`, `manage_courses_id`, `qus`, `option1`, `option2`, `option3`, `option4`, `ans`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	'abc',	'as',	'ft',	'fgf',	'fthj',	'as',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	2,	'secound',	'secound',	'secound',	'secound',	'secound',	'secound',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	1,	'question',	'option1',	'option2',	'option3',	'option4',	'answer',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	4,	'how much option is given in KBC',	'1',	'2',	'3',	'4',	'4',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `question_sets`;
CREATE TABLE `question_sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `question_sets` (`id`, `title`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'abc',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'set secound',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'new course set',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'my question set',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `releases` (`id`, `projects_id`, `release_no`, `version_no`, `release_date`, `status`, `is_deleted`, `secret`) VALUES
(1,	5,	'r01',	'1.2',	'2018-04-05',	'upcoming',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	6,	'11',	'11',	'2018-07-15',	'Done',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	7,	'6659',	'VN436',	'2018-10-18',	'done',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	8,	'RN34',	'vn978',	'2018-10-29',	'done',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	9,	'RN34',	'vn978',	'2018-11-13',	'done',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	5,	'RN34',	'vn978',	'2018-11-22',	'done',	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '1',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `roles` (`id`, `title`, `status`, `is_deleted`, `secret`) VALUES
(6,	'intern',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	'Super Admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	'Manager',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(9,	'User',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(10,	'Company Manager',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `schedule_quizes` (`id`, `question_sets_id`, `users_id`, `date`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	'2018-03-03',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	3,	3,	'2018-11-14',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	4,	4,	'2018-10-30',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	3,	3,	'2018-11-13',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(4) DEFAULT '0',
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `status` (`id`, `title`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	'running',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'pending',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `sub_modules` (`id`, `modules_id`, `title`, `status`, `is_deleted`, `secret`) VALUES
(3,	7,	'leave management',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	6,	'employee managment',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	8,	'Holiday',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	9,	'Quiz',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `tasks` (`id`, `assignee_id`, `reporter_id`, `task_details`, `start_date`, `end_date`, `priority`, `status`, `is_active`, `is_deleted`, `secret`, `MID`, `project_lists_id`, `title`) VALUES
(23,	6,	10,	'asdjbasmd',	'',	'',	'Medium',	'Not Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	2,	2,	'fdahsd'),
(30,	6,	6,	'gsdagd',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	2,	4,	'fg'),
(33,	6,	6,	'zxzhc',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	28,	36,	'zxgZHX'),
(37,	6,	6,	'zxczxc',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	4,	4,	'szssf'),
(40,	6,	8,	'xczxc',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	4,	4,	'zchjcbzkhc'),
(46,	6,	8,	'v',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	4,	4,	'fvnb'),
(47,	6,	8,	'sadasd',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	47,	0,	'sdasm,'),
(48,	6,	8,	'zczxx',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	47,	0,	'sanm'),
(49,	6,	8,	'zcz',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	47,	51,	'zxvznx'),
(56,	6,	8,	'njbuy',	'',	'',	'Medium',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	3,	21,	'bvgyg'),
(63,	6,	8,	'hgy',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	30,	41,	'mkjj'),
(64,	6,	8,	'vytv',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	30,	0,	'hhvg'),
(65,	6,	8,	'fyctr',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	30,	41,	'kaml'),
(66,	6,	8,	'hf ghcfh',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	31,	0,	'jbgvyt'),
(67,	6,	8,	'g hgjb',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	31,	26,	'hvg'),
(68,	6,	8,	'vhgvy',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	31,	26,	'maneesh'),
(69,	6,	6,	'Suste',	'',	'',	'Medium',	'Not Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	3,	24,	'System'),
(70,	6,	6,	'njb',	'',	'',	'Medium',	'Not Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	3,	24,	'kam'),
(71,	6,	6,	'vbj',	'',	'',	'Medium',	'Not Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	3,	21,	'new task'),
(72,	6,	6,	'jgjb',	'',	'',	'Medium',	'Not Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	28,	0,	'kamalesh'),
(73,	6,	6,	'man',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	45,	0,	'man'),
(74,	6,	6,	'man1',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	45,	50,	'man1'),
(75,	6,	6,	'bjh jf',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	45,	50,	'manjkf'),
(76,	6,	6,	'kamlesh',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	45,	50,	'kamlesh'),
(77,	6,	6,	'manesh',	'',	'',	'Low',	'Done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e',	45,	50,	'manesh');

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

INSERT INTO `test_cases` (`id`, `backlog_id`, `test_status_id`, `testcase_no`, `testcase_description`, `access_path`, `precondition`, `test_step`, `test_data`, `expected_result`, `creation_date`, `execution_date`, `remark`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	3,	't01',	'login',	'home',	'username',	'check username and pwd',	'username',	'successfully login',	'2018-04-05',	'2018-04-05',	'done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	1,	2,	'P1',	'ccds',	'DCFSduuserdufk',	'DCSDF',	'FES',	'FSSD',	'DSDCDSV',	'2018-04-05',	'2018-04-05',	'NONE',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	1,	2,	'101',	'qwq',	'wdsds',	'ssad',	'asdd',	'asdd',	'sad',	'2018-06-29',	'2018-07-27',	'dsasd',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	1,	3,	'134',	'AaBbCcDd',	'AaBbCcDd',	'AaBbCcDd',	'AaBbCcDd',	'AaBbCcDd',	'AaBbCcDd',	'2018-10-17',	'2018-10-30',	'AaBbCcDd',	0,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(5,	2,	3,	'57968',	'case done',	'path/access.com',	'nothing',	'step by step',	'no data',	'unexpected',	'2018-10-28',	'2018-10-28',	'0mark',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `test_executions` (`id`, `test_cases_id`, `backlog_id`, `test_plans_id`, `test_status_id`, `estimated_hours`, `comments`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	1,	1,	24,	'good',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	3,	1,	2,	3,	32,	'no comments plz',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	5,	2,	2,	3,	58,	'nooooooooo',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `test_plans` (`id`, `backlog_id`, `test_cases_id`, `test_status_id`, `estimated_hours`, `version_name`, `release_date`, `bug_verification`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	1,	2,	24,	'1.02',	'2018-04-05',	'cleared',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	1,	3,	1,	25,	'vr56',	'2018-10-10',	'27verify',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	2,	3,	2,	59,	'V507',	'2018-10-28',	'done',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

DROP TABLE IF EXISTS `test_status`;
CREATE TABLE `test_status` (
  `id` tinyint(1) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `secret` varchar(50) NOT NULL DEFAULT '206b2dbe-ecc9-490b-b81b-83767288bc5e',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `test_status` (`id`, `name`, `secret`) VALUES
(1,	'pending',	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'pass',	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'fail',	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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
(1,	'superadmin@example.com',	'superadmin',	'17c4520f6cfd1ab53d8745e84681eb49',	'c2c0796e-a4ca-45f0-a983-df4bd159deee',	'2019-01-23 14:21:56',	'superadmin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	'admin@example.com',	'admin',	'21232f297a57a5a743894a0e4a801fc3',	'155e1f92-5b2f-427b-a918-e8e32c4a95f9',	'2019-03-07 12:28:13',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(3,	'user@example.com',	'user',	'ee11cbb19052e40b07aac0ca060c23ee',	'158af41e-804a-44a1-ae6c-67d96e57e000',	'2019-01-30 07:05:27',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(4,	'uday@yopmail.com',	'uday',	'79ab5af2f180d47599bf0dd0e46a2184',	'12345',	'2018-02-02 00:00:00',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(6,	'jaimini@yopmail.com',	'jaimini',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'42b90e29-4625-4b5b-b451-b29a8e8b6af1',	'0001-01-01 00:00:00',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(7,	'anjana@yopmail.com',	'anjana',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'bc0271f6-8d2b-4fb4-b549-3fa382f8c2a2',	'2018-10-02 15:10:17',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(8,	'prot@yopmail.com',	'protsss',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'3e153d7b-31f3-452d-8795-198ed544367f',	'2018-10-22 10:08:40',	'admin',	1,	0,	'0cf3c7c4-58de-4937-84d5-a5b6a6915bf4'),
(9,	'jdcdsjfsa@yopmail.com',	'abcd',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'1',	'0001-01-01 00:00:00',	'admin',	1,	0,	'666962a1-5f17-4ec5-9546-7defc610a8ad'),
(10,	'uday2@yopmail.com',	'uday',	'21232f297a57a5a743894a0e4a801fc3',	'6c9f7215-bfdd-4a07-95c1-bf8a136d36e5',	'2018-10-22 10:11:09',	'user',	1,	0,	'0cf3c7c4-58de-4937-84d5-a5b6a6915bf4'),
(11,	'dukemaneesh@gmail.com',	'dukemaneesh',	'0579f54362eac718670079c4d86af9a8',	'1',	'0001-01-01 00:00:00',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(13,	'aky@gmail.com',	'aky',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'1',	'0001-01-01 00:00:00',	'user',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(14,	'hemal@example.com',	'Hemal',	'57abfacd028cb0bf3f0e8f26ac9c4589',	'1',	'0001-01-01 00:00:00',	'admin',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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

INSERT INTO `user_stories` (`id`, `test_status_id`, `title`, `user_story`, `is_active`, `is_deleted`, `secret`) VALUES
(1,	1,	'screen',	'us1',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e'),
(2,	1,	'i\'m title',	'nothing',	1,	0,	'206b2dbe-ecc9-490b-b81b-83767288bc5e');

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
  CONSTRAINT `project_lists_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`)
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


ALTER TABLE `milestones`
ADD `is_deleted` tinyint(1) NULL DEFAULT '0';
