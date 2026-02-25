'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Group } from 'three'
import type { AssemblyPart } from '@/lib/data/mock-3d-models'

interface PartMeshProps {
    part: AssemblyPart & { isCompleted: boolean }
    isSelected: boolean
    isExploded: boolean
    onSelect: (partId: string) => void
}

function PartMesh({ part, isSelected, isExploded, onSelect }: PartMeshProps) {
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHovered] = useState(false)

    // Animate hover/selection glow
    useFrame((_, delta) => {
        if (!meshRef.current) return
        const mat = meshRef.current.material as any
        if (isSelected) {
            mat.emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.005) * 0.15
        } else if (hovered) {
            mat.emissiveIntensity = 0.2
        } else {
            mat.emissiveIntensity = Math.max(0, mat.emissiveIntensity - delta * 2)
        }
    })

    const currentColor = part.isCompleted
        ? part.completedColor
        : isSelected
            ? part.highlightColor
            : part.color

    const emissiveColor = isSelected ? '#60a5fa' : hovered ? '#93c5fd' : '#000000'

    const targetPos: [number, number, number] = isExploded
        ? [
            part.position[0] + part.explodedOffset[0],
            part.position[1] + part.explodedOffset[1],
            part.position[2] + part.explodedOffset[2]
        ]
        : part.position

    return (
        <mesh
            ref={meshRef}
            position={targetPos}
            rotation={part.rotation}
            scale={part.scale}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(part.id)
            }}
            onPointerEnter={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerLeave={() => {
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
        >
            {part.geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {part.geometry === 'cylinder' && <cylinderGeometry args={[1, 1, 1, 32]} />}
            {part.geometry === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
            <meshStandardMaterial
                color={currentColor}
                emissive={emissiveColor}
                emissiveIntensity={0}
                roughness={0.4}
                metalness={0.3}
                transparent={!isSelected && !part.isCompleted}
                opacity={!isSelected && !part.isCompleted && !hovered ? 0.85 : 1}
            />
        </mesh>
    )
}

interface AssemblyModel3DProps {
    parts: (AssemblyPart & { isCompleted: boolean })[]
    selectedPartId: string | null
    isExploded: boolean
    onSelectPart: (partId: string) => void
}

export function AssemblyModel3D({
    parts,
    selectedPartId,
    isExploded,
    onSelectPart
}: AssemblyModel3DProps) {
    const groupRef = useRef<Group>(null)

    // Slow auto-rotation when no part is selected
    useFrame((_, delta) => {
        if (!groupRef.current || selectedPartId) return
        groupRef.current.rotation.y += delta * 0.15
    })

    return (
        <group ref={groupRef}>
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
                <planeGeometry args={[12, 12]} />
                <meshStandardMaterial color="#f1f5f9" transparent opacity={0.5} />
            </mesh>

            {/* Assembly parts */}
            {parts.map((part) => (
                <PartMesh
                    key={part.id}
                    part={part}
                    isSelected={selectedPartId === part.id}
                    isExploded={isExploded}
                    onSelect={onSelectPart}
                />
            ))}

            {/* Part labels */}
            {parts.map((part) => {
                const pos: [number, number, number] = isExploded
                    ? [
                        part.position[0] + part.explodedOffset[0],
                        part.position[1] + part.explodedOffset[1] + Math.max(...part.scale) * 0.6,
                        part.position[2] + part.explodedOffset[2]
                    ]
                    : [
                        part.position[0],
                        part.position[1] + Math.max(...part.scale) * 0.6,
                        part.position[2]
                    ]

                return (
                    selectedPartId === part.id && (
                        <group key={`label-${part.id}`} position={pos}>
                            <mesh>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
                            </mesh>
                        </group>
                    )
                )
            })}
        </group>
    )
}
