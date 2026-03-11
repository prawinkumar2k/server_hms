const db = require('../../config/db');

// --- Product Master ---
exports.getAllProducts = async () => {
    const [rows] = await db.execute('SELECT * FROM product');
    return rows;
};

exports.createProduct = async (data) => {
    const { pCode, productName, description, amount, stock, reOrder, scale } = data;
    const query = `INSERT INTO product (Pcode, ProductName, Description, Amount, Stock, ReOrder, Scale) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [pCode, productName, description, amount, stock, reOrder, scale]);
    return data;
};

exports.deleteProduct = async (pcode) => {
    await db.execute('DELETE FROM product WHERE Pcode = ?', [pcode]);
    return { pcode };
};

// --- Product Indent ---
exports.getAllIndents = async () => {
    const [rows] = await db.execute('SELECT * FROM productindent');
    return rows;
};

exports.createIndent = async (data) => {
    // Map Frontend fields to DB schema and generate ID/Date
    const { pCode, pname, requireQty } = data;
    const indentID = `IND${Date.now()}`;
    const indentDate = new Date();
    const indentRisedby = data.indentRisedby || 'Lab Tech';

    const query = `INSERT INTO productindent (indentID, indentDate, pCode, pname, requireQty, indentRisedby, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`;
    await db.execute(query, [indentID, indentDate, pCode, pname, requireQty, indentRisedby]);
    return { ...data, indentID, indentDate, indentRisedby, status: 'Pending' };
};

exports.updateIndentStatus = async (id, status) => {
    // If completing, update the stock
    if (status === 'Completed') {
        const [indents] = await db.execute('SELECT * FROM productindent WHERE indentID = ?', [id]);
        if (indents.length > 0) {
            const indent = indents[0];
            await db.execute('UPDATE product SET Stock = Stock + ? WHERE Pcode = ?', [indent.requireQty, indent.pCode]);
        }
    }

    await db.execute('UPDATE productindent SET status = ? WHERE indentID = ?', [status, id]);
    return { indentID: id, status };
};

// --- Product Issue ---
exports.getAllIssues = async () => {
    const [rows] = await db.execute('SELECT * FROM productissue');
    return rows;
};

exports.createIssue = async (data) => {
    // Map Frontend fields (issueTo, issueQty) to DB schema
    const { pcode, pname, issueTo, issueQty } = data;
    const id = `ISS${Date.now()}`;
    const issueDate = new Date();

    // Handle inconsistencies if frontend sends different casing
    const finalQty = issueQty || data.qty;
    const finalTo = issueTo || data.issuedTo;

    const query = `INSERT INTO productissue (ID, IssueDate, pcode, pname, IssuedTo, Qty) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [id, issueDate, pcode, pname, finalTo, finalQty]);
    return { ...data, id, issueDate };
};

// --- Lab Patients (patientdetaiils table) ---
exports.getAllLabPatients = async () => {
    const [rows] = await db.execute('SELECT * FROM patientdetaiils LIMIT 100');
    return rows;
};

exports.createPatient = async (data) => {
    const { cusId, cusName, PAge, PSex, DocName, RefDoc, Address, MobileNo } = data;
    const newId = cusId || `PID${Date.now()}`;
    const query = `INSERT INTO patientdetaiils (cusId, cusName, PAge, PSex, DocName, RefDoc, Address, MobileNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [newId, cusName, PAge, PSex, DocName, RefDoc, Address, MobileNo]);
    return { ...data, cusId: newId };
};
