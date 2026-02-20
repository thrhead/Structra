import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export type UserFilter = {
  search?: string;
  role?: string;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  filter?: UserFilter;
};

export async function getUsers({ page = 1, limit = 10, filter }: GetUsersParams = {}) {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (filter?.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { email: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter?.role && filter.role !== "ALL") {
    where.role = filter.role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserStats() {
  const total = await prisma.user.count();
  const active = await prisma.user.count({ where: { isActive: true } });
  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }
  });

  return { total, active, newUsers };
}

export async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      assignedJobs: {
        orderBy: { assignedAt: 'desc' },
        include: {
          job: {
            include: {
              customer: true
            }
          }
        }
      },
      managedTeams: true,
      teamMember: {
        include: {
          team: true
        }
      }
    }
  });
}

export async function getUserReports(id: string) {
  const [user, assignedJobs, createdCosts] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { role: true }
    }),
    prisma.jobAssignment.findMany({
      where: {
        OR: [
          { workerId: id },
          { team: { members: { some: { userId: id } } } }
        ]
      },
      include: {
        job: true
      }
    }),
    prisma.costTracking.findMany({
      where: { createdById: id }
    })
  ]);

  if (!user) return null;

  const jobs = assignedJobs.map(aj => aj.job);
  
  // KPIs
  const activeJobs = jobs.filter(j => ['PENDING', 'IN_PROGRESS'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
  
  // Calculate total hours from completed jobs
  const totalMinutes = completedJobs.reduce((acc, job) => {
    if (job.startedAt && job.completedDate) {
      const diff = (job.completedDate.getTime() - job.startedAt.getTime()) / (1000 * 60);
      return acc + diff;
    }
    return acc + (job.estimatedDuration || 0);
  }, 0);

  const totalCosts = createdCosts.reduce((acc, cost) => acc + cost.amount, 0);
  const reimbursedCosts = createdCosts
    .filter(c => c.status === 'APPROVED')
    .reduce((acc, cost) => acc + cost.amount, 0);

  return {
    kpis: {
      totalHours: Math.round(totalMinutes / 60),
      activeProjectCount: activeJobs.length,
      completedProjectCount: completedJobs.length,
      totalExpenditure: totalCosts,
      reimbursedExpenditure: reimbursedCosts
    },
    history: {
      activeTasks: activeJobs,
      completedTasks: completedJobs
    }
  };
}
