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
import { useSession } from "next-auth/react"

// Projenin Orijinal Gerçek Verileri
const data = {
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
        {
          title: 'Ekipler',
          url: '/admin/teams',
        },
      ]
    },
    {
      title: 'Operasyon',
      url: '#',
      icon: Briefcase,
      items: [
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
        {
          title: 'Onaylar',
          url: '/admin/approvals',
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
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "Admin Kullanıcı",
    email: session?.user?.email || "admin@montaj.com",
    avatar: session?.user?.image || "",
  }

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-100 dark:border-slate-800">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
