'use client'

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { signOut } from 'next-auth/react'
import { useRouter } from '@/lib/navigation'
import { LogOutIcon } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Dynamic page name for breadcrumb
  const pathSegments = pathname.split('/').filter(Boolean)
  const lastSegment = pathSegments[pathSegments.length - 1]
  const pageName = lastSegment 
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ')
    : 'Dashboard'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-indigo-600 transition-colors" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Saha Operasyon
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {pageName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <NotificationDropdown />
            
            <Separator
              orientation="vertical"
              className="h-4 bg-slate-200 dark:bg-slate-800"
            />

            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/admin/profile')} 
                className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative z-50 cursor-pointer"
            >
                <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-800">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-[10px]">
                    AD
                </AvatarFallback>
                </Avatar>
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 pt-6">
          <main className="w-full h-full animate-in fade-in duration-500">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
