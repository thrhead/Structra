'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
    Activity, 
    Wallet, 
    Users, 
    Clock, 
    BarChart3, 
    MessageSquare,
    Search,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    Briefcase,
    Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from "@/components/ui/progress"
import { Link } from '@/lib/navigation'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// Dynamic charts to avoid SSR hydration issues
const WeeklyStepsChart = dynamic(() => import("./reports/charts/WeeklyStepsChart"), { ssr: false })
const StrategicPulseChart = dynamic(() => import("../charts/strategic-pulse-chart").then(mod => mod.StrategicPulseChart), { ssr: false })

interface AdminDashboardClientProps {
    data: any
}

export default function AdminDashboardClient({ data }: AdminDashboardClientProps) {
    // Check if we are on client side
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!data) return null;

    const {
        activeJobs = 0,
        totalJobs = 0,
        completedJobsToday = 0,
        activeWorkersCount = 0,
        totalWorkers = 0,
        pendingApprovalsCount = 0,
        totalCostToday = 0,
        latestCustomers = [],
        weeklyStats = [],
        strategicTrend = [],
        strategic = {},
        activeTeams = 0
    } = data

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0)
    }

    // Fallback logic for charts
    const stepsData = strategic?.weeklySteps || { 
        currentWeek: weeklyStats || [], 
        previousWeek: [], 
        categories: ['Tamamlanan'] 
    }

    if (!isMounted) return <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">Yükleniyor...</div>;

    return (
        <div className="w-full bg-[#f8fafc] font-sans antialiased min-h-screen pb-12">
            <main className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8">
                {/* 4 KPI Cards */}
                <motion.section 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.05em] text-slate-500 uppercase">AKTİF GÖREV</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeJobs}</h3>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.05em] text-slate-500 uppercase">TOPLAM MALİYET</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(totalCostToday)}</h3>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-slate-950 p-5 rounded-xl border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                        <div className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.05em] text-slate-500 uppercase">SAHA PERSONELİ</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeWorkersCount || totalWorkers}</h3>
                        </div>
                    </Card>

                    <Link href="/admin/approvals" className="block">
                        <Card className={cn(
                            "p-5 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all border",
                            pendingApprovalsCount > 0 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/50" : "bg-white border-slate-200/60 dark:bg-slate-950 dark:border-slate-800"
                        )}>
                            <div className={cn("p-3 rounded-lg", pendingApprovalsCount > 0 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : "bg-slate-50 text-slate-400 dark:bg-slate-900")}>
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.05em] text-slate-500 uppercase">ONAY BEKLEYEN</p>
                                <h3 className={cn("text-2xl font-black", pendingApprovalsCount > 0 ? "text-amber-600" : "text-slate-900 dark:text-white")}>{pendingApprovalsCount}</h3>
                            </div>
                        </Card>
                    </Link>
                </motion.section>

                {/* Main Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* System Pulse Chart */}
                    <Card className="bg-white dark:bg-slate-950 rounded-2xl p-6 border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <BarChart3 className="w-4 h-4 text-indigo-500" /> SİSTEM NABZI
                            </h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Son 14 Gün</span>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                {totalJobs} <span className="text-xs font-normal text-slate-400">Toplam İş Emri</span>
                            </h3>
                        </div>
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-2 text-slate-500">
                                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Yeni İşler (Bugün)
                                </span>
                                <span className="font-bold">{strategicTrend[strategicTrend.length-1]?.intensity || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-2 text-slate-500">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Onaylı Harcamalar
                                </span>
                                <span className="font-bold">{formatCurrency(strategicTrend.reduce((sum: number, day: any) => sum + (day.cost || 0), 0))}</span>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[200px] w-full mt-auto">
                            <StrategicPulseChart data={strategicTrend} />
                        </div>
                    </Card>

                    {/* Operational Summary Bar Chart */}
                    <Card className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-2xl p-6 border-slate-200/60 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Zap className="w-4 h-4 text-indigo-500" /> Operasyonel Verimlilik
                            </h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Bekleyen İşler</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">{(totalJobs || 0) - (completedJobsToday || 0)}</span>
                                    <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600 bg-emerald-50/50">SİSTEM</Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tamamlanan (Bugün)</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">{completedJobsToday}</span>
                                    <span className={cn("text-[10px] font-black", completedJobsToday > 0 ? "text-emerald-500" : "text-slate-400")}>
                                        {completedJobsToday > 0 ? '↑ YENİ' : 'STABİL'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Aktif Ekipler</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">{activeTeams || 0}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Saha</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[300px] w-full">
                            <WeeklyStepsChart 
                                data={stepsData} 
                                categories={stepsData.categories || ['Tamamlanan']} 
                            />
                        </div>
                    </Card>
                </section>
...

                {/* Lower Section: Reports and Customers */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Progress Area */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-2">
                        <Card className="bg-white dark:bg-slate-950 rounded-2xl p-6 border-slate-200/60 dark:border-slate-800 shadow-sm">
                            <h2 className="text-sm font-bold mb-8 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Briefcase className="w-4 h-4 text-indigo-500" /> İş Akış Durumları
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                        <span className="text-slate-500">Devam Eden İşler</span>
                                        <span className="text-indigo-600">%{Math.round((activeJobs / (totalJobs || 1)) * 100)}</span>
                                    </div>
                                    <Progress value={(activeJobs / (totalJobs || 1)) * 100} className="h-1.5 bg-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                        <span className="text-slate-500">Tamamlanan Projeler</span>
                                        <span className="text-emerald-600">%{Math.round((data.strategic?.projectStats?.percentage || (completedJobsToday / (totalJobs || 1)) * 100))}</span>
                                    </div>
                                    <Progress value={data.strategic?.projectStats?.percentage || (completedJobsToday / (totalJobs || 1)) * 100} className="h-1.5 bg-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                        <span className="text-slate-500">Bütçe Kullanım Verimliliği</span>
                                        <span className="text-sky-600">%{data.tactical?.budgetEfficiency?.toFixed(0) || '92'}</span>
                                    </div>
                                    <Progress value={data.tactical?.budgetEfficiency || 92} className="h-1.5 bg-slate-100" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Actions Panel */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-1">
                        <Card className="bg-white dark:bg-slate-950 rounded-2xl p-6 border-slate-200/60 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <Zap className="w-4 h-4 fill-white" />
                                </div>
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Hızlı Özet</h2>
                            </div>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-medium text-slate-500">Toplam Personel</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{data.totalWorkers || activeWorkersCount}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-medium text-slate-500">Bekleyen Onaylar</span>
                                    <span className="text-sm font-black text-amber-600">{pendingApprovalsCount}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-medium text-slate-500">Günlük Maliyet</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(totalCostToday)}</span>
                                </div>
                                <div className="pt-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">SİSTEM TARİHİ</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">
                                        {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </section>

                {/* Customers Table */}
                <motion.section 
                    variants={itemVariants} 
                    initial="hidden" 
                    animate="visible"
                    className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                            <Users className="w-5 h-5 text-indigo-500" /> SON EKLENEN MÜŞTERİLER
                        </h2>
                        <Link href="/admin/customers">
                            <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                                Tümünü Gör <ChevronRight className="w-3 h-3" />
                            </button>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Müşteri / Şirket</th>
                                    <th className="px-6 py-4">İletişim</th>
                                    <th className="px-6 py-4">Adres</th>
                                    <th className="px-6 py-4">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {latestCustomers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                                                    {customer.company.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">{customer.company}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{customer.email}</span>
                                                <span className="text-[10px] text-slate-400">{customer.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[250px]">{customer.address || 'Adres belirtilmemiş'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={customer.isActive ? "success" : "secondary"} className="text-[10px] font-bold uppercase tracking-tighter">
                                                {customer.isActive ? 'AKTİF' : 'PASİF'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                                {latestCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Kayıtlı müşteri bulunamadı.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            </main>

            {/* Quick Add FAB */}
            <div className="fixed bottom-8 right-8 z-50">
                <Link href="/admin/jobs/create">
                    <button className="bg-indigo-600 text-white h-14 w-14 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                        <Zap className="w-6 h-6 fill-white group-hover:animate-pulse" />
                    </button>
                </Link>
            </div>
        </div>
    )
}
