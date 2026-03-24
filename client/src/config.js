/**
 * Global API Configuration
 * Automatically detects the environment and provides the correct backend URL.
 */
const getApiUrl = () => {
    // 1. Check if an explicit environment variable is provided (highest priority)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 2. Intelligent Auto-detection
    // If we're on localhost, assume local development backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }

    // 3. Fallback to Relative Path for Production
    // Ideal for Nginx proxying at /api
    return '/api';
};

export const API_BASE_URL = getApiUrl();
export default API_BASE_URL;
