import dynamic from 'next/dynamic'

const LoginBackground = dynamic(
  () => import("@/components/auth/LoginBackground").then(mod => mod.LoginBackground),
  { ssr: false }
)

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Full page grid floor background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 85, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 85, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2-Panel Layout */}
      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{ zIndex: 1 }}>

        {/* LEFT PANEL: 3D Scene — fills the entire left half */}
        <div className="hidden lg:block relative" style={{ minHeight: '100vh' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <LoginBackground />
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 relative">
          {/* Mobile fallback: show 3D behind form on small screens */}
          <div className="lg:hidden absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
            <LoginBackground />
          </div>
          <div className="w-full max-w-md relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          zIndex: 20,
          background: 'linear-gradient(to right, transparent, rgba(255, 85, 0, 0.3), transparent)',
        }}
      />
    </div>
  )
}
