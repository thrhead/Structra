
import { createNotification, sendPushNotificationToUser } from '../src/lib/notifications'
import { prisma } from '../src/lib/db'

async function testPushNotifications() {
  console.log('Starting push notification test...')

  // 1. Find a user to test with
  const user = await prisma.user.findFirst({
    where: { isActive: true }
  })

  if (!user) {
    console.error('No active user found for testing')
    return
  }

  console.log(`Testing with user: ${user.name} (${user.id})`)

  // 2. Add a mock push token if none exists
  const existingToken = await prisma.pushToken.findFirst({
    where: { userId: user.id }
  })

  let testTokenId = ''
  if (!existingToken) {
    console.log('Creating mock push token...')
    const newToken = await prisma.pushToken.create({
      data: {
        userId: user.id,
        token: 'ExponentPushToken[mock_token_for_test]'
      }
    })
    testTokenId = newToken.id
  } else {
    testTokenId = existingToken.id
  }

  // 3. Trigger a notification
  console.log('Creating a test notification...')
  try {
    const notification = await createNotification({
      userId: user.id,
      title: 'Test Bildirimi',
      message: 'Bu bir test push bildirimidir.',
      type: 'INFO',
      link: '/test'
    })
    console.log('Notification created successfully:', notification.id)
  } catch (error) {
    console.error('Error creating notification:', error)
  }

  // 4. Clean up if we created a mock token
  if (!existingToken && testTokenId) {
    // We leave it for now or delete it
    // await prisma.pushToken.delete({ where: { id: testTokenId } })
  }

  console.log('Test completed. Check server logs for Expo SDK output (will likely fail due to mock token).')
}

testPushNotifications()
  .catch(err => console.error('Test script failed:', err))
  .finally(() => process.exit(0))
