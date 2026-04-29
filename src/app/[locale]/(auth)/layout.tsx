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
    <div className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      <LoginBackground />
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
