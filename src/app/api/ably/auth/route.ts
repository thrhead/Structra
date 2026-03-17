import Ably from 'ably'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helper'

export async function GET(request: Request) {
    try {
        const session = await verifyAuth(request)
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const client = new Ably.Rest(process.env.ABLY_API_KEY!)
        const tokenParams = {
            clientId: session.user.id,
        }

        const tokenRequest = await client.auth.createTokenRequest(tokenParams)
        return NextResponse.json(tokenRequest)
    } catch (error) {
        console.error('Ably auth error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
