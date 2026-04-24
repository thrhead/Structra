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
  
  let pageName = lastSegment 
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ')
    : 'Dashboard'

  // Special handling for job detail pages to show short ID
  if (pathname.includes('/admin/jobs/') && lastSegment && lastSegment.length > 20) {
    pageName = `#${lastSegment.slice(-6).toUpperCase()}`
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-100/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-150" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-4 bg-slate-200 dark:bg-slate-800"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    Saha Operasyon
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-300 dark:text-slate-700" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                    {pageName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
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
                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-150 cursor-pointer"
            >
                <Avatar className="h-7 w-7 border border-slate-200/80 dark:border-slate-700/60 ring-2 ring-transparent hover:ring-indigo-500/20 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-[9px] tracking-wider">
                    AD
                </AvatarFallback>
                </Avatar>
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 pt-6">
          <main className="w-full h-full animate-page-enter">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
