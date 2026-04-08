import { getAdminDashboardData } from "@/lib/data/admin-dashboard"
import AdminDashboardClient from "@/components/admin/admin-dashboard-client"

export default async function AdminDashboardPage() {
  // Fetch data on the server
  const data = await getAdminDashboardData()

  return (
    <AdminDashboardClient data={data} />
  )
}