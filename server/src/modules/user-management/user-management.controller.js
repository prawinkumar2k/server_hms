const UserService = require('./user-management.service');
const db = require('../../config/db'); // For direct logging if needed, or use LogService

// Helper for error handling
const catchAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// --- Roles ---
exports.getRoles = catchAsync(async (req, res) => {
    const roles = await UserService.getAllRoles();
    res.json(roles);
});

exports.createRole = catchAsync(async (req, res) => {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role name requred' });
    await UserService.createRole(role);
    res.status(201).json({ message: 'Role created' });
});

// --- Modules ---
exports.getModules = catchAsync(async (req, res) => {
    const modules = await UserService.getModules();
    res.json(modules);
});

// --- Staff ---
exports.getStaff = catchAsync(async (req, res) => {
    const staff = await UserService.getStaffList();
    res.json(staff);
});

// --- Users ---
exports.getUsers = catchAsync(async (req, res) => {
    const users = await UserService.getAllUsers();
    // Parse module_access for frontend
    const parsedUsers = users.map(u => ({
        ...u,
        module_access: u.module_access ? u.module_access.split(',') : []
    }));
    res.json(parsedUsers);
});

exports.createUser = catchAsync(async (req, res) => {
    try {
        const userId = await UserService.createUser(req.body);

        // Log Activity
        await db.execute(
            'INSERT INTO log_details (username, role, action, details) VALUES (?, ?, ?, ?)',
            [req.user.username, req.user.role, 'Create User', `Created user ${req.body.username} with role ${req.body.role}`]
        );

        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
        if (error.message === 'Username already exists') {
            return res.status(409).json({ message: error.message });
        }
        throw error;
    }
});

exports.updateUser = catchAsync(async (req, res) => {
    try {
        await UserService.updateUser(req.params.id, req.body);

        // Log Activity
        await db.execute(
            'INSERT INTO log_details (username, role, action, details) VALUES (?, ?, ?, ?)',
            [req.user.username, req.user.role, 'Update User', `Updated user ID ${req.params.id}`]
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        if (error.message === 'Username already taken') {
            return res.status(409).json({ message: error.message });
        } else if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        throw error;
    }
});

exports.deleteUser = catchAsync(async (req, res) => {
    await UserService.deleteUser(req.params.id);

    // Log Activity
    await db.execute(
        'INSERT INTO log_details (username, role, action, details) VALUES (?, ?, ?, ?)',
        [req.user.username, req.user.role, 'Delete User', `Deleted user ID ${req.params.id}`]
    );

    res.json({ message: 'User deleted successfully' });
});
