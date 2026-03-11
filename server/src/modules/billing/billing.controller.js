const billingService = require('./billing.service');

exports.getInvoices = async (req, res) => {
    try {
        const { date } = req.query;
        const rows = await billingService.getAllInvoices(date);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const inv = await billingService.getInvoiceById(req.params.id);
        if (!inv) return res.status(404).json({ message: 'Invoice not found' });
        res.json(inv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoice' });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const id = await billingService.createInvoice(req.body);
        res.status(201).json({ message: 'Invoice created', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        await billingService.recordPayment(req.params.id, req.body.amount);
        res.json({ message: 'Payment recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error recording payment' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        await billingService.deleteInvoice(req.params.id);
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting invoice' });
    }
};
