'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CameraIcon, ReceiptText, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { CustomSpinner } from '@/components/ui/custom-spinner'

interface CostDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    jobId: string
    onSuccess: () => void
}

const CATEGORIES = [
    { value: 'MATERIAL', label: 'Malzeme' },
    { value: 'LABOR', label: 'İşçilik' },
    { value: 'TRANSPORT', label: 'Yol / Yakıt' },
    { value: 'FOOD', label: 'Yemek' },
    { value: 'ACCOMMODATION', label: 'Konaklama' },
    { value: 'OTHER', label: 'Diğer' }
]

export function CostDialog({ open, onOpenChange, jobId, onSuccess }: CostDialogProps) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [receiptUrl, setReceiptUrl] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await apiClient.post('/api/worker/costs', {
                jobId,
                amount: parseFloat(amount),
                category,
                description,
                receiptUrl: receiptUrl || undefined
            })

            if (!res.ok) {
                throw new Error('Failed to submit cost')
            }

            onSuccess()
            onOpenChange(false)
            // Reset form
            setAmount('')
            setCategory('')
            setDescription('')
            setReceiptUrl('')
        } catch (error) {
            console.error(error)
            toast.error('Masraf kaydedilemedi')
        } finally {
            setLoading(false)
        }
    }

    const handlePhotoUpload = () => {
        // Mock photo upload for now
        const url = prompt("Fiş fotoğrafı URL'si girin (veya boş bırakın):")
        if (url !== null) {
            setReceiptUrl(url || `https://picsum.photos/seed/${Date.now()}/400/600`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-none shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                <div className="flex flex-col items-center text-center mb-2">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 shadow-sm text-emerald-600 dark:text-emerald-400">
                        <Wallet className="h-8 w-8" />
                    </div>
                    <DialogHeader className="text-center sm:text-center space-y-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Masraf Ekle
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-500 dark:text-slate-400">
                            İş ile ilgili yaptığınız harcamaları buraya kaydedin.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tutar (TL)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₺</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="pl-8 rounded-xl h-12 border-slate-200 focus:ring-emerald-500/20 shadow-xs font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</Label>
                            <Select value={category} onValueChange={setCategory} required>
                                <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-emerald-500/20 shadow-xs">
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value} className="rounded-lg py-2.5">
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Açıklama</Label>
                        <Textarea
                            id="description"
                            placeholder="Masraf detayı..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="rounded-xl border-slate-200 focus:ring-emerald-500/20 resize-none shadow-xs min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fiş / Fatura Fotoğrafı</Label>
                        <div className="flex items-center gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handlePhotoUpload} 
                                className={`w-full h-14 rounded-2xl border-dashed border-2 transition-all duration-300 ${
                                    receiptUrl ? 'border-emerald-200 bg-emerald-50/30 text-emerald-700' : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                                }`}
                            >
                                <CameraIcon className="mr-2 h-5 w-5" />
                                {receiptUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
                            </Button>
                        </div>
                        {receiptUrl && (
                            <div className="mt-2 relative h-40 w-full rounded-2xl overflow-hidden border border-emerald-100 shadow-md animate-in fade-in zoom-in duration-300">
                                <Image 
                                    src={receiptUrl} 
                                    alt="Receipt" 
                                    fill
                                    className="object-cover" 
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePhotoUpload}>
                                    <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-lg">Değiştir</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl h-11 px-8 font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all duration-200 flex-1"
                        >
                            İptal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || !amount || !category}
                            className="rounded-2xl h-11 px-8 font-bold bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-600/20 text-white flex-1 transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Kaydediliyor...
                                </div>
                            ) : (
                                'Masrafı Kaydet'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
