'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const teamSchema = z.object({
  name: z.string().min(2, 'Ekip adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  leadId: z.string().optional(),
})

type FormData = z.infer<typeof teamSchema>

interface User {
  id: string
  name: string
  role: string
}

export function TeamDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [potentialLeads, setPotentialLeads] = useState<User[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(teamSchema)
  })

  // Potansiyel liderleri getir (TEAM_LEAD veya MANAGER rolündeki kullanıcılar)
  useEffect(() => {
    if (open) {
      fetch('/api/users?role=TEAM_LEAD,MANAGER') // Liderler ve Yöneticiler ekip lideri olabilir
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPotentialLeads(data)
          }
        })
        .catch(err => console.error('Failed to fetch leads:', err))
    }
  }, [open])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      setOpen(false)
      reset()
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Ekip oluşturulurken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Yeni Ekip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Ekip Oluştur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ekip Adı</Label>
            <Input id="name" {...register('name')} placeholder="Örn: Klima Montaj Ekibi A" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadId">Ekip Lideri</Label>
            <Select onValueChange={(val) => setValue('leadId', val === 'none' ? undefined : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Lider seçiniz (Opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seçim Yok</SelectItem>
                {potentialLeads.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" {...register('description')} placeholder="Ekip hakkında kısa bilgi..." />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Oluştur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
