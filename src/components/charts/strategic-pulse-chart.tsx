'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

interface StrategicPulseChartProps {
  data: any[]
}

export function StrategicPulseChart({ data }: StrategicPulseChartProps) {
  if (!data || data.length === 0) return null

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            hide
          />
          <YAxis 
            yAxisId="right"
            hide
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '11px',
              fontFamily: 'monospace'
            }}
            itemStyle={{ fontWeight: 'black', textTransform: 'uppercase' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="intensity"
            stroke="#0d9488"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIntensity)"
            name="İŞ YOĞUNLUĞU"
            animationDuration={1500}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="cost"
            stroke="#ea580c"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorCost)"
            name="HARCAMA (TL)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
