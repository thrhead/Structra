'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, XCircleIcon, BanknoteIcon, WrenchIcon, AlertCircleIcon, ImageIcon, SearchIcon, CalendarIcon, UserIcon } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ApprovalsClientProps {
  initialCosts: any[];
  initialSteps: any[];
}

// ─── Reusable Skeleton ────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="h-6 w-3/4 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="h-4 w-1/2 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
      <div className="flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-9 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-fade-in-up">
      <div className="p-5 rounded-3xl bg-slate-100/80 dark:bg-slate-800/50 mb-5 ring-1 ring-slate-200 dark:ring-slate-700/50">
        <Icon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 text-center max-w-xs">{description}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApprovalsClient({ initialCosts, initialSteps }: ApprovalsClientProps) {
  const router = useRouter();
  const [costs, setCosts] = useState(initialCosts);
  const [steps, setSteps] = useState(initialSteps);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleAction = async (id: string, type: 'COST' | 'STEP' | 'SUB_STEP', action: 'APPROVE' | 'REJECT') => {
    try {
      setLoadingId(id);
      let reason = '';
      if (action === 'REJECT') {
        const input = window.prompt("Lütfen ret sebebini belirtin:");
        if (input === null) return;
        reason = input;
      }

      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action, reason })
      });

      if (!res.ok) throw new Error('İşlem başarısız');

      toast.success(action === 'APPROVE' ? '✓ Onaylandı' : '✗ Reddedildi');

      if (type === 'COST') {
        setCosts(costs.filter(c => c.id !== id));
      } else {
        setSteps(steps.filter(s => s.id !== id));
      }

      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Tabs defaultValue="costs" className="w-full space-y-6">
        {/* ─── Tab Bar ─── */}
        <div className="flex items-center justify-between">
          <TabsList className="h-10 grid grid-cols-2 max-w-xs bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-1 gap-1 backdrop-blur-sm">
            <TabsTrigger
              value="costs"
              className="rounded-xl text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <BanknoteIcon className="w-3.5 h-3.5 mr-1.5" />
              Mali
              <Badge className="ml-1.5 h-4 px-1.5 min-w-4 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-0">
                {costs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="rounded-xl text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <WrenchIcon className="w-3.5 h-3.5 mr-1.5" />
              İş Emirleri
              <Badge className="ml-1.5 h-4 px-1.5 min-w-4 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                {steps.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ─── Cost Tab ─── */}
        <TabsContent value="costs" className="space-y-4 mt-0">
          {costs.length === 0 ? (
            <EmptyState
              icon={CheckCircle2Icon}
              title="Bekleyen Mali Onay Yok"
              description="Tüm finansal talepler onaylanmış veya incelenmiş görünüyor."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {costs.map((cost) => (
                <Card
                  key={cost.id}
                  className="group rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-indigo-500/8 dark:hover:shadow-indigo-900/20 hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col overflow-hidden"
                >
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="border border-amber-200/80 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-800/40 rounded-full px-2.5 h-6 text-[11px] font-semibold">
                        Bekliyor
                      </Badge>
                      <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-lg">
                        #{cost.job?.jobNo || cost.job?.id?.substring(0, 6)}
                      </span>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                      {cost.description}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-1 mt-0.5 text-slate-400">{cost.job?.title}</CardDescription>
                  </CardHeader>

                  <CardContent className="px-5 pb-4 flex-1 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
                        {cost.amount.toLocaleString('tr-TR', { style: 'currency', currency: cost.currency || 'TRY' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <UserIcon className="w-3 h-3 shrink-0" />
                      <span className="font-medium text-slate-600 dark:text-slate-300">{cost.createdBy?.name || cost.createdBy?.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <CalendarIcon className="w-3 h-3 shrink-0" />
                      <span>{new Date(cost.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl h-9 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-slate-200 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-900 transition-all duration-200"
                      disabled={loadingId === cost.id}
                      onClick={() => handleAction(cost.id, 'COST', 'REJECT')}
                    >
                      <XCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                      Reddet
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
                      disabled={loadingId === cost.id}
                      onClick={() => handleAction(cost.id, 'COST', 'APPROVE')}
                    >
                      <CheckCircle2Icon className="w-3.5 h-3.5 mr-1.5" />
                      Onayla
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Job Steps Tab ─── */}
        <TabsContent value="jobs" className="space-y-4 mt-0">
          {steps.length === 0 ? (
            <EmptyState
              icon={CheckCircle2Icon}
              title="Bekleyen İş Emri Yok"
              description="Tüm operasyonel adımlar onaylanmış görünüyor."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {steps.map((step) => (
                <Card
                  key={step.id}
                  className="group rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-emerald-500/8 dark:hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col overflow-hidden"
                >
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="border border-amber-200/80 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-800/40 rounded-full px-2.5 h-6 text-[11px] font-semibold">
                        Onay Bekliyor
                      </Badge>
                      <Badge className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-0 rounded-lg text-[10px] font-medium h-6 px-2">
                        {step.type === 'STEP' ? 'Adım' : 'Alt Adım'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5 text-slate-400">
                      {step.customerName || 'Müşteri bilinmiyor'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-5 pb-4 flex-1 space-y-3">
                    {/* Job No */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500">İş Kodu:</span>
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-lg">{step.jobNo}</span>
                    </div>

                    {/* Description */}
                    {step.description && (
                      <div className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                        <p className="line-clamp-2 italic leading-relaxed">{step.description}</p>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        <span className="font-medium text-slate-600 dark:text-slate-300">{step.completedBy?.name || 'Sistem'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{new Date(step.completedAt || step.startedAt || Date.now()).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Photos Section */}
                    {step.photos && step.photos.length > 0 ? (
                      <div className="pt-1">
                        <div className="flex items-center gap-1.5 mb-2">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {step.photos.length} Fotoğraf
                          </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {step.photos.map((photo: any) => (
                            <div
                              key={photo.id}
                              className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 group/photo shadow-sm"
                              onClick={() => setSelectedPhoto(photo.url)}
                            >
                              <Image
                                src={photo.url}
                                alt="İş adımı fotoğrafı"
                                fill
                                className="object-cover group-hover/photo:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-2xl">
                                <SearchIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-500 dark:text-rose-400 text-[11px]">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium">Fotoğraf henüz yüklenmemiş</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl h-9 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-slate-200 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-900 transition-all duration-200"
                      disabled={loadingId === step.id}
                      onClick={() => handleAction(step.id, step.type, 'REJECT')}
                    >
                      <XCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                      Reddet
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
                      disabled={loadingId === step.id}
                      onClick={() => handleAction(step.id, step.type, 'APPROVE')}
                    >
                      <CheckCircle2Icon className="w-3.5 h-3.5 mr-1.5" />
                      Onayla
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Photo Lightbox ─── */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-3 bg-black/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Fotoğraf Önizleme</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            {selectedPhoto && (
              <Image
                src={selectedPhoto}
                alt="Büyük boy fotoğraf"
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
          <div className="flex justify-center pt-1 pb-1">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full px-5 h-8 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium transition-all duration-200"
              onClick={() => setSelectedPhoto(null)}
            >
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
