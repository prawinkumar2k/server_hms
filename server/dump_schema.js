const fs = require('fs');
const db = require('./src/config/db');

async function run() {
    const [cols] = await db.query('DESCRIBE patients');
    fs.writeFileSync('patients_schema.json', JSON.stringify(cols, null, 2));

    // Get patients
    const [patients] = await db.query('SELECT * FROM patients LIMIT 1');
    if (patients.length > 0) {
        fs.writeFileSync('first_patient.json', JSON.stringify(patients[0], null, 2));
    } else {
        fs.writeFileSync('first_patient.json', JSON.stringify({ error: 'no patients' }, null, 2));
    }
    process.exit(0);
}
run();
