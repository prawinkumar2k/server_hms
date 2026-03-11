
export const setupFetchInterceptor = () => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        let [resource, config] = args;

        // Only intercept requests to our API
        // Checks if resource is a string and starts with /api
        if (typeof resource === 'string' && resource.startsWith('/api/')) {
            const token = localStorage.getItem('token');

            if (token) {
                // Ensure config object exists
                if (!config) {
                    config = {};
                }

                // Ensure headers object exists
                if (!config.headers) {
                    config.headers = {};
                }

                // Add Authorization header if not already present
                // We handle both simple objects and Headers objects
                if (config.headers instanceof Headers) {
                    if (!config.headers.has('Authorization')) {
                        config.headers.append('Authorization', `Bearer ${token}`);
                    }
                } else if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        }

        try {
            const response = await originalFetch(resource, config);

            // Optional: You could handle 401s here globally if needed
            // if (response.status === 401) { ... }

            return response;
        } catch (error) {
            console.error('Network Request Failed:', error);
            throw error;
        }
    };
};
