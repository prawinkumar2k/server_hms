const dotenv = require('dotenv');
const db = require('./src/config/db');
const fs = require('fs');

dotenv.config();

(async () => {
    try {
        const [cols] = await db.execute('SHOW COLUMNS FROM custransaction');
        const output = cols.map(c => `${c.Field} (${c.Type})`).join('\n');
        fs.writeFileSync('schema_out.txt', output);
        process.exit();
    } catch (e) {
        fs.writeFileSync('schema_out.txt', e.message);
        process.exit(1);
    }
})();
