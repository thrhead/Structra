'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon, Users, UserCog, ClipboardList, Settings2 } from 'lucide-react'
import { 
  Field, 
  FieldGroup, 
  FieldLabel, 
  FieldDescription, 
  Fieldset, 
  FieldLegend,
  FieldSeparator 
} from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createTeamAction, updateTeamAction } from '@/lib/actions/teams'
import { CustomSpinner } from '@/components/ui/custom-spinner'

const teamSchema = z.object({
  name: z.string().min(2, 'Ekip adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  leadId: z.string().optional().nullable(),
  isActive: z.boolean(),
  memberIds: z.array(z.string()).optional()
})

type TeamFormData = z.infer<typeof teamSchema>

interface User {
  id: string
  name: string | null
  role: string
}

interface TeamDialogProps {
  team?: {
    id: string
    name: string
    description: string | null
    leadId: string | null
    isActive: boolean
  }
  users: User[]
  currentMembers?: string[]
  trigger?: React.ReactNode
}

export function TeamDialog({ team, users, currentMembers = [], trigger }: TeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name || '',
      description: team?.description || '',
      leadId: team?.leadId || 'none',
      isActive: team?.isActive ?? true,
      memberIds: currentMembers
    }
  })

  useEffect(() => {
    if (team) {
      setValue('name', team.name)
      setValue('description', team.description || '')
      setValue('leadId', team.leadId || 'none')
      setValue('isActive', team.isActive)
      setValue('memberIds', currentMembers)
    }
  }, [team, currentMembers, setValue])

  const selectedMembers = watch('memberIds') || []

  const toggleMember = (userId: string) => {
    const updated = selectedMembers.includes(userId)
      ? selectedMembers.filter(id => id !== userId)
      : [...selectedMembers, userId]
    setValue('memberIds', updated)
  }

  const onSubmit = async (data: TeamFormData) => {
    setLoading(true)
    try {
      if (team) {
        await updateTeamAction(team.id, data)
        toast.success('Ekip güncellendi')
      } else {
        await createTeamAction(data)
        toast.success('Ekip oluşturuldu')
      }

      setOpen(false)
      if (!team) reset()
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'İşlem başarısız')
    } finally {
      setLoading(false)
    }
  }

  const workerUsers = users.filter(u => u.role === 'WORKER' || u.role === 'TEAM_LEAD')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 rounded-xl">
            <PlusIcon className="h-4 w-4" />
            Yeni Ekip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {team ? 'Ekip Düzenle' : 'Yeni Ekip Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FieldGroup>
            <Fieldset>
              <FieldLegend className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                Ekip Kimliği
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="t-name">Ekip Adı *</FieldLabel>
                  <Input id="t-name" {...register('name')} placeholder="Örn: Kuzey Bölge Montaj Ekibi" required />
                  {errors.name && <FieldDescription className="text-destructive font-medium">{errors.name.message}</FieldDescription>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="t-desc">Açıklama</FieldLabel>
                  <Textarea id="t-desc" {...register('description')} placeholder="Ekip görev alanı veya özel notlar..." className="resize-none" rows={2} />
                </Field>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <Fieldset>
              <FieldLegend className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-indigo-500" />
                Yönetim & Üyeler
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="t-lead">Varsayılan Ekip Lideri</FieldLabel>
                  <Select 
                    value={watch('leadId') || 'none'} 
                    onValueChange={(val) => setValue('leadId', val)}
                  >
                    <SelectTrigger id="t-lead">
                      <SelectValue placeholder="Bir lider seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">Lider Atanmadı</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Bu kullanıcı sahada yapılacak işlerde varsayılan onay mercidir.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel className="flex items-center justify-between">
                    <span>Ekip Üyelerini Seç</span>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                      {selectedMembers.length} Seçili
                    </span>
                  </FieldLabel>
                  <div className="border rounded-2xl p-2 space-y-1 max-h-[200px] overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                    {workerUsers.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <FieldDescription>Sistemde uygun çalışan bulunamadı.</FieldDescription>
                      </div>
                    ) : (
                      workerUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
                        >
                          <Checkbox
                            id={`m-${user.id}`}
                            checked={selectedMembers.includes(user.id)}
                            onCheckedChange={() => toggleMember(user.id)}
                            className="rounded-md"
                          />
                          <label
                            htmlFor={`m-${user.id}`}
                            className="text-sm font-semibold cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{user.name}</span>
                            {user.role === 'TEAM_LEAD' && (
                              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Lider</span>
                            )}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </Field>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <Fieldset>
              <FieldLegend className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-indigo-500" />
                Operasyonel Durum
              </FieldLegend>
              <FieldGroup>
                <Field orientation="horizontal" className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 rounded-2xl justify-between">
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel className="font-bold">Aktiflik Durumu</FieldLabel>
                    <FieldDescription>Pasif ekipler yeni işlere atanamazlar.</FieldDescription>
                  </div>
                  <Select 
                    value={String(watch('isActive'))} 
                    onValueChange={(val) => setValue('isActive', val === 'true')}
                  >
                    <SelectTrigger className="w-[120px] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Pasif</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </Fieldset>

            <div className="flex justify-end gap-3 mt-4 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl min-w-[100px]">
                İptal
              </Button>
              <Button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                {loading ? (
                  <>
                    <CustomSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor
                  </>
                ) : (
                  team ? 'Değişiklikleri Kaydet' : 'Ekibi Oluştur'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
