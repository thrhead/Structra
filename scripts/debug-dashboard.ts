import { prisma } from "./src/lib/db"

async function debug() {
  console.log("--- DEBUG START ---")
  
  const roles = await prisma.user.groupBy({
    by: ['role'],
    _count: true
  })
  console.log("User Roles:", roles)

  const jobStatuses = await prisma.job.groupBy({
    by: ['status'],
    _count: true
  })
  console.log("Job Statuses:", jobStatuses)

  const pendingApprovals = await prisma.approval.count({
    where: { status: 'PENDING' }
  })
  console.log("Pending Approvals Count:", pendingApprovals)

  const totalCosts = await prisma.costTracking.count()
  console.log("Total Cost Entries:", totalCosts)

  console.log("--- DEBUG END ---")
}

debug()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
