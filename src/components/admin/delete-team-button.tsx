'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface DeleteTeamButtonProps {
    teamId: string
    teamName: string
}

export function DeleteTeamButton({ teamId, teamName }: DeleteTeamButtonProps) {
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/teams/${teamId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success('Ekip başarıyla silindi')
                router.refresh()
            } else {
                toast.error('Ekip silinemedi')
            }
        } catch (error) {
            toast.error('Silme işlemi sırasında bir hata oluştu')
        } finally {
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </Button>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Ekip Silinecek"
                description={`"${teamName}" ekibini silmek istediğinizden emin misiniz?`}
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                onConfirm={handleDelete}
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}
