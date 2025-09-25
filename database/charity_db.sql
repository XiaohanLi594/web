-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: charity_db
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Charity Run','A charity fundraising event in the form of running'),(2,'Charity Auction','An event to raise funds by auctioning items'),(3,'Public Welfare Lecture','A knowledge-sharing event to spread public welfare...'),(4,'Charity Concert','A charity event in the form of a music performance'),(5,'Environmental Action','A public welfare activity focused on environmental...');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `goal_amount` decimal(10,2) NOT NULL,
  `current_amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `category_id` int NOT NULL,
  `org_id` int NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `category_id` (`category_id`),
  KEY `org_id` (`org_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2025 Love Charity Marathon','2025-10-15','City Center Stadium',50.00,10000.00,0.00,'active',1,1),(2,'Autumn Charity Art Auction','2025-11-05','Art Center Exhibition Hall',0.00,8000.00,0.00,'active',2,4),(3,'Environmental Public Welfare Lecture','2025-10-20','City Library Auditorium',20.00,5000.00,0.00,'active',3,3),(4,'Winter Charity Concert','2025-12-10','City Concert Hall',80.00,15000.00,0.00,'active',4,2),(5,'Community Cleanup Activity','2025-10-25','Community Park',0.00,3000.00,0.00,'active',5,3),(6,'Student Aid Charity Run','2025-11-20','Suburban Forest',40.00,9000.00,0.00,'active',1,1),(7,'Animal Protection Auction','2025-12-01','Pet Adoption Center',0.00,6000.00,0.00,'active',2,4),(8,'Eco-Technology Lecture','2025-11-10','Science Museum',30.00,7000.00,0.00,'active',3,3),(9,'Spring Symphony for Charity','2026-03-20','Grand Theater',100.00,20000.00,0.00,'active',4,2);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(100) NOT NULL,
  `mission` text,
  `contact` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'Love Public Welfare Foundation','Help children in poverty-stricken areas with educa...','lovefund@example.com','2025-09-24 02:27:36'),(2,'Art Charity Association','Help vulnerable groups gain development opportunit...','artcharity@example.com','2025-09-24 02:27:36'),(3,'Environmental Public Welfare Alliance','Promote environmental protection and safeguard nat...','greenalliance@example.com','2025-09-24 02:27:36'),(4,'Animal Protection Association','Care for stray animals and promote harmonious coex...','animalcare@example.com','2025-09-24 02:27:36');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25 17:38:59
