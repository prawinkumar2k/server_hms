const db = require('../config/db');

async function createMissingTables() {
    console.log('Creating missing tables...');

    // 1. audit_logs
    await db.execute(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action_type VARCHAR(50) NOT NULL,
            entity_type VARCHAR(50) NOT NULL,
            entity_id VARCHAR(50),
            performed_by INT,
            previous_status VARCHAR(50),
            new_status VARCHAR(50),
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_audit_timestamp (timestamp),
            INDEX idx_audit_entity (entity_type),
            INDEX idx_audit_user (performed_by)
        )
    `);
    console.log('  ✓ audit_logs');

    // 2. Verify other critical tables
    const tables = [
        'users', 'roles', 'permissions', 'role_permissions',
        'sidebar_modules', 'staff_master', 'doctor_profiles',
        'appointments', 'opd_visits', 'ipd_admissions', 'beds',
        'invoices', 'hospital_bills', 'clinical_notes',
        'prescriptions', 'product', 'billdetails', 'productreturn',
        'employees', 'salary_structures', 'attendance_logs', 'shifts', 'payslips',
        'labtest', 'doctordetails', 'testmaster',
        'lab_requests', 'lab_request_items', 'lab_bills',
        'suppliers', 'stock_orders', 'log_details', 'daily_op_records'
    ];

    for (const table of tables) {
        try {
            const [rows] = await db.execute(`SHOW TABLES LIKE '${table}'`);
            console.log(rows.length > 0 ? `  ✓ ${table}` : `  ✗ ${table} MISSING`);
        } catch (e) {
            console.log(`  ✗ ${table} ERROR: ${e.message}`);
        }
    }

    await db.end();
    process.exit(0);
}

createMissingTables().catch(e => { console.error(e); process.exit(1); });
