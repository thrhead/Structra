'use client'

import React from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

export default function StrategicPulseChart({ data }: { data: any }) {
    if (!data) return null;

    const { revenue = [], costs = [] } = data;

    // Merge revenue and costs data by month
    const combinedData = revenue.map((rev: any, idx: number) => ({
        name: rev.month,
        revenue: rev.amount,
        cost: costs[idx]?.amount || 0,
        profit: rev.amount - (costs[idx]?.amount || 0)
    }));

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8' }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontSize: '12px'
                        }}
                        formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, '']}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} />
                    <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Ciro" 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                    />
                    <Bar 
                        dataKey="cost" 
                        name="Maliyet" 
                        fill="#94a3b8" 
                        radius={[4, 4, 0, 0]} 
                        barSize={20} 
                        opacity={0.3}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
