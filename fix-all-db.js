const path = require('path');
const fs = require('fs');

// Path hack to use server node_modules
const serverNodeModules = path.join(__dirname, 'server/node_modules');
if (fs.existsSync(serverNodeModules)) {
    module.paths.push(serverNodeModules);
}

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Path to your server's .env file
const envPath = path.resolve(__dirname, 'server/.env');

async function testConnection(credentials) {
    try {
        const connection = await mysql.createConnection({
            host: credentials.DB_HOST,
            user: credentials.DB_USER,
            password: credentials.DB_PASS,
            port: parseInt(credentials.DB_PORT) || 3306
        });
        await connection.end();
        return true;
    } catch (err) {
        return false;
    }
}

async function startFix() {
    console.log('🛠️ HMS Database Diagnostic & Automatic Repair Hub');
    console.log('--------------------------------------------------');

    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found!');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value !== undefined) envVars[key.trim()] = value.trim();
    });

    console.log(`📡 Current Config: host=${envVars.DB_HOST}, user=${envVars.DB_USER}, port=${envVars.DB_PORT}`);

    // Standard local development passwords
    const commonPasswords = ['', 'root', 'admin', 'password', 'HmsDB2026', '12345678'];
    const users = ['root', 'hmsuser'];
    const ports = [3306, 3307];

    let workingCreds = null;

    console.log('🔍 Scanning for working connection...');
    for (const port of ports) {
        for (const user of users) {
            for (const pass of commonPasswords) {
                const creds = { ...envVars, DB_PORT: port, DB_USER: user, DB_PASS: pass };
                if (await testConnection(creds)) {
                    workingCreds = creds;
                    console.log(`✅ FOUND WORKING! Port: ${port}, User: ${user}, Pass: ${pass || '(blank)'}`);
                    break;
                }
            }
            if (workingCreds) break;
        }
        if (workingCreds) break;
    }

    if (workingCreds) {
        console.log('💾 Updating .env with working credentials...');
        let newContent = envContent;
        newContent = newContent.replace(/DB_PORT=.*/, `DB_PORT=${workingCreds.DB_PORT}`);
        newContent = newContent.replace(/DB_USER=.*/, `DB_USER=${workingCreds.DB_USER}`);
        newContent = newContent.replace(/DB_PASS=.*/, `DB_PASS=${workingCreds.DB_PASS}`);
        newContent = newContent.replace(/DB_NAME=.*/, `DB_NAME=hms`); // Align with schema file
        
        fs.writeFileSync(envPath, newContent);
        console.log('🚀 .env REPAIRED SUCCESSFULLY!');
    } else {
        console.log('\n❌ NO WORKING COMBINATION FOUND.');
        console.log('---------------------------------');
        console.log('Industrial Fix Recommended:');
        console.log('1. Manually set your DB_PASS in server/.env');
        console.log('2. Ensure MySQL service is running (Port 3306)');
        console.log('3. Run "npm run test:report" again');
    }
}

startFix();
