'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from 'recharts';

interface ProjectStatusChartProps {
    data: { status: string; count: number }[];
}

const COLORS: Record<string, string> = {
    'COMPLETED': '#10b981', // Emerald
    'IN_PROGRESS': '#3b82f6', // Blue
    'PENDING': '#f59e0b', // Amber
    'CANCELLED': '#ef4444', // Red
    'BLOCKED': '#8b5cf6', // Purple
};

const STATUS_LABELS: Record<string, string> = {
    'COMPLETED': 'Tamamlandı',
    'IN_PROGRESS': 'Devam Ediyor',
    'PENDING': 'Beklemede',
    'CANCELLED': 'İptal',
    'BLOCKED': 'Engellendi',
};

export default function ProjectStatusChart({ data }: ProjectStatusChartProps) {
    const chartData = data.map(item => ({
        name: STATUS_LABELS[item.status] || item.status,
        count: item.count,
        status: item.status
    })).sort((a, b) => b.count - a.count);

    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Veri bulunamadı</div>;
    }

    return (
        <div className="h-full w-full px-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#cbd5e1'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
