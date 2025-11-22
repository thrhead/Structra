'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import { TeamStats } from '@/components/admin/team-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TeamDetail {
    id: string
    name: string
    description: string
    members: Array<{
        user: {
            name: string
            email: string
        }
        joinedAt: string
        role: string
    }>
}

export default function TeamDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [team, setTeam] = useState<TeamDetail | null>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch team details (we can reuse the existing GET endpoint or create a specific one)
                // For now, let's assume we need to fetch basic info + stats
                // We might need to update the GET endpoint to return members with joinedAt

                // 1. Fetch Stats
                const statsRes = await fetch(`/api/admin/teams/${params.id}/stats`)
                if (statsRes.ok) {
                    const statsData = await statsRes.json()
                    setStats(statsData)
                }

                // 2. Fetch Team Details (using existing list endpoint logic but for single team)
                // Since we don't have a specific GET /api/admin/teams/[id] that returns full details including members
                // We should probably update that endpoint or fetch from a new one.
                // Let's try to fetch from the existing endpoint if it supports GET

                // Actually, let's create a specific fetch here or update the API.
                // For now, I'll fetch the list and find the team (inefficient but works for MVP)
                // OR better: Update the GET /api/admin/teams/[id] to return details.
                // Wait, I see I only implemented DELETE and PATCH in [id]/route.ts.
                // I should add GET to [id]/route.ts first.

                const teamRes = await fetch(`/api/admin/teams/${params.id}`)
                if (teamRes.ok) {
                    const teamData = await teamRes.json()
                    setTeam(teamData)
                }

            } catch (error) {
                console.error('Failed to fetch team details:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchData()
        }
    }, [params.id])

    if (loading) {
        return <div className="p-8">Yükleniyor...</div>
    }

    if (!team) {
        return <div className="p-8">Ekip bulunamadı</div>
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Geri Dön
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
                    <p className="text-muted-foreground">{team.description || 'Açıklama yok'}</p>
                </div>
            </div>

            {/* Stats Section */}
            {stats && <TeamStats stats={stats} />}

            {/* Members Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Ekip Üyeleri
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {team.members?.map((member: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{member.role || 'Üye'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Katılma: {format(new Date(member.joinedAt), 'd MMMM yyyy', { locale: tr })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!team.members || team.members.length === 0) && (
                            <p className="text-muted-foreground text-center py-4">Henüz üye yok</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
