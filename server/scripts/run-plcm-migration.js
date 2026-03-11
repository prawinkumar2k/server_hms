const db = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const sqlFile = path.join(__dirname, '..', 'src', 'migrations', 'plcm_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Remove single-line comments (lines starting with --)
    const cleaned = sql.replace(/^--.*$/gm, '');

    // Split by semicolon followed by newline
    const statements = cleaned
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

    console.log(`Found ${statements.length} SQL statements to execute.\n`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const preview = stmt.replace(/\s+/g, ' ').substring(0, 80);
        try {
            await db.execute(stmt);
            console.log(`[${i + 1}/${statements.length}] OK: ${preview}...`);
        } catch (err) {
            console.log(`[${i + 1}/${statements.length}] SKIP: ${err.message.substring(0, 100)}`);
        }
    }

    console.log('\nMigration completed.');
    process.exit(0);
}

runMigration().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
