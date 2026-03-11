const db = require('../config/db');

const migrateRoles = async () => {
    try {
        console.log('🔄 Starting Role Migration...');

        // 1. Create Roles Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                description VARCHAR(255),
                is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Roles table created/checked.');

        // 2. Seed Default Roles
        const defaultRoles = [
            { name: 'Admin', desc: 'Full System Access', is_system: true },
            { name: 'Doctor', desc: 'Clinical Access', is_system: true },
            { name: 'Receptionist', desc: 'Front Desk Operations', is_system: true },
            { name: 'Lab Technician', desc: 'Laboratory Management', is_system: true },
            { name: 'Pharmacist', desc: 'Pharmacy & Stock', is_system: true },
            { name: 'HR', desc: 'Human Resources & Payroll', is_system: true }
        ];

        for (const role of defaultRoles) {
            const [exists] = await db.execute('SELECT id FROM roles WHERE name = ?', [role.name]);
            if (exists.length === 0) {
                await db.execute(
                    'INSERT INTO roles (name, description, is_system) VALUES (?, ?, ?)',
                    [role.name, role.desc, role.is_system]
                );
                console.log(`   + Seeded role: ${role.name}`);
            }
        }

        console.log('✨ Role Migration Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
};

migrateRoles();
