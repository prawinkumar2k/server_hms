const db = require('./src/config/db');

async function listUsers() {
    try {
        const [users] = await db.execute('SELECT id, username, full_name, role, status FROM users');
        console.log('Available users:');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

listUsers();
