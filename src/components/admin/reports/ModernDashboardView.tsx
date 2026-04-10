'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
    Activity, 
    Wallet, 
    Users, 
    Clock, 
    Search,
    BarChart3,
    MessageSquare,
    ArrowRight,
    AlertTriangle,
    CheckCircle2
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
        <div className="bg-[#f8fafc] dark:bg-slate-950 -m-6 p-8 min-h-screen space-y-8 animate-in fade-in duration-700">
            <style jsx global>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .chart-grid { background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 20px 20px; }
            `}</style>

            {/* 4 KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Active Task */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#e2e8f0] dark:border-slate-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">AKTİF GÖREV</p>
                        <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">{generalStats.inProgressJobs || 0}</h3>
                    </div>
                </div>

                {/* Total Budget */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#e2e8f0] dark:border-slate-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-[#6366f1]/10 text-[#6366f1] rounded-lg">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">TOPLAM MALİYET</p>
                        <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">{formatCurrency(generalStats.totalCost || 0)}</h3>
                    </div>
                </div>

                {/* Field Staff */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#e2e8f0] dark:border-slate-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">SAHA PERSONELİ</p>
                        <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">{generalStats.totalWorkers || 0}</h3>
                    </div>
                </div>

                {/* Pending Approvals */}
                <Link href="/admin/approvals" className="block">
                    <div className={cn(
                        "p-5 rounded-xl border flex items-center gap-4 shadow-sm transition-all",
                        totalPending > 0 ? "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800" : "bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800"
                    )}>
                        <div className={cn("p-3 rounded-lg", totalPending > 0 ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-400")}>
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">ONAY BEKLEYEN</p>
                            <h3 className={cn("text-2xl font-black", totalPending > 0 ? "text-purple-600" : "text-[#0f172a] dark:text-white")}>{totalPending}</h3>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Main Charts & Content */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Pulse */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e2e8f0] dark:border-slate-800 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-bold flex items-center gap-2 text-[#0f172a] dark:text-white uppercase tracking-tighter">
                            <BarChart3 className="w-5 h-5 text-[#6366f1]" /> SİSTEM NABZI
                        </h2>
                        <span className="text-[10px] text-[#64748b] font-bold uppercase">HAFTALIK TREND</span>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-4xl font-black text-[#0f172a] dark:text-white tracking-tighter">
                            {generalStats.completedJobs || 0} <span className="text-xs font-medium text-[#64748b] tracking-normal">İş Bitti</span>
                        </h3>
                    </div>
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-[#64748b] font-medium">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Mevcut Performans
                            </span>
                            <span className="font-black">%{Math.round(((generalStats.completedJobs || 0) / (generalStats.totalJobs || 1)) * 100)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2 text-[#64748b] font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Operasyonel Hedef
                            </span>
                            <span className="font-black text-emerald-500">85%</span>
                        </div>
                    </div>
                    <div className="h-48 w-full mt-auto">
                        <WeeklyStepsChart data={weeklySteps} categories={weeklySteps.categories} />
                    </div>
                </div>

                {/* Team Performance List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b dark:border-slate-800 border-[#e2e8f0] dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black text-[#0f172a] dark:text-white tracking-tighter uppercase">Ekip Performans Matrisi</h3>
                            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mt-1">Gerçek zamanlı verimlilik sıralaması</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#6366f1]/5 rounded-full text-[#6366f1] border border-[#6366f1]/10">
                            <Users className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{teamPerformance.length} AKTİF EKİP</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8fafc] dark:bg-slate-800/50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#64748b] uppercase">EKİP ADI</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#64748b] uppercase text-right">İŞ YÜKÜ</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#64748b] uppercase text-center">VERİMLİLİK</th>
                                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#64748b] uppercase text-center">DURUM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-800">
                                {teamPerformance.slice(0, 10).map((team: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-[#f1f5f9]/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 dark:bg-[#6366f1]/20 flex items-center justify-center text-[10px] font-black text-[#6366f1]">
                                                    {team.teamName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-[#0f172a] dark:text-white tracking-tight">{team.teamName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-[#0f172a] dark:text-white">{team.totalJobs}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-20 h-1.5 bg-[#e2e8f0] dark:bg-slate-800 rounded-full overflow-hidden hidden md:flex shadow-inner">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-1000", 
                                                            team.efficiency > 80 ? "bg-emerald-500" : team.efficiency > 50 ? "bg-[#6366f1]" : "bg-amber-500"
                                                        )} 
                                                        style={{ width: `${Math.min(team.efficiency, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-[#0f172a] dark:text-white">{Math.round(team.efficiency)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                team.efficiency > 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800" : 
                                                team.efficiency > 50 ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800" : 
                                                "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800"
                                            )}>
                                                {team.efficiency > 80 ? 'YÜKSEK' : team.efficiency > 50 ? 'NORMAL' : 'DÜŞÜK'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* SLA Alert Bar */}
            {totalPending > 0 && (
                <Link href="/admin/approvals" className="block animate-pulse">
                    <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 flex items-center justify-between group hover:border-rose-400 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-rose-500 text-white rounded-full">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-tighter">KRİTİK SLA UYARISI: GECİKMİŞ ONAYLAR</div>
                                <p className="text-xs text-rose-600/80 font-medium">Bekleyen {totalPending} adet kayıt operasyonel hızı yavaşlatıyor.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest">
                            Hemen Çöz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            )}
        </div>
    )
}
