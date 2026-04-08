'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BriefcaseIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  ClockIcon, 
  ZapIcon, 
  ShieldCheckIcon, 
  ActivityIcon,
  ArrowUpRightIcon,
  AlertTriangleIcon,
  MousePointer2Icon,
  LayersIcon,
  TargetIcon,
  BoxIcon,
  TrendingDownIcon,
  LayoutGridIcon,
  BarChart3Icon,
  HistoryIcon
} from 'lucide-react'
import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { StrategicPulseChart } from "@/components/charts/strategic-pulse-chart"
import { Link } from "@/lib/navigation"

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const dashboardData = await getAdminDashboardData()
      setData(dashboardData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-600/20 border-t-teal-600 rounded-full"
        />
      </div>
    )
  }

  const {
    activeJobs,
    totalJobs,
    completedJobsToday,
    totalWorkers,
    activeTeams,
    pendingApprovalsCount,
    totalCostToday,
    latestLogs,
    strategic,
    tactical,
    operational,
    strategicTrend
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-950 p-6 md:p-12 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-100/30 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-orange-100/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <p className="text-teal-600 font-mono text-[10px] tracking-[0.4em] uppercase font-bold">Systems Online • v4.0</p>
            </div>
            <h1 className="font-black text-6xl md:text-8xl tracking-tighter leading-[0.85] text-slate-950">
              OPERASYON<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">MERKEZİ</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/60 backdrop-blur-xl border border-white p-6 shadow-2xl shadow-slate-200/50 min-w-[200px]">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-2 text-right">AKTİF İŞ YÜKÜ</p>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-5xl font-black tracking-tighter text-slate-950 leading-none">{activeJobs}</span>
                <span className="text-xs font-bold text-teal-600 uppercase">GÖREV</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* BENTO GRID LAYOUT */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
        >
          {/* STRATEGIC PULSE - THE BIG ONE */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 bg-white/80 backdrop-blur-2xl border border-white p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
               <TrendingUpIcon className="w-64 h-64 text-slate-950" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Stratejik Dalgalama Analizi</h3>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-950">SİSTEM NABZI</h2>
                </div>
                <div className="bg-orange-50 px-6 py-4 border-l-4 border-orange-500">
                  <span className="text-2xl font-black tracking-tighter text-orange-600">₺{(strategicTrend?.[strategicTrend.length-1]?.cost || 0).toLocaleString('tr-TR')}</span>
                  <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-1">SON 24 SAAT MALİYET</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-[300px] w-full mt-4">
                <StrategicPulseChart data={strategicTrend} />
              </div>
            </div>
          </motion.div>

          {/* RISK & PROFIT - TALL CARD */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 bg-slate-950 text-white p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-20 -top-20 opacity-20 rotate-12">
               <ShieldCheckIcon className="w-80 h-80 text-teal-500" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal-400 font-bold">GÜVENLİK & RİSK</h3>
              </div>
              
              <div className="mb-12">
                <p className="text-8xl font-black tracking-tighter leading-none mb-4">
                  %{operational?.bottleneckScore?.toFixed(0) || 0}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${operational?.bottleneckScore}%` }}
                      className={`h-full ${Number(operational?.bottleneckScore) > 20 ? 'bg-orange-500' : 'bg-teal-500'}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Skoru</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">KÂRLILIK</span>
                <span className="text-3xl font-black tracking-tighter text-white">%{strategic?.overallProfitMargin?.toFixed(0) || 0}</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">EKİP YÜKÜ</span>
                <span className="text-3xl font-black tracking-tighter text-teal-400">OPTIMAL</span>
              </div>
            </div>
          </motion.div>

          {/* KPI CARDS - BENTO STYLE */}
          {[
            { icon: BriefcaseIcon, label: 'Toplam İş', value: totalJobs, sub: `${activeJobs} Aktif`, color: 'bg-teal-500', text: 'text-teal-600', span: 'lg:col-span-3' },
            { icon: TargetIcon, label: 'Günlük Hedef', value: completedJobsToday, sub: 'İşlem Başarılı', color: 'bg-slate-900', text: 'text-slate-900', span: 'lg:col-span-3' },
            { icon: UsersIcon, label: 'Personel', value: totalWorkers, sub: `${activeTeams} Takım Sahada`, color: 'bg-teal-500', text: 'text-teal-600', span: 'lg:col-span-3' },
            { icon: ShieldCheckIcon, label: 'Onaylar', value: pendingApprovalsCount, sub: 'Kritik Bekleme', color: 'bg-orange-500', text: 'text-orange-600', span: 'lg:col-span-3' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className={`${stat.span} bg-white/70 backdrop-blur-xl border border-white p-8 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] translate-x-8 -translate-y-8 rounded-full`} />
              <div className={`p-3 rounded-2xl ${stat.color}/10 inline-block mb-8`}>
                <stat.icon className={`w-6 h-6 ${stat.text}`} />
              </div>
              <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-black tracking-tighter text-slate-950 leading-none">{stat.value}</h2>
              </div>
              <div className="mt-4 flex items-center gap-2 overflow-hidden">
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">{stat.sub}</span>
              </div>
            </motion.div>
          ))}

          {/* PERFORMANCE CHART */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-white p-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-600 rounded-2xl shadow-lg shadow-teal-200">
                  <BarChart3Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Haftalık Analiz</h3>
                  <h2 className="text-2xl font-black tracking-tighter">PERFORMANS VEKTÖRÜ</h2>
                </div>
              </div>
            </div>
            <div className="h-[380px] w-full">
              <PerformanceChart data={data.weeklyStats} />
            </div>
          </motion.div>

          {/* QUICK LINKS & LOGS */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 space-y-8"
          >
            {/* Taktiksel İşlemler */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: '/admin/jobs', icon: LayoutGridIcon, label: 'İŞ YÖNETİMİ' },
                { href: '/admin/costs', icon: BarChart3Icon, label: 'MALİ RADAR' },
                { href: '/admin/teams', icon: UsersIcon, label: 'EKİP GÜCÜ' },
                { href: '/admin/logs', icon: HistoryIcon, label: 'SİSTEM KAYDI' },
              ].map((link, i) => (
                <Link key={i} href={link.href} className="block group">
                  <div className="p-6 bg-white/60 backdrop-blur-xl border border-white shadow-lg group-hover:bg-teal-600 transition-all group-hover:translate-y-[-4px]">
                    <link.icon className="w-6 h-6 mb-4 text-teal-600 group-hover:text-white transition-colors" />
                    <span className="font-black text-xs tracking-widest group-hover:text-white transition-colors">{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* LIVE FEED */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ActivityIcon className="w-4 h-4 text-orange-600" />
                  <h3 className="text-xs font-black tracking-[0.2em] uppercase">CANLI SİNYAL AKIŞI</h3>
                </div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              </div>
              
              <div className="space-y-6 font-mono text-[11px]">
                {latestLogs?.length > 0 ? latestLogs.map((log: any) => (
                  <div key={log.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 hover:translate-x-1 transition-transform">
                    <span className="text-slate-400 font-bold shrink-0">{new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex-1 overflow-hidden">
                      <span className={`uppercase font-black mr-2 ${log.level === 'ERROR' ? 'text-orange-600' : 'text-teal-600'}`}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-600 leading-relaxed capitalize truncate block">{log.message}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 italic text-center py-4">Sinyal bekleniyor...</p>
                )}
              </div>
              
              <Link href="/admin/logs" className="block mt-8 text-center py-3 border border-slate-100 hover:border-teal-600 hover:bg-teal-50 transition-all font-black text-[10px] tracking-widest uppercase">
                TÜM TERMİNALİ İNCELE
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM METRICS - STRATEGIC PARTNERS */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] text-slate-400 font-black tracking-[0.3em] uppercase px-1">Stratejik Ortaklar</h3>
            <div className="space-y-2">
              {strategic?.topCustomersByProfit?.slice(0, 3).map((cust: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-xl border border-white shadow-sm hover:translate-x-2 transition-transform">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{cust.customer}</span>
                  <span className="text-[9px] font-mono font-bold text-teal-600 px-2 py-0.5 bg-teal-50 leading-none">%{cust.profitMargin?.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white p-10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <BarChart3Icon className="w-48 h-48" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h3 className="text-xs font-black tracking-widest text-slate-400 mb-1">Analiz</h3>
                <h2 className="text-2xl font-black tracking-tighter">TAKTİKSEL SAPMA</h2>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] text-left md:text-right">BÜTÇE VE GERÇEKLEŞEN MALİYET KARŞILAŞTIRMASI</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {tactical?.varianceData?.slice(0, 3).map((item: any, i: number) => (
                 <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight truncate border-l-2 border-teal-600 pl-2 max-w-[120px]">{item.title}</p>
                      <span className={`text-[10px] font-black ${item.variance >= 0 ? 'text-teal-600' : 'text-orange-600'}`}>
                        %{Math.abs(item.variancePct || 0).toFixed(0)}
                      </span>
                    </div>
                    <p className={`text-3xl font-black tracking-tighter ${item.variance >= 0 ? 'text-teal-600' : 'text-orange-600'}`}>
                       {item.variance >= 0 ? '+' : ''}₺{Math.abs(item.variance || 0).toLocaleString('tr-TR')}
                    </p>
                    <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(item.variancePct || 0, 100)}%` }}
                         className={`h-full ${item.variance >= 0 ? 'bg-teal-600' : 'bg-orange-600'}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}