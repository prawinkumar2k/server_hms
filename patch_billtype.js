const dotenv = require('dotenv');
const db = require('./server/src/config/db');

dotenv.config({ path: './server/.env' });

(async () => {
    try {
        console.log('Running patch to set BillType="Pharma" for existing billdetails records...');
        // Only update rows that look like pharmacy bills (optional heuristic or just all for now since this is a dev env?)
        // Let's being safe: update rows where BillType is NULL.
        const [result] = await db.execute("UPDATE billdetails SET BillType = 'Pharma' WHERE BillType IS NULL OR BillType = ''");
        console.log(`Updated ${result.affectedRows} rows.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
