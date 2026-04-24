'use client'

import { ManagerSidebar } from '@/components/manager/sidebar'
import { ManagerHeader } from '@/components/manager/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 w-full">
                <ManagerSidebar />
                <SidebarInset className="flex-1 flex flex-col min-w-0">
                    <ManagerHeader />
                    <main className="flex-1 p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
