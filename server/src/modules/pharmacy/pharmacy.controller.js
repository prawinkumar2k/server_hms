const pharmaService = require('./pharmacy.service');
const auditLogger = require('../../utils/auditLogger');
const db = require('../../config/db');


// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const data = await pharmaService.getDashboardStats();
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Legacy Stats (Optional)
exports.getStats = exports.getDashboardStats;

// --- Vendors ---
exports.getDailyReport = async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD
        const report = await pharmaService.getDailyReport(date);
        res.json(report);
    } catch (error) {
        console.error('Error fetching daily report:', error);
        res.status(500).json({ message: 'Error fetching daily report' });
    }
};

exports.getVendors = async (req, res) => {
    try {
        const data = await pharmaService.getAllVendors();
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createVendor = async (req, res) => {
    try {
        const data = await pharmaService.createVendor(req.body);
        res.status(201).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateVendor = async (req, res) => {
    try {
        const data = await pharmaService.updateVendor(req.params.id, req.body);
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteVendor = async (req, res) => {
    try {
        await pharmaService.deleteVendor(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Products (Stock) ---
exports.getProducts = async (req, res) => {
    try {
        const data = await pharmaService.getAllProducts();
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createProduct = async (req, res) => {
    try {
        const data = await pharmaService.createProduct(req.body);
        res.status(201).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const data = await pharmaService.updateProduct(req.params.id, req.body);
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        await pharmaService.deleteProduct(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Purchases ---
exports.getPurchases = async (req, res) => {
    try {
        const data = await pharmaService.getAllPurchases();
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createPurchase = async (req, res) => {
    try {
        const data = await pharmaService.createPurchase(req.body);
        res.status(201).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Enquiries ---
exports.getEnquiries = async (req, res) => {
    try {
        const data = await pharmaService.getAllEnquiries();
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createEnquiry = async (req, res) => {
    try {
        const data = await pharmaService.createEnquiry(req.body);
        res.status(201).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ================= APPROVAL WORKFLOW =================
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await pharmaService.getPendingPharmaRequests();
        res.json(requests);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const masterId = req.user ? req.user.id : null;

        if (!['APPROVED', 'REJECTED', 'MODIFIED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if exists
        const request = await pharmaService.getRequestById(id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const result = await pharmaService.updatePharmaRequestStatus(id, status, masterId, remarks);

        // Audit
        await auditLogger('REVIEW', 'PHARMA_REQUEST', id, masterId, request.status, status, remarks);

        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Update failed' });
    }
};

// Trigger Request Creation (called by Doctor or System)
exports.createRequest = async (req, res) => {
    try {
        const { prescriptionId } = req.body;
        if (!prescriptionId) return res.status(400).json({ message: 'Prescription ID required' });

        const result = await pharmaService.createPharmaRequest(prescriptionId);
        res.status(201).json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};


// ================= STOCK ALERTS (PHARMA MASTER) =================
exports.getAlerts = async (req, res) => {
    try {
        const { status } = req.query; // ACTIVE or ACKNOWLEDGED
        const alerts = await pharmaService.getStockAlerts(status || 'ACTIVE');
        res.json(alerts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

exports.acknowledgeAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const masterId = req.user ? req.user.id : null;

        await pharmaService.acknowledgeStockAlert(id, masterId);

        // Audit
        await auditLogger('ACKNOWLEDGE', 'STOCK_ALERT', id, masterId, 'ACTIVE', 'ACKNOWLEDGED', 'Low stock alert acknowledged');

        res.json({ message: 'Alert acknowledged' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Acknowledgement failed' });
    }
};
