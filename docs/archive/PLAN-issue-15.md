e# Plan: Gelişmiş Planlama İyileştirmeleri (Issue #15)

Bu plan, "Gelişmiş Planlama" altındaki "Zeka (Tahminleme)" bölümündeki çeviri hatalarını gidermeyi ve kullanıcı deneyimini artırmak için açıklamalar eklemeyi hedefler.

## 1. Hedefler
- "Admin.samples" gibi hatalı çeviri anahtarlarını düzeltmek.
- Tahminleme ekranına, verilerin nasıl hesaplandığına dair açıklayıcı metinler eklemek.
- UI bileşenini daha anlaşılır ve görsel olarak zengin hale getirmek.

## 2. Teknik Değişiklikler

### A. Çeviri Dosyaları (`src/messages/tr.json`, `src/messages/en.json`)
- `Admin` objesi altına eksik olan anahtarlar eklenecek:
    - `forecastingTitle`: Zeka & Tahminleme
    - `forecastingSubtitle`: Tamamlanan iş verilerine dayalı akıllı süre tahminleri.
    - `avgDuration`: Ortalama Süre
    - `samples`: örnek veri
    - `noData`: Tahminleme için henüz yeterli veri toplanmadı.
    - `intelligenceDesc`: Bu bölüm, geçmişte tamamlanan benzer başlıklı işlerin sürelerini analiz ederek gelecekteki planlamalarınız için öngörü sağlar.

### B. UI Bileşeni (`src/components/admin/forecasting-view.tsx`)
- Bileşene bir başlık ve açıklama bölümü eklenecek.
- Kartlardaki "Admin.samples" hatası giderilecek (çeviri anahtarları doğru şekilde bağlanacak).
- Görsel iyileştirmeler (ikonlar, renkler, boş durum yönetimi) yapılacak.

## 3. Uygulama Adımları
1. **Araştırma:** Mevcut `ForecastingView` bileşeni ve çeviri dosyaları incelendi.
2. **Geliştirme (Çeviri):** `tr.json` ve `en.json` dosyaları güncellenecek.
3. **Geliştirme (UI):** `forecasting-view.tsx` dosyası zenginleştirilecek.
4. **Doğrulama:** Gantt ekranındaki Tahminleme sekmesi kontrol edilecek.

## 4. Kullanılacak Agentlar (Phase 2)
- `backend-specialist`: Çeviri dosyalarının ve API entegrasyonunun kontrolü.
- `frontend-specialist`: UI iyileştirmeleri ve açıklama metinlerinin eklenmesi.
- `test-engineer`: Çevirilerin ve UI'ın doğrulanması.
