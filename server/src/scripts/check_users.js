const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function checkUsers() {
    try {
        const [users] = await db.execute(
            'SELECT id, username, role, LENGTH(password) as pwd_len, SUBSTRING(password, 1, 7) as pwd_start FROM users ORDER BY id DESC LIMIT 15'
        );

        let output = '\n=== USERS IN DATABASE ===\n\n';
        users.forEach(u => {
            output += `ID: ${u.id} | User: ${u.username.padEnd(15)} | Role: ${u.role.padEnd(15)} | PwdLen: ${u.pwd_len} | PwdStart: ${u.pwd_start}\n`;
        });

        // Check if passwords are hashed (bcrypt hashes start with $2b$ or $2a$ and are 60 chars)
        const unhashed = users.filter(u => u.pwd_len !== 60 || !u.pwd_start.startsWith('$2'));
        if (unhashed.length > 0) {
            output += '\n WARNING: The following users have UNHASHED passwords:\n';
            unhashed.forEach(u => output += `   - ${u.username} (len: ${u.pwd_len}, start: ${u.pwd_start})\n`);
        } else {
            output += '\n All passwords appear to be properly hashed.\n';
        }

        // Write to file
        fs.writeFileSync(path.join(__dirname, 'users_check.txt'), output);
        console.log('Results written to src/scripts/users_check.txt');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
