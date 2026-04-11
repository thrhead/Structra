import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    // For job steps, we default approved by a system string if not using a specific user session initially
    // In a real app we'd get the user from session: const session = await auth();

    switch (type) {
      case 'COST':
        await prisma.costTracking.update({
          where: { id },
          data: {
            status: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            // approvedById: session.user.id
          }
        });
        break;
      
      case 'STEP':
        await prisma.jobStep.update({
          where: { id },
          data: {
            approvalStatus: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            approvedAt: isApprove ? new Date() : null,
          }
        });
        break;

      case 'SUB_STEP':
        await prisma.jobSubStep.update({
          where: { id },
          data: {
            approvalStatus: isApprove ? 'APPROVED' : 'REJECTED',
            rejectionReason: !isApprove ? reason : null,
            approvedAt: isApprove ? new Date() : null,
          }
        });
        break;

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
