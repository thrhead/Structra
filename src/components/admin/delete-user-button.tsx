'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

interface DeleteUserButtonProps {
    userId: string
    userName: string
    variant?: "ghost" | "outline" | "destructive" | "default" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    showText?: boolean
    hasActiveTasks?: boolean
}

export function DeleteUserButton({ 
    userId, 
    userName, 
    variant = "ghost", 
    size = "sm",
    showText = false,
    hasActiveTasks = false
}: DeleteUserButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (hasActiveTasks) {
            alert(`"${userName}" kullanıcısının üzerine atanmış aktif işler (Bekliyor/Devam Ediyor) bulunduğu için silinemez. Lütfen önce işleri başka birine atayın veya tamamlayın.`);
            return;
        }

        if (!confirm(`"${userName}" kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('Kullanıcı başarıyla silindi')
                router.push('/admin/users')
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Kullanıcı silinemedi')
            }
        } catch (error) {
            toast.error('Silme işlemi sırasında bir hata oluştu')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDelete}
            disabled={isDeleting}
            title={hasActiveTasks ? "Aktif işler nedeniyle silinemez" : "Kullanıcıyı Sil"}
            className={variant === 'destructive' ? '' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}
        >
            <Trash2 className={`h-4 w-4 ${showText ? 'mr-2' : ''} ${isDeleting ? 'text-gray-400' : ''}`} />
            {showText && (isDeleting ? 'Siliniyor...' : 'Kullanıcıyı Sil')}
        </Button>
    )
}
