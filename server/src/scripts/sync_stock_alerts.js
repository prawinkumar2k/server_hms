const db = require('../config/db');

async function syncStockAlerts() {
    try {
        console.log('🔄 Syncing Stock Alerts...');

        // 1. Get all products
        const [products] = await db.execute('SELECT * FROM product');
        console.log(`Checking ${products.length} products...`);

        let createdCount = 0;

        for (const p of products) {
            const stock = parseInt(p.Stock || 0);
            const threshold = parseInt(p.ReOrder || 0);
            let type = null;

            if (stock === 0) {
                type = 'OUT_OF_STOCK';
            } else if (stock <= threshold) {
                type = 'LOW_STOCK';
            }

            if (type) {
                // Check if active alert exists
                const [existing] = await db.execute(
                    'SELECT id FROM stock_alerts WHERE product_pcode = ? AND alert_type = ? AND status = "ACTIVE"',
                    [p.Pcode, type]
                );

                if (existing.length === 0) {
                    console.log(`⚠️ Creating ${type} alert for ${p.ProductName} (Stock: ${stock}, Min: ${threshold})`);
                    await db.execute(
                        'INSERT INTO stock_alerts (product_pcode, alert_type, current_stock, threshold) VALUES (?, ?, ?, ?)',
                        [p.Pcode, type, stock, threshold]
                    );
                    createdCount++;
                }
            }
        }

        console.log(`✅ Sync Complete. Created ${createdCount} new alerts.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

syncStockAlerts();
