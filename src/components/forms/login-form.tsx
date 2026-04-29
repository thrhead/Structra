"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Link from "next/link"
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
})

function NexusInput({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
}: {
  id: string
  type: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        style={{
          fontFamily: 'SFMono-Regular, ui-monospace, monospace',
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: '16px',
          letterSpacing: '1.2px',
          textTransform: 'uppercase' as const,
          color: focused ? '#ff5500' : '#FFFFFF',
          transition: 'color 150ms ease',
          display: 'block',
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(10, 10, 10, 0.6)',
            border: `1px solid ${focused ? '#ff5500' : error ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '4px',
            color: '#FFFFFF',
            fontSize: '14px',
            lineHeight: '22.75px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            boxShadow: focused ? '0 0 8px 0 rgba(255, 85, 0, 0.3)' : 'none',
          }}
          className="placeholder:text-white/30"
        />
        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: `translateX(-50%) scaleX(${focused ? 1 : 0})`,
            width: '100%',
            height: '1px',
            background: '#ff5500',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'center',
          }}
        />
      </div>
      {error && (
        <p
          style={{
            color: '#ef4444',
            fontSize: '12px',
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            letterSpacing: '0.5px',
            marginTop: '4px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

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
    <div
      style={{
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 4px 0 rgba(255, 85, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 85, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 85, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, #ff5500, transparent)',
        }}
      />

      {/* Corner accents mixed colors */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '1px solid #ef4444', borderLeft: '1px solid #ef4444' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '1px solid #ff5500', borderRight: '1px solid #ff5500' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '1px solid #ffffff', borderLeft: '1px solid #ffffff', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '1px solid #ff5500', borderRight: '1px solid #ff5500' }} />

      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '9999px',
            background: '#ff5500',
            boxShadow: '0 0 4px rgba(255, 85, 0, 0.3)',
            animation: 'pulse 2s ease infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Secure Connection
        </span>
      </div>

      {/* Header */}
      <div className="mb-10">
        {/* Mobile-only brand */}
        <p
          className="lg:hidden mb-3"
          style={{
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#ff5500',
          }}
        >
          Nexus Core
        </p>

        <h1
          className={outfit.className}
          style={{
            fontSize: '42px',
            fontWeight: 300,
            lineHeight: '42px',
            letterSpacing: '-0.05em',
            textTransform: 'uppercase' as const,
            color: '#FFFFFF',
            marginBottom: '12px',
          }}
        >
          Giriş
          <span style={{ color: '#ff5500' }}>.</span>
        </h1>

        <p
          style={{
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: '16px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            color: '#ff5500',
          }}
        >
          Hesabınıza giriş yapın
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              padding: '12px 16px',
              color: '#ef4444',
              fontSize: '13px',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <NexusInput
          id="email"
          type="email"
          label="E-posta"
          placeholder="ornek@sirket.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={isLoading}
        />

        <NexusInput
          id="password"
          type="password"
          label="Şifre"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          disabled={isLoading}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading ? 'rgba(255, 85, 0, 0.5)' : '#ff5500',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 150ms ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="group"
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'rgba(255, 85, 0, 0.85)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 85, 0, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#ff5500'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Giriş Yapılıyor...
            </span>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <p
          style={{
            fontSize: '14px',
            lineHeight: '22.75px',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Hesabınız yok mu?
        </p>
        <Link
          href="/register"
          style={{
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#ff5500',
            textDecoration: 'none',
            transition: 'color 150ms ease',
            borderBottom: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF'
            e.currentTarget.style.borderBottomColor = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#ff5500'
            e.currentTarget.style.borderBottomColor = 'transparent'
          }}
        >
          Kayıt Olun →
        </Link>
      </div>

      {/* Version tag */}
      <div
        className="mt-6 pt-6"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <p
          style={{
            fontFamily: 'SFMono-Regular, ui-monospace, monospace',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.15)',
            textAlign: 'center',
          }}
        >
          Structra v4.0 — Field Service Management
        </p>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
