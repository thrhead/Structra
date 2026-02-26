# 📊 Veritabanı ve Sorgu Optimizasyon Planı

Bu plan, Structra platformunun veritabanı performansını artırmak, N+1 sorunlarını çözmek ve ölçeklenebilirliği sağlamak için hazırlanan stratejileri kapsar.

## 1. Analiz ve Hazırlık
- **Agent:** project-planner / database-architect
- [x] Mevcut sorgu performanslarının baz çizgisini (baseline) belirle.
- [x] Prisma Query Loglarını aktif ederek darboğazları doğrula.

## 2. Gelişmiş İndeksleme Stratejisi (Database Architect)
- **Hedef:** Filtreleme ve sıralama işlemlerini hızlandırmak.
- [x] `Job` tablosuna bileşik indeks eklendi: `@@index([customerId, status, scheduledDate])`
- [x] `CostTracking` tablosuna bileşik indeks eklendi: `@@index([jobId, status])`
- [x] `SystemLog` tablosuna optimize edilmiş indeksler eklendi: `@@index([level, createdAt])`, `@@index([platform, createdAt])`, `@@index([userId, createdAt])`

## 3. N+1 Sorgu Çözünürlüğü (Backend Specialist)
- **Hedef:** Veritabanı tur sayısını (round-trip) azaltmak.
- [x] `src/lib/data/jobs.ts` içindeki `getJobs` fonksiyonu `include` yerine `select` kullanacak şekilde refaktör edildi.
- [x] Gereksiz derin ilişkili veri çekme işlemleri temizlendi.

## 4. Çok Katmanlı Önbellekleme (Backend Specialist)
- **Hedef:** Tekrarlayan veritabanı yükünü minimize etmek.
- [x] `src/lib/data/reports.ts` içindeki ağır rapor sorgularına (getReportStats, getCostBreakdown, getWeeklyCompletedSteps vb.) Next.js `unstable_cache` entegre edildi.
- [x] Cache etiketleri (tags) ve revalidate süreleri (300-600s) optimize edildi.

## 5. Veri Yönetimi ve Bölümleme (Database Architect)
- **Hedef:** Tablo boyutlarını kontrol altında tutmak.
- [x] `src/lib/data/cleanup.ts` oluşturuldu: 30 günlük "Retention Policy" ve otomatik temizleme fonksiyonu eklendi.
- [x] Veritabanı büyüme stratejisi belirlendi.

## 6. Doğrulama ve QA (Test Engineer)
- [x] Optimizasyon sonrası Prisma Client üretildi (`npx prisma generate`).
- [x] Tüm sistem testleri başarıyla tamamlandı (`npm run test`).
- [x] Regresyon testleri ile önbellekleme katmanının doğruluğu onaylandı.

---
**Durum:** ✅ **TAMAMLANDI** (26 Şubat 2026)
