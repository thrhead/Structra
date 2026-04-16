'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/lib/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Link } from '@/lib/navigation'
import { CheckCircle2, AlertTriangle, XCircle, Bell, Loader2, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { CustomSpinner } from '@/components/ui/custom-spinner';
export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Bildirimler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchNotifications()
    }
  }, [status])

  const handleDeleteNotification = async (id: string, link: string | null) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        if (link) {
          router.push(link)
        }
      } else {
        toast.error('Bildirim silinemedi.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Bir hata oluştu.')
    }
  }

  const groupNotificationsByDate = (notifications: any[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)

    return {
      today: notifications.filter(n => new Date(n.createdAt) >= today),
      yesterday: notifications.filter(n => {
        const date = new Date(n.createdAt)
        return date >= yesterday && date < today
      }),
      thisWeek: notifications.filter(n => {
        const date = new Date(n.createdAt)
        return date >= thisWeek && date < yesterday
      }),
      older: notifications.filter(n => new Date(n.createdAt) < thisWeek)
    }
  }

  const grouped = groupNotificationsByDate(notifications)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case 'WARNING': return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'ERROR': return <XCircle className="h-6 w-6 text-red-600" />
      default: return <Bell className="h-6 w-6 text-blue-600" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30'
      case 'WARNING': return 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30'
      case 'ERROR': return 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30'
      default: return 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30'
    }
  }

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      onClick={() => handleDeleteNotification(notification.id, notification.link)}
      className="cursor-pointer block"
    >
      <Card className={`hover:shadow-md transition-shadow ${
        !notification.isRead ? getNotificationBgColor(notification.type) : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                  {notification.title}
                </h4>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), { 
                  addSuffix: true,
                  locale: tr 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const NotificationGroup = ({ title, items }: { title: string, items: any[] }) => {
    if (items.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <CustomSpinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bildirimler</h1>
          <p className="text-slate-600 dark:text-slate-400">Güncel tüm bildirimleriniz ve duyurular.</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
              >
                <Check className="h-3.5 w-3.5" />
                Tümünü Oku
              </button>
              <button
                onClick={handleDeleteAllNotifications}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-red-200 dark:border-red-900/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Tümünü Sil
              </button>
            </>
          )}
          <Badge variant="secondary" className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none">
            {notifications.length} Bildirim
          </Badge>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-gray-500">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p>Henüz bir bildiriminiz bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <NotificationGroup title="Bugün" items={grouped.today} />
          <NotificationGroup title="Dün" items={grouped.yesterday} />
          <NotificationGroup title="Bu Hafta" items={grouped.thisWeek} />
          <NotificationGroup title="Daha Eski" items={grouped.older} />
        </>
      )}
    </div>
  )
}
