const db = require('../config/db');

const setupDoctorSchema = async () => {
    try {
        console.log('🩺 Setting up Doctor Profiles Schema...');

        // 1. Create Doctor Profiles Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS doctor_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                department VARCHAR(100),
                specialization VARCHAR(100),
                experience_years INT DEFAULT 0,
                age INT,
                qualification VARCHAR(100),
                bio TEXT,
                availability_status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive, On Leave
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created doctor_profiles table.');

        // 2. Identify Doctors in Users table
        const [doctors] = await db.execute("SELECT id FROM users WHERE role = 'Doctor'");

        // 3. Seed Profiles for existing doctors if missing
        for (const doc of doctors) {
            const [profile] = await db.execute('SELECT id FROM doctor_profiles WHERE user_id = ?', [doc.id]);
            if (profile.length === 0) {
                const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];
                const randomDept = depts[Math.floor(Math.random() * depts.length)];

                await db.execute(`
                    INSERT INTO doctor_profiles (user_id, department, specialization, experience_years, age, qualification, availability_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    doc.id,
                    randomDept,
                    'General Surgeon',
                    Math.floor(Math.random() * 20) + 1,
                    Math.floor(Math.random() * 30) + 30,
                    'MBBS, MD',
                    'Active'
                ]);
                console.log(`🌱 Seeded profile for Doctor ID: ${doc.id}`);
            }
        }

        console.log('✨ Doctor Schema Setup Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Doctor Schema Setup Failed:', err);
        process.exit(1);
    }
};

setupDoctorSchema();
