const dotenv = require('dotenv');
const db = require('./src/config/db');

dotenv.config();

async function checkSpecificUser() {
    try {
        const [users] = await db.execute("SELECT id, username, role, status FROM users WHERE username LIKE '%harm%' OR role LIKE '%harm%'");
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSpecificUser();
