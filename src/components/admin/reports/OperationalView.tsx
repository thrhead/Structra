'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Progress } from "@/components/ui/progress"

export default function OperationalView({ data }: { data: any }) {
    if (!data) return null;

    const { jobStatusDist, topBottlenecks, pendingApprovals, bottleneckScore } = data;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            Bekleyen Onaylar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingApprovals.costs + pendingApprovals.steps}</div>
                        <p className="text-xs text-muted-foreground mt-1">{pendingApprovals.costs} Maliyet, {pendingApprovals.steps} Adım</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Darboğaz Skoru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">%{bottleneckScore.toFixed(0)}</div>
                        <Progress value={bottleneckScore} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Tamamlanan İşler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">{jobStatusDist.COMPLETED || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Seçili periyotta tamamlanan</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            Aktif İş Akışı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">{jobStatusDist.IN_PROGRESS || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Şu an sahada devam eden</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-red-500" />
                        Kritik Darboğazlar (En Yüksek Gecikme)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>İş No / Başlık</TableHead>
                                <TableHead>Tahmini Süre</TableHead>
                                <TableHead>Gerçek Süre</TableHead>
                                <TableHead className="text-right">Gecikme (Dakika)</TableHead>
                                <TableHead className="text-right">Durum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topBottlenecks.map((job: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="font-semibold">{job.jobNo}</div>
                                        <div className="text-xs text-muted-foreground truncate w-48">{job.title}</div>
                                    </TableCell>
                                    <TableCell>{job.estimatedDuration} dk</TableCell>
                                    <TableCell>{job.actualDuration.toFixed(0)} dk</TableCell>
                                    <TableCell className="text-right text-red-600 font-bold">+{job.delay.toFixed(0)} dk</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="destructive">Gecikmeli</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Günlük İş Dağılımı</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(jobStatusDist).map(([status, count]: [string, any], i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{status}</span>
                                    <div className="flex items-center gap-2 flex-1 mx-4">
                                        <Progress value={(count / (Object.values(jobStatusDist).reduce((a: any, b: any) => a + b, 0) as number) * 100)} className="h-2" />
                                    </div>
                                    <span className="text-sm font-bold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Kritik Uyarılar & SLA Kontrolü</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg border bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <div className="font-bold text-red-700">Gecikmiş Onaylar</div>
                                    <p className="text-sm text-red-600/80">48 saatten uzun süredir bekleyen 3 maliyet onayı bulunuyor.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/50">
                                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <div className="font-bold text-yellow-700">Yüksek İş Yükü Bildirimi</div>
                                    <p className="text-sm text-yellow-600/80">Teknik ekibinin doluluk oranı %95'e ulaştı.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
