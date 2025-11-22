import { prisma } from './db'

export interface NotificationInput {
  userId: string
  title: string
  message: string
  type?: string
  link?: string | null
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  link
}: NotificationInput) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link: link || null,
      isRead: false
    }
  })
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

  const notifications = workerIds.map(workerId => ({
    userId: workerId,
    title: 'Yeni İş Atandı',
    message: `${job.title} işi size atandı. Müşteri: ${job.customer.company}`,
    type: 'INFO',
    link: `/worker/jobs/${jobId}`
  }))

  await prisma.notification.createMany({
    data: notifications
  })
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
    where: { id: jobId }
  })

  if (!job) return

  await createNotification({
    userId: workerId,
    title: 'İş Onaylandı',
    message: `${job.title} işiniz onaylandı. Tebrikler!`,
    type: 'SUCCESS',
    link: `/worker/jobs/${jobId}`
  })
}

/**
 * Notify worker when their job completion is rejected
 */
export async function notifyApprovalRejected(jobId: string, workerId: string, notes?: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) return

  const message = notes 
    ? `${job.title} işiniz reddedildi. Not: ${notes}`
    : `${job.title} işiniz reddedildi. Lütfen tekrar kontrol edin.`

  await createNotification({
    userId: workerId,
    title: 'İş Reddedildi',
    message,
    type: 'ERROR',
    link: `/worker/jobs/${jobId}`
  })
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
