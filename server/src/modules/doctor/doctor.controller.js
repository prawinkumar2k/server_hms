const db = require('../../config/db');

// Get all doctors with their current status
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.execute(`
            SELECT 
                u.id, 
                u.full_name, 
                u.status as user_status,
                dp.department,
                dp.specialization,
                dp.availability_status
            FROM users u
            LEFT JOIN doctor_profiles dp ON u.id = dp.user_id
            WHERE u.role = 'Doctor'
            ORDER BY u.full_name ASC
        `);
        res.json(doctors);
    } catch (error) {
        console.error('GetAllDoctors Error:', error);
        res.status(500).json({ message: 'Server error fetching doctors' });
    }
};

// Get single doctor profile
exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const [doctor] = await db.execute(`
            SELECT 
                u.id, 
                u.full_name, 
                dp.department,
                dp.specialization,
                dp.experience_years,
                dp.age,
                dp.qualification,
                dp.bio,
                dp.availability_status
            FROM users u
            LEFT JOIN doctor_profiles dp ON u.id = dp.user_id
            WHERE u.id = ? AND u.role = 'Doctor'
        `, [id]);

        console.log(`[DoctorController] getDoctorById for ID: ${id}`);
        console.log(`[DoctorController] Found: ${doctor.length} records`);

        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor[0]);
    } catch (error) {
        console.error('GetDoctorById Error:', error);
        res.status(500).json({ message: 'Server error fetching doctor profile' });
    }
};

// Update doctor status (Admin/Self only - though User Request says reception read-only, 
// keeping this for scalability if admin wants to change it)
exports.updateDoctorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Active, Inactive, On Leave

        // Verify doctor exists
        const [exists] = await db.execute('SELECT id FROM doctor_profiles WHERE user_id = ?', [id]);
        if (exists.length === 0) {
            // Create profile if missing? Or error?
            // For now error
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        await db.execute('UPDATE doctor_profiles SET availability_status = ? WHERE user_id = ?', [status, id]);
        res.json({ message: 'Doctor status updated successfully' });

    } catch (error) {
        console.error('UpdateDoctorStatus Error:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};
