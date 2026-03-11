const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        console.log('Testing HR Login...');
        const username = 'hr';
        const password = 'password123';

        // 1. Fetch User
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            console.log('FAIL: User not found');
            process.exit(0);
        }
        const user = users[0];
        console.log('User found:', user.username, 'Role:', user.role);

        // 2. Compare Password
        console.log('Stored Hash:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('SUCCESS: Password matches!');
        } else {
            console.log('FAIL: Password mismatch');
            // Debug: hash the password fresh right here and see
            const newHash = await bcrypt.hash(password, 10);
            console.log('Expected Hash format like:', newHash);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

testLogin();
