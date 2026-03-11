# Hospital Payroll & HRMS Module - Architectural Blueprint

**Version:** 1.0  
**Domain:** Healthcare / Hospital ERP  
**Target Architecture:** scalable, Production-Ready, Compliance-First

---

## 1. Executive Summary
This blueprint defines a robust, industrial-grade Payroll and HRMS specifically designed for the complex needs of a multi-specialty hospital. Unlike standard corporate payroll, this system handles 24/7 rotating shifts, intricate doctor compensation models (retainer vs. revenue share), emergency duty allowances, and strict statutory compliance.

---

## 2. Core Modules Overview (The "Big 12")

1.  **Employee Master (HRIS)**
2.  **Time Office (Attendance & Biometric)**
3.  **Roster & Shift Management**
4.  **Leave Management**
5.  **Compensation & Salary Structure**
6.  **Doctor Payouts & Incentives (Clinical Revenue Share)**
7.  **Payroll Processing Engine**
8.  **Statutory Compliance (Taxation)**
9.  **Loans, Advances & Reimbursements**
10. **Full & Final Settlement (Exits)**
11. **Finance & GL Integration**
12. **Employee Self-Service (ESS)**

---

## 3. Detailed Module Specifications

### Module 1: Employee Master (HRIS)
**Goal:** Single Source of Truth for all staff data.

*   **Employee Categories:**
    *   **Clinical:** Consultants (Visiting/Fixed), RMOs, Surgeons, Nurses (Staff/Head), Technicians (Lab/Radio).
    *   **Non-Clinical:** Admin, Finance, Housekeeping, Security, Maintenance.
    *   **Contractual:** Outsourced agency staff (Security/Canteen) - often managed for compliance only.
*   **Key Data Points:**
    *   **Personal:** Name, DOB, Blood Group, Emergency Contact.
    *   **Professional:** DOJ, Designation, Department, Specialization (Crucial for Doctors), License Numbers (MCI/Nursing Council).
    *   **Financial:** Bank Account, PAN, Aadhaar, UAN (PF), ESIC Number.
    *   **Separation:** Probation period, Notice period terms.

### Module 2: Time Office & Attendance
**Goal:** Automate "Payable Days" calculation based on complex hospital shifts.

*   **Input:** Biometric/Face Recognition devices, Manual Regularization by HOD.
*   **Key Logic:**
    *   **Shift Detection:** Auto-detect shift based on punch time (First-In, Last-Out).
    *   **Late/Early Policy:** e.g., "3 Late marks = 0.5 day LOP".
    *   **Missed Punch:** Workflow for approval.
    *   **Sandwich Rule:** If absent on Sat & Mon, Sunday is marked absent (Configurable).
*   **Output:** Final "Present Days", "LOP Days", "Ot Hours" for the month.

### Module 3: Roster & Shift Management
**Goal:** 24/7 coverage planning.

*   **Shift Types:**
    *   **General:** 9 AM - 6 PM (Admin).
    *   **Rotational:** Morning (A), Evening (B), Night (C).
    *   **Split Shift:** 8-12 and 4-8 (OPD Doctors).
    *   **Double Duty:** Continuous 16/24 hour shifts (ICU/Emergency Doctors).
*   **Logic:**
    *   Auto-rotation logic.
    *   Swap shift requests (Nurse A swaps with Nurse B).
    *   **Night Shift Allowance:** Auto-calculated per night duty performed.

### Module 4: Leave Management
**Goal:** Manage paid and unpaid time off.

*   **Leave Types:**
    *   CL (Casual), SL (Sick), PL (Privilege/Earned), Maternity (26 weeks), Paternity.
    *   **Comp-Off:** Work on holiday = 1 Credit added to Comp-Off balance.
*   **Inputs:** Leave Application (ESS), HOD Approval.
*   **Logic:**
    *   Check Balance > Apply Limits (e.g., max 3 CL at once) > Approval Workflow.
    *   Year-end Logic: Encashment of PL vs. Lapse.

### Module 5: Clinical Incentives (Doctor Payouts)
**Goal:** Handle the complex revenue-sharing models for doctors. **(Unique to Hospitals)**

*   **Models:**
    *   **Fixed Salary:** Standard monthly pay (e.g., Junior Doctors).
    *   **Retainer + Incentive:** Minimum guarantee + % of revenue above threshold.
    *   **Fee-for-Service (Visiting):** Direct % share per OP consult or Surgery.
*   **Incentive Logic:**
    *   **OPD:** % of Consultation Fee (e.g., 70% to Doctor).
    *   **IPD/Surgery:** % of Procedure Charge (e.g., 15% to Surgeon, 5% to Anesthetist).
    *   **Diagnostics:** Referral % for prescribing CT/MRI (Ethical boundaries apply).
*   **Process:**
    *   Fetch "Realized Revenue" (Bill cleared & paid) from Billing Module.
    *   Apply agreed percentages from "Doctor Contract Master".
    *   Output: "Variable Pay" component for the month.
*   **Exception:**
    *   Refunds/Cancellations must deduct the incentive in the next incomplete cycle.

### Module 6: Salary Structure & Compensation
**Goal:** Define how an employee is paid.

*   **Components:**
    *   **Earnings (Fixed):** Basic, HRA, DA, Special Allowance, Uniform Allowance (Nurses), Washing Allowance.
    *   **Earnings (Variable):** Overtime (OT), Night Shift Allowance, Clinical Incentives, On-Call Pay.
    *   **Deductions:** PF (Employee), ESI, PT, TDS (Tax), LWF, Canteen Recovery, Advance Recovery.
*   **Cost to Company (CTC):** Includes Employer PF/ESI and Gratuity provision.

### Module 7: Payroll Processing Engine
**Goal:** The mathematical core.

*   **Sequence:**
    1.  **Lock Attendance:** Freeze inputs from Module 2 & 3.
    2.  **Calculate Days:** Total Days - LOP = Paid Days.
    3.  **Pro-rata Fixed Pay:** (Fixed Gross / Month Days) * Paid Days.
    4.  **Add Variable Pay:** Import incentives (Module 5) + Calculate OT (Module 2).
    5.  **Gross Pay:** Fixed + Variable.
    6.  **Calculate Statutory:** Compute PF, ESI, PT based on Gross/Basic rules.
    7.  **Calculate Tax (TDS):** Forecast annual income, compute tax slab, deduct monthly portion.
    8.  **Net Pay:** Gross - Total Deductions.

### Module 8: Statutory Compliance
**Goal:** Legal safety.

*   **PF (Provident Fund):** 12% of (Basic + DA) capped at ₹15,000 limit (configurable).
*   **ESI (Health Insurance):** 0.75% (Employee) & 3.25% (Employer) on Gross < ₹21,000.
*   **Professional Tax (PT):** Slate-slab based logic.
*   **TDS (Income Tax):** Section 192. Investment declarations (80C, 80D) capture in `IT Declaration` module.
*   **Output:** Challan generation files (ECR text files) for government portals.

### Module 9: Loans & Advances
**Goal:** Internal lending.

*   **Features:**
    *   Loan Application & Approval.
    *   Interest vs. Interest-free.
    *   **EMI Recovery:** Auto-deduct from salary each month.
    *   **Stop Payment:** Manual override capability.

### Module 10: Finance Integration
**Goal:** Automate accounting.

*   **Journal Voucher (JV):**
    *   Debit: Salary Expense Account (Cost Center wise: Nursing, Admin, Surgery).
    *   Credit: Salary Payable, PF Payable, TDS Payable, Bank Account.
*   **Bank Advice:** Generate CSV/Excel format compatible with Corporate Banking (HDFC/SBI/ICICI) for bulk upload.

---

## 4. Technical Architecture & Non-Functional Requirements (NFRs)

### Data Integrity & Validation
*   **Concurrency:** Handling simultaneous payroll modifications (Optimistic Locking).
*   **Audit Trails:** "Who changed the Basic Salary of Dr. Smith?" -> Log UserID, Timestamp, OldVal, NewVal.
*   **Retro-active Changes:** If salary is hiked in March effective from Jan, system must calculate **Arrears** (Jan + Feb difference) automatically in March payroll.

### Role-Based Access Control (RBAC)
*   **Super Admin:** Configuration & Master Data.
*   **HR Executive:** Attendance & Leave management.
*   **Payroll Manager:** Salary view & Processing (Sensitive).
*   **Finance Head:** Approval & Bank File generation.
*   **Department HOD:** View only Roster/Attendance of their team (No Salary access).

### Security
*   **Encryption:** Salary data encrypted at rest (AES-256).
*   **Masking:** ESS should mask PII like bank account/Aadhaar.
*   **Separation of Duties:** The person who *enters* attendance cannot *finalize* payroll.

---

## 5. Implementation Roadmap (Phases)

1.  **Phase 1: Foundation**
    *   Employee Master, Salary Structure Config, Attendance Integration.
2.  **Phase 2: Core Payroll**
    *   Processing Engine, Payslip Generation, Bank Transfer Files.
3.  **Phase 3: Advanced**
    *   Doctor Incentives Module (Integration with Billing).
    *   Statutory Reports (PF/ESI Challans).
4.  **Phase 4: Optimization**
    *   Employee Self-Service (Mobile App/Web).
    *   Advanced Analytics (Cost per Bed, Staff Cost/Revenue Ratio).

---
*This document serves as the master blueprint for the HMS Payroll Module.*
