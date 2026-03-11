const db = require('../../config/db');

// Mapping helpers
const toModel = (row) => ({
    id: row.cusId || row.SNo, // Use cusId as primary ID if available, else SNo
    sno: row.SNo,
    name: row.cusName,
    age: row.PAge,
    gender: row.PSex,
    phone: row.MobileNo,
    address: row.Address,
    bloodGroup: row.BloodGrp,
    doctor: row.DocName,
    opFee: row.OpFee,
    date: row.pDate,
    status: row.status || 'Waiting',
    photo: row.photo || null
});

exports.getAllPatients = async () => {
    // Fetching from copy_of_patientdetaiils as per existing schema
    const [rows] = await db.execute('SELECT * FROM copy_of_patientdetaiils ORDER BY SNo DESC');
    return rows.map(toModel);
};

exports.getPatientById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM copy_of_patientdetaiils WHERE cusId = ? OR SNo = ?', [id, id]);
    return rows.length > 0 ? toModel(rows[0]) : null;
};

exports.createPatient = async (patientData) => {
    const {
        name, age, gender, phone, mobile,
        address, bloodGroup, doctor, opFee, date
    } = patientData;

    // Handle aliases and defaults
    const pName = name || null;
    const pAge = age || null;
    const pGender = gender || null;
    const pPhone = phone || mobile || null;
    const pAddress = address || null;
    const pBloodGroup = bloodGroup || null;
    const pDoctor = doctor || null;
    const pOpFee = opFee || null;
    const pDate = date || new Date().toISOString().split('T')[0];

    // Generate SNo/cusId (Legacy workaround: Max + 1)
    const [maxRows] = await db.execute('SELECT MAX(CAST(SNo AS UNSIGNED)) as maxSNo FROM copy_of_patientdetaiils');
    const nextId = (maxRows[0].maxSNo || 0) + 1;
    const strId = String(nextId);

    const query = `
        INSERT INTO copy_of_patientdetaiils 
        (SNo, cusId, cusName, PAge, PSex, MobileNo, Address, BloodGrp, DocName, OpFee, pDate, token) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'False')
    `; // Default token False

    await db.execute(query, [
        strId, strId, pName, pAge, pGender, pPhone, pAddress, pBloodGroup, pDoctor, pOpFee, pDate
    ]);

    return { id: strId, ...patientData, status: 'Waiting' };
};

exports.updatePatient = async (id, patientData) => {
    const {
        name, age, gender, phone, mobile,
        address, bloodGroup, doctor, opFee
    } = patientData;

    const pName = name || null;
    const pAge = age || null;
    const pGender = gender || null;
    const pPhone = mobile || phone || null;
    const pAddress = address || null;
    const pBloodGroup = bloodGroup || null;
    const pDoctor = doctor || null;
    const pOpFee = opFee || null;

    const query = `
        UPDATE copy_of_patientdetaiils 
        SET cusName = ?, PAge = ?, PSex = ?, MobileNo = ?, Address = ?, BloodGrp = ?, DocName = ?, OpFee = ?
        WHERE cusId = ? OR SNo = ?
    `;

    await db.execute(query, [
        pName, pAge, pGender, pPhone, pAddress, pBloodGroup, pDoctor, pOpFee, id, id
    ]);

    return { id, ...patientData };
};


exports.updatePatientStatus = async (id, status) => {
    await db.execute('UPDATE copy_of_patientdetaiils SET status = ? WHERE cusId = ? OR SNo = ?', [status, id, id]);
    return { id, status };
};

exports.updatePatient = async (id, data) => {
    const { name, mobile, age, gender, bloodGroup, address, doctor, opFee } = data;

    const query = `
        UPDATE copy_of_patientdetaiils 
        SET cusName = ?, MobileNo = ?, PAge = ?, PSex = ?, BloodGrp = ?, 
            Address = ?, DocName = ?, OpFee = ?
        WHERE cusId = ? OR SNo = ?
    `;

    await db.execute(query, [
        name || null,
        mobile || null,
        age || null,
        gender || null,
        bloodGroup || null,
        address || null,
        doctor || null,
        opFee || 0,
        id, id
    ]);

    return { id, ...data };
};

exports.searchPatients = async (term) => {
    const searchTerm = `%${term}%`;
    const [rows] = await db.execute(
        'SELECT * FROM copy_of_patientdetaiils WHERE cusName LIKE ? OR cusId LIKE ? OR MobileNo LIKE ? ORDER BY SNo DESC LIMIT 20',
        [searchTerm, searchTerm, searchTerm]
    );
    return rows.map(toModel);
};
