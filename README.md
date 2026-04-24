# Structra v3.0 - Kurumsal Saha Operasyon Yönetimi

Structra, saha ekiplerini yöneten işletmeler için tasarlanmış, **v3.0** sürümüyle yüksek performanslı ve uçtan uca izlenebilirlik sağlayan modern bir iş yönetim çözümüdür. 2026 standartlarına uygun olarak optimize edilen sistem, saha montaj ve bakım süreçlerini milisaniyeler düzeyinde bir hızla dijitalleştirir.

---

## 🚀 Proje Durumu: v3.0.0 (Kararlı)

- **Web Paneli (v3.0.0)**: Lighthouse performansı 90+, Next.js 14 App Router mimarisi.
- **Mobil Uygulama (v2.6.0)**: Expo SDK 51, gelişmiş RAM yönetimi ve kesintisiz çevrimdışı (offline) çalışma desteği.
- **Veri Altyapısı**: 15+ kritik veritabanı indeksi ile optimize edilmiş PostgreSQL & Prisma katmanı.

---

## 🌟 Öne Çıkan Özellikler

### 🛡️ Çok Katmanlı Rol Yönetimi (RBAC)
- **Admin**: Kullanıcı, müşteri, sistem logları ve güvenlik yönetimi.
- **Yönetici (Manager)**: Dinamik iş planlama, ekip atama ve hiyerarşik onay süreçleri.
- **Saha Personeli (Worker)**: Büyük butonlu "Field-First" UI, fotoğraf kanıtlı checklist'ler ve masraf girişi.
- **Müşteri (Customer)**: Gerçek zamanlı ilerleme takibi ve şeffaf servis raporları portalı.

### 👷 Saha Dayanıklılığı ve Dijital Kanıt
- **Resilient Offline Sync**: İnternet bağlantısı koptuğunda verileri kuyruğa alır ve bağlantı geldiğinde otomatik senkronize eder.
- **Görsel Doğrulama**: Her iş adımı için zorunlu fotoğraf yükleme ve GPS konumu doğrulaması.
- **Hızlı Performans**: Görsellerin `next/image` ile otomatik WebP optimizasyonu ve lazy-load yüklenmesi.

### 📊 Akıllı Analiz ve Verimlilik
- **Maliyet Kontrolü**: Saha harcamalarının anlık takibi ve bütçe sapma analizleri.
- **Otomatik Raporlama**: Tek tıkla PDF servis raporları ve kurumsal Excel çıktıları.
- **Real-time Bildirimler**: Socket.IO ile iş durumu değişikliklerinin anlık iletilmesi.

## 🛠️ Teknik Mimari

Structra, modern teknolojilerin en verimli kombinasyonuyla inşa edilmiştir:

- **Frontend**: Next.js 14 (App Router) & TailwindCSS + shadcn/ui.
- **Mobile**: React Native & Expo (Cross-platform).
- **Backend**: Node.js API Routes & Socket.IO.
- **Veri**: PostgreSQL + Prisma ORM (Optimized Indexing).
- **Güvenlik**: NextAuth.js v4 & JWT tabanlı yetkilendirme.

## 📦 Kurulum ve Başlangıç

### 1. Hazırlık
```bash
git clone https://github.com/thrhead/Structra.git
cd Structra
npm install
cd apps/mobile && npm install
```

### 2. Ortam Değişkenleri (.env)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="custom-secret"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 3. Çalıştırma
- **Web**: `npm run dev`
- **Mobil**: `npx expo start` (apps/mobile dizininde)

## 📖 Dokümantasyon Merkezi

- [Sistem Mimari ve Desenleri](memory-bank/systemPatterns.md)
- [Teknik Detaylar](memory-bank/techContext.md)
- [Proje Yol Haritası](memory-bank/progress.md)
- [API Dokümantasyonu](docs/API_REFERENCE.md)
- [Kullanıcı Kılavuzları](docs/guides/README.md)

---
*Geleceğin saha operasyonlarını bugün Structra ile yönetin.*