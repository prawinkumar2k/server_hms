const dotenv = require('dotenv');
const db = require('./src/config/db');

dotenv.config();

(async () => {
    try {
        console.log('--- TABLE: custransaction ---');
        const [transCols] = await db.execute('SHOW COLUMNS FROM custransaction');
        console.log(transCols.map(c => c.Field).join(', '));

        console.log('\n--- TABLE: product ---');
        const [prodCols] = await db.execute('SHOW COLUMNS FROM product');
        console.log(prodCols.map(c => c.Field).join(', '));

        console.log('\n--- SAMPLE DATA: custransaction ---');
        const [rows] = await db.execute('SELECT * FROM custransaction LIMIT 5');
        console.log(JSON.stringify(rows, null, 2));

        process.exit();
    } catch (e) {
        console.error('ERROR:', e.message);
        process.exit(1);
    }
})();
