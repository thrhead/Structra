import { getAblyRestClient } from '@/lib/ably'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helper'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    try {
        console.log('--- Ably Auth API Start ---')
        
        // 1. Verify Auth
        let session;
        try {
            console.log('Step 1: Verifying auth...')
            session = await verifyAuth(request)
            console.log('Auth result:', session ? `User ID: ${session.user?.id}` : 'No session')
        } catch (authError) {
            console.error('❌ Error in verifyAuth:', authError)
            throw new Error(`Auth verification failed: ${authError instanceof Error ? authError.message : String(authError)}`)
        }

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get Ably Client
        let client;
        try {
            console.log('Step 2: Getting Ably rest client...')
            client = getAblyRestClient()
            console.log('Ably client obtained:', !!client)
        } catch (clientError) {
            console.error('❌ Error in getAblyRestClient:', clientError)
            throw new Error(`Failed to get Ably client: ${clientError instanceof Error ? clientError.message : String(clientError)}`)
        }

        if (!client) {
            console.error('❌ Ably not configured: ABLY_API_KEY environment variable is missing on the server.')
            return NextResponse.json({ error: 'Ably not configured' }, { status: 500 })
        }

        // 3. Create Token Request
        let tokenRequestData;
        try {
            console.log('Step 3: Creating token request for client:', session.user.id)
            // Debug the client object structure
            console.log('Client type:', typeof client)
            console.log('Client has auth:', !!client.auth)
            if (client.auth) {
                console.log('Client.auth.createTokenRequest type:', typeof client.auth.createTokenRequest)
            }

            tokenRequestData = await client.auth.createTokenRequest({
                clientId: session.user.id,
                capability: {
                    [`user:${session.user.id}`]: ['subscribe', 'publish', 'presence'],
                    'job:*': ['subscribe', 'publish', 'presence'],
                    'system': ['subscribe'],
                    'system:*': ['subscribe'],
                }
            })
            console.log('Token request created successfully')
        } catch (tokenError) {
            console.error('❌ Error in createTokenRequest:', tokenError)
            // Log more details about the error
            if (tokenError instanceof Error) {
                console.error('Error name:', tokenError.name)
                console.error('Error stack:', tokenError.stack)
            }
            throw new Error(`Token request creation failed: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`)
        }

        return NextResponse.json(tokenRequestData)
    } catch (error) {
        console.error('❌ Final Ably auth error catch:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: errorMessage 
        }, { status: 500 })
    }
}
