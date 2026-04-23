"use client";

import * as Ably from "ably";
import { useSession } from "next-auth/react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface AblyContextType {
	client: Ably.Realtime | null;
	isConnected: boolean;
}

const AblyContext = createContext<AblyContextType>({
	client: null,
	isConnected: false,
});

export const useAbly = () => useContext(AblyContext);

export function AblyProvider({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const [client, setClient] = useState<Ably.Realtime | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (status !== "authenticated" || !session?.user?.id) {
			return;
		}

		// Initialize Ably client
		const realtime = new Ably.Realtime({
			authUrl: "/api/ably/auth",
			clientId: session.user.id,
		});

		realtime.connection.on("connected", () => {
			setIsConnected(true);
		});

		realtime.connection.on("disconnected", () => {
			setIsConnected(false);
		});

		realtime.connection.on("failed", (err) => {
			console.error("❌ Ably connection failed:", err);
			setIsConnected(false);
		});

		setClient(realtime);

		return () => {
			realtime.close();
			setClient(null);
			setIsConnected(false);
		};
	}, [status, session?.user?.id]);

	return (
		<AblyContext.Provider value={{ client, isConnected }}>
			{children}
		</AblyContext.Provider>
	);
}
