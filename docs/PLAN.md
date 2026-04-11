# 📋 STRUCTRA - Mobile Worker Job Steps Modernization Plan

## 1. Genel Bakış
Saha çalışanlarının mobil uygulamadaki "İş Detayı" ekranında gördüğü İş Emirleri (Steps) ve Alt İş Emirleri (SubSteps) yapısı daha modern, basit ve kullanıcı dostu (user-friendly) hale getirilecektir. Çoklu-Ajan (Orchestration) iş akışı takip edilecektir.

## 2. Etkilenecek Dosyalar
- `apps/mobile/src/components/job-detail/StepItem.js`
- `apps/mobile/src/components/job-detail/SubStepItem.js`

## 3. Tasarım ve UX Kararları
1. **Görsel Sadeleştirme (Minimalizm):**
   - Karmaşık kenarlıklar ve ağır "GlassCard" görünümleri yerine, daha modern, düz (flat) veya çok hafif gölgeli (soft shadow) kart yapıları kullanılacak.
   - İç içe geçmiş kutu görünümü azaltılarak daha akıcı bir okuma hiyerarşisi sağlanacak.
2. **Tipografi ve Hiyerarşi:**
   - Adım numaraları (Step No) daha belirgin ve şık bir yuvarlak rozet (badge) veya vurgulu metin içine alınacak.
   - Tamamlanan işlerin üstü çizilmesi yerine daha zarif bir grileşme (opacity) veya yeşil tık vurgusu ile gösterilecek.
3. **Etkileşim (Touch & Feel):**
   - Onay kutuları (Checkbox) daha büyük, dokunmatik dostu ve yuvarlak hatlı olacak.
   - "Fotoğraf Ekle" butonu daha belirgin ve modern bir ikon+metin düğmesi şeklinde tasarlanacak.
   - Yönetici onay/red butonları daha kibar ve modern olacak.
4. **Alt Adımlar (Substeps) Yerleşimi:**
   - Alt adımlar, ana adıma sol taraftan dikey bir çizgi (timeline/stepper görünümü) ile bağlanarak görsel olarak ilişkilendirilecek.

## 4. Uygulama Aşamaları (Faz 2 - Paralel İşlem)

### Ajan 1: `frontend-specialist` (Arayüz ve Tasarım)
- `StepItem.js` ve `SubStepItem.js` dosyalarını yeni tasarım diliyle baştan kodlayacak.
- CSS/StyleSheet kurallarını sadeleştirecek ve mobil uyumlu, geniş dokunmatik alanlara sahip (touch-friendly) hale getirecek.

### Ajan 2: `test-engineer` (Doğrulama)
- Yapılan UI değişikliklerinin işleyişi (onaylama, reddetme, fotoğraf yükleme) bozup bozmadığını test standartlarında kontrol edecek.

### Ajan 3: `performance-optimizer` (Performans)
- FlatList ve React.memo yapılarını koruyarak veya iyileştirerek ekranın akıcılığını (60fps) sağlayacak.

---
*Onaylandıktan sonra implementasyon (kodlama) fazına geçilecektir.*