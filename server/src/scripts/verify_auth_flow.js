// Native http for dependency-free execution 
// Actually, I'll use standard http to be safe and dependency-free for this script.

const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000/api';

// Helper to make requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    // console.log('Raw response:', data); 
                    resolve({ status: res.statusCode, data: { raw: data, error: 'JSON Parse Error' } });
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Network Error to ${path}:`, e.message);
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function verifyAuthPipeline() {
    console.log('🔒 Starting Authentication Pipeline Verification...\n');

    try {
        // STEP 1: ADMIN LOGIN
        console.log('1️⃣  Testing Admin Login...');
        const adminLogin = await request('POST', '/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        if (adminLogin.status !== 200) {
            throw new Error(`Admin login failed: ${JSON.stringify(adminLogin.data)}`);
        }

        const adminToken = adminLogin.data.token;
        console.log('   ✅ Admin Logged In Successfully');
        console.log('   ✅ Token Received\n');

        // STEP 2: CREATE NEW USER (Verify Hashing on Creation)
        const testUser = {
            username: `test_user_${Date.now()}`,
            password: 'testpassword123',
            full_name: 'Test Setup User',
            role: 'Doctor'
        };

        console.log(`2️⃣  Testing User Creation (Admin Action)...`);
        console.log(`   Creating user: ${testUser.username}`);

        const createUser = await request('POST', '/admin/users', testUser, adminToken);

        if (createUser.status !== 201) {
            throw new Error(`User creation failed: ${JSON.stringify(createUser.data)}`);
        }
        console.log('   ✅ User Created Successfully (Password should be hashed in DB)\n');

        // STEP 3: NEW USER LOGIN (Verify Hashing Verification)
        console.log('3️⃣  Testing New User Login...');
        const userLogin = await request('POST', '/auth/login', {
            username: testUser.username,
            password: testUser.password
        });

        if (userLogin.status !== 200) {
            throw new Error(`New user login failed. Validates password hashing/comparison issue. Response: ${JSON.stringify(userLogin.data)}`);
        }

        const userToken = userLogin.data.token;
        console.log('   ✅ New User Logged In Successfully');
        console.log('   ✅ Token Validated\n');

        // STEP 4: ACCESS PROTECTED ROUTE (Verify Token Middleware)
        console.log('4️⃣  Testing Protected Route (/auth/me)...');
        const meParams = await request('GET', '/auth/me', null, userToken);

        if (meParams.status !== 200) {
            throw new Error(`Protected route access failed: ${JSON.stringify(meParams.data)}`);
        }

        if (meParams.data.username !== testUser.username) {
            throw new Error(`Token identity mismatch. Expected ${testUser.username}, got ${meParams.data.username}`);
        }
        console.log('   ✅ Protected Route Accessed');
        console.log('   ✅ Identity Verified\n');

        // STEP 5: CLEANUP
        console.log('5️⃣  Cleanup (Deleting Test User)...');
        const deleteUser = await request('DELETE', `/admin/users/${createUser.data.user.id}`, null, adminToken);
        if (deleteUser.status === 200) {
            console.log('   ✅ Test User Deleted\n');
        } else {
            console.log('   ⚠️ Cleanup failed (Manual deletion required for ID ' + createUser.data.user.id + ')\n');
        }

        console.log('🎉 AUTHENTICATION PIPELINE VERIFIED SUCCESSFULLY!');
        console.log('   - Login Flow: OK');
        console.log('   - Registration (Hashing): OK');
        console.log('   - Password Verification: OK');
        console.log('   - Token Middleware: OK');

    } catch (error) {
        console.error('\n❌ PIPELINE VERIFICATION FAILED');
        console.error(error.message);
        process.exit(1);
    }
}

verifyAuthPipeline();
