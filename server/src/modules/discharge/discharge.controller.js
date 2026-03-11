const dischargeService = require('./discharge.service');

exports.getClearanceStatus = async (req, res) => {
    try {
        const data = await dischargeService.getClearanceStatus(req.params.admissionId);
        res.json(data);
    } catch (err) {
        console.error('GetClearanceStatus Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.clearDepartment = async (req, res) => {
    try {
        const result = await dischargeService.clearDepartment(
            req.params.admissionId, req.body.department, req.user.id, req.body.notes
        );
        res.json({ message: 'Department cleared', ...result });
    } catch (err) {
        console.error('ClearDepartment Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.generateSummary = async (req, res) => {
    try {
        const data = await dischargeService.generateSummary(req.params.admissionId, req.user.id);
        res.json({ message: 'Summary generated', summary: data });
    } catch (err) {
        console.error('GenerateSummary Error:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const data = await dischargeService.getSummary(req.params.admissionId);
        res.json(data);
    } catch (err) {
        console.error('GetSummary Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.finalizeDischarge = async (req, res) => {
    try {
        const result = await dischargeService.finalizeDischarge(
            req.params.admissionId, req.body.follow_up_instructions, req.user.id
        );
        res.json({ message: 'Patient discharged successfully', ...result });
    } catch (err) {
        console.error('FinalizeDischarge Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getBillingFolio = async (req, res) => {
    try {
        const data = await dischargeService.getBillingFolio(req.params.admissionId);
        res.json(data);
    } catch (err) {
        console.error('GetBillingFolio Error:', err);
        res.status(500).json({ message: err.message });
    }
};
