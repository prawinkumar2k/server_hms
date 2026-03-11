const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { verifyToken, authorizeRoles, checkPermission } = require('../../middlewares/auth.middleware');

// Public/Reception routes (Protected by token, accessible by Reception, Nurse, Doctor, Admin)
router.get('/', verifyToken, doctorController.getAllDoctors);
router.get('/:id', verifyToken, doctorController.getDoctorById);

// Status update (Admin or maybe Doctor self-update later)
router.put('/:id/status', verifyToken, authorizeRoles('Admin', 'Doctor'), doctorController.updateDoctorStatus);

module.exports = router;
