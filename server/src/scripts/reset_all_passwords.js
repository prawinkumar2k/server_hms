/**
 * Reset All User Passwords & Generate Credentials Report
 * This script resets all users to default passwords for testing purposes
 */

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Default password mappings by role
const defaultPasswords = {
    'Admin': 'admin123',
    'Doctor': 'doctor123',
    'Receptionist': 'reception123',
    'Lab Technician': 'lab123',
    'Pharmacist': 'pharma123',
    'LAB_MASTER': 'labmaster123',
    'PHARMA_MASTER': 'pharmamaster123',
    'HR': 'hr123'
};

async function resetAllPasswords() {
    try {
        // Get all users
        const [users] = await db.execute(
            'SELECT id, username, full_name, role, status FROM users ORDER BY id'
        );

        console.log(`Found ${users.length} users. Resetting passwords...\n`);

        let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                      HMS LOGIN CREDENTIALS                                  ║
║                      Generated: ${new Date().toISOString()}                 ║
╠════════════════════════════════════════════════════════════════════════════╣
║  ID  │  USERNAME              │  ROLE              │  PASSWORD             ║
╠════════════════════════════════════════════════════════════════════════════╣
`;

        for (const user of users) {
            // Determine password based on role
            const password = defaultPasswords[user.role] || 'password123';

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update in database
            await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

            // Add to report
            const idStr = String(user.id).padEnd(4);
            const usernameStr = user.username.padEnd(22);
            const roleStr = user.role.padEnd(18);
            const passStr = password.padEnd(21);

            report += `║  ${idStr}│  ${usernameStr}│  ${roleStr}│  ${passStr}║\n`;

            console.log(`✓ Reset: ${user.username} (${user.role}) -> ${password}`);
        }

        report += `╚════════════════════════════════════════════════════════════════════════════╝

ROLE-BASED QUICK REFERENCE:
═══════════════════════════
  Admin           →  admin123
  Doctor          →  doctor123
  Receptionist    →  reception123
  Lab Technician  →  lab123
  Pharmacist      →  pharma123
  LAB_MASTER      →  labmaster123
  PHARMA_MASTER   →  pharmamaster123
  HR              →  hr123

Note: All passwords have been reset. Use these credentials to login.
`;

        // Save report to file
        const reportPath = path.join(__dirname, 'credentials.txt');
        fs.writeFileSync(reportPath, report);

        console.log(`\n✅ All passwords reset successfully!`);
        console.log(`📄 Credentials saved to: ${reportPath}`);
        console.log(report);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

resetAllPasswords();
