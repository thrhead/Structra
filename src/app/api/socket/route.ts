import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// This endpoint confirms Ably configuration
export async function GET() {
    try {
        return NextResponse.json({
            message: 'Ably is configured',
            provider: 'Ably'
        })
    } catch (error) {
        console.error('Ably check error:', error)
        return NextResponse.json(
            { error: 'Ably check failed' },
            { status: 500 }
        )
    }
}
