const dailyOpService = require('./daily-op.service');

exports.getDailyOpReport = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }

        const records = await dailyOpService.getRecordsByDate(date);

        // Map to match the frontend expectations if necessary
        // Frontend expects: patient_name, category, status, total_amount, paid_amount
        const mappedRecords = records.map(record => ({
            id: record.id,
            patient_name: record.patient_name,
            mobile_no: record.contact,
            category: record.visit_type,
            status: record.payment_status,
            total_amount: record.total_fees,
            op_fees: record.op_fees
        }));

        res.json(mappedRecords);
    } catch (err) {
        console.error("Error fetching Daily OP report:", err);
        res.status(500).json({ message: 'Error fetching Daily OP report' });
    }
};
