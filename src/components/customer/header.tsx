'use client'

import { signOut } from 'next-auth/react'
import { MenuIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from '@/lib/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface CustomerHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function CustomerHeader({ user }: CustomerHeaderProps) {
  const router = useRouter()
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="h-6 w-px bg-border mx-2 lg:hidden" />
        <h1 className="text-xl font-bold text-indigo-600">Montaj Takip</h1>
      </div>

      <div className="flex items-center gap-2">
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
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/customer/profile')}>
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