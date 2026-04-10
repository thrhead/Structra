"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  BarChart3,
  Settings2,
  Command,
  GalleryVerticalEnd
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Projenin Orijinal Gerçek Verileri
const data = {
  user: {
    name: "Administrator",
    email: "admin@structra.com",
    avatar: "",
  },
  teams: [
    {
      name: "Montaj Takip",
      logo: LayoutDashboard,
      plan: "Admin Paneli",
    },
    {
      name: "Structra",
      logo: Command,
      plan: "Saha Yönetimi",
    },
    {
      name: "Operasyon Birimi",
      logo: GalleryVerticalEnd,
      plan: "Kurumsal",
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Kullanıcı Yönetimi',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Tüm Kullanıcılar',
          url: '/admin/users',
        },
        {
          title: 'Müşteriler',
          url: '/admin/customers',
        },
      ]
    },
    {
      title: 'Operasyon',
      url: '#',
      icon: Briefcase,
      items: [
        {
          title: 'Ekipler',
          url: '/admin/teams',
        },
        {
          title: 'İşler',
          url: '/admin/jobs',
        },
        {
          title: 'Gelişmiş Planlama',
          url: '/admin/jobs/gantt',
        },
        {
          title: 'İş Şablonları',
          url: '/admin/templates',
        },
      ]
    },
    {
      title: 'Verimlilik',
      url: '/admin/calendar',
      icon: Calendar
    },
    {
      title: 'Finans & Raporlama',
      url: '#',
      icon: BarChart3,
      items: [
        {
          title: 'Maliyetler',
          url: '/admin/costs',
        },
        {
          title: 'Raporlar',
          url: '/admin/reports',
        },
        {
          title: 'Sistem Logları',
          url: '/admin/logs',
        },
      ]
    },
    {
      title: 'Sistem',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Entegrasyonlar',
          url: '/admin/integrations/api-keys',
        },
        {
          title: 'Ayarlar',
          url: '/admin/profile',
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-100 dark:border-slate-800">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
