'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadIcon, FileSpreadsheetIcon, DownloadIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CustomSpinner } from '@/components/ui/custom-spinner'

export function BulkUploadDialog() {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; count?: number; errors?: string[] } | null>(null)
    const router = useRouter()

    const downloadTemplate = () => {
        const templateData = [
            {
                "Job Title": "Örnek İş 1",
                "Description": "İş açıklaması buraya",
                "Customer Company": "Müşteri Firma Adı",
                "Priority": "MEDIUM",
                "Date": "2024-01-01",
                "Step Title": "Hazırlık",
                "SubStep Title": "Malzeme Kontrolü"
            },
            {
                "Job Title": "Örnek İş 1",
                "Description": "İş açıklaması buraya",
                "Customer Company": "Müşteri Firma Adı",
                "Priority": "MEDIUM",
                "Date": "2024-01-01",
                "Step Title": "Hazırlık",
                "SubStep Title": "Ekipman Hazırlığı"
            },
            {
                "Job Title": "Örnek İş 1",
                "Description": "İş açıklaması buraya",
                "Customer Company": "Müşteri Firma Adı",
                "Priority": "MEDIUM",
                "Date": "2024-01-01",
                "Step Title": "Montaj",
                "SubStep Title": "Ana Ünite Montajı"
            }
        ]

        const worksheet = XLSX.utils.json_to_sheet(templateData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template")
        XLSX.writeFile(workbook, "Is_Yukleme_Sablonu.xlsx")
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsLoading(true)
        setResult(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/admin/jobs/bulk-import", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                throw new Error(await res.text() || "Yükleme başarısız")
            }

            const data = await res.json()
            setResult(data)

            if (data.success && (!data.errors || data.errors.length === 0)) {
                toast.success(`${data.count} iş başarıyla oluşturuldu`)
                setTimeout(() => {
                    setOpen(false)
                    setFile(null)
                    setResult(null)
                    router.refresh()
                }, 2000)
            } else if (data.success && data.errors?.length > 0) {
                toast.warning(`${data.count} iş oluşturuldu ancak bazı hatalar var.`)
                router.refresh()
            }

        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Dosya yüklenirken bir hata oluştu")
            setResult({ success: false, errors: [error.message] })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl h-10 px-4 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200">
                    <FileSpreadsheetIcon className="h-4 w-4" />
                    Toplu İş Yükle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 border-none shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                <div className="flex flex-col items-center text-center mb-2">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 shadow-sm text-emerald-600 dark:text-emerald-400">
                        <FileSpreadsheetIcon className="h-8 w-8" />
                    </div>
                    <DialogHeader className="text-center sm:text-center space-y-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Excel ile Toplu İş Yükle
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                            Excel dosyası üzerinden sisteme toplu iş aktarımı yapın.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="space-y-6 py-6">
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 flex items-start gap-3 shadow-sm">
                        <InfoIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-emerald-800 dark:text-emerald-300 space-y-2">
                            <p className="font-bold">Nasıl Kullanılır?</p>
                            <ul className="list-decimal pl-4 space-y-1 opacity-90">
                                <li>Şablonu indirin ve işlerinizi uygun şekilde doldurun.</li>
                                <li>Aynı &quot;Job Title&quot;a sahip satırlar tek bir iş olarak gruplanır.</li>
                                <li>Müşteri ismi sistemde kayıtlı olmalıdır.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            onClick={downloadTemplate} 
                            className="h-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all duration-200 flex flex-col items-center justify-center gap-1 group"
                        >
                            <DownloadIcon className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Örnek Şablonu İndir</span>
                        </Button>

                        <div className="relative group h-14">
                            <Label htmlFor="excel-file" className="absolute -top-2.5 left-4 bg-white dark:bg-slate-900 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 z-10">Excel Dosyası</Label>
                            <div className="relative flex items-center h-full">
                                <Input 
                                    id="excel-file" 
                                    type="file" 
                                    accept=".xlsx, .xls" 
                                    onChange={handleFileChange}
                                    className="rounded-2xl h-full border-slate-200 group-hover:border-emerald-400 transition-all cursor-pointer file:hidden pt-4 text-xs font-semibold" 
                                />
                                <UploadIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className={`rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-300 border ${result.success && (!result.errors || result.errors.length === 0) ? 'bg-green-50/50 border-green-100 text-green-800' : 'bg-red-50/50 border-red-100 text-red-800'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                {result.success && (!result.errors || result.errors.length === 0) ? (
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertCircleIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                )}
                                <span className="font-bold text-lg">
                                    {result.success ? "İşlem Başarılı" : "Hata Oluştu"}
                                </span>
                            </div>
                            {result.count !== undefined && (
                                <p className="text-sm font-semibold mb-2 opacity-90">{result.count} iş başarıyla oluşturuldu.</p>
                            )}
                            {result.errors && result.errors.length > 0 && (
                                <div className="text-sm max-h-[150px] overflow-y-auto scrollbar-hide bg-white/50 dark:bg-black/20 rounded-xl p-3">
                                    <p className="font-bold mb-1">Hatalar:</p>
                                    <ul className="list-disc pl-5 space-y-1 font-medium opacity-80">
                                        {result.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:justify-center border-t pt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        className="rounded-2xl h-11 px-8 font-semibold border-slate-200 flex-1"
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!file || isLoading}
                        className="rounded-2xl h-11 px-8 font-bold bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-600/20 text-white flex-1 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Yükleniyor...
                            </div>
                        ) : (
                            'Hemen Yükle'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
