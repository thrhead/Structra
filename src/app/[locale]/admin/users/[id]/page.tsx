import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { ArrowLeft, Mail, Phone, Calendar, User as UserIcon, Shield, Clock, CheckCircle2, Briefcase, TrendingUp, AlertTriangle, XCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUser, getUserReports } from "@/lib/data/users"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { DeleteUserButton } from "@/components/admin/delete-user-button"

export default async function UserDetailsPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login")
    }

    const [user, reports] = await Promise.all([
        getUser(params.id),
        getUserReports(params.id)
    ])

    if (!user || !reports) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Bulunamadı</h1>
                <Link href="/admin/users" className="text-blue-600 hover:underline mt-4 inline-block">
                    Kullanıcı Listesine Dön
                </Link>
            </div>
        )
    }

    const roleLabels: Record<string, string> = {
        ADMIN: "Yönetici",
        MANAGER: "Müdür",
        TEAM_LEAD: "Takım Lideri",
        WORKER: "Çalışan",
        CUSTOMER: "Müşteri",
    }

    const hasActiveTasks = reports.kpis.activeProjectCount > 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Profili</h1>
                    </div>
                </div>
                {session.user.id !== user.id && (
                    <DeleteUserButton 
                        userId={user.id} 
                        userName={user.name || user.email} 
                        showText 
                        variant="destructive"
                        hasActiveTasks={hasActiveTasks}
                    />
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Toplam Çalışma</p>
                                <p className="text-2xl font-bold">{reports.kpis.totalHours} Saat</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Tamamlanan İşler</p>
                                <p className="text-2xl font-bold">{reports.kpis.completedProjectCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Aktif Görevler</p>
                                <p className="text-2xl font-bold">{reports.kpis.activeProjectCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Toplam Harcama</p>
                                <p className="text-2xl font-bold">{reports.kpis.totalExpenditure.toLocaleString('tr-TR')} ₺</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={user.avatarUrl || ""} />
                            <AvatarFallback className="text-2xl">
                                {user.name?.substring(0, 2).toUpperCase() || "US"}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <Badge variant="secondary" className="mt-2">
                            {roleLabels[user.role] || user.role}
                        </Badge>

                        <div className="w-full mt-6 space-y-4 text-left">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>Kayıt: {format(new Date(user.createdAt), 'd MMM yyyy', { locale: tr })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Shield className="h-4 w-4" />
                                <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                                    {user.isActive ? "Hesap Aktif" : "Hesap Pasif"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Teams Info (if applicable) */}
                    {['TEAM_LEAD', 'WORKER'].includes(user.role) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ekip Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.teamMember.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.teamMember.map((tm: any) => (
                                            <div key={tm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{tm.team.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Katılım: {format(new Date(tm.joinedAt), 'd MMM yyyy', { locale: tr })}
                                                    </p>
                                                </div>
                                                <Badge>Üye</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Herhangi bir ekibe üye değil.</p>
                                )}

                                {user.managedTeams.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="text-sm font-semibold mb-2">Yönettiği Ekipler</h4>
                                        {user.managedTeams.map((team: any) => (
                                            <div key={team.id} className="p-2 bg-blue-50 text-blue-700 rounded mb-2">
                                                {team.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Active Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktif Görevler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reports.history.activeTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {reports.history.activeTasks.map((job: any) => (
                                        <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <Link href={`/admin/jobs/${job.id}`} className="font-medium hover:underline text-blue-600">
                                                    {job.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px]">{job.priority}</Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {job.scheduledDate ? format(new Date(job.scheduledDate), 'd MMM yyyy', { locale: tr }) : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">{job.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Henüz atanmış aktif bir iş yok.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Completed History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>İş Geçmişi (Tamamlananlar)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reports.history.completedTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {reports.history.completedTasks.map((job: any) => (
                                        <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <div>
                                                <Link href={`/admin/jobs/${job.id}`} className="font-medium hover:underline text-gray-700">
                                                    {job.title}
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Tamamlanma: {job.completedDate ? format(new Date(job.completedDate), 'd MMM yyyy', { locale: tr }) : '-'}
                                                </p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">TAMAMLANDI</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Henüz tamamlanmış bir iş bulunmuyor.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
