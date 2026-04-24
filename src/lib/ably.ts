// Use the node-specific build to ensure crypto and other Node primitives are available
const Ably = require("ably/build/ably-node");

let ablyRest: any = null;

const getAblyRestClient = () => {
	const ABLY_API_KEY = process.env.ABLY_API_KEY;

	if (!ABLY_API_KEY) {
		console.warn(
			"⚠️ ABLY_API_KEY is not defined. Real-time features will not work.",
		);
		return null;
	}

	if (!ablyRest) {
		try {
			ablyRest = new Ably.Rest({ key: ABLY_API_KEY });
		} catch (error) {
			console.error("❌ Error initializing Ably.Rest:", error);
			throw error;
		}
	}
	return ablyRest;
};

export const publishToUser = async (
	userId: string,
	event: string,
	data: any,
) => {
	const client = getAblyRestClient();
	if (!client) return;

	try {
		const channel = client.channels.get(`user:${userId}`);
		await channel.publish(event, data);
	} catch (error) {
		console.error("❌ Error publishing to user %s:", userId, error);
	}
};

export const publishToJob = async (jobId: string, event: string, data: any) => {
	const client = getAblyRestClient();
	if (!client) return;

	try {
		const channel = client.channels.get(`job:${jobId}`);
		await channel.publish(event, data);
	} catch (error) {
		console.error("❌ Error publishing to job %s:", jobId, error);
	}
};

export const broadcast = async (event: string, data: any) => {
	const client = getAblyRestClient();
	if (!client) return;

	try {
		const channel = client.channels.get("system");
		await channel.publish(event, data);
	} catch (error) {
		console.error("❌ Error broadcasting:", error);
	}
};
