const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/login', authController.login);
router.get('/roles', authController.getLoginRoles); // Public: for login dropdown
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
