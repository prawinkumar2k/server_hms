/**
 * Input Validation & Sanitization Middleware
 * 
 * Production-grade request validation without external validators.
 * Designed for HMS use cases: patient IDs, dates, phone numbers, etc.
 */

/**
 * Sanitize string — prevent basic XSS
 * Strips HTML tags and trims whitespace
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Deep-sanitize an object's string values recursively
 */
const sanitizeBody = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const clean = Array.isArray(obj) ? [] : {};
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
            clean[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
            clean[key] = sanitizeBody(obj[key]);
        } else {
            clean[key] = obj[key];
        }
    }
    return clean;
};

/**
 * Auto-sanitize middleware — apply on all POST/PUT/PATCH requests
 * Strips HTML tags from all string inputs to prevent stored XSS.
 */
const autoSanitize = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        req.body = sanitizeBody(req.body);
    }
    if (req.query) {
        req.query = sanitizeBody(req.query);
    }
    next();
};

/**
 * Validate required fields middleware factory
 * 
 * Usage:
 *   router.post('/patients', validateRequired(['name', 'age', 'gender']), controller.create);
 * 
 * @param {string[]} fields - Array of required field names
 */
const validateRequired = (fields) => {
    return (req, res, next) => {
        const missing = fields.filter(f => {
            const val = req.body[f];
            return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
        });

        if (missing.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Missing required fields: ${missing.join(', ')}`
            });
        }
        next();
    };
};

/**
 * Validate ID parameter — must be a numeric or alphanumeric ID
 * Prevents SQL injection via route params
 */
const validateIdParam = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
            return res.status(400).json({
                status: 'error',
                message: `Invalid ${paramName} parameter`
            });
        }
        next();
    };
};

/**
 * Validate date query parameter — must be YYYY-MM-DD format
 */
const validateDateParam = (paramName = 'date') => {
    return (req, res, next) => {
        const date = req.query[paramName];
        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                status: 'error',
                message: `Invalid ${paramName} format. Expected YYYY-MM-DD`
            });
        }
        next();
    };
};

/**
 * Validate pagination params — page and limit must be positive integers
 */
const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && (isNaN(page) || parseInt(page) < 1)) {
        return res.status(400).json({ status: 'error', message: 'page must be a positive integer' });
    }
    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
        return res.status(400).json({ status: 'error', message: 'limit must be between 1 and 100' });
    }

    // Normalize to integers
    if (page) req.query.page = parseInt(page);
    if (limit) req.query.limit = parseInt(limit);

    next();
};

module.exports = {
    autoSanitize,
    sanitizeBody,
    sanitizeString,
    validateRequired,
    validateIdParam,
    validateDateParam,
    validatePagination
};
