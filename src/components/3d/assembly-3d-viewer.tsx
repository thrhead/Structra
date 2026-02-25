'use client'

import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { AssemblyModel3D } from './assembly-model-3d'
import { AssemblyGuidePanel } from './assembly-guide-panel'
import { MOCK_AC_UNIT_MODEL, type AssemblyPart } from '@/lib/data/mock-3d-models'
import { Expand, Shrink, RotateCcw, Box } from 'lucide-react'

interface Assembly3DViewerProps {
    steps: {
        id: string
        title: string
        isCompleted: boolean
        order: number
    }[]
    jobTitle: string
}

export function Assembly3DViewer({ steps, jobTitle }: Assembly3DViewerProps) {
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null)
    const [isExploded, setIsExploded] = useState(false)
    const [key, setKey] = useState(0) // For reset

    const model = MOCK_AC_UNIT_MODEL

    // Map job steps to 3D parts by order
    const mappedParts = useMemo(() => {
        return model.parts.map((part, idx) => {
            const step = steps[idx]
            return {
                ...part,
                isCompleted: step?.isCompleted || false,
                stepId: step?.id || ''
            }
        })
    }, [model.parts, steps])

    const resetView = () => {
        setSelectedPartId(null)
        setIsExploded(false)
        setKey(prev => prev + 1)
    }

    return (
        <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Header */}
            <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Box className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-900">3D Montaj Görünümü</h3>
                        <p className="text-xs text-gray-500">{model.name} — {jobTitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsExploded(!isExploded)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isExploded
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                            }`}
                    >
                        {isExploded ? (
                            <><Shrink className="h-3.5 w-3.5" /> Normal</>
                        ) : (
                            <><Expand className="h-3.5 w-3.5" /> Patlama Görünümü</>
                        )}
                    </button>
                    <button
                        onClick={resetView}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all border border-transparent"
                        title="Görünümü Sıfırla"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
                {/* 3D Canvas */}
                <div className="lg:col-span-2 relative">
                    <Canvas
                        key={key}
                        camera={{ position: [6, 4, 6], fov: 45 }}
                        shadows
                        className="!bg-gradient-to-br from-slate-100 to-gray-200"
                    >
                        <ambientLight intensity={0.6} />
                        <directionalLight
                            position={[5, 8, 5]}
                            intensity={1.2}
                            castShadow
                            shadow-mapSize={[1024, 1024]}
                        />
                        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
                        <pointLight position={[0, 5, 0]} intensity={0.3} />

                        <AssemblyModel3D
                            parts={mappedParts}
                            selectedPartId={selectedPartId}
                            isExploded={isExploded}
                            onSelectPart={setSelectedPartId}
                        />

                        <ContactShadows
                            position={[0, -3.01, 0]}
                            opacity={0.3}
                            scale={12}
                            blur={2}
                        />

                        <OrbitControls
                            enableDamping
                            dampingFactor={0.05}
                            minDistance={3}
                            maxDistance={15}
                            maxPolarAngle={Math.PI / 1.8}
                        />

                        <Environment preset="city" />
                    </Canvas>

                    {/* Overlay hints */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200">
                        <span>🖱️ Döndür: Sol tık + sürükle</span>
                        <span>🔍 Yakınlaştır: Scroll</span>
                        <span>👆 Seç: Parçaya tıkla</span>
                    </div>

                    {/* Legend */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 text-[10px] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            <span className="text-gray-600">Tamamlandı</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-gray-600">Seçili</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                            <span className="text-gray-600">Bekliyor</span>
                        </div>
                    </div>
                </div>

                {/* Guide Panel */}
                <div className="border-l border-gray-200 overflow-hidden">
                    <AssemblyGuidePanel
                        parts={mappedParts}
                        selectedPartId={selectedPartId}
                        onSelectPart={setSelectedPartId}
                    />
                </div>
            </div>
        </div>
    )
}
