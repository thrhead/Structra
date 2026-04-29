import { LoginBackground } from "@/components/auth/LoginBackground"

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
