/**
 * In-Memory Response Cache Middleware
 * 
 * Lightweight LRU cache for read-heavy endpoints.
 * No Redis needed — uses a simple Map with TTL eviction.
 * 
 * Usage in routes:
 *   const { cacheResponse } = require('../../middlewares/cache.middleware');
 *   router.get('/products', verifyToken, cacheResponse(60), controller.getProducts);
 * 
 * Cache is per-URL (including query params) and per-user-role.
 * Mutations (POST/PUT/DELETE) auto-invalidate related caches.
 */

class LRUCache {
    constructor(maxSize = 500) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check TTL
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, entry);

        return entry.data;
    }

    set(key, data, ttlSeconds) {
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            expiresAt: Date.now() + (ttlSeconds * 1000),
            createdAt: Date.now()
        });
    }

    invalidatePattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    clear() {
        this.cache.clear();
    }

    get size() {
        return this.cache.size;
    }
}

// Singleton cache instance
const responseCache = new LRUCache(500);

/**
 * Cache middleware factory
 * @param {number} ttlSeconds - Time to live in seconds (default: 30)
 * @returns Express middleware
 */
const cacheResponse = (ttlSeconds = 30) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') return next();

        // Build cache key: URL + role (role-aware caching)
        const role = req.user?.role || 'anonymous';
        const cacheKey = `${role}:${req.originalUrl}`;

        const cached = responseCache.get(cacheKey);
        if (cached) {
            res.set('X-Cache', 'HIT');
            return res.json(cached);
        }

        // Intercept res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                responseCache.set(cacheKey, body, ttlSeconds);
            }
            res.set('X-Cache', 'MISS');
            return originalJson(body);
        };

        next();
    };
};

/**
 * Invalidate cache for a specific route pattern
 * Use after mutations (POST/PUT/DELETE) to clear stale data
 * 
 * @param {string} pattern - URL pattern to invalidate (e.g., '/api/patients')
 */
const invalidateCache = (pattern) => {
    return (req, res, next) => {
        // Invalidate after the response is sent (non-blocking)
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                responseCache.invalidatePattern(pattern);
            }
        });
        next();
    };
};

module.exports = { cacheResponse, invalidateCache, responseCache };
