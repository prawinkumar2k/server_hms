const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function resetHRPassword() {
    try {
        console.log('Resetting HR Password...');
        const password = await bcrypt.hash('password123', 10);
        await db.execute("UPDATE users SET password = ? WHERE username = 'hr'", [password]);
        console.log('Password reset to: password123');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

resetHRPassword();
