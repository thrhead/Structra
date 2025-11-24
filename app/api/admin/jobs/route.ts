<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'
=======
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { jobCreationSchema } from '@/lib/validations';
>>>>>>> Stashed changes

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

<<<<<<< Updated upstream
export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const data = createJobSchema.parse(body)

        // Verify existence of foreign keys
        const customerExists = await prisma.customer.findUnique({ where: { id: data.customerId } })
        if (!customerExists) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 400 })
        }

        const creatorExists = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!creatorExists) {
            return NextResponse.json({ error: 'Creator user not found' }, { status: 400 })
        }

        if (data.teamId) {
            const teamExists = await prisma.team.findUnique({ where: { id: data.teamId } })
            if (!teamExists) {
                return NextResponse.json({ error: 'Team not found' }, { status: 400 })
            }
        }

        const newJob = await prisma.job.create({
            data: {
                title: data.title,
                description: data.description,
                customerId: data.customerId,
                creatorId: session.user.id,
                priority: data.priority,
                location: data.location,
                scheduledDate: data.scheduledDate,
                scheduledEndDate: data.scheduledEndDate,
                status: 'PENDING',
                steps: data.steps
                    ? {
                        create: data.steps.map((step, idx) => ({
                            title: step.title,
                            description: step.description,
                            order: idx + 1,
                            subSteps: step.subSteps
                                ? {
                                    create: step.subSteps.map((sub, sIdx) => ({
                                        title: sub.title,
                                        order: sIdx + 1
                                    }))
                                }
                                : undefined
                        }))
                    }
                    : undefined
            },
            include: {
                customer: { include: { user: true } },
                steps: { include: { subSteps: true } }
            }
        })

        if (data.teamId) {
            await prisma.jobAssignment.create({
                data: {
                    jobId: newJob.id,
                    teamId: data.teamId
                }
            })
        }

        return NextResponse.json(newJob, { status: 201 })
    } catch (error) {
        console.error('Job creation error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 })
=======
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
>>>>>>> Stashed changes
    }

    const { searchParams } = new URL(request.url);
    const where: any = {};

    const status = searchParams.get('status');
    if (status && status !== 'all') where.status = status;

    const priority = searchParams.get('priority');
    if (priority && priority !== 'all') where.priority = priority;

    const teamId = searchParams.get('teamId');
    if (teamId && teamId !== 'all') {
      where.assignments = { some: { teamId } };
    }

    const customerId = searchParams.get('customerId');
    if (customerId && customerId !== 'all') where.customerId = customerId;

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate.gte = new Date(startDate);
      if (endDate) where.scheduledDate.lte = new Date(endDate);
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        customer: { include: { user: true } },
        steps: { include: { subSteps: true } },
        assignments: { include: { team: true } },
        creator: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[Job Creation] Request body:', body);

    // Validate request body
    const validatedData = jobCreationSchema.parse(body);
    console.log('[Job Creation] Parsed data:', JSON.stringify(validatedData, null, 2));

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: validatedData.customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log('[Job Creation] Customer exists:', !!customer);

    // Check if creator (user) exists
    const creator = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    console.log('[Job Creation] Creator exists:', !!creator);

    if (!creator) {
      console.log('[Job Creation] Creator NOT FOUND:', session.user.id);
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: validatedData.teamId }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    console.log('[Job Creation] Team exists:', !!team);

    // Create the job with steps and sub-steps
    const jobData = {
      title: validatedData.title,
      description: validatedData.description,
      location: validatedData.location,
      priority: validatedData.priority,
      scheduledDate: new Date(validatedData.scheduledDate),
      customerId: validatedData.customerId,
      createdById: session.user.id,
      status: 'PLANNED',
      steps: {
        create: validatedData.steps.map(step => ({
          title: step.title,
          description: step.description,
          order: step.order || 0,
          subSteps: {
            create: step.subSteps?.map(subStep => ({
              title: subStep.title,
              description: subStep.description,
              order: subStep.order || 0
            })) || []
          }
        }))
      }
    };

    console.log('[Job Creation] Creating job in database...');

    const job = await prisma.job.create({
      data: jobData,
      include: {
        steps: {
          include: {
            subSteps: true
          }
        }
      }
    });

    console.log('[Job Creation] Job created:', job.id);

    // Assign the team to the job
    await prisma.jobAssignment.create({
      data: {
        jobId: job.id,
        teamId: validatedData.teamId,
        assignedById: session.user.id,
        assignedAt: new Date()
      }
    });

    console.log('[Job Creation] Assigning team:', validatedData.teamId);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('[Job Creation] FULL JOB CREATION ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to create job', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
