const db = require('../config/db');

async function checkId7() {
    try {
        console.log('CHECKING ID 7');
        const [rows] = await db.execute(`SELECT * FROM users WHERE id = 7`);
        console.log('User 7:', rows);

        const [doc] = await db.execute(`SELECT * FROM doctor_profiles WHERE user_id = 7`);
        console.log('Profile for User 7:', doc);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkId7();
