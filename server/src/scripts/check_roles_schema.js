const db = require('../config/db');

async function checkSchema() {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM roles");
        console.log(columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSchema();
