'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageSquare, Clock, Filter, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface Conversation {
    id: string
    title: string
    lastMessage?: {
        content: string
        sentAt: string
    }
    unreadCount: number
    jobId: string
}

export default function MessagesPage() {
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.id) {
            fetchConversations()
        }
    }, [session?.user?.id])

    const fetchConversations = async () => {
        try {
            setLoading(true)
            // fetch from n8n or local api
            const response = await fetch(`https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/get-messages?userId=${session?.user?.id}&type=conversations`)
            if (response.ok) {
                const data = await response.json()
                setConversations(data)
                if (data.length > 0) setSelectedJobId(data[0].jobId)
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 h-[calc(100vh-100px)]">
            <div className="grid grid-cols-12 gap-6 h-full">
                {/* Sidebar - Conversation List */}
                <Card className="col-span-12 md:col-span-4 flex flex-col overflow-hidden border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <div className="p-4 border-b space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Mesajlar
                            </h2>
                            <div className="p-2 rounded-full hover:bg-muted cursor-pointer transition-colors">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Sohbetlerde ara..."
                                className="pl-9 bg-muted/50 border-none rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-10 text-center space-y-3 opacity-40">
                                <MessageSquare className="h-10 w-10 mx-auto" />
                                <p className="text-sm font-medium">Sohbet bulunamadı</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedJobId(conv.jobId)}
                                    className={cn(
                                        "p-4 flex items-start gap-3 cursor-pointer transition-all hover:bg-primary/5 border-l-4",
                                        selectedJobId === conv.jobId
                                            ? "bg-primary/10 border-primary"
                                            : "border-transparent"
                                    )}
                                >
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-background">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-sm truncate">{conv.title}</h4>
                                            {conv.lastMessage && (
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(conv.lastMessage.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        {conv.lastMessage && (
                                            <p className="text-xs text-muted-foreground truncate leading-relaxed">
                                                {conv.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Main Content - Active Chat */}
                <div className="col-span-12 md:col-span-8 h-full">
                    {selectedJobId ? (
                        <ChatPanel
                            jobId={selectedJobId}
                            title={conversations.find(c => c.jobId === selectedJobId)?.title}
                        />
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center border-dashed border-2 opacity-50 bg-muted/20">
                            <div className="p-6 rounded-full bg-muted mb-4">
                                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold">Bir sohbet seçin</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Mesajlaşmaya başlamak için soldaki listeden bir iş seçin.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
