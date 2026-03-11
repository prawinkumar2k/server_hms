const db = require('../../config/db');

// ─── DIETARY ORDERS DASHBOARD ───────────────────────────
exports.getDashboard = async (date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];

    const [orders] = await db.execute(`
        SELECT d.*, a.patient_name, a.status as admission_status
        FROM dietary_orders d
        JOIN ipd_admissions a ON d.admission_id = a.id
        WHERE d.scheduled_date = ? AND a.status = 'Admitted'
        ORDER BY d.ward, d.bed_number, 
            FIELD(d.meal_time, 'Breakfast', 'Lunch', 'Snack', 'Dinner')
    `, [targetDate]);

    // Summary
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        preparing: orders.filter(o => o.status === 'Preparing').length,
        delivered: orders.filter(o => o.status === 'Delivered').length
    };

    return { orders, stats };
};

// ─── UPDATE MEAL STATUS ─────────────────────────────────
exports.updateMealStatus = async (id, status, userId) => {
    const updates = { status };
    if (status === 'Delivered') {
        updates.delivered_by = userId;
        updates.delivered_at = new Date();
    }

    await db.execute(
        `UPDATE dietary_orders SET status = ?, delivered_by = ?, delivered_at = ? WHERE id = ?`,
        [status, updates.delivered_by || null, updates.delivered_at || null, id]
    );
    return { id, status };
};

// ─── BULK MARK MEALS ────────────────────────────────────
exports.bulkMarkDelivered = async (ids, userId) => {
    if (!ids || ids.length === 0) return { count: 0 };
    const placeholders = ids.map(() => '?').join(',');
    await db.execute(
        `UPDATE dietary_orders SET status = 'Delivered', delivered_by = ?, delivered_at = NOW() 
         WHERE id IN (${placeholders}) AND status != 'Delivered'`,
        [userId, ...ids]
    );
    return { count: ids.length };
};

// ─── GET ORDERS BY WARD ─────────────────────────────────
exports.getByWard = async (ward, date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const [rows] = await db.execute(
        `SELECT d.*, a.patient_name FROM dietary_orders d
         JOIN ipd_admissions a ON d.admission_id = a.id
         WHERE d.ward = ? AND d.scheduled_date = ? AND a.status = 'Admitted'
         ORDER BY d.bed_number, FIELD(d.meal_time, 'Breakfast', 'Lunch', 'Snack', 'Dinner')`,
        [ward, targetDate]
    );
    return rows;
};

// ─── GET PATIENT DIET HISTORY ───────────────────────────
exports.getPatientDietHistory = async (admissionId) => {
    const [rows] = await db.execute(
        `SELECT * FROM dietary_orders WHERE admission_id = ? ORDER BY scheduled_date DESC, FIELD(meal_time, 'Breakfast', 'Lunch', 'Snack', 'Dinner')`,
        [admissionId]
    );
    return rows;
};

// ─── CLEARANCE CHECK ────────────────────────────────────
exports.clearDepartment = async (admissionId, userId) => {
    // Check if all meals are delivered for this patient
    const [pending] = await db.execute(
        `SELECT COUNT(*) as count FROM dietary_orders WHERE admission_id = ? AND status != 'Delivered' AND status != 'Cancelled'`,
        [admissionId]
    );

    if (pending[0].count > 0) {
        return { cleared: false, pendingMeals: pending[0].count };
    }

    await db.execute(
        `UPDATE discharge_clearance SET status = 'Cleared', cleared_by = ?, cleared_at = NOW() 
         WHERE admission_id = ? AND department = 'Pantry'`,
        [userId, admissionId]
    );
    return { cleared: true };
};

// ─── FOOD MENU ──────────────────────────────────────────
exports.getFoodMenu = async () => {
    const [rows] = await db.execute(`SELECT * FROM food_menu ORDER BY FIELD(meal_time, 'Breakfast', 'Lunch', 'Snack', 'Dinner', 'All'), diet_category, item_name`);
    return rows;
};

exports.addFoodMenu = async (data) => {
    const { meal_time, diet_category, item_name, description, status } = data;
    const [result] = await db.execute(
        `INSERT INTO food_menu (meal_time, diet_category, item_name, description, status) VALUES (?, ?, ?, ?, ?)`,
        [meal_time, diet_category, item_name, description || null, status || 'Active']
    );
    return { id: result.insertId, ...data };
};

exports.updateFoodMenu = async (id, data) => {
    const { meal_time, diet_category, item_name, description, status } = data;
    await db.execute(
        `UPDATE food_menu SET meal_time = ?, diet_category = ?, item_name = ?, description = ?, status = ? WHERE id = ?`,
        [meal_time, diet_category, item_name, description || null, status || 'Active', id]
    );
    return { id, ...data };
};

exports.deleteFoodMenu = async (id) => {
    await db.execute(`DELETE FROM food_menu WHERE id = ?`, [id]);
    return { id };
};

// ─── SERVING HISTORY ────────────────────────────────────
exports.getServingHistory = async (startDate, endDate) => {
    let query = `
        SELECT d.*, a.patient_name, u.full_name as delivered_by_name
        FROM dietary_orders d
        JOIN ipd_admissions a ON d.admission_id = a.id
        LEFT JOIN users u ON d.delivered_by = u.id
        WHERE d.status = 'Delivered'
    `;
    const params = [];

    if (startDate && endDate) {
        query += ` AND DATE(d.delivered_at) BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    } else if (startDate) {
        query += ` AND DATE(d.delivered_at) >= ?`;
        params.push(startDate);
    }

    query += ` ORDER BY d.delivered_at DESC`;

    const [rows] = await db.execute(query, params);
    return rows;
};

