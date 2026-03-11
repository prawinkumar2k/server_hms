const db = require('./src/config/db');

async function createHospitalBillsTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS hospital_bills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                bill_no VARCHAR(20) NOT NULL,
                admission_id INT NOT NULL,
                patient_id VARCHAR(50),
                patient_name VARCHAR(100),
                admission_date DATETIME,
                discharge_date DATETIME,
                total_days INT DEFAULT 1,
                bed_charge_per_day DECIMAL(10,2),
                room_total DECIMAL(10,2),
                doctor_fees DECIMAL(10,2) DEFAULT 0,
                medicine_total DECIMAL(10,2) DEFAULT 0,
                lab_total DECIMAL(10,2) DEFAULT 0,
                grand_total DECIMAL(10,2),
                status VARCHAR(20) DEFAULT 'PAID',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.execute(query);
        console.log("hospital_bills table created.");
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

createHospitalBillsTable();
