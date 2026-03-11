const db = require('../config/db');

async function debugUser() {
    try {
        console.log('Checking user: pharma1234');
        const [users] = await db.execute('SELECT id, username, role, status FROM users WHERE username = ?', ['pharma1234']);
        console.log('User Result:', users);

        console.log('Checking user: Pharma');
        const [users2] = await db.execute('SELECT id, username, role, status FROM users WHERE username = ?', ['Pharma']);
        console.log('User Result:', users2);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

debugUser();
