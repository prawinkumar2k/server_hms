const express = require('express');
const router = express.Router();
const controller = require('./inventory.controller');

// Product Routes
router.get('/products', controller.getProducts);
router.post('/products', controller.createProduct);
router.delete('/products/:id', controller.deleteProduct);

// Indent Routes
router.get('/indents', controller.getIndents);
router.post('/indents', controller.createIndent);
router.put('/indents/:id/status', controller.updateIndentStatus);

// Issue Routes
router.get('/issues', controller.getIssues);
router.post('/issues', controller.createIssue);

// Lab Patient Routes
router.get('/patients', controller.getLabPatients);
router.post('/patients', controller.createPatient);

module.exports = router;
