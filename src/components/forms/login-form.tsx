"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bricolage_Grotesque } from 'next/font/google'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setErrors({ email: "", password: "" })

    // Basit validasyon
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "E-posta gereklidir" }))
      setIsLoading(false)
      return
    }
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: "Şifre gereklidir" }))
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("E-posta veya şifre hatalı")
        setIsLoading(false)
        return
      }

      // Başarılı giriş - kullanıcıyı rolüne göre yönlendir
      const session = await getSession();
      const role = session?.user?.role?.toLowerCase() || "";
      
      if (role) {
        router.push(`/${role}`)
      } else {
        router.push("/")
      }
      
      router.refresh()
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0A0A0A]/40 backdrop-blur-[4px] border border-white/20 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_8px_0_rgba(0,229,255,1)]">
      <div className="text-center mb-10">
        <h1 className={`${bricolage.className} text-[52px] font-light leading-none tracking-[-0.05em] uppercase text-white mb-2`}>
          Montaj Takip
        </h1>
        <p className="text-[#00E5FF] font-mono text-[12px] font-semibold tracking-[1.2px] uppercase">
          Hesabınıza giriş yapın
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-[4px] text-[14px] font-sans">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-[#FFFFFF] font-mono text-[12px] font-semibold tracking-[1.2px] uppercase">
            E-posta
          </label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@sirket.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            // @ts-ignore
            error={errors.email}
            disabled={isLoading}
            className="bg-transparent border border-white/20 text-white placeholder:text-white/40 rounded-[4px] focus-visible:ring-[#00E5FF] focus-visible:border-[#00E5FF] transition-colors font-sans text-[14px]"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[#FFFFFF] font-mono text-[12px] font-semibold tracking-[1.2px] uppercase">
            Şifre
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            // @ts-ignore
            error={errors.password}
            disabled={isLoading}
            className="bg-transparent border border-white/20 text-white placeholder:text-white/40 rounded-[4px] focus-visible:ring-[#00E5FF] focus-visible:border-[#00E5FF] transition-colors font-sans text-[14px]"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#00E5FF] text-[#000000] hover:bg-[#00E5FF]/80 rounded-[4px] py-[14px] h-auto font-mono text-[12px] font-semibold tracking-[1.2px] uppercase transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <div className="mt-8 text-center text-[14px] font-sans text-white/60">
        <p>
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-[#00E5FF] hover:text-white transition-colors duration-300 font-mono text-[12px] font-semibold tracking-[1.2px] uppercase ml-2">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  )
}

