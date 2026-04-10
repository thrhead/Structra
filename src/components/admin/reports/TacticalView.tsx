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
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            Bütçe Verimliliği
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">%{budgetEfficiency.toFixed(1)}</div>
                        <Progress value={budgetEfficiency} className="h-1.5 mt-2 bg-blue-100" />
                        <p className="text-[10px] text-muted-foreground mt-2 text-right">Planlanan vs Gerçekleşen Tasarruf</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900 border-orange-100 dark:border-orange-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-500" />
                            Ortalama Ekip Yükü
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">%{avgTeamLoad.toFixed(1)}</div>
                        <Progress value={avgTeamLoad} className="h-1.5 mt-2 bg-orange-100" />
                        <p className="text-[10px] text-muted-foreground mt-2 text-right">Kapasite kullanım oranı</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" />
                            Aktif Ekipler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">{teamCapacity.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Saha operasyonundaki ekip sayısı</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden">
                    <CardHeader><CardTitle>Kategori Bazlı Harcama Dağılımı</CardTitle></CardHeader>
                    <CardContent className="h-[350px] p-0 pb-4">
                        <CategoryPieChart data={Object.entries(costBreakdown).map(([name, value]) => ({ name, value: value as number }))} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader><CardTitle>Ekip Verimlilik Analizi</CardTitle></CardHeader>
                    <CardContent className="h-[350px] p-0 pb-4">
                        <TeamPerformanceChart data={teamCapacity.map((t: any) => ({ name: t.teamName, jobs: t.activeJobsCount, load: t.loadFactor }))} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Bütçe Sapma Analizi (Tamamlanan İşler)</CardTitle></CardHeader>
                <CardContent className="max-h-[400px] overflow-auto">
                    <div className="space-y-4">
                        {varianceData.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1.5 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{item.title}</span>
                                    <span className={item.variance >= 0 ? "text-emerald-600" : "text-rose-600"}>
                                        {item.variance >= 0 ? '+' : ''}{item.variance.toLocaleString()} ₺
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                                    <span>Bütçe: ₺{item.budget.toLocaleString()}</span>
                                    <span>Gerçek: ₺{item.actualCost.toLocaleString()}</span>
                                </div>
                                <Progress 
                                    value={item.budget > 0 ? (item.actualCost / item.budget) * 100 : 0} 
                                    className={cn("h-1.5", item.variance >= 0 ? "bg-emerald-100" : "bg-rose-100")}
                                />
                            </div>
                        ))}
                        {varianceData.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">Veri bulunamadı</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

import { cn } from "@/lib/utils"
