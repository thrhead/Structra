'use client'

import React from 'react'
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

interface AdminDashboardClientProps {
  data?: any
  stats?: any
  pulseData?: any[]
  weeklyChartData?: any
  topCustomers?: any[]
}

export default function AdminDashboardClient({ 
  data,
  stats: directStats, 
  pulseData: directPulseData, 
  topCustomers: directTopCustomers 
}: AdminDashboardClientProps) {
  
  // Extract data from props
  const dashboardStats = directStats || data?.stats || {
    totalCustomers: 0, activeTeams: 0, pendingJobs: 0, completedJobs: 0, growthRate: '0%', completionRate: '0%'
  }
  const dashboardPulseData = directPulseData || data?.pulseData || []
  const dashboardTopCustomers = directTopCustomers || data?.topCustomers || []

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-transparent">
      {/* 1. Stat Cards (SectionCards) */}
      <SectionCards stats={dashboardStats} />
      
      {/* 2. Interactive Chart (ChartAreaInteractive) */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={dashboardPulseData} />
      </div>
      
      {/* 3. Data Table (Recent Customers/Jobs) */}
      <div className="w-full">
        <div className="px-4 lg:px-6 pt-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-slate-100">Son Hareketler</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Aktif Müşteriler ve Operasyonel Bilgiler</p>
        </div>
        <DataTable data={dashboardTopCustomers} />
      </div>
    </div>
  )
}
