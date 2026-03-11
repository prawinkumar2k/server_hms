const express = require('express');
const router = express.Router();
const userController = require('./user-management.controller');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

// Apply Auth to all routes
router.use(verifyToken);
// Only Admin can manage users
router.use(authorizeRoles('Admin'));

// Roles
router.get('/roles', userController.getRoles);
router.post('/roles', userController.createRole);

// Modules
router.get('/modules', userController.getModules);

// Staff
router.get('/staff', userController.getStaff);

// Users
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
