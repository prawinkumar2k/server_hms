const dotenv = require('dotenv');
const path = require('path');

// Fix path to .env
dotenv.config({ path: path.join(__dirname, 'server', '.env') });
const db = require('./server/src/config/db');

(async () => {
    try {
        console.log('Running patch to set BillType="Pharma" for existing billdetails records...');
        const [result] = await db.execute("UPDATE billdetails SET BillType = 'Pharma' WHERE BillType IS NULL OR BillType = ''");
        console.log(`Updated ${result.affectedRows} rows.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
