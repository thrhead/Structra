import api from './api';

const teamService = {
    /**
     * Get all teams with members
     * @returns {Promise<{teams}>}
     */
    getAll: async () => {
        try {
            const response = await api.get('/api/admin/teams/list');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get team statistics
     * @param {string} teamId
     * @returns {Promise<{stats}>}
     */
    getStats: async (teamId) => {
        try {
            const response = await api.get(`/api/admin/teams/${teamId}/stats`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get team members
     * @param {string} teamId
     * @returns {Promise<{members}>}
     */
    getMembers: async (teamId) => {
        try {
            const response = await api.get(`/api/admin/teams/${teamId}/members`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default teamService;
