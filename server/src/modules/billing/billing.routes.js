const express = require('express');
const router = express.Router();
const controller = require('./billing.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/', protect, controller.getInvoices);
router.get('/:id', protect, controller.getInvoice);
router.post('/', protect, controller.createInvoice);
router.post('/:id/payment', protect, controller.recordPayment);
router.delete('/:id', protect, controller.deleteInvoice);

module.exports = router;
