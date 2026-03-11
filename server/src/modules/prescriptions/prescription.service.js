const db = require('../../config/db');

// Map DB columns to clean model
const toModel = (row) => ({
    id: row.id, // Primary Key
    patientName: row.cusName,
    patientId: row.cusId,
    date: row.pDate,
    diagnosis: row.Disease,
    notes: row.docNote,
    vitals: {
        temp: row.temp,
        bp: row.BP
    },
    medicines: [
        { tablet: row.Tab1, qty: row.qty1, food: row.food1, morn: row.morn1, noon: row.noon1, night: row.night1, days: row.Noday1 },
        { tablet: row.Tab2, qty: row.qty2, food: row.food2, morn: row.morn2, noon: row.noon2, night: row.night2, days: row.Noday2 },
        { tablet: row.Tab3, qty: row.qty3, food: row.food3, morn: row.morn3, noon: row.noon3, night: row.night3, days: row.Noday3 },
        { tablet: row.Tab4, qty: row.qty4, food: row.food4, morn: row.morn4, noon: row.noon4, night: row.night4, days: row.Noday4 }
    ].filter(m => m.tablet && m.tablet !== 'nan' && m.tablet !== 'null' && m.tablet !== ''),
    status: row.status || 'Completed'
});

exports.getPrescriptionsByPatientId = async (patientId) => {
    // The schema uses 'cusId' for patient ID
    const [rows] = await db.execute('SELECT * FROM prescriptions WHERE cusId = ? ORDER BY pDate DESC', [patientId]);
    return rows.map(toModel);
};

exports.getPrescriptionById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM prescriptions WHERE id = ?', [id]);
    return rows.length > 0 ? toModel(rows[0]) : null;
};

exports.getAllPrescriptions = async (statusFilter) => {
    let query = 'SELECT * FROM prescriptions ';
    const params = [];

    if (statusFilter) {
        query += 'WHERE status = ? ';
        params.push(statusFilter);
    }

    query += 'ORDER BY pDate DESC LIMIT 100';

    const [rows] = await db.execute(query, params);
    return rows.map(toModel);
};

exports.createPrescription = async (data) => {
    // This is a flattened insert. 
    // We need to map the incoming structured data back to Tab1, Tab2, etc.
    const { patientId, patientName, age, gender, date, diagnosis, notes, vitals, medicines } = data;

    // Helper to get med at index (returns nulls if undefined to satisfy strict SQL if needed)
    const getMed = (i) => {
        const m = medicines[i] || {};
        return {
            name: m.name || '',
            qty: m.qty || '',
            food: m.food || '',
            morning: m.morning || '',
            noon: m.noon || '',
            night: m.night || '',
            days: m.days || ''
        };
    };

    const query = `
        INSERT INTO prescriptions 
        (cusId, cusName, pAge, psex, pDate, Disease, docNote, temp, BP,
         Tab1, qty1, food1, morn1, noon1, night1, Noday1,
         Tab2, qty2, food2, morn2, noon2, night2, Noday2,
         Tab3, qty3, food3, morn3, noon3, night3, Noday3,
         Tab4, qty4, food4, morn4, noon4, night4, Noday4,
         status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?
        )
    `;

    const status = data.status || 'PENDING_PHARMACY';

    const params = [
        patientId, patientName, age, gender, date, diagnosis, notes, vitals?.temp, vitals?.bp,
        getMed(0).name, getMed(0).qty, getMed(0).food, getMed(0).morning, getMed(0).noon, getMed(0).night, getMed(0).days,
        getMed(1).name, getMed(1).qty, getMed(1).food, getMed(1).morning, getMed(1).noon, getMed(1).night, getMed(1).days,
        getMed(2).name, getMed(2).qty, getMed(2).food, getMed(2).morning, getMed(2).noon, getMed(2).night, getMed(2).days,
        getMed(3).name, getMed(3).qty, getMed(3).food, getMed(3).morning, getMed(3).noon, getMed(3).night, getMed(3).days,
        status
    ];

    await db.execute(query, params);
    return { success: true, ...data };
};

exports.updatePrescriptionStatus = async (id, status) => {
    await db.execute('UPDATE prescriptions SET status = ? WHERE id = ?', [status, id]);
    return { id, status };
};
