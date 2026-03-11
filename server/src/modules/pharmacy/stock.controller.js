const stockService = require('./stock.service');
const auditLogger = require('../../utils/auditLogger');

exports.getSuppliers = async (req, res) => {
    try {
        const data = await stockService.getSuppliers();
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createSupplier = async (req, res) => {
    try {
        const data = await stockService.createSupplier(req.body);
        res.status(201).json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOrders = async (req, res) => {
    try {
        const data = await stockService.getOrders(req.query);
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const data = await stockService.getOrderDetails(req.params.id);
        if (!data) return res.status(404).json({ message: 'Order not found' });
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const data = await stockService.createOrder(req.body, userId);

        await auditLogger('CREATE', 'STOCK_ORDER', data.id, userId, 'DRAFT', 'DRAFT', `Created stock order ${data.orderNumber}`);

        res.status(201).json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.submitOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        // Move to ORDERED status
        const result = await stockService.updateOrderStatus(id, 'ORDERED', userId);

        await auditLogger('UPDATE', 'STOCK_ORDER', id, userId, 'DRAFT', 'ORDERED', 'Submitted stock order');

        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.receiveOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body; // [{ itemId, receivedQty }]
        const userId = req.user ? req.user.id : null;

        const result = await stockService.receiveOrderItems(id, items, userId);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
