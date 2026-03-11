const db = require('../config/db');

async function migrate() {
    try {
        console.log('Checking productindent table for status column...');

        // check if column exists
        const [columns] = await db.execute("SHOW COLUMNS FROM productindent LIKE 'status'");

        if (columns.length === 0) {
            console.log('Adding status column...');
            await db.execute("ALTER TABLE productindent ADD COLUMN status VARCHAR(20) DEFAULT 'Pending'");
            console.log('Status column added successfully.');
        } else {
            console.log('Status column already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
