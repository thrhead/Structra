import api from './api';

const approvalService = {
    getAll: async (status = 'PENDING') => {
        const response = await api.get(`/api/approvals?status=${status}`);
        return response.data;
    },

    updateStatus: async (approvalId, status, notes = null) => {
        const payload = { status };
        if (notes) payload.notes = notes;
        const response = await api.patch(`/api/approvals/${approvalId}`, payload);
        return response.data;
    }
};

export default approvalService;
