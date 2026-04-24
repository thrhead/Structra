import Ably from "ably";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import { API_BASE_URL, getAuthToken } from "../services/api";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({
	socket: null,
	isConnected: false,
	unreadCount: 0,
	notifications: [],
	markAsRead: () => {},
	markAllAsRead: () => {},
	joinJobRoom: () => {},
	leaveJobRoom: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const { user, isAuthenticated } = useAuth();
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	// Ref to keep track of client instance to prevent multiple connections
	const clientRef = useRef(null);
	const channelRef = useRef(null);
	const jobChannelsRef = useRef({});

	const fetchUnreadCount = useCallback(async () => {
		try {
			const token = await getAuthToken();
			if (!token) return;

			const response = await fetch(`${API_BASE_URL}/api/notifications`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				// API returns { notifications: Array, unreadCount: Number }
				const notificationsList =
					data.notifications || (Array.isArray(data) ? data : []);
				const count =
					typeof data.unreadCount === "number"
						? data.unreadCount
						: notificationsList.filter((n) => !n.isRead).length;

				setUnreadCount(count);
				setNotifications(notificationsList);
			}
		} catch (error) {
			console.error("[Socket] Error fetching notifications:", error);
		}
	}, []);

	// Create a compatible socket object
	const createSocketWrapper = useCallback(
		(ably) => {
			// Map to keep track of wrapped callbacks for unsubscription
			const wrappedCallbacks = new Map();

			return {
				ably,
				on: (event, callback) => {
					const wrappedCallback = (message) => {
						if (message?.data) {
							callback(message.data);
						} else {
							callback(message);
						}
					};

					// Store the mapping
					if (!wrappedCallbacks.has(event)) {
						wrappedCallbacks.set(event, new Map());
					}
					wrappedCallbacks.get(event).set(callback, wrappedCallback);

					if (event === "connect") {
						ably.connection.on("connected", callback);
					} else if (event === "disconnect") {
						ably.connection.on("disconnected", callback);
					} else if (event === "error") {
						ably.connection.on("failed", callback);
					} else if (event === "job:updated") {
						// This is a special case for JobDetailScreen
						Object.values(jobChannelsRef.current).forEach((channel) => {
							channel.subscribe("job:updated", wrappedCallback);
						});
						ably._jobUpdateCallback = callback;
					} else {
						// Default to user channel for other events
						const userChannel = ably.channels.get(`user:${user?.id}`);
						userChannel.subscribe(event, wrappedCallback);

						// Also listen on system channel for broadcast events
						const systemChannel = ably.channels.get("system");
						systemChannel.subscribe(event, wrappedCallback);
					}
				},
				off: (event, callback) => {
					const eventMap = wrappedCallbacks.get(event);
					const wrappedCallback = eventMap ? eventMap.get(callback) : null;

					if (event === "connect") {
						ably.connection.off("connected", callback);
					} else if (event === "disconnect") {
						ably.connection.off("disconnected", callback);
					} else if (event === "job:updated") {
						Object.values(jobChannelsRef.current).forEach((channel) => {
							if (wrappedCallback) {
								channel.unsubscribe("job:updated", wrappedCallback);
							} else {
								channel.unsubscribe("job:updated");
							}
						});
						ably._jobUpdateCallback = null;
					} else {
						const userChannel = ably.channels.get(`user:${user?.id}`);
						const systemChannel = ably.channels.get("system");

						if (wrappedCallback) {
							userChannel.unsubscribe(event, wrappedCallback);
							systemChannel.unsubscribe(event, wrappedCallback);
							eventMap.delete(callback);
						} else {
							userChannel.unsubscribe(event);
							systemChannel.unsubscribe(event);
						}
					}
				},
				emit: (event, ...args) => {
					// Simple emit to user-specific channel
					const userChannel = ably.channels.get(`user:${user?.id}`);
					userChannel.publish(event, args[0]);
				},
			};
		},
		[user?.id],
	);

	const joinJobRoom = (jobId) => {
		if (!clientRef.current) return;
		const channel = clientRef.current.channels.get(`job:${jobId}`);
		jobChannelsRef.current[jobId] = channel;

		// If we have a pending job:updated callback, subscribe now
		if (clientRef.current._jobUpdateCallback) {
			channel.subscribe("job:updated", (message) => {
				clientRef.current._jobUpdateCallback(message.data);
			});
		}
	};

	const leaveJobRoom = (jobId) => {
		if (!clientRef.current) return;
		const channel = jobChannelsRef.current[jobId];
		if (channel) {
			try {
				channel.unsubscribe();
				// Detach returns a promise that can throw if connection is dropped
				channel
					.detach()
					.catch((e) => console.warn("[Ably] detach warning:", e));
			} catch (error) {
				console.warn("[Ably] unsubscribe warning:", error);
			}
			delete jobChannelsRef.current[jobId];
		}
	};

	useEffect(() => {
		if (!isAuthenticated || !user) {
			if (clientRef.current) {
				clientRef.current.close();
				clientRef.current = null;
				channelRef.current = null;
				jobChannelsRef.current = {};
				setSocket(null);
				setIsConnected(false);
				setUnreadCount(0);
				setNotifications([]);
			}
			return;
		}

		if (
			clientRef.current &&
			clientRef.current.connection.state === "connected"
		) {
			return;
		}

		// Initialize Ably client (reuse the same pattern as SocketContext for compatibility)

		// Use authCallback to pass the JWT token manually
		const ably = new Ably.Realtime({
			authCallback: (_tokenParams, callback) => {
				// Ably SDK calls this with tokenParams, we need to call callback(err, tokenRequest)
				(async () => {
					try {
						const token = await getAuthToken();

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
		setSocket(createSocketWrapper(ably));

		ably.connection.on("connected", () => {
			setIsConnected(true);

			// Generic handler for all messages on user channel
			const handleMessage = (message) => {
				const eventName = message.name;
				const data = message.data;

				switch (eventName) {
					case "notification:new":
					case "notification:refresh":
						setUnreadCount((prev) => prev + 1);
						if (data && typeof data === "object") {
							setNotifications((prev) => [data, ...prev]);
							if (Platform.OS !== "web" && data.title && data.message) {
								const { Alert } = require("react-native");
								Alert.alert(data.title, data.message);
							}
						}
						fetchUnreadCount(); // Full sync
						break;

					case "job:completed":
						if (Platform.OS !== "web") {
							const { Alert } = require("react-native");
							Alert.alert(
								"İş Tamamlandı",
								`${data?.title || "İş"} tamamlandı.`,
							);
						}
						break;

					case "photo:uploaded":
						if (Platform.OS !== "web") {
							const { Alert } = require("react-native");
							Alert.alert(
								"Fotoğraf Yüklendi",
								`${data?.uploadedBy || "Kullanıcı"} yeni bir fotoğraf yükledi.`,
							);
						}
						break;

					case "cost:approved":
					case "cost:rejected":
						if (Platform.OS !== "web") {
							const { Alert } = require("react-native");
							const statusText =
								eventName === "cost:approved" ? "Onaylandı" : "Reddedildi";
							Alert.alert(
								"Masraf Güncellemesi",
								`Masraf durumu: ${statusText}`,
							);
						}
						fetchUnreadCount();
						break;

					default:
				}
			};

			// Catch-all subscription
			const userChannel = ably.channels.get(`user:${user.id}`);
			channelRef.current = userChannel;
			userChannel.subscribe(handleMessage);

			// Fetch initial unread count
			fetchUnreadCount();
		});

		ably.connection.on("disconnected", () => {
			setIsConnected(false);
		});

		ably.connection.on("failed", (error) => {
			console.error("[Ably] ❌ Connection failed:", error);
			setIsConnected(false);
		});

		return () => {
			if (clientRef.current) {
				clientRef.current.close();
				clientRef.current = null;
				channelRef.current = null;
				jobChannelsRef.current = {};
			}
		};
	}, [
		isAuthenticated,
		user,
		fetchUnreadCount,
		createSocketWrapper,
	]);

	const markAsRead = async (notificationId) => {
		try {
			// Optimistic update
			setUnreadCount((prev) => Math.max(0, prev - 1));
			setNotifications((prev) =>
				prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
			);

			const token = await getAuthToken();
			const response = await fetch(`${API_BASE_URL}/api/notifications`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id: notificationId }),
			});

			if (!response.ok) {
				throw new Error("Failed to mark notification as read");
			}
		} catch (error) {
			console.error("Error marking notification as read:", error);
			// Revert on error
			setUnreadCount((prev) => prev + 1);
		}
	};

	const markAllAsRead = async () => {
		try {
			setUnreadCount(0);
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

			const token = await getAuthToken();
			const response = await fetch(`${API_BASE_URL}/api/notifications`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to mark all notifications as read");
			}
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				isConnected,
				unreadCount,
				notifications,
				markAsRead,
				markAllAsRead,
				joinJobRoom,
				leaveJobRoom,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
