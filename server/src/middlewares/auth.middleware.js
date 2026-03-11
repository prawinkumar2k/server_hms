const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded; // { id, username, role, iat, exp }
        next();
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required: [${allowedRoles.join(', ')}], Current: ${req.user.role}`
            });
        }
        next();
    };
};

const checkPermission = (moduleName, action) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Admins bypass strict checks if needed, but for strict RBAC we check DB.
        if (req.user.role === 'Admin') return next();

        try {
            // Lazy load db to avoid circular deps if any, though usually fine.
            const db = require('../config/db');
            const [rows] = await db.execute(`
                SELECT 1 
                FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                JOIN roles r ON r.id = rp.role_id
                WHERE r.name = ? AND p.module_name = ? AND p.action = ?
            `, [req.user.role, moduleName, action]);

            if (rows.length > 0) {
                next();
            } else {
                res.status(403).json({ message: `Access Denied: Requires ${action} on ${moduleName}` });
            }
        } catch (error) {
            console.error('RBAC Error:', error);
            res.status(500).json({ message: 'Server error checking permissions' });
        }
    };
};

const authorizeModule = (moduleKey) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Admin Bypass
        if (req.user.role === 'Admin') return next();

        // Check module access
        // module_access is expected to be an array in req.user (from token)
        const userModules = req.user.module_access || [];
        if (Array.isArray(userModules) && userModules.includes(moduleKey)) {
            return next();
        }

        return res.status(403).json({
            message: `Access Denied: You do not have access to the '${moduleKey}' module.`
        });
    };
};

const protect = verifyToken;

module.exports = { verifyToken, authorizeRoles, checkPermission, authorizeModule, protect };
