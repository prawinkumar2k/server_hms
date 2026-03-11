const db = require('../config/db');

async function fixSchema() {
    try {
        console.log('Fixing IPD Schema...');
        const conn = await db.getConnection();

        // 1. Add patient_id to ipd_admissions if not exists
        try {
            const [cols] = await conn.execute("SHOW COLUMNS FROM ipd_admissions LIKE 'patient_id'");
            if (cols.length === 0) {
                console.log('Adding patient_id to ipd_admissions...');
                await conn.execute('ALTER TABLE ipd_admissions ADD COLUMN patient_id VARCHAR(50) AFTER id');
            } else {
                console.log('patient_id already exists in ipd_admissions.');
            }
        } catch (e) {
            console.log('Error checking/adding column (Table might not exist?):', e.message);
        }

        // 2. Create hospital_bills table
        console.log('Creating hospital_bills table...');
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS hospital_bills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                bill_no VARCHAR(50),
                admission_id INT,
                patient_id VARCHAR(50),
                patient_name VARCHAR(100),
                admission_date DATETIME,
                discharge_date DATETIME,
                total_days INT,
                bed_charge_per_day DECIMAL(10,2),
                room_total DECIMAL(10,2),
                grand_total DECIMAL(10,2),
                status VARCHAR(20) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Schema fixed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error fixing schema:', err);
        process.exit(1);
    }
}

fixSchema();
