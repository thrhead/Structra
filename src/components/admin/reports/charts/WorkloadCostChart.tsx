"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WorkloadCostChartProps {
    data: any;
    title?: string;
}

export default function WorkloadCostChart({ data, title = "İş Yoğunluğu ve Maliyetler" }: WorkloadCostChartProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const chartData = data?.costs?.map((c: any) => ({
        date: c.date,
        maliyet: c.Maliyet || c.amount || 0,
        // Calculate workload derived from 'Kâr' or actual trend instead of mock if available
        // Or default strictly to available stats.
        isYogunlugu: c.Gelir !== undefined ? (c.Gelir / (c.Maliyet || 1)) * 10 : (c.amount ? (c.amount / 1000) : 0),
        kâr: c.Kâr || 0,
        gelir: c.Gelir || 0
    })) || [];

    return (
        <Card className="col-span-1 shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Günlük maliyet ve yaklaşık iş yoğunluğu endeksi</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    if (!value) return '';
                                    const date = new Date(value);
                                    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
                                }}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₺${value}`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                formatter={(value: any, name: string) => {
                                    if (name === "maliyet") return [formatCurrency(Number(value) || 0), "Maliyet"];
                                    return [Number(value).toFixed(0), "İş Yoğunluğu"];
                                }}
                                labelFormatter={(label) => `Tarih: ${new Date(label).toLocaleDateString('tr-TR')}`}
                            />
                            <Legend />
                            <Bar 
                                yAxisId="left"
                                dataKey="maliyet" 
                                name="maliyet"
                                fill="#8b5cf6" 
                                radius={[4, 4, 0, 0]} 
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="isYogunlugu" 
                                name="isYogunlugu"
                                stroke="#10b981" 
                                strokeWidth={3} 
                                dot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
