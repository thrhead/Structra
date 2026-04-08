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
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="count"
          fill="#00F5FF" // Cyber Teal
          radius={[2, 2, 0, 0]}
          className="drop-shadow-[0_0_8px_rgba(0,245,255,0.4)]"
        />

      </BarChart>
    </ResponsiveContainer>
  )
}
