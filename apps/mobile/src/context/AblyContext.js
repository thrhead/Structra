import Ably from "ably";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { useAuth } from "./AuthContext";

const AblyContext = createContext({
	client: null,
	isConnected: false,
	channel: null,
});

export const useAbly = () => useContext(AblyContext);

export const AblyProvider = ({ children }) => {
	const { user, isAuthenticated } = useAuth();
	const [client, setClient] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [channel, setChannel] = useState(null);

	const clientRef = useRef(null);

	useEffect(() => {
		if (!isAuthenticated || !user) {
			if (clientRef.current) {
				clientRef.current.close();
				clientRef.current = null;
				setClient(null);
				setChannel(null);
				setIsConnected(false);
			}
			return;
		}

		if (
			clientRef.current &&
			clientRef.current.connection.state === "connected"
		) {
			return;
		}

		// Initialize Ably client
		const ably = new Ably.Realtime({
			authCallback: (_tokenParams, callback) => {
				// Ably SDK calls this with tokenParams, we need to call callback(err, tokenRequest)
				(async () => {
					try {
						const api = require("../services/api");
						const token = await api.getAuthToken();

						const response = await fetch(`${API_BASE_URL}/api/ably/auth`, {
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
						});

						if (response.ok) {
							const tokenRequestData = await response.json();
							callback(null, tokenRequestData);
						} else {
							const errorText = await response.text();
							callback(new Error(errorText || "Auth failed"), null);
						}
					} catch (error) {
						console.error("[Ably] Auth callback error:", error);
						callback(error, null);
					}
				})();
			},
			clientId: user.id,
		});

		clientRef.current = ably;
		setClient(ably);

		ably.connection.on("connected", () => {
			setIsConnected(true);

			// Subscribe to user-specific channel
			const userChannel = ably.channels.get(`user:${user.id}`);
			setChannel(userChannel);

			// Subscribe to notification events
			userChannel.subscribe("notification:new", (_message) => {});

			// Subscribe to other events
			userChannel.subscribe("job:completed", (_message) => {});

			userChannel.subscribe("job:status_changed", (_message) => {});

			userChannel.subscribe("photo:uploaded", (_message) => {});
		});

		ably.connection.on("disconnected", () => {
			setIsConnected(false);
		});

		ably.connection.on("failed", (err) => {
			console.error("[Ably] ❌ Connection failed:", err);
			setIsConnected(false);
		});

		return () => {
			if (clientRef.current) {
				clientRef.current.close();
				clientRef.current = null;
			}
		};
	}, [isAuthenticated, user]);

	return (
		<AblyContext.Provider value={{ client, isConnected, channel }}>
			{children}
		</AblyContext.Provider>
	);
};
