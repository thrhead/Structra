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
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      customerProfile: true
    }
  });

  if (!user) return null;

  // Fetch jobs based on role
  let jobs: any[] = [];
  if (user.role === 'CUSTOMER' && user.customerProfile) {
    jobs = await prisma.job.findMany({
      where: { customerId: user.customerProfile.id },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    const assignedJobs = await prisma.jobAssignment.findMany({
      where: {
        OR: [
          { workerId: id },
          { team: { members: { some: { userId: id } } } }
        ]
      },
      include: {
        job: true
      }
    });
    jobs = assignedJobs.map(aj => aj.job);
  }

  // Fetch Costs
  const allCosts = await prisma.costTracking.findMany({
    where: { createdById: id },
    include: { job: { select: { title: true, jobNo: true } } },
    orderBy: { date: 'desc' }
  });

  // Fetch Pending Step Approvals
  const [pendingSteps, pendingSubSteps] = await Promise.all([
    prisma.jobStep.findMany({
      where: { 
        completedById: id,
        approvalStatus: 'PENDING',
        isCompleted: true
      },
      include: { job: { select: { title: true, jobNo: true } } }
    }),
    prisma.jobSubStep.findMany({
      where: {
        step: { job: { assignments: { some: { workerId: id } } } }, // This is a bit complex, might need better completedBy
        approvalStatus: 'PENDING',
        isCompleted: true
      },
      include: { step: { include: { job: { select: { title: true, jobNo: true } } } } }
    })
  ]);

  // General Approvals initiated by user
  const pendingApprovals = await prisma.approval.findMany({
    where: { requesterId: id, status: 'PENDING' },
    include: { job: { select: { title: true, jobNo: true } } }
  });

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

  const totalCosts = allCosts.reduce((acc, cost) => acc + cost.amount, 0);
  const pendingCosts = allCosts.filter(c => c.status === 'PENDING');
  const reimbursedCosts = allCosts
    .filter(c => c.status === 'APPROVED')
    .reduce((acc, cost) => acc + cost.amount, 0);

  return {
    kpis: {
      totalHours: Math.round(totalMinutes / 60),
      activeProjectCount: activeJobs.length,
      completedProjectCount: completedJobs.length,
      totalExpenditure: totalCosts,
      reimbursedExpenditure: reimbursedCosts,
      pendingApprovalCount: pendingCosts.length + pendingSteps.length + pendingSubSteps.length + pendingApprovals.length
    },
    history: {
      activeTasks: activeJobs,
      completedTasks: completedJobs,
      costs: allCosts,
      pendingItems: {
        costs: pendingCosts,
        steps: pendingSteps,
        subSteps: pendingSubSteps,
        approvals: pendingApprovals
      }
    }
  };
}
