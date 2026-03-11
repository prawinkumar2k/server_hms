const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        // Find users with missing or invalid passwords
        const [users] = await db.execute('SELECT id, username, full_name, role, password, status FROM users');

        console.log('Checking all users for password issues:\n');

        let usersWithIssues = [];

        for (const u of users) {
            const hasPassword = !!u.password && u.password.length > 0;
            const isValidBcrypt = u.password && u.password.startsWith('$2');

            console.log(`[${u.id}] ${u.username} (${u.role})`);
            console.log(`    Password exists: ${hasPassword}`);
            console.log(`    Valid bcrypt hash: ${isValidBcrypt}`);
            console.log(`    Status: ${u.status}`);

            if (!hasPassword || !isValidBcrypt) {
                usersWithIssues.push(u);
            }
            console.log('');
        }

        if (usersWithIssues.length > 0) {
            console.log('========================================');
            console.log('USERS WITH PASSWORD ISSUES:');
            usersWithIssues.forEach(u => console.log(`  - ${u.username} (${u.role})`));
            console.log('\nThese users cannot login. You need to set their passwords.');
            console.log('========================================');
        } else {
            console.log('All users have valid password hashes.');
        }

        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        console.log('Stack:', e.stack);
        process.exit(1);
    }
})();
