'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface JobStatusChartProps {
  data: {
    status: string
    count: number
  }[]
}

const COLORS: Record<string, string> = {
  PENDING: '#f59e0b', // Amber
  IN_PROGRESS: '#3b82f6', // Blue
  COMPLETED: '#10b981', // Emerald
  ACCEPTED: '#059669', // Emerald-600
  CANCELLED: '#94a3b8', // Slate-400
  ON_HOLD: '#fb923c', // Orange-400
  PENDING_APPROVAL: '#6366f1', // Indigo-500
  WAITING_FOR_CUSTOMER: '#34d399', // Emerald-400
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Bekliyor',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Müşteri Onayı Bekliyor',
  ACCEPTED: 'Kabul Edildi',
  CANCELLED: 'İptal',
  ON_HOLD: 'Beklemede',
  PENDING_APPROVAL: 'Yönetici Onayı Bekliyor',
  WAITING_FOR_CUSTOMER: 'Müşteri Onayı Bekliyor'
}

export function JobStatusChart({ data }: JobStatusChartProps) {
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
