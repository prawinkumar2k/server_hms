const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        // Get a user to test with
        const [users] = await db.execute('SELECT id, username, password, role FROM users LIMIT 3');

        console.log('Testing login for existing users:\n');

        for (const u of users) {
            console.log(`User: ${u.username}`);
            console.log(`  Stored hash length: ${u.password ? u.password.length : 0}`);
            console.log(`  Hash preview: ${u.password ? u.password.substring(0, 20) + '...' : 'NULL'}`);

            // Test with a common password
            const testPasswords = ['password', '123456', 'admin', 'test', u.username];

            for (const pwd of testPasswords) {
                const match = await bcrypt.compare(pwd, u.password);
                if (match) {
                    console.log(`  ✓ Password match found: "${pwd}"`);
                    break;
                }
            }
            console.log('');
        }

        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        console.log('Stack:', e.stack);
        process.exit(1);
    }
})();
