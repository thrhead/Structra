'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  CheckCircle2Icon,
  TrendingUpIcon,
  ArrowUpRight,
  PlusIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StrategicPulseChart } from '@/components/charts/strategic-pulse-chart'
import WeeklyStepsChart from '@/components/admin/reports/charts/WeeklyStepsChart'

interface AdminDashboardClientProps {
  data?: any // Support both data object and direct props
  stats?: {
    totalCustomers: number
    activeTeams: number
    pendingJobs: number
    completedJobs: number
    growthRate: string
    completionRate: string
  }
  pulseData?: any[]
  weeklyChartData?: {
    currentWeek: any[]
    previousWeek: any[]
    categories: string[]
  }
  topCustomers?: any[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function AdminDashboardClient({ 
  data,
  stats: directStats, 
  pulseData: directPulseData, 
  weeklyChartData: directWeeklyChartData,
  topCustomers: directTopCustomers 
}: AdminDashboardClientProps) {
  // Extract data from 'data' prop if provided, else use direct props
  const dashboardStats = directStats || data?.stats || {
    totalCustomers: 0,
    activeTeams: 0,
    pendingJobs: 0,
    completedJobs: 0,
    growthRate: '0%',
    completionRate: '0%'
  }
  
  const dashboardPulseData = directPulseData || data?.pulseData || []
  const dashboardWeeklyChartData = directWeeklyChartData || data?.weeklyChartData || { currentWeek: [], previousWeek: [], categories: [] }
  const dashboardTopCustomers = directTopCustomers || data?.topCustomers || []

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase italic">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
            <PlusIcon className="mr-2 h-4 w-4" /> Yeni Rapor
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Müşteriler</CardTitle>
              <UsersIcon className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic">{dashboardStats.totalCustomers}</div>
              <p className="text-xs text-emerald-500 font-bold flex items-center mt-1">
                <TrendingUpIcon className="mr-1 h-3 w-3" /> {dashboardStats.growthRate} artış
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Aktif Ekipler</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic">{dashboardStats.activeTeams}</div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Şu an sahada olanlar
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Bekleyen İşler</CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic">{dashboardStats.pendingJobs}</div>
              <p className="text-xs text-amber-500 font-bold mt-1">
                Planlama bekliyor
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Tamamlanan</CardTitle>
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic">{dashboardStats.completedJobs}</div>
              <p className="text-xs text-emerald-500 font-bold mt-1">
                {dashboardStats.completionRate} başarı oranı
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm bg-white dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-slate-100">Stratejik Analiz</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">İş Yoğunluğu & Maliyet Dengesi</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <StrategicPulseChart data={dashboardPulseData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm bg-white dark:bg-slate-900/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-slate-100">Son Hareketler</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Aktif Müşteriler & Durumları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardTopCustomers.map((customer: any, i: number) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all">
                  <Avatar className="h-9 w-9 border-2 border-slate-100 dark:border-slate-800 transition-all group-hover:border-indigo-200">
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs uppercase">
                      {customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{customer.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black italic text-indigo-600">+{customer.totalSpent || 0} TL</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{customer.jobCount || 0} İş</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all">
              Tümünü Görüntüle <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-slate-100">Haftalık Performans</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Adım Bazlı Tamamlanma Analizi</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyStepsChart 
            data={dashboardWeeklyChartData}
            categories={dashboardWeeklyChartData.categories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
