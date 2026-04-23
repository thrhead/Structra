import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import api from "../services/api";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Platform.OS === "web") {
		return; // Web push notifications not fully supported in this flow yet
	}

	if (!Device.isDevice) {
		return;
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		Alert.alert(
			"İzin Hatası",
			"Bildirim izni verilmediği için anlık bildirimleri alamayacaksınız.",
		);
		return;
	}

	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ??
		Constants?.easConfig?.projectId;
	if (!projectId) {
	}

	try {
		const pushTokenString = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
		return pushTokenString;
	} catch (e) {
		console.error("Error getting push token:", e);
	}
}

export function usePushNotifications() {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	const saveTokenToBackend = async (token) => {
		try {
			await api.post("/api/user/push-token", { token });
		} catch (error) {
			console.error("Error saving push token to backend:", error);
		}
	};

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => {
			if (token) {
				setExpoPushToken(token);
				saveTokenToBackend(token);
			}
		});

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((_response) => {
				// Here we can handle deep linking based on response.notification.request.content.data
			});

		return () => {
			if (notificationListener.current) {
				notificationListener.current.remove();
			}
			if (responseListener.current) {
				responseListener.current.remove();
			}
		};
	}, [saveTokenToBackend]);

	return {
		expoPushToken,
		notification,
	};
}
