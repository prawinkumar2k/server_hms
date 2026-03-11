/**
 * Production Database Index Migration Script
 * 
 * Run once: node src/scripts/create_indexes.js
 * 
 * These indexes are critical for handling 1M+ requests efficiently.
 * All heavy LIKE searches, JOINs, and frequently-filtered columns need indexes.
 * 
 * Safe to run multiple times — uses IF NOT EXISTS / CREATE INDEX syntax.
 */

const db = require('../config/db');

const indexes = [
    // ========================
    // AUTH & USERS
    // ========================
    { table: 'users', name: 'idx_users_username', columns: 'username' },
    { table: 'users', name: 'idx_users_role', columns: 'role' },
    { table: 'users', name: 'idx_users_staff_id', columns: 'staff_id' },
    { table: 'users', name: 'idx_users_status', columns: 'status' },

    // ========================
    // PATIENTS (Legacy Table)
    // ========================
    { table: 'copy_of_patientdetaiils', name: 'idx_patients_cusId', columns: 'cusId' },
    { table: 'copy_of_patientdetaiils', name: 'idx_patients_cusName', columns: 'cusName' },
    { table: 'copy_of_patientdetaiils', name: 'idx_patients_mobile', columns: 'MobileNo' },

    { table: 'patientdetaiils', name: 'idx_patientdet_cusId', columns: 'cusId' },
    { table: 'patientdetaiils', name: 'idx_patientdet_cusName', columns: 'cusName' },

    // ========================
    // APPOINTMENTS
    // ========================
    { table: 'appointments', name: 'idx_appointments_patient', columns: 'patient_name' },
    { table: 'appointments', name: 'idx_appointments_doctor', columns: 'doctor_name' },
    { table: 'appointments', name: 'idx_appointments_date', columns: 'date' },
    { table: 'appointments', name: 'idx_appointments_status', columns: 'status' },

    // ========================
    // OPD
    // ========================
    { table: 'opd_visits', name: 'idx_opd_patient', columns: 'patient_name' },
    { table: 'opd_visits', name: 'idx_opd_doctor', columns: 'doctor_name' },
    { table: 'opd_visits', name: 'idx_opd_date', columns: 'visit_date' },

    // ========================
    // IPD
    // ========================
    { table: 'ipd_admissions', name: 'idx_ipd_patient_id', columns: 'patient_id' },
    { table: 'ipd_admissions', name: 'idx_ipd_patient_name', columns: 'patient_name' },
    { table: 'ipd_admissions', name: 'idx_ipd_bed_id', columns: 'bed_id' },
    { table: 'ipd_admissions', name: 'idx_ipd_status', columns: 'status' },
    { table: 'ipd_admissions', name: 'idx_ipd_admission_date', columns: 'admission_date' },
    { table: 'beds', name: 'idx_beds_status', columns: 'status' },
    { table: 'beds', name: 'idx_beds_ward', columns: 'ward' },

    // ========================
    // BILLING (Hospital)
    // ========================
    { table: 'invoices', name: 'idx_invoices_patient', columns: 'patient_name' },
    { table: 'invoices', name: 'idx_invoices_date', columns: 'invoice_date' },
    { table: 'invoices', name: 'idx_invoices_status', columns: 'status' },
    { table: 'invoices', name: 'idx_invoices_category', columns: 'category' },
    { table: 'hospital_bills', name: 'idx_hosp_bills_patient', columns: 'patient_id' },
    { table: 'hospital_bills', name: 'idx_hosp_bills_admission', columns: 'admission_id' },

    // ========================
    // PHARMACY (Legacy Tables)
    // ========================
    { table: 'product', name: 'idx_product_pcode', columns: 'Pcode' },
    { table: 'product', name: 'idx_product_name', columns: 'ProductName' },
    { table: 'product', name: 'idx_product_stock', columns: 'Stock' },

    { table: 'billdetails', name: 'idx_billdet_rno', columns: 'RNo' },
    { table: 'billdetails', name: 'idx_billdet_cusid', columns: 'CusID' },
    { table: 'billdetails', name: 'idx_billdet_cusname', columns: 'CusName' },
    { table: 'billdetails', name: 'idx_billdet_pdate', columns: 'PDate' },
    { table: 'billdetails', name: 'idx_billdet_status', columns: 'Status' },
    { table: 'billdetails', name: 'idx_billdet_billtype', columns: 'BillType' },

    { table: 'productreturn', name: 'idx_prodreturn_rno', columns: 'Rno' },

    // SUPPLIERS & STOCK ORDERS
    { table: 'suppliers', name: 'idx_suppliers_name', columns: 'supplier_name' },
    { table: 'stock_orders', name: 'idx_stockorders_supplier', columns: 'supplier_id' },
    { table: 'stock_orders', name: 'idx_stockorders_status', columns: 'order_status' },
    { table: 'stock_orders', name: 'idx_stockorders_orderno', columns: 'order_number' },

    // ========================
    // LAB
    // ========================
    { table: 'labtest', name: 'idx_labtest_patientid', columns: 'PatientID' },
    { table: 'labtest', name: 'idx_labtest_tdate', columns: 'TDate' },
    { table: 'labtest', name: 'idx_labtest_testtype', columns: 'TypeTest' },

    { table: 'doctordetails', name: 'idx_docdet_docid', columns: 'DocID' },
    { table: 'doctordetails', name: 'idx_docdet_docname', columns: 'DocName' },

    { table: 'testmaster', name: 'idx_testmaster_testtype', columns: 'TestType' },

    { table: 'lab_requests', name: 'idx_labreq_status', columns: 'status' },
    { table: 'lab_requests', name: 'idx_labreq_patient_id', columns: 'patient_id' },
    { table: 'lab_request_items', name: 'idx_labreqitem_request_id', columns: 'request_id' },
    { table: 'lab_request_items', name: 'idx_labreqitem_status', columns: 'status' },

    { table: 'lab_bills', name: 'idx_labbills_patient_id', columns: 'patient_id' },
    { table: 'lab_bills', name: 'idx_labbills_date', columns: 'bill_date' },

    // ========================
    // PRESCRIPTIONS
    // ========================
    { table: 'prescriptions', name: 'idx_prescriptions_cusid', columns: 'cusId' },
    { table: 'prescriptions', name: 'idx_prescriptions_cusname', columns: 'cusName' },
    { table: 'prescriptions', name: 'idx_prescriptions_date', columns: 'pDate' },
    { table: 'prescriptions', name: 'idx_prescriptions_status', columns: 'status' },

    // ========================
    // CLINICAL NOTES
    // ========================
    { table: 'clinical_notes', name: 'idx_clinical_patient', columns: 'patient_id' },
    { table: 'clinical_notes', name: 'idx_clinical_doctor', columns: 'doctor_id' },
    { table: 'clinical_notes', name: 'idx_clinical_date', columns: 'visit_date' },

    // ========================
    // PAYROLL
    // ========================
    { table: 'employees', name: 'idx_employees_code', columns: 'employee_code' },
    { table: 'employees', name: 'idx_employees_dept', columns: 'department' },
    { table: 'employees', name: 'idx_employees_status', columns: 'status' },

    { table: 'salary_structures', name: 'idx_salary_employee', columns: 'employee_id' },
    { table: 'attendance_logs', name: 'idx_attendance_employee', columns: 'employee_id' },
    { table: 'attendance_logs', name: 'idx_attendance_date', columns: 'date' },
    { table: 'payslips', name: 'idx_payslips_employee', columns: 'employee_id' },
    { table: 'payslips', name: 'idx_payslips_month_year', columns: 'month, year' },

    // ========================
    // AUDIT & LOGS
    // ========================
    { table: 'audit_logs', name: 'idx_audit_entity', columns: 'entity_type' },
    { table: 'audit_logs', name: 'idx_audit_action', columns: 'action_type' },
    { table: 'audit_logs', name: 'idx_audit_user', columns: 'performed_by' },

    { table: 'log_details', name: 'idx_logdet_username', columns: 'username' },
    { table: 'log_details', name: 'idx_logdet_created', columns: 'created_at' },

    // ========================
    // DAILY OP RECORDS
    // ========================
    { table: 'daily_op_records', name: 'idx_dailyop_date', columns: 'visit_date' },

    // ========================
    // DOCTOR PROFILES
    // ========================
    { table: 'doctor_profiles', name: 'idx_docprofile_userid', columns: 'user_id' },

    // ========================
    // RBAC
    // ========================
    { table: 'roles', name: 'idx_roles_name', columns: 'name' },
    { table: 'sidebar_modules', name: 'idx_sidebar_active', columns: 'is_active' },
    { table: 'sidebar_modules', name: 'idx_sidebar_category', columns: 'module_category' },

    // ========================
    // STAFF
    // ========================
    { table: 'staff_master', name: 'idx_staff_staffid', columns: 'staff_id' },
    { table: 'staff_master', name: 'idx_staff_status', columns: 'status' },
];

async function createIndexes() {
    console.log('='.repeat(60));
    console.log('HMS Production Index Migration');
    console.log('='.repeat(60));

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const idx of indexes) {
        try {
            // Check if table exists first
            const [tables] = await db.execute(`SHOW TABLES LIKE '${idx.table}'`);
            if (tables.length === 0) {
                console.log(`  SKIP  Table '${idx.table}' does not exist`);
                skipped++;
                continue;
            }

            // Check if index already exists
            const [existing] = await db.execute(`SHOW INDEX FROM ${idx.table} WHERE Key_name = ?`, [idx.name]);
            if (existing.length > 0) {
                skipped++;
                continue;
            }

            // Create the index
            await db.execute(`CREATE INDEX ${idx.name} ON ${idx.table} (${idx.columns})`);
            console.log(`  ✓ CREATED  ${idx.name} ON ${idx.table}(${idx.columns})`);
            created++;
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                skipped++;
            } else {
                console.error(`  ✗ ERROR  ${idx.name} on ${idx.table}: ${err.message}`);
                errors++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`DONE: ${created} created, ${skipped} skipped, ${errors} errors`);
    console.log('='.repeat(60));

    process.exit(0);
}

createIndexes();
