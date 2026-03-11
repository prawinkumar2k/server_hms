const db = require('../config/db');

async function debugHR() {
    try {
        console.log('Checking HR User...');
        const [users] = await db.execute("SELECT id, username, role, status FROM users WHERE username = 'hr'");
        console.log('HR User:', users);

        if (users.length > 0 && users[0].status !== 'Active') {
            console.log('Fixing HR User status...');
            await db.execute("UPDATE users SET status = 'Active' WHERE username = 'hr'");
            console.log('Status set to Active.');
        } else if (users.length === 0) {
            console.log('HR User NOT found!');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

debugHR();
