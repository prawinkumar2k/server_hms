const db = require('../config/db');

async function setupStockAlerts() {
    try {
        console.log('🚀 Setting up Stock Alert System...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS stock_alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_pcode VARCHAR(50) NOT NULL,
                alert_type ENUM('LOW_STOCK', 'OUT_OF_STOCK') NOT NULL,
                current_stock INT NOT NULL,
                threshold INT NOT NULL,
                triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                acknowledged_by INT DEFAULT NULL,
                acknowledged_at TIMESTAMP NULL DEFAULT NULL,
                status ENUM('ACTIVE', 'ACKNOWLEDGED') DEFAULT 'ACTIVE',
                FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `;

        await db.execute(createTableQuery);
        console.log('✅ stock_alerts table created.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to setup stock alerts:', error);
        process.exit(1);
    }
}

setupStockAlerts();
