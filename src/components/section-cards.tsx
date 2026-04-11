import { IconTrendingUp, IconBriefcase, IconCalendar, IconCheck } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
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

  // Common premium card class with glassmorphism and micro-interactions
  const premiumCardClass = "@container/card rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col overflow-hidden relative group"
  
  // Subtle glowing blobs inside the card
  const GlowBlob = ({ color }: { color: string }) => (
    <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 dark:opacity-10 blur-3xl rounded-full transition-transform duration-700 ease-out group-hover:scale-150 ${color}`} />
  )

  return (
    <div className="grid grid-cols-1 gap-5 px-4 lg:px-6 xl:grid-cols-3 2xl:grid-cols-5 items-stretch relative z-10">
      
      <Card className={`${premiumCardClass} hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5`}>
        <GlowBlob color="bg-indigo-500" />
        <CardHeader className="relative z-10">
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Toplam Müşteri</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {safeStats.totalCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-indigo-200/50 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl px-2.5 shadow-sm backdrop-blur-md">
              <IconTrendingUp size={14} className="mr-1.5" />
              {safeStats.growthRate}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <IconTrendingUp size={14} stroke={2.5} /> Pozitif büyüme ivmesi
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
            Son 6 aylık değişim
          </div>
        </CardFooter>
      </Card>

      <Card className={`${premiumCardClass} hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5`}>
        <GlowBlob color="bg-orange-500" />
        <CardHeader className="relative z-10">
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Aktif Ekipler</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
            {safeStats.activeTeams}
          </CardTitle>
          <CardAction>
            <div className="p-2 border border-orange-100 dark:border-orange-900/30 bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-md rounded-xl text-orange-600 dark:text-orange-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <IconBriefcase size={16} stroke={2.5} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-500">
             <IconBriefcase size={14} stroke={2.5} /> Sahada şu an aktif
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
            Operasyon durumu
          </div>
        </CardFooter>
      </Card>

      <Card className={`${premiumCardClass} hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5`}>
        <GlowBlob color="bg-blue-500" />
        <CardHeader className="relative z-10">
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Bekleyen İşler</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {safeStats.pendingJobs}
          </CardTitle>
          <CardAction>
            <div className="p-2 border border-blue-100 dark:border-blue-900/30 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-md rounded-xl text-blue-600 dark:text-blue-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <IconCalendar size={16} stroke={2.5} />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-500">
            <IconCalendar size={14} stroke={2.5} /> Ekip ataması bekleniyor
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
            Planlama yoğunluğu
          </div>
        </CardFooter>
      </Card>

      <Card className={`${premiumCardClass} hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5`}>
        <GlowBlob color="bg-emerald-500" />
        <CardHeader className="relative z-10">
          <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tamamlanan</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {safeStats.completedJobs}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-200/50 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl px-2.5 shadow-sm backdrop-blur-md">
              <IconCheck size={14} className="mr-1.5" stroke={2.5} />
              {safeStats.completionRate}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-500">
            <IconCheck size={14} stroke={2.5} /> Mükemmel başarı oranı
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
            Bitirilen operasyon
          </div>
        </CardFooter>
      </Card>

      <Card className={`${premiumCardClass} items-center justify-center p-6 aspect-square max-h-[220px] hover:shadow-teal-500/10`}>
        <GlowBlob color="bg-teal-500" />
        <CardHeader className="absolute top-5 left-5 p-0 w-full z-10">
            <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Bitirme Oranı</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-0 flex-1 w-full relative mt-6 z-10">
            <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                {/* SVG Progress Circle */}
                <svg className="transform -rotate-90 w-28 h-28 drop-shadow-sm">
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                        cx="50%" 
                        cy="50%" 
                        r="40%" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (parseFloat(safeStats.completionRate) / 100 || 0) * 251.2} 
                        strokeLinecap="round" 
                        className="text-emerald-500 dark:text-emerald-400" 
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center mb-0.5">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100">
                        {safeStats.completionRate.includes('%') ? safeStats.completionRate : `${safeStats.completionRate}%`}
                    </span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
