'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, 
  ChevronDown
} from 'lucide-react'
// import { JobDialog } from './job-dialog'
// import { CustomerDialog } from './customer-dialog'
// import { UserDialog } from './user-dialog'
// import { TeamDialog } from './team-dialog'
import { useParams } from 'next/navigation'

interface DashboardQuickActionsProps {
  customers: any[]
  teams: any[]
  templates: any[]
  users: any[]
}

export function DashboardQuickActions({ customers, teams, templates, users }: DashboardQuickActionsProps) {
  const { locale } = useParams()
  // const basePrefix = `/${locale}`

  return (
    <div className="flex items-center gap-3 mb-6 relative z-[100]">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            className="rounded-2xl h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group ring-offset-2 ring-indigo-500/30 focus:ring-2 relative z-[101]"
          >
            <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-bold tracking-tight text-sm">Hızlı İşlemler (Diagnostic Mode)</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-64 p-2 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-[110]" 
          align="start" 
          sideOffset={8}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Diagnostic Items
            </DropdownMenuLabel>
            
            <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
              Test Item 1 - İş
            </DropdownMenuItem>
            
            <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-950/30">
              Test Item 2 - Müşteri
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-950/30">
              Test Item 3 - Kullanıcı
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Test Footer
            </DropdownMenuLabel>
            <DropdownMenuItem className="rounded-xl px-2 py-2 font-semibold cursor-pointer">
              Ayarlar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
