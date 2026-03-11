const db = require('../config/db');

const setupRBAC = async () => {
    try {
        console.log('🛡️ Starting RBAC Setup...');

        // 1. Roles Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                type VARCHAR(50) DEFAULT 'custom', -- 'system' or 'custom'
                parent_role_id INT DEFAULT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Created roles table.');

        // 2. Permissions Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS permissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                module_name VARCHAR(50) NOT NULL,
                action VARCHAR(50) NOT NULL,
                description TEXT,
                UNIQUE KEY module_action (module_name, action)
            )
        `);
        console.log('✅ Created permissions table.');

        // 3. Role Permissions Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS role_permissions (
                role_id INT NOT NULL,
                permission_id INT NOT NULL,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created role_permissions table.');

        // Seeding Definitions
        const modules = [
            'patient_logs', 'patient_reports', 'medication_details', 'doctor_details',
            'medical_records', 'patient_care_records', 'recovery_status', 'treatment_plan',
            'admission_details', 'prescriptions'
        ];
        const actions = ['view', 'edit', 'create', 'delete'];

        // Seed Permissions
        console.log('🌱 Seeding Permissions...');
        for (const module of modules) {
            for (const action of actions) {
                try {
                    await db.execute(
                        `INSERT INTO permissions (module_name, action, description) VALUES (?, ?, ?)`,
                        [module, action, `${action} access for ${module}`]
                    );
                } catch (err) {
                    if (err.code !== 'ER_DUP_ENTRY') console.error(`Error seeding permission ${module}:${action}`, err.message);
                }
            }
        }

        // Seed Roles (Nurse example)
        console.log('🌱 Seeding Roles...');
        const roles = [
            { name: 'Admin', type: 'system' },
            { name: 'Doctor', type: 'system' },
            { name: 'Receptionist', type: 'system' },
            { name: 'Nurse', type: 'custom' }
        ];

        for (const role of roles) {
            try {
                await db.execute(`INSERT INTO roles (name, type) VALUES (?, ?)`, [role.name, role.type]);
            } catch (err) {
                if (err.code !== 'ER_DUP_ENTRY') console.error(`Error seeding role ${role.name}`, err.message);
            }
        }

        // Get Nurse Role ID
        const [nurseResult] = await db.execute(`SELECT id FROM roles WHERE name = 'Nurse'`);
        const nurseId = nurseResult[0]?.id;

        if (nurseId) {
            // Seed Sub-roles for Nurse
            const subRoles = ['Head Nurse', 'Trainee', 'Emergency Ward Nurse'];
            for (const subRole of subRoles) {
                try {
                    await db.execute(`INSERT INTO roles (name, type, parent_role_id) VALUES (?, ?, ?)`, [subRole, 'custom', nurseId]);
                } catch (err) {
                    if (err.code !== 'ER_DUP_ENTRY') console.error(`Error seeding sub-role ${subRole}`, err.message);
                }
            }
        }

        console.log('✨ RBAC Setup Complete.');
        process.exit(0);

    } catch (err) {
        console.error('❌ RBAC Setup Failed:', err);
        process.exit(1);
    }
};

setupRBAC();
