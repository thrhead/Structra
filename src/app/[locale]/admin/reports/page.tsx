'use client'

import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BarChart3, TrendingUp, FileIcon, Users, Wallet, Zap, Calendar, Briefcase as BriefcaseIcon, Clock, ChevronRight, LayoutDashboard, UserCog } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    getReportStats, 
    getWeeklyCompletedSteps,
    getJobStatusDistribution,
    getTeamPerformance,
    getJobsListForFilter,
    getCategoriesForFilter,
    getCostBreakdown,
    getCostTrend,
    getTotalCostTrend,
    getPendingCostsList,
    getCostList,
    getStrategicDashboard,
    getTacticalDashboard,
    getOperationalDashboard
} from "@/lib/data/reports"
import StrategicView from "@/components/admin/reports/StrategicView"
import TacticalView from "@/components/admin/reports/TacticalView"
import OperationalView from "@/components/admin/reports/OperationalView"
import ModernDashboardView from "@/components/admin/reports/ModernDashboardView"
import { getAllTeamsSummary, getTeamDetailedReports } from "@/lib/data/teams"
import dynamic from 'next/dynamic'

const WeeklyStepsChart = dynamic(() => import("@/components/admin/reports/charts/WeeklyStepsChart"), { ssr: false, loading: () => <div className="h-[350px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg">Yükleniyor...</div> })
const JobDistributionChart = dynamic(() => import("@/components/admin/reports/charts/JobDistributionChart"), { ssr: false, loading: () => <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg"></div> })
const TeamPerformanceChart = dynamic(() => import("@/components/admin/reports/charts/TeamPerformanceChart"), { ssr: false, loading: () => <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg"></div> })
const CategoryPieChart = dynamic(() => import("@/components/admin/reports/charts/CategoryPieChart"), { ssr: false, loading: () => <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg"></div> })
const CostTrendChart = dynamic(() => import("@/components/admin/reports/charts/CostTrendChart"), { ssr: false, loading: () => <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg"></div> })
const TotalCostChart = dynamic(() => import("@/components/admin/reports/charts/TotalCostChart"), { ssr: false })

import CostListTable from "@/components/admin/reports/CostListTable"
import VarianceTable from "@/components/admin/reports/VarianceTable"
import KPICards from "@/components/admin/reports/KPICards"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Suspense, useState, useEffect } from "react"
import ReportFilters from "@/components/admin/reports/ReportFilters"
import { TeamFinancialCharts } from "@/components/admin/team-financial-charts"
import { TeamPerformanceTrend } from "@/components/admin/team-performance-trend"
import { TeamMemberStats } from "@/components/admin/team-member-stats"
import { cn } from "@/lib/utils"
import { CustomSpinner } from "@/components/ui/custom-spinner"

export default function AdminReportsPage(props: {
    searchParams?: Promise<{ from?: string; to?: string; jobStatus?: string; jobId?: string; category?: string; status?: string; tab?: string }>
}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [selectedTeamId, setSelectedTeamTeamId] = useState<string | null>(null)
    const [teamDetails, setTeamDetails] = useState<any>(null)
    const [loadingTeam, setLoadingTeam] = useState(false)

    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoading(true)
            const searchParams = await props.searchParams;
            const fromStr = searchParams?.from;
            const toStr = searchParams?.to;
            const jobStatus = searchParams?.jobStatus || 'all';
            const jobId = searchParams?.jobId || 'all';
            const category = searchParams?.category || 'all';
            const costStatus = searchParams?.status || 'all';
            const activeTab = searchParams?.tab || 'overview';

            const from = fromStr ? new Date(fromStr) : new Date(0);
            const to = toStr ? new Date(toStr) : new Date();
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);

            try {
                // Shared data needed for layout/filters
                const [filterJobs, filterCategories, stats] = await Promise.all([
                    getJobsListForFilter(jobStatus),
                    getCategoriesForFilter(),
                    getReportStats(from, to, jobStatus, jobId, category)
                ]);

                let tabData: any = {};

                if (activeTab === 'strategic') {
                    tabData = await getStrategicDashboard(from, to);
                } else if (activeTab === 'tactical') {
                    tabData = await getTacticalDashboard(from, to);
                } else if (activeTab === 'operational') {
                    tabData = await getOperationalDashboard(from, to);
                } else {
                    // Default to modern/overview - needs basic performance and weekly steps
                    const [perf, weekly] = await Promise.all([
                        getTeamPerformance(from, to),
                        getWeeklyCompletedSteps()
                    ]);
                    tabData = { teamPerformance: perf, weeklySteps: weekly };
                }

                if (isMounted) {
                    setData({
                        ...tabData,
                        generalStats: stats,
                        filterJobs,
                        filterCategories,
                        activeTab
                    })
                }
            } catch (error) {
                console.error('Error loading reports:', error);
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        load()
        return () => {
            isMounted = false;
        };
    }, [props.searchParams])

    const handleTeamSelect = async (teamId: string) => {
        setLoadingTeam(true)
        setSelectedTeamTeamId(teamId)
        const details = await getTeamDetailedReports(teamId)
        setTeamDetails(details)
        setLoadingTeam(false)
    }

    if (loading || !data) {
        return <div className="p-8 flex items-center justify-center min-h-[400px]">
            <CustomSpinner className="h-8 w-8 animate-spin text-primary" />
        </div>
    }

    const { 
        generalStats = { totalJobs: 0, pendingJobs: 0, inProgressJobs: 0, completedJobs: 0, totalCost: 0, pendingApprovals: 0 }, 
        weeklySteps = { categories: [], currentWeek: [], previousWeek: [] },
        jobDistribution = {}, 
        teamPerformance = [], 
        filterJobs = [], 
        filterCategories = [], 
        costBreakdown = {}, 
        costTrend = { data: [], categories: [] }, 
        totalTrend = [], 
        costList = [], 
        teamsReportData = { reports: [], globalStats: { avgEfficiency: 0, totalExpenses: 0 } }, 
        varianceData = [], 
        activeTab 
    } = data || {}
    const { totalJobs, pendingJobs, inProgressJobs, completedJobs } = generalStats || {}
    const { reports: teamReports, globalStats: teamGlobalStats } = teamsReportData || { reports: [], globalStats: { avgEfficiency: 0, totalExpenses: 0 } }

    // Chart Transforms
    const jobData = Object.entries(jobDistribution || {}).map(([status, count]) => ({ name: status, value: count as number }))
    const teamPerfData = (teamPerformance || []).map((t: any) => ({ name: t.teamName, jobs: t.totalJobs, time: Math.round(t.avgCompletionTimeMinutes) }))
    const pieChartData = Object.entries(costBreakdown || {}).map(([name, value]) => ({ name, value: value as number }))

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Raporlar ve Analiz</h1>
                        <p className="text-muted-foreground">Tüm performans, maliyet ve ekip verileri tek panelde.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/reports/exports">
                        <Button variant="outline" className="gap-2">
                            <FileIcon className="w-4 h-4" />
                            Dışa Aktar
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="p-4 bg-muted/30 border-none shadow-none">
                <Suspense fallback={<div>Filtreler yükleniyor...</div>}>
                    <ReportFilters jobs={filterJobs} categories={filterCategories} />
                </Suspense>
            </Card>

            <Tabs defaultValue={activeTab === 'overview' ? 'modern' : activeTab} className="space-y-6">
                <TabsList className="bg-muted p-1 rounded-lg">
                    <TabsTrigger value="modern" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Genel Bakış</TabsTrigger>
                    <TabsTrigger value="strategic" className="gap-2"><BarChart3 className="w-4 h-4" /> Stratejik</TabsTrigger>
                    <TabsTrigger value="tactical" className="gap-2"><TrendingUp className="w-4 h-4" /> Taktiksel</TabsTrigger>
                    <TabsTrigger value="operational" className="gap-2"><Zap className="w-4 h-4" /> Operasyonel</TabsTrigger>
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