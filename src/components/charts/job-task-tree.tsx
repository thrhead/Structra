'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface SubStep {
    id: string
    title: string
    isCompleted: boolean
}

interface Step {
    id: string
    title: string
    isCompleted: boolean
    subSteps?: SubStep[]
}

interface JobTaskTreeProps {
    job: {
        id: string
        jobNo: string | null
        title: string
        scheduledDate?: Date | null
        createdAt?: Date | null
        steps: Step[]
    }
}

export function JobTaskTree({ job }: JobTaskTreeProps) {
    const { year, monthText, overallProgress } = useMemo(() => {
        const baseDate = job.scheduledDate ? new Date(job.scheduledDate) : (job.createdAt ? new Date(job.createdAt) : new Date())
        const y = format(baseDate, 'yyyy')
        const m = format(baseDate, 'MMMM', { locale: tr })

        const totalSteps = job.steps?.length || 0
        const completedSteps = job.steps?.filter(s => s.isCompleted).length || 0
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

        return { year: y, monthText: m, overallProgress: progress }
    }, [job])

    // Utility for percentage badge color
    const getProgressColor = (pct: number) => {
        if (pct === 100) return "bg-green-100 text-green-700 border-green-200"
        if (pct > 0) return "bg-blue-100 text-blue-700 border-blue-200"
        return "bg-gray-100 text-gray-600 border-gray-200"
    }

    const calculateStepProgress = (step: Step) => {
        if (!step.subSteps || step.subSteps.length === 0) {
            return step.isCompleted ? 100 : 0
        }
        const comp = step.subSteps.filter(s => s.isCompleted).length
        return Math.round((comp / step.subSteps.length) * 100)
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Network className="h-5 w-5 text-indigo-500" />
                    Görev Ağacı Görünümü
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-x-auto">
                <div className="min-w-[600px] font-sans">
                    {/* Level 1: Year */}
                    <div className="flex items-center gap-3 relative pb-8">
                        <div className="relative z-10 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-sm font-bold text-sm border-2 border-slate-700">
                            Yıl: {year}
                        </div>
                        {/* Connecting Line Down to Month */}
                        <div className="absolute left-6 top-10 w-0.5 h-full bg-slate-300 -z-10" />
                    </div>

                    {/* Level 2: Month */}
                    <div className="relative ml-12 pb-8">
                        <div className="absolute -left-6 top-5 w-6 h-0.5 bg-slate-300" />
                        <div className="absolute -left-6 top-0 w-0.5 h-full bg-slate-300 -z-10" />
                        <div className="relative z-10 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm font-semibold capitalize text-sm border-2 border-indigo-500">
                            Ay: {monthText}
                        </div>
                    </div>

                    {/* Level 3: Project No & Title */}
                    <div className="relative ml-24 pb-8">
                        <div className="absolute -left-12 top-0 w-0.5 h-full bg-slate-300 -z-10" />
                        <div className="absolute -left-12 top-5 w-12 h-0.5 bg-slate-300" />

                        <div className="relative z-10 inline-flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm min-w-[300px]">
                            <div className="flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    {job.jobNo || 'Proje No Yok'}
                                </div>
                                <div className="font-bold text-slate-800">
                                    {job.title}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-700">%{overallProgress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Level 4: Steps */}
                    <div className="relative ml-36">
                        <div className="absolute -left-12 top-0 w-0.5 h-full bg-slate-300 -z-10" />

                        <div className="flex flex-col gap-6">
                            {job.steps?.map((step, sIdx) => {
                                const stepProgress = calculateStepProgress(step)
                                const isLastStep = sIdx === job.steps.length - 1

                                return (
                                    <div key={step.id} className="relative">
                                        <div className="absolute -left-12 top-5 w-12 h-0.5 bg-slate-300" />
                                        {/* Hide the vertical line after the last item to prevent overhang */}
                                        {isLastStep && (
                                            <div className="absolute -left-12 top-5 w-0.5 h-full bg-white z-0" />
                                        )}

                                        {/* Step Node */}
                                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors group">
                                            <div className="flex-shrink-0">
                                                {step.isCompleted ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 font-medium text-slate-700 text-sm">
                                                {step.title}
                                            </div>
                                            <Badge variant="outline" className={getProgressColor(stepProgress)}>
                                                %{stepProgress}
                                            </Badge>
                                        </div>

                                        {/* Level 5: Substeps */}
                                        {step.subSteps && step.subSteps.length > 0 && (
                                            <div className="relative ml-8 mt-4 flex flex-col gap-3">
                                                <div className="absolute -left-4 top-0 w-0.5 h-full bg-slate-200 -z-10" />

                                                {step.subSteps.map((sub, ssIdx) => {
                                                    const isLastSub = ssIdx === step.subSteps!.length - 1
                                                    return (
                                                        <div key={sub.id} className="relative flex items-center gap-2">
                                                            <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-slate-200" />
                                                            {isLastSub && (
                                                                <div className="absolute -left-4 top-1/2 w-0.5 h-full bg-white z-0" />
                                                            )}

                                                            <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-sm text-slate-600">
                                                                <div className={`w-2 h-2 rounded-full ${sub.isCompleted ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                                {sub.title}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}
