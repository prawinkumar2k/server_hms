const db = require('../../config/db');

exports.getAllBeds = async () => {
    const [rows] = await db.execute('SELECT * FROM beds ORDER BY ward, number');
    return rows;
};

exports.getAdmissions = async (status = 'Admitted') => {
    let query = `
        SELECT a.*, b.number as bed_number, b.ward, b.type as bed_type
        FROM ipd_admissions a
        JOIN beds b ON a.bed_id = b.id
    `;

    if (status === 'Admitted') {
        query += " WHERE a.status = 'Admitted'";
    } else if (status === 'Discharged') {
        query += " WHERE a.status = 'Discharged'";
    }

    query += ' ORDER BY a.admission_date DESC';
    const [rows] = await db.execute(query);
    return rows;
};

exports.admitPatient = async (data) => {
    const { patient_name, doctor_name, bed_id, reason, admission_date } = data;

    // Check if bed is available
    const [bedCheck] = await db.execute('SELECT status FROM beds WHERE id = ?', [bed_id]);
    if (bedCheck.length === 0 || bedCheck[0].status !== 'Available') {
        throw new Error('Bed not available');
    }

    // Start Transaction
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            'INSERT INTO ipd_admissions (patient_id, patient_name, doctor_name, bed_id, reason, admission_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.patient_id, patient_name, doctor_name, bed_id, reason, admission_date, 'Admitted']
        );

        await conn.execute('UPDATE beds SET status = "Occupied" WHERE id = ?', [bed_id]);

        await conn.commit();
        return result.insertId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.dischargePatient = async (admission_id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Get Admission Details & Bed Price
        const [adm] = await conn.execute(`
            SELECT a.*, b.price as bed_price 
            FROM ipd_admissions a 
            JOIN beds b ON a.bed_id = b.id 
            WHERE a.id = ?
        `, [admission_id]);

        if (adm.length === 0) throw new Error('Admission not found');
        const admission = adm[0];

        // Calculate Days
        const admissionDate = new Date(admission.admission_date);
        const dischargeDate = new Date();
        const diffTime = Math.abs(dischargeDate - admissionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

        // Calculate Bill
        const bedPrice = parseFloat(admission.bed_price) || 0;
        const roomTotal = diffDays * bedPrice;
        const grandTotal = roomTotal; // Add medicines/labs later if needed

        // Generate Bill No
        const billNo = `HB${Date.now().toString().slice(-6)}`;

        // Insert Bill
        const [billRes] = await conn.execute(
            `INSERT INTO hospital_bills 
            (bill_no, admission_id, patient_id, patient_name, admission_date, discharge_date, total_days, bed_charge_per_day, room_total, grand_total, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [billNo, admission_id, admission.patient_id, admission.patient_name, admission.admission_date, dischargeDate, diffDays, bedPrice, roomTotal, grandTotal, 'PAID']
        );

        // Update Admission Status
        await conn.execute(
            'UPDATE ipd_admissions SET status = "Discharged", discharge_date = ? WHERE id = ?',
            [dischargeDate, admission_id]
        );

        // Free Bed
        await conn.execute('UPDATE beds SET status = "Available" WHERE id = ?', [admission.bed_id]);

        await conn.commit();
        return { billId: billRes.insertId, billNo, grandTotal, days: diffDays };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getEncountersDashboard = async () => {
    // 1. Fetch All Admissions with patient demographics
    const [rows] = await db.execute(`
        SELECT a.*, b.number as bed_number, b.ward, b.type as bed_type,
               p.PAge as patient_age, p.PSex as patient_gender
        FROM ipd_admissions a
        JOIN beds b ON a.bed_id = b.id
        LEFT JOIN copy_of_patientdetaiils p ON a.patient_id = p.cusId
        ORDER BY a.admission_date DESC
    `);

    // 2. Metrics Calculation
    let totalAdmissions = rows.length;
    let readmittedCount = 0;
    let totalLOS = 0;
    let dischargedCount = 0;

    const patientCounts = {};
    rows.forEach(r => {
        patientCounts[r.patient_id] = (patientCounts[r.patient_id] || 0) + 1;

        if (r.status === 'Discharged' && r.discharge_date && r.admission_date) {
            const start = new Date(r.admission_date);
            const end = new Date(r.discharge_date);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
            totalLOS += days;
            dischargedCount++;
            r.los = days;
        } else if (r.status === 'Admitted') {
            const start = new Date(r.admission_date);
            const end = new Date();
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
            r.los = days;
        }
    });

    readmittedCount = Object.values(patientCounts).filter(c => c > 1).length;

    const readmissionRate = totalAdmissions > 0 ? ((readmittedCount / totalAdmissions) * 100).toFixed(1) : 0;
    const avgLOS = dischargedCount > 0 ? (totalLOS / dischargedCount).toFixed(1) : 0;

    // 3. Calculate real mortality and infection rates from data
    let mortalityCount = 0;
    let infectionCount = 0;
    rows.forEach(r => {
        if (r.status === 'Deceased') mortalityCount++;
        if (r.reason && /infect|sepsis|uti|pneumonia/i.test(r.reason)) infectionCount++;
    });

    const mortalityRate = totalAdmissions > 0 ? ((mortalityCount / totalAdmissions) * 100).toFixed(1) : '0.0';
    const infectionRate = totalAdmissions > 0 ? ((infectionCount / totalAdmissions) * 100).toFixed(1) : '0.0';

    // 4. Enrich Rows with real data
    const enrichedRows = rows.map(r => {
        const isReadmission = patientCounts[r.patient_id] > 1;
        const los = r.los || 1;

        // Risk score based on LOS and readmission (simple heuristic, not random)
        let riskScore = 1.0;
        if (los > 14) riskScore += 2.0;
        else if (los > 7) riskScore += 1.0;
        if (isReadmission) riskScore += 1.5;
        if (r.patient_age && parseInt(r.patient_age) > 65) riskScore += 0.5;
        riskScore = Math.min(riskScore, 5.0).toFixed(1);

        // Infection risk based on LOS
        const infectionRisk = Math.min(los * 1.2, 25).toFixed(1);

        return {
            id: r.id,
            patient: {
                name: r.patient_name,
                id: r.patient_id,
                age: r.patient_age || 'N/A',
                gender: r.patient_gender || 'N/A'
            },
            encounter: {
                reason: r.reason || 'General Care',
                date: r.admission_date,
                type: 'Inpatient'
            },
            provider: {
                name: r.doctor_name,
                specialty: 'General'
            },
            location: `${r.ward} ${r.bed_number}`,
            metrics: {
                los: los,
                predictedLos: Math.ceil(los * 1.2),
                readmissionRisk: isReadmission ? 'High' : (riskScore > 3 ? 'High' : 'Low'),
                riskScore: `${riskScore}x`,
                infection: `${infectionRisk}%`
            },
            status: r.status
        };
    });

    return {
        metrics: {
            readmissionRate,
            avgLOS,
            mortalityRate,
            infectionRate
        },
        encounters: enrichedRows
    };
};
