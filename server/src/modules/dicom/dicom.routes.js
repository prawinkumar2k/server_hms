const express = require('express');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');
const dicomController = require('./dicom.controller');

const router = express.Router();

// Fetch studies by mapped patient ID
router.get('/patient/:patientId', protect, authorizeRoles('Doctor', 'Admin'), dicomController.getPatientStudies);

// View specific study details and get viewer URL
router.get('/view/:studyId', protect, authorizeRoles('Doctor', 'Admin'), dicomController.viewStudy);

// Sync manually
router.post('/sync', protect, authorizeRoles('Doctor', 'Admin'), dicomController.syncStudies);

module.exports = router;
