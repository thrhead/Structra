'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart,
    Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';

interface WeeklyStepsChartProps {
    data?: {
        currentWeek: any[];
        previousWeek: any[];
    };
    categories?: string[];
}

const COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#0ea5e9', // Sky
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl min-w-[160px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.payload.fill }} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const WeeklyStepsChart = memo(({ data, categories = [] }: WeeklyStepsChartProps) => {
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const currentWeek = data?.currentWeek || [];
    const previousWeek = data?.previousWeek || [];

    const chartData = useMemo(() => {
        if (!isMounted) return [];
        return currentWeek.map((day: any, index: number) => ({
            ...day,
            prevTotal: previousWeek[index]?.total || 0,
            displayDate: new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase()
        }));
    }, [currentWeek, previousWeek, isMounted]);

    const handleBarClick = (payload: any) => {
        if (payload) {
            setSelectedDay(payload);
        }
    };

    if (!isMounted) {
        return <div className="h-[350px] w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 animate-pulse rounded-3xl">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                        onClick={(e: any) => {
                            if (e && e.activePayload && e.activePayload.length > 0) {
                                handleBarClick(e.activePayload[0].payload);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="displayDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: '0.05em' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                        />

                        {categories.map((cat, index) => (
                            <Bar
                                key={cat}
                                dataKey={cat}
                                stackId="a"
                                fill={COLORS[index % COLORS.length]}
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                        ))}

                        <Line
                            type="monotone"
                            dataKey="prevTotal"
                            name="GEÇEN HAFTA"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            dot={{ r: 4, fill: '#fff', stroke: '#94a3b8', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#64748b' }}
                            animationDuration={1500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <AnimatePresence mode="wait">
                {selectedDay ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        key={selectedDay.date}
                        className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                        {new Date(selectedDay.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">GÜNLÜK DETAY ANALİZİ</p>
                                </div>
                            </div>
                            <Badge className="bg-indigo-600 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-wider">
                                {selectedDay.total} ADIM TAMAMLANDI
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedDay.jobs && selectedDay.jobs.length > 0 ? (
                                selectedDay.jobs.map((job: any) => (
                                    <div key={job.id} className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{job.title}</span>
                                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">GÖREV DETAYI</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center bg-white/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Bu güne ait detaylı iş kaydı bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4"
                    >
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Grafikteki sütunlara tıklayarak günlük detayları inceleyebilirsiniz</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

WeeklyStepsChart.displayName = 'WeeklyStepsChart';
export default WeeklyStepsChart;
