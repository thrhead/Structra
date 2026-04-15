import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { z } from 'zod'

const addAssignmentSchema = z.object({
    type: z.enum(['worker', 'team']),
    id: z.string()
})

export async function POST(
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
        const { type, id } = addAssignmentSchema.parse(body)

        const assignment = await prisma.jobAssignment.create({
            data: {
                jobId: params.id,
                workerId: type === 'worker' ? id : undefined,
                teamId: type === 'team' ? id : undefined
            }
        })

        // Send notification to the assigned worker or team members
        const { notifyJobAssignment } = await import('@/lib/notifications')
        if (type === 'worker') {
            notifyJobAssignment(params.id, [id]).catch(console.error)
        } else {
            // Fetch team members
            const team = await prisma.team.findUnique({
                where: { id },
                include: { members: true }
            })
            if (team && team.members.length > 0) {
                notifyJobAssignment(params.id, team.members.map(m => m.userId)).catch(console.error)
            }
        }

        return NextResponse.json({ success: true, assignment })
    } catch (error) {
        console.error('Add assignment error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const assignmentId = searchParams.get('id')

        if (!assignmentId) {
            return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 })
        }

        await prisma.jobAssignment.delete({
            where: { id: assignmentId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete assignment error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
