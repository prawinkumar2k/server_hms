const express = require('express');
const router = express.Router();
const ctrl = require('./nurse.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// Dashboard
router.get('/dashboard', protect, authorizeRoles('Nurse', 'Admin'), ctrl.getDashboard);

// Vitals
router.post('/vitals', protect, authorizeRoles('Nurse', 'Admin'), ctrl.recordVitals);
router.get('/vitals/:admissionId', protect, authorizeRoles('Nurse', 'Doctor', 'Admin'), ctrl.getVitals);
router.get('/vitals/:admissionId/latest', protect, authorizeRoles('Nurse', 'Doctor', 'Admin'), ctrl.getLatestVitals);

// eMAR
router.get('/emar/:admissionId/pending', protect, authorizeRoles('Nurse', 'Admin'), ctrl.getPendingOrders);
router.put('/emar/acknowledge/:orderId', protect, authorizeRoles('Nurse', 'Admin'), ctrl.acknowledgeOrder);
router.post('/emar/administer', protect, authorizeRoles('Nurse', 'Admin'), ctrl.administerMedication);
router.get('/emar/:admissionId', protect, authorizeRoles('Nurse', 'Doctor', 'Admin'), ctrl.getEmar);

// Ward Indents
router.post('/ward-indent', protect, authorizeRoles('Nurse', 'Admin'), ctrl.createWardIndent);
router.get('/ward-indents', protect, authorizeRoles('Nurse', 'Admin'), ctrl.getWardIndents);
router.put('/ward-indent/:id/status', protect, authorizeRoles('Admin'), ctrl.updateWardIndentStatus);

module.exports = router;
