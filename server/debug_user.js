const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        // Check users table structure
        const [cols] = await db.execute('DESCRIBE users');
        console.log('Users table columns:');
        cols.forEach(c => console.log(`  - ${c.Field}: ${c.Type} ${c.Null === 'YES' ? '(nullable)' : '(required)'}`));

        // Check existing users and their password fields
        const [users] = await db.execute('SELECT id, username, full_name, role, password, status FROM users LIMIT 5');
        console.log('\nExisting users:');
        users.forEach(u => {
            console.log(`  ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`);
            console.log(`    Password exists: ${!!u.password}, Length: ${u.password ? u.password.length : 0}`);
            console.log(`    Password starts with $2: ${u.password ? u.password.startsWith('$2') : false}`);
        });

        // Test password hashing
        const testPassword = 'test123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log('\nTest password hash:', hashedPassword);
        console.log('Hash length:', hashedPassword.length);

        // Verify the password column can hold bcrypt hashes (needs 60 chars)
        const passwordCol = cols.find(c => c.Field === 'password');
        console.log('\nPassword column type:', passwordCol ? passwordCol.Type : 'NOT FOUND!');

        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        console.log('Stack:', e.stack);
        process.exit(1);
    }
})();
