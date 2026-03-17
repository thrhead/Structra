
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DownloadIcon, FileIcon, SearchIcon, RefreshCwIcon, ArrowLeftIcon, FileTextIcon, TableIcon, FilterIcon } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Link } from '@/lib/navigation'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from 'next/navigation'
import ReportFilters from '@/components/admin/reports/ReportFilters'

interface StoredReport {
    id: string
    filename: string
    title: string
    customer: string
    createdAt: string
}

export default function ExportsPage() {
    return (
        <Suspense fallback={<div className="p-8 flex items-center justify-center">Yükleniyor...</div>}>
            <ExportsContent />
        </Suspense>
    )
}

function ExportsContent() {
    const searchParams = useSearchParams()
    const [reports, setReports] = useState<StoredReport[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [filterData, setFilterData] = useState<{jobs: any[], categories: string[]}>({jobs: [], categories: []})

    useEffect(() => {
        fetchReports()
        fetchFilters()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/reports/list')
            const data = await res.json()
            setReports(data)
        } catch (error) {
            toast.error('Raporlar yüklenirken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const fetchFilters = async () => {
        try {
            const [jobsRes, catsRes] = await Promise.all([
                fetch('/api/admin/jobs/list'), // Assuming this exists or similar
                fetch('/api/admin/reports/categories') // Assuming this exists or similar
            ])
            // Fallback to empty if not found
            const jobs = jobsRes.ok ? await jobsRes.json() : []
            const categories = catsRes.ok ? await catsRes.json() : []
            setFilterData({ jobs, categories })
        } catch (e) {}
    }

    const toggleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const selectAll = () => {
        if (selected.length === filteredReports.length) {
            setSelected([])
        } else {
            setSelected(filteredReports.map(r => r.id))
        }
    }

    const filteredReports = reports.filter(r =>
        (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.customer || "").toLowerCase().includes(search.toLowerCase())
    )

    const downloadJobReport = (id: string) => {
        window.open(`/api/admin/reports/export/${id}`, '_blank')
    }

    const downloadCustomReport = async (type: string, format: 'pdf' | 'excel') => {
        const from = searchParams.get('from')
        const to = searchParams.get('to')
        const jobId = searchParams.get('jobId')

        let url = `/api/admin/reports/custom-export?type=${type}&format=${format}`
        if (from) url += `&from=${from}`
        if (to) url += `&to=${to}`
        if (jobId) url += `&jobId=${jobId}`

        window.open(url, '_blank')
        toast.success(`${type} raporu ${format.toUpperCase()} olarak hazırlanıyor...`)
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Dışa Aktarmalar</h1>
                        <p className="text-sm text-muted-foreground">İş raporları ve özel analiz raporları oluşturun.</p>
                    </div>
                </div>
            </div>

            <Card className="p-4 bg-muted/30 border-none shadow-none">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <FilterIcon className="w-4 h-4" /> Filtreler (Özel Raporlar İçin)
                </div>
                <ReportFilters jobs={filterData.jobs} categories={filterData.categories} />
            </Card>

            <Tabs defaultValue="jobs" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="jobs" className="gap-2"><FileTextIcon className="w-4 h-4" /> Tamamlanan İşler</TabsTrigger>
                    <TabsTrigger value="custom" className="gap-2"><TableIcon className="w-4 h-4" /> Özel Raporlar</TabsTrigger>
                </TabsList>

                <TabsContent value="jobs" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        className="w-full pl-9 pr-4 py-2 bg-muted/50 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="İş veya müşteri ara..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
                                    <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Yenile
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y max-h-[60vh] overflow-auto">
                                {loading && reports.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
                                ) : filteredReports.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground">Tamamlanmış iş bulunamadı.</div>
                                ) : (
                                    filteredReports.map((report) => (
                                        <div key={report.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                                    <FileIcon className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{report.title}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                        <span className="font-semibold text-slate-600">{report.customer}</span>
                                                        <span>•</span>
                                                        <span>{format(new Date(report.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => downloadJobReport(report.id)}>
                                                <DownloadIcon className="w-4 h-4 mr-2" />
                                                PDF İndir
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            { id: 'profitability', title: 'Kârlılık Raporu', desc: 'İş bazlı bütçe ve maliyet karşılaştırması' },
                            { id: 'delay', title: 'Gecikme ve Darboğaz Analizi', desc: 'Planlanan vs Gerçekleşen süreler' },
                            { id: 'capacity', title: 'Ekip Kapasite Raporu', desc: 'Ekip doluluk ve iş yükü dağılımı' },
                            { id: 'personnel', title: 'Personel Performans', desc: 'Personel bazlı tamamlanan iş sayıları' },
                            { id: 'financial', title: 'Finansal Özet Tablo', desc: 'Genel gider ve bütçe durumu' },
                            { id: 'cost_details', title: 'Detaylı Maliyet Analizi', desc: 'Kategori bazlı harcama detayları' }
                        ].map((report) => (
                            <Card key={report.id} className="hover:border-primary transition-colors">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{report.desc}</p>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCustomReport(report.id, 'pdf')}>
                                        <FileIcon className="w-4 h-4 mr-2 text-red-600" /> PDF
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCustomReport(report.id, 'excel')}>
                                        <TableIcon className="w-4 h-4 mr-2 text-green-600" /> EXCEL
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
