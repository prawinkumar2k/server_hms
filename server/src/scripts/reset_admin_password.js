
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
    try {
        const username = 'admin';
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );

        if (result.affectedRows > 0) {
            console.log(`Password for user '${username}' has been reset to '${newPassword}'`);
        } else {
            console.log(`User '${username}' not found. Creating it...`);
            // Optionally create the user if it doesn't exist
            await db.execute(
                'INSERT INTO users (username, password, role, status, full_name) VALUES (?, ?, ?, ?, ?)',
                [username, hashedPassword, 'Admin', 'Active', 'System Administrator']
            );
            console.log(`User '${username}' created with password '${newPassword}'`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetAdminPassword();
