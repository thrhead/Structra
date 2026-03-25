'use client'

import { LogOutIcon, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { useRouter } from '@/lib/navigation'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function AdminHeader() {
  const router = useRouter()

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="h-6 w-px bg-border mx-2 lg:hidden" />
        <h1 className="font-bold text-lg text-indigo-600">Montaj Takip</h1>
      </div>
      <div className="hidden lg:block">
        {/* Breadcrumbs or page title could go here */}
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Kullanıcı Menüsü">
              <Avatar className="h-9 w-9 border-2 border-indigo-100 transition-all hover:border-indigo-300">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium text-sm">
                  A
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
