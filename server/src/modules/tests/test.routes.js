const express = require('express');
const router = express.Router();
const testController = require('./test.controller');

router.get('/', testController.getAllTests);
router.post('/', testController.createTest);
router.delete('/:id', testController.deleteTest);

module.exports = router;
