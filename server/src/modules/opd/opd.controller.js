const opdService = require('./opd.service');

exports.getVisits = async (req, res) => {
    try {
        const rows = await opdService.getAllVisits();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching OPD visits' });
    }
};

exports.registerVisit = async (req, res) => {
    try {
        const id = await opdService.registerVisit(req.body);
        res.status(201).json({ message: 'Visit registered', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering visit' });
    }
};

exports.completeVisit = async (req, res) => {
    try {
        await opdService.completeVisit(req.params.id, req.body);
        res.json({ message: 'Visit completed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error completing visit' });
    }
};

exports.deleteVisit = async (req, res) => {
    try {
        await opdService.deleteVisit(req.params.id);
        res.json({ message: 'Visit deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting visit' });
    }
};
