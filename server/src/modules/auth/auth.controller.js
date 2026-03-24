const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * SECURE LOGIN CONTROLLER
 * Handles user authentication with comprehensive error handling
 * Returns JWT token on successful authentication
 */
exports.login = async (req, res) => {
    try {
        // 1. VALIDATE INPUT
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('[LOGIN] Missing credentials - Username or Password not provided');
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        console.log(`[LOGIN] Attempting login for username: ${username}`);
        console.log(`[LOGIN] TEST_DEBUG: Password length: ${password ? password.length : 0}`);
        if (password && password.includes(' ')) console.log('[LOGIN] WARNING: Password contains spaces');

        // 2. VERIFY JWT_SECRET EXISTS
        if (!process.env.JWT_SECRET) {
            console.error('[LOGIN] CRITICAL: JWT_SECRET not defined in environment');
            return res.status(500).json({
                message: 'Server configuration error'
            });
        }

        // 3. CHECK USER EXISTS
        let users;
        try {
            [users] = await db.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
        } catch (dbError) {
            console.error('[LOGIN] Database query error:', dbError);
            return res.status(500).json({
                message: 'Database error occurred',
                error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            });
        }

        // Check if user exists
        if (!users || users.length === 0) {
            console.log(`[LOGIN] User not found: ${username}`);
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // 4. VERIFY USER OBJECT INTEGRITY
        if (!user.id || !user.password || !user.role) {
            console.error('[LOGIN] User record is corrupted - missing required fields');
            return res.status(500).json({
                message: 'User account data is corrupted'
            });
        }

        // 5. CHECK PASSWORD
        let passwordMatch;
        try {
            passwordMatch = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
            console.error('[LOGIN] Password comparison error:', bcryptError);
            return res.status(500).json({
                message: 'Authentication error occurred'
            });
        }

        if (!passwordMatch) {
            console.log(`[LOGIN] Invalid password for user: ${username}`);
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // 6. CHECK ACCOUNT STATUS
        if (user.status && user.status !== 'Active') {
            console.log(`[LOGIN] Inactive account attempted login: ${username}`);
            return res.status(403).json({
                message: 'Account is inactive. Please contact Admin.'
            });
        }

        // Parse module_access
        const moduleAccess = user.module_access ? user.module_access.split(',') : [];

        // 7. GENERATE JWT TOKEN
        let token;
        try {
            token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    module_access: moduleAccess
                },
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );
        } catch (jwtError) {
            console.error('[LOGIN] JWT generation error:', jwtError);
            return res.status(500).json({
                message: 'Token generation failed'
            });
        }

        // 8. LOG AUDIT (NON-BLOCKING - errors won't crash login)
        try {
            const logAudit = require('../../utils/auditLogger');
            await logAudit('LOGIN', user.role, user.id, user.id, 'OFFLINE', 'ONLINE', 'User logged in successfully');
        } catch (auditError) {
            // Audit logging is optional - don't fail login if it errors
            console.warn('[LOGIN] Audit logging failed (non-critical):', auditError.message);
        }

        // 9. RETURN SUCCESS RESPONSE
        console.log(`[LOGIN] Successful login for user: ${username} (Role: ${user.role})`);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name || 'User',
                module_access: moduleAccess
            }
        });

    } catch (error) {
        // CATCH-ALL ERROR HANDLER
        console.error('[LOGIN] UNEXPECTED ERROR:', error);
        console.error('[LOGIN] Stack trace:', error.stack);

        // Never expose internal errors to client in production
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};

/**
 * GET CURRENT USER
 * Returns current user information based on JWT token
 */
exports.getMe = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [users] = await db.execute(
            'SELECT id, username, full_name, role, status, created_at, module_access FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        user.module_access = user.module_access ? user.module_access.split(',') : [];

        res.json(user);
    } catch (err) {
        console.error('[GET_ME] Error:', err);
        res.status(500).json({
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Public endpoint: Get roles for login dropdown (no auth required)
exports.getLoginRoles = async (req, res) => {
    try {
        const [roles] = await db.execute('SELECT id, name FROM roles ORDER BY name ASC');
        res.json(roles);
    } catch (error) {
        console.error('Get Login Roles Error:', error);
        res.status(500).json({ message: 'Failed to fetch roles' });
    }
};
