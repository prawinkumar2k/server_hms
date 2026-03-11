const express = require('express');
const router = express.Router();
const recordController = require('./record.controller');

router.post('/', recordController.createRecord);
router.get('/:patientId', recordController.getPatientHistory);

module.exports = router;
