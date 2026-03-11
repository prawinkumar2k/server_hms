const express = require('express');
const router = express.Router();
const logController = require('../controller/logController');

// Define routes
router.get('/', logController.getAllLogs);
router.delete('/cleanup', logController.deleteOldLogs);

module.exports = router;
