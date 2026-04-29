// @ts-nocheck
"use client"

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

export function LoginBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    // ─── Scene ────────────────────────────────────────
    const scene = new THREE.Scene()

    // ─── Isometric Orthographic Camera ────────────────
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    const aspect = w / h
    const d = 12
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 1000
    )
    camera.position.set(18, 14, 18)
    camera.lookAt(0, 1, 0)

    // ─── Renderer: alpha + antialias ──────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ─── Lighting: ambient + directional + points ─────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xff0000, 0.4)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    const coreGlow = new THREE.PointLight(0xff3300, 1.5, 15)
    coreGlow.position.set(0, 3, 0)
    scene.add(coreGlow)

    const secondaryGlow = new THREE.PointLight(0xffffff, 0.8, 30)
    secondaryGlow.position.set(-8, 6, -8)
    scene.add(secondaryGlow)

    // ═══════════════════════════════════════════════════
    // GRID FLOOR
    // ═══════════════════════════════════════════════════
    const gridSize = 40
    const gridDivisions = 40
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xef4444, 0xef4444)
    gridHelper.material.opacity = 0.03
    gridHelper.material.transparent = true
    gridHelper.position.y = -0.01
    scene.add(gridHelper)

    // Extra finer grid
    const fineGrid = new THREE.GridHelper(gridSize, gridDivisions * 2, 0xffffff, 0xffffff)
    fineGrid.material.opacity = 0.01
    fineGrid.material.transparent = true
    fineGrid.position.y = -0.02
    scene.add(fineGrid)

    // ═══════════════════════════════════════════════════
    // PLATFORM BASE — Stepped CPU/chip platform
    // ═══════════════════════════════════════════════════
    const platformGroup = new THREE.Group()
    scene.add(platformGroup)

    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d0d,
      roughness: 0.15,
      metalness: 0.95,
      transparent: true,
      opacity: 0.92,
    })

    const platformEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x151515,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    })

    // Tier 1 — largest base
    const tier1 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 10),
      platformMat
    )
    tier1.position.y = 0.2
    platformGroup.add(tier1)

    // Tier 1 edge glow
    const tier1Edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(tier1.geometry),
      new THREE.LineBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.15 })
    )
    tier1Edge.position.copy(tier1.position)
    platformGroup.add(tier1Edge)

    // Tier 2 — middle step
    const tier2 = new THREE.Mesh(
      new THREE.BoxGeometry(7.5, 0.5, 7.5),
      platformEdgeMat
    )
    tier2.position.y = 0.65
    platformGroup.add(tier2)

    const tier2Edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(tier2.geometry),
      new THREE.LineBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.2 })
    )
    tier2Edge.position.copy(tier2.position)
    platformGroup.add(tier2Edge)

    // Tier 3 — top platform
    const tier3 = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.3, 5.5),
      platformMat
    )
    tier3.position.y = 1.05
    platformGroup.add(tier3)

    const tier3Edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(tier3.geometry),
      new THREE.LineBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.25 })
    )
    tier3Edge.position.copy(tier3.position)
    platformGroup.add(tier3Edge)

    // ═══════════════════════════════════════════════════
    // CENTRAL CORE — Glowing cyan cube
    // ═══════════════════════════════════════════════════
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.9,
    })

    const coreGeo = new THREE.BoxGeometry(1.8, 1.2, 1.8)
    const coreCube = new THREE.Mesh(coreGeo, coreMat)
    coreCube.position.y = 2.0
    platformGroup.add(coreCube)

    // Core wireframe overlay
    const coreWireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
    )
    coreWireframe.position.copy(coreCube.position)
    platformGroup.add(coreWireframe)

    // Core inner glow plane (additive)
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      glowPlaneMat
    )
    glowPlane.rotation.x = -Math.PI / 2
    glowPlane.position.y = 1.25
    platformGroup.add(glowPlane)

    // ═══════════════════════════════════════════════════
    // WIREFRAME RINGS — Cylindrical wireframe around core
    // ═══════════════════════════════════════════════════
    const ringGroup = new THREE.Group()
    ringGroup.position.y = 2.5
    platformGroup.add(ringGroup)

    // Ring 1 — outer
    const ringGeo1 = new THREE.CylinderGeometry(3.2, 3.2, 2.2, 32, 4, true)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat)
    ringGroup.add(ring1)

    // Ring 2 — inner, positioned above outer ring
    const ringGeo2 = new THREE.CylinderGeometry(2.6, 2.6, 1.6, 24, 3, true)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.position.y = 2
    ringGroup.add(ring2)

    // Ring edge accents — horizontal ring lines
    const torusGeo = new THREE.TorusGeometry(3.2, 0.015, 4, 64)
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.35,
    })

    const torusTop = new THREE.Mesh(torusGeo, torusMat)
    torusTop.position.y = 1.1
    torusTop.rotation.x = Math.PI / 2
    ringGroup.add(torusTop)

    const torusBot = new THREE.Mesh(torusGeo.clone(), torusMat.clone())
    torusBot.position.y = -1.1
    torusBot.rotation.x = Math.PI / 2
    ringGroup.add(torusBot)

    const torusMid = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.01, 4, 64),
      new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.2 })
    )
    torusMid.rotation.x = Math.PI / 2
    ringGroup.add(torusMid)

    // ═══════════════════════════════════════════════════
    // DATA BLOCKS — Small cyan bars on the platform
    // ═══════════════════════════════════════════════════
    const dataBlockMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff5500,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.8,
    })

    for (let i = 0; i < 4; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.25, 0.25),
        dataBlockMat
      )
      block.position.set(1.2 + i * 0.7, 1.05, 2.2)
      platformGroup.add(block)

      // Block wireframe
      const blockEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(block.geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
      )
      blockEdge.position.copy(block.position)
      platformGroup.add(blockEdge)
    }

    // Left side data blocks
    for (let i = 0; i < 2; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.5),
        dataBlockMat.clone()
      )
      block.position.set(-2.5, 1.05, 1 + i * 0.7)
      block.material.emissiveIntensity = 0.3
      platformGroup.add(block)
    }

    // ═══════════════════════════════════════════════════
    // SATELLITE CUBES — Floating wireframe cubes orbiting
    // ═══════════════════════════════════════════════════
    const satellites: {
      mesh: THREE.Group
      angle: number
      radius: number
      speed: number
      height: number
      bobPhase: number
    }[] = []

    // 6 cubes, evenly spaced (60° = π/3 apart), orbit around the ring
    const satCount = 6
    const satPositions = Array.from({ length: satCount }, (_, i) => ({
      angle: (Math.PI / 6) + i * (Math.PI * 2 / satCount),
      radius: 4.2,   // close to ring radius (3.2) so they pass behind it
      height: 2.5,   // same Y as ringGroup to orbit around it
      speed: 0.22,
    }))

    satPositions.forEach(({ angle, radius, height, speed }) => {
      const satGroup = new THREE.Group()

      // Inner solid cube
      const innerCube = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xef4444,
          emissiveIntensity: 0.4,
          roughness: 0.1,
          metalness: 0.7,
        })
      )
      satGroup.add(innerCube)

      // Outer wireframe cage
      const outerCube = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 0.7, 0.7)),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
      )
      satGroup.add(outerCube)

      satGroup.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )

      scene.add(satGroup)
      satellites.push({
        mesh: satGroup,
        angle,
        radius,
        speed,
        height,
        bobPhase: Math.random() * Math.PI * 2,
      })
    })

    // ═══════════════════════════════════════════════════
    // LABEL — "Logic Core / Main Processor" tooltip
    // ═══════════════════════════════════════════════════
    const labelGroup = new THREE.Group()
    labelGroup.position.set(0, 5.5, 0)
    platformGroup.add(labelGroup)

    // Lead line from core to label
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.8, 0),
      new THREE.Vector3(0, 0, 0),
    ])
    const leadLine = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.4 })
    )
    labelGroup.add(leadLine)

    // Label background — using a canvas texture for crisp text
    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 256
    labelCanvas.height = 96
    const ctx = labelCanvas.getContext('2d')!

    // Background
    ctx.fillStyle = 'rgba(10, 10, 10, 0.85)'
    ctx.fillRect(0, 0, 256, 96)

    // Border
    ctx.strokeStyle = 'rgba(255, 85, 0, 0.5)'
    ctx.lineWidth = 1
    ctx.strokeRect(1, 1, 254, 94)

    // Title text
    ctx.fillStyle = '#ff5500'
    ctx.font = '600 16px SFMono-Regular, Consolas, monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Logic Core', 128, 38)

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '400 12px SFMono-Regular, Consolas, monospace'
    ctx.fillText('Main Processor', 128, 62)

    const labelTexture = new THREE.CanvasTexture(labelCanvas)
    labelTexture.minFilter = THREE.LinearFilter
    labelTexture.magFilter = THREE.LinearFilter

    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.05),
      new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
    labelGroup.add(labelMesh)

    // ═══════════════════════════════════════════════════
    // DOT-MATRIX PARTICLE FIELD (background atmosphere)
    // ═══════════════════════════════════════════════════
    const particleCount = 800
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = Math.random() * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      phases[i] = Math.random() * Math.PI * 2
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff5500) },
      },
      vertexShader: `
        attribute float aPhase;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          float breathe = sin(uTime * 0.5 + aPhase) * 0.5 + 0.5;
          vAlpha = 0.1 + breathe * 0.3;

          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;

          // Depth fade
          float dist = length(mvPos.xyz);
          float fade = smoothstep(60.0, 5.0, dist);
          vAlpha *= fade;

          gl_PointSize = (1.5 + breathe) * (200.0 / max(-mvPos.z, 1.0));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ═══════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════
    let animationFrameId: number
    const clock = new THREE.Clock()
    const baseCamX = camera.position.x
    const baseCamZ = camera.position.z

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // ── Rings rotate slowly ──
      ringGroup.rotation.y = t * 0.3
      ring2.rotation.y = -t * 0.15

      // ── Core breathing pulse ──
      const coreBreath = Math.sin(t * 0.8) * 0.1 + 1.0
      coreCube.scale.set(coreBreath, coreBreath, coreBreath)
      coreMat.emissiveIntensity = 0.5 + Math.sin(t * 0.8) * 0.3
      coreGlow.intensity = 3 + Math.sin(t * 0.8) * 1.5

      // ── Glow plane pulse ──
      glowPlaneMat.opacity = 0.1 + Math.sin(t * 0.6) * 0.05

      // ── Satellites orbit + bob ──
      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.008
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius
        sat.mesh.position.y = sat.height + Math.sin(t * 0.5 + sat.bobPhase) * 0.3
        sat.mesh.rotation.y = t * 2.0
        sat.mesh.rotation.x = t * 1.5
      })

      // ── Label always faces camera (billboard) ──
      labelMesh.lookAt(camera.position)

      // ── Pointer-reactive camera drift ──
      const targetCamX = baseCamX + mouseRef.current.x * 1.5
      const targetCamZ = baseCamZ + mouseRef.current.y * 1.5
      camera.position.x += (targetCamX - camera.position.x) * 0.02
      camera.position.z += (targetCamZ - camera.position.z) * 0.02
      camera.lookAt(0, 1, 0)

      // ── Particles breathing ──
      particleMat.uniforms.uTime.value = t

      renderer.render(scene, camera)
    }

    animate()

    // ─── Resize ───────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      const aspect = w / h
      camera.left = -d * aspect
      camera.right = d * aspect
      camera.top = d
      camera.bottom = -d
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ─── Cleanup ──────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry?.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material?.dispose()
          }
        }
      })
    }
  }, [handleMouseMove])

  return (
    <div className="w-full h-full overflow-hidden" style={{ position: 'relative' }}>
      {/* DOM Fallback background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: '#0A0A0A',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 85, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 85, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 55%, rgba(255, 85, 0, 0.08) 0%, transparent 60%)',
        }}
      />
      {/* WebGL Canvas */}
      <div
        id="webgl-container"
        ref={mountRef}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
      />
    </div>
  )
}
