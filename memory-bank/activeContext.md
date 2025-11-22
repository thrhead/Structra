# Aktif Bağlam

## Şu Anda Üzerinde Çalışılan

### Mevcut Durum

- Proje temel yapısı ve ana özellikler tamamlandı.
- Worker checklist sistemi geliştirildi (bloklama özelliği eklendi).
- Bildirim sistemi aktif (polling ile).
- Müşteri paneli ve yönetici raporları sayfası oluşturuldu.
- Teknik stack: Next.js + PostgreSQL (SQLite dev) + Prisma + NextAuth.js

### Son Değişiklikler

- `progress.md` güncellendi ve mevcut durum yansıtıldı.
- Worker checklist sayfasına görev bloklama özelliği eklendi.
- Yönetici raporları sayfası (`app/manager/reports/page.tsx`) gerçek verilerle güncellendi.
- Bildirim sistemi ve müşteri paneli kontrol edildi.

## Sonraki Adımlar

### Hemen Yapılacaklar

1. Cost tracking (maliyet takibi) modülünün geliştirilmesi.
2. Kullanıcı deneyimi iyileştirmeleri (loading states, error handling).
3. Detaylı testler (manuel ve otomatik).

### Kısa Vadeli (Bu Sprint)

1. Kullanıcı giriş sistemi
2. Basit dashboard sayfaları
3. Database kurulumu
4. Temel API endpoints

### Orta Vadeli

1. Montaj takip sistemi
2. Checklist fonksiyonalitesi
3. Bildirim sistemi
4. Müşteri paneli

## Aktif Kararlar ve Düşünceler

### Teknoloji Seçimleri

**Next.js vs Ayrı Backend**

- Karar: Next.js (full-stack framework)
- Sebep: Tek projede hem frontend hem backend, hızlı development
- Alternatif: İleride trafik artarsa backend'i ayırma seçeneği

**Database Seçimi**

- Karar: PostgreSQL + Prisma
- Sebep: Güçlü ilişkisel veri modeli, type-safety
- Alternatif: Supabase (hosted PostgreSQL + auth)

**Authentication**

- Karar: NextAuth.js
- Sebep: Next.js ile entegrasyon, çok sayıda provider desteği
- Alternatif: Supabase Auth (eğer Supabase kullanırsak)

**UI Framework**

- Karar: TailwindCSS + shadcn/ui
- Sebep: Modern, özelleştirilebilir, best practices
- Alternatif: MUI, Chakra UI

### Mimari Kararlar

**Rol Yapısı**

- Admin: Tüm yetkiler, sistem yönetimi
- Manager: Ekip yönetimi, raporlama, onaylar
- Team Lead: Günlük iş yönetimi, ekip takibi
- Worker: Sadece kendi işlerini görür ve günceller
- Customer: Sadece kendi montajlarını görür

**Database Schema Yaklaşımı**

- Modüler tablo yapısı
- Flexibility için JSONB alanlar (ileride özelleştirme)
- Soft delete (silme yerine arşivleme)
- Audit trail (kim ne zaman değiştirdi)

**Bildirim Mekanizması**

- İlk aşama: Basit database-based notifications
- İleride: Real-time WebSocket veya Supabase Realtime
- Push notifications: PWA ile

### UI/UX Tercihleri

**Dashboard Layout**

- Sidebar navigation
- Top bar (user menu, notifications)
- Main content area
- Responsive (mobile hamburger menu)

**Renk Şeması**

- Professional ve clean design
- Durum renkleri:
  - Bekliyor: Turuncu
  - Devam Ediyor: Mavi
  - Tamamlandı: Yeşil
  - İptal: Kırmızı

**Grafik Stilleri**

- Recharts kütüphanesi
- Bar charts (iş sayıları)
- Line charts (zaman bazlı ilerlemeler)
- Pie charts (durum dağılımı)

## Önemli Desenler ve Tercihler

### Code Organization

- Feature-based folder structure
- Shared components ayrı klasör
- API routes domain bazlı gruplandırma

### Naming Conventions

- camelCase: Değişkenler ve fonksiyonlar
- PascalCase: Componentler ve tipler
- kebab-case: Dosya isimleri
- UPPER_CASE: Sabitler

### TypeScript Kullanımı

- Strict mode enabled
- Interface'ler tipler için
- Zod ile runtime validation
- Prisma generate ile DB tipleri

### Form Handling

- React Hook Form + Zod
- Controlled components
- Inline validation
- User-friendly error messages

## Öğrenimler ve Proje İçgörüleri

### Kullanıcı İhtiyaçları

- Basitlik ve hız çok önemli (montaj ekipleri sahada)
- Mobil kullanım öncelikli
- Offline çalışma ileride kritik olabilir
- Bildirimler gerçek zamanlı olmalı

### Teknik Zorluklar (Öngörülen)

1. Real-time notifications
2. Mobil performans
3. Database query optimization (çok sayıda ilişki)
4. Role-based access control complexity

### Risk Alanları

1. Scalability: Çok sayıda kullanıcı ve iş olduğunda
2. Data consistency: Concurrent updates
3. Security: Rollerin doğru uygulanması
4. Mobile performance: Büyük listeler ve grafikler

### Best Practices

- Server Components kullanımı (SEO ve performance)
- API rate limiting
- Input sanitization
- Error logging
- Regular database backups
- Security audits

## Gelecek İçin Notlar

### MVP Sonrası Özellikler

- Fotoğraf yükleme (AWS S3 veya Cloudinary)
- PDF rapor oluşturma
- Email notifications
- SMS bildirimleri
- Gelişmiş raporlama ve analytics
- Multi-tenant support (farklı fabrikalar)
- Mobile app (React Native)

### Optimizasyon Alanları

- Database indexing
- Redis caching
- CDN kullanımı
- Image optimization
- Lazy loading
- Code splitting

### İzlenecek Metrikler

- Page load times
- API response times
- Database query times
- User engagement
- Error rates
- Mobile vs desktop kullanım
