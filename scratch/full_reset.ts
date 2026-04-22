import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

// Cloudinary Configuration (Reading from env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function extractPublicId(url: string): string | null {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    return null
  }
}

async function fullReset() {
  console.log('🚀 Süper Sıfırlama İşlemi Başlatıldı...')

  try {
    // 1. CLOUDINARY FOTOĞRAFLARINI SİL
    console.log('📸 Fotoğraflar Cloudinary\'den siliniyor...')
    const photos = await prisma.stepPhoto.findMany({ select: { url: true } })
    
    let deletedCount = 0
    for (const photo of photos) {
      const publicId = extractPublicId(photo.url)
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
        deletedCount++
        if (deletedCount % 10 === 0) console.log(`   - ${deletedCount} fotoğraf silindi...`)
      }
    }
    console.log(`✅ Toplam ${deletedCount} fotoğraf Cloudinary'den temizlendi.`)

    // 2. VERİTABANI TABLOLARINI SİL (Sıralı)
    console.log('💾 Veritabanı tabloları boşaltılıyor...')

    // Bağımlı tablolar (Leaf nodes)
    await prisma.webhookLog.deleteMany({})
    await prisma.webhook.deleteMany({})
    await prisma.integrationLog.deleteMany({})
    await prisma.apiKey.deleteMany({})
    await prisma.message.deleteMany({})
    await prisma.conversation.deleteMany({})
    await prisma.stepPhoto.deleteMany({})
    await prisma.jobSubStep.deleteMany({})
    await prisma.jobStep.deleteMany({})
    await prisma.jobAssignment.deleteMany({})
    await prisma.approval.deleteMany({})
    await prisma.costTracking.deleteMany({})
    
    // Orta seviye tablolar
    await prisma.job.deleteMany({})
    await prisma.templateSubStep.deleteMany({})
    await prisma.templateStep.deleteMany({})
    await prisma.jobTemplate.deleteMany({})
    await prisma.notification.deleteMany({})
    await prisma.pushToken.deleteMany({})
    await prisma.teamMember.deleteMany({})
    await prisma.team.deleteMany({})
    await prisma.customer.deleteMany({})
    
    // Temel tablo (Root node)
    await prisma.user.deleteMany({})
    await prisma.systemLog.deleteMany({})

    console.log('✅ Veritabanı tamamen boşaltıldı.')
    console.log('✨ İşlem Başarıyla Tamamlandı. Sistem şu an tertemiz.')

  } catch (error) {
    console.error('❌ HATA:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fullReset()
