const db = require('./src/config/db');

async function migrate() {
    try {
        console.log("Adding patient_id column to ipd_admissions...");
        // Check if column exists
        const [cols] = await db.execute("SHOW COLUMNS FROM ipd_admissions LIKE 'patient_id'");
        if (cols.length === 0) {
            await db.execute("ALTER TABLE ipd_admissions ADD COLUMN patient_id VARCHAR(50) AFTER id");
            console.log("Column added.");
        } else {
            console.log("Column already exists.");
        }
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

migrate();
