const db = require('../config/db');

async function checkUsers() {
    try {
        const [rows] = await db.execute('SELECT id, name, email, role, password FROM users');
        console.log('Users in DB:', rows.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            pw_start: u.password ? u.password.substring(0, 10) + '...' : 'NULL'
        })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
