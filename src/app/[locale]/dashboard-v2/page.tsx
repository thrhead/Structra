import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import AdminDashboardClient from "@/components/admin/admin-dashboard-client"

export default async function DashboardV2Page() {
  // Fetch real data on the server, just like the main admin dashboard
  const data = await getAdminDashboardData()

  return (
    <AdminDashboardClient data={data} />
  )
}
