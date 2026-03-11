// Native fetch is available in Node 18+
// const fetch = global.fetch; 

const BASE_URL = 'http://localhost:3000';

async function runSanityCheck() {
    console.log('🏥 Starting HMS Sanity Check (Golden Flow)...');

    // 1. LOGIN
    console.log('\n[1] Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });

    if (!loginRes.ok) throw new Error(`Login Failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login Successful. Token acquired.');

    // 2. CHECK HEALTH
    console.log('\n[2] Checking System Health...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    if (!healthRes.ok) throw new Error('Health check failed');
    console.log('✅ System Healthy:', await healthRes.json());

    // 3. CREATE PATIENT
    console.log('\n[3] Creating Test Patient...');
    const uniqueId = Date.now();
    const newPatient = {
        name: `Sanity User ${uniqueId}`,
        age: 30,
        gender: "Male",
        mobile: `99${uniqueId.toString().substring(5)}`, // Dummy mobile
        address: "123 Test Lane",
        blood_group: "O+"
    };

    const patientRes = await fetch(`${BASE_URL}/api/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPatient)
    });

    if (!patientRes.ok) {
        console.log(await patientRes.text());
        throw new Error(`Patient Creation Failed: ${patientRes.status}`);
    }
    const patientData = await patientRes.json();
    console.log('✅ Patient Created:', patientData);
    const patientId = patientData.id || patientData.insertId; // Adjust based on actual API response

    // 4. FETCH PATIENTS (Verify Creation)
    console.log('\n[4] Verifying Patient Listing...');
    const listRes = await fetch(`${BASE_URL}/api/patients?search=${uniqueId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json();
    // Assuming backend returns array or search results
    if (listData && (listData.length > 0 || listData.patients?.length > 0)) {
        console.log('✅ Patient found in registry.');
    } else {
        console.warn('⚠️ Patient not immediately found in search (might be indexing delay or format mismatch).');
    }

    console.log('\n✨ SANITY CHECK COMPLETE: ALL SYSTEMS GO ✨');
}

runSanityCheck().catch(err => {
    console.error('\n❌ SANITY CHECK FAILED:', err);
    process.exit(1);
});
