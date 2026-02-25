'use client'

import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AssemblyPart } from '@/lib/data/mock-3d-models'

interface AssemblyGuidePanelProps {
    parts: (AssemblyPart & { isCompleted: boolean })[]
    selectedPartId: string | null
    onSelectPart: (partId: string) => void
}

export function AssemblyGuidePanel({
    parts,
    selectedPartId,
    onSelectPart
}: AssemblyGuidePanelProps) {
    const selectedPart = parts.find(p => p.id === selectedPartId)
    const selectedIndex = parts.findIndex(p => p.id === selectedPartId)
    const completedCount = parts.filter(p => p.isCompleted).length
    const progressPercent = parts.length > 0 ? Math.round((completedCount / parts.length) * 100) : 0

    const goToPrev = () => {
        if (selectedIndex > 0) onSelectPart(parts[selectedIndex - 1].id)
    }

    const goToNext = () => {
        if (selectedIndex < parts.length - 1) onSelectPart(parts[selectedIndex + 1].id)
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    3D Montaj Kılavuzu
                </h3>
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">
                        {completedCount}/{parts.length}
                    </span>
                </div>
            </div>

            {/* Part list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {parts
                    .sort((a, b) => a.order - b.order)
                    .map((part) => (
                        <button
                            key={part.id}
                            onClick={() => onSelectPart(part.id)}
                            className={cn(
                                'w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm flex items-center gap-3',
                                selectedPartId === part.id
                                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                    : 'hover:bg-gray-50 border border-transparent'
                            )}
                        >
                            <div className="flex-shrink-0">
                                {part.isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Circle className={cn(
                                        'h-5 w-5',
                                        selectedPartId === part.id ? 'text-blue-500' : 'text-gray-300'
                                    )} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        'text-[10px] font-bold rounded px-1.5 py-0.5',
                                        selectedPartId === part.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : part.isCompleted
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                    )}>
                                        {part.order}
                                    </span>
                                    <span className={cn(
                                        'font-medium truncate',
                                        part.isCompleted ? 'text-green-700' : 'text-gray-800'
                                    )}>
                                        {part.name}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
            </div>

            {/* Detail panel */}
            {selectedPart ? (
                <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50/50">
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                                {selectedPart.order}
                            </span>
                            {selectedPart.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {selectedPart.description}
                        </p>
                    </div>

                    {/* Step-by-step instructions */}
                    <div className="space-y-1.5">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Talimatlar
                        </h5>
                        <ol className="space-y-1">
                            {selectedPart.instructions.map((instruction, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-gray-700 bg-white p-2 rounded border border-gray-100"
                                >
                                    <span className="flex-shrink-0 h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <span className="leading-relaxed">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <button
                            onClick={goToPrev}
                            disabled={selectedIndex <= 0}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Önceki
                        </button>
                        <span className="text-[10px] font-mono text-gray-400">
                            {selectedIndex + 1} / {parts.length}
                        </span>
                        <button
                            onClick={goToNext}
                            disabled={selectedIndex >= parts.length - 1}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Sonraki
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border-t border-gray-200 p-6 text-center bg-gray-50/50">
                    <Wrench className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                        Detay görmek için bir parçaya tıklayın
                    </p>
                </div>
            )}
        </div>
    )
}
