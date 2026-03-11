const express = require('express');
const router = express.Router();
const ctrl = require('./ipd-rounds.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// Doctor IPD Patient List
router.get('/patients', protect, authorizeRoles('Doctor', 'Admin'), ctrl.getMyIPDPatients);

// Rounds (SOAP Notes)
router.post('/rounds', protect, authorizeRoles('Doctor', 'Admin'), ctrl.addRound);
router.get('/rounds/:admissionId', protect, authorizeRoles('Doctor', 'Nurse', 'Admin'), ctrl.getRounds);

// Orders (Medications, Procedures, Diet, Labs, Consumables)
router.post('/orders', protect, authorizeRoles('Doctor', 'Admin'), ctrl.createOrder);
router.get('/orders/:admissionId', protect, authorizeRoles('Doctor', 'Nurse', 'Admin'), ctrl.getOrders);
router.put('/orders/:orderId/cancel', protect, authorizeRoles('Doctor', 'Admin'), ctrl.cancelOrder);

// Discharge Initiation
router.post('/discharge/:admissionId', protect, authorizeRoles('Doctor', 'Admin'), ctrl.initiateDischarge);

module.exports = router;
