const puppeteer = require('puppeteer');
const templates = require('./templates');
const db = require('../../config/db');
const billingService = require('../billing/billing.service');

/**
 * Report Generation Controller — Production Grade
 * All report types now pull from real database tables.
 * Puppeteer generates PDF from HTML templates.
 */

exports.generateReport = async (req, res) => {
    try {
        const { type, date, patientId } = req.query;
        let htmlContent = '';
        let data = {};

        switch (type) {
            // ============================================
            // 1. OP DAILY REPORT — Real Invoice Data
            // ============================================
            case 'op-daily': {
                const invoiceDate = date || new Date().toISOString().split('T')[0];
                const invoices = await billingService.getAllInvoices(invoiceDate);
                const totalCollection = invoices.reduce((sum, inv) => sum + parseFloat(inv.paid_amount || 0), 0).toFixed(2);
                data = {
                    date: invoiceDate,
                    items: invoices,
                    totalCollection
                };
                htmlContent = templates.dailyOp(data);
                break;
            }

            // ============================================
            // 2. OP PATIENT HISTORY — Real from DB
            // ============================================
            case 'op-history': {
                const pid = patientId || null;
                let patient = { patientName: 'Unknown', patientId: pid, age: '-', gender: '-' };
                let visits = [];

                if (pid) {
                    // Get patient info
                    const [pRows] = await db.execute(
                        'SELECT cusId, cusName, PAge, PSex FROM copy_of_patientdetaiils WHERE cusId = ? OR SNo = ? LIMIT 1',
                        [pid, pid]
                    ).catch(() => [[]]);

                    if (pRows.length > 0) {
                        patient = {
                            patientName: pRows[0].cusName || 'Unknown',
                            patientId: pRows[0].cusId,
                            age: pRows[0].PAge || '-',
                            gender: pRows[0].PSex || '-'
                        };
                    }

                    // Get visits from OPD, Appointments, and Prescriptions
                    const [visitRows] = await db.execute(`
                        SELECT 'OPD' as source, visit_date as date, doctor_name as doctor, diagnosis, symptoms as prescription, '200.00' as fee
                        FROM opd_visits WHERE patient_name LIKE ?
                        UNION ALL
                        SELECT 'Appointment' as source, date, doctor_name as doctor, reason as diagnosis, '' as prescription, '200.00' as fee
                        FROM appointments WHERE patient_name LIKE ?
                        UNION ALL
                        SELECT 'Prescription' as source, pDate as date, '' as doctor, Disease as diagnosis, 
                               CONCAT(COALESCE(Tab1,''), ' ', COALESCE(Tab2,''), ' ', COALESCE(Tab3,'')) as prescription, '' as fee
                        FROM prescriptions WHERE cusId = ?
                        ORDER BY date DESC LIMIT 50
                    `, [`%${patient.patientName}%`, `%${patient.patientName}%`, pid]).catch(() => [[]]);

                    visits = visitRows;
                } else {
                    // If no patientId, get recent 20 OPD visits
                    const [recentRows] = await db.execute(`
                        SELECT patient_name, visit_date as date, doctor_name as doctor, diagnosis, symptoms as prescription, '200.00' as fee
                        FROM opd_visits ORDER BY visit_date DESC LIMIT 20
                    `).catch(() => [[]]);
                    visits = recentRows;
                    patient.patientName = 'All Patients (Recent)';
                }

                data = { ...patient, visits };
                htmlContent = templates.opPatientHistory(data);
                break;
            }

            // ============================================
            // 3. PHARMACY STOCK REPORT — Real from product table
            // ============================================
            case 'pharmacy-stock': {
                const [stockRows] = await db.execute(`
                    SELECT Pcode as code, ProductName as name, '' as batch, '' as expiry, 
                           CAST(Stock AS UNSIGNED) as qty, CAST(Amount AS DECIMAL(10,2)) as mrp
                    FROM product 
                    ORDER BY ProductName ASC
                `).catch(() => [[]]);

                const totalValue = stockRows.reduce((sum, item) => sum + (item.qty * item.mrp), 0).toFixed(2);

                data = {
                    items: stockRows,
                    totalValue
                };
                htmlContent = templates.pharmacyStock(data);
                break;
            }

            // ============================================
            // 4. PHARMACY BILLING REPORT — Real from billdetails
            // ============================================
            case 'pharmacy-billing': {
                const reportDate = date || new Date().toISOString().split('T')[0];
                const [billRows] = await db.execute(`
                    SELECT DISTINCT RNo as billNo, MAX(PDate) as date, MAX(CusName) as patientName, 
                           '' as doctor, MAX(CAST(GrandTotal AS DECIMAL(10,2))) as amount
                    FROM billdetails 
                    WHERE BillType = 'Pharma' AND PDate LIKE ?
                    GROUP BY RNo
                    ORDER BY CAST(RNo AS UNSIGNED) DESC
                `, [`${reportDate}%`]).catch(() => [[]]);

                const totalRevenue = billRows.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2);

                data = {
                    items: billRows,
                    totalRevenue
                };
                htmlContent = templates.pharmacyBilling(data);
                break;
            }

            // ============================================
            // 5. PHARMACY PURCHASE REPORT — Real from purchase table
            // ============================================
            case 'pharmacy-purchase': {
                const reportDate = date || null;
                let purchaseQuery = `
                    SELECT PurDate as date, Vender as supplier, ProductName as itemName, 
                           PurQty as itemCount, PurRate as unitPrice,
                           (CAST(PurQty AS DECIMAL(10,2)) * CAST(PurRate AS DECIMAL(10,2))) as total
                    FROM purchase
                `;
                const purchaseParams = [];

                if (reportDate) {
                    purchaseQuery += ' WHERE PurDate LIKE ?';
                    purchaseParams.push(`${reportDate}%`);
                }

                purchaseQuery += ' ORDER BY PurDate DESC LIMIT 100';

                const [purchaseRows] = await db.execute(purchaseQuery, purchaseParams).catch(() => [[]]);
                const totalPurchase = purchaseRows.reduce((sum, p) => sum + parseFloat(p.total || 0), 0).toFixed(2);

                data = {
                    items: purchaseRows.map(r => ({
                        invoiceNo: `PUR-${r.date}`,
                        date: r.date,
                        supplier: r.supplier,
                        itemCount: r.itemCount,
                        total: parseFloat(r.total || 0).toFixed(2)
                    })),
                    totalPurchase
                };
                htmlContent = templates.pharmacyPurchase(data);
                break;
            }

            // ============================================
            // 6. PHARMACY RETURN REPORT — Real from productreturn table
            // ============================================
            case 'pharmacy-return': {
                const [returnRows] = await db.execute(`
                    SELECT Productname as medicine, '' as batch, ReturnQty as qty, 
                           'Return' as reason, CAST(ReturnAmt AS DECIMAL(10,2)) as value
                    FROM productreturn 
                    ORDER BY Rno DESC LIMIT 100
                `).catch(() => [[]]);

                data = {
                    items: returnRows
                };
                htmlContent = templates.pharmacyReturn(data);
                break;
            }

            // ============================================
            // 7. LAB REPORT — Real from lab_bills
            // ============================================
            case 'lab-billing': {
                const reportDate = date || new Date().toISOString().split('T')[0];
                const [labBills] = await db.execute(`
                    SELECT bill_no as billNo, bill_date as date, patient_name as patientName, 
                           total_amount as amount
                    FROM lab_bills 
                    WHERE bill_date LIKE ?
                    ORDER BY id DESC
                `, [`${reportDate}%`]).catch(() => [[]]);

                const totalLabRevenue = labBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2);

                data = {
                    items: labBills,
                    totalRevenue: totalLabRevenue
                };
                htmlContent = templates.pharmacyBilling(data); // Reuse billing template
                break;
            }

            // ============================================
            // 8. IPD REPORT — Real from ipd_admissions
            // ============================================
            case 'ipd-summary': {
                const [ipdRows] = await db.execute(`
                    SELECT a.patient_name, a.doctor_name, a.reason, a.admission_date, a.discharge_date, a.status,
                           b.number as bed_number, b.ward,
                           hb.grand_total as bill_amount
                    FROM ipd_admissions a
                    JOIN beds b ON a.bed_id = b.id
                    LEFT JOIN hospital_bills hb ON hb.admission_id = a.id
                    ORDER BY a.admission_date DESC LIMIT 100
                `).catch(() => [[]]);

                data = {
                    items: ipdRows.map(r => ({
                        patientName: r.patient_name,
                        doctor: r.doctor_name,
                        ward: `${r.ward} - Bed ${r.bed_number}`,
                        admissionDate: r.admission_date,
                        dischargeDate: r.discharge_date || 'Still Admitted',
                        status: r.status,
                        amount: r.bill_amount || 'Pending'
                    })),
                    totalRevenue: ipdRows.reduce((s, r) => s + parseFloat(r.bill_amount || 0), 0).toFixed(2)
                };
                htmlContent = templates.pharmacyBilling(data); // Reuse billing template
                break;
            }

            default:
                return res.status(400).json({ message: 'Invalid Report Type. Valid types: op-daily, op-history, pharmacy-stock, pharmacy-billing, pharmacy-purchase, pharmacy-return, lab-billing, ipd-summary' });
        }

        // Generate PDF
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${type}-${Date.now()}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Report Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate report', error: error.message });
    }
};
