const db = require('../config/db');

const migrate = async () => {
    try {
        console.log('🔄 Starting User Schema Migration...');

        // 1. Convert role to VARCHAR to allow new roles
        console.log('1. Modifying role column to VARCHAR...');
        await db.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");

        // 2. Add role_id column if not exists
        console.log('2. Adding role_id column...');
        try {
            await db.execute("ALTER TABLE users ADD COLUMN role_id INT DEFAULT NULL");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('   - role_id already exists.');
        }

        // 3. Populate role_id from existing roles table
        console.log('3. Populating role_id...');
        await db.execute(`
            UPDATE users u 
            JOIN roles r ON u.role = r.name 
            SET u.role_id = r.id
            WHERE u.role_id IS NULL
        `);

        // 4. Add Foreign Key
        console.log('4. Adding Foreign Key...');
        try {
            await db.execute("ALTER TABLE users ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL");
        } catch (e) {
            if (e.code !== 'ER_DUP_KEYNAME' && e.code !== 'ER_CANT_CREATE_TABLE') {
                // ER_CANT_CREATE_TABLE often means constraint issue or duplicate
                console.warn("   - Warning adding FK:", e.message);
            } else {
                console.log('   - Foreign key may already exist.');
            }
        }

        console.log('✅ Migration Complete.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Migration Failed:', e);
        process.exit(1);
    }
};

migrate();
