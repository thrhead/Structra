import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth-helper';
import { sendUserNotification } from '@/lib/notification-helper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, type, action, reason } = body;
    // action: 'APPROVE' | 'REJECT'
    // type: 'COST' | 'STEP' | 'SUB_STEP'

    if (!id || !type || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isApprove = action === 'APPROVE';
    const session = await verifyAuth(req);
    const userId = session?.user?.id || 'system';

    switch (type) {
      case 'COST': {
        const cost = await prisma.costTracking.update({
          where: { id },
          data: {
            status: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            approvedById: userId
          },
          include: {
            job: { select: { title: true } },
            createdBy: { select: { id: true } }
          }
        });

        // Notify the creator of the cost
        if (cost.createdById) {
          await sendUserNotification(
            cost.createdById,
            isApprove ? 'Masraf Onaylandı ✅' : 'Masraf Reddedildi ❌',
            isApprove 
              ? `"${cost.job?.title}" işi için girilen masraf onaylandı.` 
              : `Masraf reddedildi. Sebep: ${reason}`,
            isApprove ? 'SUCCESS' : 'ERROR',
            `/worker/jobs/${cost.jobId}`
          );
        }
        break;
      }
      
      case 'STEP': {
        const step = await prisma.jobStep.update({
          where: { id },
          data: {
            approvalStatus: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            approvedAt: isApprove ? new Date() : null,
            approvedById: userId
          },
          include: {
            job: {
              select: { 
                title: true, 
                creatorId: true,
                assignments: { select: { workerId: true } }
              }
            }
          }
        });

        // Notify worker and creator
        const recipients = new Set<string>();
        if (step.job.creatorId) recipients.add(step.job.creatorId);
        step.job.assignments.forEach(a => { if (a.workerId) recipients.add(a.workerId); });

        for (const recipientId of recipients) {
          await sendUserNotification(
            recipientId,
            isApprove ? 'Adım Onaylandı ✅' : 'Adım Reddedildi ❌',
            `"${step.job.title}" işindeki "${step.title}" adımı ${isApprove ? 'onaylandı' : 'reddedildi'}.`,
            isApprove ? 'SUCCESS' : 'INFO',
            `/worker/jobs/${step.jobId}`
          );
        }
        break;
      }

      case 'SUB_STEP': {
        const subStep = await prisma.jobSubStep.update({
          where: { id },
          data: {
            approvalStatus: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            approvedAt: isApprove ? new Date() : null,
            approvedById: userId
          },
          include: {
            step: {
              include: {
                job: {
                  select: { 
                    title: true, 
                    creatorId: true,
                    assignments: { select: { workerId: true } }
                  }
                }
              }
            }
          }
        });

        const recipients = new Set<string>();
        if (subStep.step.job.creatorId) recipients.add(subStep.step.job.creatorId);
        subStep.step.job.assignments.forEach(a => { if (a.workerId) recipients.add(a.workerId); });

        for (const recipientId of recipients) {
          await sendUserNotification(
            recipientId,
            isApprove ? 'Alt Adım Onaylandı ✅' : 'Alt Adım Reddedildi ❌',
            `"${subStep.step.job.title}" işindeki "${subStep.title}" alt adımı ${isApprove ? 'onaylandı' : 'reddedildi'}.`,
            isApprove ? 'SUCCESS' : 'INFO',
            `/worker/jobs/${subStep.step.jobId}`
          );
        }
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Successfully ${isApprove ? 'approved' : 'rejected'}` });

  } catch (error: any) {
    console.error('[APPROVALS_POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process approval action' },
      { status: 500 }
    );
  }
}
