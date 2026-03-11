const prescriptionService = require('./prescription.service');

exports.getPatientPrescriptions = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await prescriptionService.getPrescriptionsByPatientId(id);
        res.json(history);
    } catch (error) {
        console.error('Error fetching patient prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};

exports.getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await prescriptionService.getPrescriptionById(id);
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        res.json(prescription);
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ error: 'Failed to fetch prescription' });
    }
};

exports.getAllPrescriptions = async (req, res) => {
    try {
        const history = await prescriptionService.getAllPrescriptions(req.query.status);
        res.json(history);
    } catch (error) {
        console.error('Error fetching all prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};

exports.savePrescription = async (req, res) => {
    try {
        const result = await prescriptionService.createPrescription(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error saving prescription:', error);
        res.status(500).json({ error: 'Failed to save prescription' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await prescriptionService.updatePrescriptionStatus(id, status);
        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating status' });
    }
};
