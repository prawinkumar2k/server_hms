const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function makeTempUser() {
    try {
        const pass = await bcrypt.hash('root', 10);
        await db.execute(`
            INSERT INTO users (username, password, full_name, role, status, module_access) 
            VALUES ('pantry', ?, 'John Kitchen', 'Pantry', 'Active', 'pantry')
            ON DUPLICATE KEY UPDATE password = ?, module_access = 'pantry'
        `, [pass, pass]);

        const passNurse = await bcrypt.hash('root', 10);
        await db.execute(`
            INSERT INTO users (username, password, full_name, role, status, module_access) 
            VALUES ('nurse', ?, 'Mary Night', 'Nurse', 'Active', 'nurse')
            ON DUPLICATE KEY UPDATE password = ?, module_access = 'nurse'
        `, [passNurse, passNurse]);

        console.log('Created users:');
        console.log('Username: pantry | Password: root');
        console.log('Username: nurse | Password: root');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
makeTempUser();
