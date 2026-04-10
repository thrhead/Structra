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
    return data.map(item => ({
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
    <Card className="@container/card rounded-3xl border-none shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-1">
          <CardTitle className="text-lg font-black uppercase italic tracking-tight">Stratejik Analiz</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
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
              className="flex w-32 rounded-xl text-[10px] font-black uppercase @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Süre Seçin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="text-[10px] font-black uppercase">90 Gün</SelectItem>
              <SelectItem value="30d" className="text-[10px] font-black uppercase">30 Gün</SelectItem>
              <SelectItem value="7d" className="text-[10px] font-black uppercase">7 Gün</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-slate-50/30 dark:bg-slate-900/10">
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
