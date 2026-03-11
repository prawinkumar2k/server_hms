const db = require('../../config/db');

exports.createRecord = async (data) => {
    const {
        patientId, doctorId, visitDate,
        symptoms, history, physicalExam, diagnosis, plan, followUp,
        bp, heartRate, temperature, spo2
    } = data;

    const query = `
        INSERT INTO clinical_notes 
        (patient_id, doctor_id, visit_date, symptoms, history_illness, physical_examination, diagnosis, treatment_plan, follow_up, bp, heart_rate, temperature, spo2)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
        patientId, doctorId || 'Unknown', visitDate || new Date(),
        symptoms || null, history || null, physicalExam || null, diagnosis || null, plan || null, followUp || null,
        bp || null, heartRate || null, temperature || null, spo2 || null
    ]);

    return { id: result.insertId, ...data };
};

exports.getRecordsByPatientId = async (patientId) => {
    const [rows] = await db.execute(
        'SELECT * FROM clinical_notes WHERE patient_id = ? ORDER BY visit_date DESC, created_at DESC',
        [patientId]
    );
    return rows;
};
