const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');
const { cacheResponse, invalidateCache } = require('../../middlewares/cache.middleware');

// Base route: /api/admin
// Guard all routes with Admin check
router.use(verifyToken, authorizeRoles('Admin'));

// Search
router.get('/search', adminController.searchAll);

// Dashboard Stats
router.get('/dashboard-stats', cacheResponse(30), adminController.getDashboardStats);

// Analytics Charts
router.get('/dashboard-analytics', cacheResponse(60), adminController.getDashboardAnalytics);

// Role Routes
router.get('/roles', cacheResponse(120), adminController.getAllRoles);
router.post('/roles', invalidateCache('/api/admin/roles'), adminController.createRole);
router.put('/roles/:id', invalidateCache('/api/admin/roles'), adminController.updateRole);
router.delete('/roles/:id', invalidateCache('/api/admin/roles'), adminController.deleteRole);

// Permissions Routes
router.get('/permissions', cacheResponse(120), adminController.getAllPermissions);
router.get('/roles/:id/permissions', adminController.getRolePermissions);
router.put('/roles/:id/permissions', invalidateCache('/api/admin/permissions'), adminController.updateRolePermissions);

// Helper Routes
router.get('/modules', cacheResponse(120), adminController.getModules);
router.get('/staff', cacheResponse(60), adminController.getStaff);

router.get('/users', adminController.getAllUsers);
router.post('/users', invalidateCache('/api/admin/users'), adminController.createUser);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', invalidateCache('/api/admin/users'), adminController.updateUser);
router.delete('/users/:id', invalidateCache('/api/admin/users'), adminController.deleteUser);

// Monitoring Routes
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;

