const dotenv = require('dotenv');
const path = require('path');

// Explicitly load server/.env
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const db = require('./server/src/config/db');

(async () => {
    try {
        console.log('--- custransaction Schema ---');
        const [cols] = await db.execute('DESCRIBE custransaction');
        console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        console.log('\n--- Recent custransaction Data ---');
        const [rows] = await db.execute('SELECT * FROM custransaction ORDER BY CAST(SNo AS UNSIGNED) DESC LIMIT 3');
        console.log(rows);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
