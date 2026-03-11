const express = require('express');
const router = express.Router();
const controller = require('./appointment.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

router.get('/', protect, controller.getAppointments);
router.post('/', protect, authorizeRoles('Doctor', 'Receptionist', 'Nurse'), controller.createAppointment);
router.put('/:id/status', protect, authorizeRoles('Doctor', 'Receptionist', 'Nurse'), controller.updateStatus);
router.delete('/:id', protect, authorizeRoles('Doctor', 'Receptionist', 'Nurse'), controller.deleteAppointment);

router.get('/transactions', protect, controller.getTransactions);
router.post('/transactions', protect, controller.createTransaction);

module.exports = router;
