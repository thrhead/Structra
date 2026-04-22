'use client'

import { useSidebarTheme } from '@/hooks/use-sidebar-theme'
import { CustomerSidebar as Modern } from './sidebar-modern'
import { CustomerSidebar as Classic } from './sidebar-classic'
import { useEffect, useState } from 'react'

export function CustomerSidebar() {
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
