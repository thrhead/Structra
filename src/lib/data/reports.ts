"use server"

import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

export async function getJobsForReport() {
    return await prisma.job.findMany({
        include: {
            assignments: {
                include: {
                    team: true
                },
                take: 1
            },
            customer: true,
            steps: {
                select: {
                    id: true,
                    isCompleted: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export const getReportStats = unstable_cache(
    async (startDate: Date, endDate: Date, jobStatus?: string, jobId?: string, category?: string) => {
        const jobWhere: any = {
            createdAt: { gte: startDate, lte: endDate }
        };
        if (jobStatus && jobStatus !== 'all') jobWhere.status = jobStatus;
        if (jobId && jobId !== 'all') jobWhere.id = jobId;

        const jobsByStatus = await prisma.job.groupBy({
            by: ['status'],
            _count: true,
            where: jobWhere
        });

        const pendingJobs = jobsByStatus.find(g => g.status === 'PENDING')?._count || 0;
        const inProgressJobs = jobsByStatus.find(g => g.status === 'IN_PROGRESS')?._count || 0;
        const completedJobs = jobsByStatus.find(g => g.status === 'COMPLETED')?._count || 0;
        const totalJobs = pendingJobs + inProgressJobs + completedJobs;

        const costWhere: any = {
            date: { gte: startDate, lte: endDate }
        };
        if (jobStatus && jobStatus !== 'all') costWhere.job = { status: jobStatus };
        if (jobId && jobId !== 'all') costWhere.jobId = jobId;
        if (category && category !== 'all') costWhere.category = category;

        // Total APPROVED costs for the specific filters
        const approvedCosts = await prisma.costTracking.aggregate({
            _sum: { amount: true },
            where: { ...costWhere, status: 'APPROVED' }
        });

        const pendingCostsCount = await prisma.costTracking.count({
            where: { ...costWhere, status: 'PENDING' }
        });

        return {
            totalJobs,
            pendingJobs,
            inProgressJobs,
            completedJobs,
            totalCost: approvedCosts._sum.amount || 0,
            pendingApprovals: pendingCostsCount
        };
    },
    ['report-stats'],
    { revalidate: 300, tags: ['reports', 'costs', 'jobs'] }
);

export const getCostBreakdown = unstable_cache(
    async (startDate: Date, endDate: Date, status?: string, jobStatus?: string, jobId?: string, category?: string) => {
        const where: any = {
            date: {
                gte: startDate,
                lte: endDate
            }
        };

        if (status && status !== 'all') {
            where.status = status;
        } else {
            where.status = { not: 'REJECTED' };
        }

        if (jobStatus && jobStatus !== 'all') {
            where.job = { ...where.job, status: jobStatus };
        }

        if (jobId && jobId !== 'all') {
            where.jobId = jobId;
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        const costs = await prisma.costTracking.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where
        });

        const breakdown: Record<string, number> = {};
        costs.forEach(cost => {
            if (cost.category && cost._sum.amount) {
                breakdown[cost.category] = cost._sum.amount;
            }
        });

        return breakdown;
    },
    ['cost-breakdown'],
    { revalidate: 300, tags: ['costs'] }
);

export const getCostTrend = unstable_cache(
    async (startDate: Date, endDate: Date, status?: string, jobStatus?: string, jobId?: string, category?: string) => {
        const where: any = {
            date: { gte: startDate, lte: endDate }
        };

        if (status && status !== 'all') where.status = status;
        else where.status = { not: 'REJECTED' };

        if (jobStatus && jobStatus !== 'all') where.job = { ...where.job, status: jobStatus };
        if (jobId && jobId !== 'all') where.jobId = jobId;
        if (category && category !== 'all') where.category = category;

        const costs = await prisma.costTracking.findMany({
            where,
            select: { date: true, amount: true, category: true },
            orderBy: { date: 'asc' }
        });

        const trendMap: Record<string, Record<string, number>> = {};
        const categoriesSet = new Set<string>();

        costs.forEach(cost => {
            const dateStr = cost.date.toISOString().split('T')[0];
            const cat = cost.category || 'Diğer';
            categoriesSet.add(cat);

            if (!trendMap[dateStr]) trendMap[dateStr] = {};
            trendMap[dateStr][cat] = (trendMap[dateStr][cat] || 0) + cost.amount;
        });

        const categories = Array.from(categoriesSet);
        const data = Object.entries(trendMap).map(([date, values]) => ({
            date,
            ...values
        }));

        return { data, categories };
    },
    ['cost-trend'],
    { revalidate: 300, tags: ['costs'] }
);

export const getTotalCostTrend = unstable_cache(
    async (startDate: Date, endDate: Date, status?: string, jobStatus?: string, jobId?: string, category?: string) => {
        const where: any = {
            date: { gte: startDate, lte: endDate }
        };

        if (status && status !== 'all') where.status = status;
        else where.status = { not: 'REJECTED' };

        if (jobStatus && jobStatus !== 'all') where.job = { ...where.job, status: jobStatus };
        if (jobId && jobId !== 'all') where.jobId = jobId;
        if (category && category !== 'all') where.category = category;

        const costs = await prisma.costTracking.findMany({
            where,
            select: { date: true, amount: true },
            orderBy: { date: 'asc' }
        });

        const trendMap: Record<string, number> = {};
        costs.forEach(cost => {
            const dateStr = cost.date.toISOString().split('T')[0];
            trendMap[dateStr] = (trendMap[dateStr] || 0) + cost.amount;
        });

        return Object.entries(trendMap).map(([date, amount]) => ({
            date,
            amount
        }));
    },
    ['total-cost-trend'],
    { revalidate: 300, tags: ['costs'] }
);

export async function getPendingCostsList(startDate: Date, endDate: Date, jobStatus?: string, jobId?: string, category?: string) {
    const where: any = {
        date: { gte: startDate, lte: endDate },
        status: 'PENDING'
    };

    if (jobStatus && jobStatus !== 'all') where.job = { status: jobStatus };
    if (jobId && jobId !== 'all') where.jobId = jobId;
    if (category && category !== 'all') where.category = category;

    return await prisma.costTracking.findMany({
        where,
        include: {
            job: true,
            createdBy: true
        },
        orderBy: { date: 'desc' }
    });
}

/**
 * Yeni Rapor Fonksiyonları
 */

// 1. Kârlılık Raporu Verisi
export async function getProfitabilityData(startDate: Date, endDate: Date, customerId?: string) {
    const where: any = {
        status: 'COMPLETED',
        completedDate: { gte: startDate, lte: endDate }
    };
    if (customerId && customerId !== 'all') where.customerId = customerId;

    const jobs = await prisma.job.findMany({
        where,
        include: {
            costs: { where: { status: 'APPROVED' } },
            customer: true
        }
    });

    return jobs.map(job => {
        const totalCost = job.costs.reduce((sum, c) => sum + c.amount, 0);
        const budget = job.budget || 0;
        return {
            jobNo: job.jobNo || job.id.substring(0, 8),
            title: job.title,
            customer: job.customer.company,
            budget,
            totalCost,
            profit: budget - totalCost,
            profitMargin: budget > 0 ? ((budget - totalCost) / budget) * 100 : 0
        };
    });
}

// 2. Gecikme ve Darboğaz Analizi Verisi
export async function getDelayAnalysisData(startDate: Date, endDate: Date) {
    const jobs = await prisma.job.findMany({
        where: {
            status: 'COMPLETED',
            completedDate: { gte: startDate, lte: endDate },
            startedAt: { not: null }
        },
        include: {
            steps: {
                where: { blockedAt: { not: null } }
            }
        }
    });

    return jobs.map(job => {
        const actualDuration = job.startedAt && job.completedDate
            ? (job.completedDate.getTime() - job.startedAt.getTime()) / (1000 * 60)
            : 0;
        const estimatedDuration = job.estimatedDuration || 0;
        const delay = actualDuration - estimatedDuration;

        return {
            jobNo: job.jobNo || job.id.substring(0, 8),
            title: job.title,
            estimatedDuration,
            actualDuration,
            delay: delay > 0 ? delay : 0,
            blockedStepsCount: job.steps.length,
            bottleneckCount: job.steps.length
        };
    });
}

// 3. Ekip Kapasite ve İş Yükü Verisi
export async function getTeamCapacityData() {
    const teams = await prisma.team.findMany({
        include: {
            assignments: {
                where: { job: { status: { in: ['PENDING', 'IN_PROGRESS'] } } },
                include: { job: true }
            },
            members: true
        }
    });

    return teams.map(team => ({
        teamName: team.name,
        activeJobsCount: team.assignments.length,
        memberCount: team.members.length,
        loadFactor: team.members.length > 0 ? (team.assignments.length / team.members.length) * 100 : 0
    }));
}

// 4. Personel Performans Verisi
export async function getPersonnelPerformanceData(startDate: Date, endDate: Date) {
    const workers = await prisma.user.findMany({
        where: { role: { in: ['WORKER', 'MANAGER'] } },
        include: {
            completedSteps: {
                where: { completedAt: { gte: startDate, lte: endDate } }
            },
            teamMember: {
                include: { team: true }
            }
        }
    });

    return workers.map(worker => ({
        name: worker.name || worker.email,
        teamName: worker.teamMember[0]?.team.name || 'Bağımsız',
        completedStepsCount: worker.completedSteps.length,
    })).sort((a, b) => b.completedStepsCount - a.completedStepsCount);
}

// 5. Finansal Özet Tablo Verisi
export async function getFinancialSummaryData(startDate: Date, endDate: Date) {
    const costs = await prisma.costTracking.findMany({
        where: {
            date: { gte: startDate, lte: endDate },
            status: 'APPROVED'
        },
        include: {
            job: true
        }
    });

    const categoryBreakdown = costs.reduce((acc: any, cost) => {
        const cat = cost.category || 'Diğer';
        acc[cat] = (acc[cat] || 0) + cost.amount;
        return acc;
    }, {});

    return {
        totalApproved: costs.reduce((sum, c) => sum + c.amount, 0),
        categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
        recentCosts: costs.slice(0, 10).map(c => ({
            date: c.date,
            description: c.description,
            amount: c.amount,
            jobTitle: c.job.title
        }))
    };
}

export const getJobsListForFilter = unstable_cache(
    async (jobStatus?: string) => {
        const where: any = {};
        if (jobStatus && jobStatus !== 'all') {
            where.status = jobStatus;
        }

        return await prisma.job.findMany({
            where,
            select: { id: true, title: true },
            orderBy: { title: 'asc' }
        });
    },
    ['jobs-list-filter'],
    { revalidate: 3600, tags: ['jobs'] }
);

export const getCategoriesForFilter = unstable_cache(
    async () => {
        const categories = await prisma.costTracking.groupBy({
            by: ['category'],
            where: { category: { not: null } }
        });
        return categories.map(c => c.category as string);
    },
    ['categories-filter'],
    { revalidate: 3600, tags: ['costs'] }
);

export const getJobStatusDistribution = unstable_cache(
    async (startDate: Date, endDate: Date, jobStatus?: string, jobId?: string) => {
        const where: any = {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        if (jobStatus && jobStatus !== 'all') {
            where.status = jobStatus;
        }

        if (jobId && jobId !== 'all') {
            where.id = jobId;
        }

        const jobs = await prisma.job.groupBy({
            by: ['status'],
            _count: true,
            where
        });

        const distribution: Record<string, number> = {};
        jobs.forEach(job => {
            distribution[job.status] = job._count;
        });

        return distribution;
    },
    ['job-status-distribution'],
    { revalidate: 300, tags: ['jobs'] }
);

export const getTeamPerformance = unstable_cache(
    async (startDate: Date, endDate: Date, jobStatus?: string, jobId?: string) => {
        const where: any = {
            status: 'COMPLETED',
            completedDate: {
                gte: startDate,
                lte: endDate
            },
            startedAt: {
                not: null
            },
            assignments: {
                some: {
                    teamId: {
                        not: null
                    }
                }
            }
        };

        if (jobStatus && jobStatus !== 'all') {
            where.status = jobStatus;
        }

        if (jobId && jobId !== 'all') {
            where.id = jobId;
        }

        const jobs = await prisma.job.findMany({
            where,
            include: {
                assignments: {
                    include: {
                        team: true
                    }
                }
            }
        });

        const teamStats: Record<string, { totalJobs: number; totalTime: number; teamName: string }> = {};

        jobs.forEach(job => {
            const teamAssignment = job.assignments.find(a => a.teamId);
            if (teamAssignment && teamAssignment.team) {
                const teamId = teamAssignment.team.id;
                const teamName = teamAssignment.team.name;

                if (!teamStats[teamId]) {
                    teamStats[teamId] = { totalJobs: 0, totalTime: 0, teamName };
                }

                if (job.startedAt && job.completedDate) {
                    const durationMinutes = (job.completedDate.getTime() - job.startedAt.getTime()) / (1000 * 60);
                    teamStats[teamId].totalJobs += 1;
                    teamStats[teamId].totalTime += durationMinutes;
                }
            }
        });

        return Object.values(teamStats).map(stat => ({
            teamName: stat.teamName,
            totalJobs: stat.totalJobs,
            avgCompletionTimeMinutes: stat.totalJobs > 0 ? stat.totalTime / stat.totalJobs : 0
        }));
    },
    ['team-performance'],
    { revalidate: 600, tags: ['teams', 'jobs'] }
);

export const getWeeklyCompletedSteps = unstable_cache(
    async () => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        const prev7Days = new Date(last7Days);
        prev7Days.setDate(last7Days.getDate() - 7);
        prev7Days.setHours(0, 0, 0, 0);

        // Fetch steps completed in the last 14 days
        const steps = await prisma.jobStep.findMany({
            where: {
                isCompleted: true,
                completedAt: { gte: prev7Days, lte: today }
            },
            include: {
                job: {
                    select: { title: true }
                }
            },
            orderBy: { completedAt: 'asc' }
        });

        // Gerçek veritabanından, filtre aralığındaki tamamlanmış adımların başlıklarını çeken Dinamik Kategori
        const categoriesSet = new Set<string>();
        steps.forEach(step => {
            if (step.title) categoriesSet.add(step.title);
        });
        const categories = Array.from(categoriesSet);

        const formatData = (startDate: Date, endDate: Date) => {
            const days: Record<string, any> = {};
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i + 1);
                const dateStr = d.toISOString().split('T')[0];
                days[dateStr] = { date: dateStr, total: 0 };
                categories.forEach(cat => days[dateStr][cat] = 0);
                days[dateStr].jobs = [];
            }

            steps.filter(s => s.completedAt! >= startDate && s.completedAt! <= endDate).forEach(step => {
                const dateStr = step.completedAt!.toISOString().split('T')[0];
                if (days[dateStr]) {
                    const cat = step.title;
                    if (categories.includes(cat)) {
                        days[dateStr][cat]++;
                    }
                    days[dateStr].total++;
                    if (!days[dateStr].jobs.find((j: any) => j.id === step.jobId)) {
                        days[dateStr].jobs.push({ id: step.jobId, title: step.job.title });
                    }
                }
            });

            return Object.values(days);
        };

        const currentWeek = formatData(last7Days, today);
        const previousWeek = formatData(prev7Days, last7Days);

        return {
            currentWeek,
            previousWeek,
            categories
        };
    },
    ['weekly-completed-steps'],
    { revalidate: 600, tags: ['steps', 'jobs'] }
);

export async function getCostList(startDate: Date, endDate: Date, status?: string, jobStatus?: string, jobId?: string, category?: string) {
    const where: any = {
        date: { gte: startDate, lte: endDate }
    };

    if (status && status !== 'all') where.status = status;
    else where.status = { not: 'REJECTED' };

    if (jobStatus && jobStatus !== 'all') where.job = { ...where.job, status: jobStatus };
    if (jobId && jobId !== 'all') where.jobId = jobId;
    if (category && category !== 'all') where.category = category;

    return await prisma.costTracking.findMany({
        where,
        include: {
            job: {
                select: { title: true }
            },
            createdBy: {
                select: { name: true }
            }
        },
        orderBy: { date: 'desc' }
    });
}
