'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, BarChart2, ArrowUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'

const CostTrendChart = dynamic(() => import("./charts/CostTrendChart"), { ssr: false })
const ProjectStatusChart = dynamic(() => import("./charts/ProjectStatusChart"), { ssr: false })
const WorkloadCostChart = dynamic(() => import("./charts/WorkloadCostChart"), { ssr: false })
const CompletionChart = dynamic(() => import("./charts/CompletionChart"), { ssr: false })
const StrategicPulseChart = dynamic(() => import("./charts/StrategicPulseChart"), { ssr: false })

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: 'indigo' | 'emerald' | 'blue';
}) {
  const colors = {
    indigo: {
      icon: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40',
      value: 'text-indigo-700 dark:text-indigo-300',
      glow: 'hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20',
    },
    emerald: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
      value: 'text-emerald-700 dark:text-emerald-300',
      glow: 'hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20',
    },
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40',
      value: 'text-blue-700 dark:text-blue-300',
      glow: 'hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20',
    },
  }[accent];

  return (
    <Card className={`group rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl ${colors.glow} hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between`}>
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-2xl border ${colors.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-4 h-4 ${colors.icon}`} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">{label}</p>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className={`text-3xl font-bold tabular-nums tracking-tight ${colors.value} leading-none`}>{value}</div>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Chart Card ──────────────────────────────────────────────────────────────
function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40 transition-all duration-300 ${className}`}>
      <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">{title}</CardTitle>
      </CardHeader>
      {children}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StrategicView({ data }: { data: any }) {
    if (!data) return null;

    const {
        overallProfitMargin = 0,
        topCustomersByProfit = [],
        projectStats = { total: 0, completed: 0, percentage: 0 },
        jobStatusStats = [],
        slaCompliance = 0,
        resourceUtilization = 0,
        revenuePerJob = 0,
        categoryTotals = 0,
        trends = { costs: [], revenue: [] }
    } = data || {};

    const combinedTrendData = useMemo(() => {
        const costMap: any = {};
        trends.costs.forEach((c: any) => costMap[c.date] = c.amount || Object.values(c).filter(v => typeof v === 'number').reduce((a: any, b: any) => a + b, 0));
        const allDates = Array.from(new Set([...trends.costs.map((c: any) => c.date), ...trends.revenue.map((r: any) => r.date)]));
        return allDates.sort().map(date => {
            const revenue = trends.revenue.find((r: any) => r.date === date)?.amount || 0;
            const cost = costMap[date] || 0;
            return { date, Gelir: revenue, Maliyet: cost, Kâr: revenue - cost };
        });
    }, [trends]);

    const totalRevenue = (trends?.revenue || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    return (
        <div className="space-y-6 animate-page-enter">
            {/* ─── Header Stats Row ─── */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-children">
                <StatCard
                    icon={TrendingUp}
                    label="Genel Kâr Marjı"
                    value={`%${overallProfitMargin?.toFixed(1) || '0.0'}`}
                    sub="Bütçe vs Gerçekleşen"
                    accent="indigo"
                />
                <StatCard
                    icon={DollarSign}
                    label="Toplam Proje Değeri"
                    value={`₺${totalRevenue.toLocaleString('tr-TR')}`}
                    sub="Aktif dönem bütçesi"
                    accent="emerald"
                />
                <StatCard
                    icon={BarChart2}
                    label="Toplam İş"
                    value={projectStats.total}
                    sub={`${projectStats.completed} tanesi tamamlandı`}
                    accent="blue"
                />

                <StatCard
                    icon={BarChart2}
                    label="Toplam Kategori"
                    value={categoryTotals}
                    sub="Maliyet kalemleri"
                    accent="indigo"
                />
            </div>

            {/* ─── Strategic Pulse Row ─── */}
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ChartCard title="Stratejik Nabız (İş Yoğunluğu & Harcama)">
                        <CardContent className="h-[360px] p-0 pb-4">
                            <StrategicPulseChart data={combinedTrendData} />
                        </CardContent>
                    </ChartCard>
                </div>
                <div className="grid gap-4 content-start">
                    <StatCard
                        icon={TrendingUp}
                        label="SLA Uyumluluğu"
                        value={`%${slaCompliance.toFixed(1)}`}
                        sub="Zamanında bitirme oranı"
                        accent="emerald"
                    />
                    <StatCard
                        icon={BarChart2}
                        label="Kaynak Kullanımı"
                        value={`%${resourceUtilization.toFixed(1)}`}
                        sub="Aktif iş gücü oranı"
                        accent="blue"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="İş Başına Gelir"
                        value={`₺${revenuePerJob.toLocaleString('tr-TR')}`}
                        sub="Ortalama proje bütçesi"
                        accent="indigo"
                    />
                </div>
            </div>

            {/* ─── Charts Row ─── */}
            <div className="grid gap-5 md:grid-cols-2 stagger-children">
                <ChartCard title="Gelir & Maliyet Analizi">
                    <CardContent className="h-[320px] p-0 pb-4">
                        <CostTrendChart data={combinedTrendData} categories={['Gelir', 'Maliyet', 'Kâr']} />
                    </CardContent>
                </ChartCard>

                <ChartCard title="Proje Durum Dağılımı">
                    <CardContent className="h-[320px] p-0 pb-4">
                        <ProjectStatusChart data={jobStatusStats} />
                    </CardContent>
                </ChartCard>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <WorkloadCostChart data={{ costs: combinedTrendData }} />
                <CompletionChart data={projectStats} />
            </div>

            {/* ─── Customer Table ─── */}
            <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">En Kârlı Müşteriler</CardTitle>
                    <Badge className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-0 rounded-lg">
                        {topCustomersByProfit.length} müşteri
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800/50">
                                <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Müşteri</TableHead>
                                <TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Toplam Bütçe</TableHead>
                                <TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Net Kâr</TableHead>
                                <TableHead className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Marj</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topCustomersByProfit.map((customer: any, idx: number) => (
                                <TableRow key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150 border-b border-slate-100/60 dark:border-slate-800/30 last:border-0">
                                    <TableCell className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200 text-sm">{customer.customer}</TableCell>
                                    <TableCell className="px-5 py-3.5 text-right text-sm text-slate-500 dark:text-slate-400 tabular-nums">₺{customer.budget.toLocaleString('tr-TR')}</TableCell>
                                    <TableCell className="px-5 py-3.5 text-right font-bold tabular-nums text-emerald-600 dark:text-emerald-400 text-sm">₺{customer.profit.toLocaleString('tr-TR')}</TableCell>
                                    <TableCell className="px-5 py-3.5 text-center">
                                        <Badge className={`text-[11px] font-semibold rounded-full px-2.5 border-0 ${customer.profitMargin > 20 ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
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
    );
}
