'use client'

import { useEffect } from 'react'
import { useAbly } from './ably-provider'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
    JobCompletedPayload,
    CostSubmittedPayload,
    CostApprovedPayload,
    StepCompletedPayload,
    NotificationPayload,
} from '@/lib/socket-events'

export function NotificationListener() {
    const { client, isConnected } = useAbly()
    const { data: session } = useSession()

    useEffect(() => {
        if (!client || !isConnected || !session?.user?.id) return

        // Subscribe to user-specific channel
        const userChannel = client.channels.get(`user:${session.user.id}`)
        
        // Subscribe to system-wide channel
        const systemChannel = client.channels.get('system')

        const handleJobCompleted = (message: any) => {
            const data = message.data as JobCompletedPayload
            toast.success('İş Tamamlandı', {
                description: `${data.title} işi ${data.completedBy} tarafından tamamlandı.`,
            })
        }

        const handleCostSubmitted = (message: any) => {
            const data = message.data as CostSubmittedPayload
            toast.info('Yeni Masraf', {
                description: `${data.submittedBy} tarafından ${data.amount} ₺ masraf kaydedildi.`,
            })
        }

        const handleCostApproved = (message: any) => {
            const data = message.data as CostApprovedPayload
            toast.success('Masraf Onaylandı', {
                description: `${data.amount} ₺ tutarındaki masraf onaylandı.`,
            })
        }

        const handleStepCompleted = (message: any) => {
            const data = message.data as StepCompletedPayload
            toast.success('Adım Tamamlandı', {
                description: `${data.stepTitle} adımı tamamlandı.`,
            })
        }

        const handleGenericNotification = (message: any) => {
            const data = message.data as NotificationPayload
            const toastFn = data.type === 'success' ? toast.success :
                data.type === 'error' ? toast.error :
                    data.type === 'warning' ? toast.warning :
                        toast.info

            toastFn(data.title, {
                description: data.message,
            })

            // Dispatch event to refresh notification list in other components
            window.dispatchEvent(new CustomEvent('notification:refresh'))
        }

        // Add listeners to user channel
        userChannel.subscribe('job:completed', handleJobCompleted)
        userChannel.subscribe('cost:submitted', handleCostSubmitted)
        userChannel.subscribe('cost:approved', handleCostApproved)
        userChannel.subscribe('step:completed', handleStepCompleted)
        userChannel.subscribe('notification:new', handleGenericNotification)

        // Add listeners to system channel (redundant if also sent to user channel, but good for global broadcasts)
        systemChannel.subscribe('notification:new', handleGenericNotification)

        return () => {
            userChannel.unsubscribe()
            systemChannel.unsubscribe()
        }
    }, [client, isConnected, session?.user?.id])

    return null
}
