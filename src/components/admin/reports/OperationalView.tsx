"use client";

import {
	AlertTriangle,
	ArrowRight,
	BarChart3,
	CheckCircle2,
	Clock,
	Shield,
	Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Link, useRouter } from "@/lib/navigation";

const STATUS_LABELS: Record<string, string> = {
	PENDING: "Bekleyen",
	IN_PROGRESS: "Devam Eden",
	COMPLETED: "Tamamlanan",
	CANCELLED: "İptal",
};

const STATUS_COLORS: Record<string, string> = {
	PENDING: "bg-amber-500",
	IN_PROGRESS: "bg-blue-500",
	COMPLETED: "bg-emerald-500",
	CANCELLED: "bg-slate-400",
};

function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes} dk`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours < 24) return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`;
	const days = Math.floor(hours / 24);
	const remainHours = hours % 24;
	return remainHours > 0 ? `${days}g ${remainHours}s` : `${days}g`;
}

export default function OperationalView({ data }: { data: any }) {
	const router = useRouter();
	if (!data) return null;

	const {
		jobStatusDist = {},
		topBottlenecks = [],
		pendingApprovals = {
			costs: 0,
			steps: 0,
			delayedCosts: 0,
			delayedSteps: 0,
			totalDelayed: 0,
		},
		bottleneckScore = 0,
	} = data || {};

	const safePendingApprovals = pendingApprovals || {
		costs: 0,
		steps: 0,
		delayedCosts: 0,
		delayedSteps: 0,
		totalDelayed: 0,
	};
	const safeJobStatusDist = jobStatusDist || {};
	const totalPending =
		(safePendingApprovals.costs || 0) + (safePendingApprovals.steps || 0);
	const totalDelayed = safePendingApprovals.totalDelayed || 0;
	const totalJobs = Object.values(safeJobStatusDist).reduce(
		(a: any, b: any) => a + b,
		0,
	) as number;

	// Separate in-progress and completed bottlenecks
	const inProgressBottlenecks = topBottlenecks.filter(
		(j: any) => j.status === "IN_PROGRESS",
	);
	const _completedBottlenecks = topBottlenecks.filter(
		(j: any) => j.status === "COMPLETED",
	);

	// SLA health level
	const slaHealth =
		totalDelayed === 0 && topBottlenecks.length === 0
			? "healthy"
			: totalDelayed > 2 || topBottlenecks.length > 3
				? "critical"
				: "warning";

	const slaConfig = {
		healthy: {
			color: "emerald",
			icon: CheckCircle2,
			label: "SLA Uyumlu",
			desc: "Tüm operasyonlar hedef sürelerin dahilinde",
		},
		warning: {
			color: "amber",
			icon: AlertTriangle,
			label: "Dikkat Gerekli",
			desc: "Bazı operasyonlarda gecikme tespit edildi",
		},
		critical: {
			color: "rose",
			icon: AlertTriangle,
			label: "Kritik Durum",
			desc: "SLA ihlalleri acil müdahale gerektiriyor",
		},
	}[slaHealth];

	return (
		<div className="space-y-6 animate-page-enter">
			{/* KPI Cards */}
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-4 stagger-children">
				<Card
					className={`group rounded-3xl border ${totalDelayed > 0 ? "border-rose-100/80 dark:border-rose-900/30 shadow-rose-500/5" : "border-yellow-100/80 dark:border-yellow-900/30"} bg-white dark:bg-slate-900/80 shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300`}
					onClick={() => router.push("/admin/approvals?filter=delayed")}
				>
					<CardHeader className="pb-2 px-5 pt-5">
						<div className="flex items-center justify-between">
							<div
								className={`p-2 rounded-2xl ${totalDelayed > 0 ? "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40" : "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/40"} group-hover:scale-110 transition-transform duration-300`}
							>
								<AlertTriangle
									className={`w-4 h-4 ${totalDelayed > 0 ? "text-rose-600 dark:text-rose-400" : "text-yellow-600 dark:text-yellow-400"}`}
								/>
							</div>
							<ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">
							SLA İhlalleri
						</p>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<div
							className={`text-3xl font-bold tabular-nums ${totalDelayed > 0 ? "text-rose-700 dark:text-rose-300" : "text-yellow-700 dark:text-yellow-300"}`}
						>
							{totalDelayed}
						</div>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
							48 saatten fazla bekleyen onay
						</p>
					</CardContent>
				</Card>

				<Card className="group rounded-3xl border border-blue-100/80 dark:border-blue-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300">
					<CardHeader className="pb-2 px-5 pt-5">
						<div className="p-2 w-fit rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 group-hover:scale-110 transition-transform duration-300">
							<Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
						</div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">
							Darboğaz Skoru
						</p>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<div className="text-3xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
							%{Number(bottleneckScore || 0).toFixed(0)}
						</div>
						<Progress
							value={bottleneckScore || 0}
							className="mt-2 h-1 bg-blue-100 dark:bg-blue-950/60"
						/>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
							Geciken iş oranı
						</p>
					</CardContent>
				</Card>

				<Card className="group rounded-3xl border border-emerald-100/80 dark:border-emerald-900/30 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300">
					<CardHeader className="pb-2 px-5 pt-5">
						<div className="p-2 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
							<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
						</div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">
							Tamamlanan İşler
						</p>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<div className="text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
							{safeJobStatusDist.COMPLETED || 0}
						</div>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
							Seçili periyotta tamamlanan
						</p>
					</CardContent>
				</Card>

				<Card
					className="group rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 bg-white dark:bg-slate-900/80 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300"
					onClick={() => router.push("/admin/approvals")}
				>
					<CardHeader className="pb-2 px-5 pt-5">
						<div className="flex items-center justify-between">
							<div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform duration-300">
								<Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
							</div>
							<ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-3">
							Bekleyen Onaylar
						</p>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<div className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
							{totalPending}
						</div>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
							{safePendingApprovals.costs || 0} maliyet ·{" "}
							{safePendingApprovals.steps || 0} adım
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Bottleneck Table */}
			<Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
				<CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
							<BarChart3 className="w-4 h-4 text-rose-500" />
							Kritik Darboğazlar (En Yüksek Gecikme)
						</CardTitle>
						{topBottlenecks.length > 0 && (
							<Badge variant="outline" className="text-[10px] font-semibold">
								{topBottlenecks.length} iş
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800/50">
								<TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
									İş No / Başlık
								</TableHead>
								<TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
									Durum
								</TableHead>
								<TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
									Tahmini
								</TableHead>
								<TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
									Gerçek
								</TableHead>
								<TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
									İlerleme
								</TableHead>
								<TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
									Gecikme
								</TableHead>
								<TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topBottlenecks.map((job: any, i: number) => (
								<TableRow
									key={i}
									className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150 border-b border-slate-100/60 dark:border-slate-800/30 last:border-0"
								>
									<TableCell className="px-5 py-3.5">
										<div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
											{job.jobNo}
										</div>
										<div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
											{job.title}
										</div>
										{job.customer && (
											<div className="text-[10px] text-slate-400/60 dark:text-slate-500/60 mt-0.5">
												{job.customer}
											</div>
										)}
									</TableCell>
									<TableCell className="px-5 py-3.5">
										<Badge
											variant="outline"
											className={`text-[10px] font-semibold ${
												job.status === "IN_PROGRESS"
													? "border-blue-200 text-blue-600 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-950/30"
													: "border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/30"
											}`}
										>
											{STATUS_LABELS[job.status] || job.status}
										</Badge>
									</TableCell>
									<TableCell className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
										{job.estimatedDuration > 0
											? formatDuration(job.estimatedDuration)
											: "—"}
									</TableCell>
									<TableCell className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
										{formatDuration(job.actualDuration)}
									</TableCell>
									<TableCell className="px-5 py-3.5">
										<div className="flex items-center gap-2">
											<Progress
												value={job.progress || 0}
												className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800"
											/>
											<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
												{job.completedSteps}/{job.totalSteps}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-5 py-3.5 text-right">
										<span className="text-rose-600 dark:text-rose-400 font-bold text-sm tabular-nums">
											+{formatDuration(job.delay)}
										</span>
									</TableCell>
									<TableCell className="px-5 py-3.5 text-right">
										<Link href={`/admin/jobs/${job.id}`}>
											<Button
												variant="ghost"
												size="sm"
												className="gap-1.5 text-xs opacity-60 group-hover:opacity-100 transition-opacity"
											>
												İncele <ArrowRight className="w-3 h-3" />
											</Button>
										</Link>
									</TableCell>
								</TableRow>
							))}
							{topBottlenecks.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-12">
										<div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
											<CheckCircle2 className="w-8 h-8 text-emerald-400" />
											<p className="text-sm font-medium">
												Kritik gecikme tespit edilmedi
											</p>
											<p className="text-[10px]">
												Tüm işler tahmini süre dahilinde ilerliyor
											</p>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className="grid gap-5 md:grid-cols-2">
				{/* Status Distribution */}
				<Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
					<CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
							Durum Dağılım Analizi
						</CardTitle>
					</CardHeader>
					<CardContent className="px-5 py-4">
						<div className="space-y-4">
							{Object.entries(safeJobStatusDist || {}).map(
								([status, count]: [string, any], i: number) => {
									const percentage =
										totalJobs > 0 ? (count / totalJobs) * 100 : 0;
									const color = STATUS_COLORS[status] || "bg-slate-400";
									return (
										<div key={i} className="space-y-1.5">
											<div className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2">
													<span className={`w-2 h-2 rounded-full ${color}`} />
													<span className="font-semibold text-slate-600 dark:text-slate-300">
														{STATUS_LABELS[status] || status}
													</span>
												</div>
												<span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
													{count} ({percentage.toFixed(0)}%)
												</span>
											</div>
											<Progress
												value={percentage}
												className="h-1.5 bg-slate-100 dark:bg-slate-800"
											/>
										</div>
									);
								},
							)}
							{Object.keys(safeJobStatusDist).length === 0 && (
								<div className="py-8 flex flex-col items-center gap-2 text-slate-400">
									<BarChart3 className="w-8 h-8 opacity-30" />
									<p className="text-xs font-medium">Veri bulunamadı</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* SLA Health & Alerts */}
				<Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
					<CardHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/50">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
							<Shield className="w-4 h-4 text-indigo-500" />
							Kritik Uyarılar &amp; SLA Kontrolü
						</CardTitle>
					</CardHeader>
					<CardContent className="px-5 py-4">
						<div className="space-y-3">
							{/* SLA Health Banner */}
							<div
								className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
									slaHealth === "healthy"
										? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40"
										: slaHealth === "warning"
											? "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40"
											: "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40"
								}`}
							>
								<slaConfig.icon
									className={`w-5 h-5 flex-shrink-0 ${
										slaHealth === "healthy"
											? "text-emerald-600 dark:text-emerald-400"
											: slaHealth === "warning"
												? "text-amber-600 dark:text-amber-400"
												: "text-rose-600 dark:text-rose-400"
									}`}
								/>
								<div className="flex-1">
									<p
										className={`font-bold text-sm ${
											slaHealth === "healthy"
												? "text-emerald-700 dark:text-emerald-300"
												: slaHealth === "warning"
													? "text-amber-700 dark:text-amber-300"
													: "text-rose-700 dark:text-rose-300"
										}`}
									>
										{slaConfig.label}
									</p>
									<p
										className={`text-xs mt-0.5 ${
											slaHealth === "healthy"
												? "text-emerald-600/70 dark:text-emerald-400/70"
												: slaHealth === "warning"
													? "text-amber-600/70 dark:text-amber-400/70"
													: "text-rose-600/70 dark:text-rose-400/70"
										}`}
									>
										{slaConfig.desc}
									</p>
								</div>
							</div>

							{/* Delayed Approvals Alert */}
							{totalDelayed > 0 && (
								<Link href="/admin/approvals?filter=delayed" className="block">
									<div className="flex items-start gap-3 p-3 rounded-xl border bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700 transition-all group">
										<AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<span className="font-semibold text-rose-700 dark:text-rose-300 text-xs">
													Gecikmiş Onaylar (&gt;48s)
												</span>
												<ArrowRight className="w-3.5 h-3.5 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
											</div>
											<p className="text-[11px] text-rose-600/70 dark:text-rose-400/60 mt-0.5">
												{safePendingApprovals.delayedCosts > 0 &&
													`${safePendingApprovals.delayedCosts} maliyet`}
												{safePendingApprovals.delayedCosts > 0 &&
													safePendingApprovals.delayedSteps > 0 &&
													" · "}
												{safePendingApprovals.delayedSteps > 0 &&
													`${safePendingApprovals.delayedSteps} adım`}{" "}
												onayı 48 saati aştı
											</p>
										</div>
									</div>
								</Link>
							)}

							{/* Pending Approvals */}
							{totalPending > 0 && totalDelayed === 0 && (
								<Link href="/admin/approvals" className="block">
									<div className="flex items-start gap-3 p-3 rounded-xl border bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all group">
										<Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<span className="font-semibold text-amber-700 dark:text-amber-300 text-xs">
													Bekleyen Onaylar
												</span>
												<ArrowRight className="w-3.5 h-3.5 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
											</div>
											<p className="text-[11px] text-amber-600/70 dark:text-amber-400/60 mt-0.5">
												{safePendingApprovals.costs || 0} maliyet ·{" "}
												{safePendingApprovals.steps || 0} adım onayı bekliyor
											</p>
										</div>
									</div>
								</Link>
							)}

							{/* Bottleneck Warning */}
							{inProgressBottlenecks.length > 0 && (
								<div className="flex items-start gap-3 p-3 rounded-xl border bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
									<Timer className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
									<div>
										<span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">
											Aktif Gecikme
										</span>
										<p className="text-[11px] text-blue-600/70 dark:text-blue-400/60 mt-0.5">
											{inProgressBottlenecks.length} devam eden iş tahmini
											süreyi aştı
										</p>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
