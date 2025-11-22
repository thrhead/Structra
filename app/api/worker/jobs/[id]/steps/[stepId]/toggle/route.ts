import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string; stepId: string }> }
) {
  const params = await props.params
  try {
    const session = await auth()
    if (!session || (session.user.role !== 'WORKER' && session.user.role !== 'TEAM_LEAD')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const step = await prisma.jobStep.findUnique({
      where: { id: params.stepId }
    })

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    const updatedStep = await prisma.jobStep.update({
      where: { id: params.stepId },
      data: {
        isCompleted: !step.isCompleted,
        completedAt: !step.isCompleted ? new Date() : null
      }
    })

    return NextResponse.json(updatedStep)
  } catch (error) {
    console.error('Step toggle error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
