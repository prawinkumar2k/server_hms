const db = require('../config/db');

async function fixSchema() {
    try {
        console.log('--- FIXING SCHEMA ---');
        const connection = await db.getConnection();

        try {
            // Check if staff_id column exists
            const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'staff_id'");
            if (columns.length === 0) {
                console.log('Adding staff_id column...');
                await connection.execute('ALTER TABLE users ADD COLUMN staff_id VARCHAR(50) NULL');
                console.log('Adding FK constraint for staff_id...');
                // Ensure staff_master exists first (migration should have created it)
                // If checking constraints is tricky, proceed with caution.
                await connection.execute('ALTER TABLE users ADD CONSTRAINT fk_user_staff FOREIGN KEY (staff_id) REFERENCES staff_master(staff_id) ON DELETE SET NULL');
            } else {
                console.log('staff_id column already exists.');
            }

            // Check staff_name
            const [snCols] = await connection.execute("SHOW COLUMNS FROM users LIKE 'staff_name'");
            if (snCols.length === 0) {
                console.log('Adding staff_name column...');
                await connection.execute('ALTER TABLE users ADD COLUMN staff_name VARCHAR(100) NULL AFTER staff_id');
            }

            // Check module_access
            const [maCols] = await connection.execute("SHOW COLUMNS FROM users LIKE 'module_access'");
            if (maCols.length === 0) {
                console.log('Adding module_access column...');
                await connection.execute('ALTER TABLE users ADD COLUMN module_access TEXT NULL');
            }

            console.log('Schema update complete.');

        } catch (err) {
            console.error('Error updating schema:', err);
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        process.exit();
    }
}

fixSchema();
