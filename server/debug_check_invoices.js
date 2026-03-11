require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hms'
};

(async () => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        const [tables] = await conn.execute("SHOW TABLES LIKE 'invoices'");
        if (tables.length > 0) {
            console.log('Table invoices EXISTS');
            const [cols] = await conn.execute("DESCRIBE invoices");
            console.log('Columns:', cols.map(c => c.Field).join(', '));
        } else {
            console.log('Table invoices DOES NOT EXIST');
        }

        const [itemsTables] = await conn.execute("SHOW TABLES LIKE 'invoice_items'");
        if (itemsTables.length > 0) {
            console.log('Table invoice_items EXISTS');
        } else {
            console.log('Table invoice_items DOES NOT EXIST');
        }

        await conn.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
