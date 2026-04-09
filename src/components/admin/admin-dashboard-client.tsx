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
    <div className="w-full bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900 rounded-3xl overflow-hidden min-h-[calc(100vh-120px)]">
      
      {/* CONTENT */}
      <motion.div 
        className="p-4 lg:p-10 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden group flex items-center"
          >
            <div className="relative z-10 w-full md:w-2/3">
              <h2 className="text-white text-4xl font-black tracking-tight mb-3">Günaydın, Hoş Geldiniz!</h2>
              <p className="text-blue-100 text-lg mb-8 opacity-90 font-medium leading-relaxed">
                Sistem şu an stabil. Bugün sonuçlandırılması gereken <span className="text-white font-bold">{pendingApprovalsCount}</span> onay talebi bulunuyor.
              </p>
              <Link href="/admin/approvals">
                <button className="bg-white text-blue-700 px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Performansı İncele
                </button>
              </Link>
            </div>

            {/* STAT CIRCLE */}
            <div className="relative z-10 hidden md:flex flex-1 items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-white/10" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * 0.75) }}
                    className="text-white" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="440" strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">75%</span>
                  <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Hedef</span>
                </div>
              </div>
            </div>

            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          </motion.div>

          {/* QUICK KPI CARD */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">GÜNLÜK HEDEF</span>
                <ActivityIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">%{((completedJobsToday / Math.max(totalJobs, 1)) * 100).toFixed(0)}</h3>
                <div className="flex items-center gap-2 mt-4 text-emerald-600">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">Tamamlanan görevler</span>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-50">
              <div className="flex justify-between items-end">
                <div className="flex gap-1.5 h-10 items-end">
                  {[3, 5, 8, 10, 6, 9, 4].map((v, i) => (
                    <div key={i} className={`w-2 rounded-full ${i === 3 ? 'bg-blue-600 h-10' : 'bg-blue-100 h-' + v * 3}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Haftalık Mevcudiyet</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* KPI GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard label="Aktif Görev" value={activeJobs} trend="+12.4%" icon={BriefcaseIcon} color="blue" />
          <StatCard label="Toplam Bütçe" value={`₺${(totalCostToday).toLocaleString('tr-TR')}`} trend="+8.2%" icon={DollarSignIcon} color="emerald" pill="GÜNLÜK" />
          <StatCard label="Saha Personeli" value={totalWorkers} sub={`${activeTeams} Takım`} icon={UsersIcon} color="indigo" pill="AKTİF" />
          <StatCard label="Onay Bekleyen" value={pendingApprovalsCount} trend={`${pendingApprovalsCount > 0 ? 'DİKKAT' : 'TEMİZ'}`} icon={CheckCircle2Icon} color="rose" isAlert={pendingApprovalsCount > 0} />
        </section>

        {/* CHARTS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LARGE CHART */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Stratejik Analiz</h3>
                <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase">SİSTEM NABZI</h2>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Canlı Akış Aktif</span>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <StrategicPulseChart data={strategicTrend} />
            </div>
          </motion.div>

          {/* SIDE ACTIVITY / LOGS */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ActivityIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black tracking-[0.2em] uppercase">SİNYAL AKIŞI</h3>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            </div>

            <div className="flex-1 space-y-6 overflow-hidden">
              {latestLogs?.slice(0, 5).map((log: any) => (
                <div key={log.id} className="flex gap-4 group cursor-default">
                  <div className="pt-1">
                    <div className={`w-2 h-2 rounded-full ${log.level === 'ERROR' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-800 leading-none">
                      {log.message}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • {log.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/admin/logs" className="mt-8 block">
              <button className="w-full py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] tracking-widest uppercase text-slate-500">
                TÜM KAYITLARI GÖR
              </button>
            </Link>
          </motion.div>
        </section>

        {/* LOWER GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* WEEKLY PERFORMACE */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-8">Haftalık Performans</h3>
            <div className="h-[250px] w-full">
              <PerformanceChart data={weeklyStats} />
            </div>
          </motion.div>

          {/* REGIONAL / EXTRA KPI */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between"
          >
             <div>
               <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mb-8 text-center md:text-left">TAKTİKSEL SAPMA</h3>
               <div className="grid grid-cols-3 gap-8">
                  {tactical?.varianceData?.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 truncate">{item.title}</p>
                      <p className={`text-2xl font-black tracking-tighter ${item.variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        %{Math.abs(item.variancePct || 0).toFixed(0)}
                      </p>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.variance >= 0 ? 'bg-emerald-500' : 'bg-red-500'} w-[${Math.min(Math.abs(item.variancePct), 100)}%]`} />
                      </div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-50">
               <div className="p-6 bg-slate-50 rounded-2xl group hover:bg-blue-600 transition-all cursor-pointer">
                  <GlobeIcon className="w-6 h-6 text-blue-600 group-hover:text-white mb-4 transition-colors" />
                  <p className="text-[10px] font-black text-slate-400 group-hover:text-blue-100 transition-colors">BÖLGESEL</p>
                  <p className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">AVRUPA (42%)</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl group hover:bg-blue-600 transition-all cursor-pointer">
                  <TrendingUpIcon className="w-6 h-6 text-emerald-600 group-hover:text-white mb-4 transition-colors" />
                  <p className="text-[10px] font-black text-slate-400 group-hover:text-blue-100 transition-colors">KÂRLILIK</p>
                  <p className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">%{strategic?.overallProfitMargin?.toFixed(0) || 0}</p>
               </div>
             </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  )
}

function StatCard({ label, value, trend, sub, icon: Icon, color, pill, isAlert = false }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', icon: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100', icon: 'text-emerald-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100', icon: 'text-indigo-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-rose-100', icon: 'text-rose-600' },
  }
  
  const c = colorMap[color] || colorMap.blue

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-100 transition-all group overflow-hidden relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 rounded-2xl ${c.iconBg} flex items-center justify-center ${c.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-[10px] font-black ${isAlert ? 'bg-red-100 text-red-600' : c.bg + ' ' + c.text} px-2 py-1 rounded-full uppercase tracking-widest`}>
            {trend}
          </span>
        )}
        {pill && (
          <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-widest">
            {pill}
          </span>
        )}
      </div>
      
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{value}</h4>
      </div>
      {sub && (
        <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">{sub}</p>
      )}
    </motion.div>
  )
}
