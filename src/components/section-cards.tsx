import { IconTrendingUp, IconBriefcase, IconCalendar, IconCheck, IconInfoCircle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SectionCardsProps {
  stats?: {
    totalCustomers: number
    activeTeams: number
    pendingJobs: number
    unassignedJobs?: number
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
    unassignedJobs: 0,
    completedJobs: 0,
    growthRate: '0%',
    completionRate: '0%'
  }

  // Common premium card class with glassmorphism and micro-interactions
  const premiumCardClass = "@container/card rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col overflow-hidden relative group"
  
  const { locale } = useParams()
  const basePrefix = `/${locale}`

  const getProgressColor = (rateStr: string) => {
    const rate = parseFloat(rateStr) || 0
    if (rate <= 33) return { text: 'text-rose-600 dark:text-rose-400', stroke: 'text-rose-500 dark:text-rose-400', glow: 'bg-rose-500', bg: 'bg-rose-50/50 dark:bg-rose-900/20', border: 'border-rose-200/50 dark:border-rose-900/50' }
    if (rate <= 66) return { text: 'text-amber-600 dark:text-amber-400', stroke: 'text-amber-500 dark:text-amber-400', glow: 'bg-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-900/20', border: 'border-amber-200/50 dark:border-amber-900/50' }
    return { text: 'text-emerald-600 dark:text-emerald-400', stroke: 'text-emerald-500 dark:text-emerald-400', glow: 'bg-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-900/20', border: 'border-emerald-200/50 dark:border-emerald-900/50' }
  }

  const pColor = getProgressColor(safeStats.completionRate)

  // Subtle glowing blobs inside the card
  const GlowBlob = ({ color }: { color: string }) => (
    <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-20 dark:opacity-10 blur-3xl rounded-full transition-transform duration-700 ease-out group-hover:scale-150 ${color}`} />
  )

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch relative z-10">
        
        <Link href={`${basePrefix}/admin/customers`} className="block">
          <Card className={`${premiumCardClass} hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 h-full`}>
            <GlowBlob color="bg-indigo-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Toplam Müşteri
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle size={12} className="text-slate-400 hover:text-indigo-500 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs leading-relaxed">
                      Sistemdeki toplam aktif müşteri sayısıdır. Büyüme ivmesi, son 6 aylık periyottaki müşteri artış oranını baz alır. (Eğer 6 ay önce müşteri yoksa, matematiksel hata vermemesi için %100 büyüme kabul edilir).
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {safeStats.totalCustomers}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className={`border-indigo-200/50 dark:border-indigo-900/50 ${parseFloat(safeStats.growthRate) < 0 ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/20' : parseFloat(safeStats.growthRate) > 0 ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20'} rounded-xl px-2.5 shadow-sm backdrop-blur-md`}>
                  <IconTrendingUp size={14} className={`mr-1.5 ${parseFloat(safeStats.growthRate) < 0 ? 'rotate-180' : ''}`} />
                  {safeStats.growthRate}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${parseFloat(safeStats.growthRate) < 0 ? 'text-rose-600 dark:text-rose-400' : parseFloat(safeStats.growthRate) > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                <IconTrendingUp size={14} stroke={2.5} className={parseFloat(safeStats.growthRate) < 0 ? 'rotate-180' : ''} /> {parseFloat(safeStats.growthRate) >= 20 ? 'Hızlı büyüme ivmesi' : parseFloat(safeStats.growthRate) > 0 ? 'Pozitif büyüme ivmesi' : parseFloat(safeStats.growthRate) <= -20 ? 'Kritik düşüş uyarısı' : parseFloat(safeStats.growthRate) < 0 ? 'Negatif büyüme ivmesi' : 'Sabit büyüme ivmesi'}
              </div>
              <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
                Son 6 aylık değişim
              </div>
            </CardFooter>
          </Card>
        </Link>

        <Link href={`${basePrefix}/admin/teams`} className="block">
          <Card className={`${premiumCardClass} hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 h-full`}>
            <GlowBlob color="bg-orange-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Aktif Ekipler
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle size={12} className="text-slate-400 hover:text-orange-500 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs leading-relaxed">
                      Sahada operasyona hazır olan ekiplerin sayısıdır. Kapasite yoğunluğu, bekleyen iş sayısının aktif ekip sayısına bölünmesiyle dinamik olarak hesaplanır.
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
              </div>
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
                 <IconBriefcase size={14} stroke={2.5} /> {safeStats.activeTeams === 0 ? 'Sahada aktif ekip bulunmuyor' : safeStats.pendingJobs > safeStats.activeTeams * 5 ? `Kapasite aşımı: Ekip başına ${(safeStats.pendingJobs / safeStats.activeTeams).toFixed(1)} iş` : safeStats.pendingJobs > 0 ? `Optimum kapasite: Ekip başına ${(safeStats.pendingJobs / safeStats.activeTeams).toFixed(1)} iş` : `${safeStats.activeTeams} ekip operasyona hazır`}
              </div>
              <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
                Kapasite ve yoğunluk
              </div>
            </CardFooter>
          </Card>
        </Link>

        <Link href={`${basePrefix}/admin/jobs?status=PENDING`} className="block">
          <Card className={`${premiumCardClass} hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 h-full`}>
            <GlowBlob color="bg-blue-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Bekleyen İşler
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle size={12} className="text-slate-400 hover:text-blue-500 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs leading-relaxed">
                      Henüz bir ekibe atanmamış veya başlamamış işlerin toplamıdır. Atama bekleyen "X iş ekip bekliyor" uyarısı ile operasyon yoğunluğu takip edilir.
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
              </div>
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
                <IconCalendar size={14} stroke={2.5} /> {(safeStats.unassignedJobs ?? 0) > 0 ? `${safeStats.unassignedJobs} iş ekip bekliyor` : 'Tümü atandı'}
              </div>
              <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
                Planlama yoğunluğu
              </div>
            </CardFooter>
          </Card>
        </Link>

        <Link href={`${basePrefix}/admin/jobs?status=COMPLETED`} className="block">
          <Card className={`${premiumCardClass} hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 h-full`}>
            <GlowBlob color="bg-emerald-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Tamamlanan
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle size={12} className="text-slate-400 hover:text-emerald-500 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs leading-relaxed">
                      Tamamlandı statüsündeki iş sayısıdır. Başarı analizi (örn: İstikrarlı ilerleme), tamamlanan işlerin sistemdeki toplam işlere oranıyla hesaplanır.
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
              </div>
              <CardTitle className={`text-3xl font-bold tabular-nums tracking-tight transition-colors duration-300 ${pColor.text}`}>
                {safeStats.completedJobs}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className={`${pColor.border} ${pColor.text} ${pColor.bg} rounded-xl px-2.5 shadow-sm backdrop-blur-md`}>
                  <IconCheck size={14} className="mr-1.5" stroke={2.5} />
                  {safeStats.completionRate}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-2 mt-auto relative z-10 pb-6">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${pColor.text}`}>
                <IconCheck size={14} stroke={2.5} /> {parseFloat(safeStats.completionRate) >= 90 ? 'Mükemmel operasyon başarısı' : parseFloat(safeStats.completionRate) >= 70 ? 'İstikrarlı ilerleme' : parseFloat(safeStats.completionRate) >= 40 ? 'Gelişim potansiyeli yüksek' : parseFloat(safeStats.completionRate) > 0 ? 'Operasyonel iyileştirme gerekli' : 'Henüz tamamlanan iş yok'}
              </div>
              <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 dark:text-slate-500">
                Performans analizi
              </div>
            </CardFooter>
          </Card>
        </Link>

        <Link href={`${basePrefix}/admin/reports`} className="block">
          <Card className={`${premiumCardClass} items-center justify-center p-6 aspect-square max-h-[220px] hover:shadow-teal-500/10`}>
            <GlowBlob color={pColor.glow} />
            <CardHeader className="absolute top-5 left-5 p-0 w-full z-10">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Bitirme Oranı
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconInfoCircle size={12} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs leading-relaxed">
                      Sistemde açılan tüm işlerin yüzde kaçının başarıyla tamamlandığını temsil eder.
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
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
                            className={pColor.stroke} 
                            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center mb-0.5">
                        <span className={`text-2xl font-bold tabular-nums tracking-tight ${pColor.text}`}>
                            {safeStats.completionRate.includes('%') ? safeStats.completionRate : `${safeStats.completionRate}%`}
                        </span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </TooltipProvider>
  )
}
