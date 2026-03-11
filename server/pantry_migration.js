require('dotenv').config();
const db = require('./src/config/db');

async function migrate_pantry() {
    try {
        console.log("Creating food_menu table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS food_menu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meal_time ENUM('Breakfast', 'Lunch', 'Snack', 'Dinner', 'All') NOT NULL,
                diet_category VARCHAR(100) NOT NULL COMMENT 'e.g., General, Diabetic, Liquid, Renal',
                item_name VARCHAR(255) NOT NULL,
                description TEXT,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("food_menu table created successfully.");

        // Add some default items
        const [existing] = await db.execute("SELECT COUNT(*) as count FROM food_menu");
        if (existing[0].count === 0) {
            console.log("Seeding default food menu items...");
            await db.execute(`
                INSERT INTO food_menu (meal_time, diet_category, item_name, description) VALUES 
                ('Breakfast', 'General', 'Idli & Sambar', 'Soft idlis with mild sambar'),
                ('Breakfast', 'Diabetic', 'Oats Porridge', 'Sugar-free oats porridge with skimmed milk'),
                ('Lunch', 'General', 'South Indian Meals', 'Rice, Dal, 1 Veg Curry, Curd'),
                ('Lunch', 'Liquid', 'Clear Vegetable Soup', 'Strained vegetable broth'),
                ('Dinner', 'General', 'Chapati & Dal', '2 Chapatis with Dal Makhani')
            `);
            console.log("Seeding completed.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate_pantry();
