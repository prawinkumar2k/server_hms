const db = require('../config/db');

const checkOpd = async () => {
    try {
        console.log('--- Checking daily_op_records ---');
        const [rows] = await db.execute('SELECT * FROM daily_op_records LIMIT 5');
        console.log('OPD Records:', rows.length);
        if (rows.length > 0) {
            console.log(rows[0]);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkOpd();
