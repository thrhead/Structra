import api from "./api";

const teamService = {
	/**
	 * Get all teams with members
	 * @returns {Promise<{teams}>}
	 */
	getAll: async () => {
		const response = await api.get("/api/teams");
		return response.data;
	},

	/**
	 * Get team statistics
	 * @param {string} teamId
	 * @returns {Promise<{stats}>}
	 */
	getStats: async (teamId) => {
		const response = await api.get(`/api/admin/teams/${teamId}/stats`);
		return response.data;
	},

	/**
	 * Get team members
	 * @param {string} teamId
	 * @returns {Promise<{members}>}
	 */
	getMembers: async (teamId) => {
		// Since /api/admin/teams/${teamId}/members is ADMIN only,
		// we use getAll which returns teams with members for Managers too.
		const response = await api.get("/api/teams");
		const teams = response.data;
		const team = teams.find((t) => t.id === teamId);
		return team ? team.members : [];
	},

	/**
	 * Create a new team
	 * @param {Object} teamData
	 * @returns {Promise<{team}>}
	 */
	create: async (teamData) => {
		const response = await api.post("/api/teams", teamData);
		return response.data;
	},

	/**
	 * Update a team
	 * @param {string} teamId
	 * @param {Object} teamData
	 * @returns {Promise<{team}>}
	 */
	update: async (teamId, teamData) => {
		const response = await api.put(`/api/teams/${teamId}`, teamData);
		return response.data;
	},
	/**
	 * Delete a team
	 * @param {string} teamId
	 * @returns {Promise<void>}
	 */
	delete: async (teamId) => {
		const response = await api.delete(`/api/teams/${teamId}`);
		return response.data;
	},
};

export default teamService;
