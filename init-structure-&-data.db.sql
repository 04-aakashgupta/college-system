CREATE DATABASE  IF NOT EXISTS `college` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `college`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: college
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `attendence`
--

DROP TABLE IF EXISTS `attendence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendence` (
  `attendence_id` int NOT NULL AUTO_INCREMENT,
  `attendence_date` date NOT NULL DEFAULT (curdate()),
  `attendence_status` enum('present','absent') NOT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`attendence_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `attendence_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendence`
--

LOCK TABLES `attendence` WRITE;
/*!40000 ALTER TABLE `attendence` DISABLE KEYS */;
INSERT INTO `attendence` VALUES (1,'2025-08-12','present',2),(2,'2025-08-14','absent',1),(3,'2025-08-14','absent',2),(6,'2025-08-16','absent',1),(7,'2025-08-16','present',2),(19,'2025-08-18','absent',8),(20,'2025-08-22','present',8),(21,'2025-08-23','absent',1),(22,'2025-08-23','present',2);
/*!40000 ALTER TABLE `attendence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch`
--

DROP TABLE IF EXISTS `batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch` (
  `batch_id` int NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(30) NOT NULL,
  `batch_start_date` date DEFAULT NULL,
  `batch_end_date` date DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`batch_id`),
  KEY `course_id_forgion_key` (`course_id`),
  CONSTRAINT `course_id_forgion_key` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch`
--

LOCK TABLES `batch` WRITE;
/*!40000 ALTER TABLE `batch` DISABLE KEYS */;
INSERT INTO `batch` VALUES (2,'snlkfllmalsdfnmna','2025-08-29','2025-08-29',2),(3,'xyz2','2025-07-27','2025-08-27',2),(4,'abc','2025-07-16','2025-07-31',2),(20,'python batch','2025-08-16','2025-08-30',4),(21,'python3','2025-08-24','2025-08-30',4);
/*!40000 ALTER TABLE `batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(30) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (2,'xyz'),(3,'abc'),(4,'python'),(12,'java');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(30) NOT NULL,
  `student_gender` varchar(6) NOT NULL,
  `student_city` varchar(20) NOT NULL,
  `student_email` varchar(30) NOT NULL,
  `student_age` int NOT NULL,
  `batch_id` int DEFAULT NULL,
  `course_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_email_UNIQUE` (`student_email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `email_idx` (`student_email`),
  KEY `batch_id_idx` (`batch_id`),
  KEY `course_id` (`course_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `batch_id` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`),
  CONSTRAINT `course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'gaurav','male','pune','gaurav@gmail.com',21,3,2,2),(2,'bharav','male','pune','bharav@gmail.com',21,3,2,3),(8,'soham','male','panvel','2002.ansh.rathod@proton.me',21,20,4,11);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_email` varchar(30) NOT NULL,
  `user_password` varchar(30) NOT NULL,
  `user_type` varchar(30) NOT NULL,
  `user_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`),
  KEY `user_id_key_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('admin@gmail.com','admin123','admin',1),('gaurav@gmail.com','','student',2),('bharav@gmail.com','12345678','student',3),('2002.ansh.rathod@proton.me','123','student',11);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-31 19:42:26
