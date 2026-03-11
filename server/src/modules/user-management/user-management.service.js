const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const ROLE_MANDATORY_MODULES = require('../../config/role_modules');

class UserService {
    // --- Roles ---
    static async getAllRoles() {
        // Fetch roles from centralized 'roles' table (RBAC)
        const [roles] = await db.execute('SELECT id, name as role FROM roles ORDER BY name');
        return roles;
    }

    static async createRole(roleName) {
        const [result] = await db.execute('INSERT INTO roles (name, type) VALUES (?, ?)', [roleName, 'custom']);
        return result.insertId;
    }

    // --- Modules ---
    static async getModules() {
        // Fetch modules (ensure sidebar_modules is populated)
        const [modules] = await db.execute('SELECT * FROM sidebar_modules WHERE is_active = TRUE ORDER BY module_category, module_name');

        // Group by category
        const grouped = modules.reduce((acc, mod) => {
            const category = mod.module_category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(mod);
            return acc;
        }, {});

        return grouped;
    }

    // --- Staff ---
    static async getStaffList() {
        const [staff] = await db.execute('SELECT id, staff_id, staff_name FROM staff_master WHERE status = ?', ['Active']);
        return staff;
    }

    // --- Users ---
    static async getAllUsers() {
        const [users] = await db.execute(`
            SELECT u.id, u.username, u.role, u.staff_id, u.staff_name, u.module_access, u.status, u.created_at, sm.staff_name as linked_staff_name
            FROM users u
            LEFT JOIN staff_master sm ON u.staff_id = sm.staff_id
            ORDER BY u.created_at DESC
        `);
        return users;
    }

    static async createUser(userData) {
        const { username, password, role, staff_id, module_access, staff_name, full_name, status } = userData;

        // check duplicate username
        const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Merge with mandatory modules for this role
        const defaultModules = ROLE_MANDATORY_MODULES[role] || [];
        const requestedModules = Array.isArray(module_access)
            ? module_access
            : (module_access ? module_access.split(',') : []);

        const finalModules = [...new Set([...defaultModules, ...requestedModules])];
        const finalModulesStr = finalModules.join(',');

        const activeFullName = full_name || staff_name || 'User';
        const finalStaffName = staff_name || null;
        const finalStaffId = staff_id || null;
        const finalStatus = status || 'Active';

        const dbParams = [
            username,
            hashedPassword,
            role,
            finalStaffId,
            activeFullName,
            finalStaffName,
            finalModulesStr,
            finalStatus
        ];

        const [result] = await db.execute(
            'INSERT INTO users (username, password, role, staff_id, full_name, staff_name, module_access, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            dbParams
        );

        return result.insertId;
    }

    static async updateUser(id, updateData) {
        // Check user exists
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) throw new Error('User not found');
        const currentUser = users[0];

        const fieldsToUpdate = [];
        const params = [];

        // Determine effective role for mandatory module check
        const effectiveRole = updateData.role || currentUser.role;

        // Determine effective modules
        let effectiveModules = null;
        if (updateData.module_access !== undefined) {
            effectiveModules = Array.isArray(updateData.module_access)
                ? updateData.module_access
                : (updateData.module_access ? updateData.module_access.split(',') : []);
        } else {
            effectiveModules = currentUser.module_access ? currentUser.module_access.split(',') : [];
        }

        // Apply mandatory defaults
        const defaultModules = ROLE_MANDATORY_MODULES[effectiveRole] || [];
        const finalUniqueModules = [...new Set([...defaultModules, ...effectiveModules])];

        // Always update module_access if we are touching role or modules, 
        // to ensure defaults are enforced even if untoched in payload but role changed.
        // Or if we just want to be safe, we can check if it changed.
        if (updateData.module_access !== undefined || updateData.role !== undefined) {
            fieldsToUpdate.push('module_access = ?');
            params.push(finalUniqueModules.join(','));
        }

        // ... handle other fields ...
        if (updateData.role !== undefined) {
            fieldsToUpdate.push('role = ?');
            params.push(updateData.role);
        }
        if (updateData.staff_id !== undefined) {
            fieldsToUpdate.push('staff_id = ?');
            params.push(updateData.staff_id);
        }
        if (updateData.staff_name !== undefined) {
            fieldsToUpdate.push('staff_name = ?');
            params.push(updateData.staff_name);
        }
        if (updateData.status !== undefined) {
            fieldsToUpdate.push('status = ?');
            params.push(updateData.status);
        }
        if (updateData.full_name !== undefined) {
            fieldsToUpdate.push('full_name = ?');
            params.push(updateData.full_name);
        }

        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            fieldsToUpdate.push('password = ?');
            params.push(hashedPassword);
        }

        if (updateData.username && updateData.username !== currentUser.username) {
            const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [updateData.username]);
            if (existing.length > 0) throw new Error('Username already taken');
            fieldsToUpdate.push('username = ?');
            params.push(updateData.username);
        }

        if (fieldsToUpdate.length === 0) {
            return true;
        }

        const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        params.push(id);

        await db.execute(query, params);
        return true;
    }

    static async deleteUser(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
}

module.exports = UserService;
