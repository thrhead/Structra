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
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#64748b" // slate-500
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#64748b" // slate-500
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
            contentStyle={{ 
              borderRadius: '2px', 
              border: '1px solid #e2e8f0', // slate-200 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}
            cursor={{ fill: '#f1f5f9' }} // slate-100
        />
        <Bar
          dataKey="count"
          fill="#0d9488" // Cyber Teal Light (Teal 600)
          radius={[0, 0, 0, 0]} // Sharp
          barSize={30}
        />

      </BarChart>
    </ResponsiveContainer>
  )
}
