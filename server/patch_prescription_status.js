const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'hms'
};

async function addStatusColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected");

        // Check if column exists
        const [columns] = await connection.execute("SHOW COLUMNS FROM prescriptions LIKE 'status'");
        if (columns.length === 0) {
            console.log("Adding 'status' column...");
            await connection.execute("ALTER TABLE prescriptions ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING_PHARMACY'");
            console.log("Column added.");
        } else {
            console.log("Column 'status' already exists.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

addStatusColumn();
