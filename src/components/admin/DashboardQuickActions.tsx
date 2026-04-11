'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  UserPlus, 
  Settings, 
  ChevronDown,
  LayoutGrid,
  ClipboardList
} from 'lucide-react'
import { JobDialog } from './job-dialog'
import { CustomerDialog } from './customer-dialog'
import { UserDialog } from './user-dialog'
import { TeamDialog } from './team-dialog'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface DashboardQuickActionsProps {
  customers: any[]
  teams: any[]
  templates: any[]
  users: any[]
}

export function DashboardQuickActions({ customers, teams, templates, users }: DashboardQuickActionsProps) {
  const { locale } = useParams()
  const basePrefix = `/${locale}`

  return (
    <div className="flex items-center gap-3 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            className="rounded-2xl h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group ring-offset-2 ring-indigo-500/30 focus:ring-2"
          >
            <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-bold tracking-tight text-sm">Hızlı İşlemler</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800" align="start" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Yeni Oluştur
            </DropdownMenuLabel>
            
            {/* 1. Job Creation */}
            <JobDialog 
              customers={customers} 
              teams={teams} 
              templates={templates} 
              trigger={
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-xl px-2 py-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group"
                >
                  <Briefcase className="mr-2 h-4 w-4 text-indigo-500" />
                  <span className="font-semibold">Yeni İş Oluştur</span>
                  <DropdownMenuShortcut className="ml-auto text-slate-400 group-hover:text-indigo-500 transition-colors">⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
              }
            />

            {/* 2. Customer Creation */}
            <CustomerDialog 
              trigger={
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-xl px-2 py-2 cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-950/30"
                >
                  <Users className="mr-2 h-4 w-4 text-amber-500" />
                  <span className="font-semibold">Yeni Müşteri Ekle</span>
                </DropdownMenuItem>
              }
            />

            {/* 3. User Creation */}
            <UserDialog 
              trigger={
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-xl px-2 py-2 cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-950/30"
                >
                  <UserPlus className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="font-semibold">Yeni Kullanıcı Ekle</span>
                </DropdownMenuItem>
              }
            />

            {/* 4. Team Creation */}
            <TeamDialog 
              users={users}
              trigger={
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-xl px-2 py-2 cursor-pointer focus:bg-rose-50 dark:focus:bg-rose-950/30"
                >
                  <LayoutGrid className="mr-2 h-4 w-4 text-rose-500" />
                  <span className="font-semibold">Yeni Ekip Ekle</span>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Yönetim
            </DropdownMenuLabel>
            <Link href={`${basePrefix}/admin/jobs`}>
              <DropdownMenuItem className="rounded-xl px-2 py-2 font-semibold cursor-pointer">
                <ClipboardList className="mr-2 h-4 w-4 text-slate-400" />
                İşleri Düzenle/Yönet
              </DropdownMenuItem>
            </Link>
            <Link href={`${basePrefix}/admin/customers`}>
              <DropdownMenuItem className="rounded-xl px-2 py-2 font-semibold cursor-pointer">
                <Users className="mr-2 h-4 w-4 text-slate-400" />
                Müşteri Listesi
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
