const db = require('../config/db');

async function check() {
    try {
        const [rows] = await db.execute("SHOW COLUMNS FROM users WHERE Field = 'role'");
        console.log("Role Column:", rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
