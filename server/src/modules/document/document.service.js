const fs = require('fs');
const path = require('path');
// const puppeteer = require('puppeteer'); // Lazy load instead
const labService = require('../lab/lab.service');

const TEMPLATE_PATH = path.join(__dirname, '../../templates/lab_report.html');
const STORAGE_PATH = path.join(__dirname, '../../../storage/reports/lab');

// Ensure storage directory exists
console.log('Document Service: Checking storage path...', STORAGE_PATH);
try {
    if (!fs.existsSync(STORAGE_PATH)) {
        fs.mkdirSync(STORAGE_PATH, { recursive: true });
        console.log('Document Service: Storage created.');
    } else {
        console.log('Document Service: Storage exists.');
    }
} catch (e) {
    console.error('Document Service: Error creating storage', e);
}
console.log('Document Service: Initialization complete.');

exports.generateLabReport = async (reportId) => {
    try {
        // 1. Fetch Data
        const test = await labService.getTestEntryById(reportId);
        if (!test) throw new Error('Report not found');

        // 2. Prepare Data
        const receivedDate = test.testDate ? new Date(test.testDate).toLocaleDateString() : '';
        const reportDate = new Date().toLocaleDateString();
        const outputFilename = `LabReport_${reportId}_${Date.now()}.pdf`;
        const outputPath = path.join(STORAGE_PATH, outputFilename);

        // 3. Load & Fill Template
        let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');

        // Logo: Using a local/public placeholder or base64. 
        // For server-side rendering, nice to use a reliable URL or base64.
        const logoUrl = 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png';

        html = html.replace('{{hospital_logo}}', logoUrl);
        html = html.replace('{{test_no}}', test.id || '');
        html = html.replace('{{patient_id}}', test.patientId || '');
        html = html.replace('{{patient_name}}', (test.patientName || '').toUpperCase());
        html = html.replace('{{age}}', test.age || '');
        html = html.replace('{{sex}}', test.sex || '');
        html = html.replace('{{doctor_name}}', test.refDoctor || '');
        html = html.replace('{{received_date}}', receivedDate);
        html = html.replace('{{report_date}}', reportDate);

        // Rows
        const rowHtml = `
            <tr>
                <td>${test.subTestName || test.testName || 'General Test'}</td>
                <td style="font-weight:bold; text-align:center;">${test.result || '-'}</td>
                <td style="text-align:center;">${test.unit || '-'}</td>
                <td style="text-align:center;">${test.refInterval || '-'}</td>
            </tr>
            ${Array(5).fill('<tr><td style="height:20px"></td><td></td><td></td><td></td></tr>').join('')}
        `;
        html = html.replace('{{result_rows}}', rowHtml);

        // 4. Generate PDF with Puppeteer
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Safer for containerized envs
        });
        const page = await browser.newPage();

        // precise A4 setup
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });

        await page.close();
        await browser.close();

        return outputPath;

    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    }
};
