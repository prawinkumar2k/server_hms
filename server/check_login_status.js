const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const db = require('./src/config/db');

async function runChecks() {
    try {
        console.log('Testing Database Connection...');

        // 1. Check Users Table Schema
        console.log('\n--- Users Table Schema ---');
        try {
            const [columns] = await db.execute('DESCRIBE users');
            console.log(columns.map(c => `${c.Field} (${c.Type})`).join(', '));
        } catch (e) {
            console.log('❌ Error describing users table:', e.message);
        }

        // 2. Check User Count
        console.log('\n--- User Count ---');
        const [count] = await db.execute('SELECT COUNT(*) as count FROM users');
        console.log(`Total Users: ${count[0].count}`);

        // 3. List Users (Safe)
        console.log('\n--- Listing Users ---');
        const [users] = await db.execute('SELECT id, username, role, status FROM users');
        console.table(users);

        // 4. Test Login for 'admin'
        console.log('\n--- Testing "admin" Login ---');
        const [adminRows] = await db.execute('SELECT * FROM users WHERE username = ?', ['admin']);
        if (adminRows.length > 0) {
            const admin = adminRows[0];
            const testPass = 'admin123';
            const isMatch = await bcrypt.compare(testPass, admin.password);
            console.log(`User: ${admin.username}`);
            console.log(`Input Password: ${testPass}`);
            console.log(`Stored Hash: ${admin.password.substring(0, 20)}...`);
            console.log(`Match Result: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
        } else {
            console.log('❌ Admin user not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Critical Error:', error);
        process.exit(1);
    }
}

runChecks();
