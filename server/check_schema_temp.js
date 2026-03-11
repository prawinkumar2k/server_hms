require('dotenv').config();
const db = require('./src/config/db');

async function check() {
    try {
        const [cols] = await db.execute("DESCRIBE dietary_orders");
        const lines = cols.map(c => `${c.Field} | ${c.Type} | ${c.Key || '-'}`);
        require('fs').writeFileSync('schema_output.txt', lines.join('\n'));
        console.log('Written to schema_output.txt');

        const [tables] = await db.execute("SHOW TABLES LIKE 'food_menu'");
        console.log('food_menu exists:', tables.length > 0);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
check();
