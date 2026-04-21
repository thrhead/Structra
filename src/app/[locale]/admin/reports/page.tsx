
import { 
    getReportStats, 
    getWeeklyCompletedSteps,
    getJobsListForFilter,
    getCategoriesForFilter,
    getTeamPerformance,
    getStrategicDashboard,
    getTacticalDashboard,
    getOperationalDashboard
} from "@/lib/data/reports"
import ReportsPageClient from "@/components/admin/reports/ReportsPageClient"

export default async function AdminReportsPage(props: {
    searchParams?: Promise<{ from?: string; to?: string; jobStatus?: string; jobId?: string; category?: string; status?: string; tab?: string }>
}) {
    const searchParams = await props.searchParams;
    const fromStr = searchParams?.from;
    const toStr = searchParams?.to;
    const jobStatus = searchParams?.jobStatus || 'all';
    const jobId = searchParams?.jobId || 'all';
    const category = searchParams?.category || 'all';
    const activeTab = searchParams?.tab || 'overview';

    const from = fromStr ? new Date(fromStr) : new Date(0);
    const to = toStr ? new Date(toStr) : new Date();
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    // Optimized parallel data fetching on the server
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

    const data = {
        ...tabData,
        generalStats: stats,
        filterJobs,
        filterCategories,
        activeTab
    }

    return <ReportsPageClient data={data} searchParams={searchParams} />
}
