'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button'
import { useRouter } from '@/lib/navigation'
import { Link } from '@/lib/navigation'

export default function OperationalView({ data }: { data: any }) {
    const router = useRouter();
    if (!data) return null;

    const { 
        jobStatusDist = {}, 
        topBottlenecks = [], 
        pendingApprovals = { costs: 0, steps: 0, delayedCosts: 0, delayedSteps: 0, totalDelayed: 0 }, 
        bottleneckScore = 0 
    } = data || {};

    const safePendingApprovals = pendingApprovals || { costs: 0, steps: 0, delayedCosts: 0, delayedSteps: 0, totalDelayed: 0 };
    const safeJobStatusDist = jobStatusDist || {};
    const totalPending = (safePendingApprovals.costs || 0) + (safePendingApprovals.steps || 0);
    const totalDelayed = safePendingApprovals.totalDelayed || 0;

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-children">
                <Card
                    className={`group rounded-3xl border ${totalDelayed > 0 ? 'border-rose-100/80 dark:border-rose-900/30 shadow-rose-500/5' : 'border-yellow-100/80 dark:border-yellow-900/30'} bg-white dark:bg-slate-900/80 shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300`}
                    onClick={() => router.push('/admin/approvals?filter=delayed')}
                >
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-2xl ${totalDelayed > 0 ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40' : 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/40'} group-hover:scale-110 transition-transform duration-300`}>
                                <AlertTriangle className={`w-4 h-4 ${totalDelayed > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">Kritik Gecikmeler</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className={`text-3xl font-bold tabular-nums ${totalDelayed > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-yellow-700 dark:text-yellow-300'}`}>{totalDelayed}</div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{totalPending} toplam bekleyen onay</p>
                    </CardContent>
                </Card>

                <Card className="group rounded-3xl border border-blue-100/80 dark:border-blue-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">Darboğaz Skoru</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-blue-700 dark:text-blue-300">%{Number(bottleneckScore || 0).toFixed(0)}</div>
                        <Progress value={bottleneckScore || 0} className="mt-2 h-1 bg-blue-100 dark:bg-blue-950/60" />
                    </CardContent>
                </Card>

                <Card className="group rounded-3xl border border-emerald-100/80 dark:border-emerald-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">Tamamlanan İşler</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{safeJobStatusDist.COMPLETED || 0}</div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Seçili periyotta tamamlanan</p>
                    </CardContent>
                </Card>

                <Card className="group rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5">
                        <div className="p-2 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">Aktif İş Akışı</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">{safeJobStatusDist.IN_PROGRESS || 0}</div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Şu an sahada devam eden</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-rose-500" />
                        Kritik Darboğazlar (En Yüksek Gecikme)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800/50">
                                <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">İş No / Başlık</TableHead>
                                <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tahmini Süre</TableHead>
                                <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gerçek Süre</TableHead>
                                <TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gecikme</TableHead>
                                <TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Aksiyon</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topBottlenecks.map((job: any, i: number) => (
                                <TableRow key={i} className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150 border-b border-slate-100/60 dark:border-slate-800/30 last:border-0">
                                    <TableCell className="px-5 py-3.5">
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{job.jobNo}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate w-48">{job.title}</div>
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">{job.estimatedDuration} dk</TableCell>
                                    <TableCell className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">{job.actualDuration.toFixed(0)} dk</TableCell>
                                    <TableCell className="px-5 py-3.5 text-right text-rose-600 dark:text-rose-400 font-bold text-sm tabular-nums">+{job.delay.toFixed(0)} dk</TableCell>
                                    <TableCell className="px-5 py-3.5 text-right">
                                        <Link href={`/admin/jobs/${job.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2 text-xs">
                                                İncele <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {topBottlenecks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500">Kritik gecikme tespit edilmedi.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-5 md:grid-cols-2">
                <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Durum Dağılım Analizi</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 py-4">
                        <div className="space-y-4">
                            {Object.entries(safeJobStatusDist || {}).map(([status, count]: [string, any], i: number) => {
                                const total = Object.values(jobStatusDist).reduce((a: any, b: any) => a + b, 0) as number;
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">{status}</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{count} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <Progress value={percentage} className="h-1 bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kritik Uyarılar & SLA Kontrolü</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 py-4">
                        <div className="space-y-3">
                            {totalDelayed > 0 ? (
                                <Link href="/admin/approvals?filter=delayed" className="block">
                                    <div className="flex items-start gap-4 p-3.5 rounded-2xl border bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-700 transition-all group">
                                        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-bold text-rose-700 dark:text-rose-300 text-sm flex justify-between items-center">
                                                Gecikmiş Onaylar (&gt;48s)
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5">Sistemde 48 saati aşan {totalDelayed} adet bekleyen onay bulunuyor.</p>
                                        </div>
                                    </div>
                                </Link>
                            ) : totalPending > 0 ? (
                                <Link href="/admin/approvals" className="block">
                                    <div className="flex items-start gap-4 p-3.5 rounded-2xl border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/40 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all group">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-bold text-yellow-700 dark:text-yellow-300 text-sm flex justify-between items-center">
                                                Bekleyen Onaylar
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-xs text-yellow-600/80 dark:text-yellow-400/70 mt-0.5">Sistemde onay bekleyen {totalPending} adet kayıt bulunuyor.</p>
                                        </div>
                                    </div>
                                </Link>
                            ) : null}
                            
                            {topBottlenecks.length > 0 && (
                                <div className="flex items-start gap-4 p-3.5 rounded-2xl border bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-blue-700 dark:text-blue-300 text-sm">Gecikme Analizi</div>
                                        <p className="text-xs text-blue-600/80 dark:text-blue-400/70 mt-0.5">{topBottlenecks.length} iş planlanan sürenin üzerinde seyrediyor.</p>
                                    </div>
                                </div>
                            )}
                            {totalPending === 0 && topBottlenecks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500 gap-2">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
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
