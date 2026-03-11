const db = require('../../config/db');

// --- Helper for IDs ---
const getNextId = async (table, col = 'SNo') => {
    try {
        const [rows] = await db.execute(`SELECT MAX(CAST(${col} AS UNSIGNED)) as maxId FROM ${table}`);
        const max = rows[0].maxId || 0;
        return String(max + 1);
    } catch (e) { return '1'; }
};

// ================= REPORTS =================
exports.getDailyReport = async (date) => {
    const reportDate = date ? date : new Date().toISOString().split('T')[0];

    // 1. Get Summary Stats (Total Bills, Total Revenue, Payment Modes)
    const [summaryRows] = await db.execute(`
        SELECT 
            COUNT(DISTINCT RNo) as totalBills,
            SUM(TotalAmount) as totalRevenue,
            SUM(CASE WHEN TermsPay = 'Cash' THEN TotalAmount ELSE 0 END) as cashRevenue,
            SUM(CASE WHEN TermsPay = 'Card' THEN TotalAmount ELSE 0 END) as cardRevenue,
            SUM(CASE WHEN TermsPay = 'UPI' THEN TotalAmount ELSE 0 END) as upiRevenue
        FROM (
            SELECT DISTINCT RNo, TermsPay, MAX(CAST(GrandTotal AS DECIMAL(10,2))) as TotalAmount
            FROM billdetails
            WHERE BillType = 'Pharma' 
            AND PDate LIKE ?
            GROUP BY RNo, TermsPay
        ) as daily_summary
    `, [`${reportDate}%`]);

    // 2. Get Detailed Bill List
    const [billRows] = await db.execute(`
        SELECT 
            RNo as billNo, 
            MAX(PDate) as date,
            MAX(CusName) as patientName,
            MAX(MobileNo) as mobileNo,
            MAX(TermsPay) as paymentMode,
            MAX(CAST(GrandTotal AS DECIMAL(10,2))) as amount,
            GROUP_CONCAT(CONCAT(ProductName, ' (x', Qty, ')') SEPARATOR ', ') as items
        FROM billdetails
        WHERE BillType = 'Pharma'
        AND PDate LIKE ?
        GROUP BY RNo
        ORDER BY CAST(RNo AS UNSIGNED) DESC
    `, [`${reportDate}%`]);

    return {
        date: reportDate,
        summary: {
            totalBills: summaryRows[0].totalBills || 0,
            revenue: summaryRows[0].totalRevenue || 0,
            cash: summaryRows[0].cashRevenue || 0,
            card: summaryRows[0].cardRevenue || 0,
            upi: summaryRows[0].upiRevenue || 0
        },
        bills: billRows
    };
};

// ================= STATS (Strict Mapping - CORRECTED to billdetails) =================
// Note: User asked for 'custransaction' but that table lacks required columns (GrandTotal, BillType, etc).
// 'billdetails' is the actual table containing Billing/POS transactions.
exports.getDashboardStats = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. Today's Sales (Count of Paid Transactions Today)
    // Using `billdetails` filtering by BillType='Pharma'
    // NOTE: We group by RNo (BillNo) because billdetails has one row per ITEM.
    const [salesCountRows] = await db.execute(`
        SELECT COUNT(DISTINCT RNo) as count 
        FROM billdetails 
        WHERE BillType = 'Pharma' 
        AND Status = 'Paid' 
        AND PDate LIKE ?
    `, [`${today}%`]);

    // 2. Today's Revenue (Sum of Paid Transactions Today)
    // Since billdetails has one row per item, summing GrandTotal works IF GrandTotal is per-bill.
    // BUT usually GrandTotal is repeated or split. 
    // Wait, in billing.service.js: GrandTotal = netAmount (Total Bill Amount).
    // If a bill has 5 items, there are 5 rows, each with the SAME GrandTotal.
    // If we sum GrandTotal, we get 5x the revenue. WRONG.
    // CORRECT APPROACH: Sum distinct bill amounts.
    // "SELECT SUM(GrandTotal) FROM (SELECT DISTINCT RNo, GrandTotal FROM billdetails ...)"
    const [revenueRows] = await db.execute(`
        SELECT SUM(GrandTotal) as total FROM (
            SELECT DISTINCT RNo, GrandTotal 
            FROM billdetails 
            WHERE BillType = 'Pharma' 
            AND Status = 'Paid' 
            AND PDate LIKE ?
        ) as unique_bills
    `, [`${today}%`]);

    // 3. Today's Customers (Count of Distinct Customers Today)
    const [customerRows] = await db.execute(`
        SELECT COUNT(DISTINCT MobileNo) as count 
        FROM billdetails 
        WHERE BillType = 'Pharma' 
        AND PDate LIKE ?
    `, [`${today}%`]);

    // 4. Today's Expense (Not Available -> 0)
    const expense = 0;

    // 5. Total Sales (Lifetime Paid Sales)
    const [lifetimeRows] = await db.execute(`
        SELECT SUM(GrandTotal) as total FROM (
            SELECT DISTINCT RNo, GrandTotal 
            FROM billdetails 
            WHERE BillType = 'Pharma' 
            AND Status = 'Paid'
        ) as unique_bills
    `);

    // 6. Store Statistics
    // 7.1 Orders (Total Transactions count)
    const [totalOrdersRows] = await db.execute(`
        SELECT COUNT(DISTINCT RNo) as count 
        FROM billdetails 
        WHERE BillType = 'Pharma'
    `);

    // 7.2 Low Stock (Active Alerts Only - Consistent with Dashboard Widget)
    const [lowStockRows] = await db.execute(`
        SELECT COUNT(*) as count 
        FROM stock_alerts 
        WHERE status = 'ACTIVE'
    `);

    // 7.3 Products (Total count)
    const [productCountRows] = await db.execute('SELECT COUNT(*) as count FROM product');

    // 7.4 Categories (Not Available -> 0)
    const categories = 0;

    // 8. Recent Customers (Last 5 unique)
    // Need to aggregate beacuse of multiple rows per bill
    const [recentCustomers] = await db.execute(`
        SELECT CusName, MobileNo, MAX(PDate) as lastVisit
        FROM billdetails
        WHERE BillType='Pharma'
        GROUP BY CusName, MobileNo
        ORDER BY lastVisit DESC
        LIMIT 5
    `);

    // 9. Recent Transactions (Paid/Pending/All)
    // DISTINCT RNo to avoid duplicates
    const [recentTxns] = await db.execute(`
        SELECT DISTINCT RNo as id, CusName as customer, PDate as date, GrandTotal as amount, Status as status
        FROM billdetails 
        WHERE BillType = 'Pharma' 
        ORDER BY CAST(RNo AS UNSIGNED) DESC 
        LIMIT 10
    `);

    // 10. Sales Trend (Last 7 Days)
    // Complex because we need to sum unique bills per day
    // Query: Get unique bills per day, then sum them up
    // Assuming PDate is 'YYYY-MM-DD'
    const [chartRows] = await db.execute(`
        SELECT Date as name, SUM(Total) as value FROM (
            SELECT PDate as Date, RNo, MAX(CAST(GrandTotal AS DECIMAL(10,2))) as Total
            FROM billdetails
            WHERE BillType='Pharma'
            GROUP BY PDate, RNo
        ) as daily_bills
        GROUP BY Date
        ORDER BY Date DESC
        LIMIT 7
    `);

    return {
        metrics: {
            salesCount: salesCountRows[0].count || 0,
            revenue: revenueRows[0].total || 0,
            customers: customerRows[0].count || 0,
            expense: expense
        },
        inventory: {
            total: productCountRows[0].count || 0,
            lowStock: lowStockRows[0].count || 0,
            categories: categories,
            totalOrders: totalOrdersRows[0].count || 0
        },
        totalSales: lifetimeRows[0].total || 0,
        transactions: recentTxns,
        newCustomers: recentCustomers,
        chartData: chartRows.reverse()
    };
};

// ================= VENDORS =================
exports.getAllVendors = async () => {
    const [rows] = await db.execute('SELECT * FROM vendor ORDER BY CAST(SNo AS UNSIGNED) DESC');
    return rows;
};

exports.createVendor = async (data) => {
    const { companyName, person, address, mobile, contact } = data;
    const nextId = await getNextId('vendor', 'SNo');
    const query = `INSERT INTO vendor (SNo, CompanyName, Person, Address, MobileNo, Contact) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [nextId, companyName, person, address, mobile, contact]);
    return { id: nextId, ...data };
};

exports.updateVendor = async (id, data) => {
    const { companyName, person, address, mobile, contact } = data;
    const query = `UPDATE vendor SET CompanyName=?, Person=?, Address=?, MobileNo=?, Contact=? WHERE SNo=?`;
    await db.execute(query, [companyName, person, address, mobile, contact, id]);
    return { id, ...data };
};

exports.deleteVendor = async (id) => {
    await db.execute('DELETE FROM vendor WHERE SNo = ?', [id]);
    return { id };
};

// ================= STOCK / PRODUCTS =================
exports.getAllProducts = async () => {
    const [rows] = await db.execute('SELECT * FROM product ORDER BY CAST(Pcode AS UNSIGNED) DESC');
    return rows;
};

exports.createProduct = async (data) => {
    const { productName, description, amount, stock, reOrder, scale, expiryDate } = data;
    const nextId = await getNextId('product', 'Pcode');
    const query = `INSERT INTO product (Pcode, ProductName, Description, Amount, Stock, ReOrder, Scale, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [nextId, productName, description, amount, stock, reOrder, scale, expiryDate || null]);
    return { pcode: nextId, ...data };
};

exports.updateProduct = async (id, data) => {
    const { productName, description, amount, stock, reOrder, scale, expiryDate } = data;
    const query = `UPDATE product SET ProductName=?, Description=?, Amount=?, Stock=?, ReOrder=?, Scale=?, ExpiryDate=? WHERE Pcode=?`;
    await db.execute(query, [productName, description, amount, stock, reOrder, scale, expiryDate || null, id]);

    // Check Alerts
    await this.checkAndCreateStockAlert(id);

    return { id, ...data };
};

exports.deleteProduct = async (id) => {
    await db.execute('DELETE FROM product WHERE Pcode = ?', [id]);
    return { id };
};

// ================= PURCHASE ENTRY =================
exports.getAllPurchases = async () => {
    const [rows] = await db.execute('SELECT * FROM purchase ORDER BY PurDate DESC');
    return rows;
};

exports.createPurchase = async (data) => {
    const { purDate, productName, vendor, purRate, purQty, salesRate } = data;
    const query = `INSERT INTO purchase (PurDate, ProductName, Vender, PurRate, PurQty, SalesRate) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [purDate, productName, vendor, purRate, purQty, salesRate]);

    await db.execute(`UPDATE product SET Stock = CAST(Stock AS UNSIGNED) + ? WHERE ProductName = ?`, [purQty, productName]);

    return data;
};

// ================= ENQUIRY DETAILS =================
exports.getAllEnquiries = async () => {
    const [rows] = await db.execute('SELECT * FROM enquiry ORDER BY eDate DESC');
    return rows;
};

exports.createEnquiry = async (data) => {
    const { eDate, regarding, description, person, contact, remark } = data;
    const nextId = await getNextId('enquiry', 'SNo');
    const query = `INSERT INTO enquiry (SNo, eDate, Regarding, Description, Person, Contact, Remark) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [nextId, eDate, regarding, description, person, contact, remark]);
    return { id: nextId, ...data };
};

// ================= PHARMA REQUESTS (APPROVAL) =================
exports.createPharmaRequest = async (prescriptionId) => {
    // Check if exists
    const [existing] = await db.execute('SELECT id FROM pharma_requests WHERE prescription_id = ?', [prescriptionId]);
    if (existing.length > 0) return existing[0]; // Already pending/exists

    const [res] = await db.execute('INSERT INTO pharma_requests (prescription_id, status) VALUES (?, "PENDING")', [prescriptionId]);
    return { id: res.insertId, prescriptionId, status: 'PENDING' };
};

exports.getPendingPharmaRequests = async () => {
    // Join with prescriptions to get details
    // Note: We need to join with 'prescriptions' table.
    const query = `
        SELECT pr.id as requestId, pr.status, pr.created_at, pr.prescription_id,
               p.cusName as patientName, p.pDate as date, p.docNote as notes,
               p.Tab1, p.Tab2, p.Tab3, p.Tab4 -- Basic view
        FROM pharma_requests pr
        JOIN prescriptions p ON pr.prescription_id = p.id
        WHERE pr.status = 'PENDING'
        ORDER BY pr.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
};

exports.updatePharmaRequestStatus = async (id, status, masterId, remarks) => {
    await db.execute(
        `UPDATE pharma_requests SET status = ?, approved_by = ?, remarks = ? WHERE id = ?`,
        [status, masterId, remarks, id]
    );

    // Also update main prescription status if Approved
    if (status === 'APPROVED') {
        // Fetch presc ID first
        const [rows] = await db.execute('SELECT prescription_id FROM pharma_requests WHERE id = ?', [id]);
        if (rows.length > 0) {
            await db.execute('UPDATE prescriptions SET status = "APPROVED_BY_PHARMA" WHERE id = ?', [rows[0].prescription_id]);
        }
    }

    return { id, status };
};

exports.getRequestById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM pharma_requests WHERE id = ?', [id]);
    return rows[0];
};

// ================= STOCK ALERTS =================

exports.checkAndCreateStockAlert = async (pcode) => {
    // 1. Get current stock and threshold
    const [rows] = await db.execute('SELECT Pcode, Stock, ReOrder FROM product WHERE Pcode = ?', [pcode]);
    if (rows.length === 0) return;

    // Safety: ensure numbers
    const stock = parseInt(rows[0].Stock || 0, 10);
    const threshold = parseInt(rows[0].ReOrder || 0, 10);

    let type = null;
    if (stock <= 0) type = 'OUT_OF_STOCK';
    else if (stock <= threshold) type = 'LOW_STOCK';

    if (type) {
        // Check if active alert already exists
        const [existing] = await db.execute(
            'SELECT id FROM stock_alerts WHERE product_pcode = ? AND status = "ACTIVE" AND alert_type = ?',
            [pcode, type]
        );

        if (existing.length === 0) {
            await db.execute(
                'INSERT INTO stock_alerts (product_pcode, alert_type, current_stock, threshold, triggered_at) VALUES (?, ?, ?, ?, NOW())',
                [pcode, type, stock, threshold]
            );
        }
    }
};

exports.getStockAlerts = async (status = 'ACTIVE') => {
    const [rows] = await db.execute(`
        SELECT sa.*, p.ProductName 
        FROM stock_alerts sa
        JOIN product p ON sa.product_pcode = p.Pcode
        WHERE sa.status = ?
        ORDER BY sa.triggered_at DESC
    `, [status]);
    return rows;
};

exports.acknowledgeStockAlert = async (id, userId) => {
    await db.execute(
        'UPDATE stock_alerts SET status = "ACKNOWLEDGED", acknowledged_by = ?, acknowledged_at = NOW() WHERE id = ?',
        [userId, id]
    );
    return { id, status: 'ACKNOWLEDGED' };
};

