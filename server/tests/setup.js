const db = require('../src/config/db');

// Global setup before all backend tests
beforeAll(async () => {
    // Optional: add any global setup here (e.g. log suppressing)
});

// Global teardown after all backend tests
afterAll(async () => {
    try {
        // Ensure pool is closed correctly
        if (db && typeof db.end === 'function') {
            await db.end();
            // console.log('[JEST] Database pool closed.');
        }
    } catch (err) {
        // console.warn('[JEST] Failed to close DB pool:', err.message);
    }
});
