const autocannon = require('autocannon');
// const { fetch } = require('undici'); // Native fetch is available in Node 18+
// Using native fetch for the login helper if standard node 18+

const BASE_URL = 'http://localhost:3000'; // Direct to backend container port mapping
// const BASE_URL = 'http://localhost'; // Through Nginx (if we want to test whole stack) -> Let's test direct to backend first to isolate nodejs performance, then nginx.

// Actually, testing through Nginx (port 80) is more realistic for "Production" readiness.
// But let's stick to localhost:3000 to ensure we aren't limited by ephemeral networking weirdness, 
// and we are testing the Node clustering. 
// Wait, docker-compose maps 3000:3000, so we can hit it.

const TARGET_URL = 'http://localhost:3000';

async function getAuthToken() {
    console.log('Logging in to get stress test token...');
    try {
        const response = await fetch(`${TARGET_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Got token!');
        return data.token;
    } catch (err) {
        console.error('Fatal: Could not login for load test.', err);
        process.exit(1);
    }
}

async function runLoadTest() {
    const token = await getAuthToken();

    console.log('Starting Industrial-Grade Load Test...');
    console.log(`Target: ${TARGET_URL}`);
    console.log('Simulating High Load (Cluster Mode Validation)...');

    const result = await autocannon({
        url: TARGET_URL,
        connections: 100, // Number of concurrent connections
        pipelining: 1,    // Number of pipelined requests
        duration: 30,     // Duration in seconds
        workers: 4,       // Use 4 worker threads for generating load (client side CPU)
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        requests: [
            {
                method: 'GET',
                path: '/api/health', // Liveness check
                weight: 2
            },
            {
                method: 'GET',
                path: '/api/auth/me', // Lightweight Auth check
                weight: 5
            },
            // Add a database-heavy endpoint if possible, but safely
            {
                method: 'GET',
                path: '/api/patients', // List patients (Read op)
                weight: 3
            }
        ]
    });

    console.log(autocannon.printResult(result));
}

runLoadTest();
