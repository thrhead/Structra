# Plan: Web Uygulaması Dashboard Güncellemesi (Stitch v2)

## Sorun Analizi / Hedef
Mevcut `ModernDashboardView.tsx` bileşeni, Stitch'ten gelen yeni "Güncellenmiş Raporlar ve Analiz Dashboard" tasarımına göre modernize edilecektir. Yeni tasarım daha fazla KPI kartı, geliştirilmiş grafik yerleşimleri ve zenginleştirilmiş bir müşteri tablosu içermektedir.

## Çözüm Stratejisi
1. **Bileşen Güncellemesi:** `src/components/admin/reports/ModernDashboardView.tsx` dosyası, yeni HTML yapısı ve Tailwind sınıfları ile yeniden yapılandırılacak.
2. **Veri Eşleme (Mapping):** Yeni eklenen KPI alanları (Örn: Personel, Bütçe vb.) projedeki mevcut `data` nesnesi ile eşleştirilecek.
3. **Grafik Entegrasyonu:** Recharts bileşenleri (WeeklyStepsChart vb.), yeni tasarımın "Sistem Nabzı" ve "Görüşmeler" alanlarına uyarlanacak.
4. **Tablo Genişletme:** Müşteri tablosu, yeni tasarımdaki sütun yapısına (Kâr, Marj, Durum vb.) göre güncellenecek.

## Uygulama Adımları

### 1. Aşama: Altyapı ve Veri Hazırlığı (project-planner)
- Yeni tasarımdaki KPI'ların projedeki `generalStats` içindeki karşılıklarını doğrula.
- Gerekirse `src/lib/data/reports.ts` içindeki veri çekme mantığını yeni alanları destekleyecek şekilde kontrol et.

### 2. Aşama: UI Implementasyonu (frontend-specialist)
- `ModernDashboardView.tsx` dosyasını yeni HTML yapısına göre güncelle.
- 3'lü KPI yapısını 4'lü yapıya çıkar.
- "Sistem Nabzı" alanı için `WeeklyStepsChart`'ı entegre et.
- Müşteri tablosunu yeni tasarım stiliyle (border-radius, hover efektleri, badge'ler) yenile.

### 3. Aşama: Optimizasyon ve Kontrol (performance-optimizer)
- Yeni eklenen görsel efektlerin (blur, backdrop, shadow) performans etkisini kontrol et.
- Mobil uyumluluğu (Responsive) yeni 4'lü ızgara yapısına göre test et.

### 4. Aşama: Doğrulama (test-engineer)
- Sayfanın hatasız yüklendiğini (Hydration check) doğrula.
- Filtrelerin yeni tasarımdaki verileri doğru güncellediğini test et.

## Teslimatlar
- Güncellenmiş `ModernDashboardView.tsx`
- Performans ve UX iyileştirmeleri
- Doğrulanmış veri entegrasyonu
