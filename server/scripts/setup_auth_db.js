const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function setupAuthDB() {
    try {
        console.log('--- Starting Auth DB Setup ---');

        // 1. Drop existing users table to ensure clean slate
        console.log('Dropping existing users table...');
        await db.execute('DROP TABLE IF EXISTS users');

        // 2. Create users table
        console.log('Creating users table...');
        const createTableQuery = `
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                role ENUM('Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist') NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await db.execute(createTableQuery);

        // 3. Create Default Admin
        console.log('Seeding default Admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const insertAdminQuery = `
            INSERT INTO users (username, password, full_name, role, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(insertAdminQuery, ['admin', adminPassword, 'System Administrator', 'Admin', 'Active']);

        console.log('--- Auth DB Setup Completed Successfully ---');
        console.log('Default Admin: username="admin", password="admin123"');
        process.exit();

    } catch (error) {
        console.error('Error setting up Auth DB:', error);
        process.exit(1);
    }
}

setupAuthDB();
