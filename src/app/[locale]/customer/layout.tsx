'use client'

import { redirect } from "@/lib/navigation"
import { CustomerHeader } from "@/components/customer/header"
import { CustomerSidebar } from "@/components/customer/sidebar"
import { useSession } from 'next-auth/react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Yükleniyor...</div>
  }

  if (!session || session.user.role !== "CUSTOMER") {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <CustomerSidebar /> 
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <CustomerHeader 
            user={session?.user as any} 
          />
          <main className="flex-1 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}