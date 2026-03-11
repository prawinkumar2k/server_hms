const db = require('./src/config/db');

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        console.log('Users Table Schema:');
        console.log(rows);

        const [users] = await db.execute('SELECT id, email, role, LENGTH(password) as pass_len FROM users LIMIT 5');
        console.log('Sample Users:', users);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSchema();
