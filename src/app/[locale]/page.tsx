import { Link } from "@/lib/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import {
  ArrowRight, Layers, ShieldCheck, Activity,
  Smartphone, Globe, CloudOff, CheckCircle2,
  MapPin, Camera, Zap, Eye, BarChart3, Box
} from 'lucide-react'
import * as motion from 'framer-motion/client'

export const runtime = 'nodejs'

const HeroScene = dynamic(
  () => import('@/components/landing/scene.client').then(mod => mod.HeroScene),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-[#050505] -z-10" /> }
)

import { GlassCard } from '@/components/landing/GlassCard'
import { WorkflowCircle } from '@/components/landing/WorkflowCircle'
import { HoverLink } from '@/components/landing/HoverLink'

// Design tokens from landing-page-design.md
const T = {
  bg: '#050505',
  accent: '#00F0FF',
  green: '#00FF41',
  border: '#262626',
  textPrimary: '#737373',
  textSecondary: '#FFFFFF',
  radius: '32px',
  pill: '9999px',
} as const

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return {
    title: `Structra | ${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  }
}

export default async function HomePage() {
  let session = null
  try { session = await auth() } catch {}
  const t = await getTranslations('Home')
  const t_nav = await getTranslations('Navigation')

  const features = [
    { icon: <Activity className="w-5 h-5" />, title: 'Gerçek Zamanlı Takip', desc: 'Saha ekiplerinin konumunu ve iş durumunu anlık izleyin.' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Dijital Doğrulama', desc: 'Her adım fotoğraf ve GPS ile kanıtlanır.' },
    { icon: <BarChart3 className="w-5 h-5" />, title: 'Maliyet Analizi', desc: 'İş bazlı maliyet ve karlılık raporları.' },
    { icon: <CloudOff className="w-5 h-5" />, title: 'Çevrimdışı Mod', desc: 'İnternet olmadan bile kesintisiz çalışma.' },
  ]

  const roles = [
    { role: 'SAHA EKİBİ', icon: <Smartphone className="w-6 h-6" />, desc: 'Mobil uygulama ile sahada görev takibi, 3D montaj rehberi ve çevrimdışı çalışma.', items: ['3D Montaj Kılavuzu', 'Fotoğraflı Kanıt', 'Çevrimdışı Senkronizasyon'] },
    { role: 'YÖNETİCİ', icon: <Layers className="w-6 h-6" />, desc: 'Tüm operasyonu kuş bakışı izleyin. Ekipleri yönetin, maliyetleri kontrol edin.', items: ['Gerçek Zamanlı Dashboard', 'Maliyet Onay Sistemi', 'Performans Raporları'] },
    { role: 'MÜŞTERİ', icon: <Eye className="w-6 h-6" />, desc: 'İşlerinizin hangi aşamada olduğunu şeffaf şekilde takip edin.', items: ['İş Durumu Takibi', 'Anlık Bildirimler', 'Dijital Raporlar'] },
  ]

  const steps = [
    { num: '01', title: t('workflow.step1.title'), desc: t('workflow.step1.desc') },
    { num: '02', title: t('workflow.step2.title'), desc: t('workflow.step2.desc') },
    { num: '03', title: t('workflow.step3.title'), desc: t('workflow.step3.desc') },
  ]

  return (
    <main style={{ background: T.bg, fontFamily: 'Inter, sans-serif' }} className="min-h-screen text-white overflow-x-hidden">
      <HeroScene />

      {/* ═══ NAVIGATION ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center" style={{
          background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: `0.8px solid ${T.border}`, borderRadius: T.pill, padding: '8px 24px',
        }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.accent }}>
              <Box className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white uppercase">Structra</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[{ label: 'Özellikler', id: 'ozellikler' }, { label: 'Roller', id: 'roller' }, { label: 'İş Akışı', id: 'is-akisi' }].map(item => (
              <HoverLink key={item.id} href={`#${item.id}`}
                className="text-sm transition-colors text-[#737373] hover:text-[#00F0FF]">
                {item.label}
              </HoverLink>
            ))}
          </div>
          {session ? (
            <HoverLink href={`/${session.user.role.toLowerCase()}`}
              className="text-xs font-medium uppercase tracking-wider px-5 py-2 transition-opacity hover:opacity-80"
              style={{ background: T.textSecondary, color: '#000', borderRadius: T.pill }}>
              {t_nav('dashboard')}
            </HoverLink>
          ) : (
            <HoverLink href="/login"
              className="text-xs font-medium uppercase tracking-wider px-5 py-2 transition-opacity hover:opacity-80"
              style={{ background: T.textSecondary, color: '#000', borderRadius: T.pill }}>
              {t('loginButton')}
            </HoverLink>
          )}
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 z-10">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10"
            style={{ border: `0.8px solid ${T.border}`, borderRadius: T.pill, background: 'rgba(0,240,255,0.05)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: T.accent }}>
              Operasyon Konsolu v4.0
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="uppercase leading-[0.9] tracking-[-0.05em] mb-10"
            style={{ fontSize: 'clamp(48px, 10vw, 121.6px)', fontWeight: 500, lineHeight: '1', color: T.textSecondary }}>
            {t('title')} <br />
            <span style={{ color: T.accent }}>{t('subtitle')}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="max-w-xl mb-12" style={{ fontSize: '18px', fontWeight: 300, lineHeight: '28px', color: T.textPrimary }}>
            {t('description')}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4">
            <HoverLink href="/login" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium uppercase tracking-wider transition-opacity hover:opacity-80"
              style={{ background: T.textSecondary, color: '#000', borderRadius: T.pill }}>
              Hemen Başla <ArrowRight className="w-4 h-4" />
            </HoverLink>
            <HoverLink href="#ozellikler" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:text-white"
              style={{ border: `0.8px solid ${T.border}`, borderRadius: T.pill, color: T.textPrimary }}>
              Keşfet
            </HoverLink>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="ozellikler" className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>
              Neden Structra?
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-medium uppercase tracking-[-0.04em]" style={{ color: T.textSecondary }}>
              {t('trust.title')}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-8 h-full group" style={{ borderRadius: T.radius }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ border: `0.8px solid ${T.border}`, color: T.accent }}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-medium mb-2" style={{ color: T.textSecondary }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.textPrimary }}>{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-12 max-w-2xl mx-auto" style={{ fontSize: '18px', fontWeight: 300, lineHeight: '28px', color: T.textPrimary }}>
            {t('trust.description')}
          </motion.p>
        </div>
      </section>

      {/* ═══ ROLES SECTION ═══ */}
      <section id="roller" className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>
              Rol Bazlı Deneyim
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-medium uppercase tracking-[-0.04em] mb-4" style={{ color: T.textSecondary }}>
              Herkes İçin Bir Arayüz
            </motion.h2>
            <p className="max-w-xl mx-auto" style={{ color: T.textPrimary, fontSize: '18px', fontWeight: 300 }}>
              Şirketinizin her kademesindeki çalışanlar için optimize edilmiş deneyimler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {roles.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ border: `0.8px solid ${T.border}`, color: T.accent }}>
                    {r.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2 uppercase tracking-wide" style={{ color: T.textSecondary }}>{r.role}</h3>
                  <p className="text-sm mb-6" style={{ color: T.textPrimary }}>{r.desc}</p>
                  <div className="space-y-3">
                    {r.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: T.green }} />
                        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: T.textPrimary }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-2 overflow-hidden">
            <div style={{ background: '#0A0A0A', borderRadius: '28px', overflow: 'hidden' }}>
              {/* Window chrome */}
              <div className="flex items-center px-5 py-3 gap-4" style={{ borderBottom: `0.8px solid ${T.border}` }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
                </div>
                <div className="h-3 rounded-full w-24" style={{ background: '#1a1a1a' }} />
              </div>
              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'AKTİF İŞLER', val: '24', accent: T.accent },
                  { label: 'SAHA EKİBİ', val: '12', accent: T.green },
                  { label: 'TAMAMLANAN', val: '156', accent: '#FFFFFF' },
                  { label: 'AYLIK MALİYET', val: '₺42.5K', accent: T.accent },
                ].map((card, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: '#111', border: `0.8px solid ${T.border}` }}>
                    <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: T.textPrimary }}>{card.label}</div>
                    <div className="text-2xl font-medium" style={{ color: card.accent }}>{card.val}</div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="rounded-xl p-4" style={{ background: '#111', border: `0.8px solid ${T.border}` }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: T.textPrimary }}>İŞ İLERLEMESİ</span>
                    <span className="text-[10px] font-medium" style={{ color: T.accent }}>85%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${T.green}, ${T.accent})` }} />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══ WORKFLOW SECTION ═══ */}
      <section id="is-akisi" className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] mb-4" style={{ color: T.accent }}>
              Süreç
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-medium uppercase tracking-[-0.04em]" style={{ color: T.textSecondary }}>
              {t('workflow.title').toUpperCase()}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-px" style={{ background: T.border }} />

            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center relative z-10">
                <WorkflowCircle num={s.num} />
                <h4 className="text-lg font-medium mb-3 uppercase tracking-wide" style={{ color: T.textSecondary }}>{s.title}</h4>
                <p className="text-sm max-w-xs" style={{ color: T.textPrimary }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-[-0.03em] mb-4" style={{ color: T.textSecondary }}>
              Operasyonunuzu Dijitalleştirin
            </h2>
            <p className="mb-10 max-w-lg mx-auto" style={{ color: T.textPrimary, fontSize: '18px', fontWeight: 300, lineHeight: '28px' }}>
              Structra ile saha operasyonlarınızı uçtan uca yönetin. Hemen ücretsiz deneyin.
            </p>
            <HoverLink href="/login" className="inline-flex items-center gap-2 px-10 py-3 text-sm font-medium uppercase tracking-wider transition-all hover:opacity-80"
              style={{ background: T.accent, color: '#000', borderRadius: T.pill, boxShadow: `0 0 20px rgba(0, 240, 255, 0.3)` }}>
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </HoverLink>
          </GlassCard>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 py-16 px-6 md:px-12 lg:px-24" style={{ borderTop: `0.8px solid ${T.border}` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.accent }}>
              <Box className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-sm tracking-tight uppercase" style={{ color: T.textSecondary }}>Structra</span>
          </div>
          <div className="flex gap-10">
            {[{ label: 'Platform', links: [{ name: 'Giriş', href: '/login' }, { name: 'Özellikler', href: '#ozellikler' }] },
              { label: 'İletişim', links: [{ name: 'LinkedIn', href: '#' }, { name: 'Twitter', href: '#' }] }
            ].map(col => (
              <div key={col.label} className="flex flex-col gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: T.textPrimary }}>{col.label}</span>
                {col.links.map(l => (
                  <HoverLink key={l.name} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: T.textPrimary }}>{l.name}</HoverLink>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: '#333' }}>
            © {new Date().getFullYear()} Structra — Saha Servis Yönetim Platformu
          </p>
        </div>
      </footer>
    </main>
  )
}
