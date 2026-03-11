const db = require('./src/config/db');

(async () => {
    try {
        const searchTerm = 'Test'; // Try a generic term
        const term = `%${searchTerm}%`;

        console.log(`Searching for: ${term}`);

        const query = `
            SELECT 'OPD' as type, visit_date as date, doctor_name as title, symptoms as details, id FROM opd_visits WHERE patient_name LIKE ?
            UNION ALL
            SELECT 'Appointment' as type, CONCAT(date, ' ', time) as date, doctor_name as title, reason as details, id FROM appointments WHERE patient_name LIKE ?
            UNION ALL
            SELECT 'IPD' as type, admission_date as date, doctor_name as title, reason as details, id FROM ipd_admissions WHERE patient_name LIKE ?
            UNION ALL
            SELECT 'Invoice' as type, invoice_date as date, category as title, CONCAT('Amt: $', total_amount, ' - ', status) as details, id FROM invoices WHERE patient_name LIKE ?
            UNION ALL
            SELECT 'Prescription' as type, pDate as date, 'Rx' as title, Disease as details, id FROM prescriptions WHERE cusName LIKE ?
            ORDER BY date DESC
            LIMIT 50
        `;

        const [rows] = await db.execute(query, [term, term, term, term, term]);
        console.log('Result count:', rows.length);
        console.log('Results:', rows);
        process.exit(0);

    } catch (err) {
        console.error("Timeline Query Failed:");
        console.error(err);
        process.exit(1);
    }
})();
