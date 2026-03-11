const db = require('../../config/db');

exports.getAllInvoices = async (date) => {
    let query = 'SELECT * FROM invoices';
    const params = [];

    if (date) {
        query += ' WHERE DATE(invoice_date) = ?';
        params.push(date);
    }

    query += ' ORDER BY invoice_date DESC';
    const [rows] = await db.execute(query, params);
    return rows;
};

exports.getInvoiceById = async (id) => {
    const [inv] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    if (inv.length === 0) return null;
    const [items] = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [id]);
    return { ...inv[0], items };
};

exports.createInvoice = async (data) => {
    const { patient_name, category, items, due_date } = data;

    // Calculate total
    const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [resInv] = await conn.execute(
            'INSERT INTO invoices (patient_name, category, total_amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
            [patient_name, category, total_amount, due_date, 'Pending']
        );
        const invoiceId = resInv.insertId;

        for (const item of items) {
            await conn.execute(
                'INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)',
                [invoiceId, item.description, item.quantity, item.unit_price, item.quantity * item.unit_price]
            );
        }

        await conn.commit();
        return invoiceId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.recordPayment = async (id, amount) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute('UPDATE invoices SET paid_amount = paid_amount + ? WHERE id = ?', [amount, id]);

        // Check if fully paid
        const [rows] = await conn.execute('SELECT total_amount, paid_amount FROM invoices WHERE id = ?', [id]);
        if (rows.length > 0) {
            const { total_amount, paid_amount } = rows[0];
            let status = 'Partial';
            if (parseFloat(paid_amount) >= parseFloat(total_amount)) status = 'Paid';
            await conn.execute('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
        }

        await conn.commit();
        return true;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.deleteInvoice = async (id) => {
    await db.execute('DELETE FROM invoices WHERE id = ?', [id]);
    return true;
};
