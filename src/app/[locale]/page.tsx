import { Link } from "@/lib/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { ArrowRight, Box, Layers, ShieldCheck, Activity, Smartphone, Globe, CloudOff, CheckCircle2 } from 'lucide-react'
import * as motion from 'framer-motion/client'

export const runtime = 'nodejs'

// Lazy load heavy 3D scene (Performance Optimization)
const HeroScene = dynamic(
  () => import('@/components/landing/scene.client').then(mod => mod.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-zinc-950 -z-10" /> }
)

// SEO & Metadata Optimization
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return {
    title: `Structra | ${t('title')} - ${t('subtitle')}`,
    description: t('description'),
    openGraph: {
      type: 'website',
      title: `Structra - ${t('title')}`,
      description: t('description'),
      siteName: 'Structra',
    }
  }
}

export default async function HomePage() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Auth failed:", error);
  }

  const t = await getTranslations('Home');

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-cyan-500/30 font-sans tracking-tight overflow-x-hidden">
      <HeroScene />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto z-20">

        {/* Top Navbar */}
        <header className="absolute top-0 left-0 right-0 p-6 md:p-12 flex justify-between items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-cyan-400 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <div className="w-4 h-4 bg-zinc-950 -rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase">Structra</span>
          </motion.div>
        </header>

        {/* Hero Content - Massive Typography */}
        <div className="mt-24 md:mt-0 w-full md:w-[85%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-zinc-800 rounded-full bg-zinc-900/50 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">System Operational</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-white mix-blend-difference"
          >
            {t('title').toUpperCase()} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {t('subtitle').toUpperCase()}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-l border-zinc-800 pl-6 md:pl-12"
          >
            <p className="text-lg md:text-xl text-zinc-400 max-w-md font-light">
              {t('description')}
            </p>
            <div className="flex flex-col gap-6 justify-center">
              <div className="flex gap-4 text-xs font-mono text-zinc-500">
                <span>[01] TRACK</span>
                <span>[02] ASSEMBLE</span>
                <span>[03] DEPLOY</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solais Style Feature Detail: WEB APP */}
      <section className="relative z-20 py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-900 bg-zinc-950 overflow-hidden">
        {/* Abstract background ambient glow */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="w-16 h-16 flex items-center justify-center border border-zinc-800 bg-zinc-900 mb-8 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Globe className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t('features.web.title')}
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed xl:leading-loose mb-10">
              {t('features.web.description')}
            </p>

            <div className="space-y-6">
              {/* Items mapping manually since we just added them to messages */}
              <div className="flex gap-4 items-start group">
                <CheckCircle2 className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white mb-1">Gerçek Zamanlı Harita / Real-time Map</h4>
                  <p className="text-zinc-500 group-hover:text-zinc-400 text-sm">Ekiplerinizin anlık konumlarını ve iş durumlarını harita üzerinden canlı takip edin.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <CheckCircle2 className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white mb-1">Finansal Analiz / Financial Analysis</h4>
                  <p className="text-zinc-500 group-hover:text-zinc-400 text-sm">İş bazlı maliyet hesaplamaları ve karlılık raporlarını tek tuşla alın.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-2 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="w-full h-full rounded-xl bg-zinc-950 border border-zinc-800/50 flex flex-col overflow-hidden relative">
              {/* Mock UI Header */}
              <div className="h-10 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900/50">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              {/* Mock UI Content */}
              <div className="p-6 flex-1 flex flex-col gap-4 relative">
                <div className="w-full h-32 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="absolute bottom-4 left-4 right-4 h-16 flex items-end gap-2">
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '40%' }} className="w-full bg-cyan-900/50 rounded-t-sm border-t border-cyan-500" />
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '70%' }} className="w-full bg-cyan-800/50 rounded-t-sm border-t border-cyan-400" />
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '100%' }} className="w-full bg-cyan-500/50 rounded-t-sm border-t border-cyan-300" />
                    <motion.div initial={{ height: 0 }} whileInView={{ height: '60%' }} className="w-full bg-cyan-900/50 rounded-t-sm border-t border-cyan-500" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 h-20 rounded-lg bg-zinc-900 border border-zinc-800 p-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 mb-2" />
                    <div className="w-1/2 h-2 rounded bg-zinc-700" />
                  </div>
                  <div className="flex-1 h-20 rounded-lg bg-zinc-900 border border-zinc-800 p-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 mb-2" />
                    <div className="w-2/3 h-2 rounded bg-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Solais Style Feature Detail: MOBILE APP */}
      <section className="relative z-20 py-32 px-6 md:px-12 lg:px-24 bg-zinc-950 overflow-hidden">
        {/* Abstract background ambient glow */}
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-sky-900/10 blur-[180px] mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="w-16 h-16 flex items-center justify-center border border-zinc-800 bg-zinc-900 mb-8 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Smartphone className="w-8 h-8 text-sky-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t('features.mobile.title')}
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed xl:leading-loose mb-10">
              {t('features.mobile.description')}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <Box className="w-6 h-6 text-zinc-600 group-hover:text-sky-400 transition-colors shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white mb-1">3D Montaj Kılavuzu / 3D Assembly Guide</h4>
                  <p className="text-zinc-500 group-hover:text-zinc-400 text-sm">Karmaşık ürünleri cep telefonundan 3 boyutlu ve adım adım patlatılmış görünümlerle kurun.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <CloudOff className="w-6 h-6 text-zinc-600 group-hover:text-sky-400 transition-colors shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white mb-1">Çevrimdışı Çalışma / Offline Mode</h4>
                  <p className="text-zinc-500 group-hover:text-zinc-400 text-sm">Bağlantı kopsa bile veriler cihazda tutulur, internet gelince otomatik senkronize olur.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 flex justify-center relative"
          >
            {/* Phone Mockup Frame */}
            <div className="w-[300px] h-[600px] rounded-[3rem] border-[8px] border-zinc-900 bg-zinc-950 p-2 shadow-2xl relative overflow-hidden group">
              {/* Phone Notch/Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-full z-20" />

              {/* Screen Content */}
              <div className="w-full h-full rounded-[2.5rem] bg-zinc-900 overflow-hidden relative flex flex-col">
                {/* 3D App UI Mock */}
                <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-900 relative p-6 flex flex-col justify-end">
                  <motion.div
                    animate={{ rotateY: 360, rotateX: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 border border-sky-500/30 rounded-full flex items-center justify-center"
                  >
                    <div className="w-16 h-16 border border-cyan-400/50 rounded-sm rotate-45" />
                  </motion.div>

                  {/* UI Cards */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-zinc-950/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 mb-4 z-10"
                  >
                    <div className="w-1/2 h-3 bg-zinc-700 rounded-full mb-2" />
                    <div className="w-3/4 h-2 bg-zinc-800 rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-full h-12 bg-sky-500 rounded-xl flex items-center justify-center text-zinc-950 font-bold z-10"
                  >
                    NEXT STEP
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Elements around phone */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-24 -right-8 w-24 h-24 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 flex items-center justify-center shadow-xl"
            >
              <Activity className="text-cyan-400 w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-32 -left-8 w-20 h-20 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 flex items-center justify-center shadow-xl"
            >
              <Box className="text-sky-500 w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center">
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Structra Assembly Tracker. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
