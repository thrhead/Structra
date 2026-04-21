"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
import type {
	CostApprovedPayload,
	JobCompletedPayload,
	NotificationPayload,
	StepCompletedPayload,
} from "@/lib/socket-events";
import { useAbly } from "./ably-provider";

export function NotificationListener() {
	const { client, isConnected } = useAbly();
	const { data: session } = useSession();

	useEffect(() => {
		if (!client || !isConnected || !session?.user?.id) return;

		// Subscribe to user-specific channel
		const userChannel = client.channels.get(`user:${session.user.id}`);

		// Subscribe to system-wide channel
		const systemChannel = client.channels.get("system");

		const handleJobCompleted = (data: JobCompletedPayload) => {
			toast.success("İş Tamamlandı", {
				description: `${data.title} işi ${data.completedBy} tarafından tamamlandı.`,
			});
		};

		const handleCostApproved = (data: CostApprovedPayload) => {
			toast.success("Masraf Onaylandı", {
				description: `${data.amount} ₺ tutarındaki masraf onaylandı.`,
			});
		};

		const handleStepCompleted = (data: StepCompletedPayload) => {
			toast.success("Adım Tamamlandı", {
				description: `${data.stepTitle} adımı tamamlandı.`,
			});
		};

		const handleGenericNotification = (data: NotificationPayload) => {
			const toastFn =
				data.type === "success"
					? toast.success
					: data.type === "error"
						? toast.error
						: data.type === "warning"
							? toast.warning
							: toast.info;

			toastFn(data.title || "Bildirim", {
				description: data.message,
			});

			// Dispatch event to refresh notification list in other components
			window.dispatchEvent(new CustomEvent("notification:refresh"));
		};

		// Catch-all message handler for better robustness and logging
		const onMessage = (message: any, _channelName: string) => {
			const data = message.data;

			switch (message.name) {
				case "job:completed":
					handleJobCompleted(data as JobCompletedPayload);
					break;
				case "cost:approved":
					handleCostApproved(data as CostApprovedPayload);
					break;
				case "step:completed":
					handleStepCompleted(data as StepCompletedPayload);
					break;
				case "notification:new":
				case "notification:refresh":
					handleGenericNotification(data as NotificationPayload);
					break;
				case "cost:submitted":
					// Silent ignore to prevent double/triple notifications
					break;
				default:
			}
		};

		// Subscribe to all events on both channels
		const userHandler = (m: any) => onMessage(m, `user:${session.user.id}`);
		const systemHandler = (m: any) => onMessage(m, "system");

		userChannel.subscribe(userHandler);
		systemChannel.subscribe(systemHandler);

		return () => {
			userChannel.unsubscribe(userHandler);
			systemChannel.unsubscribe(systemHandler);
		};
	}, [client, isConnected, session?.user?.id]);

	return null;
}
