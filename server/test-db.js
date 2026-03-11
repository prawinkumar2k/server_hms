const db = require('./src/config/db');

async function testConnection() {
    try {
        console.log('Testing database connection...');

        // Test basic connection
        const [rows] = await db.execute('SELECT 1 as test');
        console.log('✓ Database connection successful');

        // Check if users table exists
        const [tables] = await db.execute('SHOW TABLES');
        console.log('✓ Available tables:', tables.map(t => Object.values(t)[0]));

        // Check users table
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        console.log(`✓ Users table has ${users[0].count} records`);

        // Check a sample user structure
        const [sampleUser] = await db.execute('SELECT * FROM users LIMIT 1');
        if (sampleUser.length > 0) {
            console.log('✓ Sample user columns:', Object.keys(sampleUser[0]));
        }

        process.exit(0);
    } catch (error) {
        console.error('✗ Database error:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection();
