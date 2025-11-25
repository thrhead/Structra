import api from './api';

const customerService = {
    /**
     * Get all customers
     * @returns {Promise<{customers}>}
     */
    getAll: async () => {
        try {
            const response = await api.get('/api/customers');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create new customer
     * @param {object} customerData - {companyName, contactPerson, email, phone, address}
     * @returns {Promise<{customer}>}
     */
    create: async (customerData) => {
        try {
            const response = await api.post('/api/customers', customerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update customer
     * @param {string} customerId
     * @param {object} customerData
     * @returns {Promise<{customer}>}
     */
    update: async (customerId, customerData) => {
        try {
            const response = await api.put(`/api/customers/${customerId}`, customerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete customer
     * @param {string} customerId
     * @returns {Promise<{success}>}
     */
    delete: async (customerId) => {
        try {
            const response = await api.delete(`/api/customers/${customerId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default customerService;
