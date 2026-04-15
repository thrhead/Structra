import { prisma } from '../src/lib/db'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'

const expo = new Expo()

async function debugPushNotification() {
  const email = process.argv[2]
  if (!email) {
    console.log('Usage: npx tsx scripts/debug-push.ts <email>')
    process.exit(1)
  }

  console.log(`Searching for user: ${email}`)
  const user = await prisma.user.findUnique({
    where: { email },
    include: { pushTokens: true }
  })

  if (!user) {
    console.error('User not found')
    process.exit(1)
  }

  console.log(`User found: ${user.name} (ID: ${user.id})`)
  console.log(`Legacy pushToken field: ${user.pushToken}`)
  console.log(`PushToken table entries: ${user.pushTokens.length}`)

  const tokens = new Set<string>()
  if (user.pushToken) tokens.add(user.pushToken)
  user.pushTokens.forEach(pt => tokens.add(pt.token))

  if (tokens.size === 0) {
    console.error('No push tokens found for this user!')
    process.exit(1)
  }

  const messages: ExpoPushMessage[] = []
  for (const token of tokens) {
    console.log(`Checking token: ${token}`)
    const isValid = Expo.isExpoPushToken(token)
    console.log(`- Is valid Expo push token? ${isValid}`)
    
    if (isValid) {
      messages.push({
        to: token,
        sound: 'default',
        title: 'Debug Push Notification',
        body: 'This is a debug notification from server.',
        data: { test: true },
        priority: 'high',
        channelId: 'default',
      })
    }
  }

  if (messages.length === 0) {
    console.error('No valid push tokens found!')
    process.exit(1)
  }

  console.log(`Sending ${messages.length} messages...`)
  const chunks = expo.chunkPushNotifications(messages)
  for (const chunk of chunks) {
    try {
      console.log(`Sending chunk of ${chunk.length} messages...`)
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
      console.log('Ticket chunk received:', JSON.stringify(ticketChunk, null, 2))
    } catch (error) {
      console.error('Error sending chunk:', error)
    }
  }

  console.log('Done.')
}

debugPushNotification()
  .catch(err => console.error(err))
  .finally(() => process.exit(0))
