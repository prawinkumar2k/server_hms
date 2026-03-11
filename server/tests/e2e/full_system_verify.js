// Full End-to-End System Verification Script
// Native Node.js - No external dependencies (uses built-in fetch in Node 18+)

const BASE_URL = 'http://localhost:3000'; // Direct to backend
const VERBOSE = true;

const users = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'doc1', password: 'password123', role: 'Doctor' },
    { username: 'recep1', password: 'password123', role: 'Receptionist' },
    { username: 'lab1', password: 'password123', role: 'Lab Technician' },
    { username: 'pharma1', password: 'password123', role: 'Pharmacist' }
];

const results = [];

async function login(user) {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, password: user.password })
        });

        if (!res.ok) {
            return { success: false, status: res.status, error: await res.text() };
        }

        const data = await res.json();
        return { success: true, token: data.token, userData: data.user };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function verifyEndpoint(label, token, method, path, expectedStatus = 200, payload = null) {
    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        if (payload) options.body = JSON.stringify(payload);

        const res = await fetch(`${BASE_URL}${path}`, options);

        const isSuccess = res.status === expectedStatus || (expectedStatus === '2xx' && res.status >= 200 && res.status < 300);

        if (!isSuccess && VERBOSE) {
            console.log(`   ❌ [${res.status}] ${path} - Body:`, await res.text().catch(() => 'No Body'));
        }

        return {
            label,
            path,
            method,
            status: res.status,
            pass: isSuccess,
            expected: expectedStatus
        };
    } catch (e) {
        return {
            label,
            path,
            method,
            status: 'ERR',
            pass: false,
            error: e.message
        };
    }
}

async function runVerification() {
    console.log('🚀 STARTING FULL SYSTEM VERIFICATION\n');

    // 1. AUTHENTICATION & TOKEN GENERATION
    console.log('--- 1. Authentication Check ---');
    const sessions = {};
    for (const user of users) {
        process.stdout.write(`   Logging in as ${user.role} (${user.username})... `);
        const auth = await login(user);
        if (auth.success) {
            console.log('✅ OK');
            sessions[user.role] = auth.token;
        } else {
            console.log(`❌ FAILED (${auth.status || 'ERR'})`);
            results.push({ label: `Login ${user.role}`, pass: false, error: auth.error });
        }
    }
    console.log('');

    // 2. MODULE ACCESS CHECKS
    console.log('--- 2. Module Access Verification ---');

    // Admin Tests
    if (sessions['Admin']) {
        results.push(await verifyEndpoint('Admin List Users', sessions['Admin'], 'GET', '/api/admin/users'));
    }

    // Doctor Tests
    if (sessions['Doctor']) {
        results.push(await verifyEndpoint('Doctor View Appointments', sessions['Doctor'], 'GET', '/api/appointments'));
        results.push(await verifyEndpoint('Doctor Search Patients', sessions['Doctor'], 'GET', '/api/patients')); // Assuming public/protected
    }

    // Receptionist Tests
    if (sessions['Receptionist']) {
        results.push(await verifyEndpoint('Recep View Appointments', sessions['Receptionist'], 'GET', '/api/appointments'));
        results.push(await verifyEndpoint('Recep View Billing', sessions['Receptionist'], 'GET', '/api/billing'));
    }

    // Lab Tests
    if (sessions['Lab Technician']) {
        results.push(await verifyEndpoint('Lab View Tests', sessions['Lab Technician'], 'GET', '/api/lab/tests'));
        results.push(await verifyEndpoint('Lab View Referrals', sessions['Lab Technician'], 'GET', '/api/lab/doctors'));
        results.push(await verifyEndpoint('Lab View Patients', sessions['Lab Technician'], 'GET', '/api/lab/patients'));
    }

    // Pharma Tests
    if (sessions['Pharmacist']) {
        results.push(await verifyEndpoint('Pharma View Stats', sessions['Pharmacist'], 'GET', '/api/pharmacy/stats'));
        results.push(await verifyEndpoint('Pharma View Stock', sessions['Pharmacist'], 'GET', '/api/pharmacy/products'));
    }

    console.log('');

    // 3. SECURITY & ROLE BOUNDARY CHECKS
    console.log('--- 3. Security (RBAC) Verification ---');
    if (sessions['Doctor']) {
        // Doctor should NOT be able to create an Admin user (checking Admin route protection)
        // Adjust expectedStatus based on implementation. Ideally 403 or 401.
        // admin.routes.js: router.use(verifyToken, authorizeRoles('Admin'));
        results.push(await verifyEndpoint('RBAC: Doctor accessing Admin Users', sessions['Doctor'], 'GET', '/api/admin/users', 403));
    }

    console.log('');

    // 4. SUMMARY
    console.log('--- 🔍 VERIFICATION RESULTS ---');
    let failures = 0;
    results.forEach(r => {
        const symbol = r.pass ? '✅' : '❌';
        console.log(`${symbol} ${r.label.padEnd(30)} | ${r.method} ${r.path} | Got: ${r.status} (Exp: ${r.expected})`);
        if (!r.pass) failures++;
    });

    // Write results to file
    const fs = require('fs');
    fs.writeFileSync('verify_results.json', JSON.stringify(results, null, 2));

    console.log('\n-----------------------------------');
    if (failures === 0) {
        console.log('✨ SYSTEM END-TO-END VERIFIED: STABLE');
        process.exit(0);
    } else {
        console.log(`⚠️ FOUND ${failures} ISSUES. REVIEW LOGS ABOVE.`);
        process.exit(1);
    }
}

runVerification();
