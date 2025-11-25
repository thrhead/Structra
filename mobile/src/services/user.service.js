import api from './api';

const userService = {
    /**
     * Get all users (Admin only)
     * @returns {Promise<{users}>}
     */
    getAll: async () => {
        try {
            const response = await api.get('/api/users');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create new user
     * @param {object} userData - {name, email, role, password}
     * @returns {Promise<{user}>}
     */
    create: async (userData) => {
        try {
            const response = await api.post('/api/users', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update user
     * @param {string} userId
     * @param {object} userData - {name, email, role}
     * @returns {Promise<{user}>}
     */
    update: async (userId, userData) => {
        try {
            const response = await api.put(`/api/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete user
     * @param {string} userId
     * @returns {Promise<{success}>}
     */
    delete: async (userId) => {
        try {
            const response = await api.delete(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
