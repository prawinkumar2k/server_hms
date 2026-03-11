const db = require('./src/config/db');

async function checkSchema() {
    try {
        const [usersColumns] = await db.execute('DESCRIBE users');
        console.log('USERS TABLE SCHEMA:');
        console.table(usersColumns);

        const [tables] = await db.execute('SHOW TABLES');
        console.log('TABLES:', tables.map(t => Object.values(t)[0]));

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkSchema();
