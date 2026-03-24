const express = require('express');
const router = express.Router();
const labController = require('./lab.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');
const { cacheResponse } = require('../../middlewares/cache.middleware');


// Doctor Entry / Referral
router.get('/doctors', cacheResponse(60), labController.getDoctors);
router.post('/doctors', labController.createDoctor);
router.put('/doctors/:id', labController.updateDoctor);
router.delete('/doctors/:id', labController.deleteDoctor);

// Test Entry
router.post('/test-entry', labController.createTestEntry);
router.get('/test-entry', labController.getTestEntries);
router.get('/test-entry/:id/print', labController.printLabReport);
router.get('/test-entry/:id/download', labController.downloadLabReport);

// Billing
router.post('/billing', labController.createBill);
router.get('/billing', cacheResponse(30), labController.getBills);

// Requests - RBAC Enforced
router.post('/request', protect, authorizeRoles('Doctor', 'Receptionist', 'Admin'), labController.createLabRequest);
router.get('/requests/pending', protect, authorizeRoles('Doctor', 'Lab Technician', 'LAB_MASTER', 'Admin'), labController.getPendingRequests);
router.put('/request/:id/status', protect, authorizeRoles('Lab Technician', 'LAB_MASTER', 'Admin'), labController.updateRequestStatus);

// Test Entry - Execution requires approval check (handled in controller) but role must be Technician or Master
router.post('/test-entry', protect, authorizeRoles('Lab Technician', 'LAB_MASTER', 'Admin'), labController.createTestEntry);


// Helpers
router.get('/patients', labController.searchPatients);
router.get('/tests', cacheResponse(60), labController.getTests);
router.get('/next-id', labController.getNextTestId);

module.exports = router;
