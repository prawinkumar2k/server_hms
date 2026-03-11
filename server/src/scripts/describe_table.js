const db = require('../config/db');

async function describeUsers() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        rows.forEach(r => console.log(r.Field));
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

describeUsers();
