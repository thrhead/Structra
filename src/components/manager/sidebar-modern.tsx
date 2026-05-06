'use client'

import Link from '@/lib/navigation'
import { usePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  FileBarChartIcon,
  CalendarIcon,
  CheckSquareIcon,
  SettingsIcon
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
import { useSession } from 'next-auth/react'
import { NavUser } from '@/components/nav-user'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/manager',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Planlama',
    href: '/manager/calendar',
    icon: CalendarIcon
  },
  {
    title: 'İş Yönetimi',
    href: '/manager/jobs',
    icon: BriefcaseIcon
  },
  {
    title: 'Onay Bekleyenler',
    href: '/manager/approvals',
    icon: CheckCircle2Icon
  },
  {
    title: 'Raporlar',
    href: '/manager/reports',
    icon: FileBarChartIcon
  }
]

export function ManagerSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "Yönetici",
    email: session?.user?.email || "manager@montaj.com",
    avatar: session?.user?.image || "",
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center px-4">
        <Link href="/manager" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
            <CheckSquareIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-indigo-600">Yönetici Paneli</span>
            <span className="text-[10px] text-muted-foreground">Operasyon Yönetimi</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Operasyon
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    isActive={isActive}
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

      <SidebarFooter>
        <NavUser user={user} profileUrl="/manager/profile" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}