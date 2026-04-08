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
  BoxIcon
} from 'lucide-react'
import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { Link } from "@/lib/navigation"
import Image from "next/image"

// --- THEME CONSTANTS ---
const COLORS = {
  signalOrange: '#FF5722',
  cyberTeal: '#00F5FF',
  monoslate: '#1A1B1E',
  concrete: '#8E8E93',
  neonOrange: '0px 0px 20px rgba(255, 87, 34, 0.4)',
  neonTeal: '0px 0px 20px rgba(0, 245, 255, 0.4)',
}

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
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full"
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
    budgetPercentage,
    latestLogs,
    strategic,
    tactical,
    operational
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
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 p-4 md:p-8 font-sans selection:bg-[#00F5FF] selection:text-[#0A0A0B]">
      
      {/* 1. ASYMMETRIC HEADER & STRATEGIC LAYER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12"
      >
        <div className="lg:col-span-8 flex flex-col justify-end min-h-[200px]">
          <motion.p variants={itemVariants} className="text-[#00F5FF] font-mono text-sm tracking-widest uppercase mb-2">System Status: Active</motion.p>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            COMMAND <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#FF5722]">CENTER</span>
          </motion.h1>
          <motion.div variants={itemVariants} className="flex gap-4">
            <div className="px-4 py-2 border border-[#8E8E93]/20 bg-white/5 backdrop-blur-md rounded-sm">
              <span className="text-xs text-[#8E8E93] uppercase block">Overall Margin</span>
              <span className="text-2xl font-bold">%{strategic?.overallProfitMargin?.toFixed(1) || 0}</span>
            </div>
            <div className="px-4 py-2 border border-[#8E8E93]/20 bg-white/5 backdrop-blur-md rounded-sm">
              <span className="text-xs text-[#8E8E93] uppercase block">Growth Vector</span>
              <TrendingUpIcon className="w-5 h-5 text-[#00F5FF] mt-1" />
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 relative group">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="h-full bg-gradient-to-br from-[#1A1B1E] to-[#0A0A0B] border border-[#FF5722]/30 p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF5722]/10 blur-3xl rounded-full group-hover:bg-[#FF5722]/20 transition-all duration-500" />
            <div className="relative z-10">
              <h3 className="text-[#FF5722] font-mono text-xs uppercase mb-1">Bottleneck Criticality</h3>
              <p className="text-3xl font-bold tracking-tighter uppercase leading-none">
                {operational?.bottleneckScore?.toFixed(0) || 0}% ALERT
              </p>
            </div>
            <div className="relative z-10 space-y-4 mt-8 text-sm">
              <div className="flex justify-between border-b border-[#8E8E93]/10 pb-2">
                <span className="text-[#8E8E93]">Urgent Costs</span>
                <span className="font-bold text-[#FF5722] tracking-widest">{operational?.pendingApprovals?.costs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Blocked Steps</span>
                <span className="font-bold">{operational?.pendingApprovals?.steps || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. FRAGMENTED METRICS GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
      >
        {[
          { icon: BriefcaseIcon, label: 'Active Jobs', value: activeJobs, sub: `of ${totalJobs}`, color: COLORS.cyberTeal },
          { icon: TargetIcon, label: 'Daily Goal', value: completedJobsToday, sub: 'Confirmed', color: '#FFF' },
          { icon: UsersIcon, label: 'Field Ops', value: totalWorkers, sub: `${activeTeams} Teams`, color: COLORS.cyberTeal },
          { icon: ShieldCheckIcon, label: 'Validation', value: pendingApprovalsCount, sub: 'Needs Review', color: COLORS.signalOrange },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="p-6 bg-[#1A1B1E] border border-[#8E8E93]/10 relative group hover:border-[#8E8E93]/30 transition-all cursor-crosshair"
          >
            <stat.icon className="w-5 h-5 mb-4" style={{ color: stat.color }} />
            <p className="text-xs text-[#8E8E93] uppercase font-mono tracking-tighter tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tighter">{stat.value}</h2>
              <span className="text-[10px] text-[#8E8E93]">{stat.sub}</span>
            </div>
            {/* Minimalist Grid Artifact */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-1 h-1 bg-white/10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2.5 STRATEGIC & TACTICAL DEEP DIVE (Overlapping Fragment) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center"
      >
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs text-[#8E8E93] font-mono tracking-widest uppercase px-1 flex items-center gap-2">
            <TargetIcon className="w-3 h-3 text-[#FF5722]" /> Strategic Partners
          </h2>
          <div className="space-y-0.5">
            {strategic?.topCustomersByProfit?.map((cust: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#1A1B1E] border-l-4 border-[#00F5FF]/10 hover:border-[#00F5FF] transition-all">
                <span className="text-sm font-bold tracking-tight">{cust.customer}</span>
                <span className="text-xs font-mono text-[#00F5FF]">%{cust.profitMargin.toFixed(1)} MARGIN</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#FF5722]/5 border border-[#FF5722]/20 p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUpIcon className="w-24 h-24" />
           </div>
           <h2 className="text-xl font-bold tracking-tighter uppercase mb-6">Tactical Variance Radar</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {tactical?.varianceData?.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="space-y-2">
                   <p className="text-[10px] text-[#8E8E93] uppercase font-mono truncate">{item.title}</p>
                   <p className={`text-xl font-black ${item.variance >= 0 ? 'text-[#00F5FF]' : 'text-[#FF5722]'}`}>
                      {item.variance >= 0 ? '+' : ''}₺{Math.abs(item.variance).toLocaleString()}
                   </p>
                   <div className="h-0.5 bg-white/10 w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.variancePct, 100)}%` }}
                        className={`h-full ${item.variance >= 0 ? 'bg-[#00F5FF]' : 'bg-[#FF5722]'}`}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </motion.div>

      {/* 3. THE ANALYTIC CORE (Asymmetric Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

        
        {/* LEFT: TACTICAL FLOW & OPS */}
        <div className="lg:col-span-6 space-y-12">
          
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-[#1A1B1E] border border-[#00F5FF]/10 relative shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BoxIcon className="w-5 h-5 text-[#00F5FF]" />
                <h2 className="text-lg font-bold tracking-uppercase tracking-widest">PERFORMANCE VECTOR</h2>
              </div>
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#00F5FF]" /> COMPLETIONS</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <PerformanceChart data={data.weeklyStats} />
            </div>
            {/* Overlay Grid Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00F5FF]/20 to-transparent" />
          </motion.div>

          {/* Quick Actions - Radical Typography Link List */}
          <div className="space-y-4">
            <h2 className="text-xs text-[#8E8E93] font-mono tracking-widest uppercase px-1">Tactical Maneuvers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { href: '/admin/jobs', label: 'JOB ORCHESTRATION', desc: 'Control live deployments' },
                { href: '/admin/costs', label: 'FINANCIAL RADAR', desc: 'Audit resource flow' },
                { href: '/admin/teams', label: 'UNIT DEPLOYMENT', desc: 'Manage field assets' },
                { href: '/admin/reports', label: 'STRATEGIC INTEL', desc: 'Historical analysis' },
              ].map((link, i) => (
                <Link key={i} href={link.href}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-4 border-l-2 border-[#8E8E93]/20 bg-white/2 hover:border-[#00F5FF] hover:bg-[#00F5FF]/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg tracking-tight group-hover:text-[#00F5FF]">{link.label}</span>
                      <ArrowUpRightIcon className="w-4 h-4 text-[#8E8E93] group-hover:text-[#00F5FF]" />
                    </div>
                    <p className="text-[10px] text-[#8E8E93] uppercase font-mono mt-1">{link.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME FEED & BOTTLENECKS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Activity Logs - Technical Terminal Style */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="border-t-2 border-[#FF5722] bg-[#1A1B1E] p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <ActivityIcon className="w-4 h-4 text-[#FF5722]" />
              <h2 className="text-sm font-bold tracking-widest uppercase">REAL-TIME SIGNAL FEED</h2>
            </div>
            <div className="space-y-4 font-mono text-[11px]">
              {latestLogs.map((log: any) => (
                <div key={log.id} className="flex gap-3 group">
                  <span className="text-[#8E8E93] shrink-0">{new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex-1">
                    <span className={`uppercase font-bold mr-2 ${log.level === 'ERROR' ? 'text-[#FF5722]' : 'text-[#00F5FF]'}`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-400 group-hover:text-white transition-colors">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/logs">
              <p className="mt-8 text-[10px] text-[#8E8E93] hover:text-[#FF5722] transition-colors cursor-pointer flex items-center gap-2">
                OPEN FULL TERMINAL <MousePointer2Icon className="w-3 h-3" />
              </p>
            </Link>
          </motion.div>

          {/* Top Bottlenecks - Fragmented List */}
          <div className="space-y-4">
            <h2 className="text-xs text-[#8E8E93] font-mono tracking-widest uppercase">Operational Bottlenecks</h2>
            <div className="space-y-1">
              {operational?.topBottlenecks?.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/2 border border-white/5 hover:bg-[#FF5722]/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#FF5722]/20 group-hover:bg-[#FF5722] transition-all" />
                    <div>
                      <p className="text-xs font-bold tracking-tight">{item.title}</p>
                      <p className="text-[10px] text-[#8E8E93] uppercase font-mono">{item.jobNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#FF5722] font-black">{item.delay.toFixed(0)} MIN DELAY</p>
                    <p className="text-[9px] text-[#8E8E93]">{item.bottleneckCount} STALLS</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Capacity Radar (Tactical) */}
          <div className="p-6 bg-[#1A1B1E] border border-white/5">
            <h2 className="text-xs text-[#8E8E93] font-mono tracking-widest uppercase mb-6 flex items-center gap-2">
              <LayersIcon className="w-3 h-3 text-[#00F5FF]" /> DEPLOYMENT DENSITY
            </h2>
            <div className="space-y-4">
              {tactical?.teamCapacity?.slice(0, 3).map((team: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span>{team.teamName}</span>
                    <span className="text-[#00F5FF]">%{team.loadFactor.toFixed(0)}</span>
                  </div>
                  <div className="h-1 bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${team.loadFactor}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-[#00F5FF]"
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
