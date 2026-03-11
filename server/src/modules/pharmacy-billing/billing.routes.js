const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

router.post('/bill', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), billingController.createBill);
router.post('/return', protect, authorizeRoles('Pharmacist', 'PHARMA_MASTER', 'Admin'), billingController.createReturn);

router.get('/reports/bill', billingController.getBillReport);
router.get('/reports/credit', billingController.getCreditReport);
router.get('/patient-financials/:patientId', billingController.getPatientFinancialProfile);

module.exports = router;
