const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createElan = async () => {
    try {
        const username = 'elan';
        const password = 'password123'; // Default strict password
        const role = 'Doctor';
        const name = 'Dr. Elan';

        // Check if exists
        const [existing] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            console.log(`User ${username} already exists. Updating password...`);
            const hash = await bcrypt.hash(password, 10);
            await db.execute('UPDATE users SET password = ?, role = ?, full_name = ?, status = ? WHERE username = ?',
                [hash, role, name, 'Active', username]);
            console.log('User updated.');
        } else {
            console.log(`Creating user ${username}...`);
            const hash = await bcrypt.hash(password, 10);
            await db.execute('INSERT INTO users (username, password, role, full_name, status) VALUES (?, ?, ?, ?, ?)',
                [username, hash, role, name, 'Active']);
            console.log('User created.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Failed to create user:', err);
        process.exit(1);
    }
};

createElan();
