'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BarChart3, Wallet, TrendingDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Progress } from "@/components/ui/progress"
import VarianceTable from "./VarianceTable"

const CategoryPieChart = dynamic(() => import("./charts/CategoryPieChart"), { ssr: false })

export default function TacticalView({ data }: { data: any }) {
    if (!data) return null;

    const { teamCapacity = [], varianceData = [], costBreakdown = {}, avgTeamLoad = 0 } = data || {};
    const pieChartData = Object.entries(costBreakdown || {}).map(([name, value]) => ({ name, value: value as number }))

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Ortalama Ekip Yükü</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">%{avgTeamLoad.toFixed(1)}</div>
                        <Progress value={avgTeamLoad} className="mt-2 h-2" />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Aktif Ekip Sayısı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teamCapacity.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Toplam Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pieChartData.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Bütçe Verimliliği</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            %{ (varianceData.filter((v: any) => v.variance >= 0).length / (varianceData.length || 1) * 100).toFixed(0) }
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-8">
                    <CardHeader><CardTitle>Bütçe Sapma Analizi (Projected vs Actual)</CardTitle></CardHeader>
                    <CardContent>
                        <VarianceTable data={varianceData} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-4">
                    <CardHeader><CardTitle>Gider Kalemleri (Kategori)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <CategoryPieChart data={pieChartData} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Ekip Kapasite Kullanımı</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamCapacity.map((team: any, i: number) => (
                            <div key={i} className="p-4 border rounded-lg bg-muted/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{team.teamName}</span>
                                    <span className="text-sm text-muted-foreground">{team.activeJobsCount} Aktif İş</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Progress value={team.loadFactor} className="flex-1" />
                                    <span className="text-xs font-bold">%{team.loadFactor.toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
