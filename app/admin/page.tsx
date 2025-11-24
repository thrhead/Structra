import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BriefcaseIcon,
  UsersIcon,
  CheckCircle2Icon,
  ClockIcon,
  TrendingUpIcon,
  AlertCircleIcon
} from 'lucide-react'
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { NotificationBadge } from "@/components/notification-badge"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch real data
  const [
    totalJobs,
    activeTeams,
    completedJobsThisMonth,
    pendingApprovals,
    recentJobs
  ] = await Promise.all([
    prisma.job.count(),
    prisma.team.count({ where: { isActive: true } }),
    prisma.job.count({
      where: {
        status: 'COMPLETED',
        completedDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.approval.count({ where: { status: 'PENDING' } }),
    prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true,
        customer: true
      }
    })
  ])

  const stats = [
    {
      title: 'Toplam İş',
      value: totalJobs.toString(),
      change: 'Tüm zamanlar',
      icon: BriefcaseIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Aktif Ekipler',
      value: activeTeams.toString(),
      change: 'Aktif',
      icon: UsersIcon,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Tamamlanan',
      value: completedJobsThisMonth.toString(),
      change: 'Bu ay',
      icon: CheckCircle2Icon,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Bekleyen Onay',
      value: pendingApprovals.toString(),
      change: 'Acil',
      icon: ClockIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Hoş geldiniz, sistem genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const cardContent = (
            <Card className={`border-none shadow-sm hover:shadow-md transition-shadow ${stat.title === 'Bekleyen Onay' ? 'cursor-pointer' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )

          return stat.title === 'Bekleyen Onay' ? (
            <Link key={index} href="/admin/approvals">
              {cardContent}
            </Link>
<<<<<<< Updated upstream
          ) : (
            <div key={index}>
              {cardContent}
=======
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kontrol Paneli</h1>
            <NotificationBadge />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 space-y-8">
          {/* Tabs */}
          <div>
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav aria-label="Tabs" className="-mb-px flex space-x-6">
                <a
                  href="#"
                  className="border-primary text-primary whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-base"
                >
                  Overview
                </a>
              </nav>
>>>>>>> Stashed changes
            </div>
          )
        })}
      </div>

<<<<<<< Updated upstream
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-gray-500" />
              Son İşler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentJobs.length === 0 ? (
                <p className="text-sm text-gray-500">Henüz kayıtlı iş bulunmuyor.</p>
              ) : (
                recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-full bg-blue-100 text-blue-600">
                      <BriefcaseIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {job.creator.name} <span className="text-gray-500 font-normal">yeni bir iş oluşturdu</span>
                      </p>
                      <p className="text-sm text-gray-600">{job.title} - {job.customer.company}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: tr })}
                      </p>
                    </div>
                  </div>
                ))
              )}
=======
          {/* KPI Cards */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">
              Temel Performans Göstergeleri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Completed Tasks */}
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-lg shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-2">
                  <span>Tamamlanan Görevler</span>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-500">
                    {totalCompletedToday}
                  </span>
                  <div className="ml-2 flex items-center text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/50 rounded-full px-1.5 py-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Bugün</p>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-lg shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-2">
                  <span>Bekleyen Görevler</span>
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-orange-500 dark:text-orange-400 mt-2">
                  {totalPendingTasks}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Yakında Tamamlanacak</p>
              </div>

              {/* Total Costs */}
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-lg shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-2">
                  <span>Toplam Maliyetler</span>
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-500 mt-2">
                  ₺{totalCosts.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Bu Hafta</p>
              </div>
            </div>
          </section>

          {/* Real-time Team Status */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">
              Gerçek Zamanlı Ekip Durumu
            </h2>
            <div className="space-y-3">
              {activeTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-3"></span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                        {team.name}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Active: {team._count.members} members
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(team.updatedAt), { addSuffix: true, locale: tr })}
                  </p>
                </div>
              ))}
>>>>>>> Stashed changes
            </div>
          </CardContent>
        </Card>

<<<<<<< Updated upstream
        {/* Quick Actions */}
        <Card className="border-none shadow-sm bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-indigo-900">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/jobs" className="block w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-indigo-100 transition-colors flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                <BriefcaseIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-900">Yeni İş Oluştur</h3>
                <p className="text-sm text-indigo-600/80">Müşteri için yeni bir servis kaydı aç</p>
              </div>
            </Link>

            <Link href="/admin/users/new" className="block w-full bg-white p-4 rounded-lg shadow-sm text-left hover:bg-indigo-100 transition-colors flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <UsersIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-900">Yeni Kullanıcı Ekle</h3>
                <p className="text-sm text-indigo-600/80">Sisteme yeni personel veya müşteri ekle</p>
              </div>
            </Link>
          </CardContent>
        </Card>
=======
          {/* Ongoing Tasks */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">
              Devam Eden Görevler
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm divide-y divide-slate-200 dark:divide-slate-700">
              {ongoingJobs.map((job) => {
                // Calculate progress (simplified to use random for demo, should calculate from actual steps)
                const progress = Math.min(90, Math.max(10, Math.floor(Math.random() * 100)))
                const statusColor = progress > 70 ? 'green' : progress > 30 ? 'orange' : 'blue'
                const statusText = progress > 70 ? 'Tamamlanmak Üzere' : progress > 30 ? 'Devam Ediyor' : 'Başladı'
                const teamName = job.assignments[0]?.team?.name || 'Ekip Yok'

                return (
                  <div key={job.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                          {job.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {teamName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                          {progress}%
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${statusColor === 'green'
                            ? 'text-green-800 dark:text-green-200 bg-green-200 dark:bg-green-700/50'
                            : statusColor === 'orange'
                              ? 'text-orange-800 dark:text-orange-200 bg-orange-200 dark:bg-orange-500/30'
                              : 'text-blue-800 dark:text-blue-200 bg-blue-200 dark:bg-blue-500/30'
                            }`}
                        >
                          {statusText}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        {/* Footer Navigation */}
        <footer className="sticky bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 pb-safe">
          <nav className="flex justify-around items-center h-16 sm:h-20">
            <Link
              href="/admin"
              className="flex flex-col items-center text-primary space-y-1"
            >
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-full">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold">Kontrol Paneli</span>
            </Link>
            <Link
              href="/admin/teams"
              className="flex flex-col items-center text-slate-500 dark:text-slate-400 space-y-1"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">Ekipler</span>
            </Link>
            <Link
              href="/admin/jobs"
              className="flex flex-col items-center text-slate-500 dark:text-slate-400 space-y-1"
            >
              <ListTodo className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">Görevler</span>
            </Link>
            <Link
              href="/admin/reports"
              className="flex flex-col items-center text-slate-500 dark:text-slate-400 space-y-1"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">Raporlar</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex flex-col items-center text-slate-500 dark:text-slate-400 space-y-1"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">Ayarlar</span>
            </Link>
          </nav>
        </footer>
>>>>>>> Stashed changes
      </div>
    </div>
  )
}
