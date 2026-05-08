import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'

export async function POST(
    req: Request,
    props: { params: Promise<{ stepId: string }> }
) {
    const params = await props.params
    try {
        const session = await verifyAuth(req)
        if (!session || !['ADMIN', 'MANAGER', 'CUSTOMER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const step = await prisma.jobStep.findUnique({
            where: { id: params.stepId },
            include: { job: true }
        })

        if (!step) {
            return NextResponse.json({ error: 'Step not found' }, { status: 404 })
        }

        // If the user is a CUSTOMER, they must own the job
        if (session.user.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { userId: session.user.id }
            });
            if (!customer || step.job.customerId !== customer.id) {
                return NextResponse.json({ error: 'Unauthorized: You do not own this job' }, { status: 403 })
            }
        }

        const updatedStep = await prisma.jobStep.update({
            where: { id: params.stepId },
            data: {
                approvalStatus: 'APPROVED',
                approvedById: session.user.id,
                approvedAt: new Date(),
                rejectionReason: null
            }
        })

        // Notify the worker who completed the step
        if (step.completedById) {
            const { sendJobNotification } = await import('@/lib/notification-helper');
            await sendJobNotification(
                step.jobId,
                'İş Adımı Onaylandı ✅',
                `"${step.job.title}" işindeki "${step.title}" adımı onaylandı.`,
                'SUCCESS',
                `/worker/jobs/${step.jobId}`
            );
        }

        return NextResponse.json(updatedStep)
    } catch (error) {
        console.error('Step approval error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
