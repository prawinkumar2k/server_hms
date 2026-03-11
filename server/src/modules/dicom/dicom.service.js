const db = require('../../config/db');

// Orthanc URL from env or fallback for local Dev/Docker
const ORTHANC_SERVER_URL = process.env.ORTHANC_SERVER_URL || 'http://hms-orthanc:8042';

// In browser, Orthanc will be loaded directly from local network or public IP proxy.
// If not configured, we assume localhost:8042 for local doctor machines connecting to Orthanc
const ORTHANC_BROWSER_URL = process.env.ORTHANC_BROWSER_URL || 'http://localhost:8042';

exports.getStudiesByPatientId = async (patientId) => {
    // Optionally trigger sync for this patient whenever requested to keep it fresh
    await this.syncOrthancStudies(patientId).catch(err => {
        console.warn('[DICOM Service] Background Sync skipped/failed:', err.message);
    });

    const [studies] = await db.execute(
        `SELECT * FROM dicom_studies WHERE patient_id = ? ORDER BY created_at DESC`,
        [patientId]
    );
    return studies;
};

exports.getStudyViewerUrl = async (studyId) => {
    const [rows] = await db.execute(`SELECT * FROM dicom_studies WHERE id = ?`, [studyId]);
    if (rows.length === 0) return null;

    const orthancId = rows[0].orthanc_study_id;
    // Build WADO link for IFRAME using the browser-accessible URL
    const viewerUrl = `${ORTHANC_BROWSER_URL}/app/explorer.html#study?uuid=${orthancId}`;

    return { ...rows[0], viewerUrl };
};

exports.syncOrthancStudies = async (specificPatientId = null) => {
    try {
        const response = await fetch(`${ORTHANC_SERVER_URL}/studies`);
        if (!response.ok) throw new Error('Orthanc unreachable');
        const orthancStudyIds = await response.json();

        let syncedCount = 0;

        for (const orthancId of orthancStudyIds) {
            // See if already synced
            const [existing] = await db.execute(
                `SELECT id FROM dicom_studies WHERE orthanc_study_id = ?`,
                [orthancId]
            );

            // Need details to identify PatientID (Tag: 0010,0020)
            const detailRes = await fetch(`${ORTHANC_SERVER_URL}/studies/${orthancId}`);
            if (!detailRes.ok) continue;

            const studyDetails = await detailRes.json();

            const dicomPatientId = studyDetails.PatientMainDicomTags?.PatientID;
            if (!dicomPatientId) continue;

            const hmsReqPatientId = parseInt(dicomPatientId, 10);
            if (isNaN(hmsReqPatientId)) continue;

            // Only process matches if specific patient ID requested
            if (specificPatientId && hmsReqPatientId !== parseInt(specificPatientId, 10)) {
                continue;
            }

            if (existing.length === 0) {
                // Confirm patient exists in HMS before writing
                const [patients] = await db.execute(`SELECT id FROM patients WHERE id = ?`, [hmsReqPatientId]);

                if (patients.length > 0) {
                    const studyUid = studyDetails.MainDicomTags?.StudyInstanceUID || null;
                    const studyDateRaw = studyDetails.MainDicomTags?.StudyDate || null;

                    let formattedDate = null;
                    if (studyDateRaw && studyDateRaw.length === 8) {
                        formattedDate = `${studyDateRaw.substring(0, 4)}-${studyDateRaw.substring(4, 6)}-${studyDateRaw.substring(6, 8)} 00:00:00`;
                    }

                    await db.execute(
                        `INSERT INTO dicom_studies (patient_id, orthanc_study_id, study_instance_uid, study_date) 
                         VALUES (?, ?, ?, ?)`,
                        [hmsReqPatientId, orthancId, studyUid, formattedDate || new Date()]
                    );
                    syncedCount++;
                }
            }
        }
        return { synced: syncedCount, totalProcessed: orthancStudyIds.length };
    } catch (error) {
        console.error('[DICOM Service] Sync Error:', error.message);
        throw error;
    }
};
