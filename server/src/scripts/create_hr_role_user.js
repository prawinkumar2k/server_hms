const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function createHR() {
    try {
        console.log('Creating HR Role and User...');

        // 1. Ensure HR Role exists
        let roleId;
        const [roles] = await db.execute("SELECT id FROM roles WHERE name = 'HR'");

        if (roles.length > 0) {
            roleId = roles[0].id;
            console.log('HR Role already exists.');
        } else {
            const [result] = await db.execute("INSERT INTO roles (name, description) VALUES ('HR', 'Human Resources & Payroll')");
            roleId = result.insertId;
            console.log('HR Role created.');
        }

        // 2. Create HR User
        const username = 'hr';
        const password = await bcrypt.hash('password123', 10);
        const fullName = 'HR Admin';

        // Check if user exists
        const [users] = await db.execute("SELECT id FROM users WHERE username = ?", [username]);

        if (users.length > 0) {
            console.log('HR User already exists.');
            await db.execute("UPDATE users SET role='HR', password=? WHERE username=?", [password, username]);
            console.log('HR User updated.');
        } else {
            // Note: role_id might be required if strict FK, but purely string 'role' column seems primary based on auth middleware usage.
            // Check if role_id is needed? The schema showed 'role_id'.
            // Let's try to update role_id too if possible.
            await db.execute(
                "INSERT INTO users (username, password, full_name, role, role_id) VALUES (?, ?, ?, 'HR', ?)",
                [username, password, fullName, roleId]
            );
            console.log('HR User created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Failed:', error);
        process.exit(1);
    }
}

createHR();
