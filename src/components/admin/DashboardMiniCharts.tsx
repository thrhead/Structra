'use client'

import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Clock, Zap, TrendingUp, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface WeeklyStatEntry {
  name: string
  date: string
  count: number
  jobs: { jobId: string; jobTitle: string; jobNo: string; stepCount: number; stepNames: string[] }[]
}

interface DashboardMiniChartsProps {
  weeklyStats: WeeklyStatEntry[]
  totalJobs: number
  activeJobs: number
  pendingOnlyJobs: number
  totalCompletedJobs: number
  completedJobsToday: number
  pendingApprovalsCount: number
}

const DONUT_COLORS = ['#6366f1', '#f59e0b', '#10b981']

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const entry: WeeklyStatEntry = payload[0]?.payload
  const count = payload[0].value
  if (count === 0) return null
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{label}</p>
      <p className="text-indigo-600 dark:text-indigo-400 font-bold">{count} adım tamamlandı</p>
      {entry?.jobs?.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800/50 pt-1.5 mt-1.5 space-y-0.5">
          {entry.jobs.slice(0, 3).map((job, i) => (
            <p key={i} className="text-slate-500 dark:text-slate-400 truncate">
              {job.jobNo || job.jobTitle} · {job.stepCount} adım
            </p>
          ))}
        </div>
      )}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/50">Tıklayarak detayları görün</p>
    </div>
  )
}

function CustomDonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-xl p-2.5 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="text-slate-700 dark:text-slate-200 font-bold">{payload[0].value} adet</p>
    </div>
  )
}

export default function DashboardMiniCharts({
  weeklyStats,
  totalJobs,
  activeJobs,
  pendingOnlyJobs,
  totalCompletedJobs,
  completedJobsToday,
  pendingApprovalsCount,
}: DashboardMiniChartsProps) {
  const router = useRouter()
  const { locale } = useParams()
  const basePrefix = `/${locale}`

  const [selectedDay, setSelectedDay] = useState<WeeklyStatEntry | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const donutData = [
    { name: 'Devam Eden', value: activeJobs },
    { name: 'Onay Bekleyen', value: pendingApprovalsCount },
    { name: 'Tamamlanan', value: totalCompletedJobs },
  ].filter(d => d.value > 0)

  const hasWeeklyData = weeklyStats.some(d => d.count > 0)
  const hasJobData = totalJobs > 0

  const handleBarClick = (data: any) => {
    if (!data || data.count === 0) return
    setSelectedDay(data)
  }

  const getStatusUrl = (name: string) => {
    if (name.includes('Devam Eden')) return `${basePrefix}/admin/jobs?status=IN_PROGRESS`
    if (name.includes('Onay Bekleyen')) return `${basePrefix}/admin/approvals`
    if (name.includes('Tamamlanan')) return `${basePrefix}/admin/jobs?status=COMPLETED`
    return `${basePrefix}/admin/jobs`
  }

  const handleDonutClick = (entry: any) => {
    if (entry && entry.name) {
      router.push(getStatusUrl(entry.name))
    }
  }

  // Stats strip
  const statsStrip = [
    {
      label: 'Toplam İş',
      value: totalJobs,
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      href: `${basePrefix}/admin/jobs`
    },
    {
      label: 'Devam Eden',
      value: activeJobs,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      href: `${basePrefix}/admin/jobs?status=IN_PROGRESS`
    },
    {
      label: 'Tamamlanan',
      value: totalCompletedJobs,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      href: `${basePrefix}/admin/jobs?status=COMPLETED`
    },
    {
      label: 'Onay Bekleyen',
      value: pendingApprovalsCount,
      icon: Clock,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      href: `${basePrefix}/admin/approvals`
    },
  ]

  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
      {/* ── Weekly Completed Steps Bar Chart ── */}
      <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            Haftalık Tamamlanan Adımlar
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-0.5">
            Son 7 günlük iş adımı performansı
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-4">
          {hasWeeklyData ? (
            <>
              <div className="h-[220px] sm:h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      interval={0}
                    />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 } as any} />
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]} 
                      name="Tamamlanan"
                      onClick={handleBarClick}
                      className="cursor-pointer"
                      barSize={isMobile ? 20 : 32}
                    >
                      {weeklyStats.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={selectedDay?.date === entry.date 
                            ? '#4f46e5' 
                            : `hsl(${240 + i * 8}, ${65 + i * 2}%, ${52 + i}%)`
                          }
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ── Selected Day Detail Panel ── */}
              {selectedDay && selectedDay.jobs.length > 0 && (
                <div className="mt-2 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/20 p-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {selectedDay.name} — {selectedDay.count} adım
                    </p>
                    <button 
                      onClick={() => setSelectedDay(null)}
                      className="p-0.5 rounded-md hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedDay.jobs.map((job, i) => (
                      <Link 
                        key={i} 
                        href={`${basePrefix}/admin/jobs/${job.jobId}`}
                        className="block rounded-lg border border-indigo-200/40 dark:border-indigo-800/30 bg-white/80 dark:bg-slate-900/80 p-2 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {job.jobNo || 'İş'}
                          </span>
                          <ArrowRight className="w-3 h-3 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate mb-1">{job.jobTitle}</p>
                        <div className="flex flex-wrap gap-1">
                          {job.stepNames.map((name, si) => (
                            <span 
                              key={si} 
                              className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {name}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
              <CheckCircle2 className="w-10 h-10 opacity-30" />
              <p className="text-xs font-medium">Bu hafta henüz tamamlanan adım yok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Job Status Donut + Stats ── */}
      <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            İş Durumu Dağılımı
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-0.5">
            Aktif · Onay Bekleyen · Tamamlanan
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-4">
          {hasJobData ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    onClick={handleDonutClick}
                    className="cursor-pointer"
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-1">
                {donutData.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 -mx-1.5 rounded-md transition-colors"
                    onClick={() => handleDonutClick(item)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-100">{item.value}</span>
                  </div>
                ))}
                <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center justify-between px-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Toplam</span>
                    <span className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">{totalJobs}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
              <Zap className="w-10 h-10 opacity-30" />
              <p className="text-xs font-medium">Henüz iş kaydı bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── KPI Strip Row ── */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsStrip.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group h-full"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 leading-none mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold tabular-nums tracking-tight ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
