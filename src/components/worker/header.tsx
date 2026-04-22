'use client'

import { signOut, useSession } from 'next-auth/react'
import { MenuIcon, LogOutIcon, UserIcon, WifiOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { useNetwork } from '@/hooks/use-network'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function WorkerHeader() {
  const { data: session } = useSession()
  const isOnline = useNetwork()
  const router = useRouter()

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="h-6 w-px bg-border mx-2 lg:hidden" />
        <h1 className="text-xl font-bold text-indigo-600">Montaj Takip</h1>
        {!isOnline && (
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <WifiOffIcon className="h-3 w-3" />
            Çevrimdışı
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{session?.user?.name}</span>
                <span className="text-xs text-gray-500">{session?.user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/worker/profile')}>
              <UserIcon className="h-4 w-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}