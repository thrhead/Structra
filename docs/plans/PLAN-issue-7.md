# 🛠️ Issue #7: Filtreleme Butonu ve ID Arama İyileştirme Planı

Bu plan, web uygulamasındaki filtreleme butonunun responsive sorunlarını gidermeyi ve hem web hem mobil tarafta ID bazlı aramayı iyileştirmeyi hedefler.

## 1. Web: Responsive Filtreleme Paneli (Frontend Specialist)
- **Sorun:** Mevcut `Popover` tabanlı `AdvancedFilter` bileşeni küçük ekranlarda taşma yapıyor ve kullanımı zor.
- **Çözüm:**
    - Mobilde `Popover` yerine `Sheet` (Drawer) bileşenine geçiş yap.
    - Filtre içeriğini dikey (stack) yapıda düzenle.
    - Takvim (Calendar) bileşenini mobilde daha kompakt hale getir veya modal içinde aç.
    - Aktif filtreleri liste başında "Badge" olarak göster.

## 2. Web & Mobil: ID Bazlı Arama (Backend & Mobile Developer)
- **Sorun:** İş ID (job ID) ve İş Emri ID (jobNo) ile doğrudan arama yapılamıyor.
- **Çözüm (Web):**
    - `AdvancedFilter` içine "İş No / ID" arama alanı ekle.
    - `getJobs` (Prisma) sorgusuna Job ID ve JobNo için tam eşleşme (exact match) önceliği ekle.
- **Çözüm (Mobil):**
    - `useJobFiltering.js` hook'unu Job ID ve JobNo'yu içerecek şekilde güncelle.
    - Arama çubuğuna ID araması yapılabileceğine dair ipucu (placeholder) ekle.

## 3. Doğrulama (Test Engineer)
- **Web:** Farklı ekran boyutlarında (iPhone, Tablet, Masaüstü) filtreleme panelini test et.
- **Mobil:** Job ID ve JobNo ile arama yaparak sonuçları doğrula.

---
**Onay Bekleniyor:** Bu planı onaylıyor musunuz? (Y/N)
