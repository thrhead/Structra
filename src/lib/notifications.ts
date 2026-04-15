import { prisma } from './db'
import { sendNotificationToUsers, NotificationType } from './notification-helper'

export interface NotificationInput {
  userId: string
  title: string
  message: string
  type?: NotificationType
  link?: string | null
}

/**
 * Create a notification for a user (DB, Web and Mobile)
 */
export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  link
}: NotificationInput) {
  // Uses centralized helper for DB, Ably and Push notifications
  return await sendNotificationToUsers([userId], title, message, type, link || undefined)
}

/**
 * Notify workers when a job is assigned to them
 */
export async function notifyJobAssignment(jobId: string, workerIds: string[]) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  })

  if (!job) return

  await sendNotificationToUsers(
    workerIds,
    'Yeni İş Atandı',
    `${job.title} işi size atandı. Müşteri: ${job.customer.company}`,
    'INFO',
    `/worker/jobs/${jobId}`,
    { jobId }
  )
}

/**
 * Notify approver when a job is completed and needs approval
 */
export async function notifyJobCompletion(jobId: string, approverId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  })

  if (!job) return

  await createNotification({
    userId: approverId,
    title: 'İş Tamamlandı - Onay Bekliyor',
    message: `${job.title} işi tamamlandı ve onayınızı bekliyor.`,
    type: 'WARNING',
    link: `/admin/approvals`
  })
}

/**
 * Notify worker when their job completion is approved
 */
export async function notifyApprovalApproved(jobId: string, workerId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      assignments: {
        include: {
          team: {
            include: {
              members: true
            }
          }
        }
      }
    }
  })

  if (!job) return

  // Get all unique worker IDs associated with this job
  const workerIds = new Set<string>();
  workerIds.add(workerId); // The requester
  
  job.assignments.forEach(a => {
    if (a.workerId) workerIds.add(a.workerId);
    if (a.teamId && a.team) {
      a.team.members.forEach(m => workerIds.add(m.userId));
    }
  });

  const ids = Array.from(workerIds);

  await sendNotificationToUsers(
    ids,
    'İş Onaylandı',
    `${job.title} işiniz onaylandı. Tebrikler!`,
    'SUCCESS',
    `/worker/jobs/${jobId}`,
    { jobId }
  )
}

/**
 * Notify worker when their job completion is rejected
 */
export async function notifyApprovalRejected(jobId: string, workerId: string, notes?: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      assignments: {
        include: {
          team: {
            include: {
              members: true
            }
          }
        }
      }
    }
  })

  if (!job) return

  // Get all unique worker IDs
  const workerIds = new Set<string>();
  workerIds.add(workerId);
  
  job.assignments.forEach(a => {
    if (a.workerId) workerIds.add(a.workerId);
    if (a.teamId && a.team) {
      a.team.members.forEach(m => workerIds.add(m.userId));
    }
  });

  const ids = Array.from(workerIds);

  const message = notes
    ? `${job.title} işiniz reddedildi. Not: ${notes}`
    : `${job.title} işiniz reddedildi. Lütfen tekrar kontrol edin.`

  await sendNotificationToUsers(
    ids,
    'İş Reddedildi',
    message,
    'ERROR',
    `/worker/jobs/${jobId}`,
    { jobId }
  )
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  })

  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found or unauthorized')
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  })
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  })
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string) {
  return await prisma.notification.count({
    where: {
      userId,
      isRead: false
    }
  })
}

/**
 * Notify all admins and managers about approval result
 */
export async function notifyAdminsOfApprovalResult(
  jobId: string,
  approverId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  })

  if (!job) return

  const approver = await prisma.user.findUnique({
    where: { id: approverId }
  })

  // Get all admins, managers and team leads
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER', 'TEAM_LEAD'] },
      isActive: true
    }
  })

  const actionText = status === 'APPROVED' ? 'onaylandı' : 'reddedildi'
  const type = status === 'APPROVED' ? 'SUCCESS' : 'ERROR'
  const approverName = approver?.name || 'Bir yönetici'

  const adminIds = admins.map(a => a.id)

  await sendNotificationToUsers(
    adminIds,
    `İş ${status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}`,
    `${job.title} işi ${approverName} tarafından ${actionText}.${notes ? ` Not: ${notes}` : ''}`,
    type,
    `/admin/jobs/${jobId}`,
    { jobId, status }
  )
}

/**
 * Notify all admins and managers when a job is completed and waiting for approval
 */
export async function notifyAdminsOfJobCompletion(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  })

  if (!job) return

  // Get all admins, managers and team leads
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER', 'TEAM_LEAD'] },
      isActive: true
    }
  })

  const adminIds = admins.map(a => a.id)

  await sendNotificationToUsers(
    adminIds,
    'İş Tamamlandı - Onay Bekliyor',
    `${job.title} işi tamamlandı ve onayınızı bekliyor.`,
    'WARNING',
    `/admin/jobs/${jobId}`,
    { jobId }
  )
}
