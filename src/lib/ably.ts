import * as Ably from 'ably'

const ABLY_API_KEY = process.env.ABLY_API_KEY

let ablyRest: Ably.Rest | null = null

export const getAblyRestClient = () => {
    if (!ABLY_API_KEY) {
        console.warn('⚠️ ABLY_API_KEY is not defined. Real-time features will not work.')
        return null
    }

    if (!ablyRest) {
        ablyRest = new Ably.Rest({ key: ABLY_API_KEY })
    }
    return ablyRest
}

export const publishToUser = async (userId: string, event: string, data: any) => {
    const client = getAblyRestClient()
    if (!client) return

    try {
        const channel = client.channels.get(`user:${userId}`)
        await channel.publish(event, data)
    } catch (error) {
        console.error(`❌ Error publishing to user ${userId}:`, error)
    }
}

export const publishToJob = async (jobId: string, event: string, data: any) => {
    const client = getAblyRestClient()
    if (!client) return

    try {
        const channel = client.channels.get(`job:${jobId}`)
        await channel.publish(event, data)
    } catch (error) {
        console.error(`❌ Error publishing to job ${jobId}:`, error)
    }
}

export const broadcast = async (event: string, data: any) => {
    const client = getAblyRestClient()
    if (!client) return

    try {
        const channel = client.channels.get('system')
        await channel.publish(event, data)
    } catch (error) {
        console.error('❌ Error broadcasting:', error)
    }
}
