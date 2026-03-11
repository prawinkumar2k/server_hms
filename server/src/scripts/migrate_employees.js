const db = require('../config/db');

async function migrate() {
    try {
        console.log('Creating employees table...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_code VARCHAR(20) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                phone VARCHAR(20),
                dob DATE,
                gender ENUM('Male', 'Female', 'Other'),
                blood_group VARCHAR(5),
                address TEXT,
                
                department VARCHAR(50),
                designation VARCHAR(50),
                date_of_joining DATE NOT NULL,
                employment_type ENUM('Permanent', 'Probation', 'Contract', 'Visiting', 'Intern') NOT NULL DEFAULT 'Permanent',
                status ENUM('Active', 'Resigned', 'Terminated', 'On Leave') DEFAULT 'Active',
                
                bank_name VARCHAR(100),
                account_number VARCHAR(50),
                ifsc_code VARCHAR(20),
                pan_number VARCHAR(20),
                aadhaar_number VARCHAR(20),
                uan_number VARCHAR(50),
                esic_number VARCHAR(50),
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Employees table created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
