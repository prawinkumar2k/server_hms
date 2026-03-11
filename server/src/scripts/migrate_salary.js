const db = require('../config/db');

async function migrateSalary() {
    try {
        console.log('💰 Starting Salary Structure Migration...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS salary_structures (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                
                -- Earnings
                basic_salary DECIMAL(10,2) DEFAULT 0.00,
                hra DECIMAL(10,2) DEFAULT 0.00,
                da DECIMAL(10,2) DEFAULT 0.00,
                travel_allowance DECIMAL(10,2) DEFAULT 0.00,
                medical_allowance DECIMAL(10,2) DEFAULT 0.00,
                special_allowance DECIMAL(10,2) DEFAULT 0.00,
                
                -- Deductions
                pf_employee DECIMAL(10,2) DEFAULT 0.00, -- Provident Fund
                esi_employee DECIMAL(10,2) DEFAULT 0.00, -- ESI
                pt DECIMAL(10,2) DEFAULT 0.00, -- Professional Tax
                tds DECIMAL(10,2) DEFAULT 0.00, -- Income Tax
                
                -- Totals
                gross_salary DECIMAL(10,2) DEFAULT 0.00,
                total_deductions DECIMAL(10,2) DEFAULT 0.00,
                net_salary DECIMAL(10,2) DEFAULT 0.00,
                
                effective_from DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                UNIQUE KEY unique_emp_salary (employee_id) -- One active structure per employee for now
            )
        `);

        console.log('✅ Salary Structures table created.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
}

migrateSalary();
