const db = require('./server/src/config/db');

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        console.log('Users Table Schema:');
        console.log(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSchema();
