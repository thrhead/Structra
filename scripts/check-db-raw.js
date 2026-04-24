const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkTable() {
  try {
    const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('Tables in DB:', result.map(r => r.table_name))
    
    const tokenCount = await prisma.$queryRaw`SELECT count(*) FROM push_tokens`
    console.log('PushToken count:', tokenCount)
    
    const tokens = await prisma.$queryRaw`SELECT * FROM push_tokens LIMIT 5`
    console.log('Sample tokens:', tokens)
  } catch (error) {
    console.error('Error checking table:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTable()
