'use client'

import { useSidebarTheme } from '@/hooks/use-sidebar-theme'
import { AdminSidebar as Modern } from './sidebar-modern'
import { AdminSidebar as Classic } from './sidebar-classic'
import { useEffect, useState } from 'react'

export function AdminSidebar() {
  const { theme } = useSidebarTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.setAttribute('data-sidebar-theme', theme)
  }, [theme])

  if (!mounted) return null

  if (theme === 'classic') {
    return <Classic /> 
  }

  return <Modern />
}
