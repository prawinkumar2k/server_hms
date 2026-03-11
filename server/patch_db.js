// This script updates existing billdetails rows to have BillType = 'Pharma'
// Using vanilla mysql2 directly since we are in server dir
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        console.log('Running patch...');
        const [result] = await pool.execute("UPDATE billdetails SET BillType = 'Pharma' WHERE BillType IS NULL OR BillType = ''");
        console.log(`Updated ${result.affectedRows} rows.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
