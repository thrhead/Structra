'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface PerformanceChartProps {
  data: {
    name: string
    count: number
  }[]
  vibrant?: boolean
}

export function PerformanceChart({ data, vibrant = false }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
            cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="count"
          fill={vibrant ? "url(#barGradient)" : "#4F46E5"}
          radius={vibrant ? [8, 8, 2, 2] : [4, 4, 0, 0]}
          barSize={vibrant ? 32 : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
