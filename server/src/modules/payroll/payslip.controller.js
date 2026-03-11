const payslipService = require('./payslip.service');

exports.getPayslips = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return res.status(400).json({ error: 'Month and Year are required' });

        const data = await payslipService.getPayslipsByMonth(month, year);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.generatePayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) return res.status(400).json({ error: 'Month and Year are required' });

        const data = await payslipService.generatePayslips(month, year);
        res.json({ message: 'Payroll generation completed', count: data.length, data });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
