const db = require('../src/config/db');

/**
 * Setup RBAC (Role-Based Access Control) Database Schema
 * Creates roles, permissions, and role_permissions tables
 */
async function setupRBACSchema() {
    try {
        console.log('[RBAC SETUP] Starting RBAC schema setup...');

        // 1. Create roles table
        console.log('[RBAC SETUP] Creating roles table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                is_system BOOLEAN DEFAULT FALSE,
                type ENUM('main', 'sub', 'custom') DEFAULT 'custom',
                parent_role_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL
            )
        `);

        // 2. Create permissions table
        console.log('[RBAC SETUP] Creating permissions table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS permissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                module_name VARCHAR(50) NOT NULL,
                action VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Create role_permissions junction table
        console.log('[RBAC SETUP] Creating role_permissions table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS role_permissions (
                role_id INT NOT NULL,
                permission_id INT NOT NULL,
                granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            )
        `);

        // 4. Check if users table has role_id column, if not add it
        console.log('[RBAC SETUP] Checking users table structure...');
        const [columns] = await db.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'role_id'
        `);

        if (columns.length === 0) {
            console.log('[RBAC SETUP] Adding role_id column to users table...');
            await db.execute(`
                ALTER TABLE users 
                ADD COLUMN role_id INT NULL,
                ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
            `);
        }

        // 5. Insert default system roles
        console.log('[RBAC SETUP] Seeding default system roles...');

        const defaultRoles = [
            { name: 'Admin', description: 'System Administrator with full access', is_system: true, type: 'main' },
            { name: 'Doctor', description: 'Medical Doctor', is_system: true, type: 'main' },
            { name: 'Receptionist', description: 'Front Desk Staff', is_system: true, type: 'main' },
            { name: 'Lab Technician', description: 'Laboratory Technician', is_system: true, type: 'main' },
            { name: 'Pharmacist', description: 'Pharmacy Staff', is_system: true, type: 'main' },
            { name: 'LAB_MASTER', description: 'Lab Supervisor', is_system: true, type: 'main' },
            { name: 'PHARMA_MASTER', description: 'Pharmacy Supervisor', is_system: true, type: 'main' },
            { name: 'HR', description: 'Human Resources', is_system: true, type: 'main' }
        ];

        for (const role of defaultRoles) {
            // Check if role exists
            const [existing] = await db.execute('SELECT id FROM roles WHERE name = ?', [role.name]);

            if (existing.length === 0) {
                await db.execute(
                    'INSERT INTO roles (name, description, is_system, type) VALUES (?, ?, ?, ?)',
                    [role.name, role.description, role.is_system, role.type]
                );
                console.log(`[RBAC SETUP] ✓ Created role: ${role.name}`);
            } else {
                console.log(`[RBAC SETUP] - Role already exists: ${role.name}`);
            }
        }

        // 6. Insert default permissions (examples)
        console.log('[RBAC SETUP] Seeding default permissions...');

        const defaultPermissions = [
            // User Management
            { name: 'users.view', module_name: 'Users', action: 'View', description: 'View user list' },
            { name: 'users.create', module_name: 'Users', action: 'Create', description: 'Create new users' },
            { name: 'users.edit', module_name: 'Users', action: 'Edit', description: 'Edit user details' },
            { name: 'users.delete', module_name: 'Users', action: 'Delete', description: 'Delete users' },

            // Patient Management
            { name: 'patients.view', module_name: 'Patients', action: 'View', description: 'View patient records' },
            { name: 'patients.create', module_name: 'Patients', action: 'Create', description: 'Create patient records' },
            { name: 'patients.edit', module_name: 'Patients', action: 'Edit', description: 'Edit patient records' },
            { name: 'patients.delete', module_name: 'Patients', action: 'Delete', description: 'Delete patient records' },

            // Appointments
            { name: 'appointments.view', module_name: 'Appointments', action: 'View', description: 'View appointments' },
            { name: 'appointments.create', module_name: 'Appointments', action: 'Create', description: 'Create appointments' },
            { name: 'appointments.edit', module_name: 'Appointments', action: 'Edit', description: 'Edit appointments' },
            { name: 'appointments.cancel', module_name: 'Appointments', action: 'Cancel', description: 'Cancel appointments' },

            // Lab
            { name: 'lab.view', module_name: 'Laboratory', action: 'View', description: 'View lab requests' },
            { name: 'lab.create', module_name: 'Laboratory', action: 'Create', description: 'Create lab requests' },
            { name: 'lab.approve', module_name: 'Laboratory', action: 'Approve', description: 'Approve lab results' },

            // Pharmacy
            { name: 'pharmacy.view', module_name: 'Pharmacy', action: 'View', description: 'View pharmacy requests' },
            { name: 'pharmacy.dispense', module_name: 'Pharmacy', action: 'Dispense', description: 'Dispense medications' },
            { name: 'pharmacy.approve', module_name: 'Pharmacy', action: 'Approve', description: 'Approve pharmacy requests' },

            // Billing
            { name: 'billing.view', module_name: 'Billing', action: 'View', description: 'View billing records' },
            { name: 'billing.create', module_name: 'Billing', action: 'Create', description: 'Create invoices' },

            // Admin
            { name: 'admin.full', module_name: 'Admin', action: 'Full Access', description: 'Full administrative access' },
            { name: 'roles.manage', module_name: 'Roles', action: 'Manage', description: 'Manage roles and permissions' }
        ];

        for (const perm of defaultPermissions) {
            const [existing] = await db.execute('SELECT id FROM permissions WHERE name = ?', [perm.name]);

            if (existing.length === 0) {
                await db.execute(
                    'INSERT INTO permissions (name, module_name, action, description) VALUES (?, ?, ?, ?)',
                    [perm.name, perm.module_name, perm.action, perm.description]
                );
                console.log(`[RBAC SETUP] ✓ Created permission: ${perm.name}`);
            } else {
                console.log(`[RBAC SETUP] - Permission already exists: ${perm.name}`);
            }
        }

        // 7. Assign all permissions to Admin role
        console.log('[RBAC SETUP] Assigning all permissions to Admin role...');
        const [adminRole] = await db.execute('SELECT id FROM roles WHERE name = ?', ['Admin']);
        const [allPermissions] = await db.execute('SELECT id FROM permissions');

        if (adminRole.length > 0) {
            for (const perm of allPermissions) {
                const [existing] = await db.execute(
                    'SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?',
                    [adminRole[0].id, perm.id]
                );

                if (existing.length === 0) {
                    await db.execute(
                        'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                        [adminRole[0].id, perm.id]
                    );
                }
            }
            console.log('[RBAC SETUP] ✓ Admin role has full permissions');
        }

        // 8. Update existing users with role_id
        console.log('[RBAC SETUP] Updating existing users with role_id...');
        const [users] = await db.execute('SELECT id, role FROM users WHERE role_id IS NULL');

        for (const user of users) {
            const [roleRecord] = await db.execute('SELECT id FROM roles WHERE name = ?', [user.role]);
            if (roleRecord.length > 0) {
                await db.execute('UPDATE users SET role_id = ? WHERE id = ?', [roleRecord[0].id, user.id]);
                console.log(`[RBAC SETUP] ✓ Updated user ${user.id} with role_id`);
            }
        }

        console.log('[RBAC SETUP] ✅ RBAC schema setup completed successfully!');
        console.log('[RBAC SETUP] Summary:');
        console.log('  - Tables: roles, permissions, role_permissions created');
        console.log('  - System roles: 8 default roles created');
        console.log('  - Permissions: Multiple default permissions created');
        console.log('  - Admin role has full permissions');

        process.exit(0);

    } catch (error) {
        console.error('[RBAC SETUP] ❌ Error setting up RBAC schema:', error);
        console.error('[RBAC SETUP] Stack:', error.stack);
        process.exit(1);
    }
}

setupRBACSchema();
