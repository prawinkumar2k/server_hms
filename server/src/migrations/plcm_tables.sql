-- ============================================================
-- Patient Life Cycle Management (PLCM) Migration
-- Run this against your MySQL database
-- ============================================================

-- 1. Nurse Vitals Tracking
CREATE TABLE IF NOT EXISTS ipd_vitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  recorded_by INT NOT NULL,
  bp_systolic INT,
  bp_diastolic INT,
  temperature DECIMAL(4,1),
  pulse INT,
  spo2 INT,
  sugar_level DECIMAL(6,1),
  respiratory_rate INT,
  notes TEXT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_vitals_admission (admission_id),
  INDEX idx_vitals_recorded (recorded_at)
);

-- 2. Doctor Daily Rounds (SOAP Notes / EMR)
CREATE TABLE IF NOT EXISTS ipd_doctor_rounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  doctor_id INT NOT NULL,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  round_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rounds_admission (admission_id),
  INDEX idx_rounds_doctor (doctor_id)
);

-- 3. Doctor Orders (Medications / Procedures / Diet / Consumables)
CREATE TABLE IF NOT EXISTS ipd_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  ordered_by INT NOT NULL,
  order_type ENUM('Medication','Procedure','Lab','Diet','Consumable') NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  instructions TEXT,
  status ENUM('Pending','Acknowledged','Administered','Completed','Cancelled') DEFAULT 'Pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_orders_admission (admission_id),
  INDEX idx_orders_status (status)
);

-- 4. eMAR (Electronic Medication Administration Record)
CREATE TABLE IF NOT EXISTS ipd_emar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  admission_id INT NOT NULL,
  administered_by INT NOT NULL,
  administered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_emar_order (order_id),
  INDEX idx_emar_admission (admission_id)
);

-- 5. Ward Inventory (Sub-stock per ward)
CREATE TABLE IF NOT EXISTS ward_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ward VARCHAR(100) NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  reorder_level INT DEFAULT 5,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ward_product (ward, product_code)
);

-- 6. Ward Indent Requests (Nurse -> Central Inventory)
CREATE TABLE IF NOT EXISTS ward_indent_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ward VARCHAR(100) NOT NULL,
  requested_by INT NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  requested_qty INT NOT NULL,
  status ENUM('Pending','Approved','Issued','Rejected') DEFAULT 'Pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  INDEX idx_ward_indent_status (status)
);

-- 7. Patient Billing Folio (Running IPD charges)
CREATE TABLE IF NOT EXISTS ipd_billing_folio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  charge_type ENUM('Room','Medication','Consumable','Lab','Procedure','Diet','Other') NOT NULL,
  description VARCHAR(255),
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  charged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_folio_admission (admission_id)
);

-- 8. Dietary Orders (Pantry Module)
CREATE TABLE IF NOT EXISTS dietary_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  bed_number VARCHAR(20),
  ward VARCHAR(100),
  patient_name VARCHAR(255),
  diet_type VARCHAR(100) NOT NULL,
  special_instructions TEXT,
  meal_time ENUM('Breakfast','Lunch','Snack','Dinner') NOT NULL,
  scheduled_date DATE NOT NULL,
  status ENUM('Pending','Preparing','Delivered','Cancelled') DEFAULT 'Pending',
  delivered_by INT NULL,
  delivered_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_dietary_admission (admission_id),
  INDEX idx_dietary_date (scheduled_date, meal_time)
);

-- 9. Discharge Clearance Tracking
CREATE TABLE IF NOT EXISTS discharge_clearance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  department ENUM('Pantry','Inventory','Pharmacy','Ward','Billing') NOT NULL,
  status ENUM('Pending','Cleared') DEFAULT 'Pending',
  cleared_by INT NULL,
  cleared_at DATETIME NULL,
  notes TEXT,
  UNIQUE KEY uk_dept_admission (admission_id, department),
  INDEX idx_clearance_admission (admission_id)
);

-- 10. Discharge Summary (Auto-aggregated)
CREATE TABLE IF NOT EXISTS discharge_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_id INT NOT NULL,
  admission_date DATE,
  discharge_date DATE,
  admission_reason TEXT,
  initial_vitals JSON,
  lab_results JSON,
  procedures_performed JSON,
  course_in_hospital TEXT,
  final_diagnosis TEXT,
  discharge_medications JSON,
  follow_up_instructions TEXT,
  generated_by INT,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_finalized TINYINT(1) DEFAULT 0,
  UNIQUE KEY uk_summary_admission (admission_id)
);

-- 11. Extend ipd_admissions for lifecycle support
ALTER TABLE ipd_admissions 
  ADD COLUMN triage_status ENUM('Pending','Completed') DEFAULT 'Pending',
  ADD COLUMN discharge_ready TINYINT(1) DEFAULT 0,
  ADD COLUMN discharge_initiated_by INT NULL,
  ADD COLUMN diet_preference VARCHAR(100) NULL;
