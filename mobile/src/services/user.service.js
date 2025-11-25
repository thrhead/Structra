import api from './api';

const userService = {
    /**
     * Get all users (Admin only)
     * @param {Object} filters - { role, search }
     * @returns {Promise<Array>}
     */
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.role && filters.role !== 'ALL') params.append('role', filters.role);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/api/admin/users?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create a new user
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    create: async (userData) => {
        try {
            const response = await api.post('/api/admin/users', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update an existing user
     * @param {string} id
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    update: async (id, userData) => {
        try {
            const response = await api.put(`/api/admin/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a user
     * @param {string} id
     * @returns {Promise<Object>}
     */
    delete: async (id) => {
        try {
            const response = await api.delete(`/api/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService;
