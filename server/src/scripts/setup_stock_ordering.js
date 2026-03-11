const db = require('../config/db');

async function setupStockOrdering() {
    try {
        console.log('🚀 Setting up Stock Ordering Module...');

        // 1. Suppliers Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                supplier_name VARCHAR(255) NOT NULL,
                contact_person VARCHAR(255),
                phone VARCHAR(50),
                email VARCHAR(100),
                address TEXT,
                status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ suppliers table created.');

        // 2. Stock Orders Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS stock_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(50) NOT NULL UNIQUE,
                created_by INT,
                supplier_id INT,
                order_status ENUM('DRAFT','PENDING','ORDERED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED') DEFAULT 'DRAFT',
                total_amount DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ stock_orders table created.');

        // 3. Stock Order Items Table
        // Note: Linking to product table via Pcode (which seems to be primary ID in usage)
        await db.execute(`
            CREATE TABLE IF NOT EXISTS stock_order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stock_order_id INT NOT NULL,
                medicine_pcode VARCHAR(50), 
                ordered_quantity INT NOT NULL,
                received_quantity INT DEFAULT 0,
                unit_price DECIMAL(10, 2) DEFAULT 0.00,
                subtotal DECIMAL(10, 2) DEFAULT 0.00,
                FOREIGN KEY (stock_order_id) REFERENCES stock_orders(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ stock_order_items table created.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to setup stock ordering:', error);
        process.exit(1);
    }
}

setupStockOrdering();
