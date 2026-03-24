const mysql = require('mysql2');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Industrial-Grade MySQL Connection Pool
 * Features: Automatic reconnection, Pool monitoring, and Robust error handling.
 */
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'hms',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10) || 50,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+05:30',
    charset: 'utf8mb4'
};

const pool = mysql.createPool(poolConfig);

// Enhance pool with monitoring
pool.on('acquire', (connection) => {
    // console.log('[DB] Connection %d acquired', connection.threadId);
});

pool.on('connection', (connection) => {
    // console.log('[DB] New connection established');
});

pool.on('enqueue', () => {
    console.warn('[DB] Waiting for available connection slot...');
});

pool.on('release', (connection) => {
    // console.log('[DB] Connection %d released', connection.threadId);
});

const promisePool = pool.promise();

// Diagnostic helper
promisePool.testConnection = async () => {
    try {
        const conn = await promisePool.getConnection();
        console.log(`✅ DATABASE CONNECTED: ${poolConfig.user}@${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`);
        conn.release();
        return true;
    } catch (err) {
        console.error('❌ DATABASE CONNECTION ERROR:');
        console.error(`   Code: ${err.code}`);
        console.error(`   User: ${poolConfig.user}`);
        console.error(`   Host: ${poolConfig.host}:${poolConfig.port}`);
        console.error(`   Msg:  ${err.message}`);
        return false;
    }
};

module.exports = promisePool;
