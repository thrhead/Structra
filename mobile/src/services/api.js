// API Base URL - değiştirilebilir
const API_BASE_URL = 'http://localhost:3000';

// API helper fonksiyonu
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Bir hata oluştu');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
export const authAPI = {
    login: async (email, password) => {
        return apiRequest('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    logout: async () => {
        return apiRequest('/api/auth/signout', {
            method: 'POST',
        });
    },

    getSession: async () => {
        return apiRequest('/api/auth/session');
    },
};

// Jobs API
export const jobsAPI = {
    getWorkerJobs: async () => {
        return apiRequest('/api/worker/jobs');
    },

    getJobDetails: async (jobId) => {
        return apiRequest(`/api/worker/jobs/${jobId}`);
    },

    toggleSubstep: async (substepId, data) => {
        return apiRequest(`/api/worker/substeps/${substepId}/toggle`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Admin API
export const adminAPI = {
    getDashboard: async () => {
        return apiRequest('/api/admin/dashboard');
    },

    getJobs: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`/api/admin/jobs?${params}`);
    },

    getTeams: async () => {
        return apiRequest('/api/admin/teams');
    },
};

// Manager API
export const managerAPI = {
    getDashboard: async () => {
        return apiRequest('/api/manager/dashboard');
    },

    getJobs: async () => {
        return apiRequest('/api/manager/jobs');
    },
};

export { API_BASE_URL };
