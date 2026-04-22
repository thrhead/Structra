'use client'

import { useSidebarTheme, SidebarTheme } from '@/hooks/use-sidebar-theme'
import { Button } from '@/components/ui/button'
import { 
  MonitorIcon, 
  LayersIcon, 
  PaletteIcon, 
  MoonIcon,
  CheckIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const themes: { id: SidebarTheme; name: string; icon: any; description: string }[] = [
  { 
    id: 'classic', 
    name: 'Klasik Tasarım', 
    icon: MonitorIcon,
    description: 'Eski yapı ve mevcut renkler'
  },
  { 
    id: 'modern-harmony', 
    name: 'Modern (Uyumlu)', 
    icon: LayersIcon,
    description: 'Yeni yapı ve mevcut pastel renkler'
  },
  { 
    id: 'modern-vibrant', 
    name: 'Modern (Canlı)', 
    icon: PaletteIcon,
    description: 'Yeni yapı ve koyu/canlı renkler'
  },
  { 
    id: 'modern-dark', 
    name: 'Modern (Karanlık)', 
    icon: MoonIcon,
    description: 'Yeni yapı ve tam karanlık mod'
  }
]

export function SidebarThemeSwitcher() {
  const { theme, setTheme } = useSidebarTheme()

  useEffect(() => {
    // Apply theme to an attribute on the sidebar provider container or body
    document.body.setAttribute('data-sidebar-theme', theme)
  }, [theme])

  return (
    <div className="grid grid-cols-1 gap-3">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
            theme === t.id 
              ? "border-indigo-600 bg-indigo-50/50 shadow-sm" 
              : "border-border bg-card hover:border-indigo-300 hover:shadow-xs"
          )}
        >
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            theme === t.id ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"
          )}>
            <t.icon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={cn("font-bold text-sm", theme === t.id ? "text-indigo-600" : "text-foreground")}>
                {t.name}
              </span>
              {theme === t.id && <CheckIcon className="size-4 text-indigo-600" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
