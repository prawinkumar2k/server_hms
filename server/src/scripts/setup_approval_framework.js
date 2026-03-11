const db = require('../config/db');

const setupApprovalFramework = async () => {
    try {
        console.log('🛡️ Starting Approval Framework Setup...');

        // 1. Roles
        console.log('Creating Roles...');
        const roles = ['LAB_MASTER', 'PHARMA_MASTER'];
        for (const role of roles) {
            try {
                await db.execute(`INSERT INTO roles (name, type) VALUES (?, 'system')`, [role]);
                console.log(`✅ Added Role: ${role}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`ℹ️ Role ${role} already exists.`);
                } else {
                    console.error(`❌ Error adding role ${role}:`, err.message);
                }
            }
        }

        // 2. Audit Logs
        console.log('Creating Audit Logs Table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                action_type VARCHAR(50) NOT NULL,
                entity_type VARCHAR(50) NOT NULL,
                entity_id VARCHAR(50) NOT NULL,
                performed_by INT,
                previous_status VARCHAR(50),
                new_status VARCHAR(50),
                details TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created audit_logs table.');

        // 3. Lab Requests Extension
        console.log('Extending Lab Requests...');
        // Check if columns exist, if not add them
        try {
            await db.execute(`ALTER TABLE lab_requests ADD COLUMN approved_by INT DEFAULT NULL`);
            await db.execute(`ALTER TABLE lab_requests ADD COLUMN remarks TEXT DEFAULT NULL`);
            await db.execute(`ALTER TABLE lab_requests ADD COLUMN approval_date TIMESTAMP NULL DEFAULT NULL`);

            // Ensure status column supports new values (Enum update is tricky in MySQL, defaulting to VARCHAR check or just trusting app logic if it's VARCHAR)
            // If it is ENUM, we might need to alter it. lab.service.js implies it might be varchar or enum.
            // Let's modify it to VARCHAR(50) to be safe and flexible if it's not already.
            await db.execute(`ALTER TABLE lab_requests MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDING'`);

            console.log('✅ Altered lab_requests table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ lab_requests columns already exist.');
            } else {
                console.warn('⚠️ Warning altering lab_requests (might create if missing):', err.message);
                // If table doesn't exist, create it (Fallback based on requirements)
                await db.execute(`
                    CREATE TABLE IF NOT EXISTS lab_requests (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        patient_id VARCHAR(50),
                        patient_name VARCHAR(100),
                        doctor_id VARCHAR(50),
                        doctor_name VARCHAR(100),
                        priority VARCHAR(20) DEFAULT 'Routine',
                        notes TEXT,
                        status VARCHAR(50) DEFAULT 'PENDING',
                        approved_by INT,
                        remarks TEXT,
                        approval_date TIMESTAMP NULL,
                        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                `);
                // And items table
                await db.execute(`
                    CREATE TABLE IF NOT EXISTS lab_request_items (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        request_id INT,
                        test_name VARCHAR(100),
                        category VARCHAR(50),
                        price DECIMAL(10,2),
                        status VARCHAR(20) DEFAULT 'PENDING',
                        report_id INT DEFAULT NULL,
                        FOREIGN KEY (request_id) REFERENCES lab_requests(id) ON DELETE CASCADE
                    )
                `);
                console.log('✅ Created lab_requests tables (fallback).');
            }
        }

        // 4. Pharma Requests
        console.log('Creating Pharma Requests Table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS pharma_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                prescription_id INT NOT NULL,
                status ENUM('PENDING','APPROVED','MODIFIED','REJECTED') DEFAULT 'PENDING',
                approved_by INT,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created pharma_requests table.');

        console.log('✨ Approval Framework Setup Complete.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Setup Failed:', err);
        process.exit(1);
    }
};

setupApprovalFramework();
