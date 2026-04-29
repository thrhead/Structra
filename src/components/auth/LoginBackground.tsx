// @ts-nocheck
"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function LoginBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    
    // Orthographic Camera
    const aspect = window.innerWidth / window.innerHeight
    const frustumSize = 20
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    )
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Dot-matrix Particles
    const count = 2500
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const initialPositions = new Float32Array(count * 3)
    
    const range = 40
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range * aspect
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * 10
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      initialPositions[i * 3] = x
      initialPositions[i * 3 + 1] = y
      initialPositions[i * 3 + 2] = z
      
      phases[i] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: "#00E5FF",
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Animation
    let animationFrameId
    const clock = new THREE.Clock()
    const mouse = new THREE.Vector2()

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Breathing pulse
      material.opacity = 0.4 + Math.sin(time * 0.5) * 0.2
      material.size = 0.04 + Math.sin(time * 0.5) * 0.01

      // Subtle pointer-reactive drift
      const positionsAttr = geometry.attributes.position
      for (let i = 0; i < count; i++) {
        const ix = i * 3
        const iy = i * 3 + 1
        
        // Initial pos + drift
        const driftX = Math.sin(time * 0.2 + phases[i]) * 0.1
        const driftY = Math.cos(time * 0.2 + phases[i]) * 0.1
        
        // Pointer influence
        const dx = initialPositions[ix] - (mouse.x * 2)
        const dy = initialPositions[iy] - (mouse.y * 2)
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / 5)
        
        positionsAttr.array[ix] = initialPositions[ix] + driftX + (mouse.x * influence * 0.5)
        positionsAttr.array[iy] = initialPositions[iy] + driftY + (mouse.y * influence * 0.5)
      }
      positionsAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight
      camera.left = frustumSize * aspect / -2
      camera.right = frustumSize * aspect / 2
      camera.top = frustumSize / 2
      camera.bottom = frustumSize / -2
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] -z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00E5FF11_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF11_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div ref={mountRef} className="w-full h-full relative z-10" />
    </div>
  )
}

