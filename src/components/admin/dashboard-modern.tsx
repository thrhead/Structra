'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/lib/navigation"
import Image from "next/image"
import {
  BriefcaseIcon,
  ReceiptIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ActivityIcon,
  UsersIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  SparklesIcon,
  LayoutGridIcon
} from 'lucide-react'
import { PerformanceChart } from "@/components/charts/performance-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardModernProps {
  session: any
  data: any
}

export function DashboardModern({ session, data }: DashboardModernProps) {
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
  } = data

  const stats = [
    {
      title: "Aktif İşler",
      value: activeJobs,
      sub: `/ ${totalJobs} toplam`,
      icon: BriefcaseIcon,
      color: "bg-blue-500",
      accent: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Bugün Biten",
      value: completedJobsToday,
      sub: "Tamamlandı",
      icon: CheckCircleIcon,
      color: "bg-emerald-500",
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Saha Ekibi",
      value: totalWorkers,
      sub: `${activeTeams} aktif ekip`,
      icon: UsersIcon,
      color: "bg-violet-500",
      accent: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      title: "Bekleyen Onay",
      value: pendingApprovalsCount,
      sub: "İşlem bekliyor",
      icon: ClockIcon,
      color: "bg-amber-500",
      accent: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8 pb-24">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -m-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-20 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
               <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
              <Avatar className="h-20 w-20 border-4 border-white/20 relative">
                <AvatarImage src={session?.user?.image || undefined} alt="Avatar" className="object-cover" />
                <AvatarFallback className="bg-white text-indigo-600 font-bold text-2xl">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SparklesIcon className="w-4 h-4 text-yellow-300" />
                <p className="text-indigo-100 text-sm font-medium tracking-wide uppercase">Yönetici Paneli</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Hoş geldin, <span className="text-yellow-300">{session?.user?.name?.split(' ')[0] || 'Admin'}</span>!
              </h1>
              <p className="mt-2 text-indigo-50/80 max-w-md text-sm md:text-base">
                Proje durumu stabil. Bugün tamamlanması gereken <span className="font-bold text-white">{activeJobs} aktif iş</span> seni bekliyor.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center min-w-[100px]">
                <span className="text-indigo-100 text-xs font-semibold mb-1 uppercase">Aktif</span>
                <span className="text-2xl font-black text-white">{activeWorkers.length}</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center min-w-[100px]">
                <span className="text-indigo-100 text-xs font-semibold mb-1 uppercase">Onay</span>
                <span className="text-2xl font-black text-white">{pendingApprovalsCount}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-card border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:blur-xl transition-all`}></div>
            <div className="flex items-start justify-between relative">
              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
                  <span className="text-muted-foreground text-[10px] font-medium">{stat.sub}</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.accent} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Performance (Lg: 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Chart Card */}
          <div className="bg-card border border-border rounded-[2.5rem] shadow-sm p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/5 text-indigo-500 border-indigo-500/20 px-3 py-1">Haftalık</Badge>
              <LayoutGridIcon className="w-5 h-5 text-muted-foreground/30" />
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                Haftalık Performans
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Tamamlanan iş adımlarının günlere göre dağılımı</p>
            </div>
            <div className="h-[350px] w-full">
              <PerformanceChart data={weeklyStats} vibrant />
            </div>
          </div>

          {/* New Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Large Action Card 1 */}
             <Link href="/admin/jobs" className="group p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                <div className="bg-card h-full w-full rounded-[2.4rem] p-8 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">İş Akışını Yönet</h3>
                    <p className="text-muted-foreground text-sm">Tüm aktif işleri ve ekipleri koordine et</p>
                    <div className="pt-2 flex items-center gap-2 text-indigo-500 font-bold text-sm group-hover:gap-4 transition-all uppercase tracking-wider">
                      Şimdi Başla <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-6 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500 text-indigo-500 group-hover:text-white transition-all duration-300">
                    <BriefcaseIcon className="w-10 h-10" />
                  </div>
                </div>
             </Link>

             {/* Large Action Card 2 */}
             <Link href="/admin/costs" className="group p-1 rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg hover:shadow-rose-500/20 transition-all duration-300">
                <div className="bg-card h-full w-full rounded-[2.4rem] p-8 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Maliyet Analizi</h3>
                    <p className="text-muted-foreground text-sm">Harcanan bütçeyi ve giderleri takip et</p>
                    <div className="pt-2 flex items-center gap-2 text-rose-500 font-bold text-sm group-hover:gap-4 transition-all uppercase tracking-wider">
                      Detayları Gör <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-6 bg-rose-500/10 rounded-full group-hover:bg-rose-500 text-rose-500 group-hover:text-white transition-all duration-300">
                    <ReceiptIcon className="w-10 h-10" />
                  </div>
                </div>
             </Link>
          </div>

          {/* Pending Approvals (Modern List) */}
          <div className="bg-card border border-border rounded-[2.5rem] shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-foreground">Bekleyen Onaylar</h2>
                <p className="text-muted-foreground text-sm mt-1">İşlem bekleyen <span className="font-bold text-foreground">{pendingApprovalsCount}</span> kritik talep var</p>
              </div>
              <Link href="/admin/approvals" className="bg-secondary p-3 rounded-2xl hover:bg-secondary/80 transition-colors">
                <ArrowRightIcon className="w-5 h-5 text-foreground" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval: any) => (
                  <div 
                    key={approval.id} 
                    className="group bg-secondary/30 hover:bg-secondary/50 border border-border/50 p-5 rounded-3xl flex items-center justify-between transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        <ShieldCheckIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-lg">{approval.job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">{approval.type}</Badge>
                           <span className="text-muted-foreground text-xs font-medium tracking-tight">Talep: {approval.requester.name}</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/jobs/${approval.jobId}`} 
                      className="bg-white dark:bg-zinc-800 shadow-sm border border-border p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-secondary/30 border border-dashed border-border p-12 rounded-3xl text-center">
                  <p className="text-muted-foreground font-medium">Harika! Tüm onaylar tamamlandı.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Space: Status & Logs (Lg: 4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Financial Status (Premium Card) */}
          <div className="bg-card border border-border rounded-[2.5rem] shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -m-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              Finansal Sağlık
              <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Bugün Harcanan</p>
                   <p className="text-4xl font-black text-foreground tabular-nums">₺{totalCostToday.toLocaleString('tr-TR')}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${budgetPercentage > 80 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  %{budgetPercentage}
                </div>
              </div>

              <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                    budgetPercentage > 85 ? 'bg-gradient-to-r from-orange-400 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-indigo-600'
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                >
                   <div className="absolute top-0 left-0 h-full w-full bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-secondary/50 rounded-3xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Bekleyen</p>
                    <p className="text-lg font-black text-amber-600">₺{totalPendingCost.toLocaleString('tr-TR')}</p>
                 </div>
                 <div className="p-4 bg-secondary/50 rounded-3xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Onaylanan</p>
                    <p className="text-lg font-black text-emerald-600">₺{totalApprovedCost.toLocaleString('tr-TR')}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Active Team (Vibrant Avatars) */}
          <div className="bg-card border border-border rounded-[2.5rem] shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground">Aktif Ekip</h2>
              <Link href="/admin/teams" className="text-indigo-500 text-xs font-bold hover:underline">TÜMÜ</Link>
            </div>
            <div className="space-y-4">
              {activeWorkers.length > 0 ? (
                activeWorkers.slice(0, 5).map((worker: any) => (
                  <div key={worker.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border">
                          <Image
                            src={worker.avatarUrl || `https://ui-avatars.com/api/?name=${worker.name}&background=random`}
                            alt={worker.name || 'Worker'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-card bg-emerald-500 rounded-full"></span>
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-sm">{worker.name}</p>
                        <p className="text-[10px] font-medium text-emerald-600 uppercase">Sahada / Aktif</p>
                      </div>
                    </div>
                    <ActivityIcon className="w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-xs text-center py-4">Aktif çalışan bulunamadı.</p>
              )}
            </div>
          </div>

          {/* System Logs (Log Feed) */}
          <div className="bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 pb-4">
              <h2 className="text-xl font-black text-foreground">Sistem Akışı</h2>
            </div>
            <div className="flex-1 overflow-hidden">
               <div className="divide-y divide-border/50">
                {latestLogs.length > 0 ? (
                  latestLogs.slice(0, 6).map((log: any) => (
                    <div key={log.id} className="p-5 hover:bg-secondary/50 transition-colors flex items-start gap-4">
                        <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                          log.level === 'ERROR' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 
                          log.level === 'WARN' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                          'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        }`}>
                          {log.level === 'ERROR' ? <AlertCircleIcon className="w-4 h-4" /> : 
                           log.level === 'WARN' ? <ZapIcon className="w-4 h-4" /> : 
                           <ActivityIcon className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{log.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                {log.user?.name || 'Sistem'}
                             </span>
                             <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                             <span className="text-[10px] text-muted-foreground font-medium">
                                {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm italic">
                    Log kaydı bulunamadı.
                  </div>
                )}
              </div>
            </div>
            <Link href="/admin/logs" className="p-6 text-center text-xs font-black text-indigo-500 hover:bg-indigo-500/5 transition-all border-t border-border flex items-center justify-center gap-2">
              TÜMÜNÜ GÖRÜNTÜLE <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
