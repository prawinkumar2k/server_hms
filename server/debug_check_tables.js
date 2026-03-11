const db = require('./src/config/db');

(async () => {
    try {
        const tablesToCheck = ['opd_visits', 'appointments', 'ipd_admissions', 'invoices'];
        console.log("Checking tables...");

        for (const tbl of tablesToCheck) {
            const [rows] = await db.execute(`SHOW TABLES LIKE '${tbl}'`);
            if (rows.length > 0) {
                console.log(`[PASS] Table '${tbl}' exists.`);
            } else {
                console.log(`[FAIL] Table '${tbl}' DOES NOT EXIST.`);
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
