const express = require('express');
const router = express.Router();
const ctrl = require('./pantry.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// Dashboard - shows all dietary orders for today (Admin = view-only)
router.get('/dashboard', protect, authorizeRoles('Pantry', 'Nurse', 'Admin'), ctrl.getDashboard);

// Update individual meal status (Pantry & Nurse only — Admin has NO edit access)
router.put('/meals/:id/status', protect, authorizeRoles('Pantry', 'Nurse'), ctrl.updateMealStatus);

// Bulk mark delivered (Pantry & Nurse only)
router.post('/meals/bulk-deliver', protect, authorizeRoles('Pantry', 'Nurse'), ctrl.bulkMarkDelivered);

// Ward-wise view (Admin = view-only)
router.get('/ward/:ward', protect, authorizeRoles('Pantry', 'Nurse', 'Admin'), ctrl.getByWard);

// Patient diet history (Admin = view-only)
router.get('/patient/:admissionId', protect, authorizeRoles('Pantry', 'Nurse', 'Doctor', 'Admin'), ctrl.getPatientDietHistory);

// Discharge clearance (Pantry only — critical operation)
router.post('/clear/:admissionId', protect, authorizeRoles('Pantry'), ctrl.clearDepartment);

// ─── FOOD MENU ROUTES ──────────────────────────────────
router.get('/menu', protect, authorizeRoles('Pantry', 'Nurse', 'Doctor', 'Admin'), ctrl.getFoodMenu);
router.post('/menu', protect, authorizeRoles('Pantry', 'Nurse'), ctrl.addFoodMenu);
router.put('/menu/:id', protect, authorizeRoles('Pantry', 'Nurse'), ctrl.updateFoodMenu);
router.delete('/menu/:id', protect, authorizeRoles('Pantry', 'Nurse'), ctrl.deleteFoodMenu);

// ─── SERVING HISTORY ROUTE ─────────────────────────────
router.get('/history', protect, authorizeRoles('Pantry', 'Nurse', 'Admin'), ctrl.getServingHistory);

module.exports = router;

