'use client'

import { useSidebarTheme } from "@/hooks/use-sidebar-theme"
import { DashboardClassic } from "./dashboard-classic"
import { DashboardModern } from "./dashboard-modern"
import { useEffect, useState } from "react"

interface DashboardViewProps {
  session: any
  data: any
}

export function DashboardView({ session, data }: DashboardViewProps) {
  const { theme } = useSidebarTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardClassic session={session} data={data} />
  }

  // If theme is modern-harmony, modern-vibrant, or modern-dark, use the modern layout
  // But wait, the user asked for "vibrant colors" specifically for the new theme.
  // I'll show the Modern layout for all 'modern-*' themes, but maybe I can adjust colors later.
  // For now, classic theme gets DashboardClassic, others get DashboardModern.
  
  if (theme === 'classic') {
    return <DashboardClassic session={session} data={data} />
  }

  return <DashboardModern session={session} data={data} />
}
