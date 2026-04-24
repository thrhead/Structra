"use client";

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CheckCircle2, Clock } from "lucide-react";

interface CompletionChartProps {
    data: {
        total: number;
        completed: number;
        percentage: number;
    };
    title?: string;
}

export default function CompletionChart({ data, title = "Toplam İş ve Tamamlanan" }: CompletionChartProps) {
    const remaining = data.total - data.completed;
    
    const chartData = [
        {
            name: "Bekleyen/Süren",
            value: remaining > 0 ? remaining : 0,
            fill: "#f59e0b", // Amber
        },
        {
            name: "Tamamlanan",
            value: data.completed,
            fill: "#10b981", // Emerald
        }
    ];

    return (
        <Card className="col-span-1 shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Planlanan tüm işlerin tamamlanma oranı</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex h-[300px] flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="60%" 
                                outerRadius="100%" 
                                barSize={20} 
                                data={chartData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                                <Tooltip 
                                    formatter={(value) => [value, "İş"]} 
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 px-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Toplam İş</p>
                                <p className="text-2xl font-bold">{data.total}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tamamlanan</p>
                                <p className="text-2xl font-bold">{data.completed}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bekleyen / Süren</p>
                                <p className="text-2xl font-bold">{remaining}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
