const db = require('../config/db');

async function migrateAttendance() {
    try {
        console.log('🔄 Starting Attendance & Shift Migration...');

        // 1. Create Shifts Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS shifts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL, -- e.g., 'Morning', 'Night', 'General'
                code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'S1', 'S2', 'GEN'
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                break_duration_mins INT DEFAULT 30,
                is_night_shift BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Shifts table created.');

        // Seed Default Shifts
        const defaultShifts = [
            { name: 'General', code: 'GEN', start: '09:00:00', end: '18:00:00' },
            { name: 'Morning', code: 'MORN', start: '06:00:00', end: '14:00:00' },
            { name: 'Evening', code: 'EVE', start: '14:00:00', end: '22:00:00' },
            { name: 'Night', code: 'NGT', start: '22:00:00', end: '06:00:00', is_night: true }
        ];

        for (const s of defaultShifts) {
            const [exists] = await db.execute("SELECT id FROM shifts WHERE code = ?", [s.code]);
            if (exists.length === 0) {
                await db.execute(
                    "INSERT INTO shifts (name, code, start_time, end_time, is_night_shift) VALUES (?, ?, ?, ?, ?)",
                    [s.name, s.code, s.start, s.end, s.is_night || false]
                );
            }
        }
        console.log('   + Seeded default shifts.');

        // 2. Create Attendance Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS attendance_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                date DATE NOT NULL,
                shift_id INT,
                
                in_time TIME,
                out_time TIME,
                
                status ENUM('Present', 'Absent', 'Half Day', 'Leave', 'Holiday', 'Weekly Off') NOT NULL DEFAULT 'Absent',
                
                late_mins INT DEFAULT 0,
                early_exit_mins INT DEFAULT 0,
                overtime_hours DECIMAL(5,2) DEFAULT 0.00,
                
                is_manual_entry BOOLEAN DEFAULT FALSE,
                remarks VARCHAR(255),
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                UNIQUE KEY unique_emp_date (employee_id, date),
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                FOREIGN KEY (shift_id) REFERENCES shifts(id)
            )
        `);
        console.log('✅ Attendance Logs table created.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
}

migrateAttendance();
