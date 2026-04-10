'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  CheckCircle2Icon,
  TrendingUpIcon,
  ArrowUpRight,
  PlusIcon,
  Download
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StrategicPulseChart } from '@/components/charts/strategic-pulse-chart'
import WeeklyStepsChart from '@/components/admin/reports/charts/WeeklyStepsChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AdminDashboardClientProps {
  data?: any
  stats?: any
  pulseData?: any[]
  weeklyChartData?: any
  topCustomers?: any[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function AdminDashboardClient({ 
  data,
  stats: directStats, 
  pulseData: directPulseData, 
  weeklyChartData: directWeeklyChartData,
  topCustomers: directTopCustomers 
}: AdminDashboardClientProps) {
  
  const dashboardStats = directStats || data?.stats || {
    totalCustomers: 0, activeTeams: 0, pendingJobs: 0, completedJobs: 0, growthRate: '0%', completionRate: '0%'
  }
  const dashboardPulseData = directPulseData || data?.pulseData || []
  const dashboardWeeklyChartData = directWeeklyChartData || data?.weeklyChartData || { currentWeek: [], previousWeek: [], categories: [] }
  const dashboardTopCustomers = directTopCustomers || data?.topCustomers || []

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-900 dark:text-slate-100">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="hidden h-9 sm:flex rounded-xl font-bold border-slate-200">
              <Download className="mr-2 h-4 w-4" /> Dışa Aktar
            </Button>
            <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95">
              <PlusIcon className="mr-2 h-4 w-4" /> Yeni Rapor
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <TabsTrigger value="overview" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">Genel Bakış</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest">Analiz</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest">Raporlar</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest">Bildirimler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { title: "Toplam Müşteri", value: dashboardStats.totalCustomers, icon: UsersIcon, sub: `${dashboardStats.growthRate} artış`, color: "text-indigo-500", trend: "up" },
                { title: "Aktif Ekipler", value: dashboardStats.activeTeams, icon: BriefcaseIcon, sub: "Su an sahada", color: "text-orange-500" },
                { title: "Bekleyen İşler", value: dashboardStats.pendingJobs, icon: CalendarIcon, sub: "Planlama bekliyor", color: "text-blue-500" },
                { title: "Tamamlanan İşler", value: dashboardStats.completedJobs, icon: CheckCircle2Icon, sub: `${dashboardStats.completionRate} başarı`, color: "text-emerald-500" }
              ].map((card, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 rounded-2xl hover:shadow-md transition-all border-b-2 border-transparent hover:border-indigo-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{card.title}</CardTitle>
                      <card.icon className={cn("h-4 w-4", card.color)} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black italic text-slate-900 dark:text-slate-100">{card.value}</div>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{card.sub}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 border-none shadow-sm bg-white dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-slate-100">Stratejik Analiz</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">İş Yoğunluğu & Maliyet Dengesi</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <StrategicPulseChart data={dashboardPulseData} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 border-none shadow-sm bg-white dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-slate-100">Son Hareketler</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Aktif Müşteriler & Durumları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {dashboardTopCustomers.slice(0, 5).map((customer: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-2xl transition-all">
                        <Avatar className="h-9 w-9 border-2 border-slate-100 dark:border-slate-800 group-hover:border-indigo-200 transition-all">
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs uppercase">
                            {customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col gap-0.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{customer.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight truncate">{customer.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black italic text-indigo-600">+{customer.totalSpent || 0} TL</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{customer.jobCount || 0} İş</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-6 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl group transition-all">
                    Tümünü Görüntüle <ArrowUpRight className="ml-2 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 rounded-3xl overflow-hidden">
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
          </TabsContent>
          
          <TabsContent value="analytics" className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400 italic font-mono">Detaylı analiz verileri yükleniyor...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
