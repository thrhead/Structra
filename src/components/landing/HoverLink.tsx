'use client'

import React from 'react'
import { useRouter } from '@/lib/navigation'

export function HoverLink({
  children,
  href,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  href: string
  className?: string
  style?: React.CSSProperties
}) {
  const router = useRouter()

  const handleEnter = () => {
    window.dispatchEvent(new CustomEvent('cardHoverChange', { detail: true }))
  }
  const handleLeave = () => {
    window.dispatchEvent(new CustomEvent('cardHoverChange', { detail: false }))
  }

  const isHash = href.startsWith('#')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHash) {
      e.preventDefault()
      // Use next-intl's router for correct locale routing
      router.push(href as any)
    }
  }

  return (
    <a 
      href={href} 
      className={className} 
      style={style}
      onMouseEnter={handleEnter} 
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
