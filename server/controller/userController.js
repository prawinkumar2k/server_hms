const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

// Helper for error handling
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ success: false, message: message });
};

// --- Roles ---
exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM users_roles'); // Fetch all columns, assuming 'id', 'role'
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        handleError(res, error, 'Error fetching roles');
    }
};

exports.createRole = async (req, res) => {
    const { role } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role name is required' });

    try {
        await db.query('INSERT INTO users_roles (role) VALUES (?)', [role]);
        res.status(201).json({ success: true, message: 'Role created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Role already exists' });
        }
        handleError(res, error, 'Error creating role');
    }
};

// --- Helper Data ---
exports.getModules = async (req, res) => {
    try {
        const [modules] = await db.query('SELECT * FROM sidebar_modules WHERE is_active = 1 ORDER BY module_category, module_name');

        const grouped = modules.reduce((acc, module) => {
            const category = module.module_category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(module);
            return acc;
        }, {});

        res.status(200).json({ success: true, data: grouped });
    } catch (error) {
        handleError(res, error, 'Error fetching modules');
    }
};

exports.getStaff = async (req, res) => {
    try {
        const [staff] = await db.query('SELECT id, staff_name FROM staff_master');
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(200).json({ success: true, data: [] });
        }
        handleError(res, error, 'Error fetching staff');
    }
};

// --- Users ---
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, role, staff_id, staff_name, module_access, created_at, updated_at FROM users ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        handleError(res, error, 'Error fetching users');
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query('SELECT id, username, role, staff_id, staff_name, module_access FROM users WHERE id = ?', [id]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, data: users[0] });
    } catch (error) {
        handleError(res, error, 'Error fetching user details');
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role, staff_id, staff_name, module_access } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Username, password, and role are required' });
    }

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const accessString = Array.isArray(module_access) ? module_access.join(',') : (module_access || '');

        await db.query(
            'INSERT INTO users (username, password, role, staff_id, staff_name, module_access) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, role, staff_id || null, staff_name || null, accessString]
        );

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        handleError(res, error, 'Error creating user');
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role, staff_id, staff_name, module_access, password } = req.body; // Password optional

    try {
        let query = 'UPDATE users SET username = ?, role = ?, staff_id = ?, staff_name = ?, module_access = ?';
        let params = [username, role, staff_id || null, staff_name || null, Array.isArray(module_access) ? module_access.join(',') : module_access];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        handleError(res, error, 'Error updating user');
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting user');
    }
};
