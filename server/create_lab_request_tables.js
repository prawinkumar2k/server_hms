const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'hms'
};

async function createTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to DB");

        const createRequests = `
            CREATE TABLE IF NOT EXISTS lab_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id VARCHAR(50),
                patient_name VARCHAR(100),
                doctor_id VARCHAR(50),
                doctor_name VARCHAR(100),
                request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                priority VARCHAR(20) DEFAULT 'Routine',
                status VARCHAR(20) DEFAULT 'PENDING',
                notes TEXT
            )
        `;

        const createItems = `
            CREATE TABLE IF NOT EXISTS lab_request_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT,
                test_name VARCHAR(100),
                category VARCHAR(50),
                price DECIMAL(10,2),
                status VARCHAR(20) DEFAULT 'PENDING',
                FOREIGN KEY (request_id) REFERENCES lab_requests(id) ON DELETE CASCADE
            )
        `;

        await connection.execute(createRequests);
        console.log("lab_requests table checked/created");

        await connection.execute(createItems);
        console.log("lab_request_items table checked/created");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (connection) await connection.end();
    }
}

createTables();
