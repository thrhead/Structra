'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, BarChart2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'

const CostTrendChart = dynamic(() => import("./charts/CostTrendChart"), { ssr: false })
const ProjectStatusChart = dynamic(() => import("./charts/ProjectStatusChart"), { ssr: false })
const WorkloadCostChart = dynamic(() => import("./charts/WorkloadCostChart"), { ssr: false })
const CompletionChart = dynamic(() => import("./charts/CompletionChart"), { ssr: false })

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
            <div className="grid gap-4 md:grid-cols-4 items-center">
                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50 shadow-sm h-full flex flex-col justify-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                            Genel Kâr Marjı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">%{overallProfitMargin?.toFixed(1) || '0.0'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Bütçe vs Gerçekleşen</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/50 shadow-sm h-full flex flex-col justify-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Toplam Proje Değeri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl lg:text-3xl font-bold text-emerald-600">
                            ₺{(trends?.revenue || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Aktif dönem bütçesi</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-100 dark:border-blue-900/50 shadow-sm h-full flex flex-col justify-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-blue-500" />
                            Ortalama İlerleme
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{projectStats.total} İş</div>
                        <p className="text-xs text-muted-foreground mt-1">{projectStats.completed} tanesi tamamlandı</p>
                    </CardContent>
                </Card>

                {/* Yeni Kare, Yuvarlak Yüzdeli Kart */}
                <Card className="aspect-square flex flex-col items-center justify-center relative bg-gradient-to-bl from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full">
                    <CardHeader className="absolute top-2 sm:top-4 left-2 sm:left-4 p-0">
                        <CardTitle className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">Bitirme Oranı</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-0 flex-1 w-full relative mt-4">
                        <div className="relative flex items-center justify-center">
                            <svg className="transform -rotate-90 w-24 h-24 sm:w-28 sm:h-28">
                                <circle cx="50%" cy="50%" r="36%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                <circle 
                                    cx="50%" 
                                    cy="50%" 
                                    r="36%" 
                                    stroke="currentColor" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray="226" 
                                    strokeDashoffset={226 - (projectStats.percentage / 100) * 226} 
                                    strokeLinecap="round" 
                                    className="text-indigo-500 dark:text-indigo-400 drop-shadow-md" 
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    %{projectStats.percentage.toFixed(0)}
                                </span>
                            </div>
                        </div>
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

            <div className="grid gap-6 md:grid-cols-2">
                <WorkloadCostChart data={{ costs: combinedTrendData }} />
                <CompletionChart data={projectStats} />
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
