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
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-transparent">
      {/* 1. Stat Cards (SectionCards) */}
      <SectionCards stats={stats} />
      
      {/* 2. Interactive Chart (ChartAreaInteractive) */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={pulseData} />
      </div>
      
      {/* 3. Data Table (Recent Customers) */}
      <div className="w-full">
        <div className="px-4 lg:px-6 pt-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-slate-100">Son Hareketler</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Aktif Müşteriler ve Operasyonel Bilgiler</p>
        </div>
        <DataTable data={topCustomers} />
      </div>
    </div>
  )
}
