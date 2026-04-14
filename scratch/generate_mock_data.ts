import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function generateMockData() {
  console.log('🏗️ Gerçekçi Mock Veri Üretimi Başlatıldı...')

  // 1. Mevcut verileri al
  const users = await prisma.user.findMany()
  const customer = await prisma.customer.findFirst()
  
  if (!users.length || !customer) {
    console.error('❌ HATA: Kullanıcı veya müşteri bulunamadı. Lütfen önce seed scriptini çalıştırın.')
    return
  }

  const admin = users.find(u => u.role === 'ADMIN') || users[0]
  const manager = users.find(u => u.role === 'MANAGER') || users[0]
  const teamLead = users.find(u => u.role === 'TEAM_LEAD') || users[0]
  const workers = users.filter(u => u.role === 'WORKER')

  // Proje isimleri ve tanımları
  const projects = [
    { title: 'Modern Ofis Masaları Kurulumu', desc: '15 adet workstation montajı ve kablolama.' },
    { title: 'Klinik Karşılama Bankosu', desc: 'Özel tasarım ahşap banko montajı ve LED aydınlatma.' },
    { title: 'Mağaza Raf Sistemleri', desc: 'Yeni açılacak butik mağazanın tüm raf sistemlerinin kurulumu.' },
    { title: 'Toplantı Odası Akustik Panel', desc: 'Ses yalıtımı için duvar panellerinin montajı.' },
    { title: 'Mutfak Dolabı Montajı - Villa X', desc: 'Üst segment mutfak dolabı ve ankastre set kurulumu.' },
    { title: 'Okul Kütüphane Rafları', desc: 'Metal raf sistemleri ve okuma masaları montajı.' },
    { title: 'Restoran Dış Mekan Mobilya', desc: 'Bahçe mobilyaları ve şemsiye sistemleri kurulumu.' },
    { title: 'Lojistik Depo Raf Ünitesi', desc: 'Ağır yük raf sistemleri kurulumu.' },
    { title: 'AVM Stand Tasarımı', desc: 'Kozmetik standı kurulumu.' },
    { title: 'Ev Ofis Mobilyası', desc: '3 adet çalışma köşesi kurulumu.' }
  ]

  const now = new Date()

  // 10 ADET İŞ ÜRET
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    let status = 'PENDING'
    let scheduledDate = new Date(now)
    let completedDate = null
    let startedAt = null

    // Durumları dağıt
    if (i < 4) {
      status = 'COMPLETED'
      scheduledDate = new Date(now.getTime() - (10 - i) * 24 * 60 * 60 * 1000) // 10-6 gün önce
      startedAt = new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000)
      completedDate = new Date(startedAt.getTime() + 6 * 60 * 60 * 1000)
    } else if (i < 7) {
      status = 'IN_PROGRESS'
      scheduledDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // Dün başladı
      startedAt = new Date(scheduledDate.getTime() + 1 * 60 * 60 * 1000)
    } else {
      status = 'PENDING'
      scheduledDate = new Date(now.getTime() + (i - 6) * 24 * 60 * 60 * 1000) // Gelecek günler
    }

    const job = await prisma.job.create({
      data: {
        title: project.title,
        description: project.desc,
        location: 'İstanbul, Türkiye',
        status: status,
        scheduledDate: scheduledDate,
        startedAt: startedAt,
        completedDate: completedDate,
        customerId: customer.id,
        creatorId: manager.id,
        jobLeadId: teamLead.id,
        estimatedDuration: 480, // 8 saat
        assignments: {
          create: workers.map(w => ({ workerId: w.id }))
        },
        steps: {
          create: [
            {
              title: 'Malzeme Kontrolü',
              order: 1,
              isCompleted: status === 'COMPLETED' || status === 'IN_PROGRESS',
              approvalStatus: status === 'COMPLETED' || status === 'IN_PROGRESS' ? 'APPROVED' : 'PENDING',
              completedAt: status === 'COMPLETED' || status === 'IN_PROGRESS' ? startedAt : null
            },
            {
              title: 'Ana Montaj Fazı',
              order: 2,
              isCompleted: status === 'COMPLETED',
              approvalStatus: status === 'COMPLETED' ? 'APPROVED' : 'PENDING',
              completedAt: status === 'COMPLETED' ? completedDate : null
            },
            {
              title: 'Kalite Kontrol ve Teslimat',
              order: 3,
              isCompleted: status === 'COMPLETED',
              approvalStatus: status === 'COMPLETED' ? 'APPROVED' : 'PENDING',
              completedAt: status === 'COMPLETED' ? completedDate : null
            }
          ]
        }
      }
    })

    // Tamamlanmış işler için maliyetler ekle (Grafikler dolsun)
    if (status === 'COMPLETED') {
      await prisma.costTracking.create({
        data: {
          jobId: job.id,
          amount: 500 + Math.random() * 1500,
          category: 'TRANSPORTATION',
          description: 'Lojistik masrafları',
          status: 'APPROVED',
          createdById: teamLead.id,
          approvedById: manager.id
        }
      })
      await prisma.costTracking.create({
        data: {
          jobId: job.id,
          amount: 200 + Math.random() * 500,
          category: 'EQUIPMENT',
          description: 'Sarf malzemeler',
          status: 'APPROVED',
          createdById: teamLead.id,
          approvedById: manager.id
        }
      })
    }

    console.log(`✅ İş eklendi: ${job.title} (${status})`)
  }

  console.log('✨ Tüm veriler başarıyla yüklendi!')
}

generateMockData()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
