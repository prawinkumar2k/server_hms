const path = require('path');
const fs = require('fs');

// industrial module resolution
const serverNodeModules = path.join(__dirname, '../server/node_modules');
if (fs.existsSync(serverNodeModules)) {
    module.paths.push(serverNodeModules);
}

const db = require('../server/src/config/db');

async function verifyDatabase() {
    console.log('\n🔍 Starting HMS Industrial Database Verification...');
    
    const success = await db.testConnection();
    
    if (success) {
        console.log('✅ SYSTEM READY: Real-time database connectivity confirmed.');
        process.exit(0);
    } else {
        console.log('\n❌ SYSTEM OFFLINE: Initial connection failed.');
        console.log('💡 TIP: Please verify your password in server/.env');
        process.exit(1);
    }
}

verifyDatabase();
