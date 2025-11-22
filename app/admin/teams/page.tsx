'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeamDialog } from '@/components/admin/team-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, BriefcaseIcon, UsersIcon, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/admin/teams/list')
      if (res.ok) {
        const data = await res.json()
        setTeams(data)
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (teamId: string, teamName: string) => {
    if (confirm(`"${teamName}" ekibini silmek istediğinizden emin misiniz?`)) {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchTeams()
      } else {
        alert('Ekip silinemedi')
      }
    }
  }

  const filteredTeams = search
    ? teams.filter(team => team.name.toLowerCase().includes(search.toLowerCase()))
    : teams

  const stats = {
    total: teams.length,
    active: teams.filter(t => t.isActive).length,
    members: teams.reduce((sum, t) => sum + (t._count?.members || 0), 0)
  }

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ekipler</h2>
        <TeamDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">Toplam Ekip</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">Aktif Ekip</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">Toplam Üye</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.members}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ekip ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ekip Adı</TableHead>
              <TableHead>Lider</TableHead>
              <TableHead>Üye Sayısı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Oluşturma Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Ekip bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/teams/${team.id}`} className="hover:underline text-blue-600">
                      {team.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {team.lead?.name || <span className="text-muted-foreground">Atanmamış</span>}
                  </TableCell>
                  <TableCell>{team._count.members}</TableCell>
                  <TableCell>
                    <Badge variant={team.isActive ? 'default' : 'secondary'}>
                      {team.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(team.createdAt), 'd MMM yyyy', { locale: tr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TeamDialog
                        team={{
                          id: team.id,
                          name: team.name,
                          description: team.description,
                          leadId: team.leadId,
                          isActive: team.isActive
                        }}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(team.id, team.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
