import { getAblyRestClient } from '@/lib/ably'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helper'

export async function GET(request: Request) {
    try {
        // Use verifyAuth which supports both JWT tokens (mobile) and session cookies (web)
        const session = await verifyAuth(request)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const client = getAblyRestClient()
        if (!client) {
            console.error('❌ Ably not configured: ABLY_API_KEY environment variable is missing on the server.')
            return NextResponse.json({ error: 'Ably not configured' }, { status: 500 })
        }

        const tokenRequestData = await client.auth.createTokenRequest({
            clientId: session.user.id,
            capability: {
                [`user:${session.user.id}`]: ['subscribe', 'publish', 'presence'],
                'job:*': ['subscribe', 'publish', 'presence'],
                'system': ['subscribe'],
                'system:*': ['subscribe'],
            }
        })

        return NextResponse.json(tokenRequestData)
    } catch (error) {
        console.error('❌ Ably auth error details:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: errorMessage 
        }, { status: 500 })
    }
}
