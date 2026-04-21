import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "./api";

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const notificationService = {
	/**
	 * Register for Push Notifications
	 * @returns {Promise<string>}
	 */
	registerForPushNotificationsAsync: async () => {
		let token;

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				return;
			}

			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;

			try {
				if (!projectId) {
					token = (await Notifications.getExpoPushTokenAsync()).data;
				} else {
					token = (await Notifications.getExpoPushTokenAsync({ projectId }))
						.data;
				}

				if (token) {
					await AsyncStorage.setItem("push_token_last", token);
				}
			} catch (_e) {}
		} else {
		}

		return token;
	},

	/**
	 * Send Push Token to Backend
	 * @param {string} token
	 * @param {string} userId
	 */
	sendPushTokenToBackend: async (token, userId) => {
		if (!token || !userId) return;
		try {
			// Updated to use the new dedicated push token endpoint
			await api.post("/api/user/push-token", {
				token,
			});
		} catch (error) {
			console.error("Error sending push token", error);
		}
	},

	/**
	 * Get user notifications
	 * @returns {Promise<Array>}
	 */
	getNotifications: async () => {
		const response = await api.get("/api/notifications");
		// Return the notifications array from the response object
		return response.data?.notifications || response.data;
	},

	/**
	 * Mark all notifications as read
	 * @returns {Promise<Object>}
	 */
	markAllAsRead: async () => {
		const response = await api.patch("/api/notifications");
		return response.data;
	},

	/**
	 * Mark a specific notification as read
	 * @param {string} id
	 * @returns {Promise<Object>}
	 */
	markAsRead: async (id) => {
		const response = await api.patch("/api/notifications", { id });
		return response.data;
	},

	/**
	 * Delete a specific notification
	 * @param {string} id
	 * @returns {Promise<Object>}
	 */
	deleteNotification: async (id) => {
		const response = await api.delete("/api/notifications", {
			params: { id },
		});
		return response.data;
	},

	/**
	 * Delete all notifications for the user
	 * @returns {Promise<Object>}
	 */
	deleteAllNotifications: async () => {
		try {
			const response = await api.delete("/api/notifications");
			return response.data;
		} catch (error) {
			console.error("Service: Error in deleteAllNotifications", error);
			throw error;
		}
	},
};

export default notificationService;
