'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, BarChart2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'

const CostTrendChart = dynamic(() => import("./charts/CostTrendChart"), { ssr: false })
const ProjectStatusChart = dynamic(() => import("./charts/ProjectStatusChart"), { ssr: false })

export default function StrategicView({ data }: { data: any }) {
    if (!data) return null;

    const { 
        overallProfitMargin = 0, 
        topCustomersByProfit = [], 
        projectStats = { total: 0, completed: 0, percentage: 0 },
        jobStatusStats = [],
        trends = { costs: [], revenue: [] } 
    } = data || {};

    // Combine revenue and cost for a unified trend chart
    const combinedTrendData = useMemo(() => {
        const costMap: any = {};
        trends.costs.forEach((c: any) => costMap[c.date] = c.amount || Object.values(c).filter(v => typeof v === 'number').reduce((a:any, b:any) => a + b, 0));
        
        const allDates = Array.from(new Set([...trends.costs.map((c: any) => c.date), ...trends.revenue.map((r: any) => r.date)]));
        
        return allDates.sort().map(date => {
            const revenue = trends.revenue.find((r: any) => r.date === date)?.amount || 0;
            const cost = costMap[date] || 0;
            return {
                date,
                Gelir: revenue,
                Maliyet: cost,
                Kâr: revenue - cost
            };
        });
    }, [trends]);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                            Genel Kâr Marjı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">%{overallProfitMargin?.toFixed(1) || '0.0'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Bütçe vs Gerçekleşen Maliyet</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Toplam Proje Değeri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                            ₺{(trends?.revenue || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Aktif dönem toplam bütçesi</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-blue-500" />
                            Tamamlanma Oranı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">%{projectStats.percentage.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{projectStats.completed} / {projectStats.total} Proje tamamlandı</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden">
                    <CardHeader><CardTitle>Gelir & Maliyet Analizi</CardTitle></CardHeader>
                    <CardContent className="h-[350px] p-0 pb-4">
                        <CostTrendChart data={combinedTrendData} categories={['Gelir', 'Maliyet', 'Kâr']} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader><CardTitle>Proje Durum Dağılımı</CardTitle></CardHeader>
                    <CardContent className="h-[350px] p-0 pb-4">
                        <ProjectStatusChart data={jobStatusStats} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>En Kârlı Müşteriler</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Müşteri</TableHead>
                                <TableHead className="text-right">Toplam Bütçe</TableHead>
                                <TableHead className="text-right">Net Kâr</TableHead>
                                <TableHead className="text-center">Marj</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topCustomersByProfit.map((customer: any, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{customer.customer}</TableCell>
                                    <TableCell className="text-right">₺{customer.budget.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-emerald-600 font-bold">₺{customer.profit.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={customer.profitMargin > 20 ? "success" : "secondary"}>
                                            %{customer.profitMargin.toFixed(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
