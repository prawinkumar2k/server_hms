const dotenv = require('dotenv');
const db = require('./src/config/db');

dotenv.config();

(async () => {
    try {
        console.log('--- custransaction Schema ---');
        const [cols] = await db.execute('DESCRIBE custransaction');
        console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        console.log('\n--- Recent 10 custransaction Data ---');
        const [rows] = await db.execute('SELECT * FROM custransaction ORDER BY CAST(BillNo AS UNSIGNED) DESC LIMIT 10');
        console.log(JSON.stringify(rows, null, 2));

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
