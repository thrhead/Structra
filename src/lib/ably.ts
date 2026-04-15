import * as Ably from 'ably'

let ablyRest: Ably.Rest | null = null

export const getAblyRestClient = () => {
    const ABLY_API_KEY = process.env.ABLY_API_KEY

    if (!ABLY_API_KEY) {
        console.warn('⚠️ ABLY_API_KEY is not defined. Real-time features will not work.')
        return null
    }

    if (!ablyRest) {
        try {
            console.log('--- Initializing Ably.Rest ---')
            console.log('Ably import type:', typeof Ably)
            // @ts-ignore
            console.log('Ably.Rest type:', typeof Ably.Rest)
            // @ts-ignore
            console.log('Ably.default type:', typeof Ably.default)
            
            // Check if Ably is actually the constructor (sometimes happens in certain build environments)
            if (typeof Ably.Rest === 'function') {
                ablyRest = new Ably.Rest({ key: ABLY_API_KEY })
            } else if (typeof Ably === 'function') {
                // @ts-ignore
                ablyRest = new (Ably as any)({ key: ABLY_API_KEY })
            } else if (Ably.default && typeof (Ably.default as any).Rest === 'function') {
                ablyRest = new (Ably.default as any).Rest({ key: ABLY_API_KEY })
            } else {
                console.error('❌ Could not find Ably.Rest constructor. Ably object keys:', Object.keys(Ably))
                throw new Error('Ably.Rest is not a constructor')
            }
            console.log('--- Ably.Rest Initialized successfully ---')
        } catch (error) {
            console.error('❌ Error initializing Ably.Rest:', error)
            throw error
        }
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
