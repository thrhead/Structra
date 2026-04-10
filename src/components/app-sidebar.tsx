"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Users2,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Search,
  Plus
} from "lucide-react"

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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { 
    Collapsible, 
    CollapsibleContent, 
    CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { useRouter, usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Operasyon",
    icon: Briefcase,
    items: [
      { title: "İşler", url: "/admin/jobs" },
      { title: "Müşteriler", url: "/admin/customers" },
      { title: "Ekipler", url: "/admin/teams" },
      { title: "Onaylar", url: "/admin/approvals" },
    ],
  },
  {
    title: "Planlama",
    icon: Calendar,
    items: [
      { title: "Takvim", url: "/admin/calendar" },
      { title: "Gantt Şeması", url: "/admin/jobs/gantt" },
    ],
  },
  {
    title: "Analiz & Raporlar",
    icon: BarChart3,
    items: [
      { title: "Genel Raporlar", url: "/admin/reports" },
      { title: "Maliyet Analizi", url: "/admin/reports/costs" },
      { title: "Performans", url: "/admin/reports/performance" },
    ],
  },
]

const secondaryItems = [
  {
    title: "Ayarlar",
    url: "/admin/profile",
    icon: Settings,
  },
  {
    title: "Bildirimler",
    url: "/admin/notifications",
    icon: Bell,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 dark:border-slate-800" {...props}>
      <SidebarHeader className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center px-4">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <span className="text-sm font-black italic">S</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-black uppercase italic tracking-tighter text-slate-900 dark:text-slate-100">Structra</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Panel</span>
            </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-4 px-4">Yönetim</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <React.Fragment key={item.title}>
                  {item.items ? (
                    <Collapsible asChild defaultOpen={pathname.includes(item.url || '---')} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} className="rounded-xl font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all px-4">
                            {item.icon && <item.icon className="size-4" />}
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="rounded-lg font-bold text-xs text-slate-500 hover:text-indigo-600 transition-all">
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} className="rounded-xl font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all px-4">
                        <a href={item.url}>
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-4 px-4">Sistem</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} className="rounded-xl font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all px-4">
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 border-2 border-indigo-100 dark:border-slate-800">
                <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">Administrator</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">admin@structra.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-lg group-data-[collapsible=icon]:hidden hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="size-4" />
            </Button>
          </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function Avatar({ className, children }: any) {
    return <div className={`overflow-hidden rounded-full ${className}`}>{children}</div>
}
function AvatarFallback({ className, children }: any) {
    return <div className={`flex h-full w-full items-center justify-center ${className}`}>{children}</div>
}
