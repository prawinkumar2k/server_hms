const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute("SHOW TABLES LIKE 'users'");
        if (rows.length === 0) {
            console.log("Table 'users' does not exist.");
        } else {
            const [columns] = await connection.execute("DESCRIBE users");
            console.log("Users Table Schema:");
            console.table(columns);
        }

        // Check if roles table exists too, just in case
        const [roles] = await connection.execute("SHOW TABLES LIKE 'roles'");
        if (roles.length === 0) {
            console.log("Table 'roles' does not exist.");
        } else {
            const [rCols] = await connection.execute("DESCRIBE roles");
            console.log("Roles Table Schema:");
            console.table(rCols);
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSchema();
