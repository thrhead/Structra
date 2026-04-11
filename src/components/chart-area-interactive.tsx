"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

interface ChartAreaInteractiveProps {
  data: any[]
}

const chartConfig = {
  intensity: {
    label: "İş Yoğunluğu",
    color: "var(--indigo-500)",
  },
  cost: {
    label: "Maliyet (k TL)",
    color: "var(--rose-500)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data = [] }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  // Map the raw data to the format expected by the chart
  const formattedData = React.useMemo(() => {
    // Fallback mock data if the incoming data is empty
    const sourceData = data && data.length > 0 ? data : [
      { date: "2024-01-01", intensity: 120, cost: 45000 },
      { date: "2024-01-15", intensity: 135, cost: 48000 },
      { date: "2024-02-01", intensity: 110, cost: 42000 },
      { date: "2024-02-15", intensity: 150, cost: 52000 },
      { date: "2024-03-01", intensity: 165, cost: 58000 },
      { date: "2024-03-15", intensity: 180, cost: 63000 },
      { date: "2024-04-01", intensity: 155, cost: 56000 },
      { date: "2024-04-15", intensity: 190, cost: 68000 },
      { date: "2024-05-01", intensity: 210, cost: 75000 },
      { date: "2024-05-15", intensity: 230, cost: 82000 },
      { date: "2024-06-01", intensity: 215, cost: 79000 },
      { date: "2024-06-15", intensity: 250, cost: 89000 }
    ];

    return sourceData.map(item => ({
      date: item.date,
      intensity: item.intensity,
      cost: item.cost / 1000 // Show in thousands for better scale
    }))
  }, [data])

  const filteredData = React.useMemo(() => {
    return formattedData.filter((item) => {
      const date = new Date(item.date)
      // Since our mock data might not be current, we'll take the last item's date as reference
      const lastDate = formattedData.length > 0 ? new Date(formattedData[formattedData.length - 1].date) : new Date()
      
      let daysToSubtract = 90
      if (timeRange === "30d") daysToSubtract = 30
      if (timeRange === "7d") daysToSubtract = 7
      
      const startDate = new Date(lastDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
  }, [formattedData, timeRange])

  return (
    <Card className="@container/card rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col group overflow-hidden relative">
      <div className="absolute -inset-10 opacity-30 dark:opacity-10 pointer-events-none transition-transform duration-1000 ease-in-out group-hover:scale-105" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.15), transparent 70%)' }}></div>
      <CardHeader className="flex flex-col gap-4 space-y-0 p-6 md:flex-row md:items-center relative z-10 border-b border-slate-100/50 dark:border-slate-800/50">
        <div className="flex flex-1 flex-col gap-1.5">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Stratejik Analiz</CardTitle>
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            İş Yoğunluğu & Operasyonel Maliyetler
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3 *:data-[slot=toggle-group-item]:text-[10px] *:data-[slot=toggle-group-item]:font-black *:data-[slot=toggle-group-item]:uppercase @[767px]/card:flex rounded-xl"
          >
            <ToggleGroupItem value="90d" className="rounded-lg">90 Gün</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="rounded-lg">30 Gün</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="rounded-lg">7 Gün</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-32 rounded-xl text-xs font-semibold @[767px]/card:hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
              size="sm"
            >
              <SelectValue placeholder="Süre Seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl">
              <SelectItem value="90d" className="text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">90 Gün</SelectItem>
              <SelectItem value="30d" className="text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">30 Gün</SelectItem>
              <SelectItem value="7d" className="text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">7 Gün</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="p-6 relative z-10 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("tr-TR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
              content={
                <ChartTooltipContent
                  className="rounded-2xl border-none shadow-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-3"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="intensity"
              type="monotone"
              fill="url(#fillIntensity)"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
            />
            <Area
              dataKey="cost"
              type="monotone"
              fill="url(#fillCost)"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
