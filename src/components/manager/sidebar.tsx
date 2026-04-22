'use client'

import { useSidebarTheme } from '@/hooks/use-sidebar-theme'
import { ManagerSidebar as Modern } from './sidebar-modern'
import { ManagerSidebar as Classic } from './sidebar-classic'
import { useEffect, useState } from 'react'

export function ManagerSidebar() {
  const { theme } = useSidebarTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (theme === 'classic') {
    return <Classic /> 
  }

  return <Modern />
}
