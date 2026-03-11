const express = require('express');
const router = express.Router();
const controller = require('./timeline.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/', protect, controller.getTimeline);

module.exports = router;
