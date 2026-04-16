'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BellIcon, CheckIcon, Loader2Icon, Trash2Icon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

import { CustomSpinner } from '@/components/ui/custom-spinner';
interface Notification {
  id: string
  title: string
  message: string
  type: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications.slice(0, 5)) // Show only last 5
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Listen for real-time refresh events
    const handleRefresh = () => {
      fetchNotifications()
    }
    window.addEventListener('notification:refresh', handleRefresh)

    // Poll for new notifications every 30 seconds as a fallback
    const interval = setInterval(fetchNotifications, 30000)

    return () => {
      window.removeEventListener('notification:refresh', handleRefresh)
      clearInterval(interval)
    }
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notification.id })
        })
        fetchNotifications()
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    // Navigate to link
    if (notification.link) {
      router.push(notification.link)
    }
    setOpen(false)
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    try {
      await fetch('/api/notifications', {
        method: 'PATCH'
      })
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        fetchNotifications()
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleDeleteAllNotifications = async () => {
    if (!confirm('Tüm bildirimleri silmek istediğinize emin misiniz?')) return
    setLoading(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE'
      })
      if (response.ok) {
        setNotifications([])
        setUnreadCount(0)
        setOpen(false)
      }
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'WARNING':
        return '⚠️'
      case 'ERROR':
        return '❌'
      default:
        return '📢'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="relative z-50 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        <div className="relative flex items-center justify-center">
          <BellIcon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden shadow-2xl rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-sm">Bildirimler</span>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="h-6 text-[10px] px-2"
              >
                {loading ? (
                  <CustomSpinner className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <CheckIcon className="h-3 w-3 mr-1" />
                    Oku
                  </>
                )}
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAllNotifications}
                disabled={loading}
                className="h-6 text-[10px] px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                {loading ? (
                  <CustomSpinner className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Trash2Icon className="h-3 w-3 mr-1" />
                    Temizle
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Bildiriminiz bulunmuyor
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 group relative ${
                  !notification.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                }`}
              >
                  <span className="text-xl mt-1 leading-none">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">
                      {formatDistanceToNow(new Date(notification.createdAt), { 
                        addSuffix: true,
                        locale: tr 
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 mt-1">
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    )}
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-red-500"
                      title="Sil"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                router.push('/worker/notifications')
                setOpen(false)
              }}
              className="w-full p-3 text-center text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Tümünü Gör
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
