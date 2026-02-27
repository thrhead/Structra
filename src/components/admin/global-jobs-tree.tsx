'use client'

import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Briefcase, Calendar, CheckSquare, Circle, ChevronRight, ChevronDown, CheckCircle, Clock, Square, Hash, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types based on the modified Prisma query
type SubStepType = {
    id: string
    title: string
    isCompleted: boolean
    approvalStatus?: string | null
}

type StepType = {
    id: string
    title: string
    isCompleted: boolean
    subSteps: SubStepType[]
}

type JobType = {
    id: string
    jobNo: string | null
    title: string
    status: string
    scheduledDate: Date | null
    createdAt: Date
    steps: StepType[]
}

interface GlobalJobsTreeProps {
    jobs: JobType[]
}

// ------ UI COMPONENTS FOR TREE NODES ------

const ConnectorH = () => (
    <div className="w-8 border-b-2 border-dashed border-slate-300" />
)

const ConnectorV = ({ isLast }: { isLast?: boolean }) => (
    <div className={cn("absolute left-[19px] top-10 border-l-2 border-dashed border-slate-300 -z-10", isLast ? "h-6" : "h-full")} />
)

const JunctionIcon = ({ colorClass, IconShape }: { colorClass: string, IconShape: any }) => (
    <div className="flex items-center">
        <ConnectorH />
        <div className={cn("z-10 flex items-center justify-center p-1 rounded-sm bg-white border-2", colorClass)}>
            <IconShape className={cn("w-3 h-3", colorClass.replace('border-', 'text-'))} fill="currentColor" />
        </div>
        <ConnectorH />
    </div>
)

// Generates dynamic gradient from red (100) -> orange (50) -> grey (0)
const getGradientStyle = (percentage: number) => {
    if (percentage === 0) {
        return {
            background: 'white',
            borderLeft: '4px solid #cbd5e1' // slate-300
        }
    }

    // User requested: 100% is Red, 80% gets more orange "red to orange gradient"
    // Using HSL: Red is ~0, Orange is ~30. 
    // We map 1-100 to HSL hue 35 (orange/yellow) to 0 (red).
    // The higher the percentage, the closer to 0 (pure red).
    const hue = Math.max(0, 35 - (percentage * 0.35)); // 100% -> hue 0, 10% -> hue ~31
    const color = `hsl(${hue}, 90%, 55%)`; // Base solid color
    const darkColor = `hsl(${Math.max(0, hue - 10)}, 95%, 45%)`; // Darker end of gradient

    return {
        // Linear gradient background filling `percentage` width
        // Then transparent for the rest
        background: `linear-gradient(to right, ${color} 0%, ${darkColor} ${percentage}%, #f8fafc ${percentage}%)`,
        borderLeft: `4px solid ${darkColor}`
    }
}

const LeafCard = ({
    icon: Icon,
    title,
    subtitle,
    percentage = null, // 0-100 or null if not applicable
    isExpanded,
    onToggle,
    hasChildren
}: any) => {

    const styleObj = percentage !== null ? getGradientStyle(percentage) : { background: 'white' }
    const isDarkBg = percentage !== null && percentage > 30

    return (
        <div
            onClick={hasChildren ? onToggle : undefined}
            className={cn(
                "relative z-10 flex items-center min-w-[240px] max-w-[320px] rounded-r shadow-sm cursor-pointer transition-all hover:shadow-md border border-l-0 overflow-hidden",
                hasChildren ? "hover:border-indigo-400" : ""
            )}
            style={styleObj}
        >
            <div className="flex items-center justify-center w-12 h-full min-h-[50px] bg-white/70 backdrop-blur-sm border-r border-white/40">
                <Icon className={cn("w-5 h-5", isDarkBg ? "text-slate-800" : "text-slate-600")} />
            </div>
            <div className="px-3 py-2 flex-1 relative z-10">
                <p className={cn("font-semibold text-sm leading-tight line-clamp-2", isDarkBg ? "text-white" : "text-slate-800")}>{title}</p>
                <div className="flex justify-between items-center mt-0.5">
                    <p className={cn("text-xs font-mono", isDarkBg ? "text-white/80" : "text-slate-500")}>{subtitle}</p>
                    {percentage !== null && (
                        <p className={cn("text-xs font-bold bg-white/30 px-1.5 rounded", isDarkBg ? "text-white" : "text-slate-700")}>
                            %{percentage}
                        </p>
                    )}
                </div>
            </div>
            {hasChildren && (
                <div className={cn("pr-2", isDarkBg ? "text-white/80" : "text-slate-400")}>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            )}
        </div>
    )
}

// ------ RENDERERS ------

const SubStepList = ({ subSteps }: { subSteps: SubStepType[] }) => {
    return (
        <div className="relative flex flex-col gap-4 ml-6 mt-4">
            {subSteps.map((sub, idx) => {
                const isLast = idx === subSteps.length - 1
                return (
                    <div key={sub.id} className="relative flex items-center">
                        <ConnectorV isLast={isLast} />
                        <div className="w-6 border-b-2 border-dashed border-slate-300" />
                        <LeafCard
                            icon={sub.isCompleted ? CheckCircle : Square}
                            title={sub.title}
                            subtitle={`ID: ${sub.id.slice(-6).toUpperCase()}`}
                            percentage={sub.isCompleted ? 100 : 0}
                            hasChildren={false}
                        />
                    </div>
                )
            })}
        </div>
    )
}

const StepList = ({ steps, isParentLast }: { steps: StepType[], isParentLast?: boolean }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }))

    return (
        <div className="relative flex flex-col gap-6 ml-6 mt-2">
            {/* If parent isn't last, we need a vertical line continuing down for sibling parent safety, handled in upper loop usually, but here we scope it */}
            {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1
                const hasSubs = step.subSteps && step.subSteps.length > 0
                const completedSubs = step.subSteps ? step.subSteps.filter(s => s.isCompleted).length : 0
                const percent = hasSubs ? Math.round((completedSubs / step.subSteps.length) * 100) : (step.isCompleted ? 100 : 0)

                return (
                    <div key={step.id} className="relative flex items-start">
                        <ConnectorV isLast={isLast && !expanded[step.id]} />
                        <div className="mt-5 w-6 border-b-2 border-dashed border-slate-300" />

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <LeafCard
                                    icon={Layers}
                                    title={step.title}
                                    subtitle={percent === 100 ? 'Tamamlandı' : 'İşlemde'}
                                    percentage={percent}
                                    isExpanded={expanded[step.id]}
                                    onToggle={() => toggle(step.id)}
                                    hasChildren={hasSubs}
                                />
                                {expanded[step.id] && hasSubs && (
                                    <JunctionIcon colorClass="border-orange-500 text-orange-500" IconShape={Circle} />
                                )}
                            </div>

                            {expanded[step.id] && hasSubs && (
                                <SubStepList subSteps={step.subSteps} />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const JobList = ({ jobs, year }: { jobs: JobType[], year: string }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }))

    return (
        <div className="relative flex flex-col gap-6 ml-6 mt-2">
            {jobs.map((job, idx) => {
                const isLast = idx === jobs.length - 1
                const hasSteps = job.steps && job.steps.length > 0
                const completedSteps = job.steps ? job.steps.filter(s => s.isCompleted).length : 0
                const percent = hasSteps ? Math.round((completedSteps / job.steps.length) * 100) : 0

                return (
                    <div key={job.id} className="relative flex items-start">
                        <ConnectorV isLast={isLast && !expanded[job.id]} />
                        <div className="mt-5 w-6 border-b-2 border-dashed border-slate-300" />

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <LeafCard
                                    icon={Briefcase}
                                    title={job.title}
                                    subtitle={job.jobNo || `#${job.id.slice(-6).toUpperCase()}`}
                                    percentage={percent}
                                    isExpanded={expanded[job.id]}
                                    onToggle={() => toggle(job.id)}
                                    hasChildren={hasSteps}
                                />
                                {expanded[job.id] && hasSteps && (
                                    <JunctionIcon colorClass="border-blue-500 text-blue-500" IconShape={Circle} />
                                )}
                            </div>

                            {expanded[job.id] && hasSteps && (
                                <StepList steps={job.steps} isParentLast={isLast} />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


export function GlobalJobsTree({ jobs }: GlobalJobsTreeProps) {
    const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})

    const toggleYear = (year: string) => setExpandedYears(p => ({ ...p, [year]: !p[year] }))

    // Group jobs by year
    const groupedByYear = useMemo(() => {
        const groups: Record<string, JobType[]> = {}
        jobs.forEach(job => {
            const d = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.createdAt)
            const y = format(d, 'yyyy')
            if (!groups[y]) groups[y] = []
            groups[y].push(job)
        })
        return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)) // Descending year
    }, [jobs])

    if (jobs.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                Gösterilecek iş bulunamadı.
            </div>
        )
    }

    return (
        <div className="p-6 overflow-x-auto bg-slate-50/50 min-h-[600px] rounded-lg border">
            <div className="min-w-max pb-32 pt-4">
                <div className="flex flex-col gap-10">
                    {groupedByYear.map(([year, yearJobs], yIdx) => {
                        const isExpanded = expandedYears[year]
                        const isLastYear = yIdx === groupedByYear.length - 1

                        return (
                            <div key={year} className="relative flex items-start">
                                {/* Root Vertical Line for timeline effect (optional) */}
                                {!isLastYear && (
                                    <div className="absolute left-[24px] top-12 bottom-[-40px] border-l-[3px] border-slate-200 -z-10" />
                                )}

                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <LeafCard
                                            icon={Calendar}
                                            title={`Görev Yılı: ${year}`}
                                            subtitle={`${yearJobs.length} Proje Bulundu`}
                                            percentage={null}
                                            isExpanded={isExpanded}
                                            onToggle={() => toggleYear(year)}
                                            hasChildren={true}
                                        />
                                        {isExpanded && (
                                            <JunctionIcon colorClass="border-red-500 text-red-500 rotate-45" IconShape={Square} />
                                        )}
                                    </div>

                                    {isExpanded && (
                                        <JobList jobs={yearJobs} year={year} />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
