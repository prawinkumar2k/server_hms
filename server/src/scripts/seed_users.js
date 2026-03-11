const db = require('../config/db');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        console.log('Seeding Users...');

        // 1. Create Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(100),
                role VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created.');

        // 2. Define Users
        const passwordHash = await bcrypt.hash('admin123', 10);
        const docHash = await bcrypt.hash('password123', 10);

        const users = [
            { username: 'admin', password: passwordHash, role: 'Admin', name: 'System Administrator' },
            { username: 'doc1', password: docHash, role: 'Doctor', name: 'Dr. Smith' },
            { username: 'recep1', password: docHash, role: 'Receptionist', name: 'Front Desk' },
            { username: 'lab1', password: docHash, role: 'Lab Technician', name: 'Lab Tech 1' },
            { username: 'pharma1', password: docHash, role: 'Pharmacist', name: 'Pharma Staff' }
        ];

        // 3. Insert specific users if they don't exist
        for (const u of users) {
            const [exists] = await db.execute('SELECT * FROM users WHERE username = ?', [u.username]);
            if (exists.length === 0) {
                await db.execute(
                    'INSERT INTO users (username, password, role, full_name, status) VALUES (?, ?, ?, ?, ?)',
                    [u.username, u.password, u.role, u.name, 'Active']
                );
                console.log(`User created: ${u.username}`);
            } else {
                console.log(`User already exists: ${u.username}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedUsers();
