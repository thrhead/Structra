'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CheckIcon, XIcon, Loader2Icon } from 'lucide-react'

interface ApprovalDialogProps {
  approval: any
}

export function ApprovalDialog({ approval }: ApprovalDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<'APPROVED' | 'REJECTED' | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!action) return

    setLoading(true)
    try {
      const response = await fetch(`/api/approvals/${approval.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          notes: notes || undefined
        })
      })

      if (response.ok) {
        setOpen(false)
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'İşlem başarısız oldu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => setAction('APPROVED')}
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            Onayla
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setAction('REJECTED')}
          >
            <XIcon className="h-4 w-4 mr-1" />
            Reddet
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'APPROVED' ? 'İşi Onayla' : 'İşi Reddet'}
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2 mt-2">
              <p><span className="font-medium">İş:</span> {approval.job.title}</p>
              <p><span className="font-medium">Müşteri:</span> {approval.job.customer.company}</p>
              <p><span className="font-medium">Talep Eden:</span> {approval.requester.name}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Not {action === 'REJECTED' && '(Opsiyonel)'}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                action === 'APPROVED'
                  ? 'Onay notu ekleyebilirsiniz...'
                  : 'Red nedeni belirtebilirsiniz...'
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant={action === 'APPROVED' ? 'default' : 'destructive'}
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                {action === 'APPROVED' ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Onayla
                  </>
                ) : (
                  <>
                    <XIcon className="h-4 w-4 mr-2" />
                    Reddet
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
