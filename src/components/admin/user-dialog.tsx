'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerSchema } from '@/lib/validations-edge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, UserCircle, Shield, Phone, Mail, UserCog } from 'lucide-react'
import { 
  Field, 
  FieldGroup, 
  FieldLabel, 
  FieldDescription, 
  Fieldset, 
  FieldLegend,
  FieldSeparator 
} from '@/components/ui/field'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateUserAction, createUserAction } from '@/lib/actions/users'
import { Switch } from "@/components/ui/switch"
import { CustomSpinner } from '@/components/ui/custom-spinner'

const userEditSchema = registerSchema.extend({
  password: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

type FormData = z.infer<typeof userEditSchema>

interface UserDialogProps {
  user?: any
  trigger?: React.ReactNode
}

export function UserDialog({ user, trigger }: UserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isEditing = !!user

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    // resolver removed
    defaultValues: user ? {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'WORKER',
      isActive: user.isActive,
      password: ''
    } : {
      role: 'WORKER',
      isActive: true
    }
  })

  const currentRole = watch('role')
  const currentStatus = watch('isActive')

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    // Prevent Zod/Next.js serialization errors
    const safeData = {
      ...data,
      phone: data.phone || '',
      password: data.password || ''
    }

    try {
      if (isEditing) {
        await updateUserAction({
          id: user.id,
          ...safeData,
          password: safeData.password || undefined
        })
        toast.success('Kullanıcı güncellendi')
      } else {
        await createUserAction(safeData as any)
        toast.success('Kullanıcı başarıyla oluşturuldu')
      }

      setOpen(false)
      if (!isEditing) reset()
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Yeni Kullanıcı
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FieldGroup>
            <Fieldset>
              <FieldLegend>Kişisel Bilgiler</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="u-name" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-slate-400" /> Ad Soyad *
                  </FieldLabel>
                  <Input id="u-name" {...register('name')} placeholder="Örn: Ahmet Yılmaz" required />
                  {errors.name && <FieldDescription className="text-destructive font-medium">{errors.name.message}</FieldDescription>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="u-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" /> E-posta *
                    </FieldLabel>
                    <Input id="u-email" type="email" {...register('email')} placeholder="ahmet@structra.com" required />
                    {errors.email && <FieldDescription className="text-destructive font-medium">{errors.email.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="u-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" /> Telefon
                    </FieldLabel>
                    <Input id="u-phone" {...register('phone')} placeholder="555 123 45 67" />
                  </Field>
                </div>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <Fieldset>
              <FieldLegend>Hesap Ayarları</FieldLegend>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4 items-start">
                  <Field>
                    <FieldLabel htmlFor="u-pass" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-400" />
                      Şifre {isEditing && "(Opsiyonel)"}
                    </FieldLabel>
                    <Input id="u-pass" type="password" {...register('password')} placeholder="••••••••" />
                    {errors.password && <FieldDescription className="text-destructive font-medium">{errors.password.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="u-role" className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-slate-400" /> Rol
                    </FieldLabel>
                    <Select value={currentRole} onValueChange={(val) => setValue('role', val as any)}>
                      <SelectTrigger id="u-role">
                        <SelectValue placeholder="Rol seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ADMIN">Yönetici (Admin)</SelectItem>
                          <SelectItem value="MANAGER">Müdür (Manager)</SelectItem>
                          <SelectItem value="TEAM_LEAD">Ekip Lideri</SelectItem>
                          <SelectItem value="WORKER">Saha Çalışanı</SelectItem>
                          <SelectItem value="CUSTOMER">Müşteri Temsilcisi</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {isEditing && (
                  <Field orientation="horizontal" className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel className="font-bold">Hesap Durumu</FieldLabel>
                      <FieldDescription>{currentStatus ? 'Kullanıcı sistemde aktif' : 'Kullanıcı girişi engellenmiş'}</FieldDescription>
                    </div>
                    <Switch
                      checked={currentStatus}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                    />
                  </Field>
                )}
              </FieldGroup>
            </Fieldset>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6">
                İptal
              </Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 px-8">
                {isLoading ? (
                  <>
                    <CustomSpinner className="mr-2 h-4 w-4 animate-spin" />
                    İşleniyor
                  </>
                ) : (
                  isEditing ? 'Güncelle' : 'Kullanıcı Oluştur'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
