const db = require('../config/db');

const run = async () => {
    try {
        console.log('--- COLUMNS users ---');
        const [columns] = await db.execute('SHOW COLUMNS FROM users');
        columns.forEach(c => console.log(`${c.Field} (${c.Type})`));

        console.log('\n--- DATA users ---');
        const [rows] = await db.execute('SELECT * FROM users LIMIT 1');
        console.log(JSON.stringify(rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
