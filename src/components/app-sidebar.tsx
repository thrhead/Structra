'use client'

import * as React from "react"
import {
  LayoutDashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  BarChart3Icon,
  Settings2Icon,
  ChevronRight,
  Command,
  Plus,
  Zap
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from "@/lib/utils"

const data = {
  user: {
    name: "Admin",
    email: "admin@montaj.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: "Dashboard v2 (Yeni)",
      url: "/admin/dashboard-v2",
      icon: Zap,
    },
    {
      title: "Kullanıcı Yönetimi",
      url: "#",
      icon: UsersIcon,
      items: [
        {
          title: "Tüm Kullanıcılar",
          url: "/admin/users",
        },
        {
          title: "Müşteriler",
          url: "/admin/customers",
        },
      ],
    },
    {
      title: "Operasyon",
      url: "#",
      icon: BriefcaseIcon,
      items: [
        {
          title: "Ekipler",
          url: "/admin/teams",
        },
        {
          title: "İşler",
          url: "/admin/jobs",
        },
        {
          title: "Gelişmiş Planlama",
          url: "/admin/jobs/gantt",
        },
        {
          title: "İş Şablonları",
          url: "/admin/templates",
        },
      ],
    },
    {
      title: "Verimlilik",
      url: "/admin/calendar",
      icon: CalendarIcon,
    },
    {
      title: "Finans & Raporlama",
      url: "#",
      icon: BarChart3Icon,
      items: [
        {
          title: "Maliyetler",
          url: "/admin/costs",
        },
        {
          title: "Raporlar",
          url: "/admin/reports",
        },
        {
          title: "Sistem Logları",
          url: "/admin/logs",
        },
      ],
    },
    {
      title: "Sistem",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "Entegrasyonlar",
          url: "/admin/integrations/api-keys",
        },
        {
          title: "Ayarlar",
          url: "/admin/profile",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border shadow-sm">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground group-data-[collapsible=icon]:mx-auto">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-black text-indigo-600">Montaj Takip</span>
                  <span className="truncate text-xs text-muted-foreground uppercase font-bold tracking-tighter">Admin Paneli</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {data.navMain.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;
            const isSubItemActive = hasSubItems && item.items?.some(sub => pathname === sub.url);
            const isMainActive = pathname === item.url || isSubItemActive;

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isMainActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} className={cn(
                        "transition-all duration-200",
                        isMainActive ? "font-bold text-indigo-600" : "text-slate-600"
                      )}>
                        {item.icon && <item.icon className={cn("size-4", isMainActive && "text-indigo-600")} />}
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className={cn(
                                "transition-all",
                                pathname === subItem.url ? "bg-indigo-50 text-indigo-600 font-bold" : "hover:bg-slate-50"
                            )}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  className={cn(
                    "transition-all duration-200",
                    pathname === item.url ? "bg-indigo-50/50 text-indigo-600 font-bold" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-4" />}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-slate-50">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-black">
                {data.user.name.charAt(0)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-slate-900">{data.user.name}</span>
                <span className="truncate text-xs text-slate-500 font-medium">{data.user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
