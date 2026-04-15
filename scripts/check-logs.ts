import { prisma } from '../src/lib/db'

async function checkLogs() {
  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
        user: {
            select: { name: true, email: true }
        }
    }
  })

  console.log('Last 10 System Logs:')
  logs.forEach(log => {
    console.log(`[${log.createdAt.toISOString()}] [${log.level}] [${log.platform}] ${log.message}`)
    if (log.meta) {
        console.log(`Meta: ${JSON.stringify(log.meta, null, 2)}`)
    }
    console.log('---')
  })
}

checkLogs()
  .catch(err => console.error(err))
  .finally(() => process.exit(0))
