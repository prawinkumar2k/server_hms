const db = require('./src/config/db');

async function testAuditLog() {
    try {
        console.log('Testing audit_logs table...');

        // Check table structure
        const [columns] = await db.execute('DESCRIBE audit_logs');
        console.log('✓ audit_logs table columns:');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });

        // Try to insert a test audit log
        const testData = ['LOGIN', 'USER', '1', 1, 'OFFLINE', 'ONLINE', 'Test login'];
        const query = `
            INSERT INTO audit_logs 
            (action_type, entity_type, entity_id, performed_by, previous_status, new_status, details)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        console.log('\n✓ Attempting test insert with:', testData);
        await db.execute(query, testData);
        console.log('✓ Test audit log inserted successfully');

        // Clean up test entry
        await db.execute('DELETE FROM audit_logs WHERE details = "Test login"');
        console.log('✓ Test entry cleaned up');

        process.exit(0);
    } catch (error) {
        console.error('✗ Audit log error:', error.message);
        console.error('Error code:', error.code);
        console.error('SQL State:', error.sqlState);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testAuditLog();
