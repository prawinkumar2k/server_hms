const express = require('express');
const router = express.Router();
const controller = require('./employee.controller');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');
const { cacheResponse } = require('../../middlewares/cache.middleware');

// Routes
const attendanceController = require('./attendance.controller');

// Employees
router.get('/employees', verifyToken, cacheResponse(60), controller.getEmployees);
router.get('/employees/:id', verifyToken, controller.getEmployee);
router.post('/employees', verifyToken, authorizeRoles('Admin', 'HR'), controller.createEmployee);
router.put('/employees/:id', verifyToken, authorizeRoles('Admin', 'HR'), controller.updateEmployee);

// Attendance
router.get('/shifts', verifyToken, cacheResponse(120), attendanceController.getShifts);
router.get('/attendance/daily', verifyToken, attendanceController.getDailyAttendance);
router.post('/attendance/mark', verifyToken, authorizeRoles('Admin', 'HR'), attendanceController.markAttendance);

// Salary
const salaryController = require('./salary.controller');
router.get('/salaries', verifyToken, authorizeRoles('Admin', 'HR'), salaryController.getSalaries);
router.get('/salaries/:id', verifyToken, authorizeRoles('Admin', 'HR'), salaryController.getEmployeeSalary);
router.put('/salaries/:id', verifyToken, authorizeRoles('Admin', 'HR'), salaryController.updateSalary);

const payslipController = require('./payslip.controller');
router.get('/payslips', verifyToken, authorizeRoles('Admin', 'HR'), payslipController.getPayslips);
router.post('/generate', verifyToken, authorizeRoles('Admin', 'HR'), payslipController.generatePayroll);

module.exports = router;
