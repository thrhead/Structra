import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { logger } from '@/lib/logger'
import { logAudit, AuditAction } from '@/lib/audit'

const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'TEAM_LEAD', 'WORKER', 'CUSTOMER']).optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional(),
})

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const session = await verifyAuth(req)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        
        // Platform detection
        const xPlatform = req.headers.get('x-platform');
        const userAgent = req.headers.get('user-agent') || '';
        const isMobileUA = /mobile|android|iphone|ipad|expo/i.test(userAgent);
        const platform = xPlatform || body.platform || (isMobileUA ? 'mobile' : 'web');

        const data = updateUserSchema.parse(body)

        const updateData: any = { ...data }

        if (data.password) {
            updateData.passwordHash = await hash(data.password, 12)
            delete updateData.password
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        })

        // LOGGING: Audit log for user update
        await logAudit(session.user.id, AuditAction.USER_UPDATE, {
            targetUserId: updatedUser.id,
            name: updatedUser.name,
            role: updatedUser.role,
            updates: Object.keys(data),
            platform: platform
        }, platform);

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('User update error:', error)
        logger.error('Failed to update user', { error: (error as Error).message, userId: (await props.params).id });
        if (error instanceof z.ZodError) {
            const errorMessage = error.issues.map(issue => issue.message).join(', ')
            return NextResponse.json({ error: errorMessage, details: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const session = await verifyAuth(req)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Prevent deleting yourself
        if (params.id === session.user.id) {
            return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 })
        }

        // Platform detection
        const xPlatform = req.headers.get('x-platform');
        const userAgent = req.headers.get('user-agent') || '';
        const isMobileUA = /mobile|android|iphone|ipad|expo/i.test(userAgent);
        const platform = xPlatform || (isMobileUA ? 'mobile' : 'web');

        // Get user details before deleting for log
        const userToDelete = await prisma.user.findUnique({
            where: { id: params.id },
            select: { name: true, email: true }
        })

        await prisma.user.delete({
            where: { id: params.id }
        })

        // LOGGING: Audit log for user deletion
        await logAudit(session.user.id, AuditAction.USER_DELETE, {
            targetUserId: params.id,
            name: userToDelete?.name,
            email: userToDelete?.email,
            platform: platform
        }, platform);

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('User delete error:', error)
        logger.error('Failed to delete user', { error: (error as Error).message, userId: params.id });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
