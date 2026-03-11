const db = require('../../config/db');

// Ensure table exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS daily_op_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    age_gender VARCHAR(50),
    contact VARCHAR(20),
    visit_type VARCHAR(50) DEFAULT 'Consultation',
    op_fees DECIMAL(10, 2) DEFAULT 0.00,
    total_fees DECIMAL(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'Paid',
    visit_date DATE NOT NULL,
    source_type VARCHAR(50) DEFAULT 'Manual',
    source_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Initialize table
(async () => {
    try {
        await db.execute(createTableQuery);
        console.log("Daily OP Records table initialized.");
    } catch (err) {
        console.error("Error initializing Daily OP Records table:", err);
    }
})();

exports.addRecord = async (data) => {
    const { patient_name, age_gender, contact, visit_type, op_fees, total_fees, payment_status, visit_date, source_type, source_id } = data;

    const query = `
    INSERT INTO daily_op_records 
    (patient_name, age_gender, contact, visit_type, op_fees, total_fees, payment_status, visit_date, source_type, source_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
        patient_name,
        age_gender || 'N/A',
        contact || 'N/A',
        visit_type || 'Consultation',
        op_fees || 0,
        total_fees || 0,
        payment_status || 'Paid',
        visit_date || new Date(),
        source_type || 'Manual',
        source_id || null
    ]);

    return result.insertId;
};

exports.getRecordsByDate = async (date) => {
    const query = `SELECT * FROM daily_op_records WHERE visit_date = ? ORDER BY id ASC`;
    const [rows] = await db.execute(query, [date]);
    return rows;
};
