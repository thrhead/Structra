'use client'

import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30 w-full">
        <AdminSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <AdminHeader />
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
