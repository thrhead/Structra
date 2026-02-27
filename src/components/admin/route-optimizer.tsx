
'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPinIcon, NavigationIcon, RefreshCwIcon, HomeIcon, UsersIcon, RouteIcon } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import 'leaflet/dist/leaflet.css'

// Leaflet is for client side only
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false })

// Optional fix for Leaflet missing marker icons in Next.js
if (typeof window !== 'undefined') {
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
}

interface Job {
    id: string
    title: string
    latitude: number | null
    longitude: number | null
    customer: { company: string }
}

interface TeamRoute {
    teamId: string
    teamName: string
    jobs: Job[]
    metrics?: {
        totalDistanceKm: number
        jobCount: number
    }
}

const TEAM_COLORS = [
    '#16A34A', // Green
    '#2563EB', // Blue
    '#DC2626', // Red
    '#D97706', // Amber
    '#7C3AED', // Violet
    '#0891B2', // Cyan
]

export function RouteOptimizer() {
    const [teamRoutes, setTeamRoutes] = useState<TeamRoute[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [fromCenter, setFromCenter] = useState(true)

    const fetchOptimizedRoute = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/jobs/optimize-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    fromCenter: fromCenter,
                    centerLat: 41.0082, // Standard center
                    centerLon: 28.9784
                })
            })
            const data = await res.json()
            setTeamRoutes(data)
            toast.success('Rotalar optimize edildi')
        } catch (error) {
            toast.error('Optimizasyon sırasında hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border overflow-hidden min-h-[600px] flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPinIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Akıllı Rota Optimizasyonu</h3>
                        <p className="text-xs text-muted-foreground">Ekipler için en verimli iş sıralamasını oluşturun.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-md border border-border">
                        <Checkbox
                            id="center"
                            checked={fromCenter}
                            onCheckedChange={(checked) => setFromCenter(!!checked)}
                        />
                        <Label htmlFor="center" className="text-xs font-medium cursor-pointer flex items-center gap-1">
                            <HomeIcon className="w-3 h-3" /> Merkezden Başlat
                        </Label>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-background border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <Button onClick={fetchOptimizedRoute} disabled={loading} size="sm">
                        {loading ? <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" /> : <NavigationIcon className="w-4 h-4 mr-2" />}
                        Hesapla & Optimize Et
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                {/* Map Section */}
                <div className="lg:col-span-3 rounded-xl overflow-hidden border border-border relative bg-muted/20 min-h-[500px]">
                    {typeof window !== 'undefined' ? (
                        <MapContainer
                            center={[41.0082, 28.9784]}
                            zoom={10}
                            style={{ height: '100%', width: '100%' }}
                            className="z-10"
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            {fromCenter && (
                                <Marker position={[41.0082, 28.9784]}>
                                    <Popup>Merkez / Depo</Popup>
                                </Marker>
                            )}

                            {teamRoutes.map((route, rIdx) => {
                                const color = TEAM_COLORS[rIdx % TEAM_COLORS.length];
                                const coords: [number, number][] = [];

                                if (fromCenter) coords.push([41.0082, 28.9784]);

                                return (
                                    <React.Fragment key={route.teamId}>
                                        {route.jobs.map((job, idx) => {
                                            if (job.latitude && job.longitude) {
                                                coords.push([job.latitude, job.longitude]);
                                                return (
                                                    <Marker key={job.id} position={[job.latitude, job.longitude]}>
                                                        <Popup>
                                                            <div className="p-1">
                                                                <p className="font-bold text-xs">{idx + 1}. {job.title}</p>
                                                                <p className="text-[10px] text-muted-foreground">{route.teamName}</p>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            }
                                            return null;
                                        })}
                                        {coords.length > 1 && (
                                            <Polyline
                                                positions={coords}
                                                color={color}
                                                weight={4}
                                                opacity={0.6}
                                                dashArray="10, 10"
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </MapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground italic">Harita yükleniyor...</div>
                    )}
                </div>

                {/* Legend & List Section */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" /> Ekip Rotaları
                    </h4>
                    {teamRoutes.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic p-4 text-center border border-dashed rounded-lg">
                            Henüz rota hesaplanmadı.
                        </div>
                    ) : (
                        teamRoutes.map((route, rIdx) => (
                            <div key={route.teamId} className="space-y-2">
                                <div className="flex flex-col gap-1 border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full shadow-sm"
                                            style={{ backgroundColor: TEAM_COLORS[rIdx % TEAM_COLORS.length] }}
                                        />
                                        <span className="text-sm font-bold text-slate-800">{route.teamName}</span>
                                        <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 ml-auto">{route.jobs.length} İş</span>
                                    </div>

                                    {route.metrics && (
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pl-5">
                                            <span className="flex items-center gap-1">
                                                <RouteIcon className="w-3 h-3" />
                                                Toplam: <strong className="text-slate-700">{route.metrics.totalDistanceKm} km</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 pl-4">
                                    {route.jobs.map((job, idx) => (
                                        <div key={job.id} className="relative flex items-start gap-2 py-1.5 group">
                                            <div className="absolute -left-[5px] top-3 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors z-10" />
                                            {idx !== route.jobs.length - 1 && (
                                                <div className="absolute left-[ -2px ] top-4 bottom-[-16px] w-[2px] bg-slate-200 z-0" style={{ left: '-2.5px' }} />
                                            )}

                                            <span className="text-[10px] font-bold text-slate-400 shrink-0 mt-0.5 w-4">{idx + 1}.</span>
                                            <div className="flex flex-col min-w-0 bg-white border shadow-sm rounded-md px-2 py-1.5 flex-1 hover:border-primary/40 transition-colors cursor-default">
                                                <span className="text-xs font-semibold text-slate-700 truncate">{job.title}</span>
                                                <span className="text-[10px] text-slate-500 truncate">{job.customer.company}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    )
}
