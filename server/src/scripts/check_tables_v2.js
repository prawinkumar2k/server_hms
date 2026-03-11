const db = require('../config/db');

async function checkTables() {
    try {
        const [tables] = await db.execute('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));

        try {
            const [roles] = await db.execute('SELECT * FROM roles LIMIT 1');
            console.log('Roles table:', roles);
        } catch (e) { console.log('Roles table error:', e.message); }

        try {
            const [users_roles] = await db.execute('SELECT * FROM users_roles LIMIT 1');
            console.log('users_roles table:', users_roles);
        } catch (e) { console.log('users_roles table error:', e.message); }

        try {
            const [users] = await db.execute('SELECT * FROM users LIMIT 1');
            console.log('Users table columns:', Object.keys(users[0] || {}).join(', '));
            if (users.length > 0) {
                console.log('Sample User:', users[0]);
            }
        } catch (e) { console.log('Users table error:', e.message); }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkTables();
