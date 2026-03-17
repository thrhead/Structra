'use client'

import { SessionProvider } from 'next-auth/react'
import { AblyProvider } from './ably-provider'
import { SyncProvider } from './sync-provider'
import { NotificationListener } from './notification-listener'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AblyProvider>
                <SyncProvider>
                    {children}
                    <NotificationListener />
                </SyncProvider>
            </AblyProvider>
        </SessionProvider>
    )
}
