const db = require('./src/config/db');

async function createTables() {
    try {
        console.log('Creating tables if not exists...');

        // 1. users_roles
        await db.query(`
            CREATE TABLE IF NOT EXISTS users_roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                role VARCHAR(255) NOT NULL UNIQUE
            )
        `);
        console.log('users_roles table verified.');

        // 2. sidebar_modules
        await db.query(`
            CREATE TABLE IF NOT EXISTS sidebar_modules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                module_name VARCHAR(255) NOT NULL,
                module_key VARCHAR(255) NOT NULL UNIQUE,
                module_category VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE
            )
        `);
        console.log('sidebar_modules table verified.');

        // 3. users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                staff_id INT,
                staff_name VARCHAR(255),
                module_access TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('users table verified.');

        // 4. log_details
        await db.query(`
            CREATE TABLE IF NOT EXISTS log_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255),
                role VARCHAR(255),
                action TEXT,
                login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('log_details table verified.');

        console.log('All tables created/verified successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createTables();
