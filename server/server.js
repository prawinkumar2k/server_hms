const cluster = require('cluster');
const os = require('os');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENABLE_CLUSTER = process.env.ENABLE_CLUSTER === 'true';
const NUM_WORKERS = parseInt(process.env.CLUSTER_WORKERS, 10) || os.cpus().length;

/**
 * Production Server with Optional Cluster Mode
 * 
 * Cluster Mode distributes incoming requests across multiple worker processes,
 * utilizing all CPU cores. This is critical for handling 1M+ requests.
 * 
 * Set ENABLE_CLUSTER=true in .env to activate.
 * Set CLUSTER_WORKERS=N to control worker count (default: CPU count).
 */

if (ENABLE_CLUSTER && cluster.isPrimary) {
    // ============================================================
    // PRIMARY PROCESS — Forks workers, monitors health
    // ============================================================
    console.log(`[CLUSTER] Primary ${process.pid} starting with ${NUM_WORKERS} workers...`);

    // Fork workers
    for (let i = 0; i < NUM_WORKERS; i++) {
        cluster.fork();
    }

    // Restart crashed workers automatically
    cluster.on('exit', (worker, code, signal) => {
        console.error(`[CLUSTER] Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`);
        cluster.fork();
    });

    cluster.on('online', (worker) => {
        console.log(`[CLUSTER] Worker ${worker.process.pid} is online`);
    });

    // Graceful shutdown of all workers
    const shutdown = () => {
        console.log('[CLUSTER] Primary shutting down all workers...');
        for (const id in cluster.workers) {
            cluster.workers[id].process.kill('SIGTERM');
        }
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

} else {
    // ============================================================
    // WORKER PROCESS (or single-process mode if cluster disabled)
    // ============================================================
    const app = require('./src/app');
    const db = require('./src/config/db');
    const logger = require('./src/utils/logger');

    const server = app.listen(PORT, () => {
        const mode = ENABLE_CLUSTER ? `Cluster Worker ${process.pid}` : 'Single Process';
        logger.info(`[${mode}] Server running on port ${PORT}`);
    });

    // Graceful shutdown with connection draining
    const gracefulShutdown = (signal) => {
        logger.info(`${signal} received. Starting graceful shutdown...`);

        // Stop accepting new connections
        server.close(async () => {
            logger.info('HTTP server closed. Draining DB pool...');

            try {
                // Close all DB connections
                await db.end();
                logger.info('DB pool closed. Process exiting.');
            } catch (err) {
                logger.error('Error closing DB pool:', err);
            }

            process.exit(0);
        });

        // Force kill after 30 seconds if graceful fails
        setTimeout(() => {
            logger.error('Graceful shutdown timed out. Force killing...');
            process.exit(1);
        }, 30000);
    };

    // Check DB Connection on startup
    db.getConnection()
        .then(connection => {
            logger.info('Database connected successfully');
            connection.release();
        })
        .catch(err => {
            logger.error('Database connection failed:', err);
        });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION:', err);
        gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (err) => {
        logger.error('UNCAUGHT EXCEPTION:', err);
        gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
