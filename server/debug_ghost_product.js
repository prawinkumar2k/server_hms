const db = require('./src/config/db');

(async () => {
    try {
        const [result] = await db.execute("DELETE FROM product WHERE TRIM(COALESCE(Pcode,'')) = '' OR TRIM(COALESCE(ProductName,'')) = ''");
        console.log('Deleted rows:', result.affectedRows);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
    process.exit();
})();
