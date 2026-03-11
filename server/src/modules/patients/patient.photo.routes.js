const express = require('express');
const router = express.Router({ mergeParams: true });
const patientPhotoController = require('./patient.photo.controller');
const { verifyToken, authorizeRoles, authorizeModule } = require('../../middlewares/auth.middleware');

// /api/patients/:id/photo
// POST - verifyToken + authorizeRoles
router.post(
    '/',
    verifyToken,
    authorizeRoles('Admin', 'Receptionist'),
    patientPhotoController.uploadPhotoMiddleware,
    patientPhotoController.uploadPatientPhoto
);

// GET - verifyToken + authorizeModule("reception") OR role-based access
// Here we'll require a token, and use a custom inline middleware that checks either Admin/Receptionist role 
// OR the reception module access, as per requirements.
const checkGetAccess = (req, res, next) => {
    const isAdminReceptionist = ['Admin', 'Receptionist'].includes(req.user.role);
    const hasReceptionModule = Array.isArray(req.user.module_access) && req.user.module_access.includes('reception');

    if (isAdminReceptionist || hasReceptionModule) {
        return next();
    }

    return res.status(403).json({ message: 'Access Denied: Requires Reception module access or Admin/Receptionist role' });
};

router.get(
    '/',
    verifyToken,
    checkGetAccess,
    patientPhotoController.getPatientPhoto
);

module.exports = router;
