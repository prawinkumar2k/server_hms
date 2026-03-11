const express = require('express');
const router = express.Router();
const prescriptionController = require('./prescription.controller');

router.get('/patient/:id', prescriptionController.getPatientPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionById);
router.get('/', prescriptionController.getAllPrescriptions);
router.post('/', prescriptionController.savePrescription);
router.patch('/:id/status', prescriptionController.updateStatus);

module.exports = router;
