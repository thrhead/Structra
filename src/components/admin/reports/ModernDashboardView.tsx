'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
    TrendingUp, 
    TrendingDown, 
    ArrowUpRight, 
    Download, 
    Search,
    Wallet,
    Users,
    Activity,
    BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Charts are loaded dynamically to avoid SSR issues
const WeeklyStepsChart = dynamic(() => import("./charts/WeeklyStepsChart"), { ssr: false })

interface ModernDashboardViewProps {
    data: any
}

export default function ModernDashboardView({ data }: ModernDashboardViewProps) {
    const { 
        generalStats = { totalJobs: 0, pendingJobs: 0, inProgressJobs: 0, completedJobs: 0, totalCost: 0, pendingApprovals: 0 },
        jobDistribution = {},
        teamPerformance = []
    } = data || {}

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Profit/Revenue Card (Blue) */}
                <Card className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-16 h-16 text-blue-500" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.05em] text-blue-600 dark:text-blue-400 uppercase mb-2">TOPLAM MALİYET</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                            {formatCurrency(generalStats.totalCost)}
                        </h2>
                        <span className="text-emerald-500 text-xs font-bold flex items-center">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                            +2.4%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Onaylanmış harcamalar toplamı</p>
                </Card>

                {/* Active Jobs Card (Green) */}
                <Card className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.05em] text-emerald-600 dark:text-emerald-400 uppercase mb-2">TAMAMLANAN İŞLER</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                            {generalStats.completedJobs}
                        </h2>
                        <span className="text-muted-foreground text-xs font-bold flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            Stabil
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Toplam {generalStats.totalJobs} iş arasından</p>
                </Card>

                {/* Team Stats Card (Purple) */}
                <Card className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-purple-500" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.05em] text-purple-600 dark:text-purple-400 uppercase mb-2">BEKLEYEN ONAYLAR</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400">
                            {generalStats.pendingApprovals}
                        </h2>
                        <span className="text-rose-500 text-xs font-bold flex items-center">
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            +1
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">İncelenmesi gereken maliyet kalemleri</p>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Chart Area */}
                <Card className="lg:col-span-2 bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Haftalık Performans Trendi</h3>
                            <p className="text-xs text-muted-foreground">Tamamlanan adım sayıları bazında analiz</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bu Hafta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Geçen Hafta</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <WeeklyStepsChart />
                    </div>
                </Card>

                {/* Team Performance List */}
                <Card className="bg-white dark:bg-slate-950 rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold">Ekip Performansı</h3>
                        <p className="text-xs text-muted-foreground">İş tamamlama ve verimlilik sıralaması</p>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase">EKİP</th>
                                    <th className="px-6 py-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase text-right">İŞ</th>
                                    <th className="px-6 py-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase text-center">SKOR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {teamPerformance.slice(0, 5).map((team: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                    {team.teamName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold">{team.teamName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold">{team.totalJobs}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex px-2 py-0.5 rounded-full text-[10px] font-black",
                                                idx === 0 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                            )}>
                                                {Math.round(team.efficiency)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
