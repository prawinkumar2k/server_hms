const dotenv = require('dotenv');
const path = require('path');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const db = require('./src/config/db');

async function runChecks() {
    try {
        console.log('Testing Database Connection...');

        console.log('\n--- User Roles ---');
        const [users] = await db.execute('SELECT id, username, role, status FROM users');
        users.forEach(u => {
            console.log(`User: ${u.username.padEnd(15)} | Role: ${u.role.padEnd(15)} | Status: ${u.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Critical Error:', error);
        process.exit(1);
    }
}

runChecks();
