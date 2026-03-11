const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// --- MASTER SEARCH ---

exports.searchAll = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({});

    const searchTerm = `%${q}%`;

    const [users] = await db.execute('SELECT id, full_name, role, status FROM users WHERE full_name LIKE ? OR username LIKE ? LIMIT 5', [searchTerm, searchTerm]);
    const [patients] = await db.execute('SELECT id, name, mobile, age, gender FROM patients WHERE name LIKE ? OR mobile LIKE ? LIMIT 5', [searchTerm, searchTerm]);
    const [appointments] = await db.execute('SELECT id, patient_name, doctor_name, date, status FROM appointments WHERE patient_name LIKE ? OR doctor_name LIKE ? LIMIT 5', [searchTerm, searchTerm]);

    res.json({
        users,
        patients,
        appointments
    });
});

// --- ROLE MANAGEMENT ---

// Get all roles
exports.getAllRoles = catchAsync(async (req, res, next) => {
    const [roles] = await db.execute(`
        SELECT r.*, p.name as parent_role_name 
        FROM roles r 
        LEFT JOIN roles p ON r.parent_role_id = p.id 
        ORDER BY r.name ASC
    `);
    res.json(roles);
});

// Create new role
exports.createRole = catchAsync(async (req, res, next) => {
    const { name, description, parent_role_id, type } = req.body;
    if (!name) return next(new AppError('Role name is required', 400));

    // Check duplicate
    const [existing] = await db.execute('SELECT id FROM roles WHERE name = ?', [name]);
    if (existing.length > 0) return next(new AppError('Role already exists', 400));

    const [result] = await db.execute(
        'INSERT INTO roles (name, description, type, parent_role_id) VALUES (?, ?, ?, ?)',
        [name, description || null, type || 'custom', parent_role_id || null]
    );
    res.status(201).json({ message: 'Role created successfully', id: result.insertId });
});

// Update existing role
exports.updateRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, type, parent_role_id } = req.body;

    // Check exists
    const [role] = await db.execute('SELECT * FROM roles WHERE id = ?', [id]);
    if (role.length === 0) return next(new AppError('Role not found', 404));

    // Protect system roles from name change
    if (role[0].type === 'system' && name && name !== role[0].name) {
        return next(new AppError('Cannot rename system roles', 403));
    }

    // Check duplicate name (if changing)
    if (name && name !== role[0].name) {
        const [dup] = await db.execute('SELECT id FROM roles WHERE name = ? AND id != ?', [name, id]);
        if (dup.length > 0) return next(new AppError('A role with this name already exists', 400));

        // Update users table to reflect the name change
        await db.execute('UPDATE users SET role = ? WHERE role = ?', [name, role[0].name]);
    }

    await db.execute(
        'UPDATE roles SET name = ?, description = ?, type = ?, parent_role_id = ? WHERE id = ?',
        [name || role[0].name, description !== undefined ? description : role[0].description, type || role[0].type, parent_role_id !== undefined ? parent_role_id : role[0].parent_role_id, id]
    );

    res.json({ message: 'Role updated successfully' });
});

// --- PERMISSION MANAGEMENT ---

// Get all available permissions
exports.getAllPermissions = catchAsync(async (req, res, next) => {
    const [permissions] = await db.execute('SELECT * FROM permissions ORDER BY module_name, action');
    res.json(permissions);
});

// Get permissions for a specific role
exports.getRolePermissions = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const [results] = await db.execute(`
        SELECT p.*
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
    `, [id]);
    res.json(results);
});

// Update permissions for a role
exports.updateRolePermissions = catchAsync(async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params; // roleId
        const { permissionIds } = req.body; // Array of permission IDs

        if (!Array.isArray(permissionIds)) {
            throw new AppError('permissionIds must be an array', 400);
        }

        // Clear existing permissions
        await connection.execute('DELETE FROM role_permissions WHERE role_id = ?', [id]);

        // Insert new permissions
        if (permissionIds.length > 0) {
            const values = permissionIds.map(pid => [id, pid]);
            await connection.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ?', [values]);
        }

        await connection.commit();
        res.json({ message: 'Permissions updated successfully' });
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
});

// Delete role
exports.deleteRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Check role exists
    const [role] = await db.execute('SELECT type, name FROM roles WHERE id = ?', [id]);
    if (role.length === 0) return next(new AppError('Role not found', 404));
    if (role[0].type === 'system') return next(new AppError('Cannot delete system roles', 403));

    // Check if users are assigned to this role
    const [users] = await db.execute('SELECT id FROM users WHERE role = ?', [role[0].name]);
    if (users.length > 0) return next(new AppError(`Cannot delete role: ${users.length} user(s) are currently assigned to this role.`, 400));

    await db.execute('DELETE FROM roles WHERE id = ?', [id]);
    res.json({ message: 'Role deleted successfully' });
});

// --- HELPER DATA ---

exports.getModules = catchAsync(async (req, res, next) => {
    const [modules] = await db.execute('SELECT * FROM sidebar_modules WHERE is_active = 1 ORDER BY module_category, module_name');

    const grouped = modules.reduce((acc, module) => {
        const category = module.module_category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(module);
        return acc;
    }, {});

    res.json(grouped);
});

exports.getStaff = catchAsync(async (req, res, next) => {
    try {
        const [staff] = await db.execute('SELECT id, staff_name FROM staff_master');
        res.json(staff);
    } catch (error) {
        // Fallback if table doesn't exist
        res.json([]);
    }
});

// --- USER MANAGEMENT ---

// List all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM users';
    let params = [];
    let conditions = [];

    // Filter out deleted users if 'status' column exists (graceful)
    // We'll filter in JS if the column doesn't exist
    if (search) {
        conditions.push('(username LIKE ? OR COALESCE(full_name, username) LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [allUsers] = await db.query(query, params);

    // Filter out 'Deleted' users in JS (safe even if status column doesn't exist)
    const users = allUsers
        .filter(u => (u.status || 'Active') !== 'Deleted')
        .map(u => ({
            id: u.id,
            username: u.username,
            full_name: u.full_name || u.name || u.username,
            role: u.role,
            status: u.status || 'Active',
            staff_name: u.staff_name || null,
            module_access: u.module_access || '',
            created_at: u.created_at,
            updated_at: u.updated_at || u.created_at
        }));

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let countParams = [];
    if (search) {
        countQuery += ' WHERE (username LIKE ? OR COALESCE(full_name, username) LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countResult] = await db.query(countQuery, countParams);

    res.json({
        users,
        total: countResult[0].total,
        page: parseInt(page),
        totalPages: Math.ceil(countResult[0].total / limit)
    });
});

// Create a new user
exports.createUser = catchAsync(async (req, res, next) => {
    const { username, password, full_name, role, staff_id, staff_name, module_access } = req.body;

    if (!username || !password || !role) {
        return next(new AppError('Username, password, and role are required', 400));
    }

    // Validate Role against DB
    const [validRole] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    if (validRole.length === 0) {
        return next(new AppError(`Invalid role: ${role}`, 400));
    }

    // Check if username exists
    const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
        return next(new AppError('Username already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessString = Array.isArray(module_access) ? module_access.join(',') : (module_access || '');

    const finalFullName = full_name || staff_name || username; // Fallback to username
    const finalStaffName = staff_name || full_name || null;
    const finalStaffId = staff_id || null;

    // Insert
    const [result] = await db.execute(
        'INSERT INTO users (username, password, full_name, role, role_id, status, staff_id, staff_name, module_access) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, finalFullName, role, validRole[0].id, 'Active', finalStaffId, finalStaffName, accessString]
    );

    res.status(201).json({
        message: 'User created successfully',
        user: {
            id: result.insertId,
            username,
            full_name: full_name || staff_name,
            role,
            status: 'Active'
        }
    });
});

// Get single user
exports.getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) return next(new AppError('User not found', 404));

    // Build a safe response, picking only relevant fields (avoids exposing password)
    const u = users[0];
    res.json({
        data: {
            id: u.id,
            username: u.username,
            full_name: u.full_name || u.name || u.username,
            role: u.role,
            status: u.status || 'Active',
            staff_id: u.staff_id || null,
            staff_name: u.staff_name || null,
            module_access: u.module_access || '',
            created_at: u.created_at
        }
    });
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { full_name, role, status, password, username, staff_id, staff_name, module_access } = req.body;

    // Check user exists
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
        return next(new AppError('User not found', 404));
    }

    const currentUser = users[0];
    let updates = [];
    let params = [];

    // 1. Basic Fields
    if (full_name && full_name !== currentUser.full_name) {
        updates.push('full_name = ?');
        params.push(full_name);
    }

    if (status && status !== currentUser.status) {
        updates.push('status = ?');
        params.push(status);
    }

    if (staff_name && staff_name !== currentUser.staff_name) {
        updates.push('staff_name = ?');
        params.push(staff_name);
    }

    if (staff_id !== undefined && staff_id !== currentUser.staff_id) {
        updates.push('staff_id = ?');
        params.push(staff_id || null);
    }

    // Handle module access array -> string
    if (module_access !== undefined) {
        const accessString = Array.isArray(module_access) ? module_access.join(',') : module_access;
        if (accessString !== currentUser.module_access) {
            updates.push('module_access = ?');
            params.push(accessString);
        }
    }

    // 2. Username Change
    if (username && username !== currentUser.username) {
        const [existing] = await db.execute('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
        if (existing.length > 0) {
            return next(new AppError('Username already taken', 400));
        }
        updates.push('username = ?');
        params.push(username);
    }

    // 3. Password Change
    if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push('password = ?');
        params.push(hashedPassword);
    }

    // 4. Role Change
    if (role && role !== currentUser.role) {
        const [roleRows] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
        if (roleRows.length === 0) {
            return next(new AppError(`Invalid role: ${role}`, 400));
        }
        updates.push('role = ?', 'role_id = ?');
        params.push(role, roleRows[0].id);
    }

    if (updates.length === 0) {
        return res.json({ message: 'No changes detected' });
    }

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    await db.execute(query, params);

    res.json({ message: 'User updated successfully' });
});

// Delete User (Soft Delete)
exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Verify not deleting self
    if (parseInt(id) === req.user.id) {
        return next(new AppError('Cannot delete your own account', 400));
    }

    // Soft delete
    await db.execute('UPDATE users SET status = ? WHERE id = ?', ['Deleted', id]);

    res.json({ message: 'User deleted successfully' });
});

// --- SYSTEM MONITORING ---

// Get Audit Logs
exports.getAuditLogs = catchAsync(async (req, res, next) => {
    const { userId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            a.*, 
            a.timestamp as created_at,
            u.full_name as user_name,
            u.role as user_role
        FROM audit_logs a
        LEFT JOIN users u ON a.performed_by = u.id
    `;
    const params = [];

    if (userId) {
        query += ' WHERE a.performed_by = ?';
        params.push(userId);
    }

    query += ' ORDER BY a.timestamp DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs';
    let countParams = [];
    if (userId) {
        countQuery += ' WHERE performed_by = ?';
        countParams.push(userId);
    }
    const [countResult] = await db.query(countQuery, countParams);

    res.json({
        logs,
        total: countResult[0].total,
        page: parseInt(page),
        totalPages: Math.ceil(countResult[0].total / limit)
    });
});

// --- DASHBOARD STATS ---

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Run all queries in parallel for performance
    const [
        [totalPatientsResult],
        [todayAppointmentsResult],
        [activeDoctorsResult],
        [todayRevenueResult],
        [activeUsersResult],
        [totalBedsResult],
        [occupiedBedsResult],
        [recentActivity]
    ] = await Promise.all([
        // Total Patients
        db.execute('SELECT COUNT(*) as total FROM patients').catch(() => [[{ total: 0 }]]),
        // Today's Appointments
        db.execute('SELECT COUNT(*) as total FROM appointments WHERE DATE(date) = ?', [today]).catch(() => [[{ total: 0 }]]),
        // Active Doctors
        db.execute("SELECT COUNT(*) as total FROM doctor_profiles").catch(() => [[{ total: 0 }]]),
        // Today's Revenue (from invoices)
        db.execute('SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices WHERE DATE(created_at) = ?', [today]).catch(() => [[{ total: 0 }]]),
        // Active Users
        db.execute("SELECT COUNT(*) as total FROM users WHERE status = 'Active'").catch(() => [[{ total: 0 }]]),
        // Total Beds
        db.execute('SELECT COUNT(*) as total FROM beds').catch(() => [[{ total: 0 }]]),
        // Occupied Beds
        db.execute("SELECT COUNT(*) as total FROM beds WHERE status = 'Occupied'").catch(() => [[{ total: 0 }]]),
        // Recent Activity (last 10 audit logs)
        db.query('SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON a.performed_by = u.id ORDER BY a.timestamp DESC LIMIT 10').catch(() => [[]])
    ]);

    res.json({
        stats: {
            totalPatients: totalPatientsResult[0]?.total || 0,
            todayAppointments: todayAppointmentsResult[0]?.total || 0,
            activeDoctors: activeDoctorsResult[0]?.total || 0,
            todayRevenue: todayRevenueResult[0]?.total || 0,
            activeUsers: activeUsersResult[0]?.total || 0,
            totalBeds: totalBedsResult[0]?.total || 0,
            occupiedBeds: occupiedBedsResult[0]?.total || 0,
        },
        recentActivity: recentActivity
    });
});

// --- ANALYTICS DATA ---

exports.getDashboardAnalytics = catchAsync(async (req, res, next) => {
    const [
        [weeklyPatients],
        [weeklyRevenue],
        [appointmentsByStatus],
        [usersByRole],
        [weeklyAppointments]
    ] = await Promise.all([
        // Patient registrations last 7 days
        db.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM patients 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        `).catch(() => [[]]),

        // Revenue last 7 days
        db.query(`
            SELECT DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as revenue 
            FROM invoices 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        `).catch(() => [[]]),

        // Appointment status breakdown
        db.query(`
            SELECT status, COUNT(*) as count 
            FROM appointments 
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY status
        `).catch(() => [[]]),

        // Users by role
        db.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            WHERE status = 'Active' 
            GROUP BY role
        `).catch(() => [[]]),

        // Appointments per day last 7 days
        db.query(`
            SELECT DATE(date) as date, COUNT(*) as count 
            FROM appointments 
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
            GROUP BY DATE(date) 
            ORDER BY date ASC
        `).catch(() => [[]])
    ]);

    // Fill missing days for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const patientTrend = last7Days.map(date => {
        const found = weeklyPatients.find(r => {
            const rDate = new Date(r.date).toISOString().split('T')[0];
            return rDate === date;
        });
        const dayName = dayNames[new Date(date).getDay()];
        return { day: dayName, date, patients: found ? found.count : 0 };
    });

    const revenueTrend = last7Days.map(date => {
        const found = weeklyRevenue.find(r => {
            const rDate = new Date(r.date).toISOString().split('T')[0];
            return rDate === date;
        });
        const dayName = dayNames[new Date(date).getDay()];
        return { day: dayName, date, revenue: found ? Number(found.revenue) : 0 };
    });

    const appointmentTrend = last7Days.map(date => {
        const found = weeklyAppointments.find(r => {
            const rDate = new Date(r.date).toISOString().split('T')[0];
            return rDate === date;
        });
        const dayName = dayNames[new Date(date).getDay()];
        return { day: dayName, date, appointments: found ? found.count : 0 };
    });

    res.json({
        patientTrend,
        revenueTrend,
        appointmentTrend,
        appointmentsByStatus,
        usersByRole
    });
});
