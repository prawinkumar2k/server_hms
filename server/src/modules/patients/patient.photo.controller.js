const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const db = require('../../config/db');
const AppError = require('../../utils/AppError');

// Storage directory
const uploadDir = path.join(__dirname, '../../../uploads/patients');
fs.ensureDirSync(uploadDir);

// Multer memory storage (we'll process with Sharp before saving)
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only jpeg or png images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});

exports.uploadPhotoMiddleware = upload.single('photo');

exports.uploadPatientPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Please upload a photo', 400));
        }

        const patientId = req.params.id;
        const filename = `patient_${patientId}_${Date.now()}.jpg`;
        const filepath = path.join(uploadDir, filename);

        // Fetch patient to see if existing photo exists and DB validation
        const [rows] = await db.execute('SELECT cusId, SNo, photo FROM copy_of_patientdetaiils WHERE cusId = ? OR SNo = ?', [patientId, patientId]);
        if (rows.length === 0) {
            return next(new AppError('Patient not found', 404));
        }
        const patient = rows[0];

        // Process Image with Sharp
        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .withMetadata(false) // Strip metadata
            .toFile(filepath);

        // Delete old photo if it exists
        if (patient.photo) {
            const oldPath = path.join(uploadDir, patient.photo);
            if (await fs.pathExists(oldPath)) {
                await fs.remove(oldPath);
            }
        }

        // Update DB
        await db.execute('UPDATE copy_of_patientdetaiils SET photo = ? WHERE cusId = ? OR SNo = ?', [filename, patientId, patientId]);

        // Also update standard patients table if it exists as fallback. Ignoring errors if table does not exist.
        try {
            await db.execute('UPDATE patients SET photo = ? WHERE id = ?', [filename, patientId]);
        } catch (e) { /* ignore */ }

        res.status(200).json({
            status: 'success',
            message: 'Photo uploaded successfully',
            photo: filename
        });
    } catch (error) {
        next(error);
    }
};

exports.getPatientPhoto = async (req, res, next) => {
    try {
        const patientId = req.params.id;
        const [rows] = await db.execute('SELECT photo FROM copy_of_patientdetaiils WHERE cusId = ? OR SNo = ?', [patientId, patientId]);

        if (rows.length === 0) {
            return next(new AppError('Patient not found', 404));
        }

        const photoFilename = rows[0].photo;
        if (!photoFilename) {
            if (req.method === 'HEAD') {
                return res.status(200).set('X-Photo-Exists', 'false').end();
            }
            return next(new AppError('No photo found for this patient', 404));
        }

        const filepath = path.resolve(uploadDir, photoFilename);

        // Prevent path traversal
        if (!filepath.startsWith(uploadDir)) {
            return next(new AppError('Invalid file path', 403));
        }

        if (!(await fs.pathExists(filepath))) {
            if (req.method === 'HEAD') {
                return res.status(200).set('X-Photo-Exists', 'false').end();
            }
            return next(new AppError('Photo file missing on server', 404));
        }

        if (req.method === 'HEAD') {
            return res.status(200).set('X-Photo-Exists', 'true').end();
        }

        res.sendFile(filepath);
    } catch (error) {
        next(error);
    }
};
