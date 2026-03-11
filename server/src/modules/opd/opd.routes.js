const express = require('express');
const router = express.Router();
const controller = require('./opd.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/', protect, controller.getVisits);
router.post('/', protect, controller.registerVisit);
router.put('/:id/complete', protect, controller.completeVisit);
router.delete('/:id', protect, controller.deleteVisit);

module.exports = router;
