import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { TemplateImportDialog } from "@/components/admin/template-import-dialog"

async function getTemplates() {
    return await prisma.jobTemplate.findMany({
        include: {
            steps: {
                include: { subSteps: true },
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function TemplatesPage() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_LEAD")) {
        redirect("/login")
    }

    const templates = await getTemplates()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Operasyon</p>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">İş Şablonları</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">İş oluştururken kullanılacak şablonları yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <TemplateImportDialog />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                {templates.map((template) => (
                    <div key={template.id} className="group rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{template.name}</h3>
                                {template.description && (
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{template.description}</p>
                                )}
                            </div>
                            <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-900/40">
                                {template.steps.length} Adım
                            </span>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                            {template.steps.map((step) => (
                                <div key={step.id} className="text-sm border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1">
                                    <p className="font-medium text-slate-700 dark:text-slate-300">{step.order}. {step.title}</p>
                                    {step.subSteps.length > 0 && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {step.subSteps.length} alt adım
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            Oluşturulma: {template.createdAt.toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">Henüz şablon bulunmuyor.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Excel ile yükleyerek başlayabilirsiniz.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
