# Patient Life Cycle Management (PLCM) Architecture

## 1. System Overview

### Current State (Clinical / Transactional)

The current Hospital Management System (HMS) operates on a transactional model. Modules (`ipd`, `opd`, `inventory`, `billing`) run independently with minimal interconnected state. Admissions are simple status changes without a temporal flow of medical care.

### Target State (Lifecycle Management)

The goal is to implement a unified, real-time **Patient Life Cycle Management (PLCM)** system.
A patient's journey must seamlessly transition across departments:
**Admit ➔ Triage / Vitals ➔ Doctor Rounds / Orders ➔ eMAR (Medication Admin) & Inventory Sync ➔ Dietary / Pantry Fulfillment ➔ Clearance ➔ Automated Discharge Summary & Billing.**

---

## 2. Core Operational Workflows

### 2.1 Doctor Workflow

* **Continuous EMR (Electronic Medical Records):** Shift from single prescriptions to Daily SOAP Notes (Subjective, Objective, Assessment, Plan).
* **Actionable CPOE (Computerized Provider Order Entry):** Doctor orders (Labs, Meds, Diet) instantly trigger actionable tasks for Nurses, Lab Techs, and Pantry staff.
* **Discharge Initialization:** Doctors flag "Ready for Discharge", initiating a multi-department clearance process.

### 2.2 Nurse Workflow (The Operational Hub)

* **Triage / Vitals Flow:** Structured logging of BP, Pulse, SpO2, Temp at scheduled intervals.
* **eMAR (Electronic Medication Administration Record):** Nurses must explicitly acknowledge the administration of prescribed drugs using the dashboard.
* **Ward-to-Store Indenting:** Auto-generation of inventory indents based on live ward consumption.

### 2.3 Inventory Tracking Integration

* **Point-of-Care Deduction:** When a nurse acknowledges medication administration via eMAR, the system immediately deducts it from the Ward Inventory.
* **Live IPD Billing:** Consumables and meds are billed to the patient's running IPD folio in real-time.

### 2.4 Pantry & Dietary Department (New)

* **Dietary Prescriptions:** Doctor selects diet type (e.g., Diabetic, NPO, Soft Diet).
* **Meal Fulfillment Dashboard:** Pantry sees a live grid of active beds and requested diets, marking meals as "Delivered" per shift.

### 2.5 Automated Discharge Summary

* **Aggregation Engine:** Automatically compiles Admission Reason, Triage Vitals, Lab Results, Daily SOAP Notes, and Discharge Medications.
* **Clearance Gatekeeper:** Discharge summary generation and final billing are blocked until Pharmacy, Ward, and Pantry issue digital "Clearance".

---

## 3. Proposed Database Schema (MySQL)

Below are the foundational schemas needed to support this lifecycle:

```sql
-- 1. Tracks the Patient's live status in the hospital
CREATE TABLE ipd_lifecycle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,  -- Links to existing admissions table
    current_status ENUM('Triage', 'In_Ward', 'Surgery', 'Ready_For_Discharge', 'Discharged') DEFAULT 'Triage',
    triage_cleared BOOLEAN DEFAULT FALSE,
    ward_cleared BOOLEAN DEFAULT FALSE,
    pharmacy_cleared BOOLEAN DEFAULT FALSE,
    billing_cleared BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Doctor's Daily Clinical Notes (SOAP)
CREATE TABLE daily_soap_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    doctor_id INT NOT NULL,
    subjective_notes TEXT,
    objective_notes TEXT,
    assessment TEXT,
    plan TEXT,
    note_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Nurse Vitals Monitoring
CREATE TABLE nursing_vitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    nurse_id INT NOT NULL,
    blood_pressure VARCHAR(20),
    pulse_rate INT,
    temperature DECIMAL(5,2),
    spo2 INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Electronic Medication Administration Record (eMAR)
CREATE TABLE emar_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    prescription_id INT NOT NULL,
    nurse_id INT NOT NULL,
    item_id INT NOT NULL, -- Links to inventory for deduction
    administered_qty INT NOT NULL,
    status ENUM('Pending', 'Given', 'Missed', 'Refused') DEFAULT 'Pending',
    scheduled_time DATETIME NOT NULL,
    administered_time DATETIME NULL
);

-- 5. Pantry / Dietary Management
CREATE TABLE dietary_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    diet_type ENUM('Normal', 'Diabetic', 'Liquid', 'Soft', 'NPO', 'Renal') DEFAULT 'Normal',
    special_instructions TEXT,
    doctor_id INT NOT NULL,
    status ENUM('Active', 'Hold', 'Discontinued') DEFAULT 'Active',
    start_date DATE NOT NULL
);

-- 6. Meal Delivery Logs
CREATE TABLE meal_deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    diet_request_id INT NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'),
    delivery_status ENUM('Pending', 'Delivered', 'Skipped') DEFAULT 'Pending',
    delivery_date DATE NOT NULL,
    delivered_at TIMESTAMP NULL
);
```

---

## 4. Proposed API Contracts (Backend: Express.js)

### Doctor Module APIs

- `POST /api/ipd/:admissionId/soap-notes` - Add daily clinical notes.
- `POST /api/ipd/:admissionId/discharge-initiate` - Flags the patient as "Ready_For_Discharge" and alerts operations.

### Nurse Module APIs

- `POST /api/ipd/:admissionId/vitals` - Log patient vitals.
- `GET /api/ipd/emar/pending` - Get all pending medications for a specific ward/shift.
- `POST /api/ipd/emar/:emarId/administer` - Mark med as given. **(Middleware automatically deducts from `inventory` and posts to `billing`).**

### Pantry / Dietary APIs

- `GET /api/pantry/active-diets` - Fetch live grid of all active IPD diets by Bed/Ward.
- `POST /api/pantry/deliver-meal` - Mark meal as fulfilled.

### Clearance & Discharge APIs

- `PUT /api/ipd/:admissionId/clearance/:department` - Ward/Pharmacy/Billing marks clearance.
- `GET /api/ipd/:admissionId/discharge-summary` - Auto-aggregates data from Vitals, Labs, SOAP notes, and Pharmacy for printing.

---

## 5. Implementation Roadmap

### Database Migration & Foundation

- Run schema migrations to add `ipd_lifecycle`, `nursing_vitals`, and `daily_soap_notes`.
- Update the existing IPD Admission API to hook into the `ipd_lifecycle` table.

### Phase 2: Nurse Workflow & Inventory Bridge

- Build the Vitals logging frontend and backend.
- Build the eMAR dashboard for Nurses.
- Write backend Service Logic: When eMAR returns `status = Given`, trigger standard `inventory.service` reduction and add line item to IPD running bill.

### Phase 3: Dietary / Pantry Subsystem

- Create the Doctor UI to order diets.
- Build the Pantry Kitchen Dashboard showing real-time dietary requirements.

### Phase 4: Automated Discharge & Clearance

- Build Department Clearance dashboards.
- Generate the dynamic Discharge Summary PDF pulling from all aggregated tables.
