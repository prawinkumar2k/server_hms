const db = require('../../config/db');

exports.getAllTests = async () => {
    const [rows] = await db.execute('SELECT * FROM testmaster');
    return rows; // Return raw rows to match frontend expectation of capitalize keys (or DB keys)
};

exports.createTest = async (data) => {
    const {
        department, dCode, tCode, testType, subTestName, subType, amount, normalValues, units, subTCode
    } = data;

    // Generate ID
    const id = Date.now().toString();

    const query = `
        INSERT INTO testmaster 
        (ID, DCode, Department, TCode, TestType, SubTestName, SubType, NORMALVALUES, Amount, Units, SubTCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
        id, dCode, department, tCode, testType, subTestName, subType, normalValues, amount, units, subTCode
    ]);
    return { id, ...data };
};

exports.deleteTest = async (id) => {
    await db.execute('DELETE FROM testmaster WHERE ID = ?', [id]);
    return { id };
};
