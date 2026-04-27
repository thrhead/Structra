import { PrismaClient } from '@prisma/client'

// Prisma 7 requires a config file. The connection details are supplied via the
// PrismaClient constructor below. In deployments such as Vercel you typically
// rely on the DATABASE_URL environment variable which Prisma automatically
// reads when no adapter is specified.

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

export default prisma
