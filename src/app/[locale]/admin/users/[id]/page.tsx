import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { ArrowLeft, Mail, Phone, Calendar, User as UserIcon, Shield, Clock, CheckCircle2, Briefcase, TrendingUp, AlertTriangle, XCircle, Bell, Receipt, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const isCustomer = user.role === "CUSTOMER"

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                                <p className="text-sm font-medium text-gray-500">Tamamlanan {isCustomer ? 'Projeler' : 'İşler'}</p>
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
                                <p className="text-sm font-medium text-gray-500">Aktif {isCustomer ? 'Projeler' : 'Görevler'}</p>
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
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Bekleyen Onay</p>
                                <p className="text-2xl font-bold">{reports.kpis.pendingApprovalCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 h-fit">
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
                                <span className="truncate">{user.email}</span>
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
                    <Tabs defaultValue="jobs" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="jobs">
                                <Briefcase className="h-4 w-4 mr-2" />
                                {isCustomer ? 'Projeler' : 'Görevler'}
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                <Bell className="h-4 w-4 mr-2" />
                                Bekleyenler
                                {reports.kpis.pendingApprovalCount > 0 && (
                                    <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                        {reports.kpis.pendingApprovalCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="costs">
                                <Receipt className="h-4 w-4 mr-2" />
                                Harcamalar
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="jobs" className="space-y-4 mt-4">
                            {/* Teams Info (if applicable) */}
                            {['TEAM_LEAD', 'WORKER'].includes(user.role) && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Ekip Bilgileri</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {user.teamMember.length > 0 ? (
                                            <div className="space-y-3">
                                                {user.teamMember.map((tm: any) => (
                                                    <div key={tm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{tm.team.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Katılım: {format(new Date(tm.joinedAt), 'd MMM yyyy', { locale: tr })}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline">Üye</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">Herhangi bir ekibe üye değil.</p>
                                        )}

                                        {user.managedTeams.length > 0 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="text-sm font-semibold mb-2">Yönettiği Ekipler</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.managedTeams.map((team: any) => (
                                                        <Badge key={team.id} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                            {team.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Active Jobs */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Aktif {isCustomer ? 'Projeler' : 'Görevler'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {reports.history.activeTasks.length > 0 ? (
                                        <div className="space-y-3">
                                            {reports.history.activeTasks.map((job: any) => (
                                                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div>
                                                        <Link href={`/admin/jobs/${job.id}`} className="font-medium hover:underline text-blue-600">
                                                            {job.title}
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                            <Badge variant="outline" className="text-[10px] uppercase">{job.priority}</Badge>
                                                            <span>•</span>
                                                            <span>{job.jobNo || 'NO-REF'}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {job.scheduledDate ? format(new Date(job.scheduledDate), 'd MMM yyyy', { locale: tr }) : '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="uppercase text-[10px]">{job.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Henüz atanmış aktif bir {isCustomer ? 'proje' : 'iş'} yok.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Completed History */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">İş Geçmişi (Tamamlananlar)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {reports.history.completedTasks.length > 0 ? (
                                        <div className="space-y-3">
                                            {reports.history.completedTasks.map((job: any) => (
                                                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                                                    <div>
                                                        <Link href={`/admin/jobs/${job.id}`} className="font-medium hover:underline text-gray-700">
                                                            {job.title}
                                                        </Link>
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                            Tamamlanma: {job.completedDate ? format(new Date(job.completedDate), 'd MMM yyyy', { locale: tr }) : '-'}
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 uppercase text-[10px]">TAMAMLANDI</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Henüz tamamlanmış bir iş bulunmuyor.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="h-5 w-5" />
                                        Onay Bekleyen İşlemler
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Pending Costs */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Receipt className="h-4 w-4" />
                                            Harcamalar ({reports.history.pendingItems.costs.length})
                                        </h4>
                                        {reports.history.pendingItems.costs.length > 0 ? (
                                            <div className="space-y-2">
                                                {reports.history.pendingItems.costs.map((cost: any) => (
                                                    <div key={cost.id} className="p-3 border rounded-md bg-red-50/30 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{cost.description}</p>
                                                            <p className="text-[10px] text-gray-500">İş: {cost.job?.title || 'Bilinmiyor'}</p>
                                                        </div>
                                                        <p className="font-bold text-red-700">{cost.amount.toLocaleString('tr-TR')} {cost.currency}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">Bekleyen harcama yok.</p>
                                        )}
                                    </div>

                                    {/* Pending Steps */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            İş Adımı Onayları ({reports.history.pendingItems.steps.length + reports.history.pendingItems.subSteps.length})
                                        </h4>
                                        {(reports.history.pendingItems.steps.length > 0 || reports.history.pendingItems.subSteps.length > 0) ? (
                                            <div className="space-y-2">
                                                {reports.history.pendingItems.steps.map((step: any) => (
                                                    <div key={step.id} className="p-3 border rounded-md bg-orange-50/30 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{step.title}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase">ANA ADIM • İş: {step.job?.title}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-700">ONAY BEKLİYOR</Badge>
                                                    </div>
                                                ))}
                                                {reports.history.pendingItems.subSteps.map((ss: any) => (
                                                    <div key={ss.id} className="p-3 border rounded-md bg-orange-50/30 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{ss.title}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase">ALT ADIM • İş: {ss.step?.job?.title}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-700">ONAY BEKLİYOR</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">Bekleyen adım onayı yok.</p>
                                        )}
                                    </div>

                                    {/* General Approvals */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Genel Onay İstekleri ({reports.history.pendingItems.approvals.length})
                                        </h4>
                                        {reports.history.pendingItems.approvals.length > 0 ? (
                                            <div className="space-y-2">
                                                {reports.history.pendingItems.approvals.map((app: any) => (
                                                    <div key={app.id} className="p-3 border rounded-md bg-blue-50/30 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium capitalize">{app.type.replace('_', ' ')} Talebi</p>
                                                            <p className="text-[10px] text-gray-500">İş: {app.job?.title}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 uppercase">{app.status}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">Bekleyen genel onay isteği yok.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="costs" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Harcama Geçmişi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {reports.history.costs.length > 0 ? (
                                        <div className="space-y-3">
                                            {reports.history.costs.map((cost: any) => (
                                                <div key={cost.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div>
                                                        <p className="font-medium text-sm">{cost.description}</p>
                                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                                                            <span>{format(new Date(cost.date), 'd MMM yyyy', { locale: tr })}</span>
                                                            <span>•</span>
                                                            <span className="uppercase">{cost.category || 'GENEL'}</span>
                                                            <span>•</span>
                                                            <span className="truncate max-w-[150px]">İş: {cost.job?.title}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-sm">{cost.amount.toLocaleString('tr-TR')} {cost.currency}</p>
                                                        <Badge variant={cost.status === 'APPROVED' ? 'default' : cost.status === 'REJECTED' ? 'destructive' : 'secondary'} className="text-[8px] h-4 mt-1">
                                                            {cost.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-8">Henüz kaydedilmiş bir harcama bulunmuyor.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
