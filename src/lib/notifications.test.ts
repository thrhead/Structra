import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  sendPushNotificationToUser, 
  createNotification,
  notifyJobAssignment
} from './notifications'
import { prisma } from './db'
import { publishToUser } from './ably'
import { sendPushNotification } from './push-notification'

// Mock dependencies
vi.mock('./db', () => ({
  prisma: {
    pushToken: {
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
    job: {
      findUnique: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    }
  }
}))

vi.mock('./ably', () => ({
  publishToUser: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./push-notification', () => ({
  sendPushNotification: vi.fn().mockResolvedValue([{ status: 'ok', id: 'test-id' }]),
}))

describe('Notification Logic (Issue #72)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendPushNotificationToUser', () => {
    it('should fetch tokens and send push notifications', async () => {
      const mockTokens = [
        { id: '1', token: 'ExponentPushToken[111]', userId: 'user1' },
        { id: '2', token: 'ExponentPushToken[222]', userId: 'user1' }
      ]
      
      vi.mocked(prisma.pushToken.findMany).mockResolvedValue(mockTokens as any)
      
      await sendPushNotificationToUser('user1', 'Title', 'Message')
      
      expect(prisma.pushToken.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' }
      })
      
      expect(sendPushNotification).toHaveBeenCalledTimes(2)
      expect(sendPushNotification).toHaveBeenCalledWith(expect.objectContaining({
        to: 'ExponentPushToken[111]',
        title: 'Title',
        body: 'Message'
      }))
    })

    it('should delete token if Expo returns DeviceNotRegistered', async () => {
      const mockTokens = [
        { id: '1', token: 'ExponentPushToken[invalid]', userId: 'user1' }
      ]
      
      vi.mocked(prisma.pushToken.findMany).mockResolvedValue(mockTokens as any)
      vi.mocked(sendPushNotification).mockResolvedValue([
        { status: 'error', message: 'DeviceNotRegistered', details: { error: 'DeviceNotRegistered' } } as any
      ])
      
      await sendPushNotificationToUser('user1', 'Title', 'Message')
      
      expect(prisma.pushToken.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should delete token if sendPushNotification throws DeviceNotRegistered error', async () => {
      const mockTokens = [
        { id: '1', token: 'ExponentPushToken[invalid]', userId: 'user1' }
      ]
      
      vi.mocked(prisma.pushToken.findMany).mockResolvedValue(mockTokens as any)
      vi.mocked(sendPushNotification).mockRejectedValue(new Error('DeviceNotRegistered'))
      
      await sendPushNotificationToUser('user1', 'Title', 'Message')
      
      expect(prisma.pushToken.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })
  })

  describe('createNotification', () => {
    it('should create DB record, publish to Ably, and send push notification', async () => {
      const mockNotification = {
        id: 'notif1',
        userId: 'user1',
        title: 'Test',
        message: 'Hello',
        type: 'INFO',
        link: '/test',
        createdAt: new Date()
      }
      
      vi.mocked(prisma.notification.create).mockResolvedValue(mockNotification as any)
      vi.mocked(prisma.pushToken.findMany).mockResolvedValue([])
      
      await createNotification({
        userId: 'user1',
        title: 'Test',
        message: 'Hello',
        link: '/test'
      })
      
      expect(prisma.notification.create).toHaveBeenCalled()
      expect(publishToUser).toHaveBeenCalledWith('user1', 'notification:new', expect.anything())
      // sendPushNotificationToUser is called internally, which calls prisma.pushToken.findMany
      expect(prisma.pushToken.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' }
      })
    })
  })

  describe('notifyJobAssignment', () => {
    it('should notify each worker individually', async () => {
      const mockJob = {
        id: 'job1',
        title: 'Fix AC',
        customer: { company: 'AC Corp' }
      }
      
      vi.mocked(prisma.job.findUnique).mockResolvedValue(mockJob as any)
      vi.mocked(prisma.notification.create).mockResolvedValue({ id: 'n1' } as any)
      vi.mocked(prisma.pushToken.findMany).mockResolvedValue([])
      
      await notifyJobAssignment('job1', ['worker1', 'worker2'])
      
      expect(prisma.notification.create).toHaveBeenCalledTimes(2)
      expect(prisma.pushToken.findMany).toHaveBeenCalledTimes(2)
    })
  })
})
