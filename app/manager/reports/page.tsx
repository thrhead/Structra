import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileBarChartIcon } from "lucide-react"

export default async function ReportsPage() {
    const session = await auth()
    if (!session || session.user.role !== "MANAGER") {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
                <p className="text-gray-500 mt-2">İş ve performans raporları.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileBarChartIcon className="h-5 w-5" />
                        Geliştirme Aşamasında
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Detaylı raporlama ve analiz özellikleri yakında eklenecektir.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
