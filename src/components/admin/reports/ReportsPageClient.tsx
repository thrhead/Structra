'use client'

import { Link } from "@/lib/navigation"
import { ArrowLeft, FileIcon, LayoutDashboard, BarChart3, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import ReportFilters from "@/components/admin/reports/ReportFilters"
import ModernDashboardView from "@/components/admin/reports/ModernDashboardView"
import StrategicView from "@/components/admin/reports/StrategicView"
import TacticalView from "@/components/admin/reports/TacticalView"
import OperationalView from "@/components/admin/reports/OperationalView"
import { Suspense } from "react"

export default function ReportsPageClient({ data, searchParams }: { data: any, searchParams: any }) {
    const router = useRouter()
    const searchParamsHook = useSearchParams()
    const activeTab = data.activeTab

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Analitik</p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-0.5">Raporlar ve Analiz</h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Tüm performans, maliyet ve ekip verileri tek panelde.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/reports/exports">
                        <Button variant="outline" className="gap-2 rounded-xl">
                            <FileIcon className="w-4 h-4" />
                            Dışa Aktar
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 p-4">
                <Suspense fallback={<div className="text-sm text-slate-400">Filtreler yükleniyor...</div>}>
                    <ReportFilters jobs={data.filterJobs} categories={data.filterCategories} />
                </Suspense>
            </div>

            <Tabs 
                value={activeTab === 'overview' ? 'modern' : activeTab} 
                onValueChange={(val) => {
                    const params = new URLSearchParams(searchParamsHook.toString());
                    params.set('tab', val === 'modern' ? 'overview' : val);
                    router.push(`?${params.toString()}`, { scroll: false });
                }}
                className="space-y-6"
            >
                <TabsList className="bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl h-auto gap-1">
                    <TabsTrigger value="modern" className="gap-2 rounded-xl text-xs px-4 py-2"><LayoutDashboard className="w-3.5 h-3.5" /> Genel Bakış</TabsTrigger>
                    <TabsTrigger value="strategic" className="gap-2 rounded-xl text-xs px-4 py-2"><BarChart3 className="w-3.5 h-3.5" /> Stratejik</TabsTrigger>
                    <TabsTrigger value="tactical" className="gap-2 rounded-xl text-xs px-4 py-2"><TrendingUp className="w-3.5 h-3.5" /> Taktiksel</TabsTrigger>
                    <TabsTrigger value="operational" className="gap-2 rounded-xl text-xs px-4 py-2"><Zap className="w-3.5 h-3.5" /> Operasyonel</TabsTrigger>
                </TabsList>

                <TabsContent value="modern" className="animate-in fade-in duration-500">
                    <ModernDashboardView data={data} />
                </TabsContent>

                <TabsContent value="strategic" className="animate-in fade-in duration-500">
                    <StrategicView data={data} />
                </TabsContent>

                <TabsContent value="tactical" className="animate-in fade-in duration-500">
                    <TacticalView data={data} />
                </TabsContent>

                <TabsContent value="operational" className="animate-in fade-in duration-500">
                    <OperationalView data={data} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
