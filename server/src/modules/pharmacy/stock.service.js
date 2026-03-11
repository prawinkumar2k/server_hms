const db = require('../../config/db');
const auditLogger = require('../../utils/auditLogger');

// --- Helpers ---
const generateOrderNumber = async () => {
    const [rows] = await db.execute('SELECT MAX(id) as maxId FROM stock_orders');
    const nextId = (rows[0].maxId || 0) + 1;
    return `PO-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;
};

// ================= SUPPLIERS =================
exports.getSuppliers = async () => {
    const [rows] = await db.execute('SELECT * FROM suppliers ORDER BY supplier_name');
    return rows;
};

exports.createSupplier = async (data) => {
    const { name, contact, phone, email, address } = data;
    const [res] = await db.execute(
        'INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
        [name, contact, phone, email, address]
    );
    return { id: res.insertId, ...data };
};

// ================= ORDERS =================
exports.createOrder = async (data, userId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const { supplierId, items } = data; // items: [{ pcode, qty, price }]
        const orderNo = await generateOrderNumber();

        // 1. Create Order Header
        const [res] = await conn.execute(
            'INSERT INTO stock_orders (order_number, created_by, supplier_id, order_status, total_amount) VALUES (?, ?, ?, "DRAFT", 0)',
            [orderNo, userId, supplierId]
        );
        const orderId = res.insertId;

        // 2. Create Items
        let total = 0;
        for (const item of items) {
            const subtotal = item.qty * item.price;
            total += subtotal;
            await conn.execute(
                'INSERT INTO stock_order_items (stock_order_id, medicine_pcode, ordered_quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.pcode, item.qty, item.price, subtotal]
            );
        }

        // 3. Update Total
        await conn.execute('UPDATE stock_orders SET total_amount = ? WHERE id = ?', [total, orderId]);

        await conn.commit();
        return { id: orderId, orderNumber: orderNo, status: 'DRAFT' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

exports.getOrders = async (filters = {}) => {
    let query = `
        SELECT so.*, s.supplier_name, u.username as created_by_name 
        FROM stock_orders so
        LEFT JOIN suppliers s ON so.supplier_id = s.id
        LEFT JOIN users u ON so.created_by = u.id
        WHERE 1=1
    `;
    const params = [];
    if (filters.status) {
        query += ' AND so.order_status = ?';
        params.push(filters.status);
    }
    query += ' ORDER BY so.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
};

exports.getOrderDetails = async (id) => {
    // Header
    const [orderRows] = await db.execute(`
        SELECT so.*, s.supplier_name, s.phone as supplier_phone, s.email as supplier_email, s.address as supplier_address, 
               u.username as created_by_name
        FROM stock_orders so
        LEFT JOIN suppliers s ON so.supplier_id = s.id
        LEFT JOIN users u ON so.created_by = u.id
        WHERE so.id = ?
    `, [id]);

    if (orderRows.length === 0) return null;

    // Items
    const [itemRows] = await db.execute(`
        SELECT soi.*, p.ProductName, p.ReOrder as threshold, p.Stock as current_stock
        FROM stock_order_items soi
        LEFT JOIN product p ON soi.medicine_pcode = p.Pcode
        WHERE soi.stock_order_id = ?
    `, [id]);

    return { ...orderRows[0], items: itemRows };
};

exports.updateOrderStatus = async (id, status, userId) => {
    await db.execute('UPDATE stock_orders SET order_status = ? WHERE id = ?', [status, id]);
    // Log
    return { id, status };
};

// ================= RECEIVE STOCK =================
exports.receiveOrderItems = async (orderId, receivedItems, userId) => {
    // receivedItems: [{ itemId, quantity }]
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Check Order Status implies we can receive?
        // Typically status should be ORDERED or PARTIALLY_RECEIVED
        const [order] = await conn.execute('SELECT order_status FROM stock_orders WHERE id = ?', [orderId]);
        if (!['ORDERED', 'PARTIALLY_RECEIVED', 'PENDING'].includes(order[0].order_status)) {
            // Maybe allow receiving even if PENDING? Prompt says "Order Status: PENDING -> ORDERED -> RECEIVED"
            // Strict workflow: Draft -> Submit (Pending/Ordered) -> Receive.
        }

        let allReceived = true;
        let anyReceived = false;

        for (const item of receivedItems) {
            // item is { itemId (stock_order_items.id), receivedQty }
            if (item.receivedQty <= 0) continue;

            // 1. Get current item state
            const [rows] = await conn.execute('SELECT * FROM stock_order_items WHERE id = ?', [item.itemId]);
            const dbItem = rows[0];

            // 2. Update Received Qty
            const newReceivedTotal = dbItem.received_quantity + item.receivedQty;
            await conn.execute(
                'UPDATE stock_order_items SET received_quantity = ? WHERE id = ?',
                [newReceivedTotal, item.itemId]
            );

            // 3. UPDATE MASTER STOCK (Strict Rule: Only on Receive)
            await conn.execute(
                'UPDATE product SET Stock = CAST(Stock AS UNSIGNED) + ? WHERE Pcode = ?',
                [item.receivedQty, dbItem.medicine_pcode]
            );

            // Audit
            await auditLogger(
                'STOCK_UPDATE', 'PRODUCT', dbItem.medicine_pcode, userId,
                'RECEIVED', 'UPDATED',
                `Received ${item.receivedQty} units from Order ${orderId}`
            );

            anyReceived = true;
        }

        // 4. Determine New Order Status
        // Check if all items fully received
        const [allItems] = await conn.execute('SELECT ordered_quantity, received_quantity FROM stock_order_items WHERE stock_order_id = ?', [orderId]);

        let fullyComplete = true;
        for (const i of allItems) {
            if (i.received_quantity < i.ordered_quantity) fullyComplete = false;
        }

        const newStatus = fullyComplete ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

        if (anyReceived) {
            await conn.execute('UPDATE stock_orders SET order_status = ? WHERE id = ?', [newStatus, orderId]);
        }

        await conn.commit();
        return { orderId, status: newStatus };
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
};
