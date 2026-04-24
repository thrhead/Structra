'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface PerformanceChartProps {
  data: {
    name: string
    count: number
  }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity={1} />
            <stop offset="100%" stopColor="#0d9488" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
          tick={{ fontWeight: 'bold' }}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          tick={{ fontWeight: 'bold' }}
        />
        <Tooltip 
            contentStyle={{ 
              borderRadius: '0px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}
            cursor={{ fill: '#f8fafc' }}
        />
        <Bar
          dataKey="count"
          fill="url(#barGradient)"
          radius={[4, 4, 4, 4]}
          barSize={24}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>

  )
}
