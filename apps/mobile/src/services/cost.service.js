import api from './api';

const costService = {
    /**
     * Create a new cost entry
     * @param {Object|FormData} costData
     * @returns {Promise<Object>}
     */
    create: async (costData) => {
        const isFormData = costData instanceof FormData;
        const config = {};

        if (isFormData) {
            config.headers = { 'Accept': 'application/json' };
            config.transformRequest = (data, headers) => {
                if (headers) {
                    delete headers['Content-Type'];
                    if (headers.post) delete headers.post['Content-Type'];
                }
                return data; 
            };
        }

        const response = await api.post('/api/worker/costs', costData, config);
        return response.data;
    },

    /**
     * Update an existing cost entry
     * @param {string} id
     * @param {Object|FormData} costData
     * @returns {Promise<Object>}
     */
    update: async (id, costData) => {
        const isFormData = costData instanceof FormData;
        const config = {};

        if (isFormData) {
            config.headers = { 'Accept': 'application/json' };
            config.transformRequest = (data, headers) => {
                if (headers) {
                    delete headers['Content-Type'];
                    if (headers.put) delete headers.put['Content-Type'];
                }
                return data; 
            };
        }

        const response = await api.put(`/api/worker/costs/${id}`, costData, config);
        return response.data;
    },

    /**
     * Delete an existing cost entry
     * @param {string} id
     * @returns {Promise<Object>}
     */
    delete: async (id) => {
        const response = await api.delete(`/api/worker/costs/${id}`);
        return response.data;
    },

    /**
     * Get worker's costs
     * @returns {Promise<Array>}
     */
    getMyCosts: async () => {
        const response = await api.get('/api/worker/costs');
        return response.data;
    },

    /**
     * Get all costs (Manager/Admin)
     * @param {Object} filters
     * @returns {Promise<Array>}
     */
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.jobId) params.append('jobId', filters.jobId);

        const response = await api.get(`/api/admin/costs?${params.toString()}`);
        return response.data;
    },

    /**
     * Update cost status (Approve/Reject)
     * @param {string} id
     * @param {string} status 'APPROVED' | 'REJECTED'
     * @param {string} rejectionReason
     * @returns {Promise<Object>}
     */
    updateStatus: async (id, status, rejectionReason) => {
        const response = await api.patch(`/api/admin/costs/${id}`, { status, rejectionReason });
        return response.data;
    },
};

export default costService;
