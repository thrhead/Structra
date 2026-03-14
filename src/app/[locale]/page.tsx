import { Link } from "@/lib/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { 
  ArrowRight, Box, Layers, ShieldCheck, Activity, 
  Smartphone, Globe, CloudOff, CheckCircle2, 
  MapPin, Camera, Zap, Shield, Eye, BarChart3
} from 'lucide-react'
import * as motion from 'framer-motion/client'

export const runtime = 'nodejs'

// Lazy load heavy 3D scene (Performance Optimization)
const HeroScene = dynamic(
  () => import('@/components/landing/scene.client').then(mod => mod.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-slate-950 -z-10" /> }
)

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return {
    title: `Structra | ${t('title')} - ${t('subtitle')}`,
    description: t('description'),
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
  const t_nav = await getTranslations('Navigation');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500/30 font-sans tracking-tight overflow-x-hidden">
      <HeroScene />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto z-20">
        <header className="absolute top-0 left-0 right-0 p-6 md:p-12 flex justify-between items-center z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <div className="w-4 h-4 bg-slate-950 -rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase">Structra</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {session ? (
              <Link
                href={`/${session.user.role.toLowerCase()}`}
                className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors border border-slate-800 px-6 py-3 rounded-full bg-slate-900/50 backdrop-blur-sm"
              >
                [ {t_nav('dashboard')} ]
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-colors border border-slate-800 px-6 py-3 rounded-full bg-slate-900/50 backdrop-blur-sm"
              >
                [ {t('loginButton')} ]
              </Link>
            )}
          </motion.div>
        </header>

        <div className="mt-24 md:mt-0 w-full md:w-[90%]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-amber-500/20 rounded-full bg-amber-500/5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.2em] font-bold">Industrial Standard 4.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8 text-white"
          >
            {t('title').toUpperCase()} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              {t('subtitle').toUpperCase()}
            </span>
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-12 mt-12 items-start">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-400 max-w-xl font-light leading-relaxed"
            >
              {t('description')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {i === 4 ? "+50" : ""}
                  </div>
                ))}
              </div>
              <div className="text-xs font-mono uppercase tracking-tighter">
                <div className="text-amber-500 font-bold">128+ Eki̇p</div>
                <div className="text-slate-500">Saha Operasyonu</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Industrial Content from Memory Bank */}
      <section className="relative z-20 py-32 px-6 md:px-12 lg:px-24 bg-slate-950/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                {t('trust.title')}
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-lg">
                {t('trust.description')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Manual mapping for trust cards with icons */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors group">
                  <Camera className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold mb-2">Dijital Kanıt</h4>
                  <p className="text-sm text-slate-500">Fotoğraf ve GPS konumu ile her adımı doğrulayın.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
                  <CloudOff className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold mb-2">Kesintisiz Veri</h4>
                  <p className="text-sm text-slate-500">Çevrimdışı mod ile şantiyede bile veri kaybı yaşamayın.</p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-square">
              {/* Mock Dashboard 3D Effect */}
              <motion.div 
                initial={{ rotateY: 20, rotateX: 10 }}
                whileInView={{ rotateY: 0, rotateX: 0 }}
                viewport={{ once: true }}
                className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-4 transform"
                style={{ perspective: '2000px' }}
              >
                <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                  <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-full max-w-[100px]" />
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="h-40 rounded-xl bg-slate-900 border border-slate-800 p-4 relative overflow-hidden">
                       <BarChart3 className="absolute bottom-4 right-4 text-amber-500/20 w-16 h-16" />
                       <div className="text-[10px] uppercase font-mono text-slate-500 mb-2">MALİYET ANALİZİ</div>
                       <div className="text-2xl font-bold">₺42,500</div>
                    </div>
                    <div className="h-40 rounded-xl bg-slate-900 border border-slate-800 p-4 relative overflow-hidden">
                       <MapPin className="absolute bottom-4 right-4 text-blue-500/20 w-16 h-16" />
                       <div className="text-[10px] uppercase font-mono text-slate-500 mb-2">AKTİF EKİPLER</div>
                       <div className="text-2xl font-bold">12</div>
                    </div>
                    <div className="col-span-2 h-32 rounded-xl bg-slate-900 border border-slate-800 p-4">
                       <div className="flex justify-between items-center mb-4">
                         <div className="text-[10px] uppercase font-mono text-slate-500">İŞ İLERLEMESİ</div>
                         <div className="text-[10px] font-bold text-amber-500">85%</div>
                       </div>
                       <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-amber-500" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-6">HERKES İÇİN BİR ARAYÜZ</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Structra, şirketinizin her kademesindeki çalışanlar için farklı ve optimize edilmiş deneyimler sunar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { role: "WORKER", icon: <Smartphone />, color: "border-amber-500/20" },
            { role: "MANAGER", icon: <Layers />, color: "border-blue-500/20" },
            { role: "CUSTOMER", icon: <Eye />, color: "border-cyan-500/20" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl bg-slate-900/30 border ${item.color} backdrop-blur-xl relative group overflow-hidden`}
            >
              <div className="mb-6 w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.role}</h3>
              <div className="space-y-3">
                 <div className="flex gap-2 text-xs font-mono text-slate-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>ÖZELLEŞTİRİLMİŞ DASHBOARD</span>
                 </div>
                 <div className="flex gap-2 text-xs font-mono text-slate-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>ANLIK BİLDİRİMLER</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-slate-900/20 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-6">{t('workflow.title').toUpperCase()}</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto" />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 relative">
             {/* Connector lines on desktop */}
             <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
             
             {[1, 2, 3].map((step) => (
               <motion.div 
                 key={step} 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="flex flex-col items-center text-center px-12 relative z-10"
               >
                 <div className="w-20 h-20 rounded-full bg-slate-950 border-4 border-slate-900 flex items-center justify-center text-3xl font-black text-amber-500 mb-8 relative">
                   <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping" />
                   {step}
                 </div>
                 <h4 className="text-2xl font-bold mb-4 text-white uppercase">{t(`workflow.step${step}.title`)}</h4>
                 <p className="text-slate-500">{t(`workflow.step${step}.desc`)}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-5 h-5 bg-slate-950 -rotate-45" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase">Structra</span>
          </div>
          
          <div className="flex gap-12">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Platform</span>
                <Link href="/login" className="text-sm hover:text-amber-500 transition-colors">Login</Link>
                <Link href="#" className="text-sm hover:text-amber-500 transition-colors">Case Studies</Link>
             </div>
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Connect</span>
                <Link href="#" className="text-sm hover:text-amber-500 transition-colors">LinkedIn</Link>
                <Link href="#" className="text-sm hover:text-amber-500 transition-colors">Twitter</Link>
             </div>
          </div>
        </div>
        <div className="mt-24 text-center">
          <p className="text-slate-700 font-mono text-[10px] uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Structra Pro Ops. Engineering Better Workflows.
          </p>
        </div>
      </footer>
    </main>
  )
}
