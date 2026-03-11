const db = require('../../config/db');

// ─── SOAP NOTES / DAILY ROUNDS ──────────────────────────
exports.addRound = async (data) => {
    const { admission_id, doctor_id, subjective, objective, assessment, plan, round_date } = data;
    const [result] = await db.execute(
        `INSERT INTO ipd_doctor_rounds (admission_id, doctor_id, subjective, objective, assessment, plan, round_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [admission_id, doctor_id, subjective, objective, assessment, plan, round_date || new Date().toISOString().split('T')[0]]
    );
    return { id: result.insertId };
};

exports.getRounds = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT r.*, u.full_name as doctor_name 
         FROM ipd_doctor_rounds r 
         LEFT JOIN users u ON r.doctor_id = u.id
         WHERE r.admission_id = ? 
         ORDER BY r.round_date DESC, r.created_at DESC`,
        [admissionId]
    );
    return rows;
};

// ─── DOCTOR ORDERS ──────────────────────────────────────
exports.createOrder = async (data) => {
    const { admission_id, ordered_by, order_type, item_name, dosage, frequency, instructions, meal_timing } = data;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // For Diet orders, store selected meal timings in 'frequency' column
        const effectiveFrequency = (order_type === 'Diet' && Array.isArray(meal_timing) && meal_timing.length > 0)
            ? meal_timing.join(',')
            : (frequency || null);

        const [result] = await conn.execute(
            `INSERT INTO ipd_orders (admission_id, ordered_by, order_type, item_name, dosage, frequency, instructions)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [admission_id, ordered_by, order_type, item_name, dosage || null, effectiveFrequency, instructions || null]
        );

        // If order type is Diet, auto-push to Pantry (dietary_orders)
        if (order_type === 'Diet') {
            const [adm] = await conn.execute(
                `SELECT a.patient_name, a.diet_preference, b.number as bed_number, b.ward 
                 FROM ipd_admissions a JOIN beds b ON a.bed_id = b.id WHERE a.id = ?`,
                [admission_id]
            );
            if (adm.length > 0) {
                // Update patient diet preference
                await conn.execute(`UPDATE ipd_admissions SET diet_preference = ? WHERE id = ?`, [item_name, admission_id]);

                // Create dietary orders only for selected meal timings
                const today = new Date().toISOString().split('T')[0];
                const meals = (Array.isArray(meal_timing) && meal_timing.length > 0)
                    ? meal_timing
                    : ['Breakfast', 'Lunch', 'Dinner'];
                for (const meal of meals) {
                    await conn.execute(
                        `INSERT IGNORE INTO dietary_orders (admission_id, bed_number, ward, patient_name, diet_type, special_instructions, meal_time, scheduled_date)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [admission_id, adm[0].bed_number, adm[0].ward, adm[0].patient_name, item_name, instructions || null, meal, today]
                    );
                }
            }
        }

        // If order type is Medication/Consumable, reserve in inventory
        if (order_type === 'Medication' || order_type === 'Consumable') {
            // Notification is implicit — nurse will see it in pending orders
        }

        await conn.commit();
        return { id: result.insertId };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getOrders = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT o.*, u.full_name as ordered_by_name
         FROM ipd_orders o
         LEFT JOIN users u ON o.ordered_by = u.id
         WHERE o.admission_id = ?
         ORDER BY o.created_at DESC`,
        [admissionId]
    );
    return rows;
};

exports.cancelOrder = async (orderId) => {
    await db.execute(`UPDATE ipd_orders SET status = 'Cancelled' WHERE id = ? AND status = 'Pending'`, [orderId]);
    return { orderId, status: 'Cancelled' };
};

// ─── DISCHARGE INITIATION ───────────────────────────────
exports.initiateDischarge = async (admissionId, doctorId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Mark admission as discharge-ready
        await conn.execute(
            `UPDATE ipd_admissions SET discharge_ready = 1, discharge_initiated_by = ? WHERE id = ?`,
            [doctorId, admissionId]
        );

        // Create clearance entries for all departments
        const departments = ['Pantry', 'Inventory', 'Pharmacy', 'Ward', 'Billing'];
        for (const dept of departments) {
            await conn.execute(
                `INSERT IGNORE INTO discharge_clearance (admission_id, department, status) VALUES (?, ?, 'Pending')`,
                [admissionId, dept]
            );
        }

        await conn.commit();
        return { admissionId, status: 'Discharge Initiated' };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

// ─── IPD PATIENT LIST FOR DOCTOR ────────────────────────
exports.getMyIPDPatients = async (doctorId) => {
    const [rows] = await db.execute(`
        SELECT a.*, b.number as bed_number, b.ward,
               a.triage_status, a.discharge_ready, a.diet_preference,
               (SELECT COUNT(*) FROM ipd_doctor_rounds WHERE admission_id = a.id) as total_rounds,
               (SELECT COUNT(*) FROM ipd_orders WHERE admission_id = a.id AND status = 'Pending') as pending_orders
        FROM ipd_admissions a
        JOIN beds b ON a.bed_id = b.id
        WHERE a.status = 'Admitted'
        ORDER BY a.admission_date DESC
    `);
    return rows;
};
