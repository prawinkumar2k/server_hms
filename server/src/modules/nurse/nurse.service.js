const db = require('../../config/db');

// ─── VITALS ─────────────────────────────────────────────
exports.recordVitals = async (data) => {
    const { admission_id, recorded_by, bp_systolic, bp_diastolic, temperature, pulse, spo2, sugar_level, respiratory_rate, notes } = data;
    const [result] = await db.execute(
        `INSERT INTO ipd_vitals (admission_id, recorded_by, bp_systolic, bp_diastolic, temperature, pulse, spo2, sugar_level, respiratory_rate, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [admission_id, recorded_by, bp_systolic, bp_diastolic, temperature, pulse, spo2, sugar_level, respiratory_rate, notes || null]
    );

    // Mark triage as completed on first vitals entry
    await db.execute(`UPDATE ipd_admissions SET triage_status = 'Completed' WHERE id = ? AND triage_status = 'Pending'`, [admission_id]);

    return { id: result.insertId };
};

exports.getVitalsByAdmission = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT v.*, u.full_name as recorded_by_name 
         FROM ipd_vitals v 
         LEFT JOIN users u ON v.recorded_by = u.id
         WHERE v.admission_id = ? ORDER BY v.recorded_at DESC`,
        [admissionId]
    );
    return rows;
};

exports.getLatestVitals = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT * FROM ipd_vitals WHERE admission_id = ? ORDER BY recorded_at DESC LIMIT 1`,
        [admissionId]
    );
    return rows[0] || null;
};

// ─── eMAR (Medication Administration) ───────────────────
exports.getPendingOrders = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT o.*, u.full_name as ordered_by_name
         FROM ipd_orders o
         LEFT JOIN users u ON o.ordered_by = u.id
         WHERE o.admission_id = ? AND o.status IN ('Pending', 'Acknowledged')
         ORDER BY o.created_at DESC`,
        [admissionId]
    );
    return rows;
};

exports.acknowledgeOrder = async (orderId, nurseId) => {
    await db.execute(`UPDATE ipd_orders SET status = 'Acknowledged' WHERE id = ? AND status = 'Pending'`, [orderId]);
    return { orderId, status: 'Acknowledged' };
};

exports.administerMedication = async (data) => {
    const { order_id, admission_id, administered_by, notes } = data;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Record in eMAR
        const [result] = await conn.execute(
            `INSERT INTO ipd_emar (order_id, admission_id, administered_by, notes) VALUES (?, ?, ?, ?)`,
            [order_id, admission_id, administered_by, notes || null]
        );

        // Update order status
        await conn.execute(`UPDATE ipd_orders SET status = 'Administered' WHERE id = ?`, [order_id]);

        // If it's a consumable, deduct from ward inventory and bill to patient folio
        const [order] = await conn.execute(`SELECT * FROM ipd_orders WHERE id = ?`, [order_id]);
        if (order.length > 0 && (order[0].order_type === 'Consumable' || order[0].order_type === 'Medication')) {
            // Get ward from admission
            const [adm] = await conn.execute(
                `SELECT b.ward FROM ipd_admissions a JOIN beds b ON a.bed_id = b.id WHERE a.id = ?`,
                [admission_id]
            );
            if (adm.length > 0) {
                const ward = adm[0].ward;
                // Try to deduct from ward inventory
                await conn.execute(
                    `UPDATE ward_inventory SET quantity = GREATEST(quantity - 1, 0) WHERE ward = ? AND product_name = ?`,
                    [ward, order[0].item_name]
                );

                // Check if ward stock is low -> auto-generate indent
                const [stock] = await conn.execute(
                    `SELECT * FROM ward_inventory WHERE ward = ? AND product_name = ? AND quantity <= reorder_level`,
                    [ward, order[0].item_name]
                );
                if (stock.length > 0) {
                    // Auto-indent from central store
                    await conn.execute(
                        `INSERT INTO ward_indent_requests (ward, requested_by, product_code, product_name, requested_qty, status)
                         VALUES (?, ?, ?, ?, ?, 'Pending')`,
                        [ward, administered_by, stock[0].product_code, stock[0].product_name, stock[0].reorder_level * 2]
                    );
                }
            }

            // Bill to patient folio
            await conn.execute(
                `INSERT INTO ipd_billing_folio (admission_id, charge_type, description, quantity, unit_price, total_price)
                 VALUES (?, ?, ?, 1, 0, 0)`,
                [admission_id, order[0].order_type === 'Consumable' ? 'Consumable' : 'Medication', order[0].item_name]
            );
        }

        await conn.commit();
        return { id: result.insertId, order_id };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getEmarByAdmission = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT e.*, o.item_name, o.dosage, o.frequency, o.order_type, u.full_name as administered_by_name
         FROM ipd_emar e
         JOIN ipd_orders o ON e.order_id = o.id
         LEFT JOIN users u ON e.administered_by = u.id
         WHERE e.admission_id = ?
         ORDER BY e.administered_at DESC`,
        [admissionId]
    );
    return rows;
};

// ─── WARD INDENT REQUESTS ──────────────────────────────
exports.createWardIndent = async (data) => {
    const { ward, requested_by, product_code, product_name, requested_qty } = data;
    const [result] = await db.execute(
        `INSERT INTO ward_indent_requests (ward, requested_by, product_code, product_name, requested_qty)
         VALUES (?, ?, ?, ?, ?)`,
        [ward, requested_by, product_code, product_name, requested_qty]
    );
    return { id: result.insertId };
};

exports.getWardIndents = async (ward) => {
    let query = `SELECT wir.*, u.full_name as requested_by_name FROM ward_indent_requests wir LEFT JOIN users u ON wir.requested_by = u.id`;
    const params = [];
    if (ward) {
        query += ` WHERE wir.ward = ?`;
        params.push(ward);
    }
    query += ` ORDER BY wir.created_at DESC`;
    const [rows] = await db.execute(query, params);
    return rows;
};

exports.updateWardIndentStatus = async (id, status, processedBy) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(
            `UPDATE ward_indent_requests SET status = ?, processed_at = NOW() WHERE id = ?`,
            [status, id]
        );

        // If approved/issued, update ward inventory
        if (status === 'Issued') {
            const [indent] = await conn.execute(`SELECT * FROM ward_indent_requests WHERE id = ?`, [id]);
            if (indent.length > 0) {
                const i = indent[0];
                await conn.execute(
                    `INSERT INTO ward_inventory (ward, product_code, product_name, quantity)
                     VALUES (?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
                    [i.ward, i.product_code, i.product_name, i.requested_qty, i.requested_qty]
                );
            }
        }

        await conn.commit();
        return { id, status };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

// ─── NURSE DASHBOARD ────────────────────────────────────
exports.getNurseDashboard = async () => {
    // Active admissions with latest vitals
    const [admissions] = await db.execute(`
        SELECT a.id, a.patient_name, a.patient_id, a.admission_date, a.triage_status, a.diet_preference,
               b.number as bed_number, b.ward, b.type as bed_type,
               (SELECT COUNT(*) FROM ipd_orders WHERE admission_id = a.id AND status = 'Pending') as pending_orders,
               (SELECT recorded_at FROM ipd_vitals WHERE admission_id = a.id ORDER BY recorded_at DESC LIMIT 1) as last_vitals_at
        FROM ipd_admissions a
        JOIN beds b ON a.bed_id = b.id
        WHERE a.status = 'Admitted'
        ORDER BY a.admission_date DESC
    `);

    // Ward-wise indent alerts
    const [indentAlerts] = await db.execute(
        `SELECT COUNT(*) as count FROM ward_indent_requests WHERE status = 'Pending'`
    );

    return {
        activePatients: admissions,
        pendingIndents: indentAlerts[0]?.count || 0,
        totalActive: admissions.length
    };
};
