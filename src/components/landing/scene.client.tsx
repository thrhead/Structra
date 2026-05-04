// @ts-nocheck
'use client'

import { useEffect, useRef, useCallback } from 'react'

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const targetDistRef = useRef(9999)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY

    let minDist = 9999
    // Find distance to the nearest clickable/interactive element
    const targets = document.querySelectorAll('a, button, [role="button"], .glass-card, .workflow-circle')
    for (let i = 0; i < targets.length; i++) {
      const rect = targets[i].getBoundingClientRect()
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) minDist = dist
    }
    targetDistRef.current = minDist
  }, [])

  useEffect(() => {
    // No need for cardHoverChange events anymore, we track spatial distance directly!
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0, height = 0, animFrameId: number
    let cardHoverFactor = 0

    interface Point { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number }
    interface Triangle { p0: number; p1: number; p2: number }

    let points: Point[] = []
    let triangles: Triangle[] = []

    const COLS = 48, ROWS = 30, MOUSE_RADIUS = 140
    const TEAR_FORCE = 10, RETURN_SPEED = 0.04, FRICTION = 0.9

    function buildMesh() {
      points = []; triangles = []
      const cellW = width / (COLS - 1), cellH = height / (ROWS - 1)
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const edge = row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1
          const jX = edge ? 0 : (Math.random() - 0.5) * cellW * 0.45
          const jY = edge ? 0 : (Math.random() - 0.5) * cellH * 0.45
          const x = col * cellW + jX, y = row * cellH + jY
          points.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 })
        }
      }
      for (let row = 0; row < ROWS - 1; row++) {
        for (let col = 0; col < COLS - 1; col++) {
          const i = row * COLS + col
          if ((row + col) % 2 === 0) {
            triangles.push({ p0: i, p1: i + 1, p2: i + COLS })
            triangles.push({ p0: i + 1, p1: i + COLS + 1, p2: i + COLS })
          } else {
            triangles.push({ p0: i, p1: i + 1, p2: i + COLS + 1 })
            triangles.push({ p0: i, p1: i + COLS + 1, p2: i + COLS })
          }
        }
      }
    }

    function resize() {
      width = window.innerWidth; height = window.innerHeight
      canvas!.width = width; canvas!.height = height
      buildMesh()
    }

    // Maps a color based strictly on the spatial distance to the nearest clickable element!
    // distM = distance of point from mouse
    // targetDist = distance of mouse from nearest button
    function getColorForDistance(distM: number, targetDist: number, isDot: boolean = false) {
      const normalProxRange = isDot ? (MOUSE_RADIUS * 1.5) : (MOUSE_RADIUS * 2.5);
      const prox = Math.max(0, 1 - distM / normalProxRange);
      
      // Far color is ALWAYS Yellow/Amber
      const farR = 245, farG = 158, farB = 11;
      
      // Calculate Near color based on distance from nearest button (targetDist)
      let nearR, nearG, nearB;
      if (targetDist < 80) {
        // 0 to 80px: Red (at 0) to Orange (at 80)
        const t = targetDist / 80;
        nearR = 239 + (249 - 239) * t;
        nearG = 68 + (115 - 68) * t;
        nearB = 68 + (22 - 68) * t;
      } else if (targetDist < 250) {
        // 80 to 250px: Orange to White
        const t = (targetDist - 80) / 170;
        nearR = 249 + (255 - 249) * t;
        nearG = 115 + (255 - 115) * t;
        nearB = 22 + (255 - 22) * t;
      } else {
        // > 250px: White (Normal state)
        nearR = 255; nearG = 255; nearB = 255;
      }

      // Interpolate based on point's distance from mouse
      const r = Math.round(farR + (nearR - farR) * prox);
      const g = Math.round(farG + (nearG - farG) * prox);
      const b = Math.round(farB + (nearB - farB) * prox);

      return { r, g, b };
    }

    function animate() {
      animFrameId = requestAnimationFrame(animate)
      ctx!.clearRect(0, 0, width, height)
      const mx = mouseRef.current.x, my = mouseRef.current.y
      
      // We read the true spatial distance to the nearest button
      const targetDist = targetDistRef.current


      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * TEAR_FORCE
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force; p.vy += Math.sin(angle) * force
        }
        p.vx += (p.baseX - p.x) * RETURN_SPEED; p.vy += (p.baseY - p.y) * RETURN_SPEED
        p.vx *= FRICTION; p.vy *= FRICTION
        p.x += p.vx; p.y += p.vy
      }

      for (let i = 0; i < triangles.length; i++) {
        const tri = triangles[i]
        const a = points[tri.p0], b = points[tri.p1], c = points[tri.p2]
        const cx = (a.x + b.x + c.x) / 3, cy = (a.y + b.y + c.y) / 3
        const distM = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2)

        const dispA = Math.sqrt((a.x - a.baseX) ** 2 + (a.y - a.baseY) ** 2)
        const dispB = Math.sqrt((b.x - b.baseX) ** 2 + (b.y - b.baseY) ** 2)
        const dispC = Math.sqrt((c.x - c.baseX) ** 2 + (c.y - c.baseY) ** 2)
        const avgDisp = (dispA + dispB + dispC) / 3

        let alpha = 0.06 + Math.min(avgDisp * 0.012, 0.35)
        if (distM < MOUSE_RADIUS * 1.8) alpha += (1 - distM / (MOUSE_RADIUS * 1.8)) * 0.25
        alpha = Math.min(alpha, 0.55)

        const { r, g, b: bC } = getColorForDistance(distM, targetDist, false)

        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.lineTo(c.x, c.y)
        ctx!.closePath()
        ctx!.strokeStyle = `rgba(${r}, ${g}, ${bC}, ${alpha})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()

        if (avgDisp > 2) {
          ctx!.fillStyle = `rgba(255, 255, 255, ${Math.min(avgDisp * 0.003, 0.06)})`
          ctx!.fill()
        }
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const disp = Math.sqrt((p.x - p.baseX) ** 2 + (p.y - p.baseY) ** 2)
        const dM = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2)
        if (disp > 1.5 || dM < MOUSE_RADIUS) {
          const prox = Math.max(0, 1 - dM / (MOUSE_RADIUS * 1.5))
          const dotAlpha = Math.min(0.1 + disp * 0.015 + prox * 0.3, 0.6)
          
          const { r: dr, g: dg, b: db } = getColorForDistance(dM, targetDist, true)
          
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, 0.8 + Math.min(disp * 0.04, 1.5), 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${dotAlpha})`
          ctx!.fill()
        }
      }
    }

    resize(); animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  )
}
