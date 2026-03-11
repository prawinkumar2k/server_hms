const db = require('../../config/db');
const dailyOpService = require('../daily-op/daily-op.service');

exports.getAllAppointments = async (filters = {}) => {
    let query = 'SELECT * FROM appointments';
    const params = [];
    const conditions = [];

    if (filters.status && filters.status !== 'All') {
        conditions.push('status = ?');
        params.push(filters.status);
    }

    if (filters.date) {
        conditions.push('date = ?');
        params.push(filters.date);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, time DESC'; // Latest first

    const [rows] = await db.execute(query, params);
    return rows;
};

exports.createAppointment = async (data) => {
    const { patient_name, doctor_name, date, time, status = 'Scheduled', reason } = data;
    const [result] = await db.execute(
        'INSERT INTO appointments (patient_name, doctor_name, date, time, status, reason) VALUES (?, ?, ?, ?, ?, ?)',
        [patient_name, doctor_name, date, time, status, reason]
    );

    // AUTO-LOG to Daily OP Records
    try {
        await dailyOpService.addRecord({
            patient_name,
            visit_date: date,
            visit_type: 'Consultation', // Default
            op_fees: 200.00, // Standard Consultation Fee (Configurable later)
            total_fees: 200.00,
            payment_status: 'Paid',
            age_gender: 'Unknown', // We might need to fetch this from patient details if available
            source_type: 'Appointment',
            source_id: result.insertId
        });
    } catch (logErr) {
        console.error("Failed to log to Daily OP:", logErr);
        // Don't fail the appointment creation just because logging failed
    }

    return result.insertId;
};

exports.updateAppointmentStatus = async (id, status) => {
    await db.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    return true;
};

exports.deleteAppointment = async (id) => {
    await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
    return true;
};

// Transactions
exports.getTransactions = async () => {
    const [rows] = await db.execute('SELECT * FROM appointment_transactions ORDER BY transaction_date DESC');
    return rows;
};

exports.createTransaction = async (data) => {
    const { appointment_id, patient_name, amount, payment_method } = data;
    await db.execute(
        'INSERT INTO appointment_transactions (appointment_id, patient_name, amount, payment_method) VALUES (?, ?, ?, ?)',
        [appointment_id, patient_name, amount, payment_method]
    );
    return true;
};
