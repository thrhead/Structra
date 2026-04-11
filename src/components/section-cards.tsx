import { IconTrendingUp, IconBriefcase, IconCalendar, IconCheck } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  stats?: {
    totalCustomers: number
    activeTeams: number
    pendingJobs: number
    completedJobs: number
    growthRate: string
    completionRate: string
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  // Safe defaults to prevent build/runtime crashes
  const safeStats = stats || {
    totalCustomers: 0,
    activeTeams: 0,
    pendingJobs: 0,
    completedJobs: 0,
    growthRate: '0%',
    completionRate: '0%'
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 xl:grid-cols-3 2xl:grid-cols-5 dark:*:data-[slot=card]:bg-card items-stretch">
      <Card className="@container/card rounded-3xl border-none shadow-sm flex flex-col">
        <CardHeader>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Toplam Müşteri</CardDescription>
          <CardTitle className="text-2xl font-black italic tabular-nums @[250px]/card:text-3xl">
            {safeStats.totalCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 bg-indigo-50/50 rounded-lg">
              <IconTrendingUp size={14} className="mr-1" />
              {safeStats.growthRate}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-bold tracking-tight text-slate-400 mt-auto">
          <div className="line-clamp-1 flex gap-2 font-black text-indigo-500 italic">
            Trending up this month <IconTrendingUp className="size-3" />
          </div>
          <div className="text-muted-foreground/60 tracking-widest">
            Son 6 aylık büyüme oranı
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card rounded-3xl border-none shadow-sm flex flex-col">
        <CardHeader>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aktif Ekipler</CardDescription>
          <CardTitle className="text-2xl font-black italic tabular-nums @[250px]/card:text-3xl">
            {safeStats.activeTeams}
          </CardTitle>
          <CardAction>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
              <IconBriefcase size={14} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-bold tracking-tight text-slate-400 mt-auto">
          <div className="line-clamp-1 flex gap-2 font-black text-orange-500 italic">
            Currently on the field <IconBriefcase className="size-3" />
          </div>
          <div className="text-muted-foreground/60 tracking-widest">
            Saha operasyonu aktifliği
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card rounded-3xl border-none shadow-sm flex flex-col">
        <CardHeader>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bekleyen İşler</CardDescription>
          <CardTitle className="text-2xl font-black italic tabular-nums @[250px]/card:text-3xl">
            {safeStats.pendingJobs}
          </CardTitle>
          <CardAction>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <IconCalendar size={14} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-bold tracking-tight text-slate-400 mt-auto">
          <div className="line-clamp-1 flex gap-2 font-black text-blue-500 italic">
            Jobs awaiting schedule <IconCalendar className="size-3" />
          </div>
          <div className="text-muted-foreground/60 tracking-widest">
            Planlama bekleyen görevler
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card rounded-3xl border-none shadow-sm flex flex-col">
        <CardHeader>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tamamlanan</CardDescription>
          <CardTitle className="text-2xl font-black italic tabular-nums @[250px]/card:text-3xl">
            {safeStats.completedJobs}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50/50 rounded-lg">
              <IconCheck size={14} className="mr-1" />
              {safeStats.completionRate}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-bold tracking-tight text-slate-400 mt-auto">
          <div className="line-clamp-1 flex gap-2 font-black text-emerald-500 italic">
            Excellent success rate <IconCheck className="size-3" />
          </div>
          <div className="text-muted-foreground/60 tracking-widest">
            Step-based completion ratio
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card rounded-3xl border-none shadow-sm flex flex-col items-center justify-center relative p-6 aspect-square max-h-[220px]">
        <CardHeader className="absolute top-4 left-6 p-0 w-full">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bitirme Oranı</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-0 flex-1 w-full relative mt-4">
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-28 h-28">
                    <circle cx="50%" cy="50%" r="36%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                        cx="50%" 
                        cy="50%" 
                        r="36%" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="226" 
                        strokeDashoffset={226 - (parseFloat(safeStats.completionRate) / 100 || 0) * 226} 
                        strokeLinecap="round" 
                        className="text-emerald-500 dark:text-emerald-400 drop-shadow-md" 
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black italic tabular-nums text-slate-800 dark:text-slate-100">
                        {safeStats.completionRate.includes('%') ? safeStats.completionRate : `${safeStats.completionRate}%`}
                    </span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
