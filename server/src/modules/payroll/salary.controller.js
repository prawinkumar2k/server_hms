const salaryService = require('./salary.service');

exports.getSalaries = async (req, res) => {
    try {
        const data = await salaryService.getAllSalaries();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEmployeeSalary = async (req, res) => {
    try {
        const data = await salaryService.getSalaryByEmployee(req.params.id);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await salaryService.updateSalaryStructure(id, req.body);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
