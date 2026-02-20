import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { z } from 'zod'
import { EventBus } from '@/lib/event-bus'
import { checkConflict } from '@/lib/conflict-check'
import { logger } from '@/lib/logger'
import { logAudit, AuditAction } from '@/lib/audit'

const updateJobSchema = z.object({
    startedAt: z.string().optional().nullable(),
    completedDate: z.string().optional().nullable(),
    scheduledDate: z.string().optional().nullable(),
    scheduledEndDate: z.string().optional().nullable(),
})

const fullUpdateJobSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    customerId: z.string().min(1),
    teamId: z.string().optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    acceptanceStatus: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
    location: z.string().optional().nullable(),
    scheduledDate: z.string(),
    scheduledEndDate: z.string(),
    startedAt: z.string().optional().nullable(),
    completedDate: z.string().optional().nullable(),
    steps: z.array(z.any()).optional().nullable() // Basic validation for steps, detailed handling inside
})

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await props.params
        const body = await req.json()

        // Platform detection
        const xPlatform = req.headers.get('x-platform');
        const userAgent = req.headers.get('user-agent') || '';
        const isMobileUA = /mobile|android|iphone|ipad|expo/i.test(userAgent);
        const platform = xPlatform || body.platform || (isMobileUA ? 'mobile' : 'web');

        // Parse body with full schema
        const data = fullUpdateJobSchema.parse(body)

        // Seviye 3: Çatışma Kontrolü
        const currentJob = await prisma.job.findUnique({
            where: { id: params.id },
            select: { updatedAt: true }
        })
        const conflict = await checkConflict(req, currentJob?.updatedAt)
        if (conflict) return conflict

        const updatedJob = await prisma.job.update({
            where: { id: params.id },
            data: {
                title: data.title,
                description: data.description,
                customerId: data.customerId,
                assignments: data.teamId && data.teamId !== 'none' ? {
                    deleteMany: {},
                    create: { teamId: data.teamId }
                } : undefined,
                priority: data.priority,
                status: data.status,
                acceptanceStatus: data.acceptanceStatus,
                location: data.location,
                scheduledDate: new Date(data.scheduledDate),
                scheduledEndDate: new Date(data.scheduledEndDate),
                startedAt: data.startedAt ? new Date(data.startedAt) : null,
                completedDate: data.completedDate ? new Date(data.completedDate) : null,
            }
        })

        // Trigger side effects
        await EventBus.emit('job.updated', updatedJob);

        // LOGGING: Audit log for job update
        await logAudit(session.user.id, AuditAction.JOB_UPDATE, {
            jobId: updatedJob.id,
            title: updatedJob.title,
            jobNo: updatedJob.jobNo,
            updates: Object.keys(data),
            platform: platform
        }, platform);

        return NextResponse.json({ success: true, job: updatedJob })
    } catch (error) {
        console.error('Update job (PUT) error:', error)
        logger.error('Failed to update job (PUT)', { error: (error as Error).message });
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await props.params
        const body = await req.json()
        
        // Platform detection
        const xPlatform = req.headers.get('x-platform');
        const userAgent = req.headers.get('user-agent') || '';
        const isMobileUA = /mobile|android|iphone|ipad|expo/i.test(userAgent);
        const platform = xPlatform || body.platform || (isMobileUA ? 'mobile' : 'web');

        const { startedAt, completedDate, scheduledDate, scheduledEndDate } = updateJobSchema.parse(body)

        // Seviye 3: Çatışma Kontrolü
        const currentJob = await prisma.job.findUnique({
            where: { id: params.id },
            select: { updatedAt: true }
        })
        const conflict = await checkConflict(req, currentJob?.updatedAt)
        if (conflict) return conflict

        const updatedJob = await prisma.job.update({
            where: { id: params.id },
            data: {
                startedAt: startedAt ? new Date(startedAt) : (startedAt === null ? null : undefined),
                completedDate: completedDate ? new Date(completedDate) : (completedDate === null ? null : undefined),
                scheduledDate: scheduledDate ? new Date(scheduledDate) : (scheduledDate === null ? null : undefined),
                scheduledEndDate: scheduledEndDate ? new Date(scheduledEndDate) : (scheduledEndDate === null ? null : undefined),
                status: completedDate ? 'COMPLETED' : undefined 
            }
        })

        // Trigger side effects
        await EventBus.emit('job.updated', updatedJob);

        // LOGGING: Audit log for job update (PATCH)
        await logAudit(session.user.id, AuditAction.JOB_UPDATE, {
            jobId: updatedJob.id,
            title: updatedJob.title,
            jobNo: updatedJob.jobNo,
            updates: Object.keys(body),
            platform: platform
        }, platform);

        return NextResponse.json({ success: true, job: updatedJob })
    } catch (error) {
        console.error('Update job error:', error)
        logger.error('Failed to update job (PATCH)', { error: (error as Error).message });
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await props.params
        
        // Platform detection
        const xPlatform = req.headers.get('x-platform');
        const userAgent = req.headers.get('user-agent') || '';
        const isMobileUA = /mobile|android|iphone|ipad|expo/i.test(userAgent);
        const platform = xPlatform || (isMobileUA ? 'mobile' : 'web');

        // Check if job exists
        const job = await prisma.job.findUnique({
            where: { id: params.id }
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        await prisma.job.delete({
            where: { id: params.id }
        })

        // Trigger side effects
        await EventBus.emit('job.deleted', { id: params.id });

        // LOGGING: Audit log for job deletion
        await logAudit(session.user.id, AuditAction.JOB_DELETE, {
            jobId: params.id,
            title: job.title,
            jobNo: job.jobNo,
            platform: platform
        }, platform);

        return NextResponse.json({ success: true, message: 'Job deleted successfully' })
    } catch (error) {
        console.error('Delete job error:', error)
        logger.error('Failed to delete job', { error: (error as Error).message });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}