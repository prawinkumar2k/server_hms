const db = require('../config/db');

async function createTables() {
    try {
        console.log('Creating appointments tables...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100),
                doctor_name VARCHAR(100),
                date DATE,
                time TIME,
                status VARCHAR(50) DEFAULT 'Scheduled',
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS appointment_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                appointment_id INT,
                patient_name VARCHAR(100),
                amount DECIMAL(10,2),
                payment_method VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Paid',
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
            )
        `);

        console.log('Tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createTables();
