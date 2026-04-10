'use client'

import Link from '@/lib/navigation'
import { usePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  Users2Icon,
  CheckCircle2Icon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  TrendingUpIcon,
  CalendarIcon,
  FileTextIcon,
  BarChart3Icon,
  PieChartIcon,
  GlobeIcon,
  Settings2Icon,
  ChevronRight
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Dashboard v2 (Yeni)',
    href: '/dashboard-v2',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Kullanıcı Yönetimi',
    icon: UsersIcon,
    items: [
      {
        title: 'Tüm Kullanıcılar',
        href: '/admin/users',
      },
      {
        title: 'Müşteriler',
        href: '/admin/customers',
      },
    ]
  },
  {
    title: 'Operasyon',
    icon: BriefcaseIcon,
    items: [
      {
        title: 'Ekipler',
        href: '/admin/teams',
      },
      {
        title: 'İşler',
        href: '/admin/jobs',
      },
      {
        title: 'Gelişmiş Planlama',
        href: '/admin/jobs/gantt',
      },
      {
        title: 'İş Şablonları',
        href: '/admin/templates',
      },
    ]
  },
  {
    title: 'Verimlilik',
    href: '/admin/calendar',
    icon: CalendarIcon
  },
  {
    title: 'Finans & Raporlama',
    icon: BarChart3Icon,
    items: [
      {
        title: 'Maliyetler',
        href: '/admin/costs',
      },
      {
        title: 'Raporlar',
        href: '/admin/reports',
      },
      {
        title: 'Sistem Logları',
        href: '/admin/logs',
      },
    ]
  },
  {
    title: 'Sistem',
    icon: Settings2Icon,
    items: [
      {
        title: 'Entegrasyonlar',
        href: '/admin/integrations/api-keys',
      },
      {
        title: 'Ayarlar',
        href: '/admin/profile',
      }
    ]
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center px-4">
        <Link href="/admin" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
            <LayoutDashboardIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-indigo-600">Montaj Takip</span>
            <span className="text-[10px] text-muted-foreground">Admin Paneli</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Yönetim
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              if (item.items) {
                return (
                  <Collapsible key={item.title} asChild defaultOpen={item.items.some(sub => pathname === sub.href)} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          {item.icon && <item.icon className="size-4" />}
                          <span className="flex-1">{item.title}</span>
                          <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.href} className={cn(
                                "transition-all",
                                pathname === subItem.href ? "bg-indigo-50 text-indigo-600 font-medium" : "hover:bg-sidebar-accent/50"
                              )}>
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }

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
                    <Link href={item.href!}>
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
            A
          </div>
          <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-foreground">Admin</span>
            <span className="truncate text-xs text-muted-foreground">admin@montaj.com</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
