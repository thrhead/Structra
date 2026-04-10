'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Progress } from "@/components/ui/progress"
import { useRouter } from '@/lib/navigation'
import { Link } from '@/lib/navigation'

export default function OperationalView({ data }: { data: any }) {
    const router = useRouter();
    if (!data) return null;

    const { 
        jobStatusDist = {}, 
        topBottlenecks = [], 
        pendingApprovals = { costs: 0, steps: 0 }, 
        bottleneckScore = 0 
    } = data || {};

    const safePendingApprovals = pendingApprovals || { costs: 0, steps: 0 };
    const safeJobStatusDist = jobStatusDist || {};
    const totalPending = (safePendingApprovals.costs || 0) + (safePendingApprovals.steps || 0);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card 
                    className="border-l-4 border-l-yellow-500 cursor-pointer hover:bg-yellow-50/50 dark:hover:bg-yellow-950/10 transition-colors group"
                    onClick={() => router.push('/admin/approvals')}
                >
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            Bekleyen Onaylar
                        </CardTitle>
                        <ArrowRight className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalPending}</div>
                        <p className="text-xs text-muted-foreground mt-1">{safePendingApprovals.costs || 0} Maliyet, {safePendingApprovals.steps || 0} Adım</p>
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
                        <div className="text-3xl font-bold text-blue-600">%{Number(bottleneckScore || 0).toFixed(0)}</div>
                        <Progress value={bottleneckScore || 0} className="mt-2 h-2" />
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
                        <div className="text-3xl font-bold text-emerald-600">{safeJobStatusDist.COMPLETED || 0}</div>
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
                        <div className="text-3xl font-bold text-indigo-600">{safeJobStatusDist.IN_PROGRESS || 0}</div>
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
                                <TableHead className="text-right">Aksiyon</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topBottlenecks.map((job: any, i: number) => (
                                <TableRow key={i} className="group hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell>
                                        <div className="font-semibold">{job.jobNo}</div>
                                        <div className="text-xs text-muted-foreground truncate w-48">{job.title}</div>
                                    </TableCell>
                                    <TableCell>{job.estimatedDuration} dk</TableCell>
                                    <TableCell>{job.actualDuration.toFixed(0)} dk</TableCell>
                                    <TableCell className="text-right text-red-600 font-bold">+{job.delay.toFixed(0)} dk</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/jobs/${job.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                İncele <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {topBottlenecks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Kritik gecikme tespit edilmedi.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Durum Dağılım Analizi</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(safeJobStatusDist || {}).map(([status, count]: [string, any], i: number) => {
                                const total = Object.values(jobStatusDist).reduce((a: any, b: any) => a + b, 0) as number;
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                return (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium">{status}</span>
                                            <span className="font-bold">{count} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <Progress value={percentage} className="h-1.5" />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Kritik Uyarılar & SLA Kontrolü</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {totalPending > 0 && (
                                <Link href="/admin/approvals" className="block">
                                    <div className="flex items-start gap-4 p-3 rounded-lg border bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 hover:border-red-300 transition-all group">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-bold text-red-700 flex justify-between items-center">
                                                Gecikmiş Onaylar
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-red-600/80">Sistemde onay bekleyen {totalPending} adet kayıt bulunuyor.</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {topBottlenecks.length > 0 && (
                                <div className="flex items-start gap-4 p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/50">
                                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-yellow-700">Gecikme Uyarısı</div>
                                        <p className="text-sm text-yellow-600/80">{topBottlenecks.length} iş planlanan sürenin üzerinde seyrediyor.</p>
                                    </div>
                                </div>
                            )}
                            {totalPending === 0 && topBottlenecks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    <p className="text-sm font-medium">Tüm operasyonlar SLA sınırları dahilinde.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

import { Button } from '@/components/ui/button'
