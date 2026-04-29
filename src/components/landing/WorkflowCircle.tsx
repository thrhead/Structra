'use client'

import { useState, useEffect } from 'react'

export function WorkflowCircle({ num }: { num: string }) {
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 500,
        background: hovered ? 'rgba(0, 240, 255, 0.1)' : '#050505',
        border: `0.8px solid ${hovered ? 'rgba(0, 240, 255, 0.6)' : '#262626'}`,
        color: hovered ? '#FFFFFF' : '#00F0FF',
        boxShadow: hovered
          ? '0 0 20px rgba(0, 240, 255, 0.25), 0 0 60px rgba(0, 240, 255, 0.1), inset 0 0 20px rgba(0, 240, 255, 0.08)'
          : '0 0 20px rgba(0, 240, 255, 0.1)',
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        marginBottom: '32px',
      }}
    >
      {/* Pulse ring on hover */}
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          animation: 'pulse-ring 1.5s ease-out infinite',
        }} />
      )}
      {num}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
