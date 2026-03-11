const dotenv = require('dotenv');
const db = require('./src/config/db');
const fs = require('fs');

dotenv.config();

(async () => {
    try {
        const [transCols] = await db.execute('SHOW COLUMNS FROM custransaction');
        const [billCols] = await db.execute('SHOW COLUMNS FROM billdetails');

        const output = `
--- custransaction COLUMNS ---
${transCols.map(c => c.Field).join(', ')}

--- billdetails COLUMNS ---
${billCols.map(c => c.Field).join(', ')}
`;
        fs.writeFileSync('full_schema_check.txt', output);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
