const db = require('./src/config/db');

(async () => {
    try {
        console.log('Checking for invoices table...');
        const [tables] = await db.execute("SHOW TABLES LIKE 'invoices'");
        if (tables.length > 0) {
            console.log('Table invoices EXISTS');
            const [cols] = await db.execute("DESCRIBE invoices");
            console.log('Columns:', cols.map(c => c.Field).join(', '));
        } else {
            console.log('Table invoices DOES NOT EXIST');
        }

        const [itemsTables] = await db.execute("SHOW TABLES LIKE 'invoice_items'");
        if (itemsTables.length > 0) {
            console.log('Table invoice_items EXISTS');
        } else {
            console.log('Table invoice_items DOES NOT EXIST');
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
