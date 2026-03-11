const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Production-Grade MySQL Connection Pool
 * Tuned for handling up to 1M+ requests
 * 
 * Key settings:
 * - connectionLimit: 100 — Allows high concurrent query throughput
 * - maxIdle: 20 — Keeps 20 warm connections to avoid cold-start latency
 * - idleTimeout: 60000 — Reclaim idle connections after 60 seconds
 * - enableKeepAlive: true — Prevents TCP connection drops from firewalls/LBs
 * - queueLimit: 0 — Unlimited queue (no dropped requests)
 * - namedPlaceholders: true — Enables cleaner parameterized queries
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 3306,

    // Pool sizing
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10) || 100,
    maxIdle: 20,
    idleTimeout: 60000,
    queueLimit: 0,

    // Connection stability
    enableKeepAlive: true,
    keepAliveInitialDelay: 30000,

    // Timezone & charset
    timezone: '+05:30',
    charset: 'utf8mb4',

    // Query safety
    multipleStatements: false,
    dateStrings: true,

    // Named placeholders for cleaner queries
    namedPlaceholders: true
});

// Monitor pool events in non-production
if (process.env.NODE_ENV !== 'production') {
    pool.on('connection', () => {
        // Lightweight connection event - no logging in production
    });

    pool.on('enqueue', () => {
        console.warn('[DB POOL] Waiting for available connection slot...');
    });
}

module.exports = pool.promise();
