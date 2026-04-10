'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'

interface StrategicPulseChartProps {
  data: any[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 italic">
                {item.name.includes('HARCAMA') 
                  ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(item.value)
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function StrategicPulseChart({ data }: StrategicPulseChartProps) {
  if (!data || data.length === 0) return null

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }}
            dy={10}
            hide={false}
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
            content={<CustomTooltip />}
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="intensity"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorIntensity)"
            name="İŞ YOĞUNLUĞU"
            animationDuration={1500}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="cost"
            stroke="#fb923c"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorCost)"
            name="HARCAMA (TL)"
            animationDuration={2000}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#fb923c' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
