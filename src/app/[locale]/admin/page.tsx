import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import { DashboardView } from "@/components/admin/dashboard-view"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const data = await getAdminDashboardData()

  return (
    <DashboardView session={session} data={data} />
  )
}