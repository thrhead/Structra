"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WorkerHeader } from "@/components/worker/header";
import { WorkerSidebar } from "@/components/worker/sidebar";

export default function WorkerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<SidebarProvider>
				<div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row w-full">
					<WorkerSidebar />

					<SidebarInset className="flex-1 flex flex-col min-w-0">
						<WorkerHeader />
						<main className="flex-1 p-4 lg:p-6">{children}</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</SessionProvider>
	);
}
