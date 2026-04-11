import { prisma } from "@/lib/db";

export async function getApprovals() {
  return await prisma.approval.findMany({
    where: {
      status: 'PENDING'
    },
    include: {
      job: {
        include: {
          customer: true
        }
      },
      requester: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPendingCosts() {
  return await prisma.costTracking.findMany({
    where: { status: 'PENDING' },
    include: {
      job: { select: { id: true, title: true, jobNo: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: 'desc' },
  });
}

export async function getPendingJobSteps() {
  const steps = await prisma.jobStep.findMany({
    where: { approvalStatus: 'PENDING' },
    include: {
      job: { select: { id: true, title: true, jobNo: true, customer: { select: { company: true } } } },
      completedBy: { select: { id: true, name: true } },
    },
    orderBy: { completedAt: 'desc' }
  });

  const subSteps = await prisma.jobSubStep.findMany({
    where: { approvalStatus: 'PENDING' },
    include: {
      step: { 
        include: { 
          job: { select: { id: true, title: true, jobNo: true, customer: { select: { company: true } } } } 
        } 
      },
    },
    orderBy: { completedAt: 'desc' }
  });

  return { steps, subSteps };
}

export async function getApprovalStats() {
    const pendingCount = await prisma.approval.count({
        where: { status: 'PENDING' }
    });
    const pendingCosts = await prisma.costTracking.count({
        where: { status: 'PENDING' }
    });
    const pendingSteps = await prisma.jobStep.count({
        where: { approvalStatus: 'PENDING' }
    });
    const pendingSubSteps = await prisma.jobSubStep.count({
        where: { approvalStatus: 'PENDING' }
    });
    return { 
        pendingApprovalModelCount: pendingCount,
        pendingCosts,
        pendingSteps: pendingSteps + pendingSubSteps,
        totalPending: pendingCount + pendingCosts + pendingSteps + pendingSubSteps
    };
}
