import api, { setAuthToken, clearAuthToken } from './api';

const authService = {
    /**
     * Login user
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{user, token}>}
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/api/mobile/login', {
                email,
                password,
            });

            if (response.data.token) {
                await setAuthToken(response.data.token);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post('/api/auth/signout');
            await clearAuthToken();
        } catch (error) {
            // Even if API call fails, clear local token
            await clearAuthToken();
            throw error;
        }
    },

    /**
     * Get current user profile
     * @returns {Promise<{user}>}
     */
    getProfile: async () => {
        try {
            const response = await api.get('/api/worker/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Change password
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<{message}>}
     */
    changePassword: async (oldPassword, newPassword) => {
        try {
            const response = await api.put('/api/worker/change-password', {
                oldPassword,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;
