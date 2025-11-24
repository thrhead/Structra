<<<<<<< Updated upstream
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
=======
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
>>>>>>> Stashed changes

export async function GET(request: NextRequest) {
  try {
<<<<<<< Updated upstream
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
=======
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
>>>>>>> Stashed changes
    }

    const limit = request.nextUrl.searchParams.get('limit') || '20';
    
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('[Notifications] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type = 'INFO', jobId } = body;

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        title,
        message,
        type,
        jobId,
        read: false,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('[Notifications] Create Error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
