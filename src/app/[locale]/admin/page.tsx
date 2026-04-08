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
  TrendingDownIcon
} from 'lucide-react'
import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { StrategicPulseChart } from "@/components/charts/strategic-pulse-chart"
import { Link } from "@/lib/navigation"
import Image from "next/image"

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
          className="w-10 h-10 border-2 border-teal-600/20 border-t-teal-600 rounded-full"
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
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 p-4 md:p-10 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* 1. RADİKAL BAŞLIK & STRATEJİK NABIZ */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end"
      >
        <div className="lg:col-span-4 flex flex-col justify-end">
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-teal-600 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">SİSTEM DURUMU: ANALİTİK AKTİF</p>
            <h1 className="font-black text-6xl md:text-8xl tracking-tighter leading-[0.8] text-slate-950">
              OPERASYON<br/><span className="text-teal-600">MERKEZİ</span>
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white border-l-4 border-teal-600 p-6 shadow-xl">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">GÜNCEL YÜK (AKTİF + BEKLEYEN)</span>
                <ZapIcon className="w-4 h-4 text-teal-600" />
             </div>
             <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black tracking-tighter text-slate-950">{activeJobs}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">İş Havuzda</span>
             </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 h-[280px] bg-white border border-slate-200 p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 uppercase font-black text-[40px] tracking-tighter leading-none pointer-events-none select-none">
              Strategic<br/>Pulse
           </div>
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Stratejik Dalgalanma</h3>
                  <p className="text-[10px] font-bold text-teal-600 uppercase">İş Yoğunluğu & Maliyet Akışı</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tighter text-slate-950">₺{(strategicTrend?.[strategicTrend.length-1]?.cost || 0).toLocaleString('tr-TR')}</span>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">SON 24H HARCAMA</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <StrategicPulseChart data={strategicTrend} />
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div 
            variants={itemVariants}
            className="bg-slate-950 text-white p-8 shadow-2xl relative overflow-hidden h-[280px] flex flex-col justify-between"
          >
            <div className="absolute -right-6 -top-6 opacity-10">
               <ShieldCheckIcon className="w-32 h-32 text-teal-500" />
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-4 text-teal-400">OPERASYONEL RİSK</h3>
              <p className="text-7xl font-black tracking-tighter leading-none mb-2">
                %{operational?.bottleneckScore?.toFixed(0) || 0}
              </p>
              <div className={`w-12 h-1 ${Number(operational?.bottleneckScore) > 20 ? 'bg-orange-600' : 'bg-teal-600'}`} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Kârlılık</span>
                <span className="text-xl font-black tracking-widest text-white">%{strategic?.overallProfitMargin?.toFixed(0) || 0}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Duyarlılık</span>
                <span className="text-xl font-black tracking-widest text-teal-500">Yüksek</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. FRAGMENTED METRİKLER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 mb-16 shadow-lg overflow-hidden"
      >
        {[
          { icon: BriefcaseIcon, label: 'Toplam İş', value: totalJobs, sub: `${activeJobs} Aktif/Bekleyen`, color: 'text-teal-600' },
          { icon: TargetIcon, label: 'Günlük Hedef', value: completedJobsToday, sub: 'Tamamlandı', color: 'text-slate-950' },
          { icon: UsersIcon, label: 'Saha Operasyonu', value: totalWorkers, sub: `${activeTeams} Ekip Aktif`, color: 'text-teal-600' },
          { icon: ShieldCheckIcon, label: 'Bekleyen Onay', value: pendingApprovalsCount, sub: 'Kritik İnceleme', color: 'text-orange-600' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="p-8 bg-white hover:bg-slate-50 transition-colors group relative"
          >
            <stat.icon className={`w-5 h-5 mb-6 ${stat.color}`} />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black tracking-tighter text-slate-950">{stat.value}</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2.5 STRATEJİK & TAKTİKSEL DERİNLİK */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
      >
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] text-slate-400 font-black tracking-widest uppercase px-1 flex items-center gap-2">
            <TargetIcon className="w-3 h-3 text-teal-600" /> Stratejik Ortaklar
          </h2>
          <div className="space-y-1">
            {strategic?.topCustomersByProfit?.map((cust: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 shadow-sm hover:border-teal-600/30 transition-all group">
                <span className="text-xs font-black text-slate-950 uppercase tracking-tight">{cust.customer}</span>
                <span className="text-[10px] font-mono font-bold text-teal-600 px-2 py-1 bg-teal-50">%{cust.profitMargin.toFixed(1)} MARJ</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 p-10 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <TrendingUpIcon className="w-48 h-48 text-slate-950" />
           </div>
           <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 text-slate-950">Taktiksel Sapma Analizi</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Bütçe ve Gerçekleşen Maliyet Karşılaştırması</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {tactical?.varianceData?.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="space-y-4">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight truncate border-l-2 border-teal-600 pl-2">{item.title}</p>
                   <p className={`text-3xl font-black tracking-tighter ${item.variance >= 0 ? 'text-teal-600' : 'text-orange-600'}`}>
                      {item.variance >= 0 ? '+' : ''}₺{Math.abs(item.variance).toLocaleString('tr-TR')}
                   </p>
                   <div className="h-1 bg-slate-100 w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.variancePct, 100)}%` }}
                        className={`h-full ${item.variance >= 0 ? 'bg-teal-600' : 'bg-orange-600'}`}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </motion.div>

      {/* 3. ANALİTİK ÇEKİRDEK */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        
        {/* SOL: PERFORMANS AKIŞI */}
        <div className="lg:col-span-6 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 bg-white border border-slate-200 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <BoxIcon className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-black tracking-tighter uppercase">Performans Vektörü</h2>
              </div>
              <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Haftalık Tamamlanan Adımlar</div>
            </div>
            <div className="h-[350px] w-full">
              <PerformanceChart data={data.weeklyStats} />
            </div>
          </motion.div>

          {/* Taktiksel İşlemler */}
          <div className="space-y-4">
            <h2 className="text-[10px] text-slate-400 font-black tracking-widest uppercase px-1">Taktiksel İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { href: '/admin/jobs', label: 'İŞ YÖNETİMİ', desc: 'Canlı saha operasyonlarını yönet' },
                { href: '/admin/costs', label: 'FİNANSAL RADAR', desc: 'Maliyet akışını denetle' },
                { href: '/admin/teams', label: 'EKİP YÖNETİMİ', desc: 'Personel varlıklarını optimize et' },
                { href: '/admin/reports', label: 'STRATEJİK ANALİZ', desc: 'Geçmiş verileri incele' },
              ].map((link, i) => (
                <Link key={i} href={link.href}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-6 border border-slate-200 bg-white hover:border-teal-600 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xl tracking-tighter group-hover:text-teal-600">{link.label}</span>
                      <ArrowUpRightIcon className="w-5 h-5 text-slate-300 group-hover:text-teal-600" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{link.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: CANLI AKIŞ & DARBOĞAZLAR */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Canlı Sinyal Akışı */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="border-t-4 border-orange-600 bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <ActivityIcon className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-black tracking-widest uppercase">CANLI SİNYAL AKIŞI</h2>
            </div>
            <div className="space-y-6 font-mono text-[11px]">
              {latestLogs.map((log: any) => (
                <div key={log.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 hover:bg-slate-50 transition-colors">
                  <span className="text-slate-400 font-bold shrink-0">{new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex-1">
                    <span className={`uppercase font-black mr-2 ${log.level === 'ERROR' ? 'text-orange-600' : 'text-teal-600'}`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-600 leading-relaxed capitalize">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/logs">
              <p className="mt-8 text-[10px] text-slate-400 hover:text-orange-600 font-black transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-widest">
                TÜM TERMİNALİ AÇ <MousePointer2Icon className="w-3 h-3" />
              </p>
            </Link>
          </motion.div>

          {/* Operasyone Darboğazlar */}
          <div className="space-y-4">
            <h2 className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Operasyonel Darboğazlar</h2>
            <div className="space-y-2">
              {operational?.topBottlenecks?.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 shadow-sm hover:border-orange-600/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-10 bg-orange-600/10 group-hover:bg-orange-600 transition-all" />
                    <div>
                      <p className="text-xs font-black tracking-tight text-slate-900 uppercase">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.jobNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">{item.delay.toFixed(0)} DK GECİKME</p>
                    <p className="text-[9px] text-slate-400 font-black">{item.bottleneckCount} DURAKLAMA</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ekip Kapasite Yoğunluğu */}
          <div className="p-8 bg-white border border-slate-200 shadow-lg">
            <h2 className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-8 flex items-center gap-2">
              <LayersIcon className="w-3 h-3 text-teal-600" /> EKİP YÜK YOĞUNLUĞU
            </h2>
            <div className="space-y-6">
              {tactical?.teamCapacity?.slice(0, 3).map((team: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                    <span>{team.teamName}</span>
                    <span className="text-teal-600">%{team.loadFactor.toFixed(0)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${team.loadFactor}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}