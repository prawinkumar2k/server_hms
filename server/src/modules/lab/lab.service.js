const db = require('../../config/db');

// Helper to get next ID (since legacy tables use varchar IDs)
const getNextId = async (table) => {
    const [rows] = await db.execute(`SELECT MAX(CAST(ID AS UNSIGNED)) as maxId FROM ${table}`);
    const maxId = rows[0].maxId || 0;
    return (maxId + 1).toString();
};

// Ensure other tables exist (Bills) - Keeping custom billing for specific Lab Billing feature if not fully mapped to legacy yet
// We skip creating lab_doctor_entry and lab_test_entries as we use legacy tables now.
const ensureTablesExist = async () => {
    const createBillingTable = `
        CREATE TABLE IF NOT EXISTS lab_bills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bill_no VARCHAR(50) UNIQUE,
            bill_date DATE,
            patient_id VARCHAR(50),
            patient_name VARCHAR(100),
            total_amount DECIMAL(10,2),
            gst_no VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createBillItemsTable = `
        CREATE TABLE IF NOT EXISTS lab_bill_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bill_id INT,
            pcode VARCHAR(50),
            product_name VARCHAR(100),
            price DECIMAL(10,2),
            amount DECIMAL(10,2),
            FOREIGN KEY (bill_id) REFERENCES lab_bills(id) ON DELETE CASCADE
        )
    `;

    try {
        await db.execute(createBillingTable);
        await db.execute(createBillItemsTable);
        console.log("Verified lab billing tables exist.");
    } catch (error) {
        console.error("Error ensuring lab tables:", error);
    }
};

ensureTablesExist();

// --- Doctors (Mapped to doctordetails) ---
exports.getAllDoctors = async () => {
    // Mapping: ID->id, DocID->docId, DocName->docName, HospitalName->hospitalName, Percentage->percentage, TestName->testName
    const [rows] = await db.execute('SELECT ID as id, DocID as docId, DocName as docName, HospitalName as hospitalName, Percentage as percentage, TestName as testName FROM doctordetails ORDER BY CAST(ID AS UNSIGNED) DESC');
    return rows;
};

exports.createDoctor = async (data) => {
    const { docId, docName, hospitalName, percentage, testName } = data;
    const nextId = await getNextId('doctordetails');

    // Legacy schema uses capitalized column names
    const query = `INSERT INTO doctordetails (ID, DocID, DocName, HospitalName, Percentage, TestName) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [nextId, docId, docName, hospitalName, percentage, testName]);

    return { id: nextId, docId, docName, hospitalName, percentage, testName };
};

exports.updateDoctor = async (id, data) => {
    const { docId, docName, hospitalName, percentage, testName } = data;
    const query = `UPDATE doctordetails SET DocID=?, DocName=?, HospitalName=?, Percentage=?, TestName=? WHERE ID=?`;
    await db.execute(query, [docId, docName, hospitalName, percentage, testName, id]);
    return { id, ...data };
};

exports.deleteDoctor = async (id) => {
    await db.execute('DELETE FROM doctordetails WHERE ID = ?', [id]);
    return { message: 'Deleted successfully', id };
};

// --- Test Entry (Mapped to labtest) ---
exports.createTestEntry = async (data) => {
    // Frontend Data: { patientId, patientName, age, sex, refDoctor, testDate, visitDate, department, testName, subTestName, requestId, requestItemId }
    const { patientId, patientName, age, sex, refDoctor, testDate, visitDate, department, testName, subTestName, requestId, requestItemId } = data;
    const nextId = await getNextId('labtest');

    const query = `INSERT INTO labtest 
        (ID, PatientID, Person, PAge, PSex, RefDoc, TDate, NextDate, Department, TypeTest, SubType) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.execute(query, [
        nextId, patientId, patientName, age, sex, refDoctor, testDate, visitDate, department, testName, subTestName
    ]);

    // Update Request Status if linked
    if (requestId && requestItemId) {
        try {
            // Update Item Status and Link Report ID
            await db.execute('UPDATE lab_request_items SET status = "COMPLETED", report_id = ? WHERE id = ?', [nextId, requestItemId]);

            // Check if all items are completed
            const [pending] = await db.execute('SELECT COUNT(*) as count FROM lab_request_items WHERE request_id = ? AND status != "COMPLETED"', [requestId]);

            if (pending[0].count === 0) {
                await db.execute('UPDATE lab_requests SET status = "COMPLETED" WHERE id = ?', [requestId]);
            } else {
                await db.execute('UPDATE lab_requests SET status = "IN_PROGRESS" WHERE id = ?', [requestId]);
            }
        } catch (e) {
            console.error("Error updating request status:", e);
        }
    }

    return { id: nextId, ...data };
};

exports.getTestEntries = async (filters) => {
    // Retrieve and Map back to frontend camelCase
    let query = `
        SELECT 
            ID as id, 
            PatientID as patientId, 
            Person as patientName, 
            PAge as age, 
            PSex as sex, 
            RefDoc as refDoctor, 
            TDate as testDate, 
            NextDate as visitDate, 
            Department as department, 
            TypeTest as testName, 
            SubType as subTestName 
        FROM labtest WHERE 1=1
    `;
    const params = [];

    if (filters.testId) {
        query += ' AND ID = ?';
        params.push(filters.testId);
    } else if (filters.patientId) {
        // Only checking patient ID if TestID not specific, or allow combined?
        // User workflow implies searching by one or other usually.
        query += ' AND PatientID LIKE ?';
        params.push(`${filters.patientId}%`);
    }


    if (filters.fromDate && filters.toDate) {
        query += ' AND TDate BETWEEN ? AND ?';
        params.push(filters.fromDate, filters.toDate);
    }

    query += ' ORDER BY CAST(ID AS UNSIGNED) DESC LIMIT 100';
    const [rows] = await db.execute(query, params);
    return rows;
};

exports.getTestEntryById = async (id) => {
    const query = `
        SELECT 
            ID as id, 
            PatientID as patientId, 
            Person as patientName, 
            PAge as age, 
            PSex as sex, 
            RefDoc as refDoctor, 
            TDate as testDate, 
            NextDate as visitDate, 
            Department as department, 
            TypeTest as testName, 
            SubType as subTestName,
            TestResult as result,
            PUnit as unit,
            NormalValue as refInterval
        FROM labtest WHERE ID = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

// --- Patient & Master Data Helpers ---
exports.searchPatients = async (term) => {
    // legacy table: copy_of_patientdetaiils
    // Columns: cusId, cusName, MobileNo, PAge, PSex
    const query = `
        SELECT 
            cusId as patientId,
            cusName as patientName,
            MobileNo as mobile,
            PAge as age,
            PSex as sex,
            COALESCE(RefDoc, DocName) as refDoctor
        FROM copy_of_patientdetaiils 
        WHERE cusId LIKE ? OR cusName LIKE ? OR MobileNo LIKE ?
        LIMIT 20
    `;
    const searchParams = [`%${term}%`, `%${term}%`, `%${term}%`];
    const [rows] = await db.execute(query, searchParams);
    return rows;
};

exports.getAllTests = async () => {
    // Fetch unique test types and sub types for dropdowns from testmaster
    const [rows] = await db.execute('SELECT DISTINCT TestType as testName, SubType as subTestName, Department as department, Amount as price FROM testmaster');
    return rows;
};

// --- Billing (Keeping new tables for now as legacy structure is complex) ---
exports.createBill = async (data) => {
    const { billNo, billDate, patientId, patientName, totalAmount, gstNo, items } = data;

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        let finalBillNo = billNo;
        // Generate Auto Bill No if needed
        if (billNo === 'Auto') {
            const [rows] = await conn.execute('SELECT MAX(id) as maxId FROM lab_bills');
            const nextId = (rows[0].maxId || 0) + 1;
            finalBillNo = `LB${String(nextId).padStart(3, '0')}`;
        }

        const [res] = await conn.execute(
            `INSERT INTO lab_bills (bill_no, bill_date, patient_id, patient_name, total_amount, gst_no) VALUES (?, ?, ?, ?, ?, ?)`,
            [finalBillNo, billDate, patientId, patientName, totalAmount, gstNo]
        );

        const billId = res.insertId;

        for (const item of items) {
            await conn.execute(
                `INSERT INTO lab_bill_items (bill_id, pcode, product_name, price, amount) VALUES (?, ?, ?, ?, ?)`,
                [billId, item.pcode || '', item.productName, item.price, item.amount]
            );
        }

        await conn.commit();
        return { billId, billNo: finalBillNo };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

exports.getAllBills = async () => {
    const [rows] = await db.execute('SELECT * FROM lab_bills ORDER BY id DESC');
    return rows;
};

// --- Lab Requests ---
exports.createLabRequest = async (data) => {
    const { patientId, patientName, doctorId, doctorName, priority, notes, tests } = data;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [res] = await conn.execute(
            `INSERT INTO lab_requests (patient_id, patient_name, doctor_id, doctor_name, priority, notes) VALUES (?, ?, ?, ?, ?, ?)`,
            [patientId, patientName, doctorId, doctorName, priority || 'Routine', notes]
        );
        const uniqueId = res.insertId;

        for (const test of tests) {
            await conn.execute(
                `INSERT INTO lab_request_items (request_id, test_name, category, price) VALUES (?, ?, ?, ?)`,
                [uniqueId, test.name, test.category || 'General', test.price || 0]
            );
        }
        await conn.commit();
        return { id: uniqueId, ...data };
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
};

exports.getLabRequests = async (status = 'PENDING') => {
    // Get requests
    const [reqs] = await db.execute('SELECT * FROM lab_requests WHERE status = ? ORDER BY request_date DESC', [status]);

    for (const req of reqs) {
        const [items] = await db.execute('SELECT *, report_id FROM lab_request_items WHERE request_id = ?', [req.id]);
        req.tests = items;
    }
    return reqs;
};

exports.updateLabRequestStatus = async (id, status, masterId, remarks) => {
    // Check previous status first for audit returns if needed, but controller handles audit usually.
    await db.execute(
        `UPDATE lab_requests SET status = ?, approved_by = ?, remarks = ?, approval_date = NOW() WHERE id = ?`,
        [status, masterId, remarks, id]
    );
    return { id, status };
};


exports.getNextTestId = async () => {
    try {
        const [rows] = await db.execute('SELECT MAX(CAST(ID AS UNSIGNED)) as maxId FROM labtest');
        const currentMax = Number(rows[0].maxId) || 0;

        // If table is empty or currentMax is 0, start at 1.
        // Else increment.
        const next = currentMax + 1;

        return next;
    } catch (e) {
        console.error("Error generating ID:", e);
        return 1;
    }
};
