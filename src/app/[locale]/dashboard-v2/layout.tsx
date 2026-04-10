import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
