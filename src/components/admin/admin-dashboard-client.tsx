'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3Icon, 
  TrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ActivityIcon,
  GlobeIcon,
  CheckCircle2Icon
} from 'lucide-react'
import { PerformanceChart } from "@/components/charts/performance-chart"
import { StrategicPulseChart } from "@/components/charts/strategic-pulse-chart"
import { Link } from "@/lib/navigation"

interface AdminDashboardClientProps {
  data: any
}

export default function AdminDashboardClient({ data }: AdminDashboardClientProps) {
  if (!data) return null

  const {
    activeJobs = 0,
    totalJobs = 0,
    completedJobsToday = 0,
    totalWorkers = 0,
    activeTeams = 0,
    pendingApprovalsCount = 0,
    totalCostToday = 0,
    latestLogs = [],
    strategic = {},
    tactical = {},
    operational = {},
    strategicTrend = [],
    weeklyStats = []
  } = data

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900 rounded-3xl overflow-hidden min-h-[calc(100vh-120px)] border border-slate-200/50">
      
      {/* CONTENT */}
      <motion.div 
        className="p-4 lg:p-12 space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO SECTION - expanded */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden group flex items-center min-h-[320px]"
          >
            <div className="relative z-10 w-full md:w-3/5">
              <span className="inline-block px-4 py-1.5 bg-blue-400/20 text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 backdrop-blur-md">SİSTEM DURUMU: AKTİF</span>
              <h2 className="text-white text-5xl font-black tracking-tight mb-4">Günaydın, Hoş Geldiniz!</h2>
              <p className="text-blue-100/90 text-xl mb-10 font-medium leading-relaxed max-w-xl">
                Operasyon merkezi şu an stabil çalışıyor. Bugün sonuçlandırılması beklenen <span className="text-white font-bold underline decoration-blue-400 underline-offset-4">{pendingApprovalsCount}</span> yeni onay talebi merkeze ulaştı.
              </p>
              <Link href="/admin/reports">
                <button className="bg-white text-blue-700 px-10 py-4 rounded-2xl text-base font-black shadow-xl hover:bg-blue-50 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-2 group">
                  Performans Raporlarını İncele
                  <TrendingUpIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* BIG STAT CIRCLE */}
            <div className="relative z-10 hidden lg:flex flex-1 items-center justify-end pr-10">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-white/10" cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="16" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 628 }}
                    animate={{ strokeDashoffset: 628 - (628 * 0.75) }}
                    className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray="628" strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">75%</span>
                  <span className="text-xs text-blue-100 font-bold uppercase tracking-[0.2em] mt-1">HEDEF</span>
                </div>
              </div>
            </div>

            {/* BG DECOR */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
          </motion.div>

          {/* KPI CARD - expanded */}
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-1 bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all cursor-pointer"
            onClick={() => window.location.href = '/admin/reports'}
          >
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">GÜNLÜK HEDEF</span>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ActivityIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-7xl font-black tracking-tighter text-slate-900 leading-none group-hover:text-blue-600 transition-colors">%{((completedJobsToday / Math.max(totalJobs, 1)) * 100).toFixed(0)}</h3>
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUpIcon className="w-5 h-5" />
                  <span className="text-sm font-black">Başarı Oranı</span>
                </div>
              </div>
            </div>
            
            <div className="pt-10 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <div className="flex gap-2 h-12 items-end">
                  {[4, 6, 9, 12, 7, 10, 5].map((v, i) => (
                    <div key={i} className={`w-3 rounded-full transition-all duration-500 ${i === 3 ? 'bg-blue-600 h-12' : 'bg-slate-100 group-hover:bg-blue-100 h-' + v * 4}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AKTİVİTE</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* KPI GRID - 4 Cols clickable */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard label="Aktif Görev" value={activeJobs} trend="+12.4%" icon={BriefcaseIcon} color="blue" href="/admin/jobs" />
          <StatCard label="Toplam Bütçe" value={`₺${(totalCostToday).toLocaleString('tr-TR')}`} trend="+8.2%" icon={DollarSignIcon} color="emerald" pill="GÜNLÜK" href="/admin/costs" />
          <StatCard label="Saha Personeli" value={totalWorkers} sub={`${activeTeams} Aktif Takım`} icon={UsersIcon} color="indigo" pill="TAKIM" href="/admin/users" />
          <StatCard label="Onay Bekleyen" value={pendingApprovalsCount} trend="KRİTİK" icon={CheckCircle2Icon} color="rose" isAlert={pendingApprovalsCount > 0} href="/admin/approvals" />
        </section>

        {/* CHARTS SECTION - expanded */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LARGE CHART */}
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100"
          >
            <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-4">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Stratejik Analiz</h3>
                <h2 className="text-3xl font-black tracking-tighter text-slate-950 uppercase">SİSTEM NABZI</h2>
              </div>
              <div className="bg-slate-50 px-6 py-4 rounded-[1.25rem] border border-slate-100 flex items-center gap-4">
                 <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                 <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Canlı Akış Aktif</span>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <StrategicPulseChart data={strategicTrend} />
            </div>
          </motion.div>

          {/* SIDE ACTIVITY / LOGS clickable */}
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black tracking-[0.2em] uppercase">SİNYAL AKIŞI</h3>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            </div>

            <div className="flex-1 space-y-8 overflow-hidden">
              {latestLogs?.slice(0, 6).map((log: any) => (
                <div key={log.id} className="flex gap-5 group cursor-pointer hover:translate-x-1 transition-transform" onClick={() => window.location.href = '/admin/logs'}>
                  <div className="pt-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${log.level === 'ERROR' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]' : 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]'}`} />
                  </div>
                  <div className="space-y-1.5 flex-1 border-b border-slate-50 pb-4 last:border-none">
                    <p className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {log.message}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="text-slate-300">●</span> {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • {log.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/admin/logs" className="mt-10 block">
              <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all font-black text-[11px] tracking-[0.2em] uppercase text-slate-500 border border-slate-100 active:scale-[0.98]">
                TÜM KAYITLARI GÖRÜNTÜLE
              </button>
            </Link>
          </motion.div>
        </section>

        {/* LOWER GRID - clickable */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
          {/* WEEKLY PERFORMACE */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100"
          >
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-slate-400 mb-10">Bölgesel Performans Dağılımı</h3>
            <div className="h-[300px] w-full">
              <PerformanceChart data={weeklyStats} />
            </div>
          </motion.div>

          {/* REGIONAL / EXTRA KPI */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col justify-between"
          >
             <div>
               <h3 className="text-xs font-black tracking-[0.3em] uppercase text-slate-400 mb-12">TAKTİKSEL SAPMA RAPORU</h3>
               <div className="grid grid-cols-3 gap-10">
                  {tactical?.varianceData?.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="space-y-4">
                      <p className="text-[11px] font-black uppercase text-slate-400 truncate tracking-wider">{item.title}</p>
                      <p className={`text-3xl font-black tracking-tighter ${item.variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        %{Math.abs(item.variancePct || 0).toFixed(0)}
                      </p>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.variance >= 0 ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-1000`} style={{ width: `${Math.min(Math.abs(item.variancePct), 100)}%` }} />
                      </div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-10 mt-10 border-t border-slate-50">
               <Link href="/admin/reports">
                 <div className="p-8 bg-slate-50 rounded-[1.8rem] group hover:bg-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-900/10">
                    <GlobeIcon className="w-8 h-8 text-blue-600 group-hover:text-white mb-6 transition-colors" />
                    <p className="text-[11px] font-black text-slate-400 group-hover:text-blue-100 transition-colors uppercase tracking-[0.1em]">BÖLGESEL VERİ</p>
                    <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">AVRUPA (42%)</p>
                 </div>
               </Link>
               <Link href="/admin/costs">
                 <div className="p-8 bg-slate-50 rounded-[1.8rem] group hover:bg-emerald-600 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-900/10">
                    <TrendingUpIcon className="w-8 h-8 text-emerald-600 group-hover:text-white mb-6 transition-colors" />
                    <p className="text-[11px] font-black text-slate-400 group-hover:text-emerald-100 transition-colors uppercase tracking-[0.1em]">NET KÂRLILIK</p>
                    <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">%{strategic?.overallProfitMargin?.toFixed(0) || 0}</p>
                 </div>
               </Link>
             </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  )
}

function StatCard({ label, value, trend, sub, icon: Icon, color, pill, isAlert = false, href }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', icon: 'text-blue-600', hover: 'hover:border-blue-200 hover:shadow-blue-500/5' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', hover: 'hover:border-emerald-200 hover:shadow-emerald-500/5' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100', icon: 'text-indigo-600', hover: 'hover:border-indigo-200 hover:shadow-indigo-500/5' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-rose-100', icon: 'text-rose-600', hover: 'hover:border-rose-200 hover:shadow-rose-500/5' },
  }
  
  const c = colorMap[color] || colorMap.blue
  const CardContent = (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
      whileHover={{ y: -4 }}
      className={`bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all group overflow-hidden relative cursor-pointer ${c.hover} hover:shadow-2xl`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center ${c.icon} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end gap-2">
          {trend && (
            <span className={`text-[10px] font-black ${isAlert ? 'bg-red-500 text-white' : c.bg + ' ' + c.text} px-3 py-1 rounded-full uppercase tracking-widest shadow-sm`}>
              {trend}
            </span>
          )}
          {pill && (
            <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">
              {pill}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-slate-950 tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase">{value}</h4>
      </div>
      {sub && (
        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${c.icon}`} />
          {sub}
        </p>
      )}
    </motion.div>
  )

  return href ? <Link href={href}>{CardContent}</Link> : CardContent
}
