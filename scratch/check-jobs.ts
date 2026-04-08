
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const jobs = await prisma.job.groupBy({
    by: ['status'],
    _count: true
  })
  console.log('Job Status Counts:', JSON.stringify(jobs, null, 2))
  
  const activeJobs = await prisma.job.findMany({
    where: { status: 'IN_PROGRESS' },
    select: { id: true, title: true, status: true }
  })
  console.log('Actual IN_PROGRESS jobs:', JSON.stringify(activeJobs, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
