// @ts-nocheck
"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function LoginBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene()
    
    // Isometric Camera setup
    const aspect = window.innerWidth / window.innerHeight
    const d = 10;
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    )
    camera.position.set(20, 20, 20)
    camera.lookAt(scene.position)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Lighting: ambient + directional + point
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00E5FF, 1.2)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x0A3BFF, 2, 50)
    pointLight.position.set(-10, 10, -10)
    scene.add(pointLight)

    // Geometry & Materials
    const group = new THREE.Group()
    scene.add(group)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    
    // Create a technical, retro-futurist grid of boxes
    const gridSize = 6
    const spacing = 1.2
    const offset = (gridSize * spacing) / 2 - (spacing / 2)

    const material = new THREE.MeshStandardMaterial({
      color: 0x00E5FF,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
      wireframe: true // Retro-futurist wireframe accent
    })

    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x002233,
    })

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          // Sparse spacing: skip some boxes
          if (Math.random() > 0.3) continue;

          const useWireframe = Math.random() > 0.4
          const mesh = new THREE.Mesh(geometry, useWireframe ? material : solidMaterial)
          
          mesh.position.set(
            x * spacing - offset,
            y * spacing - offset,
            z * spacing - offset
          )
          
          // Random scaling for technical look
          const scale = 0.2 + Math.random() * 0.8
          mesh.scale.set(scale, scale, scale)
          
          group.add(mesh)
        }
      }
    }

    // Animation
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Slow orbital drift
      group.rotation.y = time * 0.1
      group.rotation.x = Math.sin(time * 0.05) * 0.1
      group.position.y = Math.sin(time * 0.2) * 0.5

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight
      camera.left = -d * aspect
      camera.right = d * aspect
      camera.top = d
      camera.bottom = -d
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      solidMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] -z-10 overflow-hidden">
      {/* Fallback pattern / background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00E5FF11_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF11_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div id="webgl-container" ref={mountRef} className="w-full h-full relative z-10" />
    </div>
  )
}
