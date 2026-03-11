const db = require('../../config/db');

exports.getTimeline = async (searchTerm) => {
    const term = `%${searchTerm}%`;

    // Aggregating form 5 tables: opd, appointments, ipd, invoices, prescriptions
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

    // We pass term 5 times
    const [rows] = await db.execute(query, [term, term, term, term, term]);
    return rows;
};
