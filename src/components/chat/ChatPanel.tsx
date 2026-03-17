'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { CryptoService } from '@/lib/crypto-service'
import { offlineDB } from '@/lib/offline-db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Lock, Send, Loader2, CheckCheck, User, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Ably from 'ably'

interface Message {
    id: string
    content: string
    senderId: string
    sentAt: string
    isEncrypted: boolean
    readAt?: string | null
    sender: {
        id: string
        name: string | null
        avatarUrl: string | null
    }
}

interface ChatPanelProps {
    jobId: string
    title?: string
}

export function ChatPanel({ jobId, title }: ChatPanelProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const [isTyping, setIsTyping] = useState<string[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const ablyRef = useRef<Ably.Realtime | null>(null)
    const channelRef = useRef<Ably.RealtimeChannel | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted || !session?.user?.id) return

        const initAbly = async () => {
            const ably = new Ably.Realtime({
                authUrl: '/api/ably/auth',
            })
            ablyRef.current = ably

            const channel = ably.channels.get(`job:${jobId}`)
            channelRef.current = channel

            // Presence (Online Users)
            channel.presence.subscribe('enter', (member) => {
                setOnlineUsers((prev) => [...new Set([...prev, member.clientId])])
            })
            channel.presence.subscribe('leave', (member) => {
                setOnlineUsers((prev) => prev.filter(id => id !== member.clientId))
            })
            channel.presence.enter()
            channel.presence.get((err, members) => {
                if (!err && members) {
                    setOnlineUsers(members.map(m => m.clientId))
                }
            })

            // Receive Messages
            channel.subscribe('message', async (msg) => {
                const newMessage = msg.data as Message
                if (newMessage.isEncrypted) {
                    newMessage.content = await CryptoService.decrypt(newMessage.content)
                }
                setMessages((prev) => {
                    if (prev.find(m => m.id === newMessage.id)) return prev
                    return [...prev, newMessage]
                })

                // Mark as read if I'm receiving and it's not mine
                if (newMessage.senderId !== session.user.id) {
                    markMessageAsRead(newMessage.id)
                }
            })

            // Typing Indicators
            channel.subscribe('typing:start', (msg) => {
                if (msg.clientId !== session.user.id) {
                    setIsTyping((prev) => [...new Set([...prev, msg.data.userName || 'Biri'])])
                }
            })
            channel.subscribe('typing:stop', (msg) => {
                setIsTyping((prev) => prev.filter(name => name !== (msg.data.userName || 'Biri')))
            })

            // Read Status Updates
            channel.subscribe('message:read', (msg) => {
                const { messageId, readAt } = msg.data
                setMessages((prev) => prev.map(m =>
                    m.id === messageId ? { ...m, readAt } : m
                ))
            })

            loadMessages()
        }

        initAbly()

        return () => {
            if (channelRef.current) {
                channelRef.current.presence.leave()
                channelRef.current.unsubscribe()
            }
            if (ablyRef.current) {
                ablyRef.current.close()
            }
        }
    }, [jobId, mounted, session?.user?.id])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const loadMessages = async () => {
        try {
            setLoading(true)

            // 1. Load from Offline DB
            const localMessages = await offlineDB.messages
                .where('jobId')
                .equals(jobId)
                .sortBy('sentAt')
            if (localMessages.length > 0) {
                setMessages(localMessages as any)
            }

            // 2. Load from n8n API
            const response = await fetch(`https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/get-messages?jobId=${jobId}`)
            if (response.ok) {
                const data = await response.json()
                const processed = await Promise.all(data.map(async (msg: any) => {
                    if (msg.isEncrypted) {
                        msg.content = await CryptoService.decrypt(msg.content)
                    }
                    return msg
                }))
                setMessages(processed)
                await offlineDB.messages.bulkPut(processed)
            }
        } catch (error) {
            console.error('Chat load error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async () => {
        if (!inputText.trim() || !session?.user?.id) return

        const content = inputText.trim()
        setInputText('')

        try {
            const encryptedContent = await CryptoService.encrypt(content)
            const messageData = {
                id: crypto.randomUUID(),
                content: encryptedContent,
                jobId,
                senderId: session.user.id,
                sentAt: new Date().toISOString(),
                isEncrypted: true,
                sender: {
                    id: session.user.id,
                    name: session.user.name,
                    avatarUrl: (session.user as any).avatarUrl
                }
            }

            // Direct call to n8n receiver
            const response = await fetch('https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/ably-receiver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            })

            if (!response.ok) throw new Error('Send failed')

            // Ably will broadcast this message to others,
            // but we update local UI immediately for responsiveness
            setMessages((prev) => [...prev, { ...messageData, content }])

            // Stop typing indicator
            channelRef.current?.publish('typing:stop', { userName: session.user.name })

        } catch (error) {
            console.error('Send error:', error)
        }
    }

    const markMessageAsRead = (messageId: string) => {
        const readAt = new Date().toISOString()
        channelRef.current?.publish('message:read', { messageId, readAt })
        // Also notify n8n to update DB
        fetch('https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/ably-receiver', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, readAt, type: 'READ_UPDATE' })
        }).catch(console.error)
    }

    const handleTyping = () => {
        if (!channelRef.current || !session?.user?.name) return

        channelRef.current.publish('typing:start', { userName: session.user.name })

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            channelRef.current?.publish('typing:stop', { userName: session.user.name })
        }, 3000)
    }

    if (!mounted || loading) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-xl border bg-card/50 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex h-[600px] flex-col rounded-xl border bg-background shadow-2xl overflow-hidden border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <Circle className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-green-500 text-background border-2 border-background",
                            ablyRef.current?.connection.state === 'connected' ? "block" : "hidden"
                        )} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold leading-none">{title || 'Sohbet'}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            {onlineUsers.length} kişi çevrimiçi
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded-full border border-border/50">
                   <Lock className="h-3 w-3 text-green-500" />
                   <span className="text-[10px] font-medium text-muted-foreground">Şifreli</span>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-transparent to-muted/5">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <Send className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium italic">Henüz mesaj yok</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMine = msg.senderId === session?.user?.id
                        const prevMsg = messages[idx - 1]
                        const showAvatar = !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId)

                        return (
                            <div key={msg.id} className={cn("flex w-full group animate-in fade-in slide-in-from-bottom-2 duration-300", isMine ? "justify-end" : "justify-start")}>
                                <div className={cn("flex max-w-[85%] gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
                                    {!isMine && (
                                        <div className="w-8 flex-shrink-0">
                                            {showAvatar && (
                                                <Avatar className="h-8 w-8 ring-2 ring-background border border-border">
                                                    <AvatarImage src={msg.sender.avatarUrl || ''} />
                                                    <AvatarFallback className="bg-primary/5 text-[10px]">{msg.sender.name?.[0] || '?'}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )}
                                    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
                                        {showAvatar && (
                                            <span className="text-[10px] font-bold mb-1 ml-1 text-muted-foreground/80">
                                                {msg.sender.name}
                                            </span>
                                        )}
                                        <div className={cn(
                                            "rounded-2xl px-4 py-2.5 text-sm shadow-sm relative transition-all group-hover:shadow-md",
                                            isMine
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted/80 backdrop-blur-sm text-foreground rounded-tl-none border border-border/50"
                                        )}>
                                            <p className="break-words leading-relaxed">{msg.content}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1 px-1">
                                            <span className="text-[9px] font-medium opacity-50">
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMine && (
                                                msg.readAt ? (
                                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                                ) : (
                                                    <CheckCheck className="h-3 w-3 opacity-30" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
                {isTyping.length > 0 && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-muted/50 rounded-full px-4 py-2 flex items-center gap-2 border border-border/30">
                            <div className="flex gap-1">
                                <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" />
                                <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground italic">
                                {isTyping.join(', ')} yazıyor...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-background border-t border-border/50">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2 relative items-center"
                >
                    <div className="relative flex-1 group">
                        <Input
                            placeholder="Mesajınızı yazın..."
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value)
                                handleTyping()
                            }}
                            className="pr-10 h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                            <Lock className="h-4 w-4" />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all p-0 shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
