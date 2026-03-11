const dotenv = require('dotenv');
const path = require('path');
const db = require('./src/config/db');

dotenv.config();

async function checkUsers() {
    try {
        const [users] = await db.execute('SELECT id, username, role, status FROM users');
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUsers();
