'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface DeleteCustomerButtonProps {
    customerId: string
    companyName: string
    variant?: "ghost" | "outline" | "destructive" | "default" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    showText?: boolean
    hasActiveJobs?: boolean
}

export function DeleteCustomerButton({ 
    customerId, 
    companyName, 
    variant = "ghost", 
    size = "sm",
    showText = false,
    hasActiveJobs = false
}: DeleteCustomerButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showActiveJobsAlert, setShowActiveJobsAlert] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('Müşteri başarıyla silindi')
                router.push('/admin/customers')
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Müşteri silinemedi')
            }
        } catch (error) {
            toast.error('Silme işlemi sırasında bir hata oluştu')
        } finally {
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }

    const handleClick = () => {
        if (hasActiveJobs) {
            setShowActiveJobsAlert(true)
        } else {
            setShowConfirm(true)
        }
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleClick}
                disabled={isDeleting}
                title={hasActiveJobs ? "Aktif işler nedeniyle silinemez" : "Müşteriyi Sil"}
                className={variant === 'destructive' ? '' : 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'}
            >
                <Trash2 className={`h-4 w-4 ${showText ? 'mr-2' : ''} ${isDeleting ? 'text-gray-400' : ''}`} />
                {showText && (isDeleting ? 'Siliniyor...' : 'Müşteriyi Sil')}
            </Button>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Müşteri Silinecek"
                description={`"${companyName}" firmasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm müşteri profili kaldırılacaktır.`}
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                onConfirm={handleDelete}
                variant="destructive"
                isLoading={isDeleting}
            />

            <ConfirmDialog
                open={showActiveJobsAlert}
                onOpenChange={setShowActiveJobsAlert}
                title="Silme İşlemi Engellendi"
                description={`"${companyName}" firmasına bağlı aktif veya geçmiş iş kayıtları bulunduğu için silinemez. Veri bütünlüğünü korumak için lütfen önce işleri silin veya müşteriyi "Pasif" duruma getirin.`}
                confirmText="Anladım"
                onConfirm={() => setShowActiveJobsAlert(false)}
                variant="warning"
            />
        </>
    )
}
