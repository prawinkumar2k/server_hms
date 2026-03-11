const express = require('express');
const router = express.Router();
const controller = require('./reports.controller');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

// Generic Report Generation Endpoint
// Example: /api/reports/generate?type=op-history&patientId=123
router.get('/generate', controller.generateReport);

// Report-Specific Routes (if needed for complex payloads)
// router.post('/generate/pharmacy-bill', verifyToken, controller.generatePharmacyBill);

module.exports = router;
