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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Particles
    const count = 1000
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const material = new THREE.MeshStandardMaterial({
      color: "#00E5FF",
      emissive: "#00E5FF",
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    })

    const mesh = new THREE.InstancedMesh(geometry, material, count)
    const dummy = new THREE.Object3D()
    const particles = []
    const range = 50

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      const phase = Math.random() * Math.PI * 2
      particles.push({ x, y, z, phase })
      
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    scene.add(mesh)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight("#00E5FF", 1.5)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight("#0A3BFF", 1)
    pointLight.position.set(-10, -10, -10)
    scene.add(pointLight)

    scene.fog = new THREE.Fog('#0A0A0A', 20, 60)

    // Animation
    let animationFrameId
    const clock = new THREE.Clock()
    const mouse = new THREE.Vector2()

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      mesh.rotation.y = time * 0.05
      mesh.rotation.x = time * 0.02
      
      const targetX = mouse.x * 5
      const targetY = mouse.y * 5
      mesh.position.x += (targetX - mesh.position.x) * 0.05
      mesh.position.y += (targetY - mesh.position.y) * 0.05

      for (let i = 0; i < count; i++) {
        const particle = particles[i]
        const scale = 1 + Math.sin(time * 0.5 + particle.phase) * 0.5
        dummy.position.set(particle.x, particle.y, particle.z)
        dummy.scale.set(scale, scale, scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
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
      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}
