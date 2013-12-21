# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.34-0ubuntu0.12.04.1-log)
# Database: dev_db
# Generation Time: 2013-12-21 04:05:46 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Clients`;

CREATE TABLE `Clients` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `ssn` int(4) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table Keys
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Keys`;

CREATE TABLE `Keys` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table MonetaryClaims
# ------------------------------------------------------------

DROP TABLE IF EXISTS `MonetaryClaims`;

CREATE TABLE `MonetaryClaims` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `education` tinyint(1) DEFAULT NULL,
  `vrap_vre` tinyint(1) DEFAULT NULL,
  `aa_hb` tinyint(1) DEFAULT NULL,
  `care_taker` tinyint(1) DEFAULT NULL,
  `compensation` tinyint(1) DEFAULT NULL,
  `reopen` tinyint(1) DEFAULT NULL,
  `pension` tinyint(1) DEFAULT NULL,
  `iu` tinyint(1) DEFAULT NULL,
  `dic` tinyint(1) DEFAULT NULL,
  `burial_benefits` tinyint(1) DEFAULT NULL,
  `death_pension` tinyint(1) DEFAULT NULL,
  `sbp` tinyint(1) DEFAULT NULL,
  `arrears_of_pay` tinyint(1) DEFAULT NULL,
  `insurance` tinyint(1) DEFAULT NULL,
  `clothing_allowance` tinyint(1) DEFAULT NULL,
  `waiver_of_debt` tinyint(1) DEFAULT NULL,
  `crsc_crdp` tinyint(1) DEFAULT NULL,
  `visit_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  CONSTRAINT `MonetaryClaims_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `Visits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table NonMonetaryClaims
# ------------------------------------------------------------

DROP TABLE IF EXISTS `NonMonetaryClaims`;

CREATE TABLE `NonMonetaryClaims` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dd214_personnel_file` tinyint(1) DEFAULT NULL,
  `military_discharge_review` tinyint(1) DEFAULT NULL,
  `medal_request` tinyint(1) DEFAULT NULL,
  `home_loan_certificate` tinyint(1) DEFAULT NULL,
  `duty_to_assist_vcaa` tinyint(1) DEFAULT NULL,
  `health_care` tinyint(1) DEFAULT NULL,
  `dental` tinyint(1) DEFAULT NULL,
  `poa` tinyint(1) DEFAULT NULL,
  `vital_medical_records` tinyint(1) DEFAULT NULL,
  `nod` tinyint(1) DEFAULT NULL,
  `pmc` tinyint(1) DEFAULT NULL,
  `headstone_marker` tinyint(1) DEFAULT NULL,
  `direct_deposit` tinyint(1) DEFAULT NULL,
  `cemetery_registration` tinyint(1) DEFAULT NULL,
  `appeal` tinyint(1) DEFAULT NULL,
  `dependents_686c` tinyint(1) DEFAULT NULL,
  `school_attendance` tinyint(1) DEFAULT NULL,
  `change_of_address` tinyint(1) DEFAULT NULL,
  `dbq` tinyint(1) DEFAULT NULL,
  `add_info_evidence_4138` tinyint(1) DEFAULT NULL,
  `visit_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  CONSTRAINT `NonMonetaryClaims_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `Visits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table OtherClaims
# ------------------------------------------------------------

DROP TABLE IF EXISTS `OtherClaims`;

CREATE TABLE `OtherClaims` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status_of_claim` tinyint(1) DEFAULT NULL,
  `referral` tinyint(1) DEFAULT NULL,
  `forms` tinyint(1) DEFAULT NULL,
  `vetraspec_initial_set_up` tinyint(1) DEFAULT NULL,
  `eligibility_inquiry` tinyint(1) DEFAULT NULL,
  `copy` tinyint(1) DEFAULT NULL,
  `roi` tinyint(1) DEFAULT NULL,
  `personal_hearing` tinyint(1) DEFAULT NULL,
  `information` tinyint(1) DEFAULT NULL,
  `fax` tinyint(1) DEFAULT NULL,
  `office_appointment` tinyint(1) DEFAULT NULL,
  `verification_of_benefits` tinyint(1) DEFAULT NULL,
  `how_to_file_a_claim` tinyint(1) DEFAULT NULL,
  `email` tinyint(1) DEFAULT NULL,
  `visit_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  CONSTRAINT `OtherClaims_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `Visits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table Personnel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Personnel`;

CREATE TABLE `Personnel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(75) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(75) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table Visits
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Visits`;

CREATE TABLE `Visits` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `visit_date` datetime NOT NULL,
  `appointment` tinyint(1) DEFAULT NULL,
  `walk_in` tinyint(1) DEFAULT NULL,
  `drop_off` tinyint(1) DEFAULT NULL,
  `notes` text,
  `client_id` int(11) unsigned DEFAULT NULL,
  `personnel_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `personnel_id` (`personnel_id`),
  CONSTRAINT `Visits_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`),
  CONSTRAINT `Visits_ibfk_2` FOREIGN KEY (`personnel_id`) REFERENCES `Personnel` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
