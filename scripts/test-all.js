const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 HMS INDUSTRIAL TESTING HUB - UNIFIED VERIFICATION');
console.log('---------------------------------------------------\n');

const tasks = [
    { 
        name: 'Database Connectivity', 
        cmd: 'node scripts/db-verify.js' 
    },
    { 
        name: 'Backend API & Business Logic', 
        cmd: 'npx jest --config server/jest.config.js --passWithNoTests' 
    },
    { 
        name: 'Frontend Component Quality', 
        cmd: 'cd client && npm test -- --watchAll=false' 
    },
    { 
        name: 'End-to-End System Flows', 
        cmd: 'npx playwright test --workers=1' 
    }
];

let failed = 0;
tasks.forEach(task => {
    process.stdout.write(`🧪 ${task.name}... `);
    try {
        // Run command. We use workers=1 for playwright to avoid race conditions on local SQL
        execSync(task.cmd, { stdio: 'pipe', timeout: 60000 });
        console.log('✅ PASS');
    } catch (err) {
        process.stdout.write('❌ FAIL\n');
        
        // Print useful error snippet
        if (err.stdout) {
            const out = err.stdout.toString();
            if (out.includes('Access denied')) {
                console.log('   ⚠️  DB ERROR: Access Denied. Check server/.env credentials.');
            } else if (out.includes('afterAll is not defined')) {
                 console.log('   ⚠️  TEST ERROR: Global setup failed.');
            } else {
                // Peek at the end of the log
                const lines = out.split('\n').filter(l => l.trim());
                lines.slice(-5).forEach(l => console.log(`   > ${l.trim()}`));
            }
        }
        
        if (err.stderr && !err.stdout) {
             console.error(err.stderr.toString());
        }
        
        failed++;
    }
});

console.log('\n---------------------------------------------------');
if (failed === 0) {
    console.log('✨ ALL SYSTEMS OPERATIONAL: INDUSTRIAL GRADE STABLE');
} else {
    console.log(`⚠️ FOUND ${failed} FAILED TEST SUITES.`);
    console.log('💡 TIP: Check database connection first; other failures are usually downstream.');
}
console.log('---------------------------------------------------\n');
