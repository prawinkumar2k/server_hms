const ipdService = require('./ipd.service');

exports.getBeds = async (req, res) => {
    try {
        const rows = await ipdService.getAllBeds();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching beds' });
    }
};

exports.getAdmissions = async (req, res) => {
    try {
        const status = req.query.status || 'Admitted';
        const rows = await ipdService.getAdmissions(status);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching admissions' });
    }
};

exports.admitPatient = async (req, res) => {
    try {
        const id = await ipdService.admitPatient(req.body);
        res.status(201).json({ message: 'Patient admitted', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Error admitting patient' });
    }
};

exports.dischargePatient = async (req, res) => {
    try {
        const result = await ipdService.dischargePatient(req.params.id);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getEncountersDashboard = async (req, res) => {
    try {
        const result = await ipdService.getEncountersDashboard();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching encounters dashboard' });
    }
};
