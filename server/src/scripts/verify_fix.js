const db = require('../config/db');

const verify = async () => {
    try {
        console.log('Verifying Patient Search...');
        const searchTerm = '%Aadhi%';

        // This query matches the FIXED controller logic
        const [rows] = await db.execute(`
            SELECT id, name as full_name, mobile, gender, age 
            FROM patients 
            WHERE name LIKE ? 
            LIMIT 5
        `, [searchTerm]);

        console.log('Found patients:', rows.length);
        if (rows.length > 0) {
            console.log('First match:', rows[0]);
        } else {
            console.log('No patients found with name matching Aadhi.');
            // Let's try to list ALL patients to see what's there
            const [all] = await db.execute('SELECT id, name FROM patients LIMIT 5');
            console.log('All Patients sample:', all);
        }

        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
};

verify();
