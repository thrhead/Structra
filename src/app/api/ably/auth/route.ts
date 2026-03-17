import { auth } from '@/lib/auth'
import { getAblyRestClient } from '@/lib/ably'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const client = getAblyRestClient()
        if (!client) {
            return NextResponse.json({ error: 'Ably not configured' }, { status: 500 })
        }

        const tokenRequestData = await client.auth.createTokenRequest({
            clientId: session.user.id,
        })

        return NextResponse.json(tokenRequestData)
    } catch (error) {
        console.error('❌ Ably auth error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
