const express = require('express');
const router = express.Router();
const dailyOpController = require('./daily-op.controller');

router.get('/', dailyOpController.getDailyOpReport);

module.exports = router;
