const db = require('../../config/db');

/**
 * Global Search Controller
 * Uses RBAC to filter results across multiple entities
 */
exports.searchAll = async (req, res) => {
    try {
        const { q, type } = req.query;

        // ALLOW empty searches to show "Recent Items"
        // If q is empty, we treat it as a "Show All/Recent" request with a limit
        const isRecentMode = !q || q.trim().length === 0;

        // If it's a short query but not empty, minimal validation (optional, can keep or remove)
        if (!isRecentMode && q.length < 1) {
            return res.json({});
        }

        const role = req.user.role;
        const searchTerm = isRecentMode ? '%' : `%${q}%`;
        const results = {};

        // Role Permission Mapping
        const permissions = {
            'Admin': ['patients', 'doctors', 'appointments', 'medicines', 'users'],
            'Doctor': ['patients', 'appointments', 'medicines', 'lab_reports', 'prescriptions'],
            'Receptionist': ['patients', 'doctors', 'appointments', 'users'],
            'Nurse': ['patients', 'doctors', 'appointments'],
            'Pharmacist': ['patients', 'medicines', 'prescriptions'],
            'PHARMA_MASTER': ['medicines', 'patients', 'stock_orders', 'suppliers'],
            'LAB_MASTER': ['patients', 'lab_tests'],
            'Lab Technician': ['patients', 'lab_tests']
        };

        let allowedEntities = permissions[role] || [];

        // If 'type' is provided (context-based search), strict filter
        if (type && allowedEntities.includes(type)) {
            allowedEntities = [type];
        } else if (type && !allowedEntities.includes(type)) {
            return res.json({});
        }

        const queries = [];

        // Helper to add ORDER BY for recents
        const orderByClause = isRecentMode ? 'ORDER BY id DESC' : '';
        // Note: Not all tables have 'id' as primary key, handled individually below

        // --- PATIENTS ---
        if (allowedEntities.includes('patients')) {
            queries.push(
                db.execute(`
                    SELECT cusId as id, cusName as full_name, MobileNo as mobile, PSex as gender, PAge as age 
                    FROM copy_of_patientdetaiils
                    WHERE cusName LIKE ? OR MobileNo LIKE ? OR cusId LIKE ? 
                    ORDER BY cusId DESC
                    LIMIT 5
                `, [searchTerm, searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'patients', data: rows }))
                    .catch((e) => { console.error(e); return { type: 'patients', data: [] }; })
            );
        }

        // --- DOCTORS ---
        if (allowedEntities.includes('doctors')) {
            const cleanQ = q ? q.replace(/^(dr\.|dr\s|doctor\s)/i, '').trim() : '';
            const cleanSearchTerm = `%${cleanQ}%`;

            queries.push(
                db.execute(`
                    SELECT u.id, u.full_name, dp.department, dp.availability_status
                    FROM users u
                    LEFT JOIN doctor_profiles dp ON u.id = dp.user_id
                    WHERE u.role = 'Doctor' AND (u.full_name LIKE ? OR u.full_name LIKE ? OR dp.department LIKE ?)
                    ORDER BY u.id DESC
                    LIMIT 5
                `, [searchTerm, cleanSearchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'doctors', data: rows }))
                    .catch(() => ({ type: 'doctors', data: [] }))
            );
        }

        // --- APPOINTMENTS ---
        if (allowedEntities.includes('appointments')) {
            queries.push(
                db.execute(`
                    SELECT a.id, a.patient_name, a.doctor_name, a.visit_date, a.status 
                    FROM appointments a
                    WHERE (a.patient_name LIKE ? OR a.doctor_name LIKE ? OR a.id LIKE ?)
                    ORDER BY a.id DESC
                    LIMIT 5
                `, [searchTerm, searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'appointments', data: rows }))
                    .catch(() => ({ type: 'appointments', data: [] }))
            );
        }

        // --- MEDICINES (PHARMACY) ---
        if (allowedEntities.includes('medicines')) {
            queries.push(
                db.execute(`
                    SELECT Pcode as id, ProductName as name, Description as description, Stock as stock, Amount as price
                    FROM product
                    WHERE ProductName LIKE ? OR Pcode LIKE ? OR Description LIKE ?
                    LIMIT 5
                `, [searchTerm, searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'medicines', data: rows }))
                    .catch((err) => { console.error('Medicine search err', err); return { type: 'medicines', data: [] }; })
            );
        }

        // --- SUPPLIERS (PHARMA) ---
        if (allowedEntities.includes('stock_orders') || role === 'PHARMA_MASTER') {
            queries.push(
                db.execute(`
                    SELECT id, supplier_name, contact_person, phone
                    FROM suppliers
                    WHERE supplier_name LIKE ? OR contact_person LIKE ?
                    ORDER BY id DESC
                    LIMIT 5
                `, [searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'suppliers', data: rows }))
                    .catch(() => ({ type: 'suppliers', data: [] }))
            );
        }

        // --- STOCK ORDERS (PHARMA) ---
        if (allowedEntities.includes('stock_orders')) {
            queries.push(
                db.execute(`
                    SELECT o.id, o.order_number, s.supplier_name, o.order_status, o.total_amount
                    FROM stock_orders o
                    LEFT JOIN suppliers s ON o.supplier_id = s.id
                    WHERE o.order_number LIKE ? OR s.supplier_name LIKE ?
                    ORDER BY o.id DESC
                    LIMIT 5
                `, [searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'stock_orders', data: rows }))
                    .catch(() => ({ type: 'stock_orders', data: [] }))
            );
        }

        // --- PRESCRIPTIONS ---
        if (allowedEntities.includes('prescriptions')) {
            queries.push(
                db.execute(`
                    SELECT id, cusName, pDate as date
                    FROM prescriptions 
                    WHERE cusName LIKE ? OR id LIKE ?
                    ORDER BY id DESC
                    LIMIT 5
                `, [searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'prescriptions', data: rows }))
                    .catch(() => ({ type: 'prescriptions', data: [] }))
            );
        }

        // --- LAB TESTS ---
        if (allowedEntities.includes('lab_tests')) {
            queries.push(
                db.execute(`
                    SELECT TestCode, TestName, Amount, Investigation 
                    FROM test_master 
                    WHERE TestName LIKE ? OR TestCode LIKE ?
                    LIMIT 5
                `, [searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'lab_tests', data: rows }))
                    .catch(() => ({ type: 'lab_tests', data: [] }))
            );
        }

        // --- USERS (Staff) ---
        if (allowedEntities.includes('users') && role === 'Admin') {
            queries.push(
                db.execute(`
                    SELECT id, full_name, role, username
                    FROM users 
                    WHERE (full_name LIKE ? OR username LIKE ?) AND role != 'Patient'
                    ORDER BY id DESC
                    LIMIT 5
                `, [searchTerm, searchTerm])
                    .then(([rows]) => ({ type: 'users', data: rows }))
                    .catch(() => ({ type: 'users', data: [] }))
            );
        }

        // Execute all permissible queries concurrently
        const queryResults = await Promise.all(queries);

        // Aggregate results
        queryResults.forEach(res => {
            if (res && res.data && res.data.length > 0) {
                results[res.type] = res.data;
            }
        });

        res.json(results);

    } catch (error) {
        console.error('Global Search Error:', error);
        res.status(500).json({ message: 'Search failed' });
    }
};
