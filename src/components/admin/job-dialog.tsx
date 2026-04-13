'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  PlusIcon, 
  XIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  CornerDownRightIcon, 
  UserCog, 
  Briefcase, 
  LayoutList, 
  CalendarDays, 
  Coins, 
  CheckCircle2 
} from 'lucide-react'
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
import { createJobAction, updateJobAction } from '@/lib/actions/jobs'
import { CustomSpinner } from '@/components/ui/custom-spinner'

const jobSchema = z.object({
  title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(3, 'İş başlığı en az 3 karakter olmalıdır'),
  projectNo: z.string().optional().nullable().or(z.literal('')),
  description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  customerId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Müşteri seçilmelidir'),
  teamId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
  jobLeadId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  acceptanceStatus: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], { required_error: 'Öncelik seçilmelidir' }),
  location: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  scheduledDate: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  scheduledEndDate: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  startedAt: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  completedDate: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
  budget: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  estimatedDuration: z.preprocess((val) => (val === '' || val === null ? undefined : Number(val)), z.number().optional()),
  steps: z.array(z.object({
    id: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }),
    description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    subSteps: z.array(z.object({
      id: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
      title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' })
    })).optional()
  })).optional().nullable()
})

type FormData = z.infer<typeof jobSchema>

interface Customer {
  id: string
  company: string
  user: { name: string | null }
}

interface Team {
  id: string
  name: string
  lead?: { id: string; name: string | null } | null
  members?: { user: { id: string; name: string | null } }[]
}

interface ChecklistStep {
  id?: string
  title: string
  description?: string
  subSteps?: { id?: string, title: string }[]
}

interface Template {
  id: string
  name: string
  steps: ChecklistStep[]
}

interface JobDialogProps {
  customers: Customer[]
  teams: Team[]
  templates: Template[]
  job?: any
  trigger?: React.ReactNode
}

export function JobDialog({ customers, teams, templates, job, trigger }: JobDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [steps, setSteps] = useState<ChecklistStep[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      projectNo: '',
      description: '',
      customerId: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      acceptanceStatus: 'PENDING',
      ...job && {
        title: job.title,
        projectNo: job.projectNo || '',
        description: job.description || '',
        customerId: job.customerId,
        teamId: job.assignments?.[0]?.teamId || 'none',
        jobLeadId: job.jobLeadId || 'none',
        priority: job.priority,
        status: job.status,
        acceptanceStatus: job.acceptanceStatus,
        location: job.location || '',
        scheduledDate: job.scheduledDate ? new Date(job.scheduledDate).toISOString().slice(0, 16) : '',
        scheduledEndDate: job.scheduledEndDate ? new Date(job.scheduledEndDate).toISOString().slice(0, 16) : '',
        startedAt: job.startedAt ? new Date(job.startedAt).toISOString().slice(0, 16) : '',
        completedDate: job.completedDate ? new Date(job.completedDate).toISOString().slice(0, 16) : '',
        budget: job.budget,
        estimatedDuration: job.estimatedDuration,
      }
    }
  })

  const customerId = watch('customerId')
  const teamId = watch('teamId')
  const jobLeadId = watch('jobLeadId')
  const priority = watch('priority')
  const status = watch('status')
  const acceptanceStatus = watch('acceptanceStatus')

  const selectedTeam = teams.find(t => t.id === teamId)

  useEffect(() => {
    if (job && job.steps) {
      setSteps(job.steps.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description || '',
        subSteps: s.subSteps?.map((ss: any) => ({
          id: ss.id,
          title: ss.title
        })) || []
      })))
    } else {
      setSteps([])
    }
  }, [job])

  useEffect(() => {
    if (job) {
      setValue('title', job.title)
      setValue('projectNo', job.projectNo || '')
      setValue('description', job.description || '')
      setValue('customerId', job.customerId)
      setValue('teamId', job.assignments?.[0]?.teamId || 'none')
      setValue('jobLeadId', job.jobLeadId || 'none')
      setValue('priority', job.priority)
      setValue('status', job.status)
      setValue('acceptanceStatus', job.acceptanceStatus)
      setValue('location', job.location || '')
      setValue('scheduledDate', job.scheduledDate ? new Date(job.scheduledDate).toISOString().slice(0, 16) : '')
      setValue('scheduledEndDate', job.scheduledEndDate ? new Date(job.scheduledEndDate).toISOString().slice(0, 16) : '')
      setValue('startedAt', job.startedAt ? new Date(job.startedAt).toISOString().slice(0, 16) : '')
      setValue('completedDate', job.completedDate ? new Date(job.completedDate).toISOString().slice(0, 16) : '')
      setValue('budget', job.budget)
      setValue('estimatedDuration', job.estimatedDuration)
    }
  }, [job, setValue])

  const addStep = () => {
    setSteps([...steps, { title: '', description: '', subSteps: [] }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const addSubStep = (stepIndex: number) => {
    const newSteps = [...steps]
    if (!newSteps[stepIndex].subSteps) newSteps[stepIndex].subSteps = []
    newSteps[stepIndex].subSteps!.push({ title: '' })
    setSteps(newSteps)
  }

  const removeSubStep = (stepIndex: number, subStepIndex: number) => {
    const newSteps = [...steps]
    if (newSteps[stepIndex].subSteps) {
      newSteps[stepIndex].subSteps = newSteps[stepIndex].subSteps!.filter((_, i) => i !== subStepIndex)
      setSteps(newSteps)
    }
  }

  const updateSubStep = (stepIndex: number, subStepIndex: number, value: string) => {
    const newSteps = [...steps]
    if (newSteps[stepIndex].subSteps) {
      newSteps[stepIndex].subSteps![subStepIndex].title = value
      setSteps(newSteps)
    }
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === steps.length - 1) return
    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setSteps(newSteps)
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const templateSteps = template.steps.map(step => ({
        title: step.title,
        description: step.description || '',
        subSteps: step.subSteps?.map(sub => ({ title: sub.title })) || []
      }))
      setSteps(templateSteps)
    }
  }

  const onFormError = (errors: any) => {
    if (errors.title) toast.error(errors.title.message)
    if (errors.customerId) toast.error(errors.customerId.message)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const validSteps = steps.filter(step => step.title && step.title.trim() !== '')
        .map(step => ({
          id: step.id,
          title: step.title,
          description: step.description,
          subSteps: step.subSteps?.filter(sub => sub.title && sub.title.trim() !== '')
            .map(sub => ({
              id: sub.id,
              title: sub.title
            })) || []
        }))

      if (job) {
        await updateJobAction({
          id: job.id,
          ...data,
          jobLeadId: data.jobLeadId === 'none' ? null : data.jobLeadId,
          steps: validSteps.length > 0 ? validSteps : []
        })
        toast.success('İş başarıyla güncellendi')
      } else {
        await createJobAction({
          ...data,
          steps: validSteps
        })
        toast.success('İş başarıyla oluşturuldu')
      }

      setOpen(false)
      if (!job) {
        reset()
        setSteps([])
      }
      router.refresh()
    } catch (error: any) {
      console.error('JobDialog error:', error)
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 rounded-xl">
            <PlusIcon className="h-4 w-4" />
            Yeni İş
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {job ? 'İş Düzenle' : 'Yeni İş Oluştur'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="mt-6">
          <FieldGroup>
            <Fieldset>
              <FieldLegend className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                Temel İş Bilgileri
              </FieldLegend>
              <FieldGroup>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Field>
                      <FieldLabel htmlFor="j-title">İş Başlığı *</FieldLabel>
                      <Input 
                        id="j-title" 
                        {...register('title')} 
                        placeholder="Örn: Klima Montajı - A Blok"
                        className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                        required 
                      />
                      {errors.title && <FieldDescription className="text-destructive font-medium">{errors.title.message}</FieldDescription>}
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="j-prj">Proje No / Kodu</FieldLabel>
                    <Input id="j-prj" {...register('projectNo')} placeholder="Örn: PRJ-2024" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="j-cust">Müşteri Seçimi *</FieldLabel>
                    <Select value={customerId} onValueChange={(val) => setValue('customerId', val)}>
                      <SelectTrigger id="j-cust" className={errors.customerId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Bir müşteri seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.company} ({customer.user.name})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.customerId && <FieldDescription className="text-destructive font-medium">{errors.customerId.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="j-loc">Konum / Adres</FieldLabel>
                    <Input id="j-loc" {...register('location')} placeholder="GPS veya Açık Adres" />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="j-desc">İş Açıklaması</FieldLabel>
                  <Textarea id="j-desc" {...register('description')} placeholder="İşe dair detaylı talimatlar..." className="resize-none" rows={2} />
                </Field>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <Fieldset>
              <FieldLegend className="flex items-center gap-2">
                <LayoutList className="h-4 w-4 text-indigo-500" />
                Atama & Durum Ayarları
              </FieldLegend>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="j-team">Görevli Ekip</FieldLabel>
                    <Select value={teamId || 'none'} onValueChange={(val) => {
                      setValue('teamId', val === 'none' ? null : val)
                      const newTeam = teams.find(t => t.id === val)
                      if (newTeam?.lead) setValue('jobLeadId', newTeam.lead.id)
                    }}>
                      <SelectTrigger id="j-team">
                        <SelectValue placeholder="Ekip atayın" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Henüz Atama Yapma</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="j-lead">Sorumlu Ekip Lideri</FieldLabel>
                    <Select value={jobLeadId || 'none'} onValueChange={(val) => setValue('jobLeadId', val === 'none' ? null : val)}>
                      <SelectTrigger id="j-lead">
                        <SelectValue placeholder="Lider seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Lider Atanmadı</SelectItem>
                        {selectedTeam?.members?.map((m) => (
                          <SelectItem key={m.user.id} value={m.user.id}>
                            {m.user.name} {m.user.id === selectedTeam.lead?.id ? '(Varsay. Lider)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="j-stat">İş Durumu</FieldLabel>
                    <Select value={status} onValueChange={(val: any) => setValue('status', val)}>
                      <SelectTrigger id="j-stat"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Beklemede</SelectItem>
                        <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                        <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                        <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="j-acc">Kabul Durumu</FieldLabel>
                    <Select value={acceptanceStatus} onValueChange={(val: any) => setValue('acceptanceStatus', val)}>
                      <SelectTrigger id="j-acc"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Onay Bekliyor</SelectItem>
                        <SelectItem value="ACCEPTED">Kabul Edildi</SelectItem>
                        <SelectItem value="REJECTED">Reddedildi</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="j-prio">Öncelik</FieldLabel>
                    <Select value={priority} onValueChange={(val: any) => setValue('priority', val)}>
                      <SelectTrigger id="j-prio"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Düşük</SelectItem>
                        <SelectItem value="MEDIUM">Orta (Std)</SelectItem>
                        <SelectItem value="HIGH">Yüksek</SelectItem>
                        <SelectItem value="URGENT">Kritik / Acil</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </Fieldset>

            <FieldSeparator />

            <div className="grid grid-cols-2 gap-8">
              <Fieldset>
                <FieldLegend className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-500" />
                  Zaman Çizelgesi
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="j-s-date">Planlanan Başlangıç</FieldLabel>
                    <Input id="j-s-date" type="datetime-local" {...register('scheduledDate')} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="j-e-date">Tahmini Bitiş</FieldLabel>
                    <Input id="j-e-date" type="datetime-local" {...register('scheduledEndDate')} />
                  </Field>
                </FieldGroup>
              </Fieldset>

              <Fieldset>
                <FieldLegend className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-indigo-500" />
                  Maliyet & Verimlilik
                </FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="j-bud">Bütçe Tahmini (TL)</FieldLabel>
                    <Input id="j-bud" type="number" step="0.01" {...register('budget', { valueAsNumber: true })} placeholder="0.00" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="j-dur">Tahmini Süre (Dakika)</FieldLabel>
                    <Input id="j-dur" type="number" {...register('estimatedDuration', { valueAsNumber: true })} placeholder="60" />
                  </Field>
                </FieldGroup>
              </Fieldset>
            </div>

            <FieldSeparator />

            <Fieldset>
              <div className="flex items-center justify-between gap-4 mb-4">
                <FieldLegend className="flex items-center gap-2 mb-0">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  Operasyonel Kontrol Listesi
                </FieldLegend>
                <div className="flex items-center gap-2">
                  <Select onValueChange={loadTemplate}>
                    <SelectTrigger className="w-[160px] h-9 rounded-xl text-xs bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Şablondan Yükle" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="sm" onClick={addStep} className="h-9 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <PlusIcon className="h-4 w-4 mr-1" /> Yeni Adım
                  </Button>
                </div>
              </div>

              {steps.length === 0 ? (
                <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/30">
                  <FieldDescription>Henüz bir adım eklenmedi. İş detaylarını belirlemek için yukarıdaki butonları kullanabilirsiniz.</FieldDescription>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="relative group/step p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-1 items-center justify-center p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 min-w-[32px]">
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => moveStep(index, 'up')} disabled={index === 0}><ChevronUpIcon className="h-3 w-3" /></Button>
                          <span className="text-xs font-black text-slate-400">{index + 1}</span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1}><ChevronDownIcon className="h-3 w-3" /></Button>
                        </div>

                        <div className="flex-1 space-y-3">
                          <Input 
                            placeholder="Adım başlığı (örn: Temel hazırlığı)" 
                            value={step.title} 
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            className="font-bold border-transparent focus:border-indigo-500 bg-transparent shadow-none px-0 text-base"
                          />
                          <Textarea 
                            placeholder="Bu adımla ilgili detaylı notlar..." 
                            value={step.description} 
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            className="text-sm bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-2xl resize-none"
                            rows={2}
                          />

                          <div className="space-y-2 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                            {step.subSteps?.map((subStep, subIndex) => (
                              <div key={subIndex} className="flex items-center gap-2 animate-in slide-in-from-left-2 transition-all">
                                <CornerDownRightIcon className="h-4 w-4 text-indigo-400" />
                                <Input 
                                  className="h-8 text-sm rounded-xl" 
                                  placeholder="Alt aksiyon..." 
                                  value={subStep.title} 
                                  onChange={(e) => updateSubStep(index, subIndex, e.target.value)} 
                                />
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => removeSubStep(index, subIndex)}><XIcon className="h-4 w-4" /></Button>
                              </div>
                            ))}
                            <Button type="button" variant="ghost" size="sm" onClick={() => addSubStep(index)} className="h-8 text-xs font-bold text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl">
                              <PlusIcon className="h-3 w-3 mr-1" /> Alt Görev Ekle
                            </Button>
                          </div>
                        </div>

                        <Button type="button" variant="ghost" size="icon" className="opacity-0 group-hover/step:opacity-100 text-destructive hover:bg-destructive/10 rounded-xl transition-all" onClick={() => removeStep(index)}><XIcon className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Fieldset>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl min-w-[100px] h-11">İptal</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] h-11 shadow-lg shadow-indigo-500/20">
                {isLoading ? (
                  <><CustomSpinner className="mr-2 h-4 w-4 animate-spin" />İşleniyor</>
                ) : (
                  job ? 'Güncelle' : 'İşi Başlat / Oluştur'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}