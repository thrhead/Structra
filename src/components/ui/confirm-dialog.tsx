'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info, HelpCircle } from 'lucide-react'

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void | Promise<void>
    variant?: 'default' | 'destructive' | 'warning'
    isLoading?: boolean
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Onayla',
    cancelText = 'Vazgeç',
    onConfirm,
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        await onConfirm()
        onOpenChange(false)
    }

    const getIcon = () => {
        switch (variant) {
            case 'destructive':
                return (
                    <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                )
            case 'warning':
                return (
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                )
            default:
                return (
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                        <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] rounded-3xl p-8 border-none shadow-2xl overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                <div className="flex flex-col items-center text-center">
                    {getIcon()}
                    <DialogHeader className="text-center sm:text-center space-y-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="rounded-2xl h-11 px-8 font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 w-full sm:w-auto"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === 'destructive' ? 'destructive' : 'default'}
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`rounded-2xl h-11 px-8 font-bold shadow-lg shadow-primary/20 transition-all duration-200 w-full sm:w-auto ${
                                variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' : 
                                variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' : 
                                'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    {confirmText}...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

