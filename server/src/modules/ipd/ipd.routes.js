const express = require('express');
const router = express.Router();
const controller = require('./ipd.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

router.get('/beds', protect, controller.getBeds);
router.get('/admissions', protect, controller.getAdmissions);
router.post('/admissions', protect, authorizeRoles('Doctor', 'Nurse', 'Receptionist'), controller.admitPatient);
router.post('/admissions/:id/discharge', protect, authorizeRoles('Doctor', 'Nurse', 'Receptionist'), controller.dischargePatient);
router.get('/encounters', protect, controller.getEncountersDashboard);

module.exports = router;
