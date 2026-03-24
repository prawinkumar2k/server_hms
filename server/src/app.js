const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const errorMiddleware = require('./middlewares/error.middleware');
const AppError = require('./utils/AppError');

const app = express();
app.enable('trust proxy');

// ============================================================
// 1. GLOBAL MIDDLEWARE — ORDER MATTERS
// ============================================================

// Security Headers
// app.use(helmet());

// Response Compression (gzip/brotli) — reduces payload size by ~70%
app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// CORS Configuration - Allow all in development, strict in production
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
    app.use(cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }));
} else {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map(s => s.trim());

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in the allowed list
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            }

            // Allow any localhost or local network origin
            if (
                origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:') ||
                origin.startsWith('http://192.168.') ||
                origin.startsWith('http://172.') ||
                origin.startsWith('http://10.')
            ) {
                return callback(null, true);
            }

            // Log the blocked origin for debugging
            console.error(`[CORS] Blocked request from origin: ${origin}`);
            return callback(new Error('CORS policy violation'), false);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }));
}

// Logging — Pipe morgan to winston (skip health checks)
/*
app.use(morgan('combined', {
    stream: logger.stream,
    skip: (req) => req.url === '/health' || req.url === '/api/health'
}));
*/

// Body Parsing — with size limits to prevent payload attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input Sanitization — strip HTML/XSS from all inputs
const { autoSanitize } = require('./middlewares/validate.middleware');
app.use(autoSanitize);

// ============================================================
// 2. RATE LIMITERS — Tiered for different endpoint sensitivity
// ============================================================

// Global rate limiter: 500 requests per minute per IP
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests. Please try again later.' },
    skip: (req) => req.url === '/health' || req.url === '/api/health'
});

// Auth rate limiter: 20 login attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // Temporarily increased for dev testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many login attempts. Please try again in 15 minutes.' }
});

// Write operations limiter: 100 per minute per IP
const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Write rate limit exceeded. Please slow down.' }
});

// Report generation limiter: 10 per minute per IP (heavy operation)
const reportLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Report generation rate limit exceeded.' }
});

// Apply global rate limiter to all API routes
app.use('/api', globalLimiter);

// ============================================================
// 3. SYSTEM ROUTES (no auth required)
// ============================================================

const healthCheck = (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
    });
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'HMS Server is operational', version: '2.0.0' });
});

// ============================================================
// 4. API ROUTES — Auth limiter on login, write limiter on mutations
// ============================================================

// Auth — Strict rate limit on login
const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/auth', authLimiter, authRoutes);

// Core Modules
app.use('/api/patients', require('./modules/patients/patient.routes'));
app.use('/api/dicom', require('./modules/dicom/dicom.routes'));
app.use('/api/medical-records', require('./modules/medical-records/record.routes'));
app.use('/api/prescriptions', require('./modules/prescriptions/prescription.routes'));
app.use('/api/tests', require('./modules/tests/test.routes'));
app.use('/api/inventory', require('./modules/inventory/inventory.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));
app.use('/api/appointments', require('./modules/appointments/appointment.routes'));
app.use('/api/ipd', require('./modules/ipd/ipd.routes'));
app.use('/api/opd', require('./modules/opd/opd.routes'));
app.use('/api/billing', require('./modules/billing/billing.routes'));
app.use('/api/lab', require('./modules/lab/lab.routes'));
app.use('/api/timeline', require('./modules/timeline/timeline.routes'));
app.use('/api/pharmacy', require('./modules/pharmacy/pharmacy.routes'));
app.use('/api/pharmacy-billing', require('./modules/pharmacy-billing/billing.routes'));
app.use('/api/daily-op', require('./modules/daily-op/daily-op.routes'));
app.use('/api/doctors', require('./modules/doctor/doctor.routes'));
app.use('/api/search', require('./modules/search/search.routes'));
app.use('/api/payroll', require('./modules/payroll/payroll.routes'));

// PLCM — Patient Life Cycle Management Modules
app.use('/api/nurse', require('./modules/nurse/nurse.routes'));
app.use('/api/ipd-rounds', require('./modules/ipd-rounds/ipd-rounds.routes'));
app.use('/api/pantry', require('./modules/pantry/pantry.routes'));
app.use('/api/discharge', require('./modules/discharge/discharge.routes'));

app.use('/api', require('../routes/userRoutes'));
app.use('/api/logs', require('../routes/logs'));

// Reports — Heavy operation limiter
app.use('/api/reports', reportLimiter, require('./modules/reports/reports.routes'));

// User Management
app.use('/api/user-management', require('./modules/user-management/user-management.routes'));

// ============================================================
// 5. UNHANDLED ROUTE HANDLER
// ============================================================
app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ============================================================
// 6. GLOBAL ERROR HANDLER
// ============================================================
app.use(errorMiddleware);

module.exports = app;
