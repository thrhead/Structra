import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export type CustomerFilter = {
  search?: string;
  isActive?: boolean;
};

export type GetCustomersParams = {
  page?: number;
  limit?: number;
  filter?: CustomerFilter;
};

export async function getCustomers({ page = 1, limit = 20, filter }: GetCustomersParams = {}) {
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {};

  if (filter?.search) {
    where.OR = [
      { company: { contains: filter.search, mode: "insensitive" } },
      { user: { name: { contains: filter.search, mode: "insensitive" } } },
      { user: { email: { contains: filter.search, mode: "insensitive" } } }
    ];
  }

  if (filter?.isActive !== undefined) {
    where.user = {
      isActive: filter.isActive
    };
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            jobs: true
          }
        }
      }
    }),
    prisma.customer.count({ where })
  ]);

  return {
    customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCustomerStats() {
    const total = await prisma.customer.count();
    const active = await prisma.customer.count({
        where: { user: { isActive: true } }
    });

    // Most active customers (by job count) - would be good to have, but keeping it simple for now

    return { total, active };
}

export async function getCustomer(id: string) {
    return await prisma.customer.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isActive: true,
                    createdAt: true
                }
            },
            jobs: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignments: {
                        include: {
                            team: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    jobs: true
                }
            }
        }
    });
}
export async function getCustomerDetailedReports(customerId: string) {
    // 1. Get all jobs for this customer
    const jobs = await prisma.job.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        include: {
            steps: {
                select: {
                    startedAt: true,
                    completedAt: true,
                    isCompleted: true,
                }
            },
            costs: {
                where: { status: 'APPROVED' },
                select: {
                    amount: true,
                    category: true,
                    date: true
                }
            },
            assignments: {
                include: {
                    team: { select: { name: true } }
                }
            }
        }
    });

    // 2. Calculate Stats
    let totalWorkMinutes = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};
    const projectBreakdown: Record<string, { jobCount: number, expenses: number }> = {};
    const monthlyTrend: Record<string, { jobCount: number, workHours: number, expenses: number }> = {};

    // Initialize last 6 months trend
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = format(d, 'MMM yy', { locale: tr });
        monthlyTrend[monthKey] = { jobCount: 0, workHours: 0, expenses: 0 };
    }

    jobs.forEach(job => {
        const jobDate = job.scheduledDate || job.createdAt;
        const monthKey = format(jobDate, 'MMM yy', { locale: tr });
        const projNo = job.projectNo || 'Diğer';

        if (!projectBreakdown[projNo]) {
            projectBreakdown[projNo] = { jobCount: 0, expenses: 0 };
        }
        projectBreakdown[projNo].jobCount += 1;

        if (monthlyTrend[monthKey]) {
            monthlyTrend[monthKey].jobCount += 1;
        }

        // Time calculations
        job.steps.forEach(step => {
            if (step.startedAt && step.completedAt) {
                const diff = (step.completedAt.getTime() - step.startedAt.getTime()) / (1000 * 60);
                totalWorkMinutes += diff;
                if (monthlyTrend[monthKey]) {
                    monthlyTrend[monthKey].workHours += diff / 60;
                }
            }
        });

        // Financial calculations
        job.costs.forEach(cost => {
            totalExpenses += cost.amount;
            const cat = cost.category || 'Diğer';
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + cost.amount;
            projectBreakdown[projNo].expenses += cost.amount;

            const costMonthKey = format(cost.date || jobDate, 'MMM yy', { locale: tr });
            if (monthlyTrend[costMonthKey]) {
                monthlyTrend[costMonthKey].expenses += cost.amount;
            }
        });
    });

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length;
    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
    const avgJobDuration = completedJobs > 0 ? Math.round((totalWorkMinutes / 60) / completedJobs) : 0;

    return {
        jobs,
        stats: {
            totalJobs,
            completedJobs,
            totalExpenses,
            successRate,
            avgJobDuration,
            totalWorkingHours: Math.round(totalWorkMinutes / 60),
            categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
            projectBreakdown: Object.entries(projectBreakdown).map(([name, data]) => ({ name, ...data })),
            monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
                month,
                ...data,
                workHours: Math.round(data.workHours)
            }))
        }
    };
}
