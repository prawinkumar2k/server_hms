const db = require('../config/db');

async function createOPDTables() {
    try {
        console.log('Creating OPD tables...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS opd_visits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100),
                age INT,
                gender VARCHAR(20),
                contact VARCHAR(20),
                doctor_name VARCHAR(100),
                visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                symptoms TEXT,
                diagnosis TEXT,
                status VARCHAR(50) DEFAULT 'Checked In' -- Checked In, Completed
            )
        `);

        console.log('OPD Tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createOPDTables();
