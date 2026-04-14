import { prisma } from "@/lib/db"
import { getStrategicDashboard, getTacticalDashboard, getOperationalDashboard } from "./reports"

export async function getAdminDashboardData() {
  try {
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const [
      activeWorkersCount,
      todaysCosts,
      pendingApprovalsCount,
      pendingCostsAgg,
      approvedCostsAgg,
      weeklyCompletedSteps,
      activeJobsBudgetAgg,
      totalJobs,
      activeJobs,
      pendingOnlyJobs,
      totalCompletedJobs,
      completedJobsToday,
      totalWorkers,
      activeTeams,
      totalCustomers,
      latestLogs,
      pendingApprovals,
      latestCustomers,
      // Enhanced Dashboard Data (Multi-tier)
      strategic,
      tactical,
      operational,
      // Strategic Trend (14 Days)
      strategicTrendResult,
      // Shared Data for Quick Actions
      allCustomers,
      allTeams,
      allTemplates,
      allUsers
    ] = await Promise.all([
      // 0: activeWorkersCount
      prisma.user.count({
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
        }
      }).catch(e => { console.error("activeWorkersCount fetch failed", e); return 0; }),

      // 1: todaysCosts
      prisma.costTracking.findMany({
        where: {
          date: { gte: today }
        },
        select: { amount: true }
      }).catch(e => { console.error("todaysCosts fetch failed", e); return []; }),

      // 2: pendingApprovalsCount (Total pending actions: Approvals + Pending Costs)
      Promise.all([
        prisma.approval.count({ where: { status: 'PENDING' } }),
        prisma.costTracking.count({ where: { status: 'PENDING' } })
      ]).then(([appr, costs]) => appr + costs).catch(e => { console.error("pendingApprovalsCount fetch failed", e); return 0; }),

      // 3: pendingCostsAgg
      prisma.costTracking.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true }
      }).catch(e => { console.error("pendingCostsAgg fetch failed", e); return { _sum: { amount: 0 } }; }),

      // 4: approvedCostsAgg
      prisma.costTracking.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true }
      }).catch(e => { console.error("approvedCostsAgg fetch failed", e); return { _sum: { amount: 0 } }; }),

      // 5: weeklyCompletedSteps
      prisma.jobStep.findMany({
        where: {
          isCompleted: true,
          completedAt: { gte: sevenDaysAgo }
        },
        select: { completedAt: true }
      }).catch(e => { console.error("weeklyCompletedSteps fetch failed", e); return []; }),

      // 6: activeJobsBudgetAgg
      prisma.job.aggregate({
        where: {
          OR: [
            { status: 'IN_PROGRESS' },
            { scheduledDate: { gte: today } }
          ],
          budget: { not: null }
        },
        _sum: { budget: true }
      }).catch(e => { console.error("activeJobsBudgetAgg fetch failed", e); return { _sum: { budget: 0 } }; }),

      // 7: totalJobs
      prisma.job.count().catch(e => { console.error("totalJobs fetch failed", e); return 0; }),

      // 8: activeJobs (PENDING + IN_PROGRESS)
      prisma.job.count({ 
        where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } 
      }).catch(e => { console.error("activeJobs fetch failed", e); return 0; }),

      // 9: pendingOnlyJobs (only PENDING — for "Bekleyen İşler" card)
      prisma.job.count({
        where: { status: 'PENDING' }
      }).catch(e => { console.error("pendingOnlyJobs fetch failed", e); return 0; }),

      // 10: totalCompletedJobs (all-time, for completion rate)
      prisma.job.count({
        where: { status: 'COMPLETED' }
      }).catch(e => { console.error("totalCompletedJobs fetch failed", e); return 0; }),

      // 11: completedJobsToday
      prisma.job.count({ 
        where: { 
          status: 'COMPLETED', 
          completedDate: { gte: today } 
        } 
      }).catch(e => { console.error("completedJobsToday fetch failed", e); return 0; }),

      // 12: totalWorkers
      prisma.user.count({ 
        where: { 
          role: { in: ['WORKER', 'MANAGER'] },
          isActive: true
        } 
      }).catch(e => { console.error("totalWorkers fetch failed", e); return 0; }),

      // 13: activeTeams
      prisma.team.count({ 
        where: { isActive: true } 
      }).catch(e => { console.error("activeTeams fetch failed", e); return 0; }),

      // 14: totalCustomers (real count, not just last 5)
      prisma.customer.count({
        where: { isActive: true }
      }).catch(e => { console.error("totalCustomers fetch failed", e); return 0; }),

      // 15: latestLogs
      prisma.systemLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }).catch(e => { console.error("latestLogs fetch failed", e); return []; }),

      // 13: pendingApprovals
      prisma.approval.findMany({
        where: { status: 'PENDING' },
        take: 3,
        include: { 
          job: { select: { title: true, jobNo: true } },
          requester: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }).catch(e => { console.error("pendingApprovals fetch failed", e); return []; }),

      // 14: latestCustomers (with job counts and spent info)
      prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { jobs: true }
          },
          jobs: {
            select: {
              costs: {
                where: { status: 'APPROVED' },
                select: { amount: true }
              }
            }
          }
        }
      }).catch(e => { console.error("latestCustomers fetch failed", e); return []; }),

      // 15: strategic
      getStrategicDashboard(thirtyDaysAgo, now).catch(e => { console.error("strategic fetch failed", e); return {}; }),

      // 16: tactical
      getTacticalDashboard(thirtyDaysAgo, now).catch(e => { console.error("tactical fetch failed", e); return {}; }),

      // 17: operational
      getOperationalDashboard(thirtyDaysAgo, now).catch(e => { console.error("operational fetch failed", e); return {}; }),

      // 18: strategicTrendResult (14-day)
      Promise.all(
        Array.from({ length: 14 }).map(async (_, i) => {
          const d = new Date(today)
          d.setDate(today.getDate() - (13 - i))
          d.setHours(0, 0, 0, 0)
          
          const dEnd = new Date(d)
          dEnd.setHours(23, 59, 59, 999)

          const [jobCount, costData] = await Promise.all([
            prisma.job.count({
              where: { createdAt: { gte: d, lte: dEnd } }
            }),
            prisma.costTracking.aggregate({
              where: { date: { gte: d, lte: dEnd }, status: 'APPROVED' },
              _sum: { amount: true }
            })
          ])

          return {
            date: d.toISOString().split('T')[0],
            name: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
            intensity: jobCount || 0,
            cost: Number(costData._sum.amount || 0)
          }
        })
      ).catch(e => { console.error("strategicTrendResult fetch failed", e); return []; }),
      
      // 22: allCustomers (for Quick Actions) - Removed strict isActive filter to match Jobs page
      prisma.customer.findMany({
        orderBy: { company: 'asc' },
        include: { user: { select: { name: true } } }
      }).catch(e => { console.error("allCustomers fetch failed", e); return []; }),

      // 23: allTeams (for Quick Actions)
      prisma.team.findMany({
        where: { isActive: true },
        include: { 
          lead: { select: { id: true, name: true } },
          members: { include: { user: { select: { id: true, name: true } } } }
        }
      }).catch(e => { console.error("allTeams fetch failed", e); return []; }),

      // 24: allTemplates (for Quick Actions)
      prisma.jobTemplate.findMany({
        include: { steps: { include: { subSteps: true } } }
      }).catch(e => { console.error("allTemplates fetch failed", e); return []; }),

      // 25: allUsers (for Quick Actions) - Filtered roles to match Teams page (No Customers)
      prisma.user.findMany({
        where: { 
          isActive: true,
          role: { in: ['TEAM_LEAD', 'WORKER', 'ADMIN', 'MANAGER'] }
        },
        select: { id: true, name: true, role: true },
        orderBy: { name: 'asc' }
      }).catch(e => { console.error("allUsers fetch failed", e); return []; })
    ])

    const totalCostToday = todaysCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0)
    const dailyBudget = activeJobsBudgetAgg._sum?.budget || 2000
    const budgetPercentage = Math.min(Math.round((totalCostToday / dailyBudget) * 100), 100)

    // Weekly performance mapping
    const weeklyStats = new Array(7).fill(0).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const displayDate = d.toLocaleDateString('tr-TR', { weekday: 'short' })

      const count = weeklyCompletedSteps.filter(step =>
        step.completedAt && step.completedAt.toISOString().split('T')[0] === dateStr
      ).length

      return {
        name: displayDate,
        count
      }
    })

    // Compute accurate completion rate from all-time data
    const completionRate = totalJobs > 0
      ? Math.round((totalCompletedJobs / totalJobs) * 100)
      : 0

    const result = {
      activeWorkersCount,
      totalCostToday,
      budgetPercentage,
      pendingApprovalsCount,
      totalPendingCost: pendingCostsAgg._sum?.amount || 0,
      totalApprovedCost: approvedCostsAgg._sum?.amount || 0,
      weeklyStats,
      totalJobs,
      activeJobs,
      pendingOnlyJobs,
      totalCompletedJobs,
      completedJobsToday,
      completionRate,
      totalCustomers,
      totalWorkers,
      activeTeams,
      latestLogs,
      pendingApprovals,
      latestCustomers,
      // Tiered Insights
      strategic,
      tactical,
      operational,
      strategicTrend: strategicTrendResult,
      // Quick Action Data
      allCustomers,
      allTeams,
      allTemplates,
      allUsers
    }

    console.log("DASHBOARD DEBUG: Fetch successful", {
      jobs: totalJobs,
      active: activeJobs,
      pending: pendingOnlyJobs,
      completed: totalCompletedJobs,
      completionRate,
      workers: totalWorkers,
      customers: totalCustomers,
      trendPoints: strategicTrendResult.length
    });

    return result
  } catch (error: any) {
    console.error("CRITICAL: getAdminDashboardData overall failure", error.message);
    return {
      activeWorkersCount: 0,
      totalCostToday: 0,
      budgetPercentage: 0,
      pendingApprovalsCount: 0,
      totalPendingCost: 0,
      totalApprovedCost: 0,
      weeklyStats: [],
      totalJobs: 0,
      activeJobs: 0,
      pendingOnlyJobs: 0,
      totalCompletedJobs: 0,
      completedJobsToday: 0,
      completionRate: 0,
      totalCustomers: 0,
      totalWorkers: 0,
      activeTeams: 0,
      latestLogs: [],
      pendingApprovals: [],
      latestCustomers: [],
      strategic: {},
      tactical: {},
      operational: {},
      strategicTrend: []
    }
  }
}