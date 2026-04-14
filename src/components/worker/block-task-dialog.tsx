'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle } from 'lucide-react'

const BLOCK_REASONS = [
    { value: 'POWER_OUTAGE', label: 'Elektrik Kesintisi' },
    { value: 'MATERIAL_SHORTAGE', label: 'Malzeme Eksikliği' },
    { value: 'BAD_WEATHER', label: 'Hava Koşulları' },
    { value: 'EQUIPMENT_FAILURE', label: 'Ekipman Arızası' },
    { value: 'WAITING_APPROVAL', label: 'Onay Bekleniyor' },
    { value: 'CUSTOMER_REQUEST', label: 'Müşteri Talebi' },
    { value: 'SAFETY_ISSUE', label: 'Güvenlik Sorunu' },
    { value: 'OTHER', label: 'Diğer' }
]

interface BlockTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onBlock: (reason: string, note: string) => Promise<void>
    taskTitle: string
    isSubStep?: boolean
}

export function BlockTaskDialog({ open, onOpenChange, onBlock, taskTitle, isSubStep = false }: BlockTaskDialogProps) {
    const [reason, setReason] = useState<string>('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!reason) {
            toast.warning('Lütfen bir neden seçin')
            return
        }

        setLoading(true)
        try {
            await onBlock(reason, note)
            onOpenChange(false)
            setReason('')
            setNote('')
        } catch (error) {
            console.error(error)
            toast.error('Bloklama işlemi başarısız oldu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-none shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                <div className="flex flex-col items-center text-center mb-2">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 shadow-sm">
                        <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <DialogHeader className="text-center sm:text-center space-y-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {isSubStep ? 'Alt Görevi' : 'Görevi'} Blokla
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-[340px] mx-auto">
                            &quot;{taskTitle}&quot; {isSubStep ? 'alt görevini' : 'görevini'} tamamlayamama nedeninizi belirtin.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bloklama Nedeni *</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="reason" className="rounded-xl h-12 border-slate-200 focus:ring-amber-500/20 shadow-xs">
                                <SelectValue placeholder="Neden seçin..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border-slate-100 dark:border-slate-800">
                                {BLOCK_REASONS.map((r) => (
                                    <SelectItem key={r.value} value={r.value} className="rounded-lg py-2.5">
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ek Açıklama (Opsiyonel)</Label>
                        <Textarea
                            id="note"
                            placeholder="Durumla ilgili detaylı açıklama..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            className="rounded-xl border-slate-200 focus:ring-amber-500/20 resize-none shadow-xs"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)} 
                        disabled={loading}
                        className="rounded-2xl h-11 px-8 font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex-1"
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading || !reason} 
                        variant="destructive"
                        className="rounded-2xl h-11 px-8 font-bold bg-amber-600 hover:bg-amber-700 border-none shadow-lg shadow-amber-600/20 text-white flex-1 disabled:opacity-50 transition-all duration-200 active:scale-95"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Bloklanıyor...
                            </div>
                        ) : (
                            'Görevi Blokla'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
