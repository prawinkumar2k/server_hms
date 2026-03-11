/*
 Navicat Premium Dump SQL

 Source Server         : my sql
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : localhost:3306
 Source Schema         : hms

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 10/03/2026 09:15:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activate
-- ----------------------------
DROP TABLE IF EXISTS `activate`;
CREATE TABLE `activate`  (
  `SerialNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ActivationKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MacAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ActDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ConfirmKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SMode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ClgCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ClgName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ClgCity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CloseDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activate
-- ----------------------------
INSERT INTO `activate` VALUES ('760163', '577869261174', 'EBFB10000706E5RAM', '27-Feb-2025', 'nan', '100', '0', 'nan', 'nan', '05-Mar-2025');

-- ----------------------------
-- Table structure for activity_logs
-- ----------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `timestamp` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of activity_logs
-- ----------------------------

-- ----------------------------
-- Table structure for appointment_transactions
-- ----------------------------
DROP TABLE IF EXISTS `appointment_transactions`;
CREATE TABLE `appointment_transactions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `amount` decimal(10, 2) NULL DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Paid',
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `appointment_id`(`appointment_id` ASC) USING BTREE,
  CONSTRAINT `appointment_transactions_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of appointment_transactions
-- ----------------------------

-- ----------------------------
-- Table structure for appointments
-- ----------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `doctor_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  `time` time NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Scheduled',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_appointments_patient`(`patient_name` ASC) USING BTREE,
  INDEX `idx_appointments_doctor`(`doctor_name` ASC) USING BTREE,
  INDEX `idx_appointments_date`(`date` ASC) USING BTREE,
  INDEX `idx_appointments_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES (1, 'Elango', 'Dr.Manoj', '2026-01-10', '09:00:00', 'Completed', '', '2026-01-10 14:05:31');
INSERT INTO `appointments` VALUES (2, 'Manoj HAriharan T', 'Dr. Hari', '2026-01-10', '09:00:00', 'Completed', '', '2026-01-10 16:49:28');
INSERT INTO `appointments` VALUES (3, 'Manoj', 'Elango', '2026-01-11', '09:00:00', 'Completed', '', '2026-01-11 10:03:41');
INSERT INTO `appointments` VALUES (4, 'ertyui', 'ghjk,', '2026-01-11', '13:00:00', 'Completed', '', '2026-01-11 10:38:07');
INSERT INTO `appointments` VALUES (5, 'INDHUMATHI', 'Dr. Smith', '2026-01-11', '10:00:00', 'Completed', 'General Checkup', '2026-01-11 10:49:25');
INSERT INTO `appointments` VALUES (6, 'elango', 'Dr.Arjun', '2026-01-11', '09:00:00', 'Completed', 'hh', '2026-01-11 13:08:18');
INSERT INTO `appointments` VALUES (7, 'Aadhi', 'Dr.Manoj', '2026-01-23', '09:00:00', 'Completed', 'monthly checkup', '2026-01-23 09:19:17');
INSERT INTO `appointments` VALUES (8, 'dhaya', 'Dr.Manoj', '2026-01-30', '09:00:00', 'Completed', '', '2026-01-30 10:15:50');
INSERT INTO `appointments` VALUES (9, 'Nithish', 'DR. Manoj', '2026-03-02', '09:00:00', 'Completed', 'head ache', '2026-03-02 11:59:12');

-- ----------------------------
-- Table structure for attendance_logs
-- ----------------------------
DROP TABLE IF EXISTS `attendance_logs`;
CREATE TABLE `attendance_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `shift_id` int NULL DEFAULT NULL,
  `in_time` time NULL DEFAULT NULL,
  `out_time` time NULL DEFAULT NULL,
  `status` enum('Present','Absent','Half Day','Leave','Holiday','Weekly Off') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Absent',
  `late_mins` int NULL DEFAULT 0,
  `early_exit_mins` int NULL DEFAULT 0,
  `overtime_hours` decimal(5, 2) NULL DEFAULT 0.00,
  `is_manual_entry` tinyint(1) NULL DEFAULT 0,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_emp_date`(`employee_id` ASC, `date` ASC) USING BTREE,
  INDEX `shift_id`(`shift_id` ASC) USING BTREE,
  INDEX `idx_attendance_employee`(`employee_id` ASC) USING BTREE,
  INDEX `idx_attendance_date`(`date` ASC) USING BTREE,
  CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `attendance_logs_ibfk_2` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of attendance_logs
-- ----------------------------

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `performed_by` int NULL DEFAULT NULL,
  `previous_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `new_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_audit_timestamp`(`timestamp` ASC) USING BTREE,
  INDEX `idx_audit_entity`(`entity_type` ASC) USING BTREE,
  INDEX `idx_audit_user`(`performed_by` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 127 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of audit_logs
-- ----------------------------
INSERT INTO `audit_logs` VALUES (1, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:22:56');
INSERT INTO `audit_logs` VALUES (2, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:23:25');
INSERT INTO `audit_logs` VALUES (3, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:24:09');
INSERT INTO `audit_logs` VALUES (4, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:28:27');
INSERT INTO `audit_logs` VALUES (5, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:29:44');
INSERT INTO `audit_logs` VALUES (6, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 19:30:27');
INSERT INTO `audit_logs` VALUES (7, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:15:53');
INSERT INTO `audit_logs` VALUES (8, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:17:31');
INSERT INTO `audit_logs` VALUES (9, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:31:31');
INSERT INTO `audit_logs` VALUES (10, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:40:08');
INSERT INTO `audit_logs` VALUES (11, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:40:32');
INSERT INTO `audit_logs` VALUES (12, 'LOGIN', 'Cheif surgeon', '31', 31, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-17 20:55:03');
INSERT INTO `audit_logs` VALUES (13, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 18:35:52');
INSERT INTO `audit_logs` VALUES (14, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 18:36:41');
INSERT INTO `audit_logs` VALUES (15, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 18:36:54');
INSERT INTO `audit_logs` VALUES (16, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 18:37:04');
INSERT INTO `audit_logs` VALUES (17, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:03:20');
INSERT INTO `audit_logs` VALUES (18, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:03:39');
INSERT INTO `audit_logs` VALUES (19, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:06:16');
INSERT INTO `audit_logs` VALUES (20, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:08:31');
INSERT INTO `audit_logs` VALUES (21, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:12:55');
INSERT INTO `audit_logs` VALUES (22, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:33:30');
INSERT INTO `audit_logs` VALUES (23, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:34:06');
INSERT INTO `audit_logs` VALUES (24, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:38:12');
INSERT INTO `audit_logs` VALUES (25, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:39:34');
INSERT INTO `audit_logs` VALUES (26, 'LOGIN', 'PHARMA_MASTER', '11', 11, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-18 19:40:07');
INSERT INTO `audit_logs` VALUES (27, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 18:30:05');
INSERT INTO `audit_logs` VALUES (28, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 18:31:39');
INSERT INTO `audit_logs` VALUES (29, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 18:51:27');
INSERT INTO `audit_logs` VALUES (30, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 18:52:38');
INSERT INTO `audit_logs` VALUES (31, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 18:52:53');
INSERT INTO `audit_logs` VALUES (32, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:01:18');
INSERT INTO `audit_logs` VALUES (33, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:03:14');
INSERT INTO `audit_logs` VALUES (34, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:12:39');
INSERT INTO `audit_logs` VALUES (35, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:15:08');
INSERT INTO `audit_logs` VALUES (36, 'LOGIN', 'USER', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:17:07');
INSERT INTO `audit_logs` VALUES (37, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:19:12');
INSERT INTO `audit_logs` VALUES (38, 'LOGIN', 'Cheif surgeon', '31', 31, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:20:44');
INSERT INTO `audit_logs` VALUES (39, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-24 19:21:23');
INSERT INTO `audit_logs` VALUES (40, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 10:48:55');
INSERT INTO `audit_logs` VALUES (41, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 10:51:50');
INSERT INTO `audit_logs` VALUES (42, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 10:52:56');
INSERT INTO `audit_logs` VALUES (43, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:30:38');
INSERT INTO `audit_logs` VALUES (44, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:31:18');
INSERT INTO `audit_logs` VALUES (45, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:33:45');
INSERT INTO `audit_logs` VALUES (46, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:39:59');
INSERT INTO `audit_logs` VALUES (47, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:45:58');
INSERT INTO `audit_logs` VALUES (48, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 18:52:24');
INSERT INTO `audit_logs` VALUES (49, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:33:18');
INSERT INTO `audit_logs` VALUES (50, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:33:53');
INSERT INTO `audit_logs` VALUES (51, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:34:24');
INSERT INTO `audit_logs` VALUES (52, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:36:06');
INSERT INTO `audit_logs` VALUES (53, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:55:37');
INSERT INTO `audit_logs` VALUES (54, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 19:59:45');
INSERT INTO `audit_logs` VALUES (55, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 20:01:35');
INSERT INTO `audit_logs` VALUES (56, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-25 20:02:39');
INSERT INTO `audit_logs` VALUES (57, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 18:57:21');
INSERT INTO `audit_logs` VALUES (58, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 19:00:09');
INSERT INTO `audit_logs` VALUES (59, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 19:04:38');
INSERT INTO `audit_logs` VALUES (60, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 19:05:23');
INSERT INTO `audit_logs` VALUES (61, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 19:27:23');
INSERT INTO `audit_logs` VALUES (62, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-26 19:48:12');
INSERT INTO `audit_logs` VALUES (63, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-27 17:46:53');
INSERT INTO `audit_logs` VALUES (64, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-27 19:17:02');
INSERT INTO `audit_logs` VALUES (65, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-27 19:29:38');
INSERT INTO `audit_logs` VALUES (66, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-02-27 19:36:33');
INSERT INTO `audit_logs` VALUES (67, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 09:45:16');
INSERT INTO `audit_logs` VALUES (68, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 09:48:40');
INSERT INTO `audit_logs` VALUES (69, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:01:53');
INSERT INTO `audit_logs` VALUES (70, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:06:13');
INSERT INTO `audit_logs` VALUES (71, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:06:44');
INSERT INTO `audit_logs` VALUES (72, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:34:42');
INSERT INTO `audit_logs` VALUES (73, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:55:20');
INSERT INTO `audit_logs` VALUES (74, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:56:06');
INSERT INTO `audit_logs` VALUES (75, 'LOGIN', 'Doctor', '28', 28, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:56:41');
INSERT INTO `audit_logs` VALUES (76, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:57:12');
INSERT INTO `audit_logs` VALUES (77, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 10:57:49');
INSERT INTO `audit_logs` VALUES (78, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:13:08');
INSERT INTO `audit_logs` VALUES (79, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:13:32');
INSERT INTO `audit_logs` VALUES (80, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:35:10');
INSERT INTO `audit_logs` VALUES (81, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:35:11');
INSERT INTO `audit_logs` VALUES (82, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:56:09');
INSERT INTO `audit_logs` VALUES (83, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 11:56:37');
INSERT INTO `audit_logs` VALUES (84, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:07:13');
INSERT INTO `audit_logs` VALUES (85, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:07:32');
INSERT INTO `audit_logs` VALUES (86, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:13:38');
INSERT INTO `audit_logs` VALUES (87, 'LOGIN', 'Lab Technician', '4', 4, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:13:43');
INSERT INTO `audit_logs` VALUES (88, 'REVIEW', 'LAB_REQUEST', '19', 4, 'PENDING', 'APPROVED', '', '2026-03-02 12:14:43');
INSERT INTO `audit_logs` VALUES (89, 'REVIEW', 'LAB_REQUEST', '18', 4, 'PENDING', 'APPROVED', '', '2026-03-02 12:14:47');
INSERT INTO `audit_logs` VALUES (90, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:24:29');
INSERT INTO `audit_logs` VALUES (91, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:24:46');
INSERT INTO `audit_logs` VALUES (92, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:32:19');
INSERT INTO `audit_logs` VALUES (93, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 12:32:38');
INSERT INTO `audit_logs` VALUES (94, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 15:02:00');
INSERT INTO `audit_logs` VALUES (95, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 15:03:56');
INSERT INTO `audit_logs` VALUES (96, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 15:05:56');
INSERT INTO `audit_logs` VALUES (97, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 15:13:38');
INSERT INTO `audit_logs` VALUES (98, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 15:37:53');
INSERT INTO `audit_logs` VALUES (99, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 17:42:34');
INSERT INTO `audit_logs` VALUES (100, 'LOGIN', 'Pharmacist', '14', 14, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 17:43:21');
INSERT INTO `audit_logs` VALUES (101, 'LOGIN', 'HR', '12', 12, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 18:00:11');
INSERT INTO `audit_logs` VALUES (102, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 18:31:00');
INSERT INTO `audit_logs` VALUES (103, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 18:38:56');
INSERT INTO `audit_logs` VALUES (104, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 18:45:09');
INSERT INTO `audit_logs` VALUES (105, 'LOGIN', 'PHARMA_MASTER', '11', 11, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 18:45:34');
INSERT INTO `audit_logs` VALUES (106, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 19:03:29');
INSERT INTO `audit_logs` VALUES (107, 'LOGIN', 'Receptionist', '5', 5, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-02 19:06:30');
INSERT INTO `audit_logs` VALUES (108, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-03 19:55:08');
INSERT INTO `audit_logs` VALUES (109, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 18:42:14');
INSERT INTO `audit_logs` VALUES (110, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 18:45:00');
INSERT INTO `audit_logs` VALUES (111, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 18:47:14');
INSERT INTO `audit_logs` VALUES (112, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 18:51:22');
INSERT INTO `audit_logs` VALUES (113, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:03:18');
INSERT INTO `audit_logs` VALUES (114, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:06:34');
INSERT INTO `audit_logs` VALUES (115, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:11:24');
INSERT INTO `audit_logs` VALUES (116, 'LOGIN', 'pantry', '34', 34, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:14:27');
INSERT INTO `audit_logs` VALUES (117, 'LOGIN', 'Pantry', '32', 32, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:19:22');
INSERT INTO `audit_logs` VALUES (118, 'LOGIN', 'Pantry', '32', 32, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:21:17');
INSERT INTO `audit_logs` VALUES (119, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:30:35');
INSERT INTO `audit_logs` VALUES (120, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:32:20');
INSERT INTO `audit_logs` VALUES (121, 'LOGIN', 'Pantry', '32', 32, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:33:49');
INSERT INTO `audit_logs` VALUES (122, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:35:27');
INSERT INTO `audit_logs` VALUES (123, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-04 19:39:08');
INSERT INTO `audit_logs` VALUES (124, 'LOGIN', 'Doctor', '3', 3, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-06 18:10:50');
INSERT INTO `audit_logs` VALUES (125, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-06 19:34:05');
INSERT INTO `audit_logs` VALUES (126, 'LOGIN', 'Admin', '1', 1, 'OFFLINE', 'ONLINE', 'User logged in successfully', '2026-03-09 12:32:26');

-- ----------------------------
-- Table structure for barcode
-- ----------------------------
DROP TABLE IF EXISTS `barcode`;
CREATE TABLE `barcode`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BarCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ArticleNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pdate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of barcode
-- ----------------------------
INSERT INTO `barcode` VALUES ('151190', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151191', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151192', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151193', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151194', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151195', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151196', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151197', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151198', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151199', 'BD0036', 'EQA-036', '780', 'Black', 'WoodCopper', '22', '21-02-2018');
INSERT INTO `barcode` VALUES ('151200', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151201', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151202', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151203', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151204', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151205', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151206', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151207', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151208', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');
INSERT INTO `barcode` VALUES ('151209', 'BD0037', 'EQA-037', '780', 'BLASDJN', 'WoodCopper', '221', '21-02-2018');

-- ----------------------------
-- Table structure for beds
-- ----------------------------
DROP TABLE IF EXISTS `beds`;
CREATE TABLE `beds`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ward` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'General',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Available',
  `price` decimal(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_beds_status`(`status` ASC) USING BTREE,
  INDEX `idx_beds_ward`(`ward` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of beds
-- ----------------------------
INSERT INTO `beds` VALUES (1, 'Ward A', 'A-1', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (2, 'Ward A', 'A-2', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (3, 'Ward A', 'A-3', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (4, 'Ward A', 'A-4', 'General', 'Occupied', 500.00);
INSERT INTO `beds` VALUES (5, 'Ward A', 'A-5', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (6, 'Ward A', 'A-6', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (7, 'Ward A', 'A-7', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (8, 'Ward A', 'A-8', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (9, 'Ward A', 'A-9', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (10, 'Ward A', 'A-10', 'General', 'Available', 500.00);
INSERT INTO `beds` VALUES (11, 'Ward B', 'B-1', 'ICU', 'Available', 2000.00);
INSERT INTO `beds` VALUES (12, 'Ward B', 'B-2', 'ICU', 'Available', 2000.00);
INSERT INTO `beds` VALUES (13, 'Ward B', 'B-3', 'ICU', 'Available', 2000.00);
INSERT INTO `beds` VALUES (14, 'Ward B', 'B-4', 'ICU', 'Available', 2000.00);
INSERT INTO `beds` VALUES (15, 'Ward B', 'B-5', 'ICU', 'Available', 2000.00);
INSERT INTO `beds` VALUES (16, 'Ward C', 'C-1', 'Private', 'Available', 1500.00);
INSERT INTO `beds` VALUES (17, 'Ward C', 'C-2', 'Private', 'Available', 1500.00);
INSERT INTO `beds` VALUES (18, 'Ward C', 'C-3', 'Private', 'Available', 1500.00);
INSERT INTO `beds` VALUES (19, 'Ward C', 'C-4', 'Private', 'Available', 1500.00);
INSERT INTO `beds` VALUES (20, 'Ward C', 'C-5', 'Private', 'Available', 1500.00);

-- ----------------------------
-- Table structure for billdetails
-- ----------------------------
DROP TABLE IF EXISTS `billdetails`;
CREATE TABLE `billdetails`  (
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BarCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GrandTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tax` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IGST` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Caddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OrderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ODate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DispatchNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsPay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Dispatch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Distination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsDelivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QuoNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DisPercentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ReturnAmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BillType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_billdet_rno`(`RNo` ASC) USING BTREE,
  INDEX `idx_billdet_cusid`(`CusID` ASC) USING BTREE,
  INDEX `idx_billdet_cusname`(`CusName` ASC) USING BTREE,
  INDEX `idx_billdet_pdate`(`PDate` ASC) USING BTREE,
  INDEX `idx_billdet_status`(`Status` ASC) USING BTREE,
  INDEX `idx_billdet_billtype`(`BillType` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of billdetails
-- ----------------------------
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '3', 'Corex', 'nan', '3', 'Syrup', '85', 'ASHOK', '170', 'nan', '2.0', 'nan', '178.0', '4.25', '4.25', '0.0', NULL, '3.0', 'nan', '9500979113.0', 'SALEM', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '4', 'Corex', 'nan', '3', 'Syrup', '85', 'Lakshman', '85', 'nan', '1.0', 'nan', '89.0', '2.125', '2.125', '0.0', 'Paid', '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '5', 'Corex', 'nan', '3', 'Syrup', '85', 'VISHWA', '255', 'nan', '3.0', 'nan', '268.0', '6.375', '6.375', '0.0', 'Paid', '4.0', 'nan', '8825758042.0', 'MADURAI', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '6', 'Crosin', 'nan', '2', 'Tablet', '5', 'TEST', '75', 'nan', '15.0', 'nan', '79.0', '1.875', '1.875', '0.0', NULL, '5.0', 'nan', '9368855221.0', 'TEST', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-27 00:00:00', '7', 'Dolo 650', 'nan', '4', '650', '5', 'Lakshman', '500', 'nan', '100.0', 'nan', '525.0', '12.5', '12.5', '0.0', NULL, '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-27 00:00:00', '8', 'Dolo 650', 'nan', '4', '650', '5', 'DHIYANESHWARAN N', '50', 'nan', '10.0', 'nan', '50.0', '0.0', '0.0', '0.0', NULL, '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-27 00:00:00', '9', 'Dolo 650', 'nan', '4', '650', '5', 'DHIYANESHWARAN N', '100', 'nan', '5.0', 'nan', '25.0', '0.0', '0.0', '0.0', 'Paid', '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-30 00:00:00', '10', 'Crosin', 'nan', '2', 'Tablet', '5', 'Lakshman', '200', 'nan', '10.0', 'nan', '52.0', '1.25', '1.25', '0.0', NULL, '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-30 00:00:00', '11', 'Colpol', 'nan', '1', 'Tablet', '4', 'DHIYANESHWARAN N', '150', 'nan', '1.0', 'nan', '4.0', '0.0', '0.0', '0.0', NULL, '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-08-02 00:00:00', '12', 'BLOOD TEST', 'nan', '1', NULL, '500', 'Veeran', '500', 'nan', 'nan', '0.0', '700.0', 'nan', 'nan', 'nan', NULL, '36.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', '13.0');
INSERT INTO `billdetails` VALUES ('2024-08-02 00:00:00', '12', 'NORMAL TEST', 'nan', '100', NULL, '200', 'Veeran', '200', 'nan', 'nan', '0.0', '700.0', 'nan', 'nan', 'nan', NULL, '36.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', '13.0');
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '1', 'Colpol', 'nan', '1', 'Tablet', '5', 'SURYA', '50', 'nan', '10.0', 'nan', '51.0', '1.25', '1.25', '0.0', NULL, '2.0', 'nan', '8056377847.0', 'CHENNAI', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2022-09-24 00:00:00', '2', 'Colpol', 'nan', '1', 'Tablet', '5', NULL, '10', 'nan', '2.0', 'nan', 'nan', 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-08-06 00:00:00', '13', 'SERAM', 'nan', '5', NULL, '500', 'Ramesh', '500', 'nan', 'nan', '0.0', '500.0', 'nan', 'nan', 'nan', NULL, '37.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', '14.0');
INSERT INTO `billdetails` VALUES ('2024-12-07 00:00:00', '14', 'BLOOD TEST', 'nan', '1', NULL, '500', NULL, '500', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-07 00:00:00', '15', 'BLOOD TEST', 'nan', '1', NULL, '500', NULL, '500', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-07 00:00:00', '16', 'BLOOD TEST', 'nan', '1', NULL, '500', NULL, '500', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-07 00:00:00', '17', 'BLOOD TEST', 'nan', '1', NULL, '500', 'ARUNKUMAR', '500', 'nan', 'nan', '0.0', '500.0', 'nan', 'nan', 'nan', NULL, '42.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', '19.0');
INSERT INTO `billdetails` VALUES ('2024-12-08 00:00:00', '18', 'Colpol', 'nan', '1', 'Tablet', '4', NULL, '400', 'nan', '100.0', 'nan', '400.0', '0.0', '0.0', '0.0', NULL, '26.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '19', 'Colpol', 'nan', '1', 'Tablet', '100', 'RAMU', '100', 'nan', '1.0', 'nan', '450.0', '0.0', '0.0', '0.0', NULL, '28.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '19', 'Crosin', 'nan', '2', 'Tablet', '150', 'RAMU', '150', 'nan', '1.0', 'nan', '450.0', '0.0', '0.0', '0.0', NULL, '28.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '19', 'Dolo 6501', 'nan', '100', '650', '200', 'RAMU', '200', 'nan', '1.0', 'nan', '450.0', '0.0', '0.0', '0.0', NULL, '28.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '20', 'Colpol', 'nan', '1', 'Tablet', '100', 'RAMU', '100', 'nan', '1.0', 'nan', '495.0', '22.5', '22.5', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '20', 'Dolo 6501', 'nan', '100', '650', '200', 'RAMU', '200', 'nan', '1.0', 'nan', '495.0', '22.5', '22.5', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '20', 'Crosin', 'nan', '2', 'Tablet', '150', 'RAMU', '150', 'nan', '1.0', 'nan', '495.0', '22.5', '22.5', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '21', 'Colpol', 'nan', '1', 'Tablet', '100', 'RAMU', '100', 'nan', '1.0', 'nan', '472.0', '11.25', '11.25', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '21', 'Crosin', 'nan', '2', 'Tablet', '150', 'RAMU', '150', 'nan', '1.0', 'nan', '472.0', '11.25', '11.25', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-11 00:00:00', '21', 'Dolo 6501', 'nan', '100', '650', '200', 'RAMU', '200', 'nan', '1.0', 'nan', '472.0', '11.25', '11.25', '0.0', NULL, '30.0', 'nan', '9500979112.0', 'ERODE', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma', 'nan');
INSERT INTO `billdetails` VALUES ('2024-12-19 00:00:00', '22', ' SUGAR', 'nan', '1', NULL, '40', 'INDHUMATHI', '40', 'nan', 'nan', '0.0', '40.0', 'nan', 'nan', 'nan', NULL, '344.0', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma', '1.0');
INSERT INTO `billdetails` VALUES ('2026-01-09', '23', 'Cough Syrup Nivaran', NULL, '501', 'Syrup', '100', 'Samu', '100', NULL, '1', '3', '98', '1', NULL, '0', 'Paid', '44', '', '7548881643', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-10', '24', 'Cough Syrup Nivaran', NULL, '501', 'Syrup', '100', 'elango', '100', NULL, '1', '2', '100', '2', NULL, '0', 'Paid', '45', '2', '93456', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-10', '25', 'ANACINE', NULL, '500', 'TABLET', '10', 'Elan', '10', NULL, '1', '0', '10', '0', NULL, '0', 'Paid', '43', '', '9123578496', 'palani', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-10', '26', 'Vicks Action 500', NULL, '502', 'Tablet', '5', 'elango', '5', NULL, '1', '0', '5', '0', NULL, '0', 'Paid', '45', '', '93456', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-10', '27', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Manoj Hariharan T', '5', NULL, '1', '0', '5.35', '0.35000000000000003', NULL, '0', 'Paid', '46', '-', '7548881643', 'Kodaikanal', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '28', 'Paracetamol 500mg', NULL, 'MED001', 'Tablet', '2.5', 'Alice Smith', '25', NULL, '10', '0', '60', '0', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '28', 'Amoxicillin 250mg', NULL, 'MED002', 'Capsule', '5', 'Alice Smith', '35', NULL, '7', '0', '60', '0', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '29', 'Lisinopril 10mg', NULL, 'MED003', 'Tablet', '3.2', 'Bob Johnson', '96', NULL, '30', '0', '204', '0', NULL, '0', 'Paid', 'P002', '', '1234567890', '456 Oak Ave', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '29', 'Metformin 500mg', NULL, 'MED004', 'Tablet', '1.8', 'Bob Johnson', '108', NULL, '60', '0', '204', '0', NULL, '0', 'Paid', 'P002', '', '1234567890', '456 Oak Ave', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '30', 'Cough Syrup Nivaran', NULL, '501', 'Syrup', '100', 'Manoj', '500', NULL, '5', '1', '504', '5', NULL, '0', 'Credit', '40', '-', '9123578496', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Credit', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-11', '31', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Manoj', '50', NULL, '10', '10', '40.5', '0.5', NULL, '0', 'Paid', '40', '', '9123578496', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-15', '32', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Laskhman', '5', NULL, '1', '0', '5', '0', NULL, '0', 'Paid', '2', '', '9080540025', '', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-16', '33', 'Paracetamol 500mg', NULL, 'MED001', 'Tablet', '2.5', 'Alice Smith', '25', NULL, '10', '0', '65', '0', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-16', '33', 'Amoxicillin 250mg', NULL, 'MED002', 'Capsule', '5', 'Alice Smith', '35', NULL, '7', '0', '65', '0', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-16', '33', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Alice Smith', '5', NULL, '1', '0', '65', '0', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '34', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Laskhman', '15', NULL, '3', '1', '14.3', '0.3', NULL, '0', 'Paid', '2', '', '9080540025', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '35', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Laskhman', '5', NULL, '1', '0', '5', '0', NULL, '0', 'Paid', '2', '', '9080540025', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '36', 'Paracetamol', NULL, '503', 'Tablet', '5', 'RamaSwamy', '5', NULL, '1', '1', '4.05', '0.05', NULL, '0', 'Paid', '1', '2', '9655565254', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '37', 'ANACINE', NULL, '500', 'TABLET', '10', 'Laskhman', '10', NULL, '1', '1', '9.1', '0.1', NULL, '0', 'Paid', '2', '', '9080540025', 'Er', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '38', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Laskhman', '5', NULL, '1', '0', '5', '0', NULL, '0', 'Paid', '2', '1', '9080540025', 'Erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '39', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Laskhman', '5', NULL, '1', '1', '4.05', '0.05', NULL, '0', 'Paid', '2', '', '9080540025', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '40', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Manoj Hariharan T', '5', NULL, '1', '0', '5.05', '0.05', NULL, '0', 'Paid', '49', '1', '9123578496', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '41', 'Paracetamol', NULL, '503', 'Tablet', '5', 'RamaSwamy', '5', NULL, '1', '2', '3.05', '0.05', NULL, '0', 'Paid', '1', '4', '9655565254', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-19', '42', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Manoj', '5', NULL, '1', '1', '4.05', '0.05', NULL, '0', 'Paid', '40', '23', '9123578496', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-20', '43', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Laskhman', '5', NULL, '1', '1', '4.05', '0.05', NULL, '0', 'Paid', '2', '', '9080540025', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-20', '44', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Guhan', '5', NULL, '1', '1', '4.05', '0.05', NULL, '0', 'Paid', '50', '', '9123578496', '', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-20', '45', 'Paracetamol 500mg', NULL, 'MED001', 'Tablet', '2.5', 'Alice Smith', '25', NULL, '10', '2', '92.5', '4.5', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-20', '45', 'Amoxicillin 250mg', NULL, 'MED002', 'Capsule', '5', 'Alice Smith', '35', NULL, '7', '2', '92.5', '4.5', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-20', '45', 'Cipla 250', NULL, '502', 'Tablet', '5', 'Alice Smith', '30', NULL, '6', '2', '92.5', '4.5', NULL, '0', 'Paid', 'P001', '', '9876543210', '123 Main St', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-23', '46', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Aadhi', '30', NULL, '6', '0', '30', '0', NULL, '0', 'Paid', '51', '', '', '', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-01-23', '47', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Manoj Hariharan T', '30', NULL, '6', '0', '30', '0', NULL, '0', 'Paid', '49', '', '9865059642', 'erode', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-03-02', '48', 'Paracetamol', NULL, '503', 'Tablet', '5', 'Elan', '5', NULL, '1', '0', '5', '0', NULL, '0', 'Paid', '43', '', '9123578496', '', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);
INSERT INTO `billdetails` VALUES ('2026-03-02', '49', 'Dolo 650', NULL, '4', '650', '100', 'Elan', '100', NULL, '1', '0', '100', '0', NULL, '0', 'Paid', '43', '', '9123578496', 'PlaD', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pharma', NULL);

-- ----------------------------
-- Table structure for billtrash
-- ----------------------------
DROP TABLE IF EXISTS `billtrash`;
CREATE TABLE `billtrash`  (
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GrandTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tax` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TrashDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OrderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ODate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DispatchNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsPay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Dispatch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Distination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsDelivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QuoNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of billtrash
-- ----------------------------

-- ----------------------------
-- Table structure for buyer
-- ----------------------------
DROP TABLE IF EXISTS `buyer`;
CREATE TABLE `buyer`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of buyer
-- ----------------------------
INSERT INTO `buyer` VALUES ('15', '2', 'SURYA', 'CHENNAI', '7658988892', '8056377847', 'nan');
INSERT INTO `buyer` VALUES ('17', '4', 'VISHWA', 'MADURAI', '6565565654', '8825758042', 'nan');
INSERT INTO `buyer` VALUES ('18', '5', 'TEST', 'TEST', '9895665565', '9368855221', 'nan');
INSERT INTO `buyer` VALUES ('14', '1', 'Lakshman', '189,Subbiyan Street, Erode', '6585656852', '9500979112', 'nan');
INSERT INTO `buyer` VALUES ('16', '3', 'ASHOK', 'SALEM', '8776576788', '9500979113', 'nan');
INSERT INTO `buyer` VALUES ('19', '6', 'DHIYANESHWARAN N', 'Erode', '7878898999', '9842357072', 'nan');

-- ----------------------------
-- Table structure for cashbook
-- ----------------------------
DROP TABLE IF EXISTS `cashbook`;
CREATE TABLE `cashbook`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Rno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IncomeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Income` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ExpenseType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Expense` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Head` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Interest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Return` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cashbook
-- ----------------------------
INSERT INTO `cashbook` VALUES ('291', 'nan', '2022-09-27 00:00:00', 'BillNo:8', '50', 'nan', '0', 'nan', 'nan', '0');
INSERT INTO `cashbook` VALUES ('292', 'nan', '2022-09-27 00:00:00', 'BillNo:9', '100', 'nan', '0', 'nan', 'nan', '0');
INSERT INTO `cashbook` VALUES ('293', 'nan', '2022-09-30 00:00:00', 'BillNo:11', '150', 'nan', '0', 'nan', 'nan', '0');

-- ----------------------------
-- Table structure for clinical_notes
-- ----------------------------
DROP TABLE IF EXISTS `clinical_notes`;
CREATE TABLE `clinical_notes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `doctor_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Unknown',
  `visit_date` date NOT NULL,
  `symptoms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `history_illness` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `physical_examination` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `treatment_plan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `follow_up` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bp` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `heart_rate` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `temperature` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spo2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_clinical_patient`(`patient_id` ASC) USING BTREE,
  INDEX `idx_clinical_doctor`(`doctor_id` ASC) USING BTREE,
  INDEX `idx_clinical_date`(`visit_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of clinical_notes
-- ----------------------------
INSERT INTO `clinical_notes` VALUES (1, '40', 'Unknown', '2026-01-08', 'wedfg', 'sdf', 'sdfg', 'sdfg', 'sdfg', 'dfgh', '120/80', '72', '98.6', '98', '2026-01-08 16:22:14');
INSERT INTO `clinical_notes` VALUES (2, '41', 'Unknown', '2026-01-08', 'dfgh', 'dfg', 'sdfvgb', 'dfg', 'fgh', 'fgh', '120/80', '72', '98.6', '98', '2026-01-08 16:32:42');
INSERT INTO `clinical_notes` VALUES (3, '40', 'Unknown', '2026-01-08', 'sdfg', 'df', NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-08 17:31:25');
INSERT INTO `clinical_notes` VALUES (4, '39', 'Unknown', '2026-01-08', NULL, NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-08 17:31:50');
INSERT INTO `clinical_notes` VALUES (5, '42', 'Unknown', '2026-01-09', 'sdfghj', 'dfghj', 'fghjk', 'fghjk', 'hjkm', 'ghj', '120/80', '72', '98.6', '98', '2026-01-09 10:44:46');
INSERT INTO `clinical_notes` VALUES (6, '43', 'Unknown', '2026-01-09', 'fever', '3 days', 'abnormal', 'not well', '1 week rest', 'comeback next week', '120/80', '72', '98.6', '98', '2026-01-09 15:57:21');
INSERT INTO `clinical_notes` VALUES (7, '43', 'Unknown', '2026-01-09', 'fever', '3 days', 'abnormal', 'not well', '1 week rest', 'comeback next week', '120/80', '72', '98.6', '98', '2026-01-09 15:57:38');
INSERT INTO `clinical_notes` VALUES (8, '37', 'Unknown', '2026-01-09', 'good', NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-09 15:58:38');
INSERT INTO `clinical_notes` VALUES (9, '38', 'Unknown', '2026-01-09', 'good', NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-09 15:58:44');
INSERT INTO `clinical_notes` VALUES (10, '22', 'Unknown', '2026-01-09', 'good', NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-09 15:58:49');
INSERT INTO `clinical_notes` VALUES (11, '44', 'Unknown', '2026-01-09', NULL, NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-09 17:11:10');
INSERT INTO `clinical_notes` VALUES (12, '45', 'Unknown', '2026-01-10', 'Fever', '3 days', 'Normal', 'Tablet', '1 week', 'Take rest', '120/80', '72', '98.6', '98', '2026-01-10 14:18:41');
INSERT INTO `clinical_notes` VALUES (13, '46', 'Unknown', '2026-01-10', NULL, NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-01-10 23:09:43');
INSERT INTO `clinical_notes` VALUES (14, '50', 'Unknown', '2026-01-20', 'fever', 'a', 'aa', 'a', 'a', 'a', '120/80', '72', '98.6', '98', '2026-01-20 18:26:43');
INSERT INTO `clinical_notes` VALUES (15, '53', 'Unknown', '2026-02-12', NULL, NULL, NULL, NULL, NULL, NULL, '120/80', '72', '98.6', '98', '2026-02-12 19:39:14');

-- ----------------------------
-- Table structure for contactbook
-- ----------------------------
DROP TABLE IF EXISTS `contactbook`;
CREATE TABLE `contactbook`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of contactbook
-- ----------------------------

-- ----------------------------
-- Table structure for copy_of_billdetails
-- ----------------------------
DROP TABLE IF EXISTS `copy_of_billdetails`;
CREATE TABLE `copy_of_billdetails`  (
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BarCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GrandTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tax` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IGST` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Caddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OrderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ODate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DispatchNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsPay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Dispatch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Distination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsDelivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QuoNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DisPercentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ReturnAmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BillType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copy_of_billdetails
-- ----------------------------
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '1', 'Colpol', 'nan', '1', 'Tablet', '5', 'SURYA', '50', 'nan', '10', 'nan', '51.0', '1.25', '1.25', '0.0', NULL, '2.0', 'nan', '8056377847.0', 'CHENNAI', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '2', 'Colpol', 'nan', '1', 'Tablet', '5', NULL, '10', 'nan', '2', 'nan', 'nan', 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', NULL, 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', 'nan', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '3', 'Corex', 'nan', '3', 'Syrup', '85', 'ASHOK', '170', 'nan', '2', 'nan', '178.0', '4.25', '4.25', '0.0', NULL, '3.0', 'nan', '9500979113.0', 'SALEM', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '4', 'Corex', 'nan', '3', 'Syrup', '85', 'Lakshman', '85', 'nan', '1', 'nan', '89.0', '2.125', '2.125', '0.0', 'Paid', '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '5', 'Corex', 'nan', '3', 'Syrup', '85', 'VISHWA', '255', 'nan', '3', 'nan', '268.0', '6.375', '6.375', '0.0', 'Credit', '4.0', 'nan', '8825758042.0', 'MADURAI', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-24 00:00:00', '6', 'Crosin', 'nan', '2', 'Tablet', '5', 'TEST', '75', 'nan', '15', 'nan', '79.0', '1.875', '1.875', '0.0', NULL, '5.0', 'nan', '9368855221.0', 'TEST', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-27 00:00:00', '7', 'Dolo 650', 'nan', '4', '650', '5', 'Lakshman', '500', 'nan', '100', 'nan', '525.0', '12.5', '12.5', '0.0', NULL, '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-27 00:00:00', '8', 'Dolo 650', 'nan', '4', '650', '5', 'DHIYANESHWARAN N', '50', 'nan', '10', 'nan', '50.0', '0.0', '0.0', '0.0', NULL, '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-27 00:00:00', '9', 'Dolo 650', 'nan', '4', '650', '5', 'DHIYANESHWARAN N', '25', 'nan', '5', 'nan', '25.0', '0.0', '0.0', '0.0', 'Paid', '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-30 00:00:00', '10', 'Crosin', 'nan', '2', 'Tablet', '5', 'Lakshman', '50', 'nan', '10', 'nan', '52.0', '1.25', '1.25', '0.0', NULL, '1.0', 'nan', '9500979112.0', '189,Subbiyan Street, Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');
INSERT INTO `copy_of_billdetails` VALUES ('2022-09-30 00:00:00', '11', 'Colpol', 'nan', '1', 'Tablet', '4', 'DHIYANESHWARAN N', '4', 'nan', '1', 'nan', '4.0', '0.0', '0.0', '0.0', NULL, '6.0', 'nan', '9842357072.0', 'Erode', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', '0', '0.0', 'Pharma');

-- ----------------------------
-- Table structure for copy_of_labtest
-- ----------------------------
DROP TABLE IF EXISTS `copy_of_labtest`;
CREATE TABLE `copy_of_labtest`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PatientID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BloodGrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RefDoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Speciman` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PSex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PUnit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestResult` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NormalValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NextDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copy_of_labtest
-- ----------------------------
INSERT INTO `copy_of_labtest` VALUES ('45', '2024-12-08 00:00:00', '20', '25', 'SURYA', 'B-', 'ASHOK', NULL, NULL, 'MALE', '42', 'BLOOD TEST', 'Potassium', '1', 'nan', '3.8 - 5.2 mEq/L', '4.5', '2024-12-08 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('46', '2024-12-08 00:00:00', '20', '25', 'SURYA', 'B-', 'ASHOK', NULL, NULL, 'MALE', '42', 'BLOOD TEST', 'Blood Urea', '1', 'nan', '10 - 50 mg/dl', '30.0', '2024-12-08 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('47', '2024-12-08 00:00:00', '20', '25', 'SURYA', 'B-', 'ASHOK', NULL, NULL, 'MALE', '42', 'BLOOD TEST', 'Globulin', '1', 'nan', '2.3 - 3.5 gms/dl', '3.0', '2024-12-08 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('48', '2024-12-19 00:00:00', '21', '16', 'SURYA', 'O+', NULL, NULL, NULL, 'MALE', '25', 'BIO', 'RHEUMATOID FACTOR (RF)', 'IU/mL', 'nan', '20.0', '4.42', '2024-12-19 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('26', '2019-03-02 00:00:00', '5', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'TOTAL WBC COUNT', 'MALE', '34', 'BLOOD TEST', 'HAEMATOLOGY', 'CELLC/CUMM', 'nan', '45000-1100', '7300.0', '2019-03-02 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('27', '2019-03-02 00:00:00', '5', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'NEUTROPHILS', 'MALE', '34', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '40-70', '30.0', '2019-03-02 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('28', '2019-03-02 00:00:00', '5', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'LYMPHOCYTES', 'MALE', '34', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '20-40', '30.0', '2019-03-02 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('29', '2019-03-12 00:00:00', '6', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'asdfsafd', 'sadfasf', 'MALE', '34', 'BLOOD TEST', 'HAEMATOLOGY', 'fdaf', 'nan', '1', '1.0', '2019-03-12 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('30', '2022-09-27 00:00:00', '7', '3', 'Ramesh', 'AB+', 'dr.Raja', 'Blood', 'Blood Test', 'MALE', '30', 'BLOOD TEST', 'COM BLOOD COUNT', '1', 'nan', '25', '20.0', '2022-09-27 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('19', '2018-02-24 00:00:00', '1', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'TOTAL WBC COUNT', 'MALE', '34', 'BLOOD TEST', 'HAEMATOLOGY', 'CELLC/CUMM', 'nan', '45000-1100', '7300.0', '2018-02-24 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('20', '2018-02-24 00:00:00', '1', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'LYMPHOCYTES', 'MALE', '34', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '20-40', '51.0', '2018-02-24 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('21', '2018-02-24 00:00:00', '1', '6', 'Arjun', 'B+', 'DR.Saravanan Kumar MBBD', 'EDTA  BLOOD', 'NEUTROPHILS', 'MALE', '34', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '40-70', '42.0', '2018-02-24 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('22', '2018-02-24 00:00:00', '2', '3', 'Ramesh', NULL, 'dr.Raja', 'EDTA  BLOOD', 'LYMPHOCYTES', 'MALE', '24', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '20-40', '25.0', '2018-02-24 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('23', '2018-02-24 00:00:00', '2', '3', 'Ramesh', NULL, 'dr.Raja', 'EDTA  BLOOD', 'LYMPHOCYTES', 'MALE', '24', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '20-40', '25.0', '2018-02-24 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('24', '2018-06-08 00:00:00', '3', '3', 'Ramesh', NULL, 'dr.Raja', NULL, NULL, 'MALE', '24', 'BLOOD TEST', NULL, NULL, 'nan', NULL, 'nan', '2018-06-08 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('25', '2019-02-26 00:00:00', '4', '3', 'Ramesh', NULL, 'dr.Raja', 'EDTA  BLOOD', 'LYMPHOCYTES', 'MALE', '24', 'BLOOD TEST', 'COM BLOOD COUNT', '%', 'nan', '20-40', '35.0', '2019-02-26 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('31', '2022-10-25 00:00:00', '8', '9', 'ram', 'O-', NULL, 'BLOOD', 'Sample', 'm', '23', 'Laboratory', 'BIOCHEMISTRY', '1', 'nan', '123', '99.0', '2022-10-25 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('32', '2022-10-25 00:00:00', '9', '9', 'ram', 'O-', NULL, 'BLOOD', 'Sample', 'm', '23', 'Laboratory', 'BIOCHEMISTRY', '1', 'nan', '123', '33.0', '2022-10-25 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('33', '2022-10-27 00:00:00', '10', '7', 'Srinish', 'O+', 'Arjun', 'BLOOD(EDTA)', 'Sample', 'm', '22', 'Laboratory', 'BIOCHEMISTRY', '100', 'nan', '3.5-10.0', '18.8', '2022-10-27 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('34', '2022-10-27 00:00:00', '11', '10', 'Test', 'B+', 'Test', 'BLOOD', 'Sample', 'MALE', '30', 'Laboratory', NULL, '1', 'nan', '123', '115.0', '2022-10-27 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('35', '2024-07-30 00:00:00', '12', '17', 'Guna', 'O+', 'DR.MUTHU', 'BLOOD', 'Sample', 'MALE', '24', 'Laboratory', 'BIOCHEMISTRY', '1', 'nan', '123', '50.0', '2024-07-30 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('36', '2024-08-02 00:00:00', '13', '20', 'Veeran', NULL, 'DR.GUNA', 'ASITIC FLUID', 'Sample', 'MALE', '24', 'SCAN', 'BONE', NULL, 'nan', NULL, 'nan', '2024-08-02 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('37', '2024-08-06 00:00:00', '14', '3', 'Ramesh', 'O+', 'dr.Raja', 'BLOOD', 'Sample', 'MALE', '30', 'BLOOD TEST', 'BLOOD', '1', 'nan', '123', 'nan', '2024-08-06 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('38', '2024-08-06 00:00:00', '15', '3', 'Ramesh', 'O+', 'dr.Raja', 'TEST', 'X RAY', 'MALE', '30', 'BLOOD TEST', 'BONE', NULL, 'nan', NULL, 'nan', '2024-08-06 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('39', '2024-12-07 00:00:00', '16', '12', 'kavitha', 'B-', 'dHIYANESH', 'BLOOD(EDTA)', 'TESTING', 'FEMALE', '36', 'BLOOD TEST', 'BLOOD', '1', 'nan', '100', '80.0', '2024-12-07 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('40', '2024-12-07 00:00:00', '17', '10', 'Test', 'B+', 'Test', NULL, NULL, 'MALE', '30', 'BLOOD TEST', 'Alkaline Phosphatase', '1', 'nan', '80 - 306 IU/L', '645.0', '2024-12-07 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('41', '2024-12-07 00:00:00', '18', '10', 'Test', 'B+', 'Test', NULL, NULL, 'MALE', '30', 'BLOOD TEST', 'LDH', '1', 'nan', '80 - 285 IU/L', '54.0', '2024-12-07 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('42', '2024-12-07 00:00:00', '19', '24', 'ARUNKUMAR', 'B+', 'ANBU', NULL, NULL, 'MALE', '35', 'BLOOD TEST', 'Bilirubin Direct', '1', 'nan', '0 - 0.6 mg/dl', '0.5', '2024-12-07 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('43', '2024-12-08 00:00:00', '20', '25', 'SURYA', 'B-', 'ASHOK', NULL, NULL, 'MALE', '42', 'BLOOD TEST', 'Albumin', '1', 'nan', '3.2 - 4.5 gm/dl', '3.5', '2024-12-08 00:00:00');
INSERT INTO `copy_of_labtest` VALUES ('44', '2024-12-08 00:00:00', '20', '25', 'SURYA', 'B-', 'ASHOK', NULL, NULL, 'MALE', '42', 'BLOOD TEST', 'Creatinine', '1', 'nan', '0.5 - 1.5 mg/dl', '1.0', '2024-12-08 00:00:00');

-- ----------------------------
-- Table structure for copy_of_patientdetaiils
-- ----------------------------
DROP TABLE IF EXISTS `copy_of_patientdetaiils`;
CREATE TABLE `copy_of_patientdetaiils`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BloodGrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RefDoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PSex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OpFee` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BlockNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RoomNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DOJ` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DOV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Waiting',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_patients_cusId`(`cusId` ASC) USING BTREE,
  INDEX `idx_patients_cusName`(`cusName` ASC) USING BTREE,
  INDEX `idx_patients_mobile`(`MobileNo` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copy_of_patientdetaiils
-- ----------------------------
INSERT INTO `copy_of_patientdetaiils` VALUES ('13', '1', 'RamaSwamy', '9655565254', 'Erode', 'B+', 'Blood Test', 'Siva Kumar', 'Siva Kumar', 'Saravanan', 'MALE', '6', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-16 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('14', '2', 'Laskhman', '9080540025', 'Erode', 'O+', 'Blood Test', 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', 'Dr.Krishnan', 'MALE', '66', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-16 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('15', '3', 'Ramesh', '9500979112', 'Erode', 'B+', 'Blood Test', 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', 'dr.Raja', 'MALE', '30', 'nan', 'nan', NULL, 'False', 'B', '103.0', '2024-08-16 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('16', '4', 'Lakskak', '9842357072', 'erpde', 'O+', 'Blood Test', 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', 'MALE', '6', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-16 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('17', '5', 'Ramu', '9366605550', NULL, 'O-', 'Uyine Test', NULL, NULL, NULL, NULL, '6', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-16 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('18', '6', 'Arjun', '9500979113', '189subbiyan', NULL, NULL, 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', 'DR.Saravanan Kumar MBBD', 'MALE', '4', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('19', '7', 'Srinish', '833492137', 'erode', NULL, NULL, 'harish', 'harish', NULL, 'm', '22', 'nan', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('20', '8', 'ddd', '9811111111', 'www', 'B+', NULL, 'Siva Kumar', 'Siva Kumar', NULL, 'MALE', '32', '100.0', 'nan', NULL, 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('21', '9', 'ram', '9842357070', 'gobi', 'O-', NULL, NULL, NULL, NULL, 'm', '23', 'nan', 'nan', 'M1-29-10-2022', 'True', 'B', '103.0', '2024-08-17 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('22', '10', 'Test', '9500979113', 'Triupur', 'B+', NULL, 'harish', 'harish', 'Test', 'MALE', '30', '100.0', 'nan', 'M1-30-10-2022', 'True', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('23', '11', 'ravi', '9842712300', 'gobi', 'B+', NULL, 'DR.Siva Kumar MBBD', 'DR.Siva Kumar MBBD', NULL, 'm', '27', '100.0', 'nan', 'M2-29-10-2022', 'True', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('24', '12', 'kavitha', '8667281277', 'Erode', 'B-', NULL, NULL, NULL, NULL, 'FEMALE', '36', '100.0', 'nan', 'M4-29-10-2022', 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('25', '13', 'srinish', '9842357072', 'erode', 'B+', NULL, NULL, NULL, NULL, 'MALE', '10', '100.0', 'nan', 'E2-29-10-2022', 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', '2024-08-17 00:00:00', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('26', '14', 'ram', '9842357070', 'gobi', 'O-', NULL, 'harish', 'harish', NULL, 'm', '23', '100.0', 'nan', 'M2-30-10-2022', 'False', 'DIAMOND', '101.0', '2024-08-17 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('28', '15', 'ddd', '9811111111', 'www', 'B+', NULL, 'Siva Kumar', 'Siva Kumar', NULL, 'MALE', '32', '0.0', 'nan', 'E1-29-10-2022', 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('29', '16', 'surya', '8056377847', 'erode', 'O+', NULL, NULL, NULL, NULL, 'MALE', '23', '0.0', 'nan', 'E1-08-11-2022', 'False', 'DIAMOND', '101.0', '2024-08-19 00:00:00', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('30', '17', 'Guna', '6381496005', 'ERODE', 'O+', NULL, 'DR.DANIEL', 'DR.DANIEL', 'DR.MUTHU', 'MALE', '24', '100.0', 'nan', 'E1-30-07-2024', 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('31', '18', 'BHUVI', '8248028366', 'ERODE', 'B+', NULL, 'DR.SURYA', 'DR.SURYA', 'DR.JAGA', 'MALE', '24', '200.0', 'nan', 'M1-31-07-2024', 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('32', '19', 'Gokul', '12346678', 'ERODE', 'B-', NULL, 'DR.DANIEL', 'DR.DANIEL', 'DR.KUMAR', 'MALE', '20', '500.0', 'nan', 'E1-31-07-2024', 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('33', '20', 'Veeran', '9095104150', 'ERODE', 'B+', NULL, 'DR.SURYA', 'DR.SURYA', 'DR.GUNA', 'MALE', '24', '500.0', 'nan', '01-08-2024', 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('34', '21', 'GUNA', '9080049589', 'ERODE', 'B+', NULL, 'DR.SURYA', 'DR.SURYA', 'JAGA', 'MALE', '21', 'nan', 'nan', NULL, 'False', NULL, 'nan', 'NaT', 'NaT', 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('36', '22', 'KAVIN', '8248517729', 'ERODE', 'O-', NULL, 'DR.SURYA', 'DR.SURYA', 'DR.GUNA', 'MALE', '25', '1000.0', 'nan', 'M1-23-08-2024', 'False', NULL, 'nan', 'NaT', 'NaT', 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('37', '37', 'TestUserNode', '1234567890', 'Test Node', 'A+', NULL, NULL, 'Dr. Node', NULL, 'Male', '30', '100', NULL, '2024-01-01', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('38', '38', 'Preethi', '9123578496', 'Erode', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Female', '20', '100', NULL, '2026-01-08', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('39', '39', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-08', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('40', '40', 'Manoj', '9123578496', 'Erode', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '23', '120', NULL, '2026-01-08', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('41', '41', 'Prawin', '7548881643', 'Erode', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', '100', NULL, '2026-01-08', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('42', '42', 'Musk', '9123578496', 'america', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '40', '100', NULL, '2026-01-09', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('43', '43', 'Elan', '9123578496', 'palani', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', '100', NULL, '2026-01-09', 'False', NULL, NULL, NULL, NULL, 'Completed', 'patient_43_1772114359868.jpg');
INSERT INTO `copy_of_patientdetaiils` VALUES ('44', '44', 'Samu', '7548881643', 'Erode', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Female', '20', '100', NULL, '2026-01-09', 'False', NULL, NULL, NULL, NULL, 'Completed', 'patient_44_1772459901000.jpg');
INSERT INTO `copy_of_patientdetaiils` VALUES ('45', '45', 'elango', '93456', 'erode', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', '100', NULL, '2026-01-09', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('46', '46', 'Manoj Hariharan T', '7548881643', 'Kodaikanal', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '21', '100', NULL, '2026-01-10', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('47', '47', 'Ajith', '912345670', 'Eorde', NULL, NULL, NULL, 'Dr. Praveen', NULL, 'Male', '50', '100', NULL, '2026-01-11', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('48', '48', 'elngo', '91245677', 'erode', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', '100', NULL, '2026-01-11', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('49', '49', 'Manoj Hariharan T', '9123578496', 'Erode', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', '100', NULL, '2026-01-14', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('50', '50', 'Guhan', '9123578496', 'palani', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', '100', NULL, '2026-01-20', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('51', '51', 'Aadhi', '8903260642', 'theni', NULL, NULL, NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', NULL, NULL, '2026-01-23', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('52', '52', 'Kumar', '9886550942', 'erode', NULL, NULL, NULL, NULL, NULL, 'Male', '24', NULL, NULL, '2026-01-27', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('53', '53', 'dhaya', '9123578496', 'Erode', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', NULL, NULL, '2026-01-30', 'False', NULL, NULL, NULL, NULL, 'Completed', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('54', '54', 'Manoj Hariharan T', '9123578496', 'Erode', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', NULL, NULL, '2026-02-18', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('55', '55', 'Elango K', '09123578496', '189, Sunbb Street, Chennai', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Male', '20', '100', NULL, '2026-02-25', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('56', '56', 'jaya', '09095332999', '189, Sunbb Street, Chennai', NULL, NULL, NULL, 'Dr. Manoj', NULL, 'Female', '20', '100', NULL, '2026-02-26', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('57', '57', 'Raj', '7546234498', 'erode', 'B+', NULL, NULL, 'Dr. Manoj', NULL, 'Male', '22', '0', NULL, '2026-02-26', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);
INSERT INTO `copy_of_patientdetaiils` VALUES ('58', '58', 'prawinkumar', '9087567457', 'erode', NULL, NULL, NULL, NULL, NULL, 'Male', '33', NULL, NULL, '2026-03-02', 'False', NULL, NULL, NULL, NULL, 'Waiting', NULL);

-- ----------------------------
-- Table structure for copy_of_testmaster
-- ----------------------------
DROP TABLE IF EXISTS `copy_of_testmaster`;
CREATE TABLE `copy_of_testmaster`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of copy_of_testmaster
-- ----------------------------
INSERT INTO `copy_of_testmaster` VALUES ('24', '1', 'BLOOD TEST', 'HAEMATOLOGY', '500');
INSERT INTO `copy_of_testmaster` VALUES ('34', '10', 'BLOOD TEST', 'HEMOGLOBIN TEST', '200');
INSERT INTO `copy_of_testmaster` VALUES ('35', '100', 'BLOOD TEST', 'TEST', '400');

-- ----------------------------
-- Table structure for creditor
-- ----------------------------
DROP TABLE IF EXISTS `creditor`;
CREATE TABLE `creditor`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Rno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of creditor
-- ----------------------------
INSERT INTO `creditor` VALUES ('6', '2022-09-24 00:00:00', '4', '1', 'Lakshman', NULL, '85', 'nan');
INSERT INTO `creditor` VALUES ('7', '2022-09-27 00:00:00', '9', '6', 'DHIYANESHWARAN N', NULL, '25', 'nan');
INSERT INTO `creditor` VALUES ('8', '2024-06-06 00:00:00', '5', '4', 'VISHWA', 'Test', '200', 'nan');

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cGroup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Head` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BillNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Buy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Paid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `KM` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Liter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `isBank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CashType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Authorized` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES ('7', '2022-09-24 00:00:00', 'SHOP', 'FOOD', 'SURYA', 'TEA EXPENSE', '5', '0', '500', 'nan', 'nan', 'nan', 'Bill', 'ByCash', 'MANAGER');
INSERT INTO `customer` VALUES ('8', '2022-09-27 00:00:00', 'STAFFS', 'LUNCH', 'SURYA', 'SPECIAL LUNCH', '25', '0', '1500', 'nan', 'nan', 'nan', 'Bill', 'ByCash', 'DOCTOR');
INSERT INTO `customer` VALUES ('9', '2022-10-27 00:00:00', 'STAFFS', 'LUNCH', 'SURYA', NULL, '0', '0', '500', 'nan', 'nan', 'nan', NULL, 'ByCash', 'DOCTOR');

-- ----------------------------
-- Table structure for custransaction
-- ----------------------------
DROP TABLE IF EXISTS `custransaction`;
CREATE TABLE `custransaction`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BillNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Buy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Paid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CashType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of custransaction
-- ----------------------------

-- ----------------------------
-- Table structure for daily_op_records
-- ----------------------------
DROP TABLE IF EXISTS `daily_op_records`;
CREATE TABLE `daily_op_records`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `age_gender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `visit_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Consultation',
  `op_fees` decimal(10, 2) NULL DEFAULT 0.00,
  `total_fees` decimal(10, 2) NULL DEFAULT 0.00,
  `payment_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Paid',
  `visit_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `source_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Manual',
  `source_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_dailyop_date`(`visit_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of daily_op_records
-- ----------------------------
INSERT INTO `daily_op_records` VALUES (1, 'Elango', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-10', '2026-01-21 11:22:01', 'Appointment', 1);
INSERT INTO `daily_op_records` VALUES (2, 'Manoj HAriharan T', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-10', '2026-01-21 11:22:01', 'Appointment', 2);
INSERT INTO `daily_op_records` VALUES (3, 'Manoj', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'Appointment', 3);
INSERT INTO `daily_op_records` VALUES (4, 'ertyui', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'Appointment', 4);
INSERT INTO `daily_op_records` VALUES (5, 'INDHUMATHI', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'Appointment', 5);
INSERT INTO `daily_op_records` VALUES (6, 'elango', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'Appointment', 6);
INSERT INTO `daily_op_records` VALUES (7, 'Vijay', '18 / Male', '+91 9123578496', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-01-10', '2026-01-21 11:22:01', 'OPD', 1);
INSERT INTO `daily_op_records` VALUES (8, 'RamaSwamy', '6 / MALE', '9655565254', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'OPD', 2);
INSERT INTO `daily_op_records` VALUES (9, 'Laskhman', '66 / MALE', '9080540025', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'OPD', 3);
INSERT INTO `daily_op_records` VALUES (10, 'INDHUMATHI', '30 / Female', '1234567890', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-01-11', '2026-01-21 11:22:01', 'OPD', 4);
INSERT INTO `daily_op_records` VALUES (11, 'Elango kandhasamy', '21 / Male', '9123578496', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-01-21', '2026-01-21 11:22:01', 'OPD', 5);
INSERT INTO `daily_op_records` VALUES (12, 'Aadhi', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-23', '2026-01-23 09:19:17', 'Appointment', 7);
INSERT INTO `daily_op_records` VALUES (13, 'dhaya', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-01-30', '2026-01-30 10:15:50', 'Appointment', 8);
INSERT INTO `daily_op_records` VALUES (14, 'Nithish', 'Unknown', 'N/A', 'Consultation', 200.00, 200.00, 'Paid', '2026-03-02', '2026-03-02 11:59:12', 'Appointment', 9);
INSERT INTO `daily_op_records` VALUES (15, 'Prawen', '46 / Male', '6374991169', 'OPD Visit', 200.00, 200.00, 'Paid', '2026-03-02', '2026-03-02 12:00:11', 'OPD', 6);

-- ----------------------------
-- Table structure for dicom_studies
-- ----------------------------
DROP TABLE IF EXISTS `dicom_studies`;
CREATE TABLE `dicom_studies`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `orthanc_study_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `study_instance_uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `modality` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `study_date` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `patient_id`(`patient_id` ASC) USING BTREE,
  CONSTRAINT `dicom_studies_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dicom_studies
-- ----------------------------
INSERT INTO `dicom_studies` VALUES (1, 2, '12345678-12345678-12345678-12345678-12345671', '1.2.840.113619.2.1', 'CR', '2026-02-25 19:49:46', '2026-02-25 19:49:46');
INSERT INTO `dicom_studies` VALUES (2, 3, '12345678-12345678-12345678-12345678-12345672', '1.2.840.113619.2.2', 'CR', '2026-02-25 19:49:46', '2026-02-25 19:49:46');
INSERT INTO `dicom_studies` VALUES (3, 4, '12345678-12345678-12345678-12345678-12345673', '1.2.840.113619.2.3', 'CR', '2026-02-25 19:49:46', '2026-02-25 19:49:46');

-- ----------------------------
-- Table structure for dietary_orders
-- ----------------------------
DROP TABLE IF EXISTS `dietary_orders`;
CREATE TABLE `dietary_orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `bed_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `diet_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `special_instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `meal_time` enum('Breakfast','Lunch','Snack','Dinner') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `scheduled_date` date NOT NULL,
  `status` enum('Pending','Preparing','Delivered','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `delivered_by` int NULL DEFAULT NULL,
  `delivered_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_dietary_admission`(`admission_id` ASC) USING BTREE,
  INDEX `idx_dietary_date`(`scheduled_date` ASC, `meal_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dietary_orders
-- ----------------------------
INSERT INTO `dietary_orders` VALUES (1, 7, 'A-4', 'Ward A', 'Manoj Hariharan T', 'curd rice', 'no spicy food', 'Breakfast', '2026-03-04', 'Delivered', 32, '2026-03-04 19:34:06', '2026-03-04 19:33:32');
INSERT INTO `dietary_orders` VALUES (2, 7, 'A-4', 'Ward A', 'Manoj Hariharan T', 'curd rice', 'no spicy food', 'Lunch', '2026-03-04', 'Delivered', 32, '2026-03-04 19:34:13', '2026-03-04 19:33:32');
INSERT INTO `dietary_orders` VALUES (3, 7, 'A-4', 'Ward A', 'Manoj Hariharan T', 'curd rice', 'no spicy food', 'Snack', '2026-03-04', 'Delivered', 32, '2026-03-04 19:34:17', '2026-03-04 19:33:32');
INSERT INTO `dietary_orders` VALUES (4, 7, 'A-4', 'Ward A', 'Manoj Hariharan T', 'curd rice', 'no spicy food', 'Dinner', '2026-03-04', 'Delivered', 32, '2026-03-04 19:34:19', '2026-03-04 19:33:32');

-- ----------------------------
-- Table structure for discharge_clearance
-- ----------------------------
DROP TABLE IF EXISTS `discharge_clearance`;
CREATE TABLE `discharge_clearance`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `department` enum('Pantry','Inventory','Pharmacy','Ward','Billing') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('Pending','Cleared') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `cleared_by` int NULL DEFAULT NULL,
  `cleared_at` datetime NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_dept_admission`(`admission_id` ASC, `department` ASC) USING BTREE,
  INDEX `idx_clearance_admission`(`admission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of discharge_clearance
-- ----------------------------
INSERT INTO `discharge_clearance` VALUES (1, 8, 'Pantry', 'Cleared', 3, '2026-03-04 18:46:07', NULL);
INSERT INTO `discharge_clearance` VALUES (2, 8, 'Inventory', 'Cleared', 3, '2026-03-04 18:46:09', NULL);
INSERT INTO `discharge_clearance` VALUES (3, 8, 'Pharmacy', 'Cleared', 3, '2026-03-04 18:46:10', NULL);
INSERT INTO `discharge_clearance` VALUES (4, 8, 'Ward', 'Cleared', 3, '2026-03-04 18:46:11', NULL);
INSERT INTO `discharge_clearance` VALUES (5, 8, 'Billing', 'Cleared', 3, '2026-03-04 18:46:13', NULL);
INSERT INTO `discharge_clearance` VALUES (6, 9, 'Pantry', 'Cleared', 3, '2026-03-04 19:04:53', NULL);
INSERT INTO `discharge_clearance` VALUES (7, 9, 'Inventory', 'Cleared', 3, '2026-03-04 19:04:54', NULL);
INSERT INTO `discharge_clearance` VALUES (8, 9, 'Pharmacy', 'Cleared', 3, '2026-03-04 19:04:55', NULL);
INSERT INTO `discharge_clearance` VALUES (9, 9, 'Ward', 'Cleared', 3, '2026-03-04 19:04:56', NULL);
INSERT INTO `discharge_clearance` VALUES (10, 9, 'Billing', 'Cleared', 3, '2026-03-04 19:04:57', NULL);

-- ----------------------------
-- Table structure for discharge_summary
-- ----------------------------
DROP TABLE IF EXISTS `discharge_summary`;
CREATE TABLE `discharge_summary`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `admission_date` date NULL DEFAULT NULL,
  `discharge_date` date NULL DEFAULT NULL,
  `admission_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `initial_vitals` json NULL,
  `lab_results` json NULL,
  `procedures_performed` json NULL,
  `course_in_hospital` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `final_diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `discharge_medications` json NULL,
  `follow_up_instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `generated_by` int NULL DEFAULT NULL,
  `generated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_finalized` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_summary_admission`(`admission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of discharge_summary
-- ----------------------------
INSERT INTO `discharge_summary` VALUES (1, 8, '2026-03-02', '2026-03-04', 'Cancer', '{}', '[]', '[]', '', '', '[]', '', 3, '2026-03-04 18:46:17', 1);
INSERT INTO `discharge_summary` VALUES (3, 9, '2026-03-04', '2026-03-04', 'Philes', '{\"id\": 1, \"spo2\": 98, \"notes\": \"no\", \"pulse\": 70, \"bp_systolic\": 99, \"recorded_at\": \"2026-03-04 18:52:37\", \"recorded_by\": 1, \"sugar_level\": \"45.0\", \"temperature\": \"89.0\", \"admission_id\": 9, \"bp_diastolic\": 79, \"respiratory_rate\": 12}', '[]', '[]', '', '', '[{\"name\": \"Paracetamol\", \"dosage\": \"500mg\", \"frequency\": \"Once\"}]', '', 3, '2026-03-04 19:05:02', 1);

-- ----------------------------
-- Table structure for doctor_profiles
-- ----------------------------
DROP TABLE IF EXISTS `doctor_profiles`;
CREATE TABLE `doctor_profiles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `specialization` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `experience_years` int NULL DEFAULT 0,
  `age` int NULL DEFAULT NULL,
  `qualification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `availability_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_docprofile_userid`(`user_id` ASC) USING BTREE,
  CONSTRAINT `doctor_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of doctor_profiles
-- ----------------------------
INSERT INTO `doctor_profiles` VALUES (1, 3, 'Neurology', 'General Surgeon', 12, 51, 'MBBS, MD', NULL, 'Active');
INSERT INTO `doctor_profiles` VALUES (2, 7, 'Orthopedics', 'General Surgeon', 17, 38, 'MBBS, MD', NULL, 'Active');

-- ----------------------------
-- Table structure for doctordetails
-- ----------------------------
DROP TABLE IF EXISTS `doctordetails`;
CREATE TABLE `doctordetails`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `HospitalName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Percentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_docdet_docid`(`DocID` ASC) USING BTREE,
  INDEX `idx_docdet_docname`(`DocName` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of doctordetails
-- ----------------------------
INSERT INTO `doctordetails` VALUES ('3', '1', 'KRISHNAKUMAR', 'KRISHNA', '15', 'BLOOD TEST');
INSERT INTO `doctordetails` VALUES ('4', '4', 'Harish', 'KK Hospital', '10', 'count');
INSERT INTO `doctordetails` VALUES ('5', '5', 'DR.VISHWA MITHREN', 'MITHREN', '20', 'X RAY');
INSERT INTO `doctordetails` VALUES ('6', '1', 'Dr.Manoj', 'Sudha', '5', 'X-Ray');
INSERT INTO `doctordetails` VALUES ('7', '7', 'Dr.Elan', 'KMC', '1', 'X-Ray');
INSERT INTO `doctordetails` VALUES ('8', '2002', 'Dr. Nithis', 'KMCH', '15', 'Blood Test');
INSERT INTO `doctordetails` VALUES ('9', '001', 'Prawen', 'KMCH', '10', 'Urine Test');

-- ----------------------------
-- Table structure for doctors
-- ----------------------------
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of doctors
-- ----------------------------
INSERT INTO `doctors` VALUES ('8', 'DR.KUMARAN');

-- ----------------------------
-- Table structure for employees
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dob` date NULL DEFAULT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `blood_group` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `designation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `date_of_joining` date NOT NULL,
  `employment_type` enum('Permanent','Probation','Contract','Visiting','Intern') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Permanent',
  `status` enum('Active','Resigned','Terminated','On Leave') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `account_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ifsc_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pan_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `aadhaar_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `uan_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `esic_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `employee_code`(`employee_code` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `idx_employees_code`(`employee_code` ASC) USING BTREE,
  INDEX `idx_employees_dept`(`department` ASC) USING BTREE,
  INDEX `idx_employees_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of employees
-- ----------------------------
INSERT INTO `employees` VALUES (1, 'EMP001', 'Sarah', 'Connor', 'sarah.c@hospital.com', NULL, NULL, NULL, NULL, NULL, 'Nursing', 'Head Nurse', '2026-01-30', 'Permanent', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-30 14:42:37', '2026-01-30 14:42:37');
INSERT INTO `employees` VALUES (2, 'EMP002', 'John', 'Doe', 'john.d@hospital.com', NULL, NULL, NULL, NULL, NULL, 'Administration', 'Receptionist', '2026-01-30', 'Permanent', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-30 14:42:37', '2026-01-30 14:42:37');
INSERT INTO `employees` VALUES (3, 'EMP003', 'Emily', 'Blunt', 'emily.b@hospital.com', NULL, NULL, NULL, NULL, NULL, 'Laboratory', 'Lab Technician', '2026-01-30', 'Contract', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-30 14:42:37', '2026-01-30 14:42:37');
INSERT INTO `employees` VALUES (4, 'EMP004', 'Michael', 'Scott', 'michael.s@hospital.com', NULL, NULL, NULL, NULL, NULL, 'Administration', 'Manager', '2026-01-30', 'Permanent', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-30 14:42:37', '2026-01-30 14:42:37');
INSERT INTO `employees` VALUES (5, 'EMP005', 'Gregory', 'House', 'greg.h@hospital.com', NULL, NULL, NULL, NULL, NULL, 'Medical', 'Senior Doctor', '2026-01-30', 'Permanent', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-30 14:42:37', '2026-01-30 14:42:37');
INSERT INTO `employees` VALUES (6, 'EMP113880', 'Leenesh', 'B', 'leenesh123@gmail.com', '9698939344', '1999-01-05', 'Male', 'O+', '1/130,Thiruvalluvarnagar,Vattakanal area,Kodaikanal,Dindigul-624101', 'ENT', 'Staff Nurse', '2026-03-02', 'Visiting', 'Active', '', '', '', '', '', '', '', '2026-03-02 12:35:13', '2026-03-02 12:35:13');

-- ----------------------------
-- Table structure for enquiry
-- ----------------------------
DROP TABLE IF EXISTS `enquiry`;
CREATE TABLE `enquiry`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `eDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Regarding` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enquiry
-- ----------------------------
INSERT INTO `enquiry` VALUES ('1', '2026-01-09', 'Price Enquiry', 'ru', 'Kavin', '234567', '');
INSERT INTO `enquiry` VALUES ('2', '2026-01-10', 'Price Enquiry', 'We\'re from HMS Pharma , this message is about the price enquiry of DOLO tablets.', 'Mr. Arjun', 'arjun@gmai.com', 'Just an Normal Enquiry');
INSERT INTO `enquiry` VALUES ('3', '2026-01-10', 'Product Availability', 'Cipla 250 needed 50 quantity', 'Nithish', 'nithis@gmail.com', '-');
INSERT INTO `enquiry` VALUES ('4', '2026-01-11', 'Product Availability', 'Need Cipla 250', 'Mr. Manoj', 'manoj@gmail.com', '');
INSERT INTO `enquiry` VALUES ('5', '2026-01-11', 'Product Availability', 'paracetamol', 'Dr.Kavin', 'kavin@gmail.com', '');

-- ----------------------------
-- Table structure for fixedassets
-- ----------------------------
DROP TABLE IF EXISTS `fixedassets`;
CREATE TABLE `fixedassets`  (
  `Sno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Assets` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Rate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Percentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WDV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CurrentWDV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Additions` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fixedassets
-- ----------------------------

-- ----------------------------
-- Table structure for food_menu
-- ----------------------------
DROP TABLE IF EXISTS `food_menu`;
CREATE TABLE `food_menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `meal_time` enum('Breakfast','Lunch','Snack','Dinner','All') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `diet_category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'e.g., General, Diabetic, Liquid, Renal',
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('Active','Inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food_menu
-- ----------------------------
INSERT INTO `food_menu` VALUES (1, 'Breakfast', 'General', 'Idli & Sambar', 'Soft idlis with mild sambar', 'Active', '2026-03-06 19:55:33', '2026-03-06 19:55:33');
INSERT INTO `food_menu` VALUES (2, 'Breakfast', 'Diabetic', 'Oats Porridge', 'Sugar-free oats porridge with skimmed milk', 'Active', '2026-03-06 19:55:33', '2026-03-06 19:55:33');
INSERT INTO `food_menu` VALUES (3, 'Lunch', 'General', 'South Indian Meals', 'Rice, Dal, 1 Veg Curry, Curd', 'Active', '2026-03-06 19:55:33', '2026-03-06 19:55:33');
INSERT INTO `food_menu` VALUES (4, 'Lunch', 'Liquid', 'Clear Vegetable Soup', 'Strained vegetable broth', 'Active', '2026-03-06 19:55:33', '2026-03-06 19:55:33');
INSERT INTO `food_menu` VALUES (5, 'Dinner', 'General', 'Chapati & Dal', '2 Chapatis with Dal Makhani', 'Active', '2026-03-06 19:55:33', '2026-03-06 19:55:33');

-- ----------------------------
-- Table structure for hospital_bills
-- ----------------------------
DROP TABLE IF EXISTS `hospital_bills`;
CREATE TABLE `hospital_bills`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `admission_id` int NOT NULL,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `admission_date` datetime NULL DEFAULT NULL,
  `discharge_date` datetime NULL DEFAULT NULL,
  `total_days` int NULL DEFAULT 1,
  `bed_charge_per_day` decimal(10, 2) NULL DEFAULT NULL,
  `room_total` decimal(10, 2) NULL DEFAULT NULL,
  `doctor_fees` decimal(10, 2) NULL DEFAULT 0.00,
  `medicine_total` decimal(10, 2) NULL DEFAULT 0.00,
  `lab_total` decimal(10, 2) NULL DEFAULT 0.00,
  `grand_total` decimal(10, 2) NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PAID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hosp_bills_patient`(`patient_id` ASC) USING BTREE,
  INDEX `idx_hosp_bills_admission`(`admission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hospital_bills
-- ----------------------------
INSERT INTO `hospital_bills` VALUES (1, 'HB134185', 1, NULL, 'Elango', '2026-01-10 00:00:00', '2026-01-11 10:38:54', 2, 500.00, 1000.00, 0.00, 0.00, 0.00, 1000.00, 'PAID', '2026-01-11 10:38:54');
INSERT INTO `hospital_bills` VALUES (2, 'HB178647', 3, '1', 'RamaSwamy', '2026-01-11 00:00:00', '2026-01-11 10:39:39', 1, 500.00, 500.00, 0.00, 0.00, 0.00, 500.00, 'PAID', '2026-01-11 10:39:38');
INSERT INTO `hospital_bills` VALUES (3, 'HB020273', 4, '53', 'dhaya', '2026-01-30 00:00:00', '2026-02-27 19:33:40', 29, 500.00, 14500.00, 0.00, 0.00, 0.00, 14500.00, 'PAID', '2026-02-27 19:33:40');
INSERT INTO `hospital_bills` VALUES (4, 'HB036051', 6, '43', 'Elan', '2026-03-02 00:00:00', '2026-03-02 10:03:56', 1, 500.00, 500.00, 0.00, 0.00, 0.00, 500.00, 'PAID', '2026-03-02 10:03:56');
INSERT INTO `hospital_bills` VALUES (5, 'HB118433', 5, '46', 'Manoj Hariharan T', '2026-02-27 00:00:00', '2026-03-02 12:01:58', 4, 2000.00, 8000.00, 0.00, 0.00, 0.00, 8000.00, 'PAID', '2026-03-02 12:01:58');
INSERT INTO `hospital_bills` VALUES (6, 'HB185397', 8, '6', 'Arjun', '2026-03-02 00:00:00', '2026-03-04 18:46:25', 3, 2000.00, 6000.00, 0.00, 0.00, 0.00, 6000.00, 'UNPAID', '2026-03-04 18:46:25');
INSERT INTO `hospital_bills` VALUES (7, 'HB326789', 9, '19', 'Gokul', '2026-03-04 00:00:00', '2026-03-04 19:05:27', 1, 2000.00, 2000.00, 0.00, 0.00, 0.00, 2000.00, 'UNPAID', '2026-03-04 19:05:26');

-- ----------------------------
-- Table structure for income
-- ----------------------------
DROP TABLE IF EXISTS `income`;
CREATE TABLE `income`  (
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stuRegno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StuRollNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FeeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Head` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StuName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Paid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Fine` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CashType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FeeNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Academic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of income
-- ----------------------------

-- ----------------------------
-- Table structure for incometrash
-- ----------------------------
DROP TABLE IF EXISTS `incometrash`;
CREATE TABLE `incometrash`  (
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stuRegno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StuRollNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FeeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Head` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `StuName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Paid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Fine` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CashType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FeeNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Academic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TrashDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of incometrash
-- ----------------------------

-- ----------------------------
-- Table structure for invoice_items
-- ----------------------------
DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE `invoice_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT 1,
  `unit_price` decimal(10, 2) NULL DEFAULT NULL,
  `total` decimal(10, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `invoice_id`(`invoice_id` ASC) USING BTREE,
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of invoice_items
-- ----------------------------
INSERT INTO `invoice_items` VALUES (2, 2, 'Paracetamol', 3, 1.00, 3.00);
INSERT INTO `invoice_items` VALUES (4, 4, 'Paracetamol', 4, 5.00, 20.00);
INSERT INTO `invoice_items` VALUES (5, 5, 'ANACINE', 1, 10.00, 10.00);

-- ----------------------------
-- Table structure for invoices
-- ----------------------------
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `invoice_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` datetime NULL DEFAULT NULL,
  `total_amount` decimal(10, 2) NULL DEFAULT 0.00,
  `paid_amount` decimal(10, 2) NULL DEFAULT 0.00,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'General',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_invoices_patient`(`patient_name` ASC) USING BTREE,
  INDEX `idx_invoices_date`(`invoice_date` ASC) USING BTREE,
  INDEX `idx_invoices_status`(`status` ASC) USING BTREE,
  INDEX `idx_invoices_category`(`category` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of invoices
-- ----------------------------
INSERT INTO `invoices` VALUES (2, 'Manoj HAriharan T', '2026-01-10 16:51:13', '2026-01-10 00:00:00', 3.00, 3.00, 'Paid', 'OPD');
INSERT INTO `invoices` VALUES (4, 'dhaya', '2026-01-30 20:29:02', '2026-01-30 00:00:00', 20.00, 20.00, 'Paid', 'General');
INSERT INTO `invoices` VALUES (5, 'Nithish', '2026-03-02 12:05:43', '2026-03-02 00:00:00', 10.00, 10.00, 'Paid', 'OPD');

-- ----------------------------
-- Table structure for ipd_admissions
-- ----------------------------
DROP TABLE IF EXISTS `ipd_admissions`;
CREATE TABLE `ipd_admissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `admission_date` datetime NULL DEFAULT NULL,
  `doctor_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bed_id` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Admitted',
  `discharge_date` datetime NULL DEFAULT NULL,
  `triage_status` enum('Pending','Completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `discharge_ready` tinyint(1) NULL DEFAULT 0,
  `discharge_initiated_by` int NULL DEFAULT NULL,
  `diet_preference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bed_id`(`bed_id` ASC) USING BTREE,
  INDEX `idx_ipd_patient_id`(`patient_id` ASC) USING BTREE,
  INDEX `idx_ipd_patient_name`(`patient_name` ASC) USING BTREE,
  INDEX `idx_ipd_bed_id`(`bed_id` ASC) USING BTREE,
  INDEX `idx_ipd_status`(`status` ASC) USING BTREE,
  INDEX `idx_ipd_admission_date`(`admission_date` ASC) USING BTREE,
  CONSTRAINT `ipd_admissions_ibfk_1` FOREIGN KEY (`bed_id`) REFERENCES `beds` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_admissions
-- ----------------------------
INSERT INTO `ipd_admissions` VALUES (1, NULL, 'Elango', '2026-01-10 00:00:00', 'Dr.KUMARAN', 1, 'DENGUE FEVER', 'Discharged', '2026-01-11 10:38:54', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (2, NULL, 'Manoj Hariharan T', '2026-01-10 00:00:00', 'Dr.PRaveen', 11, '', 'Discharged', '2026-01-10 16:48:57', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (3, '1', 'RamaSwamy', '2026-01-11 00:00:00', 'fghjk', 1, '', 'Discharged', '2026-01-11 10:39:39', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (4, '53', 'dhaya', '2026-01-30 00:00:00', 'Dr.Manoj', 1, 'checkup', 'Discharged', '2026-02-27 19:33:40', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (5, '46', 'Manoj Hariharan T', '2026-02-27 00:00:00', 'Dr Manoj', 15, '', 'Discharged', '2026-03-02 12:01:58', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (6, '43', 'Elan', '2026-03-02 00:00:00', 'Dr. Manoj', 2, 'Dengu', 'Discharged', '2026-03-02 10:03:56', 'Pending', 0, NULL, NULL);
INSERT INTO `ipd_admissions` VALUES (7, '49', 'Manoj Hariharan T', '2026-03-02 00:00:00', 'Dr. Elango', 4, 'Skull Injury', 'Admitted', NULL, 'Pending', 0, NULL, 'curd rice');
INSERT INTO `ipd_admissions` VALUES (8, '6', 'Arjun', '2026-03-02 00:00:00', 'Dr. Manoj', 12, 'Cancer', 'Discharged', '2026-03-04 18:46:25', 'Pending', 1, 3, NULL);
INSERT INTO `ipd_admissions` VALUES (9, '19', 'Gokul', '2026-03-04 00:00:00', 'Dr.K.Bala', 11, 'Philes', 'Discharged', '2026-03-04 19:05:27', 'Completed', 1, 3, NULL);

-- ----------------------------
-- Table structure for ipd_billing_folio
-- ----------------------------
DROP TABLE IF EXISTS `ipd_billing_folio`;
CREATE TABLE `ipd_billing_folio`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `charge_type` enum('Room','Medication','Consumable','Lab','Procedure','Diet','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT 1,
  `unit_price` decimal(10, 2) NULL DEFAULT NULL,
  `total_price` decimal(10, 2) NULL DEFAULT NULL,
  `charged_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_folio_admission`(`admission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_billing_folio
-- ----------------------------
INSERT INTO `ipd_billing_folio` VALUES (1, 9, 'Medication', 'Paracetamol', 1, 0.00, 0.00, '2026-03-04 18:53:22');

-- ----------------------------
-- Table structure for ipd_doctor_rounds
-- ----------------------------
DROP TABLE IF EXISTS `ipd_doctor_rounds`;
CREATE TABLE `ipd_doctor_rounds`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `subjective` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `objective` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `assessment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `plan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `round_date` date NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_rounds_admission`(`admission_id` ASC) USING BTREE,
  INDEX `idx_rounds_doctor`(`doctor_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_doctor_rounds
-- ----------------------------

-- ----------------------------
-- Table structure for ipd_emar
-- ----------------------------
DROP TABLE IF EXISTS `ipd_emar`;
CREATE TABLE `ipd_emar`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `admission_id` int NOT NULL,
  `administered_by` int NOT NULL,
  `administered_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_emar_order`(`order_id` ASC) USING BTREE,
  INDEX `idx_emar_admission`(`admission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_emar
-- ----------------------------
INSERT INTO `ipd_emar` VALUES (1, 1, 9, 1, '2026-03-04 18:53:22', 'no');

-- ----------------------------
-- Table structure for ipd_orders
-- ----------------------------
DROP TABLE IF EXISTS `ipd_orders`;
CREATE TABLE `ipd_orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `ordered_by` int NOT NULL,
  `order_type` enum('Medication','Procedure','Lab','Diet','Consumable') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dosage` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `frequency` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('Pending','Acknowledged','Administered','Completed','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_orders_admission`(`admission_id` ASC) USING BTREE,
  INDEX `idx_orders_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_orders
-- ----------------------------
INSERT INTO `ipd_orders` VALUES (1, 9, 3, 'Medication', 'Paracetamol', '500mg', 'Once', 'no', 'Administered', '2026-03-04 18:50:35');
INSERT INTO `ipd_orders` VALUES (2, 7, 3, 'Diet', 'curd rice', '1 plate', NULL, 'no spicy food', 'Pending', '2026-03-04 19:33:32');

-- ----------------------------
-- Table structure for ipd_vitals
-- ----------------------------
DROP TABLE IF EXISTS `ipd_vitals`;
CREATE TABLE `ipd_vitals`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_id` int NOT NULL,
  `recorded_by` int NOT NULL,
  `bp_systolic` int NULL DEFAULT NULL,
  `bp_diastolic` int NULL DEFAULT NULL,
  `temperature` decimal(4, 1) NULL DEFAULT NULL,
  `pulse` int NULL DEFAULT NULL,
  `spo2` int NULL DEFAULT NULL,
  `sugar_level` decimal(6, 1) NULL DEFAULT NULL,
  `respiratory_rate` int NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `recorded_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_vitals_admission`(`admission_id` ASC) USING BTREE,
  INDEX `idx_vitals_recorded`(`recorded_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipd_vitals
-- ----------------------------
INSERT INTO `ipd_vitals` VALUES (1, 9, 1, 99, 79, 89.0, 70, 98, 45.0, 12, 'no', '2026-03-04 18:52:37');
INSERT INTO `ipd_vitals` VALUES (2, 9, 1, 34, 23, 23.0, 32, 33, 334.0, 33, 'bn', '2026-03-04 18:53:50');

-- ----------------------------
-- Table structure for lab_bill_items
-- ----------------------------
DROP TABLE IF EXISTS `lab_bill_items`;
CREATE TABLE `lab_bill_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int NULL DEFAULT NULL,
  `pcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `amount` decimal(10, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bill_id`(`bill_id` ASC) USING BTREE,
  CONSTRAINT `lab_bill_items_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `lab_bills` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_bill_items
-- ----------------------------
INSERT INTO `lab_bill_items` VALUES (1, 1, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (2, 6, 'T001', 'Test Item', 50.00, 50.00);
INSERT INTO `lab_bill_items` VALUES (3, 7, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (4, 7, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (5, 8, 'AUTO', 'CBC - COMPLETE BLODD COUNT', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (6, 8, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (7, 9, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (8, 9, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (9, 10, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (10, 11, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (11, 11, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (12, 12, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (13, 12, 'T002', 'Urine Test', 200.00, 200.00);
INSERT INTO `lab_bill_items` VALUES (14, 13, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (15, 13, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (16, 14, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (17, 15, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (18, 15, 'T001', 'Blood Test - CBC', 500.00, 500.00);
INSERT INTO `lab_bill_items` VALUES (19, 16, 'AUTO', 'CBC - COMPLETE BLODD COUNT', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (20, 16, 'T-AUTO', 'CBC - COMPLETE BLODD COUNT - PDW', 300.00, 300.00);
INSERT INTO `lab_bill_items` VALUES (21, 18, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (22, 18, 'T-AUTO', 'CBC - COMPLETE BLODD COUNT - Gran#', 300.00, 300.00);
INSERT INTO `lab_bill_items` VALUES (23, 19, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (24, 19, 'T-AUTO', 'CBC - COMPLETE BLODD COUNT - Gran#', 300.00, 300.00);
INSERT INTO `lab_bill_items` VALUES (25, 20, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (26, 20, 'T-AUTO', 'BT CT - CT', 200.00, 200.00);
INSERT INTO `lab_bill_items` VALUES (27, 21, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (28, 21, 'T-AUTO', 'BLOOD GROUP - BLOOD GROUP', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (29, 22, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (30, 22, 'T-AUTO', 'BT CT - CT', 200.00, 200.00);
INSERT INTO `lab_bill_items` VALUES (31, 23, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (32, 23, 'T-AUTO', 'BLOOD GROUP - RH TYPE', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (33, 26, 'T-AUTO', 'BLOOD GROUP - BLOOD GROUP', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (34, 27, 'T-AUTO', 'BLOOD GROUP - RH TYPE', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (35, 28, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (36, 28, 'T-AUTO', 'BLOOD GROUP - BLOOD GROUP', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (37, 29, 'T-AUTO', 'CBC - COMPLETE BLODD COUNT - Gran#', 300.00, 300.00);
INSERT INTO `lab_bill_items` VALUES (38, 30, 'AUTO', 'BT CT', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (39, 30, 'T-AUTO', 'BT CT - BT', 200.00, 200.00);
INSERT INTO `lab_bill_items` VALUES (40, 31, 'AUTO', 'BLOOD GROUP', 0.00, 0.00);
INSERT INTO `lab_bill_items` VALUES (41, 31, 'T-AUTO', 'BLOOD GROUP - BLOOD GROUP', 120.00, 120.00);
INSERT INTO `lab_bill_items` VALUES (42, 32, 'T-AUTO', 'BT CT - BT', 200.00, 200.00);
INSERT INTO `lab_bill_items` VALUES (43, 33, 'T-AUTO', 'CBC - COMPLETE BLODD COUNT - Mid#', 300.00, 300.00);
INSERT INTO `lab_bill_items` VALUES (44, 34, 'T-AUTO', 'BT CT - CT', 200.00, 200.00);

-- ----------------------------
-- Table structure for lab_bills
-- ----------------------------
DROP TABLE IF EXISTS `lab_bills`;
CREATE TABLE `lab_bills`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bill_date` date NULL DEFAULT NULL,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `total_amount` decimal(10, 2) NULL DEFAULT NULL,
  `gst_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `bill_no`(`bill_no` ASC) USING BTREE,
  INDEX `idx_labbills_patient_id`(`patient_id` ASC) USING BTREE,
  INDEX `idx_labbills_date`(`bill_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_bills
-- ----------------------------
INSERT INTO `lab_bills` VALUES (1, 'Auto', '2026-01-09', '20', 'Veeran', 500.00, '', '2026-01-09 16:02:19');
INSERT INTO `lab_bills` VALUES (6, 'TEST-1768068385393', '2025-01-01', 'P001', 'Test Patient', 100.00, 'GST123', '2026-01-10 23:36:25');
INSERT INTO `lab_bills` VALUES (7, 'LB007', '2026-01-10', '41', 'Prawin', 500.00, '', '2026-01-10 23:40:00');
INSERT INTO `lab_bills` VALUES (8, 'LB008', '2026-01-10', '43', 'Elan', 500.00, '', '2026-01-10 23:48:03');
INSERT INTO `lab_bills` VALUES (9, 'LB009', '2026-01-10', '46', 'Manoj Hariharan T', 500.00, '', '2026-01-10 23:48:51');
INSERT INTO `lab_bills` VALUES (10, 'LB010', '2026-01-10', '45', 'elango', 0.00, '', '2026-01-10 23:58:56');
INSERT INTO `lab_bills` VALUES (11, 'LB011', '2026-01-10', '43', 'Elan', 500.00, '', '2026-01-11 00:04:39');
INSERT INTO `lab_bills` VALUES (12, 'LB012', '2026-01-10', '46', 'Manoj Hariharan T', 200.00, '', '2026-01-11 00:05:17');
INSERT INTO `lab_bills` VALUES (13, 'LB013', '2026-01-10', '5', 'Ramu', 500.00, '', '2026-01-11 00:26:41');
INSERT INTO `lab_bills` VALUES (14, 'LB014', '2026-01-10', '16', 'surya', 500.00, '', '2026-01-11 00:33:14');
INSERT INTO `lab_bills` VALUES (15, 'LB015', '2026-01-10', '40', 'Manoj', 500.00, '', '2026-01-11 00:38:29');
INSERT INTO `lab_bills` VALUES (16, 'LB016', '2026-01-10', '40', 'Manoj', 300.00, '-', '2026-01-11 02:28:30');
INSERT INTO `lab_bills` VALUES (17, 'LB017', '2026-01-11', '', '', 0.00, '', '2026-01-11 10:14:58');
INSERT INTO `lab_bills` VALUES (18, 'LB018', '2026-01-11', '38', 'Preethi', 300.00, '', '2026-01-11 10:16:10');
INSERT INTO `lab_bills` VALUES (19, 'LB019', '2026-01-11', '43', 'Elan', 300.00, '', '2026-01-11 10:24:33');
INSERT INTO `lab_bills` VALUES (20, 'LB020', '2026-01-11', '41', 'Prawin', 200.00, '', '2026-01-11 10:36:08');
INSERT INTO `lab_bills` VALUES (21, 'LB021', '2026-01-11', '46', 'Manoj Hariharan T', 120.00, '', '2026-01-11 13:12:57');
INSERT INTO `lab_bills` VALUES (22, 'LB022', '2026-01-14', '49', 'Manoj Hariharan T', 200.00, '', '2026-01-14 09:58:48');
INSERT INTO `lab_bills` VALUES (23, 'LB023', '2026-01-15', '49', 'Manoj Hariharan T', 120.00, '', '2026-01-15 23:13:20');
INSERT INTO `lab_bills` VALUES (24, 'LB024', '2026-01-16', '', '', 0.00, '', '2026-01-16 12:37:34');
INSERT INTO `lab_bills` VALUES (25, 'LB025', '2026-01-20', '', '', 0.00, '', '2026-01-20 09:37:13');
INSERT INTO `lab_bills` VALUES (26, 'LB026', '2026-01-20', '50', 'Guhan', 120.00, '', '2026-01-20 18:33:44');
INSERT INTO `lab_bills` VALUES (27, 'LB027', '2026-01-20', '40', 'Manoj', 120.00, '', '2026-01-20 22:01:56');
INSERT INTO `lab_bills` VALUES (28, 'LB028', '2026-01-22', '50', 'Guhan', 120.00, '', '2026-01-22 10:22:02');
INSERT INTO `lab_bills` VALUES (29, 'LB029', '2026-01-22', '40', 'Manoj', 300.00, '', '2026-01-22 10:25:14');
INSERT INTO `lab_bills` VALUES (30, 'LB030', '2026-01-22', '2', 'Laskhman', 200.00, '', '2026-01-22 11:38:08');
INSERT INTO `lab_bills` VALUES (31, 'LB031', '2026-01-23', '51', 'Aadhi', 120.00, '', '2026-01-23 10:33:10');
INSERT INTO `lab_bills` VALUES (32, 'LB032', '2026-02-12', '40', 'Manoj', 200.00, '', '2026-02-12 19:46:13');
INSERT INTO `lab_bills` VALUES (33, 'LB033', '2026-03-02', '43', 'Elan', 300.00, '', '2026-03-02 12:23:16');
INSERT INTO `lab_bills` VALUES (34, 'LB034', '2026-03-02', '43', 'Elan', 200.00, '', '2026-03-02 12:23:19');

-- ----------------------------
-- Table structure for lab_doctor_entry
-- ----------------------------
DROP TABLE IF EXISTS `lab_doctor_entry`;
CREATE TABLE `lab_doctor_entry`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `doc_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `test_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'All',
  `hospital_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `percentage` decimal(5, 2) NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_doctor_entry
-- ----------------------------
INSERT INTO `lab_doctor_entry` VALUES (1, '1', 'Dr.Maran', 'X-Ray', 'GH', 4.00, '2026-01-09 15:18:02', '2026-01-09 15:18:02');

-- ----------------------------
-- Table structure for lab_request_items
-- ----------------------------
DROP TABLE IF EXISTS `lab_request_items`;
CREATE TABLE `lab_request_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NULL DEFAULT NULL,
  `test_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING',
  `report_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `request_id`(`request_id` ASC) USING BTREE,
  INDEX `idx_labreqitem_request_id`(`request_id` ASC) USING BTREE,
  INDEX `idx_labreqitem_status`(`status` ASC) USING BTREE,
  CONSTRAINT `lab_request_items_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `lab_requests` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_request_items
-- ----------------------------
INSERT INTO `lab_request_items` VALUES (1, 1, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (2, 2, 'BLOOD GROUP - RH TYPE', 'HEMATOLOGY', 120.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (3, 3, 'CBC - COMPLETE BLODD COUNT - Gran%', 'HEMATOLOGY', 300.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (4, 4, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (5, 5, 'BLOOD GROUP - RH TYPE', 'HEMATOLOGY', 120.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (6, 6, 'BT CT - CT', 'HEMATOLOGY', 200.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (7, 7, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', NULL);
INSERT INTO `lab_request_items` VALUES (8, 8, 'CBC - COMPLETE BLODD COUNT - HCT', 'HEMATOLOGY', 300.00, 'COMPLETED', '4');
INSERT INTO `lab_request_items` VALUES (9, 9, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '5');
INSERT INTO `lab_request_items` VALUES (10, 10, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '6');
INSERT INTO `lab_request_items` VALUES (11, 10, 'BT CT - CT', 'HEMATOLOGY', 200.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (12, 10, 'CBC - COMPLETE BLODD COUNT - Gran#', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (13, 10, 'CBC - COMPLETE BLODD COUNT - Gran%', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (14, 10, 'CBC - COMPLETE BLODD COUNT - HGB', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (15, 10, 'CBC - COMPLETE BLODD COUNT - HCT', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (16, 10, 'CBC - COMPLETE BLODD COUNT - Lymph#', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (17, 10, 'BT CT - BT', 'HEMATOLOGY', 200.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (18, 10, 'BLOOD GROUP - RH TYPE', 'HEMATOLOGY', 120.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (19, 10, 'CBC - COMPLETE BLODD COUNT - MCHC', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (20, 10, 'CBC - COMPLETE BLODD COUNT - MCH', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (21, 10, 'CBC - COMPLETE BLODD COUNT - MCV', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (22, 10, 'CBC - COMPLETE BLODD COUNT - Mid%', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (23, 10, 'CBC - COMPLETE BLODD COUNT - MPV', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (24, 10, 'CBC - COMPLETE BLODD COUNT - Mid#', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (25, 10, 'CBC - COMPLETE BLODD COUNT - PCT', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (26, 10, 'CBC - COMPLETE BLODD COUNT - P -LCR', 'HEMATOLOGY', 300.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (27, 11, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '7');
INSERT INTO `lab_request_items` VALUES (28, 12, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '8');
INSERT INTO `lab_request_items` VALUES (29, 13, 'BLOOD GROUP - RH TYPE', 'HEMATOLOGY', 120.00, 'COMPLETED', '9');
INSERT INTO `lab_request_items` VALUES (30, 14, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '10');
INSERT INTO `lab_request_items` VALUES (31, 14, 'BT CT - BT', 'HEMATOLOGY', 200.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (32, 15, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '11');
INSERT INTO `lab_request_items` VALUES (33, 16, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '12');
INSERT INTO `lab_request_items` VALUES (34, 17, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'COMPLETED', '17');
INSERT INTO `lab_request_items` VALUES (35, 18, 'BT CT - BT', 'HEMATOLOGY', 200.00, 'PENDING', NULL);
INSERT INTO `lab_request_items` VALUES (36, 19, 'BLOOD GROUP - BLOOD GROUP', 'HEMATOLOGY', 120.00, 'PENDING', NULL);

-- ----------------------------
-- Table structure for lab_requests
-- ----------------------------
DROP TABLE IF EXISTS `lab_requests`;
CREATE TABLE `lab_requests`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `doctor_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `doctor_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `request_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `priority` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Routine',
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `approved_by` int NULL DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_labreq_status`(`status` ASC) USING BTREE,
  INDEX `idx_labreq_patient_id`(`patient_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_requests
-- ----------------------------
INSERT INTO `lab_requests` VALUES (1, '46', 'Manoj Hariharan T', 'DOC001', 'Dr. Sarah Wilson', '2026-01-10 23:20:36', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (2, '41', 'Prawin', 'DOC001', 'Dr. Sarah Wilson', '2026-01-10 23:32:25', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (3, '43', 'Elan', 'DOC001', 'Dr. Sarah Wilson', '2026-01-10 23:47:22', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (4, '45', 'elango', 'DOC001', 'Dr. Sarah Wilson', '2026-01-10 23:58:30', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (5, '5', 'Ramu', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 00:26:17', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (6, '16', 'surya', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 00:32:37', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (7, '40', 'Manoj', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 00:38:05', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (8, '40', 'Manoj', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 02:26:57', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (9, '38', 'Preethi', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 10:15:37', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (10, '43', 'Elan', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 10:23:39', 'Routine', 'IN_PROGRESS', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (11, '41', 'Prawin', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 10:35:38', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (12, '46', 'Manoj Hariharan T', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 13:12:16', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (13, '46', 'Manoj Hariharan T', 'DOC001', 'Dr. Sarah Wilson', '2026-01-11 13:16:41', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (14, '49', 'Manoj Hariharan T', 'DOC001', 'Dr. Sarah Wilson', '2026-01-14 09:57:55', 'Routine', 'IN_PROGRESS', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (15, '49', 'Manoj Hariharan T', 'DOC001', 'Dr. Sarah Wilson', '2026-01-15 23:12:35', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (16, '50', 'Guhan', 'DOC001', 'Dr. Sarah Wilson', '2026-01-20 18:32:19', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (17, '51', 'Aadhi', 'DOC001', 'Dr. Sarah Wilson', '2026-01-23 10:30:52', 'Routine', 'COMPLETED', 'Requested via Doctor Module', NULL, NULL, NULL);
INSERT INTO `lab_requests` VALUES (18, '43', 'Elan', 'DOC001', 'Dr. Sarah Wilson', '2026-03-02 12:11:12', 'Routine', 'APPROVED', 'Requested via Doctor Module', 4, '', '2026-03-02 12:14:47');
INSERT INTO `lab_requests` VALUES (19, '55', 'Elango K', 'DOC001', 'Dr. Sarah Wilson', '2026-03-02 12:11:13', 'Routine', 'APPROVED', 'Requested via Doctor Module', 4, '', '2026-03-02 12:14:43');

-- ----------------------------
-- Table structure for lab_test_entries
-- ----------------------------
DROP TABLE IF EXISTS `lab_test_entries`;
CREATE TABLE `lab_test_entries`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `age` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ref_doctor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `test_date` date NULL DEFAULT NULL,
  `visit_date` date NULL DEFAULT NULL,
  `department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `test_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sub_test_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_test_entries
-- ----------------------------

-- ----------------------------
-- Table structure for labtest
-- ----------------------------
DROP TABLE IF EXISTS `labtest`;
CREATE TABLE `labtest`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PatientID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BloodGrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RefDoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Speciman` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PSex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTestNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PUnit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestResult` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NormalValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NextDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Reports` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubTestName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_labtest_patientid`(`PatientID` ASC) USING BTREE,
  INDEX `idx_labtest_tdate`(`TDate` ASC) USING BTREE,
  INDEX `idx_labtest_testtype`(`TypeTest` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of labtest
-- ----------------------------
INSERT INTO `labtest` VALUES ('1', '2026-01-10', NULL, '5', 'Ramu', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '6', NULL, 'BLOOD GROUP', NULL, 'RH TYPE', NULL, NULL, NULL, NULL, '2026-01-10', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('2', '2026-01-10', NULL, '16', 'surya', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '23', NULL, 'BT CT', NULL, 'CT', NULL, NULL, NULL, NULL, '2026-01-10', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('3', '2026-01-10', NULL, '40', 'Manoj', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '66', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-10', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('4', '2026-01-10', NULL, '40', 'Manoj', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '66', NULL, 'CBC - COMPLETE BLODD COUNT', NULL, 'COMPLETE BLODD COUNT', NULL, NULL, NULL, NULL, '2026-01-10', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('5', '2026-01-11', NULL, '38', 'Preethi', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '24', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-11', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('6', '2026-01-11', NULL, '43', 'Elan', NULL, 'Dr. Sarah Wilson', NULL, 'Male', '20', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-11', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('7', '2026-01-11', NULL, '41', 'Prawin', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '24', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-11', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('8', '2026-01-11', NULL, '46', 'Manoj Hariharan T', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '20', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-11', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('9', '2026-01-11', NULL, '46', 'Manoj Hariharan T', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '20', NULL, 'BLOOD GROUP', NULL, 'RH TYPE', NULL, NULL, NULL, NULL, '2026-01-11', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('10', '2026-01-14', NULL, '49', 'Manoj Hariharan T', NULL, 'Dr. Sarah Wilson', NULL, 'm', '22', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-14', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('11', '2026-01-15', NULL, '49', 'Manoj Hariharan T', NULL, 'Dr. Sarah Wilson', NULL, 'm', '22', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-15', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('12', '2026-01-20', NULL, '50', 'Guhan', NULL, 'Manickam', NULL, 'MALE', '30', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-20', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('13', '2026-01-20', NULL, '40', 'Manoj', NULL, 'Dr. Manoj', NULL, 'Male', '23', NULL, 'BLOOD GROUP', NULL, '', NULL, NULL, NULL, NULL, '2026-01-20', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('14', '2026-01-22', NULL, '50', 'Guhan', NULL, 'Dr. Manoj', NULL, 'Male', '20', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-22', NULL, 'CLINICAL PATHOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('15', '2026-01-22', NULL, '40', 'Manoj', NULL, 'Dr. Manoj', NULL, 'Male', '23', NULL, 'CBC - COMPLETE BLODD COUNT', NULL, 'Gran#', NULL, NULL, NULL, NULL, '2026-01-22', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('16', '2026-01-22', NULL, '2', 'Laskhman', NULL, 'Dr.Krishnan', NULL, 'MALE', '66', NULL, 'BT CT', NULL, 'BT', NULL, NULL, NULL, NULL, '2026-01-22', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('17', '2026-01-23', NULL, '51', 'Aadhi', NULL, 'Dr. Sarah Wilson', NULL, 'MALE', '24', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-23', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('18', '2026-01-23', NULL, '51', 'Aadhi', NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-23', NULL, 'HEMATOLOGY', NULL, NULL, NULL);
INSERT INTO `labtest` VALUES ('19', '2026-01-23', NULL, '51', 'Aadhi', NULL, 'Dr. K. Kumaran', NULL, 'Male', '20', NULL, 'BLOOD GROUP', NULL, 'BLOOD GROUP', NULL, NULL, NULL, NULL, '2026-01-23', NULL, 'HEMATOLOGY', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for log_details
-- ----------------------------
DROP TABLE IF EXISTS `log_details`;
CREATE TABLE `log_details`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `login_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_username`(`username` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_logdet_username`(`username` ASC) USING BTREE,
  INDEX `idx_logdet_created`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of log_details
-- ----------------------------
INSERT INTO `log_details` VALUES (1, 'system', 'System', 'Test Log', 'This is a test log', '2026-02-13 19:55:11', '2026-02-13 19:55:11');
INSERT INTO `log_details` VALUES (2, 'system', 'System', 'Test Log', 'This is a test log', '2026-02-13 19:55:56', '2026-02-13 19:55:56');
INSERT INTO `log_details` VALUES (3, 'system', 'System', 'Test Log', 'This is a test log', '2026-02-13 19:56:19', '2026-02-13 19:56:19');
INSERT INTO `log_details` VALUES (4, 'system', 'System', 'Test Log', 'This is a test log', '2026-02-13 19:56:49', '2026-02-13 19:56:49');
INSERT INTO `log_details` VALUES (5, 'admin', 'Admin', 'Create User', 'Created user DOC001 with role Doctor', '2026-02-13 20:26:35', '2026-02-13 20:26:35');
INSERT INTO `log_details` VALUES (6, 'admin', 'Admin', 'Create User', 'Created user kavinkumar@gmail.comw with role Lab Technician', '2026-02-14 18:49:07', '2026-02-14 18:49:07');

-- ----------------------------
-- Table structure for logdetails
-- ----------------------------
DROP TABLE IF EXISTS `logdetails`;
CREATE TABLE `logdetails`  (
  `sno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `UDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `UTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of logdetails
-- ----------------------------
INSERT INTO `logdetails` VALUES ('531', 'Omega', '24-09-2022', '16:45:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('532', 'admin', '24-09-2022', '16:46:25 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('533', 'admin', '24-09-2022', '16:47:47 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('534', 'admin', '24-09-2022', '16:58:26 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('535', 'dhiya', '27-09-2022', '18:14:09 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('536', 'admin', '07-10-2022', '07:55:17 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('537', 'test', '07-10-2022', '07:56:35 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('538', 'test', '09-10-2022', '11:54:02 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('539', 'admin', '25-10-2022', '09:09:51 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('540', 'admin', '25-10-2022', '09:11:00 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('541', 'dhiya', '25-10-2022', '09:16:08 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('542', 'dhiya', '25-10-2022', '09:16:57 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('543', 'admin', '25-10-2022', '09:25:58 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('544', 'admin', '25-10-2022', '09:28:15 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('545', 'admin', '25-10-2022', '09:29:08 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('546', 'admin', '25-10-2022', '09:31:57 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('547', 'admin', '25-10-2022', '09:32:48 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('548', 'admin', '25-10-2022', '09:34:38 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('549', 'admin', '25-10-2022', '09:38:08 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('550', 'admin', '25-10-2022', '09:42:37 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('551', 'admin', '25-10-2022', '10:30:41 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('552', 'admin', '25-10-2022', '10:31:21 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('553', 'admin', '25-10-2022', '10:32:08 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('554', 'admin', '25-10-2022', '10:32:35 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('555', 'admin', '25-10-2022', '10:33:15 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('556', 'admin', '25-10-2022', '10:34:51 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('557', 'admin', '25-10-2022', '10:36:41 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('558', 'admin', '25-10-2022', '10:37:09 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('559', 'admin', '25-10-2022', '11:28:51 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('560', 'admin', '25-10-2022', '11:29:48 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('561', 'admin', '25-10-2022', '11:30:39 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('562', 'admin', '25-10-2022', '11:36:45 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('563', 'test1', '27-10-2022', '22:13:28 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('564', 'admin', '19-12-2024', '17:04:02 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('565', 'admin', '19-12-2024', '17:08:09 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('566', 'admin', '19-12-2024', '17:13:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('567', 'admin', '19-12-2024', '17:14:30 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('568', 'admin', '19-12-2024', '17:30:28 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('569', 'admin', '19-12-2024', '17:31:02 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('570', 'admin', '19-12-2024', '17:34:56 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('571', 'admin', '19-12-2024', '17:45:52 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('572', 'admin', '19-12-2024', '17:47:13 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('573', 'admin', '19-12-2024', '17:54:16 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('574', 'admin', '19-12-2024', '17:56:41 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('575', 'admin', '19-12-2024', '17:57:42 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('576', 'admin', '20-12-2024', '11:50:56 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('577', 'admin', '20-12-2024', '12:37:23 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('578', 'admin', '20-12-2024', '13:35:09 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('579', 'admin', '20-12-2024', '13:55:55 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('580', 'admin', '20-12-2024', '14:05:23 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('581', 'admin', '20-12-2024', '14:13:41 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('582', 'admin', '20-12-2024', '17:44:44 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('583', 'admin', '20-12-2024', '18:29:59 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('584', 'admin', '21-12-2024', '15:48:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('585', 'kumaran', '21-12-2024', '15:49:39 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('586', 'staff', '21-12-2024', '15:50:22 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('587', 'kumaran', '21-12-2024', '15:50:48 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('588', 'admin', '21-12-2024', '16:01:34 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('589', 'admin', '21-12-2024', '16:04:47 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('590', 'admin', '21-12-2024', '16:26:33 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('591', 'admin', '21-12-2024', '16:32:00 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('592', 'admin', '21-12-2024', '16:35:52 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('593', 'admin', '21-12-2024', '16:44:29 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('594', 'admin', '21-12-2024', '17:08:21 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('595', 'admin', '21-12-2024', '17:12:17 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('596', 'admin', '21-12-2024', '17:49:30 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('597', 'admin', '21-12-2024', '18:15:57 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('598', 'admin', '21-12-2024', '18:22:58 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('599', 'admin', '21-12-2024', '18:26:57 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('600', 'admin', '21-12-2024', '18:33:17 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('601', 'admin', '21-12-2024', '18:40:19 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('602', 'admin', '21-12-2024', '18:55:56 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('603', 'admin', '22-12-2024', '11:41:31 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('604', 'admin', '23-12-2024', '13:35:16 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('605', 'admin', '24-12-2024', '08:43:09 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('606', 'admin', '24-12-2024', '09:25:25 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('607', 'admin', '24-12-2024', '09:27:34 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('608', 'admin', '24-12-2024', '09:30:05 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('609', 'admin', '24-12-2024', '15:30:41 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('610', 'admin', '24-12-2024', '15:47:13 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('611', 'admin', '24-12-2024', '15:51:25 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('612', 'admin', '25-12-2024', '09:15:00 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('613', 'admin', '25-12-2024', '11:28:35 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('614', 'admin', '26-12-2024', '12:00:07 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('615', 'admin', '26-12-2024', '12:00:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('616', 'admin', '26-12-2024', '12:51:42 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('617', 'admin', '26-12-2024', '14:29:55 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('618', 'admin', '26-12-2024', '14:56:33 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('619', 'admin', '26-12-2024', '15:00:24 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('620', 'admin', '26-12-2024', '19:11:18 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('621', 'admin', '27-12-2024', '08:39:46 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('622', 'admin', '27-12-2024', '09:25:54 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('623', 'admin', '27-12-2024', '12:12:06 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('624', 'admin', '28-12-2024', '08:22:35 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('625', 'admin', '28-12-2024', '17:57:08 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('626', 'admin', '29-12-2024', '11:33:01 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('627', 'admin', '29-12-2024', '15:08:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('628', 'admin', '30-12-2024', '10:18:20 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('629', 'admin', '30-12-2024', '12:09:54 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('630', 'admin', '30-12-2024', '12:35:02 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('631', 'admin', '30-12-2024', '12:40:48 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('632', 'admin', '30-12-2024', '13:09:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('633', 'admin', '30-12-2024', '13:41:32 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('634', 'admin', '30-12-2024', '15:10:52 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('635', 'admin', '30-12-2024', '18:15:44 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('636', 'admin', '30-12-2024', '18:20:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('637', 'admin', '31-12-2024', '11:49:47 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('638', 'admin', '31-12-2024', '11:57:04 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('639', 'admin', '31-12-2024', '12:02:07 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('640', 'admin', '31-12-2024', '15:08:05 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('641', 'admin', '01-01-2025', '10:19:58 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('642', 'admin', '01-01-2025', '15:16:50 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('643', 'admin', '01-01-2025', '15:22:30 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('644', 'admin', '01-01-2025', '15:30:38 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('645', 'admin', '01-01-2025', '15:32:34 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('646', 'admin', '01-01-2025', '15:52:56 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('647', 'admin', '01-01-2025', '15:57:29 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('648', 'admin', '01-01-2025', '16:33:29 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('649', 'admin', '01-01-2025', '16:46:11 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('650', 'admin', '01-01-2025', '18:07:29 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('651', 'admin', '02-01-2025', '09:53:40 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('652', 'admin', '02-01-2025', '13:13:34 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('653', 'admin', '02-01-2025', '13:17:10 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('654', 'admin', '02-01-2025', '16:23:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('655', 'admin', '02-01-2025', '19:03:48 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('656', 'admin', '03-01-2025', '11:35:30 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('657', 'admin', '03-01-2025', '18:49:13 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('658', 'admin', '04-01-2025', '12:16:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('659', 'admin', '05-01-2025', '10:21:09 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('660', 'admin', '05-01-2025', '13:28:08 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('661', 'admin', '05-01-2025', '13:41:59 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('662', 'admin', '06-01-2025', '08:44:28 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('663', 'admin', '07-01-2025', '12:17:52 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('664', 'admin', '09-01-2025', '18:46:26 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('665', 'admin', '11-01-2025', '12:45:16 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('666', 'admin', '18-01-2025', '17:30:59 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('667', 'admin', '19-01-2025', '09:07:40 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('668', 'admin', '19-01-2025', '13:42:44 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('669', 'admin', '20-01-2025', '09:20:59 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('670', 'admin', '20-01-2025', '19:04:22 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('671', 'admin', '21-01-2025', '10:31:00 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('672', 'admin', '21-01-2025', '10:38:43 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('673', 'admin', '21-01-2025', '10:43:08 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('674', 'admin', '21-01-2025', '12:49:00 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('675', 'admin', '21-01-2025', '14:00:33 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('676', 'admin', '21-01-2025', '17:43:14 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('677', 'admin', '21-01-2025', '19:40:44 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('678', 'admin', '22-01-2025', '18:06:58 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('679', 'admin', '22-01-2025', '18:47:25 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('680', 'admin', '23-01-2025', '15:27:55 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('681', 'admin', '25-01-2025', '10:27:39 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('682', 'admin', '25-01-2025', '17:03:09 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('683', 'admin', '25-01-2025', '18:14:02 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('684', 'admin', '25-01-2025', '18:31:31 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('685', 'admin', '26-01-2025', '12:11:27 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('686', 'admin', '26-01-2025', '13:37:46 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('687', 'admin', '27-01-2025', '11:35:31 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('688', 'admin', '27-01-2025', '18:06:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('689', 'admin', '28-01-2025', '16:42:48 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('690', 'admin', '29-01-2025', '12:12:26 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('691', 'admin', '29-01-2025', '17:47:13 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('692', 'admin', '30-01-2025', '11:51:09 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('693', 'admin', '30-01-2025', '12:12:10 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('694', 'admin', '30-01-2025', '12:13:58 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('695', 'admin', '30-01-2025', '12:16:36 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('696', 'admin', '30-01-2025', '12:18:58 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('697', 'admin', '30-01-2025', '12:39:08 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('698', 'admin', '30-01-2025', '12:45:13 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('699', 'admin', '30-01-2025', '14:43:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('700', 'admin', '31-01-2025', '10:33:43 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('701', 'admin', '31-01-2025', '18:42:05 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('702', 'admin', '31-01-2025', '18:50:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('703', 'admin', '01-02-2025', '12:15:48 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('704', 'admin', '01-02-2025', '12:26:05 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('705', 'admin', '01-02-2025', '18:02:54 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('706', 'admin', '01-02-2025', '19:54:22 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('707', 'admin', '02-02-2025', '08:32:56 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('708', 'admin', '02-02-2025', '08:37:47 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('709', 'admin', '02-02-2025', '14:08:35 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('710', 'admin', '03-02-2025', '10:29:07 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('711', 'admin', '03-02-2025', '10:30:47 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('712', 'admin', '03-02-2025', '10:57:11 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('713', 'admin', '04-02-2025', '11:30:01 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('714', 'admin', '04-02-2025', '12:10:37 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('715', 'admin', '04-02-2025', '12:42:57 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('716', 'admin', '04-02-2025', '12:52:30 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('717', 'admin', '04-02-2025', '13:20:52 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('718', 'admin', '04-02-2025', '13:22:31 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('719', 'admin', '04-02-2025', '13:34:34 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('720', 'admin', '04-02-2025', '15:50:47 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('721', 'admin', '04-02-2025', '15:56:40 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('722', 'admin', '04-02-2025', '16:10:27 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('723', 'admin', '04-02-2025', '16:28:09 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('724', 'admin', '04-02-2025', '17:14:50 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('725', 'admin', '04-02-2025', '17:40:54 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('726', 'admin', '04-02-2025', '17:46:10 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('727', 'admin', '05-02-2025', '11:34:45 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('728', 'admin', '05-02-2025', '12:47:47 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('729', 'admin', '05-02-2025', '12:56:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('730', 'admin', '05-02-2025', '16:29:21 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('731', 'admin', '05-02-2025', '16:46:37 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('732', 'admin', '05-02-2025', '17:30:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('733', 'admin', '05-02-2025', '17:41:55 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('734', 'admin', '06-02-2025', '10:16:33 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('735', 'admin', '07-02-2025', '09:22:43 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('736', 'admin', '07-02-2025', '09:32:15 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('737', 'admin', '07-02-2025', '13:39:30 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('738', 'admin', '07-02-2025', '16:31:19 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('739', 'admin', '07-02-2025', '17:40:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('740', 'admin', '08-02-2025', '12:19:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('741', 'admin', '08-02-2025', '12:26:29 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('742', 'admin', '08-02-2025', '12:27:51 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('743', 'admin', '08-02-2025', '12:47:15 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('744', 'admin', '08-02-2025', '13:03:11 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('745', 'admin', '08-02-2025', '13:11:46 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('746', 'admin', '08-02-2025', '13:16:41 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('747', 'admin', '09-02-2025', '11:05:54 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('748', 'admin', '10-02-2025', '14:21:45 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('749', 'admin', '10-02-2025', '16:13:56 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('750', 'admin', '11-02-2025', '15:53:12 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('751', 'admin', '11-02-2025', '16:05:08 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('752', 'admin', '11-02-2025', '16:07:05 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('753', 'admin', '11-02-2025', '16:12:00 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('754', 'admin', '11-02-2025', '17:57:59 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('755', 'admin', '12-02-2025', '14:07:33 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('756', 'admin', '12-02-2025', '16:08:31 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('757', 'admin', '12-02-2025', '16:17:51 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('758', 'admin', '12-02-2025', '16:27:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('759', 'admin', '12-02-2025', '16:33:02 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('760', 'admin', '12-02-2025', '16:41:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('761', 'admin', '12-02-2025', '16:46:18 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('762', 'admin', '12-02-2025', '16:47:43 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('763', 'admin', '12-02-2025', '17:06:35 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('764', 'admin', '12-02-2025', '17:19:01 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('765', 'admin', '12-02-2025', '20:13:11 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('766', 'admin', '13-02-2025', '11:51:37 AM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('767', 'admin', '13-02-2025', '13:25:33 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('768', 'admin', '13-02-2025', '13:39:44 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('769', 'admin', '13-02-2025', '13:49:23 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('770', 'admin', '13-02-2025', '13:57:20 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('771', 'admin', '13-02-2025', '14:00:23 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('772', 'admin', '13-02-2025', '16:29:20 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('773', 'admin', '13-02-2025', '16:37:04 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('774', 'admin', '27-02-2025', '16:58:57 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('775', 'admin', '05-03-2025', '15:29:51 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('776', 'admin', '05-03-2025', '15:31:03 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES ('777', 'admin', '05-03-2025', '15:34:58 PM', 'Successfully Login');
INSERT INTO `logdetails` VALUES (NULL, 'prawin', '08-01-2026', '13:49:05', 'Successfully Login');
INSERT INTO `logdetails` VALUES (NULL, 'prawin', '08-01-2026', '13:51:48', 'Successfully Login');
INSERT INTO `logdetails` VALUES (NULL, 'prawin', '08-01-2026', '14:26:04', 'Successfully Login');

-- ----------------------------
-- Table structure for medical_records
-- ----------------------------
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE `medical_records`  (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `visit_id` int NOT NULL,
  `symptoms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `advice` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `idx_visit_id`(`visit_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of medical_records
-- ----------------------------

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `MNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ItemNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Modules` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MainMenu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MenuItem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Omega` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `office` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `admin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Gowri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dhiya` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `test` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `test1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kumaran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `staff` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('8', '4', 'Income Expense', 'Income Expense', 'Asset', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('9', '4', 'Income Expense', 'Report', 'Asset Report', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('4', '3', 'Billing', 'Billing Report', 'Bill Reports', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('4', '1', 'Pharma Billing', 'Pharma Billing', 'Billing', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '0', 'Billing', 'Billing Report', 'Billing Report', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('9', '2', 'Income Expense', 'Report', 'Cash Book', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('10', '3', 'SMS', 'SMS', 'Contact Book', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('5', '1', 'Billing', 'Billing Report', 'Credit Collection', 'True', 'True', 'False', 'True', 'True', 'False', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '2', 'Billing', 'Billing Report', 'Credit Report', 'True', 'True', 'False', 'True', 'True', 'False', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '4', 'Billing', 'Billing Report', 'Customer Report', 'True', 'True', 'False', 'True', 'True', 'False', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '6', 'Billing', 'Billing Report', 'Daily Report', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('2', '2', 'General', 'Hospital', 'Doctor Entry', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '5', 'Lab', 'Lab Master', 'Doctor Entry1', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '6', 'Pharma Master', 'Pharma Master', 'Enquiry Details', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('1', '4', 'General', 'File', 'Exit', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('1', '0', 'General', 'File', 'File', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('10', '2', 'SMS', 'SMS', 'Group SMS', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('1', '3', 'General', 'File', 'Help', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('2', '0', 'General', 'Hospital', 'Hospital', 'True', 'True', 'False', 'True', 'True', 'True', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('8', '0', 'Income Expense', 'Income Expense', 'Income Expense', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('9', '1', 'Income Expense', 'Report', 'Income/Expenditure', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('8', '1', 'Income Expense', 'Income Expense', 'Income/Expense', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('7', '3', 'Lab', 'Lab Entry', 'Lab Billing', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('7', '0', 'Lab', 'Lab Entry', 'Lab Entry', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '0', 'Lab', 'Lab Master', 'Lab Master', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('1', '2', 'General', 'File', 'Log Details', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('11', '0', 'Billing', 'Logout', 'Logout', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '1', 'Pharma Master', 'Pharma Master', 'Patient Details', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '1', 'Lab', 'Lab Master', 'Patient Details1', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('4', '0', 'Pharma Billing', 'Pharma Billing', 'Pharma Billing', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '0', 'Pharma Master', 'Pharma Master', 'Pharma Master', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '4', 'Pharma Master', 'Pharma Master', 'Phrchase Entry', 'True', 'True', 'False', 'True', 'False', 'False', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '3', 'Lab', 'Lab Master', 'Product indent', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '4', 'Lab', 'Lab Master', 'product issue', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '5', 'Pharma Master', 'Pharma Master', 'Product Used', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '5', 'Billing', 'Billing Report', 'Purchase Report', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('2', '1', 'General', 'Hospital', 'Reception', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('9', '0', 'Income Expense', 'Report', 'Report', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('4', '2', 'Pharma Billing', 'Pharma Billing', 'Return Billing', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '7', 'Billing', 'Billing Report', 'Return Report', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('10', '5', 'SMS', 'SMS', 'Sent Box', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('10', '1', 'SMS', 'SMS', 'Single SMS', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('10', '0', 'SMS', 'SMS', 'SMS', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('3', '3', 'Pharma Master', 'Pharma Master', 'Stock Entry', 'True', 'True', 'False', 'True', 'True', 'True', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('5', '3', 'Billing', 'Billing Report', 'Stock Report', 'True', 'True', 'False', 'True', 'True', 'False', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('10', '4', 'SMS', 'SMS', 'Templates', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False', 'False');
INSERT INTO `menu` VALUES ('7', '1', 'Lab', 'Lab Entry', 'Test Entry', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('6', '2', 'Lab', 'Lab Master', 'Test Master', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('7', '2', 'Lab', 'Lab Entry', 'Test Report', 'True', 'True', 'False', 'True', 'False', 'False', 'False', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('8', '3', 'Income Expense', 'Income Expense', 'Transaction', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('1', '1', 'General', 'File', 'User Details', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('8', '2', 'Income Expense', 'Income Expense', 'Vendor Detail', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('9', '3', 'Income Expense', 'Report', 'Vendor Report', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');
INSERT INTO `menu` VALUES ('3', '2', 'Pharma Master', 'Pharma Master', 'Ventor Details', 'True', 'True', 'False', 'True', 'True', 'True', 'True', 'True', 'True', 'True');

-- ----------------------------
-- Table structure for monthdetail
-- ----------------------------
DROP TABLE IF EXISTS `monthdetail`;
CREATE TABLE `monthdetail`  (
  `MonthOrder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MonthNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MonthName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of monthdetail
-- ----------------------------
INSERT INTO `monthdetail` VALUES ('8', '1', 'JAN', 'JANUARY');
INSERT INTO `monthdetail` VALUES ('9', '2', 'FEB', 'FEBRUARY');
INSERT INTO `monthdetail` VALUES ('10', '3', 'MAR', 'MARCH');
INSERT INTO `monthdetail` VALUES ('11', '4', 'APR', 'APRIL');
INSERT INTO `monthdetail` VALUES ('12', '5', 'MAY', 'MAY');
INSERT INTO `monthdetail` VALUES ('1', '6', 'JUN', 'JUNE');
INSERT INTO `monthdetail` VALUES ('2', '7', 'JUL', 'JULY');
INSERT INTO `monthdetail` VALUES ('3', '8', 'AUG', 'AUGUST');
INSERT INTO `monthdetail` VALUES ('4', '9', 'SEP', 'SEPTEMBER');
INSERT INTO `monthdetail` VALUES ('5', '10', 'OCT', 'OCTOBER');
INSERT INTO `monthdetail` VALUES ('6', '11', 'NOV', 'NOVEMBER');
INSERT INTO `monthdetail` VALUES ('7', '12', 'DEC', 'DECEMBER');

-- ----------------------------
-- Table structure for opd_visits
-- ----------------------------
DROP TABLE IF EXISTS `opd_visits`;
CREATE TABLE `opd_visits`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `age` int NULL DEFAULT NULL,
  `gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `doctor_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `visit_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `symptoms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Checked In',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_opd_patient`(`patient_name` ASC) USING BTREE,
  INDEX `idx_opd_doctor`(`doctor_name` ASC) USING BTREE,
  INDEX `idx_opd_date`(`visit_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of opd_visits
-- ----------------------------
INSERT INTO `opd_visits` VALUES (1, 'Vijay', 18, 'Male', '+91 9123578496', 'Dr. Manoj', '2026-01-10 14:05:04', 'tr', 'Injected', 'Completed');
INSERT INTO `opd_visits` VALUES (2, 'RamaSwamy', 6, 'MALE', '9655565254', 'Manoj', '2026-01-11 10:04:05', '', 'j', 'Completed');
INSERT INTO `opd_visits` VALUES (3, 'Laskhman', 66, 'MALE', '9080540025', 'sdfghnjm', '2026-01-11 10:38:42', '', 'h', 'Completed');
INSERT INTO `opd_visits` VALUES (4, 'INDHUMATHI', 30, 'Female', '1234567890', 'Dr. Smith', '2026-01-11 10:49:25', 'Fever and cold', 'Viral Infection', 'Completed');
INSERT INTO `opd_visits` VALUES (5, 'Elango kandhasamy', 21, 'Male', '9123578496', 'Dr. Anbalagan', '2026-01-21 00:40:17', 'fever', 'done', 'Completed');
INSERT INTO `opd_visits` VALUES (6, 'Prawen', 46, 'Male', '6374991169', 'Dr. Elan', '2026-03-02 12:00:11', 'Stomach Ache', 'ulcer', 'Completed');

-- ----------------------------
-- Table structure for paste_errors
-- ----------------------------
DROP TABLE IF EXISTS `paste_errors`;
CREATE TABLE `paste_errors`  (
  `Field0` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of paste_errors
-- ----------------------------
INSERT INTO `paste_errors` VALUES ('If cmbGroup.Items.Count > 0 Then cmbGroup.SelectedIndex = 0');

-- ----------------------------
-- Table structure for patentdetails
-- ----------------------------
DROP TABLE IF EXISTS `patentdetails`;
CREATE TABLE `patentdetails`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BloodGrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RefDoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PSex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patentdetails
-- ----------------------------

-- ----------------------------
-- Table structure for patientdetaiils
-- ----------------------------
DROP TABLE IF EXISTS `patientdetaiils`;
CREATE TABLE `patientdetaiils`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BloodGrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TypeTest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DocName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RefDoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PSex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OpFee` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GSTno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BlockNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RoomNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DOJ` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DOV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_patientdet_cusId`(`cusId` ASC) USING BTREE,
  INDEX `idx_patientdet_cusName`(`cusName` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patientdetaiils
-- ----------------------------
INSERT INTO `patientdetaiils` VALUES ('46', '1', 'INDHUMATHI', '9597378341', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN', 'FEMALE', '30', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('47', '2', 'Premkumar', '9940943399', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('48', '3', 'VISVANATH', '9677593882', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'MALE', '56', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('49', '4', 'SUMATHI', '9940942299', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'FEMALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('50', '5', 'Mr.Premkumar', '9940943399', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('51', '6', 'Mr.vishwanathan', '9677593882', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR.Atchaya', 'MALE', '56', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('53', '7', 'MR.Sountharajan', '9345593374', 'Rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR.KUMARAN K', 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('56', '8', 'Mr.RAJAGOPAL', '9524446075', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '71', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('57', '9', 'mrs.sivagami', '9043883478', 'Rsipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('58', '10', 'MR.RANGANAYAKI', '8883115214', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('60', '11', 'MR.RANGANAYAKI', '8883115214', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR ATCHAYA K G', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('61', '12', 'MRS.MANI', '9750082662', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR ATCHAYA K G', 'FEMALE', '75 MONTHS', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('62', '13', 'MR.VARATHARAJAN', '9080643820', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('63', '14', 'mr.pattakaran', '8870713770', 'rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('65', '15', 'mr.pattakaran', '8870713770', 'rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('66', '16', 'mrs.sivapakiyam', '9524910859', 'rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'MR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('67', '17', 'MRS.MANTHINI', '8248761361', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '28', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('68', '18', 'MRD.NANTHINI', '8248761361', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR  KUMARAN K', 'FEMALE', '28', 'nan', 'nan', 'nan', 'True', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('69', '19', 'MRS.NANTHINI', '8248761361', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '28', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('70', '20', 'MR.PATTAKARAN', '8870713770', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('71', '21', 'MRS.RAJAMANI', '7373486117', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('72', '22', 'MR.PRUMAL', '9994859496', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('73', '23', 'SRI KISHOR', '8148835636', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '15', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('74', '24', 'ALAMERLU', '9003462567', 'rasipuram', 'nan', 'nan', 'dr:kumaran', 'DR:KUMARAN', 'DR:KUMARAN', 'FEMALE', '72', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('75', '25', 'BASIL', '9345702595', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '26', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('76', '26', 'MR.ARUL SELVAN', '9655576962', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '21', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('77', '27', 'MRS.ALAMELU', '9003462567', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '72', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('78', '28', 'MR.SELVAM', '8344374416', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '62', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('79', '29', 'MR .SELVAM', '8344374416', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '62', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('80', '30', 'MR:PERIYASAMY', '9788915506', 'PUDUPPALAYAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '84', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('81', '31', 'MRS:KANDHAYEE', '9790658932', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '52', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('82', '32', 'MRS:RANGANAYAKI', '8883115214', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('83', '33', 'MR.TAMILSELVI', '7305552585', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'K KUMARAN K', 'FEMALE', '37', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('84', '34', 'MR.TAMILSELVI', '7305552585', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '37', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('85', '35', 'MRS .KAYALVIZHI', '9384728274', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('86', '36', 'MR.KATHIRAVAN', '7010317002', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR.KUMARAN K', 'MALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('87', '37', 'eswar', '6383691260', 'rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '18', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('88', '38', 'MR.LOGESHWARI', '7904062030', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '26', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('89', '39', 'MRS.RATHNAM', '9095074992', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('90', '40', 'MRS.KAVITHA', '9442551467', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMRAN K', 'FEMALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('91', '41', 'MR.MURUGESHAN', '9994386208', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '47', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('92', '42', 'mrs.deepa', '9487088352', 'rasipuram', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'dr kumaran k', 'FEMALE', '42', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('93', '43', 'MRS.DEEPA', '9487088352', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '42', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('94', '44', 'MR.KASTHURI', '9585934289', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '24', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('95', '45', 'MR.TAMILSELVI', '7305552585', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '37', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('96', '46', 'MRS.RASAMMAL', '9560874310', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '70', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('97', '47', 'MRS .POOVAYEE', '9600796229', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '75', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('98', '48', 'MR .PATTAKARAN', '8870713770', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('99', '49', 'MR.PATTAKARAN', '8870713770', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('100', '50', 'MRS.POOVAYEE', '9600796229', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '75', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('101', '51', 'MR .POOMALAI RATHINASAMY', '9043132663', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '74', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('102', '52', 'MR .POOMALAI RATHINASAMY', '90431332663', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '74', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('103', '53', 'MR .POOMALAI RATHINASAMY', '9043132663', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '74', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('104', '54', 'MR .POOMALAI RATHINASAMY', '9043132663', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '74', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('105', '55', 'MR.RAGAVAN', '9894457363', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '71', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('106', '56', 'SRI ESWAR', '6383691260', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '18', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('107', '57', 'MR.GOPINATH', '9677363636', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '49', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('108', '58', 'MISS.PREETHA', '7810808500', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '9', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('109', '59', 'MRS:RAJAMANI', '9486261916', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('110', '60', 'BABY:LAKSHITHA', '7502337989', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '12', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('111', '61', 'BABY:YASIK DEVAN', '8098381815', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '2', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('112', '62', 'BABY:YASIK DEVAN', '8098381815', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '2', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('113', '63', 'MR.LAKSHMANAN', '7904062030', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '36', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('114', '64', 'MR.RUSIKESAVAN', '9940764393', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '78', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('115', '65', 'MR.JAGATHISH', '9003332248', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('116', '66', 'MRS.VASANTHA', '9944566627', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR.KUMARAN K', 'FEMALE', '73', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('117', '67', 'MR.MARIMUTHU', '9944566627', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('118', '68', 'MR.JEGANATHAN', '9843634901', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '67', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('119', '69', 'MR.KANAPATHI', '7010722096', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '87', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('120', '70', 'MRS.SUGANTHI', '7010722096', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '56', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('121', '71', 'MRS:SAROSA', '7708658727', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('122', '72', 'MRS:THILAGAM', '9842134440', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '62', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('123', '73', 'MR:PERUMAL', '9994859496', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('124', '74', 'MR.RAGAVAN', '9894457363', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '71', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('125', '75', 'MRS.LAKSHMI', '9384477077', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '63', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('126', '76', 'MRS.LAKSHMI', '9384477077', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '63', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('127', '77', 'MR.RAMESH KUMAR', '9384477077', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('128', '78', 'MR.KULANTHAIVEL', '9994455398', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '49', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('129', '79', 'MRS.DHANALAKSHMI', '8122343585', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '57', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('130', '80', 'MR.SENTHIL', '9791800460', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('131', '81', 'MR.SENTHIL', '9791800460', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('132', '82', 'MRS.SANTHANALAKSHMI', '8973426610', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '39', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('133', '83', 'MRS:VIDHYA', '7825023600', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('134', '84', 'MR.ABDUL RAGUMAN', '8695691386', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', NULL, '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('135', '85', 'MR.THAMARAI SELVAN', '9659353918', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('136', '86', 'MR.VIJAYAKUMAR', '9486886641', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('137', '87', 'MR.ASHOK', '9342002218', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('138', '88', 'MRS .NANTHINI PRIYA', '9003981349', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '47', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('139', '89', 'AYYAMMAL', '7373709901', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '70', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('140', '90', 'MR.SELVAMANI', '9443220512', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '76', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('141', '91', 'MRS.NANTHINIPRIYA', '9003981349', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '47', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('142', '92', 'MR.SOUNTHARAJAN', '9894154469', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '39', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('143', '93', 'MASTER.THIRUSHAN', '9384441835', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '6', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('144', '94', 'MR.T.SRINIVASAN', '9942252039', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '70', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('145', '95', 'MR.KANMANI', '9489565865', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '49', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('146', '96', 'MRS.NANTHINIPRIYA', '9003981349', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '47', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('147', '97', 'MRS.KAVITHA', '6383437218', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '30', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('148', '98', 'MR.K.R.VIJAYKUMAR', '9486886641', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('149', '99', 'MRS.GUNASUNTHARI', '9600410433', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '50', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('150', '100', 'MISS.ADHIKSHA', '6381924957', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '11', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('151', '101', 'MRS.NATHIYA', '8807490458', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '31', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('152', '102', 'MRS.SUMATHI', '9944780898', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('153', '103', 'MRS.VAISHNAVI', '9944386072', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '23', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('154', '104', 'MISS.VINITHA', '9345437626', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '19', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('155', '105', 'MRS.DHIVANI', '8637683550', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('156', '106', 'MRS.NITHYA', '8220203928', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '31', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('157', '107', 'MRS.PRIYADHARSHNI', '7708705802', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '24', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('158', '108', 'MRS.RATHINAM', '9095074992', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('159', '109', 'MRS.DEEPA', '9500670074', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '43', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('160', '110', 'MASTER.BAVAN', '9677674711', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '17', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('161', '111', 'MRS.ARCHANA', '9842055317', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('162', '112', 'MRS.ARCHANA', '9842055317', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('163', '113', 'MR.RANGASAMY', '7502410414', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('164', '114', 'MRS.AMALA', '7502410414', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'Children', '38', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('165', '115', 'MISS.JANANI', '9092217996', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '7', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('166', '116', 'MR.GOPI', '9600272712', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '37', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('167', '117', 'MRS.KOMAL', '7708892988', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '22', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('168', '118', 'MR.PALANIVEL', '9500104055', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '28', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('169', '119', 'MR.MADHESH', '8675709054', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '35', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('170', '120', 'MISS.CHARVY', '6383223850', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '16', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('171', '121', 'MISS.GIRISHA', '9344725668', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '20', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('172', '122', 'MR.SUBIRAYAN', '9655808666', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '75', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('173', '123', 'MR.SUBURAYAN', '9655808666', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '75', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('174', '124', 'MR.GOVINTHARAJ', '7373682323', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '56', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('175', '125', 'MR.ARUL', '9787143491', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '40', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('176', '126', 'MR.ARUL', '9787143491', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '40', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('177', '127', 'MR.SUSILKUMAR', '9629047553', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '31', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('178', '128', 'MRS.SASIMATHI', '9659757809', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '30', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('179', '129', 'MRS.HEMALATHA', '8807403607', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('180', '130', 'MR.VIGNESH', '9943221956', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '31', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('181', '131', 'MR.MADHESHWARAN', '9791635588', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '50', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('182', '132', 'MR.MAGUDAPATHI', '9487720512', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('183', '133', 'MR.MAGUDAPATHI', '9487720512', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '45', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('184', '134', 'MR.ANANTHAN', '9443915762', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '51', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('185', '135', 'MRS.T.KALAIVANI', '9360708044', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '35', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('186', '136', 'MRS.T.KALAIVANI', '9360708044', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '35', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('187', '137', 'MRS.SAKTHIMADHANKI', '9344886879', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '21', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('188', '138', 'MRS.SOUNTHARYA', '9842498084', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '27', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('189', '139', 'MR.HARISH', '7708195980', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '30', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('190', '140', 'CHANDRA SEKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('191', '141', 'MR CHANDRA SAKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('192', '142', 'MR CHANDRA SAKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('193', '143', 'MR CHANDRA SAKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('194', '144', 'MR CHANDRA SAKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('195', '145', 'MR CHANDRA SAKAR', '9384458197', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '69', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('196', '146', 'SRI ESWAR', '6383691260', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '18', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('197', '147', 'MRS.GOMATHI', '9788013643', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '63', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('198', '148', 'MRS.KAYAVIZHI', '9384728274', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('199', '149', 'MRS.SHAKILA', '9751180862', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('200', '150', 'MRS.SHAKILA', '9751180862', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '34', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('201', '151', 'MR.GOPI', '9944324565', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '35', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('202', '152', 'MR.MURUGESAN', '9965809240', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '58', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('203', '153', 'MR.MURUGESAN', '9965809240', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '58', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('204', '154', 'MR.RAKUL', '6385495240', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '17', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('205', '155', 'MR.RAKUL', '6385495240', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '17', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('206', '156', 'ANITHA', '6383223850', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('207', '157', 'MRS.ANITHA', '6383223850', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'FEMALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('208', '158', 'MRS.ANITHA', '6383223850', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'FEMALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('209', '159', 'MRS.ANITHA', '6383223850', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '41', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('210', '160', 'MR.HARISH', '7708195980', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '30', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('211', '161', 'MR.RAKUL', '6385723043', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '17', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('212', '162', 'MR.MANI', '9787537575', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'MALE', '73', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('213', '163', 'MRS.SAROJA', '9443575287', 'RASI PURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('214', '164', 'MR.RAJA PRABU', '8220401099', 'RASI PURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '33', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('215', '165', 'MR.GURUSERAN', '9994556713', 'RASI PURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', NULL, 'MALE', '9', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('216', '166', 'MR.GURU SARAN', '9994556713', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '9', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('217', '167', 'MRS.AMUTHA', '7539937513', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('218', '168', 'MR.MANI', '9787537575', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '73', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('219', '169', 'MRS.SAROJA', '9443575281', NULL, 'nan', 'nan', NULL, NULL, NULL, 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('220', '170', 'MRS.AMUTHA', '7539937513', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '46', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('221', '171', 'MIS.SWETHA', '9003300256', NULL, 'nan', 'nan', NULL, NULL, NULL, 'FEMALE', '22', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('222', '172', 'SWETHA', '9003300256', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '22', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('223', '173', 'MISS.JYOTHISMATHY', '8124477001', NULL, 'nan', 'nan', NULL, NULL, NULL, 'FEMALE', '13', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('224', '174', 'MISS.JYOTHISMATHY', '8124477001', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '13', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('225', '175', 'MR.SIVASELVAM', '9788306739', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '63', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('226', '176', 'MRS.FATHIMA', '9790659575', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '27', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('227', '177', 'MR.SUNDHARAM', '9952205234', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '70', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('228', '178', 'MR.VIVEK', '8883896380', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '33', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('229', '179', 'MRS.HEMALATHA', '8807403607', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('230', '180', 'MRS.HEMALATHA', '8807403607', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('231', '181', 'MR.LAKSHMANA', '7000743779', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '59', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('232', '182', 'MR.RAVICHANDRAN', '9943112244', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('233', '183', 'MR.RAVICHANDRAN', '9943112244', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '44', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('234', '184', 'kalidas', '7010772602', NULL, 'nan', 'nan', 'dr.k.kumaran', 'dr.k.kumaran', NULL, 'MALE', '51', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('235', '185', 'MIS.KOWSI', '8870584097', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'FEMALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('236', '186', 'SURYA', '9500979112', 'ERODE', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('237', '187', 'JAGA', '9965104150', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('238', '188', 'JAGA', '9965104150', 'RASIPURAM', 'nan', 'nan', 'DR KUMARAN K', 'DR KUMARAN K', 'DR KUMARAN K', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('241', '189', 'ARUN', '9999999999', 'RASIPURAM', 'nan', 'nan', 'DR.KUMARAN', 'DR.KUMARAN', 'DR.KUMARAN', 'FEMALE', '50', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('252', '193', 'JKH', '25', 'RASIPURAM', 'nan', 'nan', 'DR.KUMARAN', 'DR.KUMARAN', 'DR.KUMARAN', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('253', '194', 'KLJ', '54', 'RASIPURAM', 'nan', 'nan', 'DR.KUMARAN', 'DR.KUMARAN', 'DR.KUMARAN', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('254', '195', 'SQ', '850', 'RASIPURAM', 'nan', 'nan', 'DR.KUMARAN', 'DR.KUMARAN', 'DR.KUMARAN', 'FEMALE', '65', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES ('255', '196', 'SQ', '56', 'RASIPURAM', 'nan', 'nan', 'DR.KUMARAN', 'DR.KUMARAN', 'DR.KUMARAN', 'MALE', '25', 'nan', 'nan', 'nan', 'False', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `patientdetaiils` VALUES (NULL, '1', 'Elango', '12345678', 'Erode', NULL, NULL, NULL, 'Elango', '', 'Male', '24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for patients
-- ----------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `age` int NULL DEFAULT NULL,
  `gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `blood_group` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patients
-- ----------------------------
INSERT INTO `patients` VALUES (1, 'Test Patient 1', 31, 'Male', '9876543211', '1 Dummy St', 'O+', 'Active', '2026-02-25 19:48:50');
INSERT INTO `patients` VALUES (2, 'Test Patient 1', 31, 'Male', '9876543211', '1 Dummy St', 'O+', 'Active', '2026-02-25 19:49:46');
INSERT INTO `patients` VALUES (3, 'Test Patient 2', 32, 'Female', '9876543212', '2 Dummy St', 'O+', 'Active', '2026-02-25 19:49:46');
INSERT INTO `patients` VALUES (4, 'Test Patient 3', 33, 'Male', '9876543213', '3 Dummy St', 'O+', 'Active', '2026-02-25 19:49:46');

-- ----------------------------
-- Table structure for payslips
-- ----------------------------
DROP TABLE IF EXISTS `payslips`;
CREATE TABLE `payslips`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `total_days` int NULL DEFAULT 30,
  `days_present` int NULL DEFAULT 0,
  `days_absent` int NULL DEFAULT 0,
  `days_leave` int NULL DEFAULT 0,
  `basic_salary` decimal(10, 2) NULL DEFAULT 0.00,
  `hra` decimal(10, 2) NULL DEFAULT 0.00,
  `allowances` decimal(10, 2) NULL DEFAULT 0.00,
  `gross_earnings` decimal(10, 2) NULL DEFAULT 0.00,
  `total_deductions` decimal(10, 2) NULL DEFAULT 0.00,
  `net_salary` decimal(10, 2) NULL DEFAULT 0.00,
  `loss_of_pay` decimal(10, 2) NULL DEFAULT 0.00,
  `status` enum('Draft','Generated','Paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Draft',
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_monthly_payslip`(`employee_id` ASC, `month` ASC, `year` ASC) USING BTREE,
  INDEX `idx_payslips_employee`(`employee_id` ASC) USING BTREE,
  INDEX `idx_payslips_month_year`(`month` ASC, `year` ASC) USING BTREE,
  CONSTRAINT `payslips_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payslips
-- ----------------------------

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `module_action`(`module_name` ASC, `action` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, 'patient_logs', 'view', 'view access for patient_logs');
INSERT INTO `permissions` VALUES (2, 'patient_logs', 'edit', 'edit access for patient_logs');
INSERT INTO `permissions` VALUES (3, 'patient_logs', 'create', 'create access for patient_logs');
INSERT INTO `permissions` VALUES (4, 'patient_logs', 'delete', 'delete access for patient_logs');
INSERT INTO `permissions` VALUES (5, 'patient_reports', 'view', 'view access for patient_reports');
INSERT INTO `permissions` VALUES (6, 'patient_reports', 'edit', 'edit access for patient_reports');
INSERT INTO `permissions` VALUES (7, 'patient_reports', 'create', 'create access for patient_reports');
INSERT INTO `permissions` VALUES (8, 'patient_reports', 'delete', 'delete access for patient_reports');
INSERT INTO `permissions` VALUES (9, 'medication_details', 'view', 'view access for medication_details');
INSERT INTO `permissions` VALUES (10, 'medication_details', 'edit', 'edit access for medication_details');
INSERT INTO `permissions` VALUES (11, 'medication_details', 'create', 'create access for medication_details');
INSERT INTO `permissions` VALUES (12, 'medication_details', 'delete', 'delete access for medication_details');
INSERT INTO `permissions` VALUES (13, 'doctor_details', 'view', 'view access for doctor_details');
INSERT INTO `permissions` VALUES (14, 'doctor_details', 'edit', 'edit access for doctor_details');
INSERT INTO `permissions` VALUES (15, 'doctor_details', 'create', 'create access for doctor_details');
INSERT INTO `permissions` VALUES (16, 'doctor_details', 'delete', 'delete access for doctor_details');
INSERT INTO `permissions` VALUES (17, 'medical_records', 'view', 'view access for medical_records');
INSERT INTO `permissions` VALUES (18, 'medical_records', 'edit', 'edit access for medical_records');
INSERT INTO `permissions` VALUES (19, 'medical_records', 'create', 'create access for medical_records');
INSERT INTO `permissions` VALUES (20, 'medical_records', 'delete', 'delete access for medical_records');
INSERT INTO `permissions` VALUES (21, 'patient_care_records', 'view', 'view access for patient_care_records');
INSERT INTO `permissions` VALUES (22, 'patient_care_records', 'edit', 'edit access for patient_care_records');
INSERT INTO `permissions` VALUES (23, 'patient_care_records', 'create', 'create access for patient_care_records');
INSERT INTO `permissions` VALUES (24, 'patient_care_records', 'delete', 'delete access for patient_care_records');
INSERT INTO `permissions` VALUES (25, 'recovery_status', 'view', 'view access for recovery_status');
INSERT INTO `permissions` VALUES (26, 'recovery_status', 'edit', 'edit access for recovery_status');
INSERT INTO `permissions` VALUES (27, 'recovery_status', 'create', 'create access for recovery_status');
INSERT INTO `permissions` VALUES (28, 'recovery_status', 'delete', 'delete access for recovery_status');
INSERT INTO `permissions` VALUES (29, 'treatment_plan', 'view', 'view access for treatment_plan');
INSERT INTO `permissions` VALUES (30, 'treatment_plan', 'edit', 'edit access for treatment_plan');
INSERT INTO `permissions` VALUES (31, 'treatment_plan', 'create', 'create access for treatment_plan');
INSERT INTO `permissions` VALUES (32, 'treatment_plan', 'delete', 'delete access for treatment_plan');
INSERT INTO `permissions` VALUES (33, 'admission_details', 'view', 'view access for admission_details');
INSERT INTO `permissions` VALUES (34, 'admission_details', 'edit', 'edit access for admission_details');
INSERT INTO `permissions` VALUES (35, 'admission_details', 'create', 'create access for admission_details');
INSERT INTO `permissions` VALUES (36, 'admission_details', 'delete', 'delete access for admission_details');
INSERT INTO `permissions` VALUES (37, 'prescriptions', 'view', 'view access for prescriptions');
INSERT INTO `permissions` VALUES (38, 'prescriptions', 'edit', 'edit access for prescriptions');
INSERT INTO `permissions` VALUES (39, 'prescriptions', 'create', 'create access for prescriptions');
INSERT INTO `permissions` VALUES (40, 'prescriptions', 'delete', 'delete access for prescriptions');

-- ----------------------------
-- Table structure for pharma_requests
-- ----------------------------
DROP TABLE IF EXISTS `pharma_requests`;
CREATE TABLE `pharma_requests`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `prescription_id` int NOT NULL,
  `status` enum('PENDING','APPROVED','MODIFIED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING',
  `approved_by` int NULL DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pharma_requests
-- ----------------------------

-- ----------------------------
-- Table structure for prescriptions
-- ----------------------------
DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `cusId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pAge` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psex` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pDate` datetime NULL DEFAULT NULL,
  `Disease` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `docNote` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `temp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BP` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty1` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food1` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty3` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food3` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty4` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food4` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING_PHARMACY',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_prescriptions_cusid`(`cusId` ASC) USING BTREE,
  INDEX `idx_prescriptions_cusname`(`cusName` ASC) USING BTREE,
  INDEX `idx_prescriptions_date`(`pDate` ASC) USING BTREE,
  INDEX `idx_prescriptions_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of prescriptions
-- ----------------------------
INSERT INTO `prescriptions` VALUES (1, '46', 'Manoj Hariharan T', '21', 'Male', '2026-01-10 00:00:00', 'Provisional', 'dfgh', '98.6', '120/80', 'Cough Syrup Nivaran', '1', 'After Food', '1', '1', '0', '1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (2, NULL, 'INDHUMATHI', '30', 'Female', '2026-01-11 10:49:25', 'Viral Fever', 'Take rest', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Active');
INSERT INTO `prescriptions` VALUES (3, '21', 'GUNA', '21', 'MALE', '2026-01-11 00:00:00', 'Provisional', 'feaver', '98.6', '120/80', 'Cipla 250', '12', 'After Food', '1', '0', '1', '6', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (4, '49', 'Manoj Hariharan T', '20', 'Male', '2026-01-14 00:00:00', 'Provisional', '', '98.6', '120/80', 'Paracetamol', '5', 'After Food', '1', '1', '0', '2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (5, '50', 'Guhan', '20', 'Male', '2026-01-20 00:00:00', 'Provisional', '', '98.6', '120/80', 'Paracetamol', '12', 'After Food', '1', '1', '0', '1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (6, '50', 'Guhan', '20', 'Male', '2026-01-20 00:00:00', 'No', 'Fever', '98.6', '120/80', 'Paracetamol', '12', 'After Food', '1', '0', '0', '1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (7, '50', 'Guhan', '20', 'Male', '2026-01-20 00:00:00', 'a', 'fever', '98.6', '120/80', 'Paracetamol', '3', 'After Food', '1', '0', '0', '2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (8, '50', 'Guhan', '20', 'Male', '2026-01-20 00:00:00', 'a', 'fever', '98.6', '120/80', 'Paracetamol', '3', 'After Food', '1', '0', '0', '2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');
INSERT INTO `prescriptions` VALUES (9, '49', 'Manoj Hariharan T', '20', 'Male', '2026-01-22 00:00:00', 'temp high', 'feaver', '98.6', '120/80', 'Paracetamol', '6', 'After Food', '1', '1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'BILLED');
INSERT INTO `prescriptions` VALUES (10, '51', 'Aadhi', '20', 'Male', '2026-01-23 00:00:00', 'none', 'feaver', '98.6', '120/80', 'Paracetamol', '6', 'After Food', '1', '1', '1', '3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'BILLED');
INSERT INTO `prescriptions` VALUES (11, '53', 'dhaya', '20', 'Male', '2026-01-30 00:00:00', 'Provisional', '', '98.6', '120/80', 'Paracetamol', '3', 'After Food', '1', '1', '1', '01', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PENDING_PHARMACY');

-- ----------------------------
-- Table structure for priscription
-- ----------------------------
DROP TABLE IF EXISTS `priscription`;
CREATE TABLE `priscription`  (
  `cusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cusId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pAge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bloodgrp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `temp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BP` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Disease` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `docNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tab4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qty4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `food4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `morn4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `noon4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `night4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Noday4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of priscription
-- ----------------------------
INSERT INTO `priscription` VALUES ('BHUVI', '18', '8248028366', '24', 'MALE', 'B+', '100.0', '60.0', 'FEVER', 'TENGU', '31-07-2024', 'MEDICINE5', '5', 'After Food', NULL, NULL, '1', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('BHUVI', '18', '8248028366', '24', 'MALE', 'B+', '100.0', '60.0', 'FEVER', 'TENGU', '31-07-2024', 'PARACITOMEL', '9', 'After Food', '3', NULL, '3', 'nan', 'MEDICINE1', '6.0', 'After Food', '2.0', 'nan', '2.0', 'nan', 'MEDICINE2', '10.0', 'After Food', '3.0', 'nan', '1.0', 'nan', 'MEDICINE4', '8.0', 'After Food', '1.0', 'nan', '1.0', 'nan');
INSERT INTO `priscription` VALUES ('Gokul', '19', '12346678', '20', 'MALE', 'B-', 'nan', 'nan', 'COLD', 'THROUGHT PAIN', '31-07-2024', 'MEDICINE1', '10', 'After Food', '2', '1', '2', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('Guna', '17', '6381496005', '24', 'MALE', 'O+', '50.0', 'nan', 'Cough', 'Lungs Allergy', '30-07-2024', 'Liovolin', '1', 'After Food', '5 ML', '5 ML', '5 ML', 'nan', 'Cirazin', '7.0', 'After Food', 'nan', 'nan', '1.0', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('KAVIN', '22', '8248517729', '25', 'MALE', 'O-', 'nan', 'nan', 'Malaria', 'FEVER', '23-08-2024', 'TABLET1', '10', 'After Food', '2', NULL, '2', 'nan', 'TABLET2', '6.0', 'Before Food', '1.0', 'nan', '1.0', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('KUMAR', '23', '123456789', '25', 'MALE', 'B+', 'nan', 'nan', 'FEVER', 'DENGU', '07-12-2024', 'ANACINE', '10', 'After Food', '4', '2', '4', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('ram', '14', '9842357070', '23', 'm', 'O-', '100.0', '150.0', 'dddd', 'ddd', '29-10-2022', 'fff', '10', 'After Food', '1', NULL, '1', 'nan', 'rfff', '6.0', 'After Food', 'nan', '1.0', 'nan', 'nan', 'axx', '8.0', 'After Food', '1.0', '1.0', '1.0', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('SURYA', '29', '8056377847', '25', 'MALE', 'O+', '100.0', '150.0', 'Common Cold', NULL, '11-12-2024', 'ANACINE', '10', 'After Food', '2', '1', '2', '2.0', 'DOLO', '5.0', 'After Food', '2.0', '1.0', '2.0', '1.0', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');
INSERT INTO `priscription` VALUES ('Veeran', '20', '9095104150', '24', 'MALE', 'B+', 'nan', 'nan', 'COUGH', 'LUNGS PAIN', '01-08-2024', 'MEDICINE1', '50', 'After Food', '3', '3', '3', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan', NULL, 'nan', NULL, 'nan', 'nan', 'nan', 'nan');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `Pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Stock` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ReOrder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Scale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SoldQty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PurQty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ExpiryDate` date NULL DEFAULT NULL,
  INDEX `idx_product_pcode`(`Pcode` ASC) USING BTREE,
  INDEX `idx_product_name`(`ProductName` ASC) USING BTREE,
  INDEX `idx_product_stock`(`Stock` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('1', 'Colpol', 'Tablet', '10', '100', '39', '10', 'Nos', '103.0', '100.0', NULL);
INSERT INTO `product` VALUES ('100', 'Dolo 6501', '650', '10', '200', '531', '200', 'Nos', '3.0', '200.0', NULL);
INSERT INTO `product` VALUES ('2', 'Crosin', 'Tablet', '10', '150', '267', '10', 'Nos', '3.0', '100.0', NULL);
INSERT INTO `product` VALUES ('3', 'Corex', 'Syrup', '10', '200', '142', '10', 'Nos', '6.0', '50.0', NULL);
INSERT INTO `product` VALUES ('4', 'Dolo 650', '650', '10', '100', '934', '500', 'Nos', '50.0', '100.0', NULL);
INSERT INTO `product` VALUES ('500', 'ANACINE', 'TABLET', '10', '10', '102', '20', 'Nos', 'nan', 'nan', NULL);
INSERT INTO `product` VALUES ('501', 'Cough Syrup Nivaran', 'Syrup', NULL, '100', '13', '5', 'Nos', NULL, NULL, NULL);
INSERT INTO `product` VALUES ('502', 'Cipla 250', 'Tablet', NULL, '5', '186', '50', 'Nos', NULL, NULL, NULL);
INSERT INTO `product` VALUES ('', '', '', NULL, '0', '0', '0', 'Nos', NULL, NULL, NULL);
INSERT INTO `product` VALUES ('503', 'Paracetamol', 'Tablet', NULL, '5', '92', '15', 'Nos', NULL, NULL, NULL);
INSERT INTO `product` VALUES ('504', 'Dolo 650', 'tablet', NULL, '100', '5', '2', 'Strips', NULL, NULL, NULL);
INSERT INTO `product` VALUES ('505', 'Para 500', 'Tablet', NULL, '50', '5', '2', 'Strips', NULL, NULL, '2027-08-09');
INSERT INTO `product` VALUES ('506', 'dolo', 'tablet', NULL, '110', '5', '2', 'Strips', NULL, NULL, '2026-07-15');
INSERT INTO `product` VALUES ('507', 'cold act', 'Tablet', NULL, '5', '90', '100', 'Strips', NULL, NULL, '2027-03-22');

-- ----------------------------
-- Table structure for productindent
-- ----------------------------
DROP TABLE IF EXISTS `productindent`;
CREATE TABLE `productindent`  (
  `indentID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `indentDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `requireQty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `indentRisedby` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productindent
-- ----------------------------
INSERT INTO `productindent` VALUES ('1', '2022-10-11 00:00:00', '1', 'da', '12', 'ss', 'Approved');
INSERT INTO `productindent` VALUES ('2', '2024-08-06 00:00:00', '2', 'TUBES', '100', '50', 'Completed');
INSERT INTO `productindent` VALUES ('IND1767944584342', '2026-01-09 13:13:04', '1', 'Colpol', '12', 'Lab Tech', 'Completed');
INSERT INTO `productindent` VALUES ('IND1767967022464', '2026-01-09 19:27:02', '1', 'Colpol', '1', 'Lab Tech', 'Completed');
INSERT INTO `productindent` VALUES ('IND1768547185164', '2026-01-16 12:36:25', '100', 'Dolo 6501', '10', 'Lab Tech', 'Completed');
INSERT INTO `productindent` VALUES ('IND1770905666575', '2026-02-12 19:44:26', '100', 'Dolo 6501', '100', 'Lab Tech', 'Pending');
INSERT INTO `productindent` VALUES ('IND1772434270807', '2026-03-02 12:21:10', '3', 'Corex', '3', 'Lab Tech', 'Pending');

-- ----------------------------
-- Table structure for productissue
-- ----------------------------
DROP TABLE IF EXISTS `productissue`;
CREATE TABLE `productissue`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IssueDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IssuedTo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productissue
-- ----------------------------
INSERT INTO `productissue` VALUES ('1', '2022-10-12 00:00:00', '3', 'Corex', 'lab', '50');
INSERT INTO `productissue` VALUES ('2', '2024-08-06 00:00:00', '2', 'TUBES', 'LAB', '10');
INSERT INTO `productissue` VALUES ('ISS1767944832598', '2026-01-09 13:17:12', '500', 'ANACINE', 'Main Lab', '1');
INSERT INTO `productissue` VALUES ('ISS1767944847252', '2026-01-09 13:17:27', '1', 'Colpol', 'Main Lab', '12');
INSERT INTO `productissue` VALUES ('ISS1768117526603', '2026-01-11 13:15:26', '1', 'Colpol', 'Main Lab', '17');
INSERT INTO `productissue` VALUES ('ISS1768547209179', '2026-01-16 12:36:49', '100', 'Dolo 6501', 'Sudha Hospital', '10');
INSERT INTO `productissue` VALUES ('ISS1770905686608', '2026-02-12 19:44:46', '100', 'Dolo 6501', 'Main Lab', '100');
INSERT INTO `productissue` VALUES ('ISS1772434313322', '2026-03-02 12:21:53', '500', 'ANACINE', 'Main Lab', '8');
INSERT INTO `productissue` VALUES ('ISS1772434313981', '2026-03-02 12:21:53', '500', 'ANACINE', 'Main Lab', '9');

-- ----------------------------
-- Table structure for productreturn
-- ----------------------------
DROP TABLE IF EXISTS `productreturn`;
CREATE TABLE `productreturn`  (
  `Sno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Rno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Pdate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Productname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DisPercentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ReturnQty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Stock` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ReturnAmt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_prodreturn_rno`(`Rno` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productreturn
-- ----------------------------
INSERT INTO `productreturn` VALUES ('1', '1', '1', '100', '2024-12-10 00:00:00', 'Dolo 6501', '0', '200', '300', '0', '200', '100', '300');
INSERT INTO `productreturn` VALUES (NULL, '2', '25', '500', '2026-01-10', 'ANACINE', NULL, '1', NULL, '0', '10', '10', '10');
INSERT INTO `productreturn` VALUES (NULL, '3', '27', '502', '2026-01-10', 'Cipla 250', NULL, '1', NULL, '0', '5', '5', '5');
INSERT INTO `productreturn` VALUES (NULL, '4', '33', '503', '2026-01-16', 'Paracetamol', NULL, '5', NULL, '0', '5', '25', '25');
INSERT INTO `productreturn` VALUES (NULL, '5', '47', '503', '2026-01-23', 'Paracetamol', NULL, '6', NULL, '0', '5', '30', '30');
INSERT INTO `productreturn` VALUES (NULL, '6', '43', '504', '2026-03-02', 'Dolo 650', NULL, '1', NULL, '0', '100', '100', '100');

-- ----------------------------
-- Table structure for productused
-- ----------------------------
DROP TABLE IF EXISTS `productused`;
CREATE TABLE `productused`  (
  `pDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productused
-- ----------------------------
INSERT INTO `productused` VALUES ('2022-09-24 00:00:00', 'Colpol', 'SubTeam', '50');

-- ----------------------------
-- Table structure for purchase
-- ----------------------------
DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase`  (
  `PurDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PurRate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PurQty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SalesRate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of purchase
-- ----------------------------
INSERT INTO `purchase` VALUES ('2024-09-24 00:00:00', 'Colpol', 'Deepa Medicals', '3', '100', '4');
INSERT INTO `purchase` VALUES ('2024-09-25 00:00:00', 'Corex', 'Senthil Medicals', '80', '50', '85');
INSERT INTO `purchase` VALUES ('2024-09-26 00:00:00', 'Crosin', 'Senthur Medicals', '4', '100', '5');
INSERT INTO `purchase` VALUES ('2024-09-27 00:00:00', 'Dolo 650', 'RAJA', '4', '100', '5');
INSERT INTO `purchase` VALUES ('2026-01-09', 'Cough Syrup Nivaran', 'KMC', '10', '10', '100');
INSERT INTO `purchase` VALUES ('2026-01-10', 'Dolo 6501', 'KMC', '12', '19', '3');
INSERT INTO `purchase` VALUES ('2026-01-10', 'Cipla 250', 'Sudha Hospital', '3', '50', '5');
INSERT INTO `purchase` VALUES ('2026-01-05', 'Cipla 250', 'Sudha Hospital', '100', '50', '5');
INSERT INTO `purchase` VALUES ('2026-01-05', 'ANACINE', 'Sudha Hospital', '100', '3', '10');
INSERT INTO `purchase` VALUES ('2026-01-11', 'Paracetamol', 'Sudha ', '5', '10', '7');
INSERT INTO `purchase` VALUES ('2026-03-02', 'Dolo 6501', 'Sudha Hospital', '100.00', '5', '200');

-- ----------------------------
-- Table structure for quodetails
-- ----------------------------
DROP TABLE IF EXISTS `quodetails`;
CREATE TABLE `quodetails`  (
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GrandTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tax` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Interest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ODate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsPay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Dispatch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Distination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsDelivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of quodetails
-- ----------------------------

-- ----------------------------
-- Table structure for quotrash
-- ----------------------------
DROP TABLE IF EXISTS `quotrash`;
CREATE TABLE `quotrash`  (
  `PDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ProductName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Discount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GrandTotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Tax` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Vat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CusID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Interest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ODate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DNote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsPay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `OReference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Dispatch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Distination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TermsDelivery` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TrashDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of quotrash
-- ----------------------------

-- ----------------------------
-- Table structure for role_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions`  (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`) USING BTREE,
  INDEX `permission_id`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES (1, 1);
INSERT INTO `role_permissions` VALUES (1, 2);
INSERT INTO `role_permissions` VALUES (1, 3);
INSERT INTO `role_permissions` VALUES (1, 4);
INSERT INTO `role_permissions` VALUES (1, 9);
INSERT INTO `role_permissions` VALUES (1, 10);
INSERT INTO `role_permissions` VALUES (1, 11);
INSERT INTO `role_permissions` VALUES (1, 12);
INSERT INTO `role_permissions` VALUES (1, 13);
INSERT INTO `role_permissions` VALUES (1, 14);
INSERT INTO `role_permissions` VALUES (1, 15);
INSERT INTO `role_permissions` VALUES (1, 16);
INSERT INTO `role_permissions` VALUES (1, 17);
INSERT INTO `role_permissions` VALUES (1, 18);
INSERT INTO `role_permissions` VALUES (1, 19);
INSERT INTO `role_permissions` VALUES (1, 20);
INSERT INTO `role_permissions` VALUES (1, 21);
INSERT INTO `role_permissions` VALUES (1, 22);
INSERT INTO `role_permissions` VALUES (1, 23);
INSERT INTO `role_permissions` VALUES (1, 24);
INSERT INTO `role_permissions` VALUES (1, 33);
INSERT INTO `role_permissions` VALUES (1, 34);
INSERT INTO `role_permissions` VALUES (1, 35);
INSERT INTO `role_permissions` VALUES (1, 36);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'custom',
  `parent_role_id` int NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  INDEX `parent_role_id`(`parent_role_id` ASC) USING BTREE,
  INDEX `idx_roles_name`(`name` ASC) USING BTREE,
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`parent_role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'Admin', 'system', NULL, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (2, 'Doctor', 'system', NULL, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (3, 'Receptionist', 'system', NULL, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (4, 'Nurse', 'custom', NULL, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (5, 'Head Nurse', 'custom', 4, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (6, 'Trainee', 'custom', 4, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (7, 'Emergency Ward Nurse', 'custom', 4, NULL, '2026-01-27 09:58:37');
INSERT INTO `roles` VALUES (8, 'LAB_MASTER', 'system', NULL, NULL, '2026-01-27 14:06:44');
INSERT INTO `roles` VALUES (9, 'PHARMA_MASTER', 'system', NULL, NULL, '2026-01-27 14:06:44');
INSERT INTO `roles` VALUES (10, 'HR', 'system', NULL, 'Human Resources & Payroll', '2026-01-29 14:21:58');
INSERT INTO `roles` VALUES (12, 'Lab Technician', 'custom', NULL, NULL, '2026-02-13 20:19:45');
INSERT INTO `roles` VALUES (13, 'Pharmacist', 'custom', NULL, NULL, '2026-02-13 20:19:45');
INSERT INTO `roles` VALUES (15, 'Cheif surgeon', 'system', 2, NULL, '2026-02-17 20:52:29');
INSERT INTO `roles` VALUES (16, 'Heart Surgeon', 'system', 2, NULL, '2026-02-24 18:33:07');
INSERT INTO `roles` VALUES (17, 'pantry', 'custom', NULL, NULL, '2026-03-04 19:13:20');

-- ----------------------------
-- Table structure for roomdetail
-- ----------------------------
DROP TABLE IF EXISTS `roomdetail`;
CREATE TABLE `roomdetail`  (
  `SNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BlockName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Infrastructure` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RoomName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `RoomStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Capacity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Strength` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amenities` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Charge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roomdetail
-- ----------------------------
INSERT INTO `roomdetail` VALUES ('3', 'B', 'FIRST FLOOR', '103', 'DELUXE', '9,', '1', '1', 'BED', '1500');
INSERT INTO `roomdetail` VALUES ('1', 'DIAMOND', 'FIRST FLOOR', '101', 'GOOD', '14, 16,', '2', '2', 'CHAIR', '500');
INSERT INTO `roomdetail` VALUES ('2', 'META', 'GROUND FLOOR', '102', 'GOOD', NULL, '2', '0', 'BED', '500');

-- ----------------------------
-- Table structure for salary_structures
-- ----------------------------
DROP TABLE IF EXISTS `salary_structures`;
CREATE TABLE `salary_structures`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `basic_salary` decimal(10, 2) NULL DEFAULT 0.00,
  `hra` decimal(10, 2) NULL DEFAULT 0.00,
  `da` decimal(10, 2) NULL DEFAULT 0.00,
  `travel_allowance` decimal(10, 2) NULL DEFAULT 0.00,
  `medical_allowance` decimal(10, 2) NULL DEFAULT 0.00,
  `special_allowance` decimal(10, 2) NULL DEFAULT 0.00,
  `pf_employee` decimal(10, 2) NULL DEFAULT 0.00,
  `esi_employee` decimal(10, 2) NULL DEFAULT 0.00,
  `pt` decimal(10, 2) NULL DEFAULT 0.00,
  `tds` decimal(10, 2) NULL DEFAULT 0.00,
  `gross_salary` decimal(10, 2) NULL DEFAULT 0.00,
  `total_deductions` decimal(10, 2) NULL DEFAULT 0.00,
  `net_salary` decimal(10, 2) NULL DEFAULT 0.00,
  `effective_from` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_emp_salary`(`employee_id` ASC) USING BTREE,
  INDEX `idx_salary_employee`(`employee_id` ASC) USING BTREE,
  CONSTRAINT `salary_structures_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of salary_structures
-- ----------------------------

-- ----------------------------
-- Table structure for shifts
-- ----------------------------
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `break_duration_mins` int NULL DEFAULT 30,
  `is_night_shift` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shifts
-- ----------------------------
INSERT INTO `shifts` VALUES (1, 'General', 'GEN', '09:00:00', '18:00:00', 30, 0, '2026-01-29 15:08:04');
INSERT INTO `shifts` VALUES (2, 'Morning', 'MORN', '06:00:00', '14:00:00', 30, 0, '2026-01-29 15:08:04');
INSERT INTO `shifts` VALUES (3, 'Evening', 'EVE', '14:00:00', '22:00:00', 30, 0, '2026-01-29 15:08:04');
INSERT INTO `shifts` VALUES (4, 'Night', 'NGT', '22:00:00', '06:00:00', 30, 1, '2026-01-29 15:08:04');

-- ----------------------------
-- Table structure for sidebar_modules
-- ----------------------------
DROP TABLE IF EXISTS `sidebar_modules`;
CREATE TABLE `sidebar_modules`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `module_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `module_category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `module_key`(`module_key` ASC) USING BTREE,
  INDEX `idx_sidebar_active`(`is_active` ASC) USING BTREE,
  INDEX `idx_sidebar_category`(`module_category` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sidebar_modules
-- ----------------------------
INSERT INTO `sidebar_modules` VALUES (1, 'Dashboard', 'dashboard', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (2, 'Appointments', 'appointments', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (3, 'IPD (In-Patient)', 'ipd', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (4, 'OPD (Out-Patient)', 'opd', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (5, 'Billing & Payments', 'billing', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (6, 'Reception', 'reception', 'Main', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (7, 'Payroll System', 'payroll', 'HR', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (8, 'Clinical', 'clinical', 'Clinical', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (9, 'Reports', 'reports', 'Analytics', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (10, 'Pharmacy', 'pharmacy', 'Pharmacy', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (11, 'Laboratory', 'lab', 'Lab', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (12, 'User Management', 'users', 'Admin', 1, '2026-02-13 20:43:56');
INSERT INTO `sidebar_modules` VALUES (13, 'System Logs', 'logs', 'Admin', 1, '2026-02-13 20:43:56');

-- ----------------------------
-- Table structure for smsdetail
-- ----------------------------
DROP TABLE IF EXISTS `smsdetail`;
CREATE TABLE `smsdetail`  (
  `SmsID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SmsDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SendTo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SmsCount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of smsdetail
-- ----------------------------

-- ----------------------------
-- Table structure for staff_master
-- ----------------------------
DROP TABLE IF EXISTS `staff_master`;
CREATE TABLE `staff_master`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `staff_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` enum('Active','Inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `staff_id`(`staff_id` ASC) USING BTREE,
  INDEX `idx_staff_staffid`(`staff_id` ASC) USING BTREE,
  INDEX `idx_staff_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of staff_master
-- ----------------------------

-- ----------------------------
-- Table structure for stock_alerts
-- ----------------------------
DROP TABLE IF EXISTS `stock_alerts`;
CREATE TABLE `stock_alerts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_pcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alert_type` enum('LOW_STOCK','OUT_OF_STOCK') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `current_stock` int NOT NULL,
  `threshold` int NOT NULL,
  `triggered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `acknowledged_by` int NULL DEFAULT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `status` enum('ACTIVE','ACKNOWLEDGED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `acknowledged_by`(`acknowledged_by` ASC) USING BTREE,
  CONSTRAINT `stock_alerts_ibfk_1` FOREIGN KEY (`acknowledged_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock_alerts
-- ----------------------------
INSERT INTO `stock_alerts` VALUES (1, '', 'OUT_OF_STOCK', 0, 0, '2026-01-27 15:02:53', 11, '2026-01-27 15:04:50', 'ACKNOWLEDGED');

-- ----------------------------
-- Table structure for stock_order_items
-- ----------------------------
DROP TABLE IF EXISTS `stock_order_items`;
CREATE TABLE `stock_order_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `stock_order_id` int NOT NULL,
  `medicine_pcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ordered_quantity` int NOT NULL,
  `received_quantity` int NULL DEFAULT 0,
  `unit_price` decimal(10, 2) NULL DEFAULT 0.00,
  `subtotal` decimal(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `stock_order_id`(`stock_order_id` ASC) USING BTREE,
  CONSTRAINT `stock_order_items_ibfk_1` FOREIGN KEY (`stock_order_id`) REFERENCES `stock_orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock_order_items
-- ----------------------------

-- ----------------------------
-- Table structure for stock_orders
-- ----------------------------
DROP TABLE IF EXISTS `stock_orders`;
CREATE TABLE `stock_orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_by` int NULL DEFAULT NULL,
  `supplier_id` int NULL DEFAULT NULL,
  `order_status` enum('DRAFT','PENDING','ORDERED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'DRAFT',
  `total_amount` decimal(10, 2) NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_number`(`order_number` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  INDEX `supplier_id`(`supplier_id` ASC) USING BTREE,
  INDEX `idx_stockorders_supplier`(`supplier_id` ASC) USING BTREE,
  INDEX `idx_stockorders_status`(`order_status` ASC) USING BTREE,
  INDEX `idx_stockorders_orderno`(`order_number` ASC) USING BTREE,
  CONSTRAINT `stock_orders_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `stock_orders_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock_orders
-- ----------------------------

-- ----------------------------
-- Table structure for suppliers
-- ----------------------------
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_suppliers_name`(`supplier_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of suppliers
-- ----------------------------

-- ----------------------------
-- Table structure for templates
-- ----------------------------
DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates`  (
  `Sno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of templates
-- ----------------------------
INSERT INTO `templates` VALUES ('1', 'Welcome', 'False');

-- ----------------------------
-- Table structure for testmaster
-- ----------------------------
DROP TABLE IF EXISTS `testmaster`;
CREATE TABLE `testmaster`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubTestName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NORMALVALUES` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Units` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubTCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  INDEX `idx_testmaster_testtype`(`TestType` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of testmaster
-- ----------------------------
INSERT INTO `testmaster` VALUES ('183', '1', 'HEMATOLOGY', '3', 'BLOOD GROUP', NULL, 'BLOOD GROUP', '-', '120', '-', '1.0');
INSERT INTO `testmaster` VALUES ('200', '1', 'HEMATOLOGY', '3', 'BLOOD GROUP', 'Null', 'RH TYPE', '-', '120', '-', '2.0');
INSERT INTO `testmaster` VALUES ('191', '1', 'HEMATOLOGY', '4', 'BT CT', NULL, 'BT', '-', '200', 'mins', '1.0');
INSERT INTO `testmaster` VALUES ('195', '1', 'HEMATOLOGY', '4', 'BT CT', NULL, 'CT', '-', '200', 'mins', '2.0');
INSERT INTO `testmaster` VALUES ('179', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Gran#', NULL, '300', '10^9/L', '21.0');
INSERT INTO `testmaster` VALUES ('181', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Gran%', NULL, '300', '%', '4.0');
INSERT INTO `testmaster` VALUES ('92', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'HCT', '36 – 46', '300', '%', '7.0');
INSERT INTO `testmaster` VALUES ('91', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'HGB', '12.0 – 15.0', '300', 'g/dL', '5.0');
INSERT INTO `testmaster` VALUES ('178', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Lymph#', NULL, '300', '10^9/L', '19.0');
INSERT INTO `testmaster` VALUES ('100', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Lymph%', '20 - 40', '300', '%', '2.0');
INSERT INTO `testmaster` VALUES ('94', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'MCH', '27 – 32', '300', 'pg', '9.0');
INSERT INTO `testmaster` VALUES ('95', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'MCHC', '31.5 – 34.5', '300', 'g/dL', '10.0');
INSERT INTO `testmaster` VALUES ('93', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'MCV', '83 – 101', '300', 'fL', '8.0');
INSERT INTO `testmaster` VALUES ('101', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Mid#', '01-06', '300', '10^9/L', '20.0');
INSERT INTO `testmaster` VALUES ('180', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'Mid%', NULL, '300', '%', '3.0');
INSERT INTO `testmaster` VALUES ('111', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'MPV', '6.5 - 12.0', '300', 'fL', '14.0');
INSERT INTO `testmaster` VALUES ('110', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'P -LCR', '19.7 - 42.4', '300', '%', '18.0');
INSERT INTO `testmaster` VALUES ('113', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'PCT', '10-18', '300', '%', '16.0');
INSERT INTO `testmaster` VALUES ('112', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'PDW', '9.2 -16.7', '300', NULL, '15.0');
INSERT INTO `testmaster` VALUES ('114', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'P-LCC', '19.7 - 42.4', '300', '10^9/L', '17.0');
INSERT INTO `testmaster` VALUES ('109', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'PLT', '150 - 450', '300', '10^9/L', '13.0');
INSERT INTO `testmaster` VALUES ('90', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'RBC', '3.90 - 5.60', '300', '10^12/L', '6.0');
INSERT INTO `testmaster` VALUES ('97', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'RDW CV', '11.5 – 15', '300', '%', '11.0');
INSERT INTO `testmaster` VALUES ('96', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'RDW SD', '39 – 46', '300', 'fL', '12.0');
INSERT INTO `testmaster` VALUES ('98', '1', 'HEMATOLOGY', '1', 'CBC - COMPLETE BLODD COUNT', NULL, 'WBC', '4000 – 10000', '300', 'Cels/cumm', '1.0');
INSERT INTO `testmaster` VALUES ('186', '1', 'HEMATOLOGY', '2', 'ESR', NULL, 'ESR', '5 - 20', '100', 'mm/hr', 'nan');
INSERT INTO `testmaster` VALUES ('115', '2', 'BIO - CHEMISTRY', '1', ' SUGAR', 'FASTING', '(FASTING ) BLOOD SUGAR', '70 - 110', '40', 'mg/dl', '1.0');
INSERT INTO `testmaster` VALUES ('116', '2', 'BIO - CHEMISTRY', '1', ' SUGAR', 'PP', '(PP ) BLOOD SUGAR', '100 - 140', '40', 'mg/dl', '2.0');
INSERT INTO `testmaster` VALUES ('117', '2', 'BIO - CHEMISTRY', '1', ' SUGAR', 'RANDOM', '(RANDOM ) BLOOD SUGAR', '70 - 140', '40', 'mg/dl', '3.0');
INSERT INTO `testmaster` VALUES ('203', '2', 'BIO - CHEMISTRY', '9', 'BIO - CHEMISTRY', NULL, 'AMYLASE', '25 - 110', '450', 'U / L', '1.0');
INSERT INTO `testmaster` VALUES ('204', '2', 'BIO - CHEMISTRY', '9', 'BIO - CHEMISTRY', NULL, 'LIPASE', '0.64', '450', 'U / L', '2.0');
INSERT INTO `testmaster` VALUES ('185', '2', 'BIO - CHEMISTRY', '8', 'CALCIUM', NULL, '-', '-', '200', '-', 'nan');
INSERT INTO `testmaster` VALUES ('184', '2', 'BIO - CHEMISTRY', '7', 'CRP', NULL, '-', '-', '400', '-', 'nan');
INSERT INTO `testmaster` VALUES ('120', '2', 'BIO - CHEMISTRY', '2', 'Glycosylated Haemoglobin HB A1C', NULL, 'Average Blood Glucose', '68 - 126', '500', 'mg / dl', '2.0');
INSERT INTO `testmaster` VALUES ('119', '2', 'BIO - CHEMISTRY', '2', 'Glycosylated Haemoglobin HB A1C', NULL, 'HB A1C', 'NORMAL : 4.0  - 6.0 Good Control : 6.01 - 7.0  Fair Control : 7.01 - 8.0  Poor Control : > 8.01', '500', '%', '1.0');
INSERT INTO `testmaster` VALUES ('123', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'HDL', '30 - 85', '400', 'mg/dl', '3.0');
INSERT INTO `testmaster` VALUES ('124', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'LDL', '85 - 130', '400', 'mg/dl', '4.0');
INSERT INTO `testmaster` VALUES ('126', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'LDL / HDL Ratio', NULL, '400', 'Upto 3.5', '6.0');
INSERT INTO `testmaster` VALUES ('127', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'T.Cho  / HDL Ratio', NULL, '400', 'Upto 5.0', '7.0');
INSERT INTO `testmaster` VALUES ('121', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'Total Cholesterol', '130 - 250', '400', 'mg/dl', '1.0');
INSERT INTO `testmaster` VALUES ('122', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'Triglycerides', '150 - 199', '400', 'mg/dl', '2.0');
INSERT INTO `testmaster` VALUES ('125', '2', 'BIO - CHEMISTRY', '3', 'LIPID PROFILE', NULL, 'VLDL', '25 - 150', '400', 'mg/dl', '5.0');
INSERT INTO `testmaster` VALUES ('138', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'A/G RATIO', '1.0 - 2.3', '550', NULL, '10.0');
INSERT INTO `testmaster` VALUES ('136', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'ALBUMIN', '3.5 - 5.4', '550', 'GRAMS', '8.0');
INSERT INTO `testmaster` VALUES ('133', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'ALKALINE PHOSPHATASE', '60 - 279', '550', 'IU /L', '6.0');
INSERT INTO `testmaster` VALUES ('129', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'BILIRUBIN (DIRECT)', 'Upto 0.2', '550', 'mgs / dl', '2.0');
INSERT INTO `testmaster` VALUES ('130', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'BILIRUBIN (INDIRCT)', '0.0 - 1.0', '550', 'mgs / dl', '3.0');
INSERT INTO `testmaster` VALUES ('128', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'BILIRUBIN (TOTAL)', '0.0 - 1.0', '550', 'mgs / dl', '1.0');
INSERT INTO `testmaster` VALUES ('137', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'GLOBULIN', '2.3 - 3.6', '550', 'GRAMS', '9.0');
INSERT INTO `testmaster` VALUES ('131', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'SGOT', '40', '550', 'IU /l', '4.0');
INSERT INTO `testmaster` VALUES ('132', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'SGPT', '56.0', '550', 'IU /l', '5.0');
INSERT INTO `testmaster` VALUES ('135', '2', 'BIO - CHEMISTRY', '4', 'LIVER FUNCTION TEST', NULL, 'TOTAL PROTEIN', '6.0 - 8.4', '550', 'GRAMS', '7.0');
INSERT INTO `testmaster` VALUES ('139', '2', 'BIO - CHEMISTRY', '5', 'RENAL FUNCTION TEST', NULL, 'BLOOD UREA', '10 - 50', '400', 'mg/dl', '1.0');
INSERT INTO `testmaster` VALUES ('142', '2', 'BIO - CHEMISTRY', '5', 'RENAL FUNCTION TEST', NULL, 'CALCIUM', '8.4 - 11.5', '400', 'mg/dl', '4.0');
INSERT INTO `testmaster` VALUES ('140', '2', 'BIO - CHEMISTRY', '5', 'RENAL FUNCTION TEST', NULL, 'CREATININE', '0.6 - 1.5', '400', 'mg/dl', '2.0');
INSERT INTO `testmaster` VALUES ('141', '2', 'BIO - CHEMISTRY', '5', 'RENAL FUNCTION TEST', NULL, 'URIC ACID', '2.4 - 5.7', '400', 'mg/dl', '3.0');
INSERT INTO `testmaster` VALUES ('143', '2', 'BIO - CHEMISTRY', '6', 'RHEUMATOID FACTOR', NULL, 'RHEUMATOID FACTOR ( RF )', '<20.0', '450', 'IU /Ml', 'nan');
INSERT INTO `testmaster` VALUES ('189', '3', 'CLINICAL PATHOLOGY', '2', 'UPT', NULL, '-', '-', '100', '-', 'nan');
INSERT INTO `testmaster` VALUES ('153', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'ACETONE', NULL, '150', NULL, '9.0');
INSERT INTO `testmaster` VALUES ('196', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MICROSCOPIC EXAMINATION', 'ALBUMIN', '-', '150', NULL, '5.0');
INSERT INTO `testmaster` VALUES ('156', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'BILE PIGMENTS', NULL, '150', NULL, '11.0');
INSERT INTO `testmaster` VALUES ('155', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'BILE SALT', NULL, '150', NULL, '10.0');
INSERT INTO `testmaster` VALUES ('150', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'BLOOD', NULL, '150', NULL, '7.0');
INSERT INTO `testmaster` VALUES ('144', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'COLOUR', NULL, '150', NULL, '1.0');
INSERT INTO `testmaster` VALUES ('163', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MICROSCOPIC EXAMINATION', 'LEUKOCYTES', NULL, '150', NULL, '2.0');
INSERT INTO `testmaster` VALUES ('149', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'NITRITE', NULL, '150', NULL, '3.0');
INSERT INTO `testmaster` VALUES ('147', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'PH', NULL, '150', NULL, '6.0');
INSERT INTO `testmaster` VALUES ('148', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'SPECIFIC GRAVITY', NULL, '150', NULL, '8.0');
INSERT INTO `testmaster` VALUES ('152', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'SUGAR', NULL, '150', NULL, '12.0');
INSERT INTO `testmaster` VALUES ('154', '3', 'CLINICAL PATHOLOGY', '1', 'URINE COMPLETE ANALYSIS', 'MACROSCOPIC EXAMINATION', 'UROBILINOGEN', NULL, '150', NULL, '4.0');
INSERT INTO `testmaster` VALUES ('187', '4', 'SEROLOGY', '9', 'DENGUE', 'Null', 'DENGUE', '-', '700', '-', '1.0');
INSERT INTO `testmaster` VALUES ('199', '4', 'SEROLOGY', '9', 'DENGUE', 'Null', 'IgG', '-', '700', '-', '4.0');
INSERT INTO `testmaster` VALUES ('198', '4', 'SEROLOGY', '9', 'DENGUE', 'Null', 'IgM', '-', '700', '-', '3.0');
INSERT INTO `testmaster` VALUES ('197', '4', 'SEROLOGY', '9', 'DENGUE', 'Null', 'NSI', '-', '700', '-', '2.0');
INSERT INTO `testmaster` VALUES ('188', '4', 'SEROLOGY', '10', 'MALARIA', NULL, 'MALARIA', '-', '200', '-', '1.0');
INSERT INTO `testmaster` VALUES ('168', '4', 'SEROLOGY', '1', 'MP', NULL, 'MP', NULL, '200', NULL, '2.0');
INSERT INTO `testmaster` VALUES ('175', '4', 'SEROLOGY', '6', 'SEROLOGY', NULL, 'HBsAg', NULL, '350', NULL, '7.0');
INSERT INTO `testmaster` VALUES ('171', '4', 'SEROLOGY', '4', 'SEROLOGY', NULL, 'HCV', NULL, '350', NULL, '6.0');
INSERT INTO `testmaster` VALUES ('170', '4', 'SEROLOGY', '3', 'SEROLOGY', NULL, 'HIV', NULL, '350', NULL, '5.0');
INSERT INTO `testmaster` VALUES ('182', '4', 'SEROLOGY', '8', 'Syphilis Ab Test', NULL, 'Syphilis Ab Test', '-', '500', '-', '11.0');
INSERT INTO `testmaster` VALUES ('172', '4', 'SEROLOGY', '5', 'TROP- T', NULL, 'TROP- T', NULL, '1250', NULL, '3.0');
INSERT INTO `testmaster` VALUES ('177', '4', 'SEROLOGY', '7', 'VDRL', NULL, 'VDRL', NULL, '350', NULL, '4.0');
INSERT INTO `testmaster` VALUES ('169', '4', 'SEROLOGY', '2', 'WIDAL', NULL, 'WIDAL', NULL, '200', NULL, '1.0');
INSERT INTO `testmaster` VALUES ('205', '5', 'IMMUNOASSAY', '2', 'FREE THYROID FUNCTION TEST', NULL, 'FREE T3', '2.1 - 4.4', '550', 'pg/ml', '1.0');
INSERT INTO `testmaster` VALUES ('206', '5', 'IMMUNOASSAY', '2', 'FREE THYROID FUNCTION TEST', NULL, 'FREE T4', 'Newborn: 2.2 - 5.3   Child: 0.8 - 2.0  Adult: 0.7 - 1.48  Pregnancy First Trimester: 0.93 -1.7  Second-Third Trimester: 0.5 - 1.6', '550', 'ng/dl', '2.0');
INSERT INTO `testmaster` VALUES ('207', '5', 'IMMUNOASSAY', '2', 'FREE THYROID FUNCTION TEST', NULL, 'TSH', 'Premature 28-36 weeks: 0.7 - 27.0  Cord Blood(>37weeks): 2.3 - 13.2  Birth-4days: 1.0 - 39.0  10weeks: 0.6 - 10  14months: 0.4 -7.0  5years: 0.4 - 6.0  Adult: 0.27 - 4.20  pregnancy First Trimester: 0.1 - 2.5  Second-Third Trimester: 0.2 - 3.0', '550', 'ulU/ml', '3.0');
INSERT INTO `testmaster` VALUES ('165', '5', 'IMMUNOASSAY', '1', 'THYROID FUNCTION TEST', NULL, 'T3', '0.70 - 2.00', '450', 'ng / mL', '1.0');
INSERT INTO `testmaster` VALUES ('166', '5', 'IMMUNOASSAY', '1', 'THYROID FUNCTION TEST', NULL, 'T4', '4.87 - 11.72', '450', 'ng / mL', '2.0');
INSERT INTO `testmaster` VALUES ('167', '5', 'IMMUNOASSAY', '1', 'THYROID FUNCTION TEST', NULL, 'TSH', '0.35 - 5.50', '450', 'Uiu / mL', '3.0');
INSERT INTO `testmaster` VALUES ('1767889658039', NULL, 'Hematology', NULL, '', NULL, '', '', '', '', NULL);
INSERT INTO `testmaster` VALUES ('1767889819340', NULL, 'Hematology', NULL, '', NULL, '', '', '', '', NULL);
INSERT INTO `testmaster` VALUES ('1767935787601', '', 'Hematology', '', '', '', '', '', '', '', '');

-- ----------------------------
-- Table structure for testmaster_current
-- ----------------------------
DROP TABLE IF EXISTS `testmaster_current`;
CREATE TABLE `testmaster_current`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TestType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SubType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of testmaster_current
-- ----------------------------
INSERT INTO `testmaster_current` VALUES ('5', '1.0', 'Laboratory1', 'HAEMATOLOGY', '150.0');
INSERT INTO `testmaster_current` VALUES ('6', '2.0', 'Laboratory2', 'BIOCHEMISTRY', '250.0');
INSERT INTO `testmaster_current` VALUES ('7', '3.0', 'Laboratory3', 'ENDOCRINOLOGY', '400.0');
INSERT INTO `testmaster_current` VALUES ('8', '4.0', 'Laboratory4', 'HORMONES', '450.0');
INSERT INTO `testmaster_current` VALUES ('9', 'nan', 'Laboratory5', 'IMMUNOLOGY', 'nan');
INSERT INTO `testmaster_current` VALUES ('10', 'nan', 'Laboratory6', 'SEROLOGY', 'nan');
INSERT INTO `testmaster_current` VALUES ('11', 'nan', 'Laboratory7', 'FLUIDS', 'nan');
INSERT INTO `testmaster_current` VALUES ('12', 'nan', 'Laboratory', NULL, 'nan');
INSERT INTO `testmaster_current` VALUES ('13', 'nan', 'Laboratory', NULL, 'nan');

-- ----------------------------
-- Table structure for testsubmaster
-- ----------------------------
DROP TABLE IF EXISTS `testsubmaster`;
CREATE TABLE `testsubmaster`  (
  `ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Sno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Specimen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Testname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `NormalRange` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of testsubmaster
-- ----------------------------
INSERT INTO `testsubmaster` VALUES ('1', '1', 'BLOOD', 'Sample', '1.0', '123.0');
INSERT INTO `testsubmaster` VALUES ('2', '2', 'SERUM', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('3', '3', 'FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('4', '4', 'SPUTUM', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('5', '5', 'URINE', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('6', '6', 'BLOOD(EDTA)', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('7', '7', 'SEMAN', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('8', '19', 'STOOL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('9', '18', 'PUS', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('10', '17', 'PERICARDIAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('11', '15', 'GASTRIC LAVAGE', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('12', '14', 'SCRAP', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('13', '13', 'ASITIC FLUID PANEL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('14', '12', 'GAL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('15', '1', 'CSF PANEL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('16', '10', 'KNEE JOINT FLUID PANEL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('17', '20', 'PLURAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('18', '8', 'PLURAL FLUID PANEL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('19', '7', 'PUS(PANEL)', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('20', '6', 'SAMPLE PUS', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('21', '5', 'PYROTINIAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('22', '27', 'PYROTINIAL FLUID PANEL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('23', '4', 'GASTRIC  LAVARGE', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('24', '11', 'MONOTUX TEST', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('25', '2', 'CSF', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('26', '9', 'TISSUE', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('27', '22', 'SCRAPPING FOR FUNGS', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('28', '23', 'ASITIC FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('29', '24', 'BRONCHOSCOPY LAVAGE(BAL)', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('30', '25', 'GASTRIC LAVAGE (GAL)', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('31', '31', 'KNEE JOINT FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('32', '26', 'PERITONEAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('33', '21', 'PLEURAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('34', '28', 'BRONCHOSCOPY LAVARGE(BAL)', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('35', '29', 'BODY FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('36', '33', 'MONTOUX', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('37', '38', 'SLITSKIN', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('38', '37', 'VAGINAL', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('39', '36', 'BODY FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('40', '35', 'VAGINAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('41', '34', 'OTHER BODY FLUIDS', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('42', '30', 'SYNOVIAL FLUID', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('43', '32', 'SLIT SKIN', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('44', '39', 'OTHER SAMPLES', 'Sample', 'nan', 'nan');
INSERT INTO `testsubmaster` VALUES ('45', '3', 'SMEAR', 'Sample', 'nan', 'nan');

-- ----------------------------
-- Table structure for userdetails
-- ----------------------------
DROP TABLE IF EXISTS `userdetails`;
CREATE TABLE `userdetails`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `UserID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `UserName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Qualification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Subcode6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Batch6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Section6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of userdetails
-- ----------------------------
INSERT INTO `userdetails` VALUES ('0', 'admin', 'admin', 'Admission', NULL, NULL, 'Admin', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'dhiya', 'dhiya', 'Dhiya', NULL, NULL, 'Admin', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'Gowri', 'Gowri', 'Gowri', NULL, NULL, 'Others', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'kumaran', 'kumaran', 'KUMARAN', NULL, NULL, 'Admin', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'Omega', 'Jeeva', 'OmegaInfotech', NULL, NULL, 'Admin', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'staff', 'staff', 'STAFF', NULL, NULL, 'Office', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'test', 'test', 'Test', NULL, NULL, 'Admin', 'nan', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES ('0', 'test1', 'test1', 'Test1', 'MS', 'Pead', 'Admin', '9500979112.0', 'nan', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan', '0.0', '0.0', '0.0', 'nan', 'nan', 'nan');
INSERT INTO `userdetails` VALUES (NULL, 'prawin', 'prawin', 'prawinkumar', 'doctor', 'Admin', 'Admin', '8807054164', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` enum('Active','Inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role_id` int NULL DEFAULT NULL,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `staff_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `module_access` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  INDEX `fk_user_role`(`role_id` ASC) USING BTREE,
  INDEX `idx_users_username`(`username` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE,
  INDEX `idx_users_staff_id`(`staff_id` ASC) USING BTREE,
  INDEX `idx_users_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff_master` (`staff_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2b$10$diB1ZGFt9q/L.KPI1W6eyeA9CUrNvATkVsmS3ygzhC2FP6gJmM7Mm', 'System Administrator', 'Admin', 'Active', '2026-01-15 21:13:15', '2026-02-13 20:44:36', 1, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (3, 'doc', '$2b$10$FY4z.wffwyk8vcDwSXHTFOca81dww/L5rRMs3s3x.haHTSqthnxe2', 'Doctor', 'Doctor', 'Active', '2026-01-15 22:08:26', '2026-02-13 20:44:36', 2, NULL, NULL, 'dashboard,opd,lab,ipd,reports,appointments');
INSERT INTO `users` VALUES (4, 'lab', '$2b$10$UTCYQMiWCUyiY31szypNWe.xZggBLXl8rNV9nPLpGewGqmUua.rJe', 'Lab Technician', 'Lab Technician', 'Active', '2026-01-15 22:08:48', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,lab');
INSERT INTO `users` VALUES (5, 'recep1', '$2b$10$QI2fRLWYew1ewEd9Nhc9Tud5BAl7Qg98wNMwB64JZjHmQk/b8xLxu', 'Receptionist', 'Receptionist', 'Active', '2026-01-15 22:09:20', '2026-02-13 20:44:36', 3, NULL, NULL, 'dashboard,reception,opd,appointments,billing');
INSERT INTO `users` VALUES (7, 'manojanbu70@gmail.com', '$2b$10$qQNfGPMAlIccJcHI91GtbuR1ZYPDJjSAlAarqZmzwudLxqrTqUlXu', 'Manoj A', 'Doctor', 'Active', '2026-01-19 18:37:04', '2026-02-13 20:44:36', 2, NULL, NULL, 'dashboard,opd,lab,ipd,reports,appointments');
INSERT INTO `users` VALUES (8, 'mano@gmail.com', '$2b$10$ENHQqkH23cfU/juY5mRS9.hSvjCoAA3EaTR28etpyY5IfQaMPBoTK', 'Manoj Hariharan', 'PHARMA_MASTER', 'Active', '2026-01-20 18:16:55', '2026-02-13 20:44:36', 9, NULL, NULL, 'dashboard,pharmacy');
INSERT INTO `users` VALUES (9, 'hariharan', '$2b$10$5yELR1ygr9fxgIEJ3GlsU.Owi/xUgsfxwyMFLqXv0uCFaaOerjr1u', 'manojhariharan', 'Receptionist', 'Active', '2026-01-23 10:43:43', '2026-02-13 20:44:36', 3, NULL, NULL, 'dashboard,reception,opd,appointments,billing');
INSERT INTO `users` VALUES (10, 'labmaster', '$2b$10$1Qw8i0ALddH9nhyoQIiPauF5ND0qp2ezZRlECUY2UpUnK9DnjhAm2', 'Labmaster', 'LAB_MASTER', 'Active', '2026-01-27 14:21:41', '2026-02-13 20:44:36', 8, NULL, NULL, 'dashboard,lab');
INSERT INTO `users` VALUES (11, 'pharma1234', '$2b$10$3ruor61U5FCcXm8IkEqc.ehlQ.ZkOREM9551sBSM1hOK14QrLa6jq', 'pharmamaster', 'PHARMA_MASTER', 'Active', '2026-01-27 14:32:02', '2026-02-18 19:39:51', 9, NULL, NULL, '');
INSERT INTO `users` VALUES (12, 'hr', '$2b$10$neaPPNb9ivoM60hEiCIhJ.fu4ce7hDdKDNuXVvgKFrTocwsDNrDcG', 'HR Admin', 'HR', 'Active', '2026-01-29 14:24:06', '2026-02-13 20:44:36', 10, NULL, NULL, 'dashboard,payroll');
INSERT INTO `users` VALUES (14, 'Pharma', '$2b$10$8/ECbFDTkryJ5tHt3BLdjO4lEzk3/PiUW7tv4ea/.hGvWkwlDHIde', 'Pharmacist User', 'Pharmacist', 'Active', '2026-02-13 19:09:20', '2026-03-02 17:42:59', NULL, NULL, NULL, '');
INSERT INTO `users` VALUES (15, 'test_admin_1770992094825', '$2b$10$GHCRzSSDeFK52DExMyQk7.5D5N7L0PkpH1C8aordZJTBcyZT1oa9G', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:44:54', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (16, 'test_admin_1770992138158', '$2b$10$C3VGZC9qJ955b8bRKMs4VeK6dSdDGOzN./dxbU5fljt7BCVYL2SuG', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:45:38', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (17, 'test_admin_1770992166535', '$2b$10$QFZQRgmN1m7v3ED75gZ1oeUC9YAOWYDncuLYGUsiaNWOasizFfAFK', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:46:06', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (18, 'test_admin_1770992213295', '$2b$10$Paw3EgprQgFDftr0KVXAHeOFoE.GLiWbxpTWOQWitFZjbVdKm.SRu', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:46:53', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (19, 'test_admin_1770992250713', '$2b$10$nmAar/bqJILznHFGwNbDG.gaBIx2Qy19Oxs3JqrHxUb0kVK/W4O2O', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:47:30', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (20, 'test_admin_1770992274983', '$2b$10$NVuPB0unH0w0yv/Ngo6F..yHzedbgYXh5xOm8BYkOODrT/Gl43TQO', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:47:55', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (21, 'test_admin_1770992669787', '$2b$10$4aVdxZhhOBJIVvloEB0gt.E9XcwP1LWa71z1jJWDeK.In/mVunri2', 'Test Admin User', 'Admin', 'Active', '2026-02-13 19:54:29', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,users,logs,payroll,pharmacy,lab,reception,ipd,opd,billing,reports,appointments');
INSERT INTO `users` VALUES (26, 'DOC001', '$2b$10$WFQVAH6DOgSa336pJx7/9OD97HFWhgZmb/WNyQnrbAKEhrOJ/oPg6', 'Elango', 'Doctor', 'Active', '2026-02-13 20:26:35', '2026-02-13 20:44:36', NULL, NULL, NULL, 'dashboard,opd,lab,ipd,reports,appointments');
INSERT INTO `users` VALUES (27, 'kavinkumar@gmail.comw', '$2b$10$RoMHE7NY4wwyk2YSkTLEmOGTbKjM1eh0qfTdIlLgyRSQcHxaeYctO', 'Dr. Kavin Kumar', 'Lab Technician', 'Active', '2026-02-14 18:49:07', '2026-02-14 18:49:07', NULL, NULL, NULL, 'dashboard,lab');
INSERT INTO `users` VALUES (28, 'root', '$2b$10$.XvgXxi88QC6uJu42jiaBevjiFWtdhgggJJY5oWzvReh62xzrCJNa', 'root', 'Doctor', 'Active', '2026-02-16 19:10:33', '2026-02-16 19:10:33', 2, NULL, 'root', 'clinical,appointments,billing,dashboard,ipd,opd,reception');
INSERT INTO `users` VALUES (29, 'root2', '$2b$10$0n1g.NtOGWsL7hx0OYWdU.fjdZhu3Pz1/b6oesCWHciBi261xCAHu', 'root', 'Emergency Ward Nurse', 'Active', '2026-02-16 19:15:24', '2026-02-16 19:15:24', 7, NULL, 'root', 'clinical');
INSERT INTO `users` VALUES (30, 'root3', '$2b$10$MpWja1qq2LwRx52p6uoWiuuHxI.qztqUg2nSQBVe3ly8tPa2vQ/Gi', 'elango', 'Head Nurse', 'Active', '2026-02-16 19:31:41', '2026-02-17 19:35:33', 5, NULL, 'root', 'reports');
INSERT INTO `users` VALUES (31, 'root9', '$2b$10$mOPJZXRQh0LxRfb3cvxvqe75DarXMY8AkYHfQ971BP/amUtWo7lC.', 'Nithish', 'Cheif surgeon', 'Active', '2026-02-17 20:53:21', '2026-02-24 19:20:25', 15, NULL, 'Nithish', 'logs,users,payroll,pharmacy');
INSERT INTO `users` VALUES (32, 'pantry', '$2b$10$KFcH.zCVxnSfpFTpVLsq7eqommmjc6EPwYo55eaKuh.QkVD918JrG', 'John Kitchen', 'Pantry', 'Active', '2026-03-04 19:10:08', '2026-03-04 19:27:49', NULL, NULL, NULL, 'pantry');
INSERT INTO `users` VALUES (33, 'nurse', '$2b$10$CdMpv5lFgkSj1pTuFDOCcuPQN7IZDjEFk8FukEa5A.sskvj3g3W0.', 'Mary Night', 'Nurse', 'Active', '2026-03-04 19:10:08', '2026-03-04 19:27:49', NULL, NULL, NULL, 'nurse');
INSERT INTO `users` VALUES (34, 'pantry1', '$2b$10$RmHw1q6w5vsRZ49C9hrJM.LnN1R5LHuONz2wxcCZYcKyLDOEDGAG6', 'Pantry01', 'pantry', 'Active', '2026-03-04 19:14:11', '2026-03-04 19:14:11', 17, NULL, 'Pantry01', '');

-- ----------------------------
-- Table structure for users_roles
-- ----------------------------
DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `role`(`role` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_roles
-- ----------------------------
INSERT INTO `users_roles` VALUES (8, 'Accountant');
INSERT INTO `users_roles` VALUES (1, 'Admin');
INSERT INTO `users_roles` VALUES (11, 'chairman');
INSERT INTO `users_roles` VALUES (13, 'cheif doctor');
INSERT INTO `users_roles` VALUES (2, 'Doctor');
INSERT INTO `users_roles` VALUES (7, 'HR');
INSERT INTO `users_roles` VALUES (5, 'Lab Technician');
INSERT INTO `users_roles` VALUES (10, 'LAB_MASTER');
INSERT INTO `users_roles` VALUES (6, 'Nurse');
INSERT INTO `users_roles` VALUES (9, 'PHARMA_MASTER');
INSERT INTO `users_roles` VALUES (4, 'Pharmacist');
INSERT INTO `users_roles` VALUES (3, 'Receptionist');
INSERT INTO `users_roles` VALUES (12, 'ward boy');

-- ----------------------------
-- Table structure for usersdetails
-- ----------------------------
DROP TABLE IF EXISTS `usersdetails`;
CREATE TABLE `usersdetails`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `qualification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of usersdetails
-- ----------------------------
INSERT INTO `usersdetails` VALUES (1, 'Super Admin', 'admin@hms.com', '$2b$10$WbWD5yGlcMeZzGUS7h/DX..jvJnkQpektKLAylHTFhvp23QuTJ.ge', 'Admin', NULL, NULL, NULL, NULL, 'Active', '2026-01-08 15:14:10');
INSERT INTO `usersdetails` VALUES (2, 'Dr. Smith', 'doctor@hms.com', '$2b$10$rGxHDxJW7aVw05vFExsp7O/vYZuHuCKE7vy/zonM4kX8JQcrD5Jqu', 'Doctor', NULL, NULL, NULL, NULL, 'Active', '2026-01-08 15:14:10');
INSERT INTO `usersdetails` VALUES (3, 'Front Desk', 'reception@hms.com', '$2b$10$.RrLqlaspezdVhjD3YTPiehGZ.WkwPvU/lruLe/26WmvcnLKV2P8O', 'Receptionist', NULL, NULL, NULL, NULL, 'Active', '2026-01-08 15:14:10');
INSERT INTO `usersdetails` VALUES (4, 'Pharmacist', 'pharmacy@hms.com', '$2b$10$6cAUMJYnFZAuYbiuAU5Eo.E93S00w.ynIwGq9A02Pnd3oUwar2Yka', 'Pharmacist', NULL, NULL, NULL, NULL, 'Active', '2026-01-08 15:14:10');
INSERT INTO `usersdetails` VALUES (5, 'Lab Tech', 'lab@hms.com', '$2b$10$L8PSWN7cKWzbR6OF.xt3DOKssNxRrOqaO32byDJVYaHbuMmFitx36', 'Lab Technician', NULL, NULL, NULL, NULL, 'Active', '2026-01-08 15:14:10');
INSERT INTO `usersdetails` VALUES (6, 'elan', 'elan@gmail.com', '$2b$10$lY6WCzDPfpAdkEA6JhyD6uYzfyIgO57MoUMAzA3/NlRyPB4OAXMoG', 'Admin', '', '', '', '', 'Active', '2026-01-09 14:23:24');

-- ----------------------------
-- Table structure for vendor
-- ----------------------------
DROP TABLE IF EXISTS `vendor`;
CREATE TABLE `vendor`  (
  `SNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CompanyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of vendor
-- ----------------------------
INSERT INTO `vendor` VALUES ('3', 'Bee medicals', 'vik', 'gobi', '9842351010', '-');
INSERT INTO `vendor` VALUES ('4', 'HM Chemicals', 'jee', 'Karur', '8667281200', '2226551');
INSERT INTO `vendor` VALUES ('5', 'Sudha Hospital', 'Mukilan S', 'No 79 Erappampalayam, Sottai Veethi , Kandikattu valasu post, Avalpoondurai,Erode-638115', '09095332999', 'India');
INSERT INTO `vendor` VALUES ('6', 'Sudha ', 'Dr. KAvin', 'Erode', '355', '466');

-- ----------------------------
-- Table structure for visits
-- ----------------------------
DROP TABLE IF EXISTS `visits`;
CREATE TABLE `visits`  (
  `visit_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `visit_date` date NOT NULL,
  `token_no` int NOT NULL,
  `visit_type` enum('OP','IP') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'OP',
  `status` enum('Waiting','In_Consult','Completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Waiting',
  `op_fee` decimal(10, 2) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`visit_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visits
-- ----------------------------

-- ----------------------------
-- Table structure for ward_indent_requests
-- ----------------------------
DROP TABLE IF EXISTS `ward_indent_requests`;
CREATE TABLE `ward_indent_requests`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requested_by` int NOT NULL,
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requested_qty` int NOT NULL,
  `status` enum('Pending','Approved','Issued','Rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Pending',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_ward_indent_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ward_indent_requests
-- ----------------------------
INSERT INTO `ward_indent_requests` VALUES (1, 'Ward B - B-1', 1, 'ME001', 'saline', 10, 'Pending', '2026-03-04 18:55:11', NULL);

-- ----------------------------
-- Table structure for ward_inventory
-- ----------------------------
DROP TABLE IF EXISTS `ward_inventory`;
CREATE TABLE `ward_inventory`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NULL DEFAULT 0,
  `reorder_level` int NULL DEFAULT 5,
  `last_updated` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_ward_product`(`ward` ASC, `product_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ward_inventory
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
