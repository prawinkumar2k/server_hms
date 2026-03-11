const labService = require('./lab.service');
const auditLogger = require('../../utils/auditLogger');
const db = require('../../config/db'); // For direct checks if needed


// Doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await labService.getAllDoctors();
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
};

exports.createDoctor = async (req, res) => {
    try {
        const { docId, docName } = req.body;
        if (!docId || !docName) return res.status(400).json({ message: 'Doctor ID and Name are required' });
        const result = await labService.createDoctor(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating doctor entry' });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await labService.updateDoctor(id, req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating doctor' });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await labService.deleteDoctor(id);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting doctor' });
    }
};

// Test Entries
exports.createTestEntry = async (req, res) => {
    try {
        // Enforce Lab Master Approval
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(403).json({
                message: 'Action Blocked: Valid Lab Request ID is required for execution.'
            });
        }

        const [rows] = await db.execute('SELECT status FROM lab_requests WHERE id = ?', [requestId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Request not found' });

        if (rows[0].status !== 'APPROVED') {
            return res.status(403).json({
                message: `Action Blocked: Request is in ${rows[0].status} state. Master approval required.`
            });
        }


        const result = await labService.createTestEntry(req.body);

        // Audit Execution
        if (req.user) {
            await auditLogger('EXECUTE', 'LAB_TEST', result.id, req.user.id, 'APPROVED', 'COMPLETED', `Test Executed for Patient ${req.body.patientName}`);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving test entry' });
    }
};

exports.getTestEntries = async (req, res) => {
    try {
        const filters = {
            patientId: req.query.patientId,
            testId: req.query.testId,
            fromDate: req.query.fromDate,
            toDate: req.query.toDate
        };
        const entries = await labService.getTestEntries(filters);
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching test entries' });
    }
};

const documentService = require('../document/document.service');

// ... existing code ...

exports.printLabReport = async (req, res) => {
    // ... existing HTML generation code logic (keep it for View mode) ...
    try {
        const fs = require('fs');
        const path = require('path');
        const { id } = req.params;

        // Fetch data
        const test = await labService.getTestEntryById(id);

        if (!test) return res.status(404).send('Report not found');

        // Read Template
        const templatePath = path.join(__dirname, '../../templates/lab_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        // Replace Placeholders
        // Logo: Load from file and convert to base64
        const logoPath = path.join(__dirname, '../../templates/hospital_logo.png');
        let logoUrl = '';
        if (fs.existsSync(logoPath)) {
            const logoData = fs.readFileSync(logoPath).toString('base64');
            logoUrl = `data:image/png;base64,${logoData}`;
        } else {
            // Fallback
            logoUrl = 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png';
        }
        const receivedDate = test.testDate ? new Date(test.testDate).toLocaleDateString() : '';
        const reportDate = new Date().toLocaleDateString();

        html = html.replace('{{hospital_logo}}', logoUrl);
        html = html.replace('{{test_no}}', test.id || '');
        html = html.replace('{{patient_id}}', test.patientId || '');
        html = html.replace('{{patient_name}}', (test.patientName || '').toUpperCase());
        html = html.replace('{{age}}', test.age || '');
        html = html.replace('{{sex}}', test.sex || '');
        html = html.replace('{{doctor_name}}', test.refDoctor || '');
        html = html.replace('{{received_date}}', receivedDate);
        html = html.replace('{{report_date}}', reportDate);

        // Generate Rows
        const rowHtml = `
            <tr>
                <td>${test.subTestName || test.testName || 'General Test'}</td>
                <td style="font-weight:bold; text-align:center;">${test.result || '-'}</td>
                <td style="text-align:center;">${test.unit || '-'}</td>
                <td style="text-align:center;">${test.refInterval || '-'}</td>
            </tr>
            <!-- Add more empty rows if needed for spacing -->
            ${Array(5).fill('<tr><td style="height:20px"></td><td></td><td></td><td></td></tr>').join('')}
        `;

        html = html.replace('{{result_rows}}', rowHtml);

        // Auto-print only if not in 'view' mode
        if (req.query.mode !== 'view') {
            html += `
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            `;
        }

        res.send(html);

    } catch (error) {
        console.error("Print Error:", error);
        res.status(500).send('Error generating report');
    }
};

exports.downloadLabReport = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Generating report for ID: ${id}`);

        const pdfPath = await documentService.generateLabReport(id);
        console.log(`PDF generated at details: ${pdfPath}`);

        if (!require('fs').existsSync(pdfPath)) {
            console.error("CRITICAL: File not found at path despite generation success");
            return res.status(500).send("Report generated but file is missing");
        }

        // Proceed to download
        res.download(pdfPath, (err) => {
            if (err) {
                console.error("Download failure callback:", err);
                if (!res.headersSent) {
                    res.status(500).send("Error downloading file");
                }
            }
        });
    } catch (error) {
        console.error("PDF Generate Error:", error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};

// Billing
exports.createBill = async (req, res) => {
    try {
        const result = await labService.createBill(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating bill' });
    }
};

exports.getBills = async (req, res) => {
    try {
        const bills = await labService.getAllBills();
        res.json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bills' });
    }
};

exports.createLabRequest = async (req, res) => {
    try {
        const result = await labService.createLabRequest(req.body);
        res.status(201).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed' });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const status = req.query.status || 'PENDING';
        const list = await labService.getLabRequests(status);
        res.json(list);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body; // APPROVED, REJECTED, CORRECTION
        const masterId = req.user ? req.user.id : null;

        if (!['APPROVED', 'REJECTED', 'CORRECTION'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get previous status for audit
        const [rows] = await db.execute('SELECT status FROM lab_requests WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Request not found' });
        const prevStatus = rows[0].status;

        const result = await labService.updateLabRequestStatus(id, status, masterId, remarks);

        // Audit
        await auditLogger('REVIEW', 'LAB_REQUEST', id, masterId, prevStatus, status, remarks);

        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Update failed' });
    }
};


// Helpers
exports.searchPatients = async (req, res) => {
    try {
        const { term } = req.query;
        if (!term) return res.json([]);
        const patients = await labService.searchPatients(term);
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching patients' });
    }
};

exports.getTests = async (req, res) => {
    try {
        const tests = await labService.getAllTests();
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tests' });
    }
};

exports.getNextTestId = async (req, res) => {
    try {
        // Simple mock or service call
        const nextId = await labService.getNextTestId();
        res.json({ nextId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ nextId: 'Auto' });
    }
};
