import api from './api';

const jobService = {
    /**
     * Get all jobs assigned to the current worker
     * @returns {Promise<{jobs}>}
     */
    getMyJobs: async () => {
        try {
            const response = await api.get('/api/worker/jobs');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get job details by ID
     * @param {string} jobId
     * @returns {Promise<{job}>}
     */
    getJobById: async (jobId) => {
        try {
            const response = await api.get(`/api/worker/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Toggle job step completion
     * @param {string} jobId
     * @param {string} stepId
     * @param {boolean} isCompleted
     * @returns {Promise<{success}>}
     */
    toggleStep: async (jobId, stepId, isCompleted) => {
        try {
            const response = await api.put(
                `/api/worker/jobs/${jobId}/steps/${stepId}/toggle`,
                { isCompleted }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Toggle substep completion
     * @param {string} jobId
     * @param {string} stepId
     * @param {string} substepId
     * @param {boolean} isCompleted
     * @returns {Promise<{success}>}
     */
    toggleSubstep: async (jobId, stepId, substepId, isCompleted) => {
        try {
            const response = await api.put(
                `/api/worker/jobs/${jobId}/steps/${stepId}/substeps/${substepId}/toggle`,
                { isCompleted }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Upload photos for a job step
     * @param {string} jobId
     * @param{string} stepId
     * @param {FormData} formData
     * @returns {Promise<{photos}>}
     */
    uploadPhotos: async (jobId, stepId, formData) => {
        try {
            const response = await api.post(
                `/api/worker/jobs/${jobId}/steps/${stepId}/photos`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Complete a job
     * @param {string} jobId
     * @returns {Promise<{success}>}
     */
    completeJob: async (jobId) => {
        try {
            const response = await api.put(`/api/worker/jobs/${jobId}/complete`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default jobService;
