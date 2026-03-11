const billingService = require('./billing.service');
const auditLogger = require('../../utils/auditLogger');
const db = require('../../config/db');


exports.createBill = async (req, res) => {
    try {
        const { prescriptionId } = req.body;

        // Enforce Pharma Master Approval
        if (prescriptionId) {
            const [rows] = await db.execute('SELECT status FROM pharma_requests WHERE prescription_id = ? ORDER BY id DESC LIMIT 1', [prescriptionId]);

            // If no request found, block? OR check if prescription status itself is APPROVED_BY_PHARMA?
            // Safest is to check the request status.

            if (rows.length === 0) {
                return res.status(403).json({ message: 'Dispensing Blocked: No approval request found for this prescription.' });
            }

            if (rows[0].status !== 'APPROVED') {
                return res.status(403).json({
                    message: `Dispensing Blocked: Prescription approval status is ${rows[0].status}.`
                });
            }
        }

        const result = await billingService.createBill(req.body);

        // Audit Dispense
        if (req.user && prescriptionId) {
            await auditLogger('DISPENSE', 'PRESCRIPTION', prescriptionId, req.user.id, 'APPROVED', 'DISPENSED', `Medicines dispensed via Bill ${result.billNo}`);
        }

        res.status(201).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.createReturn = async (req, res) => {
    try {
        const result = await billingService.createReturn(req.body);
        res.status(201).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.getBillReport = async (req, res) => {
    try {
        const data = await billingService.getBillReport(req.query);
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getCreditReport = async (req, res) => {
    try {
        const data = await billingService.getCreditReport();
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getPatientFinancialProfile = async (req, res) => {
    try {
        const data = await billingService.getPatientFinancialProfile(req.params.patientId);
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
