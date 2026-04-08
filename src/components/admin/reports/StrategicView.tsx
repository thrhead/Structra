'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, PieChart as PieChartIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'

const CostTrendChart = dynamic(() => import("./charts/CostTrendChart"), { ssr: false })
const CategoryPieChart = dynamic(() => import("./charts/CategoryPieChart"), { ssr: false })

export default function StrategicView({ data }: { data: any }) {
    if (!data) return null;

    const { overallProfitMargin = 0, topCustomersByProfit = [], trends = { costs: [], revenue: [] } } = data || {};

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
                        <p className="text-xs text-muted-foreground mt-1">Geçmiş dönem bütçe/maliyet analizi</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Aktif Proje Değeri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                            ₺{(trends?.revenue || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Sözleşme/Bütçe bazlı toplam değer</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            Kilit Müşteriler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{(topCustomersByProfit || []).length}</div>
                        <p className="text-xs text-muted-foreground mt-1">En yüksek kârlılığa sahip partnerler</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Gelir vs Maliyet Trendi</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        {/* CostTrendChart reusable but we might want to overlay revenue here */}
                        <CostTrendChart data={trends?.costs || []} categories={['Maliyet']} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>En Kârlı Müşteriler</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Müşteri</TableHead>
                                    <TableHead className="text-right">Kâr</TableHead>
                                    <TableHead className="text-right">Marj</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topCustomersByProfit.map((c: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{c.customer}</TableCell>
                                        <TableCell className="text-right text-emerald-600">₺{c.profit.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={c.profitMargin > 20 ? "default" : "secondary"}>
                                                %{c.profitMargin.toFixed(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
