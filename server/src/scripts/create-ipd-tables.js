const db = require('../config/db');

async function createIPDTables() {
    try {
        console.log('Creating IPD tables...');

        // Beds Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS beds (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ward VARCHAR(50),
                number VARCHAR(20),
                type VARCHAR(50) DEFAULT 'General',
                status VARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance
                price DECIMAL(10,2) DEFAULT 0.00
            )
        `);

        // Check if beds exist, if not, populate
        const [beds] = await db.execute('SELECT COUNT(*) as count FROM beds');
        if (beds[0].count === 0) {
            console.log('Populating beds...');
            const values = [];
            // Ward A (General)
            for (let i = 1; i <= 10; i++) {
                values.push(`('Ward A', 'A-${i}', 'General', 'Available', 500)`);
            }
            // Ward B (ICU)
            for (let i = 1; i <= 5; i++) {
                values.push(`('Ward B', 'B-${i}', 'ICU', 'Available', 2000)`);
            }
            // Ward C (Private)
            for (let i = 1; i <= 5; i++) {
                values.push(`('Ward C', 'C-${i}', 'Private', 'Available', 1500)`);
            }

            await db.execute(`INSERT INTO beds (ward, number, type, status, price) VALUES ${values.join(',')}`);
        }

        // IPD Admissions Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS ipd_admissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(100),
                admission_date DATETIME,
                doctor_name VARCHAR(100),
                bed_id INT,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'Admitted', -- Admitted, Discharged
                discharge_date DATETIME,
                FOREIGN KEY (bed_id) REFERENCES beds(id)
            )
        `);

        console.log('IPD Tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createIPDTables();
