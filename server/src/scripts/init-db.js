const db = require('../config/db');

const initDB = async () => {
    try {
        console.log('Starting Database Sync...');

        // Test Master
        await db.query(`
            CREATE TABLE IF NOT EXISTS testmaster (
                ID VARCHAR(255) PRIMARY KEY,
                DCode VARCHAR(50),
                Department VARCHAR(100),
                TCode VARCHAR(50),
                TestType VARCHAR(255),
                SubTestName VARCHAR(255),
                SubType VARCHAR(255),
                NORMALVALUES VARCHAR(255),
                Amount DECIMAL(10, 2),
                Units VARCHAR(50),
                SubTCode VARCHAR(50)
            )
        `);
        console.log('Checked testmaster');

        // Product Inventory
        await db.query(`
            CREATE TABLE IF NOT EXISTS product (
                Pcode VARCHAR(50) PRIMARY KEY,
                ProductName VARCHAR(255),
                Description TEXT,
                Amount DECIMAL(10, 2),
                Stock INT DEFAULT 0,
                ReOrder INT DEFAULT 0,
                Scale VARCHAR(50)
            )
        `);
        console.log('Checked product');

        // Lab Patients
        await db.query(`
            CREATE TABLE IF NOT EXISTS patientdetaiils (
                cusId VARCHAR(50) PRIMARY KEY,
                cusName VARCHAR(255),
                PAge VARCHAR(10),
                PSex VARCHAR(20),
                DocName VARCHAR(255),
                RefDoc VARCHAR(255),
                Address TEXT,
                MobileNo VARCHAR(20)
            )
        `);
        console.log('Checked patientdetaiils');

        // Indents
        await db.query(`
            CREATE TABLE IF NOT EXISTS productindent (
                indentID VARCHAR(50) PRIMARY KEY,
                indentDate DATETIME,
                pCode VARCHAR(50),
                pname VARCHAR(255),
                requireQty INT,
                indentRisedby VARCHAR(100)
            )
        `);
        console.log('Checked productindent');

        // Issues
        await db.query(`
            CREATE TABLE IF NOT EXISTS productissue (
                ID VARCHAR(50) PRIMARY KEY,
                IssueDate DATETIME,
                pcode VARCHAR(50),
                pname VARCHAR(255),
                IssuedTo VARCHAR(255),
                Qty INT
            )
        `);
        console.log('Checked productissue');

        // Prescriptions (New Table)
        await db.query(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cusId VARCHAR(50),
                cusName VARCHAR(255),
                pAge VARCHAR(10),
                psex VARCHAR(20),
                pDate DATETIME,
                Disease TEXT,
                docNote TEXT,
                temp VARCHAR(20),
                BP VARCHAR(20),
                Tab1 VARCHAR(100), qty1 VARCHAR(20), food1 VARCHAR(20), morn1 VARCHAR(10), noon1 VARCHAR(10), night1 VARCHAR(10), Noday1 VARCHAR(10),
                Tab2 VARCHAR(100), qty2 VARCHAR(20), food2 VARCHAR(20), morn2 VARCHAR(10), noon2 VARCHAR(10), night2 VARCHAR(10), Noday2 VARCHAR(10),
                Tab3 VARCHAR(100), qty3 VARCHAR(20), food3 VARCHAR(20), morn3 VARCHAR(10), noon3 VARCHAR(10), night3 VARCHAR(10), Noday3 VARCHAR(10),
                Tab4 VARCHAR(100), qty4 VARCHAR(20), food4 VARCHAR(20), morn4 VARCHAR(10), noon4 VARCHAR(10), night4 VARCHAR(10), Noday4 VARCHAR(10)
            )
        `);
        console.log('Checked prescriptions');

        console.log('Database Synced Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Sync Failed:', err);
        process.exit(1);
    }
};

initDB();
