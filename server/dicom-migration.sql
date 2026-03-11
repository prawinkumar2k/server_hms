CREATE TABLE IF NOT EXISTS dicom_studies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    orthanc_study_id VARCHAR(255) NOT NULL,
    study_instance_uid VARCHAR(255),
    modality VARCHAR(50),
    study_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
);