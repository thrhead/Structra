import "react-native-gesture-handler";
import "./src/i18n/config";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	GestureHandlerRootView,
	TouchableOpacity,
} from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomSpinner from "./src/components/CustomSpinner";
import { OfflineBanner } from "./src/components/OfflineBanner";
import ToastNotification from "./src/components/ToastNotification";
import { COLORS } from "./src/constants/theme";
import { AblyProvider } from "./src/context/AblyContext";
import { AlertProvider } from "./src/context/AlertContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NetworkProvider } from "./src/context/NetworkContext";
import { SocketProvider } from "./src/context/SocketContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import AdminDashboardScreen from "./src/screens/admin/AdminDashboardScreen";
import AdvancedPlanningScreen from "./src/screens/admin/AdvancedPlanningScreen";
import ApprovalsScreen from "./src/screens/admin/ApprovalsScreen";
import CalendarScreen from "./src/screens/admin/CalendarScreen";
import CreateJobScreen from "./src/screens/admin/CreateJobScreen";
import CustomerManagementScreen from "./src/screens/admin/CustomerManagementScreen";
import EditJobScreen from "./src/screens/admin/EditJobScreen";
import ReportsScreen from "./src/screens/admin/ReportsScreen";
import TeamDetailScreen from "./src/screens/admin/TeamDetailScreen";
import TeamManagementScreen from "./src/screens/admin/TeamManagementScreen";
import UserManagementScreen from "./src/screens/admin/UserManagementScreen";
import WebhookScreen from "./src/screens/admin/WebhookScreen";
import ChatScreen from "./src/screens/chat/ChatScreen";
import LoginScreen from "./src/screens/LoginScreen";
// ... rest of imports
import CostManagementScreen from "./src/screens/manager/CostManagementScreen";
import JobAssignmentScreen from "./src/screens/manager/JobAssignmentScreen";
import ManagerDashboardScreen from "./src/screens/manager/ManagerDashboardScreen";
import TeamListScreen from "./src/screens/manager/TeamListScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import Assembly3DScreen from "./src/screens/worker/Assembly3DScreen";
import ExpenseManagementScreen from "./src/screens/worker/ExpenseManagementScreen";
import JobDetailScreen from "./src/screens/worker/JobDetailScreen";
import NotificationsScreen from "./src/screens/worker/NotificationsScreen";
import WorkerDashboardScreen from "./src/screens/worker/WorkerDashboardScreen";
import WorkerJobsScreen from "./src/screens/worker/WorkerJobsScreen";
import { LoggerService } from "./src/services/LoggerService";
import notificationService from "./src/services/notification.service";
import { QueueService } from "./src/services/QueueService";
import { SyncManager } from "./src/services/SyncManager";
import { linking } from "./src/utils/linking";

// Web specific styles injection
// ... (rest of web styles)

const Stack = createStackNavigator();

function getInitialRoute(user) {
	if (!user) return "Login";
	switch (user.role?.toUpperCase()) {
		case "ADMIN":
			return "AdminDashboard";
		case "MANAGER":
			return "ManagerDashboard";
		case "WORKER":
		case "TEAM_LEAD":
			return "WorkerDashboard";
		default:
			return "Login";
	}
}

function AppNavigator() {
	const { user, loading } = useAuth();
	const { t } = useTranslation();
	const { theme, isDark } = useTheme();

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<CustomSpinner
					size="large"
					color={theme?.colors?.primary || COLORS.primary}
				/>
			</View>
		);
	}

	const navTheme = {
		dark: isDark,
		colors: {
			primary: theme.colors.primary,
			background: theme.colors.background,
			card: theme.colors.card,
			text: theme.colors.text,
			border: theme.colors.border,
			notification: theme.colors.primary,
		},
		fonts: theme.fonts,
	};

	const dashboardScreens = [
		"AdminDashboard",
		"ManagerDashboard",
		"WorkerDashboard",
		"Login",
	];

	return (
		<View style={{ flex: 1, height: "100%" }}>
			<NavigationContainer linking={linking} theme={navTheme}>
				<Stack.Navigator
					initialRouteName={getInitialRoute(user)}
					detachInactiveScreens={true}
					screenOptions={({ navigation, route }) => ({
						animationEnabled: false,
						headerShown: true,
						headerStyle: {
							backgroundColor: theme.colors.card,
							elevation: 0,
							shadowOpacity: 0,
							borderBottomWidth: 1,
							borderBottomColor: theme.colors.border,
						},
						headerTintColor: theme.colors.text,
						headerTitleStyle: {
							fontWeight: "bold",
						},
						headerLeft: (props) => {
							// Don't show back button on dashboard screens
							if (dashboardScreens.includes(route.name)) return null;

							return (
								<TouchableOpacity
									onPress={() => {
										if (navigation.canGoBack()) {
											navigation.goBack();
										} else {
											// Fallback for PWA refresh
											navigation.navigate(getInitialRoute(user));
										}
									}}
									style={{ marginLeft: 16, padding: 4 }}
								>
									<MaterialIcons
										name="arrow-back"
										size={24}
										color={theme.colors.primary}
									/>
								</TouchableOpacity>
							);
						},
					})}
				>
					{user ? (
						<>
							{/* Worker Screens */}
							<Stack.Screen
								name="WorkerDashboard"
								component={WorkerDashboardScreen}
								options={{ title: t("navigation.home"), headerShown: false }}
							/>
							<Stack.Screen
								name="Jobs"
								component={WorkerJobsScreen}
								options={{ title: t("navigation.jobs") }}
							/>
							<Stack.Screen
								name="JobDetail"
								component={JobDetailScreen}
								options={{ title: t("worker.jobDetails"), headerShown: false }}
							/>
							<Stack.Screen
								name="Assembly3D"
								component={Assembly3DScreen}
								options={{ title: "3D Montaj", headerShown: false }}
							/>
							<Stack.Screen
								name="ExpenseManagement"
								component={ExpenseManagementScreen}
								options={{ title: t("worker.expenses"), headerShown: false }}
							/>

							{/* Manager Screens */}
							<Stack.Screen
								name="ManagerDashboard"
								component={ManagerDashboardScreen}
								options={{ title: "Manager Dashboard", headerShown: false }}
							/>
							<Stack.Screen
								name="TeamList"
								component={TeamListScreen}
								options={{ title: t("navigation.teams") }}
							/>
							<Stack.Screen
								name="JobAssignment"
								component={JobAssignmentScreen}
								options={{
									title: t("navigation.jobAssignment") || "Job Assignment",
								}}
							/>
							<Stack.Screen
								name="CostManagement"
								component={CostManagementScreen}
								options={{ title: t("worker.expenses") }}
							/>
							{/* Admin Screens */}
							<Stack.Screen
								name="AdminDashboard"
								component={AdminDashboardScreen}
								options={{ title: "Admin Dashboard", headerShown: false }}
							/>
							<Stack.Screen
								name="UserManagement"
								component={UserManagementScreen}
								options={{
									title: t("navigation.userManagement") || "User Management",
								}}
							/>
							<Stack.Screen
								name="CustomerManagement"
								component={CustomerManagementScreen}
								options={{
									title: t("navigation.customers") || "Customer Management",
								}}
							/>
							<Stack.Screen
								name="Approvals"
								component={ApprovalsScreen}
								options={{ title: t("navigation.approvals") || "Approvals" }}
							/>
							<Stack.Screen
								name="CreateJob"
								component={CreateJobScreen}
								options={{ title: t("navigation.createJob") || "Create Job" }}
							/>
							<Stack.Screen
								name="EditJob"
								component={EditJobScreen}
								options={{ title: "İşi Düzenle", headerShown: false }}
							/>
							<Stack.Screen
								name="Calendar"
								component={CalendarScreen}
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="AdvancedPlanning"
								component={AdvancedPlanningScreen}
								options={{ title: "Gelişmiş Planlama" }}
							/>
							<Stack.Screen
								name="Reports"
								component={ReportsScreen}
								options={{ title: "Analiz & Raporlar" }}
							/>
							<Stack.Screen
								name="TeamManagement"
								component={TeamManagementScreen}
								options={{ title: t("navigation.teams") }}
							/>
							<Stack.Screen
								name="TeamDetail"
								component={TeamDetailScreen}
								options={{
									title: t("navigation.teamDetails") || "Team Details",
								}}
							/>
							<Stack.Screen
								name="Webhooks"
								component={WebhookScreen}
								options={{ title: "Webhook Monitoring" }}
							/>
							{/* Profile Screen */}
							<Stack.Screen
								name="Profile"
								component={ProfileScreen}
								options={{ title: t("navigation.profile") }}
							/>
							<Stack.Screen
								name="Notifications"
								component={NotificationsScreen}
								options={{
									title: t("navigation.notifications") || "Notifications",
								}}
							/>
							<Stack.Screen
								name="Chat"
								component={ChatScreen}
								options={{ headerShown: false }}
							/>
						</>
					) : (
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</View>
	);
}

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						padding: 20,
						backgroundColor: COLORS.backgroundDark,
					}}
				>
					<Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
						Bir hata oluştu / An error occurred
					</Text>
					<Text style={{ color: "red", textAlign: "center" }}>
						{this.state.error?.toString()}
					</Text>
				</View>
			);
		}

		return this.props.children;
	}
}

export default function App() {
	React.useEffect(() => {
		try {
			// Initialize Offline Queue
			QueueService.initialize().catch((e) => console.error("Queue error:", e));
			// Initialize Sync Manager
			SyncManager.init();
			// Initialize Logger Service (periodic sync)
			LoggerService.init();

			// Listen for notification responses (user taps on a notification)
			const subscription =
				Notifications.addNotificationResponseReceivedListener((response) => {
					const data = response.notification.request.content.data;

					// Custom logic for routing can go here if linking doesn't handle it
					// Example: if (data.link) { ... }
				});

			return () => {
				subscription.remove();
				try {
					SyncManager.destroy();
					LoggerService.destroy();
				} catch (error) {
					console.error("App cleanup error:", error);
				}
			};
		} catch (error) {
			console.error("App initialization error:", error);
		}
	}, []);

	return (
		<GestureHandlerRootView
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				minHeight: "100%", // Ensure it takes full height on web
				// CRITICAL: Ensure touch-action is permitted for native scrolling on web
				...(Platform.OS === "web" && { touchAction: "auto", overflow: "auto" }),
			}}
		>
			<ErrorBoundary>
				<SafeAreaProvider>
					<NetworkProvider>
						<ThemeProvider>
							<AuthProvider>
								<SocketProvider>
									<AlertProvider>
										<OfflineBanner />
										<AppNavigator />
										<ToastNotification />
									</AlertProvider>
								</SocketProvider>
							</AuthProvider>
						</ThemeProvider>
					</NetworkProvider>
				</SafeAreaProvider>
			</ErrorBoundary>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.backgroundDark,
	},
});
// Trigger 2
