'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, XCircleIcon, BanknoteIcon, WrenchIcon, AlertCircleIcon } from "lucide-react";

interface ApprovalsClientProps {
  initialCosts: any[];
  initialSteps: any[];
}

export default function ApprovalsClient({ initialCosts, initialSteps }: ApprovalsClientProps) {
  const router = useRouter();
  const [costs, setCosts] = useState(initialCosts);
  const [steps, setSteps] = useState(initialSteps);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, type: 'COST' | 'STEP' | 'SUB_STEP', action: 'APPROVE' | 'REJECT') => {
    try {
      setLoadingId(id);
      let reason = '';
      if (action === 'REJECT') {
        const input = window.prompt("Lütfen ret sebebini belirtin:");
        if (input === null) return; // User cancelled
        reason = input;
      }

      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action, reason })
      });

      if (!res.ok) throw new Error('İşlem başarısız');

      toast.success(action === 'APPROVE' ? 'Onaylandı' : 'Reddedildi');

      if (type === 'COST') {
        setCosts(costs.filter(c => c.id !== id));
      } else {
        setSteps(steps.filter(s => s.id !== id));
      }

      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error('Geliştirici uyarısı: İşlem sırasında bir hata oluştu.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Tabs defaultValue="costs" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <TabsTrigger value="costs" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
          <BanknoteIcon className="w-4 h-4 mr-2" />
          Mali Onaylar
          <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-600">{costs.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="jobs" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
          <WrenchIcon className="w-4 h-4 mr-2" />
          İş Emri Onayları
          <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-600">{steps.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="costs" className="space-y-4">
        {costs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <CheckCircle2Icon className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">Bekleyen Mali Onay Yok</h3>
            <p>Tüm finansal talepler onaylanmış veya incelenmiş görünüyor.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {costs.map((cost) => (
              <Card key={cost.id} className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Bekliyor</Badge>
                    <span className="text-xs text-slate-400 font-medium">#{cost.job?.jobNo || cost.job?.id?.substring(0,6)}</span>
                  </div>
                  <CardTitle className="text-lg mt-2 font-bold">{cost.description}</CardTitle>
                  <CardDescription className="line-clamp-1">{cost.job?.title}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="text-slate-500">Tutar:</span>
                    <span className="font-bold text-lg text-slate-900 dark:text-slate-100">{cost.amount.toLocaleString('tr-TR', { style: 'currency', currency: cost.currency || 'TRY' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Talep Eden:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{cost.createdBy?.name || cost.createdBy?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Tarih:</span>
                    <span>{new Date(cost.date).toLocaleDateString("tr-TR")}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    disabled={loadingId === cost.id}
                    onClick={() => handleAction(cost.id, 'COST', 'REJECT')}
                  >
                     <XCircleIcon className="w-4 h-4 mr-1.5" />
                     Reddet
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                    disabled={loadingId === cost.id}
                    onClick={() => handleAction(cost.id, 'COST', 'APPROVE')}
                  >
                     <CheckCircle2Icon className="w-4 h-4 mr-1.5" />
                     Onayla
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="jobs" className="space-y-4">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <CheckCircle2Icon className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">Bekleyen İş Emri Yok</h3>
            <p>Tüm operasyonel adımlar onaylanmış görünüyor.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.id} className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Onay Bekliyor</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{step.type === 'STEP' ? 'Adım' : 'Alt Adım'}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 font-bold">{step.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Müşteri: <span className="font-semibold text-slate-700 dark:text-slate-300">{step.customerName || 'Bilinmiyor'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="text-slate-500">İş Kodu:</span>
                    <span className="font-semibold">{step.jobNo}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-500 mt-2">
                     <AlertCircleIcon className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                     <p className="line-clamp-2 italic">{step.description || 'Açıklama belirtilmemiş.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                    <span>Tamamlayan: <span className="font-semibold">{step.completedBy?.name || 'Sistem'}</span></span>
                    <span>Tarih: {new Date(step.completedAt || step.startedAt || Date.now()).toLocaleDateString("tr-TR")}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    disabled={loadingId === step.id}
                    onClick={() => handleAction(step.id, step.type, 'REJECT')}
                  >
                     <XCircleIcon className="w-4 h-4 mr-1.5" />
                     Reddet
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                    disabled={loadingId === step.id}
                    onClick={() => handleAction(step.id, step.type, 'APPROVE')}
                  >
                     <CheckCircle2Icon className="w-4 h-4 mr-1.5" />
                     Onayla
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
