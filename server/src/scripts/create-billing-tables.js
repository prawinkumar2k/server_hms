const db = require('../config/db');

async function createBillingTables() {
    try {
        console.log('Creating Billing tables...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100),
                invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                due_date DATETIME,
                total_amount DECIMAL(10,2) DEFAULT 0.00,
                paid_amount DECIMAL(10,2) DEFAULT 0.00,
                status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Partial, Overdue
                category VARCHAR(50) DEFAULT 'General' -- OPD, IPD, Pharmacy, General
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS invoice_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_id INT,
                description VARCHAR(255),
                quantity INT DEFAULT 1,
                unit_price DECIMAL(10,2),
                total DECIMAL(10,2),
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            )
        `);

        console.log('Billing Tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createBillingTables();
