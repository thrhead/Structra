import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { JOB_STATUS } from "@/lib/constants/jobs";

export type JobFilter = {
  search?: string;
  jobNo?: string;
  status?: string | string[];
  priority?: string;
  customerId?: string;
  teams?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
};

export type GetJobsParams = {
  page?: number;
  limit?: number;
  filter?: JobFilter;
};

/**
 * Builds the Prisma where clause based on the provided filters.
 * SRP: Responsibility is ONLY to map Filter object to Prisma Where object.
 */
function buildJobWhereClause(filter?: JobFilter): Prisma.JobWhereInput {
  const where: Prisma.JobWhereInput = {};

  if (!filter) return where;

  // ID / JobNo Specific Filter
  if (filter.jobNo) {
    where.OR = [
      { id: filter.jobNo },
      { jobNo: { contains: filter.jobNo, mode: "insensitive" } }
    ];
  }

  // Global Search
  if (filter.search) {
    const searchOR: Prisma.JobWhereInput[] = [
      { id: { contains: filter.search, mode: "insensitive" } },
      { title: { contains: filter.search, mode: "insensitive" } },
      { jobNo: { contains: filter.search, mode: "insensitive" } },
      { customer: { company: { contains: filter.search, mode: "insensitive" } } },
      { customer: { user: { name: { contains: filter.search, mode: "insensitive" } } } }
    ];

    if (where.OR) {
      where.AND = [
        { OR: where.OR as Prisma.JobWhereInput[] },
        { OR: searchOR }
      ];
      delete where.OR;
    } else {
      where.OR = searchOR;
    }
  }

  // Status Filter (Support for both string and array)
  if (filter.status) {
    if (Array.isArray(filter.status) && filter.status.length > 0) {
      where.status = { in: filter.status };
    } else if (typeof filter.status === 'string' && filter.status !== 'ALL') {
      where.status = filter.status;
    }
  }

  // Teams Filter
  if (filter.teams && filter.teams.length > 0) {
    where.assignments = {
      some: {
        teamId: { in: filter.teams }
      }
    };
  }

  // Priority Filter
  if (filter.priority && filter.priority !== 'ALL') {
    where.priority = filter.priority;
  }

  // Customer Filter
  if (filter.customerId) {
    where.customerId = filter.customerId;
  }

  // Date Range Filter
  if (filter.dateRange) {
    where.scheduledDate = {
      gte: filter.dateRange.start,
      lte: filter.dateRange.end
    };
  }

  return where;
}

/**
 * Fetches jobs with pagination and metadata.
 */
export async function getJobs({ page = 1, limit = 20, filter }: GetJobsParams = {}) {
  try {
    const skip = (page - 1) * limit;
    const where = buildJobWhereClause(filter);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          jobNo: true,
          projectNo: true,
          title: true,
          status: true,
          priority: true,
          scheduledDate: true,
          createdAt: true,
          customer: {
            select: {
              company: true,
              user: { select: { name: true } }
            }
          },
          assignments: {
            select: {
              team: {
                select: {
                  id: true,
                  name: true,
                  lead: { select: { name: true } }
                }
              },
              worker: { select: { name: true } }
            }
          },
          steps: {
            select: {
              isCompleted: true,
              subSteps: {
                select: {
                  approvalStatus: true
                }
              }
            }
          },
          costs: {
            select: {
              id: true,
              amount: true,
              status: true
            }
          },
          _count: {
            select: {
              steps: true
            }
          }
        }
      }),
      prisma.job.count({ where })
    ]);

    return {
      jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("ERROR: getJobs failed:", error.message);
    return {
      jobs: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 }
    };
  }
}

export async function getJobStats() {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: JOB_STATUS.PENDING } }),
      prisma.job.count({ where: { status: JOB_STATUS.IN_PROGRESS } }),
      prisma.job.count({ where: { status: JOB_STATUS.COMPLETED } })
    ]);

    return { total, pending, inProgress, completed };
  } catch (error: any) {
    console.error("ERROR: getJobStats failed:", error.message);
    return { total: 0, pending: 0, inProgress: 0, completed: 0 };
  }
}

export async function getJob(id: string) {
  try {
    return await prisma.job.findUnique({
      where: { id },
      include: {
        customer: { include: { user: true } },
        creator: { select: { id: true, name: true, email: true } },
        jobLead: { select: { id: true, name: true } },
        assignments: {
          include: {
            team: {
              include: {
                lead: true,
                members: { include: { user: true } }
              }
            },
            worker: true
          }
        },
        approvals: {
          where: { status: JOB_STATUS.PENDING },
          include: {
            requester: { select: { name: true, email: true } }
          }
        },
        steps: {
          orderBy: { order: 'asc' },
          include: {
            completedBy: { select: { name: true } },
            subSteps: {
              orderBy: { order: 'asc' },
              include: { photos: true }
            },
            photos: {
              orderBy: { uploadedAt: 'desc' },
              include: { uploadedBy: { select: { name: true } } }
            }
          }
        },
        costs: {
          orderBy: { date: 'desc' },
          include: {
            createdBy: { select: { name: true } }
          }
        }
      }
    });
  } catch (error: any) {
    console.error(`ERROR: getJob ${id} failed:`, error.message);
    return null;
  }
}
