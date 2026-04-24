
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, CheckCircle2Icon, TrendingUpIcon, ShieldCheckIcon } from 'lucide-react'

interface WorkerStatsProps {
    stats: {
        activeJobs: number
        completedJobs: number
        totalEarnings: number
        pendingApprovals: number
    }
}

export function WorkerStats({ stats }: WorkerStatsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Aktif İşler</CardTitle>
                    <BriefcaseIcon className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.activeJobs}</div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tamamlanan</CardTitle>
                    <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.completedJobs}</div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Masraflar</CardTitle>
                    <TrendingUpIcon className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">₺{stats.totalEarnings.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Onay Bekleyen</CardTitle>
                    <ShieldCheckIcon className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</div>
                </CardContent>
            </Card>
        </div>
    )
}
