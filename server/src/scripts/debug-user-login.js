const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function debugUser() {
    try {
        // Find user by name or email containing 'elan'
        const [rows] = await db.execute("SELECT * FROM users WHERE name LIKE '%elan%' OR email LIKE '%elan%'");
        console.log('Found users:', rows.length);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('User:', user.email, user.role);
            console.log('Stored Hash:', user.password);

            // Test '1234'
            const match1234 = await bcrypt.compare('1234', user.password);
            console.log('Is password "1234"?', match1234);

            // Test 'admin'
            const matchAdmin = await bcrypt.compare('admin', user.password);
            console.log('Is password "admin"?', matchAdmin);

            // Reset to '1234' just in case?
            // const newHash = await bcrypt.hash('1234', 10);
            // await db.execute('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id]);
            // console.log('Reset password to 1234');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugUser();
