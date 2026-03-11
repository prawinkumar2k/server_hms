const db = require('../../config/db');

// Helper to get next Bill Number (RNo)
const getNextBillNo = async () => {
    try {
        const [rows] = await db.execute('SELECT MAX(CAST(RNo AS UNSIGNED)) as maxId FROM billdetails');
        return String((rows[0].maxId || 0) + 1);
    } catch (e) { return '1'; }
};

// Helper to get next Return Number
const getNextReturnNo = async () => {
    try {
        const [rows] = await db.execute('SELECT MAX(CAST(Rno AS UNSIGNED)) as maxId FROM productreturn');
        return String((rows[0].maxId || 0) + 1);
    } catch (e) { return '1'; }
};

const pharmacyService = require('../pharmacy/pharmacy.service');

exports.createBill = async (billData) => {
    // 1. Pre-check Stock Availability (Hard Block)
    for (const item of billData.items) {
        const [rows] = await db.execute('SELECT Stock, ProductName FROM product WHERE Pcode = ?', [item.pCode]);
        if (rows.length === 0) {
            throw new Error(`Product not found: ${item.productName}`);
        }
        const currentStock = parseInt(rows[0].Stock || 0, 10);
        if (item.qty > currentStock) {
            throw new Error(`Insufficient Stock for ${item.productName}. Available: ${currentStock}, Requested: ${item.qty}`);
        }
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const {
            billDate, patientId, customerName, mobile, address, gstNo,
            doctorName, paymentMode, // Credit or Cash
            items,
            totalAmount, discount, tax, netAmount
        } = billData;

        const billNo = await getNextBillNo();

        // Insert each item into billdetails
        for (const item of items) {
            const query = `
                INSERT INTO billdetails (
                    PDate, RNo, 
                    Pcode, ProductName, Description, 
                    Qty, Price, Amount, 
                    CusName, CusID, MobileNo, Caddress, GSTNO,
                    Discount, Tax, IGST, GrandTotal, Status, 
                    TermsPay, BillType
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                billDate, billNo,
                item.pCode, item.productName, item.description,
                item.qty, item.price, item.amount,
                customerName, patientId, mobile, address, gstNo,
                discount, tax, "0", netAmount, paymentMode === 'Credit' ? 'Credit' : 'Paid',
                paymentMode, // TermsPay
                'Pharma'     // BillType
            ];

            await conn.execute(query, params);

            // Decrease Stock
            await conn.execute(
                `UPDATE product SET Stock = CAST(Stock AS UNSIGNED) - ? WHERE Pcode = ?`,
                [item.qty, item.pCode]
            );
        }

        await conn.commit();

        // POST-TRANSACTION: Check for Low Stock Alerts
        // Run in background so we don't delay response
        (async () => {
            try {
                for (const item of items) {
                    await pharmacyService.checkAndCreateStockAlert(item.pCode);
                }
            } catch (err) {
                console.error("Background Alert Error:", err);
            }
        })();

        return { billNo, ...billData };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

exports.createReturn = async (returnData) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const {
            returnDate, billNo, items
        } = returnData;

        const returnNo = await getNextReturnNo();

        for (const item of items) {
            const query = `
                INSERT INTO productreturn (
                    Rno, BNO, Pdate, 
                    Pcode, Productname, 
                    ReturnQty, Amount, ReturnAmt, 
                    Discount, GTotal
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Note: Amount usually refers to unit price or total item price. ReturnAmt is refund.
            const params = [
                returnNo, billNo, returnDate,
                item.pCode, item.productName,
                item.returnQty, item.price, item.returnAmount,
                item.discount || 0, item.totalRefund
            ];

            await conn.execute(query, params);

            // Increase Stock
            await conn.execute(
                `UPDATE product SET Stock = CAST(Stock AS UNSIGNED) + ? WHERE Pcode = ?`,
                [item.returnQty, item.pCode]
            );
        }

        await conn.commit();
        return { returnNo };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

exports.getBillReport = async (filters) => {
    let query = `SELECT DISTINCT RNo as billNo, PDate as date, CusName as customer, GrandTotal as total, Status as status FROM billdetails ORDER BY CAST(RNo AS UNSIGNED) DESC LIMIT 100`;
    // Add logic for filters if needed
    const [rows] = await db.execute(query);
    return rows;
};

exports.getCreditReport = async () => {
    const query = `SELECT DISTINCT RNo as billNo, PDate as date, CusName as customer, MobileNo as phone, GrandTotal as total FROM billdetails WHERE Status = 'Credit' ORDER BY CAST(RNo AS UNSIGNED) DESC`;
    const [rows] = await db.execute(query);
    return rows;
};

exports.getPatientFinancialProfile = async (patientId) => {
    console.log(`[BillingService] Fetching profile for Patient: ${patientId}`);

    // 1. Pharmacy Bills (Robust Query for strict SQL mode)
    let pharmaRows = [];
    try {
        const [rows] = await db.execute(`
            SELECT RNo as id, MAX(PDate) as date, 'Pharmacy' as type, MAX(GrandTotal) as amount, 'Medicine Purchase' as 'desc'
            FROM billdetails 
            WHERE CusID = ? 
            GROUP BY RNo
        `, [patientId]);
        pharmaRows = rows;
    } catch (e) {
        console.error("[BillingService] Pharmacy bills fetch error:", e.message);
        // Don't crash full profile if just pharmacy fails, but unlikely if table exists
    }

    // 2. Lab Bills
    let labRows = [];
    try {
        // Attempt to fetch from lab_bills if it exists
        const [lrows] = await db.execute(`
            SELECT id, bill_date as date, 'Lab' as type, total_amount as amount, 'Lab Tests' as 'desc'
            FROM lab_bills 
            WHERE patient_id = ?
        `, [patientId]);
        labRows = lrows;
    } catch (e) {
        // Silent fail for lab_bills as it might not be migrated yet
        // console.warn("[BillingService] Lab bills fetch skipped (table may be missing)"); 
    }

    // 3. Hospital Bills
    let hospitalRows = [];
    try {
        const [hrows] = await db.execute(`
            SELECT bill_no as id, discharge_date as date, 'Hospital' as type, grand_total as amount, CONCAT('IPD Stay - ', total_days, ' Days') as 'desc'
            FROM hospital_bills 
            WHERE patient_id = ?
        `, [patientId]);
        hospitalRows = hrows;
    } catch (e) {
        // Warn but don't crash
        console.warn("[BillingService] Hospital bills fetch error:", e.message);
    }

    // Calculate Grand Total
    const allBills = [...pharmaRows, ...labRows, ...hospitalRows];
    const total = allBills.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    // Get Patient Name (Priority: Hospital > Pharmacy > Unknown)
    let patientName = 'Unknown Patient';

    // Try fetching name from pharmacy records if present
    if (pharmaRows.length > 0) {
        try {
            const [nameRows] = await db.execute('SELECT CusName FROM billdetails WHERE CusID = ? LIMIT 1', [patientId]);
            if (nameRows.length > 0) patientName = nameRows[0].CusName;
        } catch (e) { }
    }

    // Override if hospital record exists (likely more accurate)
    if (hospitalRows.length > 0) {
        try {
            const [nameRows] = await db.execute('SELECT patient_name FROM hospital_bills WHERE patient_id = ? LIMIT 1', [patientId]);
            if (nameRows.length > 0) patientName = nameRows[0].patient_name;
        } catch (e) { }
    }

    // Fallback: If no name found in bills, try patients table
    if (patientName === 'Unknown Patient') {
        try {
            const [pRows] = await db.execute('SELECT name FROM patients WHERE id = ?', [patientId]);
            if (pRows.length > 0) patientName = pRows[0].name;
        } catch (e) { }
    }

    return {
        patientId,
        patientName,
        grandTotal: total,
        pharmacyBills: pharmaRows,
        labBills: labRows,
        hospitalBills: hospitalRows
    };
};
