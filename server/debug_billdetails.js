const dotenv = require('dotenv');
const db = require('./src/config/db');
const fs = require('fs');

dotenv.config();

(async () => {
    try {
        const [recent] = await db.execute('SELECT * FROM billdetails ORDER BY CAST(RNo AS UNSIGNED) DESC LIMIT 5');
        const [testEntry] = await db.execute("SELECT * FROM billdetails WHERE TestID IS NOT NULL AND TestID != 'nan'");

        const output = {
            recent: recent,
            test_entries: testEntry
        };

        fs.writeFileSync('billdetails_dump.txt', JSON.stringify(output, null, 2));
        process.exit();
    } catch (e) {
        fs.writeFileSync('billdetails_dump.txt', e.message);
        process.exit(1);
    }
})();
