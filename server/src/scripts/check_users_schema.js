const db = require('../config/db');

async function checkUserSchema() {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM users");
        console.log(columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUserSchema();
