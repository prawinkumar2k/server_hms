const patientService = require('./patient.service');

exports.getAllPatients = async (req, res) => {
    try {
        const { search } = req.query;
        let patients;
        if (search) {
            patients = await patientService.searchPatients(search);
        } else {
            patients = await patientService.getAllPatients();
        }
        res.json(patients);
    } catch (error) {
        console.error("GET /patients Error:", error);
        res.status(500).json({ message: 'Error fetching patients', error: error.message, stack: error.stack });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient details' });
    }
};

exports.createPatient = async (req, res) => {
    try {
        console.log("POST /api/patients Body:", req.body);
        const newPatient = await patientService.createPatient(req.body || {});
        res.status(201).json(newPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating patient' });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPatient = await patientService.updatePatient(id, req.body || {});
        res.json(updatedPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating patient' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await patientService.updatePatientStatus(id, status);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await patientService.updatePatient(id, req.body);
        res.json(result);
    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
};
