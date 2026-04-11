'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { DashboardQuickActions } from "./DashboardQuickActions"

const DashboardMiniCharts = dynamic(() => import('@/components/admin/DashboardMiniCharts'), { ssr: false })

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
  
  // Map real data from getAdminDashboardData() to the dashboard block structure
  const stats = directStats || {
    totalCustomers: data?.totalCustomers ?? 0,          // Real DB count (active customers)
    activeTeams: data?.activeTeams ?? 0,
    pendingJobs: data?.pendingOnlyJobs ?? 0,            // Only PENDING status (not IN_PROGRESS)
    completedJobs: data?.totalCompletedJobs ?? 0,       // All-time completed jobs
    growthRate: '+12%',
    completionRate: `${data?.completionRate ?? 0}%`     // Real completion rate from server
  }

  const pulseData = directPulseData || data?.strategicTrend || []

  const topCustomers = directTopCustomers || (data?.latestCustomers || []).map((c: any) => {
    // Aggregate all approved cost amounts from all jobs of this customer
    const totalSpent = c.jobs?.reduce((sum: number, job: any) => {
      return sum + (job.costs?.reduce((jSum: number, cost: any) => jSum + (cost.amount || 0), 0) || 0)
    }, 0) || 0

    return {
      name: c.company || "İsimsiz Müşteri",
      email: c.email || "e-posta yok",
      totalSpent: totalSpent,
      jobCount: c._count?.jobs || 0
    }
  })

  return (
    <div className="flex flex-col gap-8 py-2 w-full overflow-x-hidden animate-page-enter">
      {/* 0. Header Quick Actions */}
      <DashboardQuickActions 
        customers={data?.allCustomers || []} 
        teams={data?.allTeams || []} 
        templates={data?.allTemplates || []} 
        users={data?.allUsers || []} 
      />

      {/* 1. Stat Cards */}
      <section className="space-y-3">
        <div className="px-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Genel Bakış</p>
        </div>
        <SectionCards stats={stats} />
      </section>

      {/* 2. Strategic Analysis Chart */}
      <section className="space-y-3">
        <div className="px-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Performans Trendi</p>
        </div>
        <div className="w-full">
          <ChartAreaInteractive data={pulseData} />
        </div>
      </section>

      {/* 3. Mini Charts — weekly steps + job status donut + KPI strip */}
      <section className="space-y-3">
        <div className="px-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Operasyonel Metrikler</p>
        </div>
        <DashboardMiniCharts
          weeklyStats={data?.weeklyStats || []}
          totalJobs={data?.totalJobs || 0}
          activeJobs={data?.activeJobs || 0}
          pendingOnlyJobs={data?.pendingOnlyJobs || 0}
          totalCompletedJobs={data?.totalCompletedJobs || 0}
          completedJobsToday={data?.completedJobsToday || 0}
          pendingApprovalsCount={data?.pendingApprovalsCount || 0}
        />
      </section>

      {/* 4. Data Table */}
      <section className="space-y-3">
        <div className="px-0.5 flex items-baseline gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Cari Hareketler</p>
            <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-0.5">Son Aktif Müşteriler</h3>
          </div>
        </div>
        <div className="w-full rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
          <DataTable data={topCustomers} />
        </div>
      </section>
    </div>
  )
}


