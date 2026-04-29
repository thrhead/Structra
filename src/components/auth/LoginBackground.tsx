// @ts-nocheck
"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 1000 // Dot matrix particle field size
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Create positions and initial data for instances
  const particles = useMemo(() => {
    const temp = []
    const range = 50
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      // Save initial positions and random phase for breathing effect
      temp.push({ x, y, z, phase: Math.random() * Math.PI * 2 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Pointer parallax drift
    const mx = (state.pointer.x * 2) // subtle drift
    const my = (state.pointer.y * 2)

    // Slow orbital drift of the entire system
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05
      meshRef.current.rotation.x = time * 0.02
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mx, 0.05)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, my, 0.05)
    }

    particles.forEach((particle, i) => {
      // Breathing pulse (slow scale oscillation)
      const scale = 1 + Math.sin(time * 0.5 + particle.phase) * 0.5

      dummy.position.set(particle.x, particle.y, particle.z)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Box geometry as requested */}
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial 
        color="#00E5FF" 
        emissive="#00E5FF" 
        emissiveIntensity={0.5} 
        transparent 
        opacity={0.8} 
        roughness={0.2} 
        metalness={0.8}
      />
    </instancedMesh>
  )
}

export function LoginBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] -z-10 overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true }}
      >
        <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={20} />
        
        {/* Ambient + directional + point lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#00E5FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0A3BFF" />
        
        <ParticleField />
        
        {/* Soft depth fade using fog */}
        <fog attach="fog" args={['#0A0A0A', 20, 60]} />
      </Canvas>
    </div>
  )
}
