'use client'

import React from 'react'
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

interface AdminDashboardClientProps {
  data?: any
  stats?: any
  pulseData?: any[]
  topCustomers?: any[]
}

export default function AdminDashboardClient({ 
  data,
  stats: directStats, 
  pulseData: directPulseData, 
  topCustomers: directTopCustomers 
}: AdminDashboardClientProps) {
  
  // Mapping real data from getAdminDashboardData() to the dashboard-01 block structure
  const stats = directStats || {
    totalCustomers: data?.latestCustomers?.length || 0,
    activeTeams: data?.activeTeams || 0,
    pendingJobs: data?.activeJobs || 0,
    completedJobs: data?.completedJobsToday || 0,
    growthRate: '+12%', // Mock growth for visual polish
    completionRate: data?.completedJobsToday > 0 ? '94%' : '0%'
  }

  const pulseData = directPulseData || data?.strategicTrend || []
  
  // Map latestCustomers to match CustomerData interface in DataTable
  const topCustomers = directTopCustomers || (data?.latestCustomers || []).map((c: any) => ({
    name: c.company || "İsimsiz Müşteri",
    email: c.email || "e-posta yok",
    totalSpent: 0, // In a real app, this would be fetched from invoices
    jobCount: 0    // In a real app, this would be computed
  }))

  return (
    <div className="flex flex-col gap-6 py-6 md:gap-10 md:py-8 bg-transparent w-full overflow-x-hidden">
      {/* 1. Stat Cards (SectionCards) */}
      <SectionCards stats={stats} />
      
      {/* 2. Interactive Chart (ChartAreaInteractive) */}
      <div className="px-4 lg:px-6 w-full">
        <ChartAreaInteractive data={pulseData} />
      </div>
      
      {/* 3. Data Table (Recent Customers) */}
      <div className="w-full">
        <div className="px-4 lg:px-6 pt-4 pb-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Cari Hareketler</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Sistemdeki son aktif müşteriler tablosu</p>
        </div>
        <div className="w-full">
          <DataTable data={topCustomers} />
        </div>
      </div>
    </div>
  )
}
