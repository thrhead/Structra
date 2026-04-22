import { prisma } from "@/lib/db"

export async function getManagerDashboardData() {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [
        totalJobs,
        activeTeams,
        completedJobsThisMonth,
        pendingApprovalsCount,
        recentJobs,
        activeJobsCount,
        completedJobsToday,
        overdueJobsCount,
        monthlyCostsAgg,
        latestLogs,
        pendingApprovals
    ] = await Promise.all([
        prisma.job.count(),
        prisma.team.count({ where: { isActive: true } }),
        prisma.job.count({
            where: {
                status: 'COMPLETED',
                completedDate: {
                    gte: monthStart
                }
            }
        }),
        prisma.approval.count({ where: { status: 'PENDING' } }),
        prisma.job.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: true,
                customer: true
            }
        }),
        prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.job.count({ 
            where: { 
                status: 'COMPLETED', 
                completedDate: { gte: todayStart } 
            } 
        }),
        prisma.job.count({
            where: {
                status: { notIn: ['COMPLETED', 'CANCELLED'] },
                scheduledEndDate: { lt: new Date() }
            }
        }),
        prisma.costTracking.aggregate({
            where: { 
                date: { gte: monthStart },
                status: 'APPROVED'
            },
            _sum: { amount: true }
        }),
        prisma.systemLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        }).catch(() => []),
        prisma.approval.findMany({
            where: { status: 'PENDING' },
            take: 3,
            include: { 
                job: { select: { title: true, jobNo: true } },
                requester: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        }).catch(() => [])
    ])

    const efficiencyScore = totalJobs > 0
        ? Math.min(Math.round((completedJobsThisMonth / totalJobs) * 100), 100)
        : 0

    return {
        totalJobs,
        activeTeams,
        completedJobsThisMonth,
        pendingApprovalsCount,
        recentJobs,
        efficiencyScore,
        activeJobsCount,
        completedJobsToday,
        overdueJobsCount,
        totalMonthlyCost: monthlyCostsAgg._sum?.amount || 0,
        latestLogs,
        pendingApprovals
    }
}
