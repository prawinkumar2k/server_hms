const nurseService = require('./nurse.service');

// ─── VITALS ─────────────────────────────────────────────
exports.recordVitals = async (req, res) => {
    try {
        const data = { ...req.body, recorded_by: req.user.id };
        const result = await nurseService.recordVitals(data);
        res.status(201).json({ message: 'Vitals recorded', ...result });
    } catch (err) {
        console.error('RecordVitals Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getVitals = async (req, res) => {
    try {
        const rows = await nurseService.getVitalsByAdmission(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetVitals Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getLatestVitals = async (req, res) => {
    try {
        const row = await nurseService.getLatestVitals(req.params.admissionId);
        res.json(row);
    } catch (err) {
        console.error('GetLatestVitals Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── eMAR ───────────────────────────────────────────────
exports.getPendingOrders = async (req, res) => {
    try {
        const rows = await nurseService.getPendingOrders(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetPendingOrders Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.acknowledgeOrder = async (req, res) => {
    try {
        const result = await nurseService.acknowledgeOrder(req.params.orderId, req.user.id);
        res.json({ message: 'Order acknowledged', ...result });
    } catch (err) {
        console.error('AcknowledgeOrder Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.administerMedication = async (req, res) => {
    try {
        const data = { ...req.body, administered_by: req.user.id };
        const result = await nurseService.administerMedication(data);
        res.status(201).json({ message: 'Medication administered', ...result });
    } catch (err) {
        console.error('AdministerMedication Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getEmar = async (req, res) => {
    try {
        const rows = await nurseService.getEmarByAdmission(req.params.admissionId);
        res.json(rows);
    } catch (err) {
        console.error('GetEmar Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── WARD INDENTS ───────────────────────────────────────
exports.createWardIndent = async (req, res) => {
    try {
        const data = { ...req.body, requested_by: req.user.id };
        const result = await nurseService.createWardIndent(data);
        res.status(201).json({ message: 'Ward indent created', ...result });
    } catch (err) {
        console.error('CreateWardIndent Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getWardIndents = async (req, res) => {
    try {
        const rows = await nurseService.getWardIndents(req.query.ward);
        res.json(rows);
    } catch (err) {
        console.error('GetWardIndents Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateWardIndentStatus = async (req, res) => {
    try {
        const result = await nurseService.updateWardIndentStatus(req.params.id, req.body.status, req.user.id);
        res.json({ message: 'Indent status updated', ...result });
    } catch (err) {
        console.error('UpdateWardIndentStatus Error:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── NURSE DASHBOARD ────────────────────────────────────
exports.getDashboard = async (req, res) => {
    try {
        const data = await nurseService.getNurseDashboard();
        res.json(data);
    } catch (err) {
        console.error('NurseDashboard Error:', err);
        res.status(500).json({ message: err.message });
    }
};
