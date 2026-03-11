const db = require('./src/config/db');

async function checkSchema() {
    try {
        console.log('--- USERS TABLE ---');
        const [usersColumns] = await db.execute('DESCRIBE users');
        console.log(JSON.stringify(usersColumns, null, 2));

        console.log('--- CHECKING FOR STAFF_MASTER ---');
        const [tables] = await db.execute("SHOW TABLES LIKE 'staff_master'");
        if (tables.length > 0) {
            console.log('staff_master exists');
            const [staffColumns] = await db.execute('DESCRIBE staff_master');
            console.log(JSON.stringify(staffColumns, null, 2));
        } else {
            console.log('staff_master DOES NOT exist. Checking employees table...');
            const [employees] = await db.execute("SHOW TABLES LIKE 'employees'");
            if (employees.length > 0) {
                const [empCols] = await db.execute('DESCRIBE employees');
                console.log(JSON.stringify(empCols, null, 2));
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkSchema();
