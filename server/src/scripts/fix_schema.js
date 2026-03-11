const db = require('../config/db');

const fixSchema = async () => {
    try {
        console.log('🔧 Starting Schema Repairs...');

        // 1. Fix Users Table (Add updated_at)
        try {
            await db.execute("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            console.log('✅ Added updated_at to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ updated_at already exists in users.');
            } else {
                console.error('⚠️ Failed to alter users table:', err.message);
            }
        }

        // 2. Create Appointments Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100) NOT NULL,
                doctor_name VARCHAR(100),
                date DATE NOT NULL,
                time TIME NOT NULL,
                status VARCHAR(50) DEFAULT 'Scheduled',
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Checked/Created appointments table.');

        // 3. Create Appointment Transactions Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS appointment_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                appointment_id INT,
                patient_name VARCHAR(100),
                amount DECIMAL(10, 2),
                payment_method VARCHAR(50),
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Checked/Created appointment_transactions table.');

        // 4. Create Invoices Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100) NOT NULL,
                category VARCHAR(50),
                total_amount DECIMAL(10, 2) DEFAULT 0.00,
                paid_amount DECIMAL(10, 2) DEFAULT 0.00,
                due_date DATE,
                status VARCHAR(20) DEFAULT 'Pending',
                invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Checked/Created invoices table.');

        // 5. Create Invoice Items Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS invoice_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_id INT NOT NULL,
                description VARCHAR(255),
                quantity INT DEFAULT 1,
                unit_price DECIMAL(10, 2),
                total DECIMAL(10, 2),
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Checked/Created invoice_items table.');

        // 6. Create Daily OP Records (referenced by appointment service)
        await db.execute(`
            CREATE TABLE IF NOT EXISTS daily_op_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100),
                visit_date DATE,
                visit_type VARCHAR(50),
                op_fees DECIMAL(10, 2),
                total_fees DECIMAL(10, 2),
                payment_status VARCHAR(20),
                age_gender VARCHAR(50),
                source_type VARCHAR(50),
                source_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Checked/Created daily_op_records table.');

        // 7. Ensure tests and patients tables exist (Lab/Patient modules seem fine but good to double check)
        await db.execute(`
            CREATE TABLE IF NOT EXISTS patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                age INT,
                gender VARCHAR(10),
                mobile VARCHAR(15),
                address TEXT,
                blood_group VARCHAR(5),
                status VARCHAR(20) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Checked/Created patients table.');

        console.log('✨ Schema Repair Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Schema Repair Failed:', err);
        process.exit(1);
    }
};

fixSchema();
