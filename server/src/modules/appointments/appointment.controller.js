const appointmentService = require('./appointment.service');

exports.getAppointments = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            date: req.query.date
        };
        const rows = await appointmentService.getAllAppointments(filters);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const id = await appointmentService.createAppointment(req.body);
        res.status(201).json({ message: 'Appointment created', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating appointment' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        await appointmentService.updateAppointmentStatus(req.params.id, req.body.status);
        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating status' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting appointment' });
    }
};

// Transactions
exports.getTransactions = async (req, res) => {
    try {
        const rows = await appointmentService.getTransactions();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        await appointmentService.createTransaction(req.body);
        res.status(201).json({ message: 'Transaction recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating transaction' });
    }
};
