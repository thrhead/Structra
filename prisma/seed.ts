// Simple TypeScript seed script
import { prisma } from '../lib/db'
import { hash } from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin User
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@montaj.com' },
    update: {},
    create: {
      email: 'admin@montaj.com',
      passwordHash: adminPassword,
      name: 'Admin Kullanıcı',
      role: 'ADMIN',
      phone: '555-0001',
    },
  })
  console.log('✅ Admin:', admin.email)

  // Create Manager
  const managerPassword = await hash('manager123', 10)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@montaj.com' },
    update: {},
    create: {
      email: 'manager@montaj.com',
      passwordHash: managerPassword,
      name: 'Yönetici Ahmet',
      role: 'MANAGER',
      phone: '555-0002',
    },
  })
  console.log('✅ Manager:', manager.email)

  // Create Worker
  const workerPassword = await hash('worker123', 10)
  const worker = await prisma.user.upsert({
    where: { email: 'worker@montaj.com' },
    update: {},
    create: {
      email: 'worker@montaj.com',
      passwordHash: workerPassword,
      name: 'Montaj Elemanı Ali',
      role: 'WORKER',
      phone: '555-0003',
    },
  })
  console.log('✅ Worker:', worker.email)

  // Create Customer
  const customerPassword = await hash('customer123', 10)
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@montaj.com' },
    update: {},
    create: {
      email: 'customer@montaj.com',
      passwordHash: customerPassword,
      name: 'Müşteri Mehmet',
      role: 'CUSTOMER',
      phone: '555-0004',
    },
  })
  console.log('✅ Customer User:', customerUser.email)

  // Create Customer Profile
  const customer = await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      company: 'ABC Şirketi',
      address: 'İstanbul, Türkiye',
      taxId: '1234567890',
    },
  })
  console.log('✅ Customer Profile:', customer.company)

  console.log('\n🎉 Seed tamamlandı!')
  console.log('\n📝 Test Kullanıcıları:')
  console.log('Admin: admin@montaj.com / admin123')
  console.log('Manager: manager@montaj.com / manager123')
  console.log('Worker: worker@montaj.com / worker123')
  console.log('Customer: customer@montaj.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
