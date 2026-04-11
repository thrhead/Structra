'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react'

interface DashboardMiniChartsProps {
  weeklyStats: { name: string; count: number }[]
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
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-xl p-2.5 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-indigo-600 dark:text-indigo-400 font-bold">{payload[0].value} adım</p>
    </div>
  )
}

function CustomDonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-xl p-2.5 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="text-slate-700 dark:text-slate-200 font-bold">{payload[0].value} iş</p>
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
  const donutData = [
    { name: 'Aktif (Devam)', value: activeJobs - pendingOnlyJobs },
    { name: 'Bekleyen', value: pendingOnlyJobs },
    { name: 'Tamamlanan', value: totalCompletedJobs },
  ].filter(d => d.value > 0)

  const hasWeeklyData = weeklyStats.some(d => d.count > 0)
  const hasJobData = totalJobs > 0

  // Stats strip
  const statsStrip = [
    {
      label: 'Toplam İş',
      value: totalJobs,
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      label: 'Devam Eden',
      value: activeJobs - pendingOnlyJobs,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: 'Tamamlanan',
      value: totalCompletedJobs,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Bekleyen Onay',
      value: pendingApprovalsCount,
      icon: Clock,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyStats} barSize={28}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 } as any} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Tamamlanan">
                  {weeklyStats.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${240 + i * 8}, ${65 + i * 2}%, ${52 + i}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
            Aktif · Bekleyen Onay · Tamamlanan
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
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-1">
                {donutData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between">
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
          <Card
            key={stat.label}
            className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
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
        ))}
      </div>
    </div>
  )
}
