const db = require('../../config/db');

// ─── CLEARANCE STATUS ───────────────────────────────────
exports.getClearanceStatus = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT dc.*, u.full_name as cleared_by_name 
         FROM discharge_clearance dc 
         LEFT JOIN users u ON dc.cleared_by = u.id
         WHERE dc.admission_id = ? 
         ORDER BY FIELD(dc.department, 'Pantry', 'Inventory', 'Pharmacy', 'Ward', 'Billing')`,
        [admissionId]
    );
    const allCleared = rows.length === 5 && rows.every(r => r.status === 'Cleared');
    return { clearances: rows, allCleared };
};

// ─── CLEAR A DEPARTMENT ─────────────────────────────────
exports.clearDepartment = async (admissionId, department, userId, notes) => {
    await db.execute(
        `UPDATE discharge_clearance SET status = 'Cleared', cleared_by = ?, cleared_at = NOW(), notes = ?
         WHERE admission_id = ? AND department = ?`,
        [userId, notes || null, admissionId, department]
    );
    return { admissionId, department, status: 'Cleared' };
};

// ─── GENERATE DISCHARGE SUMMARY ─────────────────────────
exports.generateSummary = async (admissionId, userId) => {
    // Check all departments are cleared
    const clearance = await exports.getClearanceStatus(admissionId);
    if (!clearance.allCleared) {
        throw new Error('Cannot generate summary: Not all departments have cleared. Pending: ' +
            clearance.clearances.filter(c => c.status === 'Pending').map(c => c.department).join(', '));
    }

    // 1. Get admission details
    const [adm] = await db.execute(
        `SELECT a.*, b.number as bed_number, b.ward, b.price as bed_price
         FROM ipd_admissions a JOIN beds b ON a.bed_id = b.id WHERE a.id = ?`,
        [admissionId]
    );
    if (adm.length === 0) throw new Error('Admission not found');
    const admission = adm[0];

    // 2. Get initial vitals (first recorded)
    const [initialVitals] = await db.execute(
        `SELECT * FROM ipd_vitals WHERE admission_id = ? ORDER BY recorded_at ASC LIMIT 1`,
        [admissionId]
    );

    // 3. Get lab results (from lab module if linked)
    const [labResults] = await db.execute(
        `SELECT * FROM ipd_orders WHERE admission_id = ? AND order_type = 'Lab' ORDER BY created_at`,
        [admissionId]
    );

    // 4. Get procedures performed
    const [procedures] = await db.execute(
        `SELECT * FROM ipd_orders WHERE admission_id = ? AND order_type = 'Procedure' AND status = 'Completed' ORDER BY created_at`,
        [admissionId]
    );

    // 5. Course in hospital (from daily SOAP notes)
    const [rounds] = await db.execute(
        `SELECT r.*, u.full_name as doctor_name FROM ipd_doctor_rounds r 
         LEFT JOIN users u ON r.doctor_id = u.id
         WHERE r.admission_id = ? ORDER BY r.round_date ASC`,
        [admissionId]
    );
    const courseInHospital = rounds.map(r =>
        `[${r.round_date}] Dr. ${r.doctor_name}: S: ${r.subjective || '-'} | O: ${r.objective || '-'} | A: ${r.assessment || '-'} | P: ${r.plan || '-'}`
    ).join('\n');

    // 6. Final discharge medications
    const [medications] = await db.execute(
        `SELECT * FROM ipd_orders WHERE admission_id = ? AND order_type = 'Medication' AND status != 'Cancelled' ORDER BY created_at DESC`,
        [admissionId]
    );

    const summaryData = {
        admission_id: admissionId,
        admission_date: admission.admission_date,
        discharge_date: new Date().toISOString().split('T')[0],
        admission_reason: admission.reason,
        initial_vitals: JSON.stringify(initialVitals[0] || {}),
        lab_results: JSON.stringify(labResults.map(l => ({ name: l.item_name, status: l.status }))),
        procedures_performed: JSON.stringify(procedures.map(p => ({ name: p.item_name, instructions: p.instructions }))),
        course_in_hospital: courseInHospital,
        final_diagnosis: rounds.length > 0 ? rounds[rounds.length - 1].assessment : '',
        discharge_medications: JSON.stringify(medications.map(m => ({ name: m.item_name, dosage: m.dosage, frequency: m.frequency }))),
        follow_up_instructions: '',
        generated_by: userId
    };

    // Upsert
    await db.execute(
        `INSERT INTO discharge_summary 
         (admission_id, admission_date, discharge_date, admission_reason, initial_vitals, lab_results, procedures_performed, course_in_hospital, final_diagnosis, discharge_medications, follow_up_instructions, generated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         discharge_date = VALUES(discharge_date), initial_vitals = VALUES(initial_vitals), lab_results = VALUES(lab_results),
         procedures_performed = VALUES(procedures_performed), course_in_hospital = VALUES(course_in_hospital),
         final_diagnosis = VALUES(final_diagnosis), discharge_medications = VALUES(discharge_medications),
         generated_by = VALUES(generated_by), generated_at = NOW()`,
        [summaryData.admission_id, summaryData.admission_date, summaryData.discharge_date, summaryData.admission_reason,
        summaryData.initial_vitals, summaryData.lab_results, summaryData.procedures_performed,
        summaryData.course_in_hospital, summaryData.final_diagnosis, summaryData.discharge_medications,
        summaryData.follow_up_instructions, summaryData.generated_by]
    );

    return summaryData;
};

// ─── GET DISCHARGE SUMMARY ──────────────────────────────
exports.getSummary = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT ds.*, u.full_name as generated_by_name
         FROM discharge_summary ds
         LEFT JOIN users u ON ds.generated_by = u.id
         WHERE ds.admission_id = ?`,
        [admissionId]
    );
    return rows[0] || null;
};

// ─── FINALIZE & DISCHARGE ───────────────────────────────
exports.finalizeDischarge = async (admissionId, followUpInstructions, userId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Update summary as finalized
        await conn.execute(
            `UPDATE discharge_summary SET is_finalized = 1, follow_up_instructions = ? WHERE admission_id = ?`,
            [followUpInstructions || '', admissionId]
        );

        // Get admission for bed release and billing
        const [adm] = await conn.execute(
            `SELECT a.*, b.price as bed_price FROM ipd_admissions a JOIN beds b ON a.bed_id = b.id WHERE a.id = ?`,
            [admissionId]
        );
        if (adm.length === 0) throw new Error('Admission not found');
        const admission = adm[0];

        // Calculate room charges
        const admissionDate = new Date(admission.admission_date);
        const dischargeDate = new Date();
        const diffDays = Math.ceil(Math.abs(dischargeDate - admissionDate) / (1000 * 60 * 60 * 24)) || 1;
        const bedPrice = parseFloat(admission.bed_price) || 0;
        const roomTotal = diffDays * bedPrice;

        // Get folio charges
        const [folio] = await conn.execute(
            `SELECT SUM(total_price) as folio_total FROM ipd_billing_folio WHERE admission_id = ?`,
            [admissionId]
        );
        const folioTotal = parseFloat(folio[0]?.folio_total) || 0;
        const grandTotal = roomTotal + folioTotal;

        // Generate bill
        const billNo = `HB${Date.now().toString().slice(-6)}`;
        await conn.execute(
            `INSERT INTO hospital_bills 
             (bill_no, admission_id, patient_id, patient_name, admission_date, discharge_date, total_days, bed_charge_per_day, room_total, grand_total, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [billNo, admissionId, admission.patient_id, admission.patient_name, admission.admission_date, dischargeDate, diffDays, bedPrice, roomTotal, grandTotal, 'UNPAID']
        );

        // Update admission status
        await conn.execute(
            `UPDATE ipd_admissions SET status = 'Discharged', discharge_date = ? WHERE id = ?`,
            [dischargeDate, admissionId]
        );

        // Free bed
        await conn.execute(`UPDATE beds SET status = 'Available' WHERE id = ?`, [admission.bed_id]);

        await conn.commit();
        return { billNo, grandTotal, days: diffDays, roomTotal, folioTotal };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

// ─── GET BILLING FOLIO ──────────────────────────────────
exports.getBillingFolio = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT * FROM ipd_billing_folio WHERE admission_id = ? ORDER BY charged_at DESC`,
        [admissionId]
    );
    const total = rows.reduce((acc, r) => acc + parseFloat(r.total_price || 0), 0);
    return { items: rows, total };
};
