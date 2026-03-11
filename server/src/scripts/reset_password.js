/**
 * Reset User Password Script
 * Usage: node reset_password.js <username> <new_password>
 */

const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function resetPassword(username, newPassword) {
    try {
        if (!username || !newPassword) {
            console.log('Usage: node reset_password.js <username> <new_password>');
            console.log('Example: node reset_password.js hr password123');
            process.exit(1);
        }

        // Check user exists
        const [users] = await db.execute('SELECT id, username, full_name, role FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            console.log(`ERROR: User "${username}" not found.`);
            console.log('\nAvailable users:');
            const [allUsers] = await db.execute('SELECT username, role FROM users ORDER BY id');
            allUsers.forEach(u => console.log(`  - ${u.username} (${u.role})`));
            process.exit(1);
        }

        const user = users[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

        console.log('\n=== PASSWORD RESET SUCCESS ===');
        console.log(`User: ${user.username}`);
        console.log(`Full Name: ${user.full_name}`);
        console.log(`Role: ${user.role}`);
        console.log(`New Password: ${newPassword}`);
        console.log('\nYou can now login with these credentials.');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

const username = process.argv[2];
const newPassword = process.argv[3];

resetPassword(username, newPassword);
