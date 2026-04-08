import { prisma } from "@/lib/db"
import { getStrategicDashboard, getTacticalDashboard, getOperationalDashboard } from "./reports"

export async function getAdminDashboardData() {
  try {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      activeWorkers,
      todaysCosts,
      pendingApprovalsCount,
      pendingCostsAgg,
      approvedCostsAgg,
      weeklyCompletedSteps,
      activeJobsBudgetAgg,
      totalJobs,
      activeJobs,
      completedJobsToday,
      totalWorkers,
      activeTeams,
      latestLogs,
      pendingApprovals,
      // Enhanced Dashboard Data (Multi-tier)
      strategic,
      tactical,
      operational,
      recentJobs,
      recentCosts
    ] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'WORKER',
          isActive: true,
          assignedJobs: {
            some: {
              job: {
                status: 'IN_PROGRESS'
              }
            }
          }
        },
        take: 5,
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      }).catch(e => { console.error("activeWorkers fetch failed", e); return []; }),
      prisma.costTracking.findMany({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        select: {
          amount: true
        }
      }).catch(e => { console.error("todaysCosts fetch failed", e); return []; }),
      prisma.approval.count({
        where: {
          status: 'PENDING'
        }
      }).catch(e => { console.error("pendingApprovalsCount fetch failed", e); return 0; }),
      prisma.costTracking.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true }
      }).catch(e => { console.error("pendingCostsAgg fetch failed", e); return { _sum: { amount: 0 } }; }),
      prisma.costTracking.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true }
      }).catch(e => { console.error("approvedCostsAgg fetch failed", e); return { _sum: { amount: 0 } }; }),
      prisma.jobStep.findMany({
        where: {
          isCompleted: { equals: true },
          completedAt: {
            gte: sevenDaysAgo
          }
        },
        select: {
          completedAt: true
        }
      }).catch(e => { console.error("weeklyCompletedSteps fetch failed", e); return []; }),
      prisma.job.aggregate({
        where: {
          OR: [
            { status: 'IN_PROGRESS' },
            { scheduledDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
          ],
          budget: { not: null }
        },
        _sum: { budget: true }
      }).catch(e => { console.error("activeJobsBudgetAgg fetch failed", e); return { _sum: { budget: 0 } }; }),
      prisma.job.count().catch(() => 0),
      prisma.job.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }).catch(() => 0),
      prisma.job.count({ 
        where: { 
          status: 'COMPLETED', 
          completedDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
        } 
      }).catch(() => 0),
      prisma.user.count({ where: { role: 'WORKER' } }).catch(() => 0),
      prisma.team.count({ where: { isActive: true } }).catch(() => 0),
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
      }).catch(() => []),
      // Async Multi-tier fetches
      getStrategicDashboard(thirtyDaysAgo, today).catch(() => ({})),
      getTacticalDashboard(thirtyDaysAgo, today).catch(() => ({})),
      getOperationalDashboard(thirtyDaysAgo, today).catch(() => ({})),
      // Strategic Trend (14 Days)
      prisma.job.findMany({
        where: { createdAt: { gte: new Date(new Date().setDate(today.getDate() - 14)) } },
        select: { createdAt: true }
      }).catch(() => []),
      prisma.costTracking.findMany({
        where: { date: { gte: new Date(new Date().setDate(today.getDate() - 14)) }, status: 'APPROVED' },
        select: { date: true, amount: true }
      }).catch(() => [])
    ])

    const totalCostToday = todaysCosts.reduce((sum, cost) => sum + cost.amount, 0)
    // Dynamic budget: Sum of budgets of active/scheduled jobs. Fallback to 2000 if no budgets defined.
    const dailyBudget = activeJobsBudgetAgg._sum?.budget || 2000
    const budgetPercentage = Math.min(Math.round((totalCostToday / dailyBudget) * 100), 100)

    // Group jobs by date (7 days for performance chart)
    const weeklyStats = new Array(7).fill(0).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateKey = d.toISOString().split('T')[0]
      const displayDate = d.toLocaleDateString('tr-TR', { weekday: 'short' })

      const count = weeklyCompletedSteps.filter(step =>
        step.completedAt && step.completedAt.toISOString().split('T')[0] === dateKey
      ).length

      return {
        name: displayDate,
        count
      }
    })

    // Strategic Trend (14 days for top chart)
    const strategicTrend = new Array(14).fill(0).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (13 - i))
      const dateKey = d.toISOString().split('T')[0]
      const displayDate = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })

      const jobsCount = recentJobs.filter((j: any) => j.createdAt.toISOString().split('T')[0] === dateKey).length
      const stepsCount = weeklyCompletedSteps.filter(s => s.completedAt?.toISOString().split('T')[0] === dateKey).length
      const dayCosts = recentCosts.filter((c: any) => c.date.toISOString().split('T')[0] === dateKey).reduce((sum: number, c: any) => sum + c.amount, 0)

      return {
        name: displayDate,
        intensity: jobsCount + stepsCount,
        cost: dayCosts
      }
    })

    return {
      activeWorkers,
      totalCostToday,
      budgetPercentage,
      pendingApprovalsCount,
      totalPendingCost: pendingCostsAgg._sum?.amount || 0,
      totalApprovedCost: approvedCostsAgg._sum?.amount || 0,
      weeklyStats,
      totalJobs,
      activeJobs,
      completedJobsToday,
      totalWorkers,
      activeTeams,
      latestLogs,
      pendingApprovals,
      // Tiered Insights
      strategic,
      tactical,
      operational,
      strategicTrend
    }
  } catch (error: any) {
    console.error("CRITICAL: getAdminDashboardData overall failure", error.message);
    return {
      activeWorkers: [],
      totalCostToday: 0,
      budgetPercentage: 0,
      pendingApprovalsCount: 0,
      totalPendingCost: 0,
      totalApprovedCost: 0,
      weeklyStats: [],
      totalJobs: 0,
      activeJobs: 0,
      completedJobsToday: 0,
      totalWorkers: 0,
      activeTeams: 0,
      latestLogs: [],
      pendingApprovals: [],
      strategic: {},
      tactical: {},
      operational: {},
      strategicTrend: []
    }
  }
}