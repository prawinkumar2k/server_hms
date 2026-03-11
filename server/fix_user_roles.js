const dotenv = require('dotenv');
const path = require('path');
const db = require('./src/config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const validRoles = {
    'admin': 'Admin',
    'doctor': 'Doctor',
    'receptionist': 'Receptionist',
    'lab technician': 'Lab Technician',
    'pharmacist': 'Pharmacist',
    'lab_master': 'LAB_MASTER',
    'pharma_master': 'PHARMA_MASTER',
    'pharma': 'Pharmacist',
    'hr': 'HR'
};

/* 
    Mapping logic:
    - Lowercase the DB role.
    - Match with keys above.
    - Update to value.
*/

async function fixRoles() {
    try {
        console.log('--- Fixing User Roles ---');
        const [users] = await db.execute('SELECT id, username, role FROM users');

        for (const user of users) {
            const currentRole = user.role;
            const normalizedKey = currentRole.toLowerCase();

            if (validRoles[normalizedKey]) {
                const correctRole = validRoles[normalizedKey];
                if (currentRole !== correctRole) {
                    console.log(`Updating ${user.username}: '${currentRole}' -> '${correctRole}'`);
                    await db.execute('UPDATE users SET role = ? WHERE id = ?', [correctRole, user.id]);
                }
            } else {
                console.warn(`⚠️  Unknown role for ${user.username}: '${currentRole}'`);
            }
        }
        console.log('--- Role Fix Complete ---');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixRoles();
