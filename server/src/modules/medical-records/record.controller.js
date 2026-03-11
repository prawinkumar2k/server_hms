const recordService = require('./record.service');

exports.createRecord = async (req, res) => {
    try {
        const record = await recordService.createRecord(req.body);
        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving medical record', error: error.message });
    }
};

exports.getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const records = await recordService.getRecordsByPatientId(patientId);
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching patient history', error: error.message });
    }
};
