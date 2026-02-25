
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BrainCircuit, Clock, BarChart3, TrendingUp, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ForecastData {
    title: string
    averageDurationHours: number
    sampleSize: number
}

export function ForecastingView() {
    const t = useTranslations('Admin')
    const tCommon = useTranslations('Common')
    const [forecasts, setForecasts] = useState<ForecastData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchForecasts()
    }, [])

    const fetchForecasts = async () => {
        try {
            const res = await fetch('/api/admin/jobs/forecast')
            const data = await res.json()
            setForecasts(data)
        } catch (error) {
            console.error('Forecast fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center animate-pulse">{tCommon('loading')}</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                    {t('forecastingTitle')}
                </h2>
                <p className="text-muted-foreground">
                    {t('forecastingSubtitle')}
                </p>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Nasıl Çalışır?</AlertTitle>
                <AlertDescription className="text-sm">
                    {t('intelligenceDesc')}
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forecasts.length === 0 ? (
                    <Card className="col-span-full p-12 flex flex-col items-center justify-center text-muted-foreground italic">
                        <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                        {t('noData')}
                    </Card>
                ) : (
                    forecasts.map((item, idx) => (
                        <Card key={idx} className="overflow-hidden border-border hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm shadow-sm">
                            <CardHeader className="pb-2 bg-muted/30">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 truncate">
                                    <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-bold text-foreground">
                                            {item.averageDurationHours} <span className="text-sm font-normal text-muted-foreground">saat</span>
                                        </p>
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t('avgDuration')}</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">
                                        {item.sampleSize} {t('samples')}
                                    </div>
                                </div>
                                
                                {/* Simple Bar Visualization */}
                                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-500" 
                                        style={{ width: `${Math.min(100, (item.averageDurationHours / 8) * 100)}%` }} 
                                    />
                                </div>
                                <p className="mt-2 text-[9px] text-muted-foreground text-right italic">
                                    * 8 saatlik mesai üzerinden hesaplanmıştır.
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
