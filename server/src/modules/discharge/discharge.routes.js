const express = require('express');
const router = express.Router();
const ctrl = require('./discharge.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// Clearance tracking
router.get('/clearance/:admissionId', protect, ctrl.getClearanceStatus);
router.post('/clearance/:admissionId/clear', protect, authorizeRoles('Doctor', 'Nurse', 'Pharmacist', 'Pantry', 'Accountant', 'Admin'), ctrl.clearDepartment);

// Discharge summary
router.post('/summary/:admissionId/generate', protect, authorizeRoles('Doctor', 'Admin'), ctrl.generateSummary);
router.get('/summary/:admissionId', protect, ctrl.getSummary);

// Finalize discharge
router.post('/finalize/:admissionId', protect, authorizeRoles('Doctor', 'Admin'), ctrl.finalizeDischarge);

// Billing folio
router.get('/folio/:admissionId', protect, ctrl.getBillingFolio);

module.exports = router;
