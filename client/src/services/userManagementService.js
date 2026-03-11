const API_BASE_URL = '/api/admin'; // Unified Admin API

const fetchJson = async (url, options = {}) => {
    // Get token from localStorage (assuming it's stored there by AuthContext)
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add Auth header
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        // Handle unauthorized (optional: redirect to login or throw specific error)
        // window.location.href = '/login'; 
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
};

export const userService = {
    // --- Roles ---
    getRoles: () => fetchJson(`${API_BASE_URL}/roles`),

    createRole: (roleData) => fetchJson(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleData)
    }),

    updateRole: (roleId, roleData) => fetchJson(`${API_BASE_URL}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleData)
    }),

    deleteRole: (roleId) => fetchJson(`${API_BASE_URL}/roles/${roleId}`, {
        method: 'DELETE'
    }),

    // --- Modules ---
    getModules: () => fetchJson(`${API_BASE_URL}/modules`),

    // --- Staff ---
    getStaffList: () => fetchJson(`${API_BASE_URL}/staff`),

    // --- Users ---
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchJson(`${API_BASE_URL}/users?${query}`);
    },

    createUser: (userData) => fetchJson(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    getUserById: (userId) => fetchJson(`${API_BASE_URL}/users/${userId}`),

    updateUser: (userId, updateData) => fetchJson(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    }),

    deleteUser: (userId) => fetchJson(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
    })
};

export const logService = {
    getLogs: (params = {}) => {
        // Filter out undefined/empty params
        const cleanParams = {};
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== '' && val !== null) {
                cleanParams[key] = val;
            }
        });
        const query = new URLSearchParams(cleanParams).toString();
        return fetchJson(`${API_BASE_URL}/audit-logs?${query}`);
    },

    getRecentLogs: () => fetchJson(`${API_BASE_URL}/audit-logs?limit=20`),

    cleanupLogs: () => fetchJson(`${API_BASE_URL}/audit-logs/cleanup`, {
        method: 'DELETE'
    })
};
