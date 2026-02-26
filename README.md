# Structra - Assembly & Field Service Tracker

Structra, saha montaj ve servis ekiplerini uçtan uca takip etmek için geliştirilmiş kapsamlı bir iş yönetim platformudur. Web tabanlı yönetim paneli ve yerel mobil uygulaması ile fabrika dışı operasyonların şeffaflığını artırır.

## 🚀 Öne Çıkan Özellikler

- **Çoklu Rol Yönetimi**: Admin, Yönetici, Ekip Lideri, Çalışan ve Müşteri rolleri.
- **İnteraktif İş Takibi**: Adım ve alt adım bazlı checklist, zaman takibi (Başlangıç/Bitiş).
- **Mobil Odaklılık**: Expo tabanlı, çevrimdışı çalışma desteği sunan yerel uygulama.
- **Maliyet ve Onay**: Harcama takibi ve yönetici onay mekanizması.
- **Gerçek Zamanlı Bildirimler**: Socket.IO ile anlık durum güncellemeleri.
- **Görsel Dokümantasyon**: İş adımlarına fotoğraf yükleme ve galeri yönetimi.
- **Raporlama**: Ekip performansı, maliyet analizi ve PDF/Excel rapor export.

## 🛠️ Teknik Stack

### Web & API
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TailwindCSS, shadcn/ui
- **ORM**: Prisma (PostgreSQL)
- **Auth**: NextAuth.js
- **Real-time**: Socket.IO

### Mobil
- **Platform**: React Native (Expo SDK 51)
- **Storage**: AsyncStorage (Offline Sync)
- **Maps**: Native Map Integration

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL Veritabanı

### Adımlar

1. **Repoyu Klonlayın**:
   ```bash
   git clone https://github.com/thrhead/Structra.git
   cd Structra
   ```

2. **Bağımlılıkları Kurun**:
   ```bash
   npm install
   cd apps/mobile && npm install
   ```

3. **Veritabanı Kurulumu**:
   `.env` dosyasını oluşturun ve `DATABASE_URL` bilgisini girin.
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Uygulamayı Başlatın**:
   - Web: `npm run dev`
   - Mobil: `cd apps/mobile && npx expo start`

## 🏗️ Mimari ve Dokümantasyon

Projenin teknik detayları, mimari kararları ve ilerleme durumu için `memory-bank` klasörüne göz atabilirsiniz:
- `memory-bank/systemPatterns.md`: Mimaride kullanılan desenler.
- `memory-bank/techContext.md`: Teknik bağımlılıklar ve kurulum detayları.
- `memory-bank/activeContext.md`: Güncel çalışma odağı ve son kararlar.

---
*Bu proje modern yazılım mühendisliği prensipleri ve yüksek performans hedefleriyle geliştirilmiştir.*
