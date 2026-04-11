'use client'

import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon } from 'lucide-react'
import { 
  Field, 
  FieldGroup, 
  FieldLabel, 
  FieldDescription, 
  Fieldset, 
  FieldLegend,
  FieldSeparator 
} from '@/components/ui/field'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createCustomerAction, updateCustomerAction } from '@/lib/actions/customers'
import { CustomSpinner } from '@/components/ui/custom-spinner'

const customerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  address: z.string().optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
})

const customerEditSchema = customerSchema.extend({
  password: z.string().optional().or(z.literal('')),
})

type FormData = z.infer<typeof customerEditSchema>

interface CustomerDialogProps {
  customer?: any
  trigger?: React.ReactNode
}

export function CustomerDialog({ customer, trigger }: CustomerDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isEditing = !!customer

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isEditing ? customerEditSchema : customerSchema),
    defaultValues: customer ? {
      name: customer.user.name || '',
      email: customer.user.email || '',
      phone: customer.user.phone || '',
      company: customer.company || '',
      address: customer.address || '',
      taxId: customer.taxId || '',
      notes: customer.notes || '',
      password: ''
    } : undefined
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      if (isEditing) {
        await updateCustomerAction({
          id: customer.id,
          ...data,
          password: data.password || undefined
        })
        toast.success('Müşteri güncellendi')
      } else {
        await createCustomerAction(data as any)
        toast.success('Müşteri başarıyla oluşturuldu')
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
            Yeni Müşteri
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEditing ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FieldGroup>
            <Fieldset>
              <FieldLegend>Yetkili Bilgileri</FieldLegend>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="c-name">Yetkili Kişi *</FieldLabel>
                    <Input id="c-name" {...register('name')} placeholder="Ad Soyad" required />
                    {errors.name && <FieldDescription className="text-destructive font-medium">{errors.name.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="c-email">E-posta Adresi *</FieldLabel>
                    <Input id="c-email" type="email" {...register('email')} placeholder="ornek@email.com" required />
                    {errors.email && <FieldDescription className="text-destructive font-medium">{errors.email.message}</FieldDescription>}
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="c-pass">
                      Giriş Şifresi {isEditing && "(Değişim için doldurun)"}
                    </FieldLabel>
                    <Input id="c-pass" type="password" {...register('password')} />
                    {errors.password && <FieldDescription className="text-destructive font-medium">{errors.password.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="c-phone">Telefon Numarası</FieldLabel>
                    <Input id="c-phone" {...register('phone')} placeholder="555 123 45 67" />
                    {errors.phone && <FieldDescription className="text-destructive font-medium">{errors.phone.message}</FieldDescription>}
                  </Field>
                </div>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <Fieldset>
              <FieldLegend>Firma Detayları</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="c-company">Firma Ünvanı *</FieldLabel>
                  <Input id="c-company" {...register('company')} placeholder="Örn: Yapı Denetim A.Ş." required />
                  {errors.company && <FieldDescription className="text-destructive font-medium">{errors.company.message}</FieldDescription>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="c-tax">Vergi Numarası / T.C.</FieldLabel>
                    <Input id="c-tax" {...register('taxId')} placeholder="Opsiyonel" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="c-address">Firma Adresi</FieldLabel>
                    <Input id="c-address" {...register('address')} placeholder="Opsiyonel" />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="c-notes">Özel Notlar</FieldLabel>
                  <Textarea id="c-notes" {...register('notes')} placeholder="Müşteri hakkında ek detaylar..." className="resize-none" />
                </Field>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                İptal
              </Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                {isLoading ? (
                  <>
                    <CustomSpinner className="mr-2 h-4 w-4 animate-spin" />
                    İşleniyor
                  </>
                ) : (
                  isEditing ? 'Güncelle' : 'Müşteriyi Kaydet'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
