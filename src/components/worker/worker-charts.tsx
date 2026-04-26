'use client'

import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Zap, TrendingUp } from 'lucide-react'
import { format, subDays, isSameDay, startOfDay } from 'date-fns'
import { tr } from 'date-fns/locale'

interface WorkerChartsProps {
  jobs: any[]
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#94a3b8',
  MEDIUM: '#6366f1',
  HIGH: '#f59e0b',
  URGENT: '#ef4444'
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Düşük',
  MEDIUM: 'Orta',
  HIGH: 'Yüksek',
  URGENT: 'Acil'
}

export function WorkerCharts({ jobs }: WorkerChartsProps) {
  // 1. Calculate Performance Trend (Completed steps in last 7 days)
  const performanceData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date,
        name: format(date, 'EEE', { locale: tr }),
        count: 0
      }
    })

    jobs.forEach(job => {
      job.steps?.forEach((step: any) => {
        if (step.isCompleted && step.completedAt) {
          const completedDate = new Date(step.completedAt)
          const dayIndex = days.findIndex(d => isSameDay(d.date, completedDate))
          if (dayIndex !== -1) {
            days[dayIndex].count += 1
          }
        }
      })
    })

    return days
  }, [jobs])

  // 2. Calculate Task Distribution (By Priority)
  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0
    }

    jobs.filter(j => j.status !== 'COMPLETED').forEach(job => {
      if (counts[job.priority] !== undefined) {
        counts[job.priority] += 1
      }
    })

    return Object.entries(counts)
      .map(([priority, value]) => ({
        name: PRIORITY_LABELS[priority] || priority,
        value,
        priority
      }))
      .filter(d => d.value > 0)
  }, [jobs])

  const hasPerformanceData = performanceData.some(d => d.count > 0)
  const hasDistributionData = distributionData.length > 0

  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 mt-6">
      {/* ── Performance Trend ── */}
      <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Performans Trendi
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Son 7 günde tamamlanan adımlar
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {hasPerformanceData ? (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                  />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    fill="#6366f1"
                    barSize={24}
                  >
                    {performanceData.map((entry, i) => (
                      <Cell 
                        key={i} 
                        fill={isSameDay(entry.date, new Date()) ? '#4f46e5' : '#818cf8'} 
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-700">
              <CheckCircle2 className="w-10 h-10 opacity-20" />
              <p className="text-xs font-medium italic">Henüz veri yok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Task Distribution ── */}
      <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Görev Dağılımı
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Aktif işlerin öncelik durumu
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {hasDistributionData ? (
            <div className="flex items-center gap-4">
              <div className="h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map((entry, i) => (
                        <Cell key={i} fill={PRIORITY_COLORS[entry.priority]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {distributionData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: PRIORITY_COLORS[item.priority] }}
                      />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-700">
              <Zap className="w-10 h-10 opacity-20" />
              <p className="text-xs font-medium italic">Aktif iş bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
