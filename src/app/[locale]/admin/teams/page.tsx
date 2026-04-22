import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import Link from '@/lib/navigation'
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
import { getTeams, getTeamStats } from "@/lib/data/teams"
import { DeleteTeamButton } from "@/components/admin/delete-team-button"
import { prisma } from "@/lib/db"

export default async function TeamsPage(props: {
  searchParams: Promise<{ search?: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch teams, stats, and users for the dialog
  const [teams, stats, users] = await Promise.all([
    getTeams({ search: searchParams.search }),
    getTeamStats(),
    prisma.user.findMany({
        where: {
            role: { in: ['TEAM_LEAD', 'WORKER', 'ADMIN', 'MANAGER'] },
            isActive: true
        },
        select: { id: true, name: true, role: true }
    })
  ])

  // Helper to fetch members for a specific team (since we can't easily fetch nested relation IDs in the main query efficiently for all rows without overfetching, but actually we included members count. For the dialog we need member IDs.
  // Ideally, we should fetch member IDs when opening the dialog, but since we are doing SSG/SSR, we can pass them if the list is small, or better: Fetch them on demand?
  // Wait, the Dialog is rendered for EACH row. If we fetch all data for all rows it might be heavy.
  // But wait, the `TeamDialog` is used in two places:
  // 1. "New Team" button at top -> needs `users` list.
  // 2. "Edit" button in row -> needs `users` list AND `currentMembers`.

  // To optimize, let's fetch members for all displayed teams.
  const teamsWithMembers = await prisma.team.findMany({
      where: {
          id: { in: teams.map(t => t.id) }
      },
      select: {
          id: true,
          members: {
              select: { userId: true }
          }
      }
  })

  const membersMap = new Map(teamsWithMembers.map(t => [t.id, t.members.map(m => m.userId)]))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Operasyon</p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-0.5">Ekipler</h2>
        </div>
        <TeamDialog users={users} />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 stagger-children">
        <div className="group rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Toplam Ekip</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{stats.total}</p>
        </div>
        <div className="group rounded-3xl border border-emerald-100/80 dark:border-emerald-900/30 bg-white dark:bg-slate-900/80 shadow-sm p-5 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
              <BriefcaseIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Aktif Ekip</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{stats.active}</p>
        </div>
        <div className="group rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 bg-white dark:bg-slate-900/80 shadow-sm p-5 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Toplam Üye</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">{stats.members}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <form>
             <Input
                name="search"
                placeholder="Ekip ara..."
                defaultValue={searchParams.search}
                className="pl-9 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
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
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Ekip bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
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
                        users={users}
                        currentMembers={membersMap.get(team.id)}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteTeamButton teamId={team.id} teamName={team.name} />
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
