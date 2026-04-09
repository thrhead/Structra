'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
    TrendingUp, 
    TrendingDown, 
    ArrowUpRight, 
    Wallet,
    Users,
    Activity,
    CheckCircle2,
    Clock,
    Search,
    MessageSquare,
    BarChart3,
    AlertTriangle,
    ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { Link } from '@/lib/navigation'

const WeeklyStepsChart = dynamic(() => import("./charts/WeeklyStepsChart"), { ssr: false })

interface ModernDashboardViewProps {
    data: any
}

export default function ModernDashboardView({ data }: ModernDashboardViewProps) {
    const { 
        generalStats = { totalJobs: 0, pendingJobs: 0, inProgressJobs: 0, completedJobs: 0, totalCost: 0, pendingApprovals: 0, totalWorkers: 0 },
        teamPerformance = [],
        weeklySteps = { categories: [], currentWeek: [], previousWeek: [] }
    } = data || {}

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
    }

    const totalPending = generalStats.pendingApprovals || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12">
            {/* 4 KPI Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Jobs Card */}
                <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">AKTİF GÖREV</p>
                        <h3 className="text-2xl font-black">{generalStats.inProgressJobs || 0}</h3>
                    </div>
                </Card>

                {/* Total Budget/Cost Card */}
                <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">TOPLAM MALİYET</p>
                        <h3 className="text-2xl font-black">{formatCurrency(generalStats.totalCost || 0)}</h3>
                    </div>
                </Card>

                {/* Field Staff Card */}
                <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-sky-100 dark:border-sky-900/30 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">SAHA PERSONELİ</p>
                        <h3 className="text-2xl font-black">{generalStats.totalWorkers || 0}</h3>
                    </div>
                </Card>

                {/* Pending Approvals Card */}
                <Link href="/admin/approvals" className="block">
                    <Card className={cn(
                        "p-5 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all border",
                        totalPending > 0 ? "bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50" : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800"
                    )}>
                        <div className={cn("p-3 rounded-lg", totalPending > 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-slate-50 dark:bg-slate-900 text-slate-400")}>
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.05em] text-muted-foreground uppercase">ONAY BEKLEYEN</p>
                            <h3 className={cn("text-2xl font-black", totalPending > 0 ? "text-amber-600" : "")}>{totalPending}</h3>
                        </div>
                    </Card>
                </Link>
            </section>

            {/* Main Content Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Pulse (Chart Section) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" /> SİSTEM NABZI
                            </h2>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Haftalık Trend</span>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                {generalStats.completedJobs || 0} <span className="text-xs font-normal text-muted-foreground">İş Tamamlandı</span>
                            </h3>
                        </div>
                        <div className="space-y-3 mb-8 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Bu Hafta Performansı
                                </span>
                                <span className="font-black">%{Math.round(((generalStats.completedJobs || 0) / (generalStats.totalJobs || 1)) * 100)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verimlilik Hedefi
                                </span>
                                <span className="font-black text-emerald-500">85%</span>
                            </div>
                        </div>
                        <div className="h-48 w-full mt-auto">
                            <WeeklyStepsChart data={weeklySteps} categories={weeklySteps.categories} />
                        </div>
                    </Card>
                </div>

                {/* Team Performance Table */}
                <Card className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">Ekip Performansı ve Verimlilik</h3>
                            <p className="text-xs text-muted-foreground">Saha ekiplerinin iş tamamlama metrikleri</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{teamPerformance.length} Ekip</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[500px]">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">EKİP ADI</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase text-right">TOPLAM İŞ</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase text-center">VERİMLİLİK</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase text-center">DURUM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {teamPerformance.slice(0, 10).map((team: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                    {team.teamName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold tracking-tight">{team.teamName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black">{team.totalJobs}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden md:flex">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-1000", 
                                                            team.efficiency > 80 ? "bg-emerald-500" : team.efficiency > 50 ? "bg-blue-500" : "bg-amber-500"
                                                        )} 
                                                        style={{ width: `${Math.min(team.efficiency, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black">{Math.round(team.efficiency)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                team.efficiency > 80 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                                                team.efficiency > 50 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : 
                                                "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                            )}>
                                                {team.efficiency > 80 ? 'Yüksek' : team.efficiency > 50 ? 'Normal' : 'Düşük'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* Critical Alerts Bar */}
            {totalPending > 0 && (
                <Link href="/admin/approvals" className="block">
                    <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 flex items-center justify-between group hover:border-rose-400 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full animate-pulse">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-rose-700 dark:text-rose-400">Kritik SLA Uyarısı: Gecikmiş Onaylar</div>
                                <p className="text-xs text-rose-600/80">Onay bekleyen {totalPending} adet işlem operasyonel hızı yavaşlatıyor.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                            Hemen Çöz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            )}
        </div>
    )
}
