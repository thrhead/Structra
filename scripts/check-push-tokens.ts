import { prisma } from '../src/lib/db'

async function checkPushTokens() {
  const tokens = await prisma.pushToken.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true
        }
      }
    }
  })

  console.log(`Found ${tokens.length} push tokens:`)
  tokens.forEach(t => {
    console.log(`- Token: ${t.token.substring(0, 30)}... | User: ${t.user.name} (${t.user.email}) | Role: ${t.user.role}`)
  })
}

checkPushTokens()
  .catch(err => console.error(err))
  .finally(() => process.exit(0))
