const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function setup() {
    try {
        console.log('Setting up database...');

        // 1. Create Users Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Super Admin', 'Admin', 'Doctor', 'Receptionist', 'Nurse', 'Pharmacist', 'Lab Technician') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created.');

        // 2. Seed Users
        const users = [
            { name: 'Super Admin', email: 'admin@hms.com', password: 'admin', role: 'Super Admin' },
            { name: 'Dr. Smith', email: 'doctor@hms.com', password: 'doctor', role: 'Doctor' },
            { name: 'Reception Desk', email: 'reception@hms.com', password: 'reception', role: 'Receptionist' },
            { name: 'Pharma Staff', email: 'pharmacy@hms.com', password: 'pharmacy', role: 'Pharmacist' },
            { name: 'Lab Tech', email: 'lab@hms.com', password: 'lab', role: 'Lab Technician' }
        ];

        for (const user of users) {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [user.email]);
            if (rows.length === 0) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
                    user.name, user.email, hashedPassword, user.role
                ]);
                console.log(`Created user: ${user.email}`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        }

        console.log('Database setup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

setup();
