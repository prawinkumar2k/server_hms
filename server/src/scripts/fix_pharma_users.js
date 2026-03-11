const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function fixUsers() {
    try {
        const pharmaMasterPass = await bcrypt.hash('pharmamaster123', 10);
        const pharmaPass = await bcrypt.hash('pharma123', 10);

        console.log('Resetting password for pharma1234...');
        await db.execute('UPDATE users SET password = ? WHERE username = ?', [pharmaMasterPass, 'pharma1234']);
        console.log('pharma1234 password reset.');

        console.log('Creating/Resetting Pharmacist user (Pharma)...');
        // Check if Pharma exists
        const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', ['Pharma']);
        if (rows.length > 0) {
            await db.execute('UPDATE users SET password = ?, role = ?, status = ? WHERE username = ?', [pharmaPass, 'Pharmacist', 'Active', 'Pharma']);
            console.log('User Pharma updated.');
        } else {
            await db.execute('INSERT INTO users (username, password, role, full_name, status) VALUES (?, ?, ?, ?, ?)', ['Pharma', pharmaPass, 'Pharmacist', 'Pharmacist User', 'Active']);
            console.log('User Pharma created.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

fixUsers();
