const db = require('../config/db');

async function createPayslipsTable() {
    try {
        console.log('💰 Creating Payslips Table...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS payslips (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                month INT NOT NULL, -- 1-12
                year INT NOT NULL, -- 2024
                
                -- Attendance Summary
                total_days INT DEFAULT 30,
                days_present INT DEFAULT 0,
                days_absent INT DEFAULT 0,
                days_leave INT DEFAULT 0,
                
                -- Financials (Snapshot at time of generation)
                basic_salary DECIMAL(10,2) DEFAULT 0.00,
                hra DECIMAL(10,2) DEFAULT 0.00,
                allowances DECIMAL(10,2) DEFAULT 0.00, -- Sum of other allowances
                
                gross_earnings DECIMAL(10,2) DEFAULT 0.00,
                total_deductions DECIMAL(10,2) DEFAULT 0.00,
                net_salary DECIMAL(10,2) DEFAULT 0.00, -- The final payout amount
                
                loss_of_pay DECIMAL(10,2) DEFAULT 0.00, -- Deduction for absence
                
                status ENUM('Draft', 'Generated', 'Paid') DEFAULT 'Draft',
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                paid_at TIMESTAMP NULL,
                
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                UNIQUE KEY unique_monthly_payslip (employee_id, month, year)
            )
        `);

        console.log('✅ Payslips table created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create payslips table:', error);
        process.exit(1);
    }
}

createPayslipsTable();
