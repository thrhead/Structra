import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helper'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    try {
        const session = await verifyAuth(request)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const ABLY_API_KEY = process.env.ABLY_API_KEY
        if (!ABLY_API_KEY || !ABLY_API_KEY.includes(':')) {
            return NextResponse.json({ error: 'Ably not configured' }, { status: 500 })
        }

        // Manual Token Request Generation (Bypasses Ably SDK bundling bugs)
        const [keyName, keySecret] = ABLY_API_KEY.split(':')
        const clientId = session.user.id
        const timestamp = Math.floor(Date.now())
        const nonce = crypto.randomBytes(16).toString('hex')
        
        const capability = JSON.stringify({
            [`user:${clientId}`]: ['subscribe', 'publish', 'presence'],
            'job:*': ['subscribe', 'publish', 'presence'],
            'system': ['subscribe'],
            'system:*': ['subscribe'],
        })

        // Construct the string to sign
        // Format: keyName + "\n" + ttl + "\n" + capability + "\n" + clientId + "\n" + timestamp + "\n" + nonce + "\n"
        const ttl = 3600000 // 1 hour in ms
        const stringToSign = [
            keyName,
            ttl,
            capability,
            clientId,
            timestamp,
            nonce
        ].join('\n') + '\n'

        const signature = crypto
            .createHmac('sha256', keySecret)
            .update(stringToSign)
            .digest('base64')

        const tokenRequest = {
            keyName,
            clientId,
            capability,
            timestamp,
            nonce,
            ttl, // Added missing ttl field
            mac: signature
        }

        return NextResponse.json(tokenRequest)
    } catch (error) {
        console.error('❌ Manual Ably auth error:', error)
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 })
    }
}
