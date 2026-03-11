const db = require('./src/config/db');

async function seedDicom() {
  try {
    // 0. Create table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dicom_studies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        orthanc_study_id VARCHAR(255) NOT NULL,
        study_instance_uid VARCHAR(255),
        modality VARCHAR(50),
        study_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      )
    `);
    console.log('Created dicom_studies table');

    // 1. Create dummy patients
    for (let i = 1; i <= 3; i++) {
      const [patientResult] = await db.execute(`
          INSERT INTO patients (name, age, gender, mobile, address, blood_group) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [`Test Patient ${i}`, 30 + i, i % 2 === 0 ? 'Female' : 'Male', '987654321' + i, `${i} Dummy St`, 'O+']);

      const patientId = patientResult.insertId;
      console.log(`Created test patient with ID: ${patientId}`);

      // 2. Create a dummy DICOM entry for each patient
      const fakeOrthancId = `12345678-12345678-12345678-12345678-1234567${i}`;

      await db.execute(`
          INSERT INTO dicom_studies (patient_id, orthanc_study_id, study_instance_uid, modality, study_date)
          VALUES (?, ?, ?, ?, NOW())
        `, [patientId, fakeOrthancId, `1.2.840.113619.2.${i}`, 'CR']);

      console.log(`Created test DICOM study for patient ${patientId}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedDicom();
