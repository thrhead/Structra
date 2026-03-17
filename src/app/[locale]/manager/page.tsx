import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BriefcaseIcon,
    UsersIcon,
    CheckCircle2Icon,
    ClockIcon,
    TrendingUpIcon,
    AlertCircleIcon,
    ZapIcon,
    ActivityIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    ReceiptIcon
} from 'lucide-react'
import { formatDistanceToNow } from "date-fns"
import { tr, enUS } from "date-fns/locale"
import { getManagerDashboardData } from "@/lib/data/manager-dashboard"
import { getTranslations } from "next-intl/server"

export default async function ManagerDashboard(props: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await props.params
    const session = await auth()

    if (!session || session.user.role !== "MANAGER") {
        redirect("/login")
    }

    const t = await getTranslations("Manager.dashboard")
    const dateLocale = locale === 'tr' ? tr : enUS

    const {
        totalJobs,
        activeTeams,
        completedJobsThisMonth,
        pendingApprovalsCount,
        recentJobs,
        efficiencyScore,
        activeJobsCount,
        completedJobsToday,
        overdueJobsCount,
        totalMonthlyCost,
        latestLogs,
        pendingApprovals
    } = await getManagerDashboardData()

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-gray-500 mt-2">{t('subtitle')}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{t('stats.activeJobs')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{activeJobsCount}</h3>
                        <span className="text-gray-400 text-xs">/ {totalJobs} total</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{t('stats.completedToday')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{completedJobsToday}</h3>
                        <span className="text-green-600 text-xs font-medium">{t('stats.completed')}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircleIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{t('stats.overdueJobs')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{overdueJobsCount}</h3>
                        <span className="text-red-600 text-xs font-medium">{t('stats.overdue')}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{t('stats.efficiency')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">%{efficiencyScore}</h3>
                        <span className="text-purple-600 text-xs font-medium">{t('stats.thisMonth')}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Content (Left 2 Columns) */}
                <div className="md:col-span-2 space-y-8">
                    {/* Recent Activity */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ActivityIcon className="h-5 w-5 text-gray-500" />
                                {t('recentJobs.title')}
                            </CardTitle>
                            <Link href="/manager/jobs" className="text-blue-600 text-sm font-medium hover:underline">
                                {tCommon('actions')}
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentJobs.length === 0 ? (
                                    <p className="text-sm text-gray-500">{t('recentJobs.noJobs')}</p>
                                ) : (
                                    recentJobs.map((job) => (
                                        <div key={job.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="mt-1 p-2 rounded-full bg-blue-100 text-blue-600">
                                                <BriefcaseIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {job.title}
                                                    </p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                        job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                        job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{job.customer.company} • {job.creator.name}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: dateLocale })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{t('stats.pendingApproval')}</h2>
                            <Link href="/manager/approvals" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                {t('stats.needsReview')} <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {pendingApprovals.length > 0 ? (
                                pendingApprovals.map((approval) => (
                                    <div key={approval.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-orange-50 rounded-lg">
                                                <ShieldCheckIcon className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{approval.job.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{approval.requester.name}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-[10px] font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                                                        {approval.type}
                                                    </span>
                                                    <Link href={`/manager/jobs/${approval.jobId}`} className="text-blue-600 text-xs hover:underline">
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 bg-gray-50 border border-dashed border-gray-300 p-8 rounded-xl text-center">
                                    <p className="text-gray-500 text-sm">{t('recentJobs.noJobs')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-8">
                    {/* Financial Summary */}
                    <Card className="border-none shadow-sm bg-gray-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                {t('stats.monthlyCosts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-bold">₺{totalMonthlyCost.toLocaleString('tr-TR')}</span>
                                <span className="text-gray-400 text-xs">{t('stats.approved')}</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                            <ReceiptIcon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm">{t('stats.activeTeams')}</span>
                                    </div>
                                    <span className="font-semibold">{activeTeams}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                            <TrendingUpIcon className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="text-sm">{t('stats.efficiency')}</span>
                                    </div>
                                    <span className="font-semibold">%{efficiencyScore}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-none shadow-sm bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-900 text-lg">{t('quickActions.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/manager/jobs" className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <BriefcaseIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-sm">{t('quickActions.newJob.title')}</h3>
                                    <p className="text-[10px] text-blue-600/70">{t('quickActions.newJob.desc')}</p>
                                </div>
                            </Link>

                            <Link href="/manager/reports" className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <UsersIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-sm">{t('quickActions.reports.title')}</h3>
                                    <p className="text-[10px] text-blue-600/70">{t('quickActions.reports.desc')}</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* System Logs */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">{t('stats.systemLogs')}</h2>
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {latestLogs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1.5 rounded-md ${
                                                log.level === 'ERROR' ? 'bg-red-50 text-red-600' : 
                                                log.level === 'WARN' ? 'bg-yellow-50 text-yellow-600' : 
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                                <ZapIcon className="w-3 h-3" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-900 line-clamp-2">{log.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {new Date(log.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/manager/logs" className="block w-full p-3 text-center text-[10px] font-bold text-blue-600 hover:bg-gray-50 border-t border-gray-100 uppercase tracking-widest">
                                View all logs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
