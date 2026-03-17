import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect, Link } from "@/lib/navigation"
import Image from "next/image"
import {
  BriefcaseIcon,
  ReceiptIcon,
  TrendingUpIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ActivityIcon,
  UsersIcon,
  ShieldCheckIcon,
  FileTextIcon,
  ZapIcon,
  ArrowRightIcon,
  AlertCircleIcon
} from 'lucide-react'
import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import { PerformanceChart } from "@/components/charts/performance-chart"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const {
    activeWorkers,
    totalCostToday,
    budgetPercentage,
    pendingApprovalsCount,
    totalPendingCost,
    totalApprovedCost,
    weeklyStats,
    totalJobs,
    activeJobs,
    completedJobsToday,
    totalWorkers,
    activeTeams,
    latestLogs,
    pendingApprovals
  } = await getAdminDashboardData()

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarImage src={session?.user?.image || undefined} alt="Avatar" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Tekrar Hoşgeldiniz,</p>
            <h1 className="text-2xl font-bold text-foreground">{session?.user?.name || 'Admin Kullanıcı'}</h1>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Aktif İşler</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{activeJobs}</h3>
            <span className="text-muted-foreground text-xs">/ {totalJobs} toplam</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Bugün Biten</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{completedJobsToday}</h3>
            <span className="text-emerald-600 text-xs font-medium">Tamamlandı</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Ekip</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{totalWorkers}</h3>
            <span className="text-muted-foreground text-xs">{activeTeams} aktif ekip</span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Bekleyen Onay</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{pendingApprovalsCount}</h3>
            <span className="text-yellow-600 text-xs font-medium">İşlem bekliyor</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Performance & Status */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Chart */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Haftalık Tamamlanan Adımlar</h2>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm h-[400px]">
              <PerformanceChart data={weeklyStats} />
            </div>
          </div>

          {/* Quick Actions (Hızlı İşlemler) */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/jobs" className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <BriefcaseIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold group-hover:text-primary transition-colors">İşleri Yönet</span>
                </div>
              </Link>
              <Link href="/admin/jobs/gantt" className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <CalendarIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold group-hover:text-primary transition-colors">Gelişmiş Planlama</span>
                </div>
              </Link>
              <Link href="/admin/costs" className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <ReceiptIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold group-hover:text-primary transition-colors">Maliyetler</span>
                </div>
              </Link>
              <Link href="/admin/logs" className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <ActivityIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold group-hover:text-primary transition-colors">Sistem Logları</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Pending Approvals List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Bekleyen Onaylar</h2>
              <Link href="/admin/approvals" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                <div className="flex items-center gap-1">
                  Tümünü Yönet <ArrowRightIcon className="w-4 h-4" />
                </div>
              </Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval) => (
                  <div key={approval.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <ShieldCheckIcon className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{approval.job.title}</p>
                        <p className="text-muted-foreground text-xs">{approval.requester.name} • {approval.type}</p>
                      </div>
                    </div>
                    <Link href={`/admin/jobs/${approval.jobId}`} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-card border border-border p-6 rounded-xl text-center">
                  <p className="text-muted-foreground text-sm">Onay bekleyen işlem bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status & Activity */}
        <div className="space-y-8">
          {/* Recent Costs (Son Masraflar) */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Finansal Durum</h2>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Bugün Harcanan</p>
                  <p className="text-2xl font-bold text-foreground">₺{totalCostToday.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              <div className="w-full bg-secondary h-2.5 rounded-full mb-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
              <p className="text-muted-foreground text-xs mb-6">Günlük bütçenin <span className="font-medium text-foreground">%{budgetPercentage}</span>&apos;i kullanıldı</p>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-sm text-muted-foreground">Bekleyen</span>
                  </div>
                  <span className="text-sm font-semibold">₺{totalPendingCost.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-sm text-muted-foreground">Onaylanan</span>
                  </div>
                  <span className="text-sm font-semibold">₺{totalApprovedCost.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Status (Ekip Durumu) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Aktif Ekip</h2>
              <Link href="/admin/teams" className="text-primary text-xs font-medium hover:underline"><span>Tümünü Gör</span></Link>
            </div>
            <div className="space-y-3">
              {activeWorkers.length > 0 ? (
                activeWorkers.map((worker) => (
                  <div key={worker.id} className="bg-card border border-border p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8">
                        <Image
                          src={worker.avatarUrl || `https://ui-avatars.com/api/?name=${worker.name}&background=random`}
                          alt={worker.name || 'Worker'}
                          fill
                          className="rounded-full border border-border object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{worker.name}</p>
                        <p className="text-muted-foreground text-[10px]">Sahada / Aktif</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-card border border-border p-6 rounded-xl text-center">
                  <p className="text-muted-foreground text-xs">Aktif çalışan bulunamadı.</p>
                </div>
              )}
            </div>
          </div>

          {/* System Activity (Sistem Hareketleri) */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Sistem Logları</h2>
            <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
              <div className="divide-y divide-border">
                {latestLogs.length > 0 ? (
                  latestLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-1.5 rounded-md ${
                          log.level === 'ERROR' ? 'bg-red-50 text-red-600' : 
                          log.level === 'WARN' ? 'bg-yellow-50 text-yellow-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {log.level === 'ERROR' ? <AlertCircleIcon className="w-3.5 h-3.5" /> : 
                           log.level === 'WARN' ? <ZapIcon className="w-3.5 h-3.5" /> : 
                           <ActivityIcon className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-1">{log.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {log.user?.name || 'Sistem'} • {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground text-xs">Log kaydı bulunamadı.</p>
                  </div>
                )}
              </div>
              <Link href="/admin/logs" className="block w-full p-3 text-center text-xs font-medium text-primary hover:bg-secondary transition-colors border-t border-border">
                <span>Tüm Logları Görüntüle</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}