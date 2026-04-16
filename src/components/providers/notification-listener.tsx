'use client'

import { useEffect } from 'react'
import { useAbly } from './ably-provider'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
    JobCompletedPayload,
    CostApprovedPayload,
    StepCompletedPayload,
    NotificationPayload,
} from '@/lib/socket-events'

export function NotificationListener() {
    const { client, isConnected } = useAbly()
    const { data: session } = useSession()

    useEffect(() => {
        if (!client || !isConnected || !session?.user?.id) return

        console.log(`[Ably] Web Listener: Subscribing to user:${session.user.id} and system channels`)

        // Subscribe to user-specific channel
        const userChannel = client.channels.get(`user:${session.user.id}`)
        
        // Subscribe to system-wide channel
        const systemChannel = client.channels.get('system')

        const handleJobCompleted = (data: JobCompletedPayload) => {
            toast.success('İş Tamamlandı', {
                description: `${data.title} işi ${data.completedBy} tarafından tamamlandı.`,
            })
        }

        const handleCostApproved = (data: CostApprovedPayload) => {
            toast.success('Masraf Onaylandı', {
                description: `${data.amount} ₺ tutarındaki masraf onaylandı.`,
            })
        }

        const handleStepCompleted = (data: StepCompletedPayload) => {
            toast.success('Adım Tamamlandı', {
                description: `${data.stepTitle} adımı tamamlandı.`,
            })
        }

        const handleGenericNotification = (data: NotificationPayload) => {
            const toastFn = data.type === 'success' ? toast.success :
                data.type === 'error' ? toast.error :
                    data.type === 'warning' ? toast.warning :
                        toast.info

            toastFn(data.title || 'Bildirim', {
                description: data.message,
            })

            // Dispatch event to refresh notification list in other components
            window.dispatchEvent(new CustomEvent('notification:refresh'))
        }

        // Catch-all message handler for better robustness and logging
        const onMessage = (message: any) => {
            console.log('[Ably] Received message:', message.name, message.data);
            
            const data = message.data;
            
            switch (message.name) {
                case 'job:completed':
                    handleJobCompleted(data as JobCompletedPayload);
                    break;
                case 'cost:approved':
                    handleCostApproved(data as CostApprovedPayload);
                    break;
                case 'step:completed':
                    handleStepCompleted(data as StepCompletedPayload);
                    break;
                case 'notification:new':
                case 'notification:refresh':
                    handleGenericNotification(data as NotificationPayload);
                    break;
                default:
                    console.log('[Ably] Event ignored or handled elsewhere:', message.name);
            }
        };

        // Subscribe to all events on both channels
        userChannel.subscribe(onMessage);
        systemChannel.subscribe(onMessage);

        return () => {
            console.log('[Ably] Web Listener: Unsubscribing from channels');
            userChannel.unsubscribe(onMessage);
            systemChannel.unsubscribe(onMessage);
        }
    }, [client, isConnected, session?.user?.id])

    return null
}
