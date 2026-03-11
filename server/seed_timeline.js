const db = require('./src/config/db');

(async () => {
    try {
        const patientName = 'INDHUMATHI';

        console.log(`Seeding data for ${patientName}...`);

        // 1. OPD Visit
        await db.execute(`
            INSERT INTO opd_visits (patient_name, age, gender, contact, doctor_name, visit_date, symptoms, diagnosis, status)
            VALUES (?, 30, 'Female', '1234567890', 'Dr. Smith', NOW(), 'Fever and cold', 'Viral Infection', 'Completed')
        `, [patientName]);

        // 2. Appointment
        await db.execute(`
            INSERT INTO appointments (patient_name, doctor_name, date, time, status, reason)
            VALUES (?, 'Dr. Smith', CURDATE(), '10:00:00', 'Scheduled', 'General Checkup')
        `, [patientName]);

        // 3. Prescription
        // Note: Prescriptions table uses 'cusName'
        await db.execute(`
            INSERT INTO prescriptions (cusName, pAge, psex, pDate, Disease, docNote, status)
            VALUES (?, 30, 'Female', NOW(), 'Viral Fever', 'Take rest', 'Active')
        `, [patientName]);

        console.log("Mock data inserted successfully.");
        process.exit(0);

    } catch (err) {
        console.error("Seeding Failed:");
        console.error(err);
        process.exit(1);
    }
})();
