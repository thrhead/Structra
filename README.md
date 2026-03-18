# Structra - Saha Operasyonları ve Montaj Takip Platformu

Structra, saha ekiplerini yöneten işletmeler için tasarlanmış, uçtan uca izlenebilirlik sağlayan modern bir iş yönetim çözümüdür. Fabrika dışındaki montaj, servis ve bakım süreçlerini dijitalleştirerek verimliliği artırır ve maliyet kontrolü sağlar.

---

## 🌟 Öne Çıkan Özellikler

### 🛡️ Çok Katmanlı Yönetim
- **Admin**: Sistem genelinde kullanıcı, müşteri ve log yönetimi.
- **Manager**: İş planlama, ekip atama ve tamamlanan işlerin onayı.
- **Worker**: Saha checklist'leri, fotoğraf yükleme ve masraf girişi.
- **Customer**: İş ilerlemesini izleme, tahmini bitiş tarihi ve servis raporları.

### 👷 Saha Odaklı Mobil Deneyim
- **Çevrimdışı (Offline) Mod**: İnternet bağlantısı koptuğunda veri girişine devam etme ve otomatik senkronizasyon.
- **Dijital Kanıt**: Her iş adımı için fotoğraf yükleme ve konuma dayalı doğrulama.
- **Zaman Takibi**: Her alt görev için net başlama ve bitiş saatleri.

### 📊 Akıllı Analiz ve Raporlama
- **Ekip Performansı**: Ekiplerin iş tamamlama süreleri ve verimlilik grafikleri.
- **Maliyet Kontrolü**: Saha harcamalarının anlık takibi ve bütçe analizi.
- **Dökümantasyon**: Tek tıkla profesyonel PDF servis raporları ve Excel veri çıktıları.

## 🚀 Teknik Mimari

Structra, 2026 standartlarına uygun yüksek performanslı bir teknoloji yığını ile inşa edilmiştir:

- **Frontend**: Next.js 14 (App Router) & React 18
- **Mobile**: React Native & Expo (Cross-platform)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO ile anlık bildirim sistemi
- **Optimizasyon**: `next/image` optimizasyonu ve veritabanı indekslemesi ile yüksek hız
- **Güvenlik**: NextAuth.js v4 & Rol bazlı erişim kontrolü (RBAC)

## 📦 Hızlı Başlangıç

### 1. Kurulum
```bash
# Repoyu çekin
git clone https://github.com/thrhead/Structra.git
cd Structra

# Bağımlılıkları yükleyin
npm install
cd apps/mobile && npm install
```

### 2. Veritabanı ve Ortam Değişkenleri
Ana dizinde bir `.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Veritabanını hazırlayın:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Uygulamayı Çalıştırma
- **Web Paneli**: `npm run dev`
- **Mobil Uygulama**: `cd apps/mobile && npx expo start`

## 📖 Dokümantasyon

Proje hakkında daha detaylı teknik bilgi ve mimari kararlar için `memory-bank` klasörünü inceleyebilirsiniz:
- [Sistem Desenleri](memory-bank/systemPatterns.md)
- [Teknik Detaylar](memory-bank/techContext.md)
- [Proje İlerlemesi](memory-bank/progress.md)

---
*Geleceğin saha operasyonlarını bugün Structra ile yönetin.*

<!-- Trigger Vercel Build -->