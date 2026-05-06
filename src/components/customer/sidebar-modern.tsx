'use client'

import Link from "@/lib/navigation"
import { usePathname } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { BriefcaseIcon, UserIcon, LogOutIcon, LayoutIcon } from "lucide-react"
import { signOut } from "next-auth/react"
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

const navigation = [
  { name: "İşlerim", href: "/customer", icon: BriefcaseIcon },
  { name: "Profil", href: "/customer/profile", icon: UserIcon },
]

export function CustomerSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "Müşteri",
    email: session?.user?.email || "customer@montaj.com",
    avatar: session?.user?.image || "",
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center px-4">
        <Link href="/customer" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
            <LayoutIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-indigo-600">Müşteri Paneli</span>
            <span className="text-[10px] text-muted-foreground">İş Takip Sistemi</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Müşteri Menüsü
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.name}
                    className={cn(
                      "transition-all",
                      isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-4", isActive ? "text-indigo-600" : "")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} profileUrl="/customer/profile" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}