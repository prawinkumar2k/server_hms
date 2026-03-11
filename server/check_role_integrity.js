const dotenv = require('dotenv');
const path = require('path');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const db = require('./src/config/db');

async function runChecks() {
    try {
        const [users] = await db.execute('SELECT username, role FROM users');
        const roles = users.map(u => u.role);

        console.log('Unique Roles in DB:', [...new Set(roles)]);

        const expectedRoles = ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist', 'LAB_MASTER', 'PHARMA_MASTER', 'HR'];

        console.log('\nChecking for case mismatches:');
        users.forEach(u => {
            if (!expectedRoles.includes(u.role)) {
                console.log(`⚠️  User ${u.username} has unknown/mismatched role: '${u.role}'`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Critical Error:', error);
        process.exit(1);
    }
}

runChecks();
