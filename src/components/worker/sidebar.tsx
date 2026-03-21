'use client'

import Link from '@/lib/navigation'
import { usePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  CheckSquareIcon,
  SettingsIcon,
  HomeIcon,
  HardHatIcon
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const sidebarItems = [
  {
    title: 'Ana Sayfa',
    href: '/worker',
    icon: HomeIcon
  },
  {
    title: 'İşlerim',
    href: '/worker?filter=ALL',
    icon: BriefcaseIcon
  },
  {
    title: 'Tamamlananlar',
    href: '/worker/completed',
    icon: CheckSquareIcon
  },
  {
    title: 'Profil & Ayarlar',
    href: '/worker/profile',
    icon: SettingsIcon
  }
]

export function WorkerSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center px-4">
        <Link href="/worker" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
            <HardHatIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-indigo-600">Saha Paneli</span>
            <span className="text-[10px] text-muted-foreground">İş Akışı</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Menü
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "transition-all",
                      isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-4", isActive ? "text-indigo-600" : "")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
            W
          </div>
          <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-foreground">Worker</span>
            <span className="truncate text-xs text-muted-foreground">worker@montaj.com</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
