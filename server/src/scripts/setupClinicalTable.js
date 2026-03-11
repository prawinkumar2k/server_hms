const db = require('../config/db');

async function setup() {
    try {
        console.log('Setting up medical database...');

        // Create Clinical Notes Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS clinical_notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id VARCHAR(255) NOT NULL,
                doctor_id VARCHAR(255) DEFAULT 'Unknown',
                visit_date DATE NOT NULL,
                symptoms TEXT,
                history_illness TEXT,
                physical_examination TEXT,
                diagnosis TEXT,
                treatment_plan TEXT,
                follow_up TEXT,
                bp VARCHAR(50),
                heart_rate VARCHAR(50),
                temperature VARCHAR(50),
                spo2 VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('clinical_notes table created/checked.');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

setup();
