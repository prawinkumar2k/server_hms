const db = require('../config/db');

async function migrateStatus() {
    try {
        console.log('Checking users table for status column...');
        const [rows] = await db.execute('SHOW COLUMNS FROM users LIKE "status"');

        if (rows.length === 0) {
            console.log('Adding status column...');
            await db.execute('ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT "Active"');
            console.log('Added status column.');
        } else {
            console.log('Status column exists.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrateStatus();
