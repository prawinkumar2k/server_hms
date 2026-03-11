const inventoryService = require('./inventory.service');

// Products
exports.getProducts = async (req, res) => {
    try {
        const data = await inventoryService.getAllProducts();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createProduct = async (req, res) => {
    try {
        const data = await inventoryService.createProduct(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        await inventoryService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Indents
exports.getIndents = async (req, res) => {
    try {
        const data = await inventoryService.getAllIndents();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createIndent = async (req, res) => {
    try {
        const data = await inventoryService.createIndent(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateIndentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const data = await inventoryService.updateIndentStatus(req.params.id, status);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Issues
exports.getIssues = async (req, res) => {
    try {
        const data = await inventoryService.getAllIssues();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createIssue = async (req, res) => {
    try {
        const data = await inventoryService.createIssue(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Lab Patients
exports.getLabPatients = async (req, res) => {
    try {
        const data = await inventoryService.getAllLabPatients();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPatient = async (req, res) => {
    try {
        const data = await inventoryService.createPatient(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
