const db = require('./src/config/db');

(async () => {
    try {
        // Check if table exists
        const [tables] = await db.execute('SHOW TABLES LIKE "copy_of_patientdetaiils"');
        console.log('Table exists:', tables.length > 0);

        if (tables.length > 0) {
            const [count] = await db.execute('SELECT COUNT(*) as cnt FROM copy_of_patientdetaiils');
            console.log('Row count:', count[0].cnt);

            // Try fetching patients
            const [rows] = await db.execute('SELECT * FROM copy_of_patientdetaiils ORDER BY SNo DESC LIMIT 5');
            console.log('Sample rows:', rows);
        } else {
            console.log('Table copy_of_patientdetaiils does NOT exist!');

            // Check what tables exist with 'patient' in name
            const [allTables] = await db.execute('SHOW TABLES');
            console.log('All tables:', allTables.map(t => Object.values(t)[0]).filter(n => n.toLowerCase().includes('patient')));
        }

        process.exit(0);
    } catch (e) {
        console.log('Error:', e.message);
        console.log('Stack:', e.stack);
        process.exit(1);
    }
})();
