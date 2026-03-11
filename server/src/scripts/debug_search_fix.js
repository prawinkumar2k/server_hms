const db = require('../config/db');

async function debugSearch() {
    try {
        console.log('--- Debugging Search for "manoj" ---');
        const searchTerm = '%manoj%';

        // 1. Check permissions / role is irrelevant for direct DB check, but let's check query
        const query = `
            SELECT id, name as full_name, mobile, gender, age 
            FROM patients 
            WHERE name LIKE ? OR mobile LIKE ? OR id LIKE ? 
            LIMIT 5
        `;

        console.log('Executing query:', query);
        const [rows] = await db.execute(query, [searchTerm, searchTerm, searchTerm]);
        console.log('Results found:', rows);

        if (rows.length === 0) {
            console.log('No patients found. Listing first 5 patients in DB to check data:');
            const [allPatients] = await db.execute('SELECT * FROM patients LIMIT 5');
            console.log(allPatients);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

debugSearch();
