const db = require('../config/db');

async function migrate() {
    try {
        console.log('Adding status column to copy_of_patientdetaiils...');

        // Check if column exists, if not add it
        // MySQL 8.0 support IF NOT EXISTS in ADD COLUMN, but older versions don't.
        // We'll try to add it and catch duplicate column error safely.

        try {
            await db.execute(`
                ALTER TABLE copy_of_patientdetaiils
                ADD COLUMN status VARCHAR(50) DEFAULT 'Waiting'
            `);
            console.log('Column `status` added successfully.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column `status` already exists.');
            } else {
                throw err;
            }
        }

        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
