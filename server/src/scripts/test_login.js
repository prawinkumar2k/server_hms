const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function testLogin(username, password) {
    try {
        let output = `\n=== LOGIN TEST ===\nUsername: ${username}\nPassword: ${password}\n\n`;

        // 1. Find user
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            output += `RESULT: FAILED - User "${username}" not found in database\n`;
            output += `\nAvailable usernames:\n`;
            const [allUsers] = await db.execute('SELECT username FROM users');
            allUsers.forEach(u => output += `  - ${u.username}\n`);
        } else {
            const user = users[0];
            output += `User found: ID=${user.id}, Role=${user.role}, Status=${user.status}\n`;
            output += `Stored hash (first 20 chars): ${user.password.substring(0, 20)}...\n`;
            output += `Hash length: ${user.password.length}\n\n`;

            // 2. Test password
            const isMatch = await bcrypt.compare(password, user.password);
            output += `Password match: ${isMatch ? 'YES' : 'NO'}\n`;

            if (isMatch) {
                if (user.status !== 'Active') {
                    output += `RESULT: FAILED - Account status is "${user.status}" (not Active)\n`;
                } else {
                    output += `RESULT: SUCCESS - Login would succeed!\n`;
                }
            } else {
                output += `RESULT: FAILED - Invalid password\n`;

                // Generate a test hash to verify bcrypt is working
                const testHash = await bcrypt.hash(password, 10);
                output += `\nDebug: Fresh hash of "${password}": ${testHash.substring(0, 20)}...\n`;
            }
        }

        fs.writeFileSync(path.join(__dirname, 'login_test.txt'), output);
        console.log('Results written to src/scripts/login_test.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

// Test with the credentials you're trying
// Change these to match what you're entering in the login form
const testUsername = process.argv[2] || 'hr';
const testPassword = process.argv[3] || 'password123';

testLogin(testUsername, testPassword);
