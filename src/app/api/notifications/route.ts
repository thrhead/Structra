import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'

export async function GET(req: Request) {
  try {
    const session = await verifyAuth(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false
        }
      })
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await verifyAuth(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { id } = body

    if (id) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: {
          id,
          userId: session.user.id
        },
        data: { isRead: true }
      })
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false
        },
        data: { isRead: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notifications update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await verifyAuth(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    console.log(`[API-Notifications] DELETE request received. ID: ${id || 'ALL'}, User: ${session.user.id}`);

    if (id) {
      // Delete specific notification
      const result = await prisma.notification.delete({
        where: {
          id,
          userId: session.user.id
        }
      })
      console.log(`[API-Notifications] Deleted single notification: ${id}`);
    } else {
      // Delete all notifications for the user
      const result = await prisma.notification.deleteMany({
        where: {
          userId: session.user.id
        }
      })
      console.log(`[API-Notifications] Bulk deleted notifications. Count: ${result.count}`);
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification deletion error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
