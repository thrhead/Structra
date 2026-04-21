"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { AblyProvider } from "./ably-provider";
import { NotificationListener } from "./notification-listener";
import { SyncProvider } from "./sync-provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<AblyProvider>
				<SyncProvider>
					{children}
					<NotificationListener />
				</SyncProvider>
			</AblyProvider>
		</SessionProvider>
	);
}
