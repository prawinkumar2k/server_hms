const db = require('./src/config/db');

async function test() {
    try {
        // Check all tables
        const [tables] = await db.execute("SHOW TABLES");
        console.log("All tables:", tables);

        // Check for patient table specifically
        const [patientTables] = await db.execute("SHOW TABLES LIKE '%patient%'");
        console.log("\nPatient tables:", patientTables);

        // Try the actual query
        const [rows] = await db.execute('SELECT * FROM copy_of_patientdetaiils LIMIT 1');
        console.log("\nSample patient:", rows);
    } catch (err) {
        console.error("ERROR:", err.message);
    }
    process.exit();
}

test();
