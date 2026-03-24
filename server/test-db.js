const db = require('./src/config/db');

async function test() {
    console.log('--- Database Query Diagnostic ---');
    try {
        console.log('Executing: SELECT id, name FROM roles ORDER BY name ASC');
        const [roles] = await db.execute('SELECT id, name FROM roles ORDER BY name ASC');
        console.log('Success! Count:', roles.length);
        
        console.log('Executing: SELECT * FROM users LIMIT 1');
        const [users] = await db.execute('SELECT * FROM users LIMIT 1');
        console.log('Success! User found:', users[0]?.username);

        process.exit(0);
    } catch (err) {
        console.error('❌ QUERY ERROR:');
        console.error(`   Message: ${err.message}`);
        console.error(`   Code: ${err.code}`);
        console.error(`   Stack: ${err.stack}`);
        process.exit(1);
    }
}

test();
