const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Roles
router.get('/roles', userController.getRoles);
router.post('/roles', userController.createRole); // New

// Users
router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById); // New
router.put('/users/:id', userController.updateUser); // New
router.delete('/users/:id', userController.deleteUser); // New

// Helpers
router.get('/staff', userController.getStaff);
router.get('/modules', userController.getModules);

module.exports = router;
