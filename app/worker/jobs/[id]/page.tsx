'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeftIcon, MapPinIcon, CalendarIcon, PhoneIcon, Building2Icon, 
  CheckCircle2Icon, CircleIcon, ClockIcon, AlertCircleIcon 
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface JobDetail {
  id: string
  title: string
  description: string
  status: string
  priority: string
  location: string
  scheduledDate: string
  customer: {
    company: string
    address: string
    user: {
      name: string
      phone: string
      email: string
    }
  }
  steps: {
    id: string
    title: string
    isCompleted: boolean
    order: number
  }[]
}

export default function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchJob()
  }, [params.id])

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/worker/jobs/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch job')
      const data = await res.json()
      setJob(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStep = async (stepId: string) => {
    try {
      // Optimistic update
      setJob(prev => {
        if (!prev) return null
        return {
          ...prev,
          steps: prev.steps.map(s => 
            s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
          )
        }
      })

      const res = await fetch(`/api/worker/jobs/${params.id}/steps/${stepId}/toggle`, {
        method: 'POST'
      })
      
      if (!res.ok) {
        // Revert on error
        fetchJob()
      }
    } catch (error) {
      console.error(error)
      fetchJob()
    }
  }

  const completeJob = async () => {
    if (!confirm('İşi tamamlamak istediğinizden emin misiniz? Bu işlem onay için gönderilecektir.')) {
      return
    }

    try {
      const res = await fetch(`/api/worker/jobs/${params.id}/complete`, {
        method: 'POST'
      })
      
      if (res.ok) {
        alert('İş başarıyla tamamlandı ve onay için gönderildi!')
        router.push('/worker')
      } else {
        const data = await res.json()
        alert(data.error || 'İş tamamlanamadı')
      }
    } catch (error) {
      console.error(error)
      alert('Bir hata oluştu')
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/worker/jobs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        fetchJob()
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="p-6 text-center">Yükleniyor...</div>
  if (!job) return <div className="p-6 text-center">İş bulunamadı</div>

  const completedSteps = job.steps.filter(s => s.isCompleted).length
  const totalSteps = job.steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Badge variant="outline">{job.status}</Badge>
            <span>•</span>
            <span>{job.customer.company}</span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">İlerleme Durumu</span>
            <span className="text-indigo-600 font-bold">%{Math.round(progress)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">
            {totalSteps} adımdan {completedSteps} tanesi tamamlandı
          </p>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">İş Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">Adres</p>
              <p className="text-sm text-gray-600">{job.location || job.customer.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">Tarih</p>
              <p className="text-sm text-gray-600">
                {job.scheduledDate 
                  ? format(new Date(job.scheduledDate), 'd MMMM yyyy, HH:mm', { locale: tr })
                  : 'Belirtilmemiş'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">İletişim</p>
              <p className="text-sm text-gray-600">{job.customer.user.name}</p>
              <a href={`tel:${job.customer.user.phone}`} className="text-sm text-indigo-600 hover:underline">
                {job.customer.user.phone}
              </a>
            </div>
          </div>

          {job.description && (
            <div className="pt-2 border-t mt-2">
              <p className="font-medium text-sm text-gray-900 mb-1">Açıklama</p>
              <p className="text-sm text-gray-600">{job.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kontrol Listesi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {job.steps.map((step) => (
            <div 
              key={step.id} 
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                step.isCompleted ? "bg-green-50" : "hover:bg-gray-50"
              )}
              onClick={() => toggleStep(step.id)}
            >
              <div className={cn(
                "mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors",
                step.isCompleted 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 bg-white"
              )}>
                {step.isCompleted && <CheckCircle2Icon className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  step.isCompleted ? "text-green-900 line-through opacity-70" : "text-gray-900"
                )}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
          {job.steps.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Bu iş için checklist adımı bulunmuyor.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          {job.status === 'PENDING' && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => updateStatus('IN_PROGRESS')}
            >
              İşe Başla
            </Button>
          )}
          
          {job.status === 'IN_PROGRESS' && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              size="lg"
              onClick={completeJob}
              disabled={progress < 100}
            >
              İşi Tamamla
            </Button>
          )}

          {job.status === 'COMPLETED' && (
            <div className="w-full p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium flex items-center justify-center gap-2">
              <CheckCircle2Icon className="h-5 w-5" />
              İş Tamamlandı
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
