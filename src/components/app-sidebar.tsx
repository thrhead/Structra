"use client"

import * as React from "react"
import {
  Briefcase,
  Calendar,
  BarChart3,
  LayoutDashboard,
  Settings2,
  Users,
  Map,
  PieChart,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Projenin Gerçek Verileri
const data = {
  user: {
    name: "Administrator",
    email: "admin@structra.com",
    avatar: "",
  },
  teams: [
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
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Operasyon",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "İşler",
          url: "/admin/jobs",
        },
        {
          title: "Müşteriler",
          url: "/admin/customers",
        },
        {
          title: "Ekipler",
          url: "/admin/teams",
        },
        {
            title: "Onaylar",
            url: "/admin/approvals",
        },
      ],
    },
    {
      title: "Planlama",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Takvim",
          url: "/admin/calendar",
        },
        {
          title: "Gantt Şeması",
          url: "/admin/jobs/gantt",
        },
      ],
    },
    {
      title: "Ayarlar",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profil",
          url: "/admin/profile",
        },
        {
          title: "Bildirimler",
          url: "/admin/notifications",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Genel Raporlar",
      url: "/admin/reports",
      icon: PieChart,
    },
    {
      name: "Maliyet Analizi",
      url: "/admin/reports/costs",
      icon: BarChart3,
    },
    {
      name: "Saha Haritası",
      url: "/admin/jobs/map",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-100 dark:border-slate-800">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
