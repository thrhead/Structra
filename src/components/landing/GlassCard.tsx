'use client'

import { useState, useEffect } from 'react'

export function GlassCard({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered) {
      window.dispatchEvent(new CustomEvent('cardHoverChange', { detail: true }))
    } else {
      window.dispatchEvent(new CustomEvent('cardHoverChange', { detail: false }))
    }
  }, [hovered])

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `0.8px solid ${hovered ? 'rgba(0, 240, 255, 0.35)' : '#262626'}`,
        borderRadius: '32px',
        boxShadow: hovered
          ? 'rgba(0,0,0,0.5) 0px 0px 40px 0px inset, 0 0 30px rgba(0, 240, 255, 0.08)'
          : 'rgba(0,0,0,0.5) 0px 0px 40px 0px inset',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
