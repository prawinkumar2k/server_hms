const db = require('./src/config/db');

async function debugBilling() {
    try {
        const testBill = {
            billNo: 'TEST-' + Date.now(),
            billDate: '2025-01-01',
            patientId: 'P001',
            patientName: 'Test Patient',
            totalAmount: 100,
            gstNo: 'GST123'
        };

        console.log("Attempting insert...");
        const [res] = await db.execute(
            `INSERT INTO lab_bills (bill_no, bill_date, patient_id, patient_name, total_amount, gst_no) VALUES (?, ?, ?, ?, ?, ?)`,
            [testBill.billNo, testBill.billDate, testBill.patientId, testBill.patientName, testBill.totalAmount, testBill.gstNo]
        );
        console.log("Success:", res);

        console.log("Attempting item insert...");
        await db.execute(
            `INSERT INTO lab_bill_items (bill_id, pcode, product_name, price, amount) VALUES (?, ?, ?, ?, ?)`,
            [res.insertId, 'T001', 'Test Item', 50, 50]
        );
        console.log("Item Success");

    } catch (e) {
        console.error("DEBUG ERROR:", e);
    }
    process.exit();
}

debugBilling();
