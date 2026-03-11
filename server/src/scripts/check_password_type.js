const db = require('../config/db');

async function checkPasswordColumn() {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM users WHERE Field = 'password'");
        console.log(columns);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkPasswordColumn();
