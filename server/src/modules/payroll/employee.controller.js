const employeeService = require('./employee.service');

exports.getEmployees = async (req, res) => {
    try {
        const data = await employeeService.getAllEmployees();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getEmployee = async (req, res) => {
    try {
        const data = await employeeService.getEmployeeById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Employee not found' });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createEmployee = async (req, res) => {
    try {
        const data = await employeeService.createEmployee(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateEmployee = async (req, res) => {
    try {
        const data = await employeeService.updateEmployee(req.params.id, req.body);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
