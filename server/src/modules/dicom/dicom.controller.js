const dicomService = require('./dicom.service');

exports.getPatientStudies = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const studies = await dicomService.getStudiesByPatientId(patientId);
        res.status(200).json({ status: 'success', data: studies });
    } catch (error) {
        console.error('[DICOM Controller] Error fetching patient studies:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch DICOM studies' });
    }
};

exports.viewStudy = async (req, res) => {
    try {
        const studyId = req.params.studyId;
        const studyData = await dicomService.getStudyViewerUrl(studyId);
        if (!studyData) {
            return res.status(404).json({ status: 'error', message: 'Study not found' });
        }
        res.status(200).json({ status: 'success', data: studyData });
    } catch (error) {
        console.error('[DICOM Controller] Error getting viewer URL:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate viewer URL' });
    }
};

exports.syncStudies = async (req, res) => {
    try {
        const result = await dicomService.syncOrthancStudies();
        res.status(200).json({ status: 'success', data: result, message: 'Sync complete' });
    } catch (error) {
        console.error('[DICOM Controller] Error syncing studies:', error);
        res.status(500).json({ status: 'error', message: 'Failed to sync studies from Orthanc' });
    }
};
