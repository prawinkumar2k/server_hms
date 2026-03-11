const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');
const patientPhotoRoutes = require('./patient.photo.routes');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// Routes
// Protect all routes? For now, let's keep it open or minimal as Client Auth might be tricky to sync immediately.
// But ideally: router.use(protect);

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.patch('/:id/status', patientController.updateStatus);

router.use('/:id/photo', patientPhotoRoutes);

module.exports = router;
