'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SidebarTheme = 'classic' | 'modern-harmony' | 'modern-vibrant' | 'modern-dark'

interface SidebarThemeStore {
  theme: SidebarTheme
  setTheme: (theme: SidebarTheme) => void
}

export const useSidebarTheme = create<SidebarThemeStore>()(
  persist(
    (set) => ({
      theme: 'modern-harmony',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'sidebar-theme-store',
    }
  )
)
