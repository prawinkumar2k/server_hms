const roundsService = require('./ipd-rounds.service');

exports.addRound = async (req, res) => {
    try {
        const data = { ...req.body, doctor_id: req.user.id };
        const result = await roundsService.addRound(data);
        res.status(201).json({ message: 'Round recorded', ...result });
    } catch (err) {
        console.error('AddRound Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getRounds = async (req, res) => {
    try {
        const rows = await roundsService.getRounds(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetRounds Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const data = { ...req.body, ordered_by: req.user.id };
        const result = await roundsService.createOrder(data);
        res.status(201).json({ message: 'Order created', ...result });
    } catch (err) {
        console.error('CreateOrder Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const rows = await roundsService.getOrders(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetOrders Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const result = await roundsService.cancelOrder(req.params.orderId);
        res.json({ message: 'Order cancelled', ...result });
    } catch (err) {
        console.error('CancelOrder Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.initiateDischarge = async (req, res) => {
    try {
        const result = await roundsService.initiateDischarge(req.params.admissionId, req.user.id);
        res.json({ message: 'Discharge initiated', ...result });
    } catch (err) {
        console.error('InitiateDischarge Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getMyIPDPatients = async (req, res) => {
    try {
        const rows = await roundsService.getMyIPDPatients(req.user.id);
        res.json(rows);
    } catch (err) {
        console.error('GetMyIPDPatients Error:', err);
        res.status(500).json({ message: err.message });
    }
};
