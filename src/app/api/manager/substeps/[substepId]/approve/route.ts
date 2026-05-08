import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth-helper';
import { sendJobNotification } from '@/lib/notification-helper';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: Promise<{ substepId: string }> }) {
    try {
        const session = await verifyAuth(request);

        if (!session || !['ADMIN', 'MANAGER', 'CUSTOMER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const paramsValue = await params;
        console.log('Approve Substep Params:', paramsValue);
        const { substepId } = paramsValue;
        console.log('Substep ID:', substepId);

        const existingSubstep = await prisma.jobSubStep.findUnique({
            where: { id: substepId },
            include: {
                step: {
                    include: {
                        job: true
                    }
                }
            }
        });

        if (!existingSubstep) {
            return NextResponse.json({ error: 'Substep not found' }, { status: 404 });
        }

        // If the user is a CUSTOMER, they must own the job
        if (session.user.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { userId: session.user.id }
            });
            if (!customer || existingSubstep.step.job.customerId !== customer.id) {
                return NextResponse.json({ error: 'Unauthorized: You do not own this job' }, { status: 403 });
            }
        }

        const substep = await prisma.jobSubStep.update({
            where: { id: substepId },
            data: {
                approvalStatus: 'APPROVED',
                approvedById: session.user.id,
                approvedAt: new Date(),
                rejectionReason: null, // Clear rejection reason if approved
            },
            include: {
                step: {
                    include: {
                        job: true
                    }
                }
            }
        });

        await sendJobNotification(
            substep.step.jobId,
            'Alt Görev Onaylandı',
            `"${substep.step.job.title}" işindeki "${substep.title}" alt görevi onaylandı.`,
            'SUCCESS',
            `/worker/jobs/${substep.step.jobId}`
        );

        return NextResponse.json(substep);
    } catch (error) {
        console.error('Error approving substep:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
