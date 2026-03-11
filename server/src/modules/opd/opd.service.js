const db = require('../../config/db');
const dailyOpService = require('../daily-op/daily-op.service');

exports.getAllVisits = async () => {
    const [rows] = await db.execute('SELECT * FROM opd_visits ORDER BY visit_date DESC');
    return rows;
};

exports.registerVisit = async (data) => {
    const { patient_name, age, gender, contact, doctor_name, symptoms } = data;
    const [result] = await db.execute(
        'INSERT INTO opd_visits (patient_name, age, gender, contact, doctor_name, symptoms, status) VALUES (?, ?, ?, ?, ?, ?, "Checked In")',
        [patient_name, age, gender, contact, doctor_name, symptoms]
    );

    // AUTO-LOG to Daily OP Records
    try {
        await dailyOpService.addRecord({
            patient_name,
            age_gender: `${age} / ${gender}`,
            contact,
            visit_type: 'OPD Visit',
            op_fees: 200.00, // Standard OPD Fee
            total_fees: 200.00,
            payment_status: 'Paid',
            visit_date: new Date(), // Today
            source_type: 'OPD',
            source_id: result.insertId
        });
    } catch (logErr) {
        console.error("Failed to log OPD Visit to Daily OP:", logErr);
    }

    return result.insertId;
};

exports.completeVisit = async (id, data) => {
    const { diagnosis } = data;
    await db.execute(
        'UPDATE opd_visits SET diagnosis = ?, status = "Completed" WHERE id = ?',
        [diagnosis, id]
    );
    return true;
};

exports.deleteVisit = async (id) => {
    await db.execute('DELETE FROM opd_visits WHERE id = ?', [id]);
    return true;
};
