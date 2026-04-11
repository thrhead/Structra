'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, Users, Zap, Target } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Progress } from "@/components/ui/progress"

const TeamPerformanceChart = dynamic(() => import("./charts/TeamPerformanceChart"), { ssr: false })
const CategoryPieChart = dynamic(() => import("./charts/CategoryPieChart"), { ssr: false })

export default function TacticalView({ data }: { data: any }) {
    if (!data) return null;

    const { teamCapacity = [], varianceData = [], costBreakdown = {}, budgetEfficiency = 0, avgTeamLoad = 0 } = data || {};

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="grid gap-4 md:grid-cols-3 stagger-children">
                <Card className="group rounded-3xl border border-blue-100/80 dark:border-blue-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Bütçe Verimliliği</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-blue-700 dark:text-blue-300">%{budgetEfficiency.toFixed(1)}</div>
                        <Progress value={budgetEfficiency} className="h-1 mt-3 bg-blue-100 dark:bg-blue-950/60" />
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Planlanan vs Gerçekleşen Tasarruf</p>
                    </CardContent>
                </Card>

                <Card className="group rounded-3xl border border-orange-100/80 dark:border-orange-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Ortalama Ekip Yükü</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-orange-700 dark:text-orange-300">%{avgTeamLoad.toFixed(1)}</div>
                        <Progress value={avgTeamLoad} className="h-1 mt-3 bg-orange-100 dark:bg-orange-950/60" />
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Kapasite kullanım oranı</p>
                    </CardContent>
                </Card>

                <Card className="group rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Aktif Ekipler</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">{teamCapacity.length}</div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Saha operasyonundaki ekip sayısı</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kategori Bazlı Harcama Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-0 pb-4">
                        <CategoryPieChart data={Object.entries(costBreakdown).map(([name, value]) => ({ name, value: value as number }))} />
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ekip Verimlilik Analizi</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-0 pb-4">
                        <TeamPerformanceChart data={teamCapacity.map((t: any) => ({ name: t.teamName, jobs: t.activeJobsCount, load: t.loadFactor }))} />
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bütçe Sapma Analizi (Tamamlanan İşler)</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[380px] overflow-auto px-5 py-4">
                    <div className="space-y-3">
                        {varianceData.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-2 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150">
                                <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <span>{item.title}</span>
                                    <span className={item.variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                                        {item.variance >= 0 ? '+' : ''}{item.variance.toLocaleString('tr-TR')} ₺
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    <span>Bütçe: ₺{item.budget.toLocaleString('tr-TR')}</span>
                                    <span>Gerçek: ₺{item.actualCost.toLocaleString('tr-TR')}</span>
                                </div>
                                <Progress
                                    value={item.budget > 0 ? (item.actualCost / item.budget) * 100 : 0}
                                    className={cn("h-1", item.variance >= 0 ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-rose-100 dark:bg-rose-950/40")}
                                />
                            </div>
                        ))}
                        {varianceData.length === 0 && (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">Veri bulunamadı</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

import { cn } from "@/lib/utils"
